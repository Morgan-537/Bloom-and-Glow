from tests.conftest import auth_headers, register_and_login


def make_admin(client, db, email="admin@example.com"):
    from app.models.user import User

    token, user = register_and_login(client, name="Admin", email=email, password="password123")
    db_user = User.query.filter_by(email=email).first()
    db_user.role = "admin"
    db.session.commit()
    # role is embedded in the JWT at login time, so log in again to get a
    # fresh token carrying the updated "admin" claim.
    res = client.post("/api/auth/login", json={"email": email, "password": "password123"})
    return res.get_json()["token"]


def test_list_products_is_public(client):
    res = client.get("/api/products")
    assert res.status_code == 200
    assert res.get_json() == []


def test_create_product_requires_admin(client):
    token, _ = register_and_login(client)  # plain customer
    res = client.post(
        "/api/products",
        json={"name": "Rose Serum", "category": "Skincare", "price": 24, "stock": 42},
        headers=auth_headers(token),
    )
    assert res.status_code == 403


def test_create_product_requires_auth(client):
    res = client.post(
        "/api/products", json={"name": "Rose Serum", "category": "Skincare", "price": 24, "stock": 42}
    )
    assert res.status_code == 401


def test_admin_can_create_product(client, db):
    token = make_admin(client, db)
    res = client.post(
        "/api/products",
        json={"name": "Rose Serum", "category": "Skincare", "price": 24, "stock": 42},
        headers=auth_headers(token),
    )
    assert res.status_code == 201
    body = res.get_json()
    assert body["name"] == "Rose Serum"
    assert body["status"] == "Active"


def test_product_status_reflects_stock_level(client, db):
    token = make_admin(client, db)

    out_of_stock = client.post(
        "/api/products",
        json={"name": "Lipstick", "category": "Makeup", "price": 12, "stock": 0},
        headers=auth_headers(token),
    ).get_json()
    assert out_of_stock["status"] == "Out of Stock"

    low_stock = client.post(
        "/api/products",
        json={"name": "Hair Oil", "category": "Haircare", "price": 15, "stock": 5},
        headers=auth_headers(token),
    ).get_json()
    assert low_stock["status"] == "Low Stock"


def test_admin_can_update_and_delete_product(client, db):
    token = make_admin(client, db)
    created = client.post(
        "/api/products",
        json={"name": "Rose Serum", "category": "Skincare", "price": 24, "stock": 42},
        headers=auth_headers(token),
    ).get_json()

    updated = client.patch(
        f"/api/products/{created['id']}", json={"price": 19.99}, headers=auth_headers(token)
    )
    assert updated.status_code == 200
    assert updated.get_json()["price"] == 19.99

    deleted = client.delete(f"/api/products/{created['id']}", headers=auth_headers(token))
    assert deleted.status_code == 204

    listing = client.get("/api/products")
    assert listing.get_json() == []
