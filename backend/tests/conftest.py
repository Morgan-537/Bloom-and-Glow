import pytest

from app import create_app
from app.config import TestConfig
from app.extensions import db as _db


@pytest.fixture()
def app():
    app = create_app(TestConfig)
    with app.app_context():
        _db.create_all()
        yield app
        _db.session.remove()
        _db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def db(app):
    return _db


def register_and_login(client, name="Test User", email="test@example.com", password="password123"):
    client.post("/api/auth/register", json={"name": name, "email": email, "password": password})
    res = client.post("/api/auth/login", json={"email": email, "password": password})
    return res.get_json()["token"], res.get_json()["user"]


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}
