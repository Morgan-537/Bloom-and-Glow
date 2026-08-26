from tests.conftest import auth_headers, register_and_login
from tests.test_products import make_admin


def create_product(client, token, stock=42):
    return client.post(
        "/api/products",
        json={"name": "Rose Serum", "category": "Skincare", "price": 24, "stock": stock},
        headers=auth_headers(token),
    ).get_json()


def sample_order_payload(product):
    return {
        "items": [{"id": product["id"], "name": product["name"], "price": product["price"], "quantity": 2}],
        "subtotal": 48,
        "deliveryFee": 5,
        "total": 53,
        "deliveryAddress": {
            "fullName": "Jane Doe",
            "streetAddress": "123 Main St",
            "city": "Nairobi",
            "postalCode": "00100",
        },
        "billingInfo": {"nameOnCard": "Jane Doe", "cardNumber": "4111111111111111", "expiry": "12/28", "cvv": "123"},
    }


def test_place_order_requires_auth(client):
    res = client.post("/api/orders", json={})
    assert res.status_code == 401


def test_place_order_success_and_masks_card(client, db):
    admin_token = make_admin(client, db)
    product = create_product(client, admin_token)

    customer_token, _ = register_and_login(client, email="jane@example.com")
    res = client.post(
        "/api/orders", json=sample_order_payload(product), headers=auth_headers(customer_token)
    )
    assert res.status_code == 201
    order = res.get_json()
    assert order["status"] == "Processing"
    assert order["billing"]["cardLast4"] == "1111"
    assert "cardNumber" not in order["billing"]
    assert order["items"][0]["quantity"] == 2


def test_place_order_decrements_stock(client, db):
    admin_token = make_admin(client, db)
    product = create_product(client, admin_token, stock=10)

    customer_token, _ = register_and_login(client, email="jane@example.com")
    client.post("/api/orders", json=sample_order_payload(product), headers=auth_headers(customer_token))

    updated = client.get("/api/products").get_json()[0]
    assert updated["stock"] == 8  # 10 - quantity(2)


def test_customer_only_sees_own_orders(client, db):
    admin_token = make_admin(client, db)
    product = create_product(client, admin_token)

    jane_token, _ = register_and_login(client, email="jane@example.com")
    client.post("/api/orders", json=sample_order_payload(product), headers=auth_headers(jane_token))

    kim_token, _ = register_and_login(client, email="kim@example.com")
    kim_orders = client.get("/api/orders", headers=auth_headers(kim_token)).get_json()
    assert kim_orders == []

    jane_orders = client.get("/api/orders", headers=auth_headers(jane_token)).get_json()
    assert len(jane_orders) == 1


def test_admin_sees_all_orders(client, db):
    admin_token = make_admin(client, db)
    product = create_product(client, admin_token)

    jane_token, _ = register_and_login(client, email="jane@example.com")
    client.post("/api/orders", json=sample_order_payload(product), headers=auth_headers(jane_token))

    admin_orders = client.get("/api/orders", headers=auth_headers(admin_token)).get_json()
    assert len(admin_orders) == 1


def test_update_order_status_requires_staff(client, db):
    admin_token = make_admin(client, db)
    product = create_product(client, admin_token)

    jane_token, _ = register_and_login(client, email="jane@example.com")
    order = client.post(
        "/api/orders", json=sample_order_payload(product), headers=auth_headers(jane_token)
    ).get_json()

    forbidden = client.patch(
        f"/api/orders/{order['id']}/status", json={"status": "Shipped"}, headers=auth_headers(jane_token)
    )
    assert forbidden.status_code == 403

    allowed = client.patch(
        f"/api/orders/{order['id']}/status", json={"status": "Shipped"}, headers=auth_headers(admin_token)
    )
    assert allowed.status_code == 200
    assert allowed.get_json()["status"] == "Shipped"
