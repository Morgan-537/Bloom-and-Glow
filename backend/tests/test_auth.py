from tests.conftest import auth_headers, register_and_login


def test_register_creates_user(client):
    res = client.post(
        "/api/auth/register",
        json={"name": "Jane Doe", "email": "jane@example.com", "password": "password123"},
    )
    assert res.status_code == 201
    body = res.get_json()
    assert body["user"]["email"] == "jane@example.com"
    assert body["user"]["role"] == "customer"
    assert "password" not in body["user"]
    assert body["token"]


def test_register_rejects_duplicate_email(client):
    client.post(
        "/api/auth/register",
        json={"name": "Jane Doe", "email": "jane@example.com", "password": "password123"},
    )
    res = client.post(
        "/api/auth/register",
        json={"name": "Someone Else", "email": "jane@example.com", "password": "otherpass"},
    )
    assert res.status_code == 409


def test_login_success(client):
    client.post(
        "/api/auth/register",
        json={"name": "Jane Doe", "email": "jane@example.com", "password": "password123"},
    )
    res = client.post("/api/auth/login", json={"email": "jane@example.com", "password": "password123"})
    assert res.status_code == 200
    assert res.get_json()["token"]


def test_login_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={"name": "Jane Doe", "email": "jane@example.com", "password": "password123"},
    )
    res = client.post("/api/auth/login", json={"email": "jane@example.com", "password": "wrong"})
    assert res.status_code == 401


def test_login_disabled_account_is_rejected(client, db):
    from app.models.user import User

    client.post(
        "/api/auth/register",
        json={"name": "Jane Doe", "email": "jane@example.com", "password": "password123"},
    )
    user = User.query.filter_by(email="jane@example.com").first()
    user.disabled = True
    db.session.commit()

    res = client.post("/api/auth/login", json={"email": "jane@example.com", "password": "password123"})
    assert res.status_code == 403


def test_me_requires_token(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401


def test_me_returns_current_user(client):
    token, user = register_and_login(client)
    res = client.get("/api/auth/me", headers=auth_headers(token))
    assert res.status_code == 200
    assert res.get_json()["user"]["email"] == user["email"]
