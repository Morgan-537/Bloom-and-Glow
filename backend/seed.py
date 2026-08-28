"""
One-time setup: creates all tables, then (optionally) imports the existing
mock data from ../db.json so the real backend starts with the same users
and products the json-server mock had — including the two seeded test
accounts (admin@bloomandglow.com / jane@example.com) the README documents.

Usage (from backend/, with .env configured and the venv active):
    python seed.py            # create tables + import db.json if present
    python seed.py --fresh    # drop all tables first, then recreate + import

Safe to re-run: existing users/products (matched by email / id) are skipped,
not duplicated.
"""

import json
import os
import sys

from dotenv import load_dotenv

load_dotenv()

from app import create_app  # noqa: E402
from app.extensions import db  # noqa: E402
from app.models.product import Product, status_for_stock  # noqa: E402
from app.models.user import User  # noqa: E402

DB_JSON_PATH = os.path.join(os.path.dirname(__file__), "..", "db.json")


def import_db_json(app):
    if not os.path.exists(DB_JSON_PATH):
        print(f"No db.json found at {DB_JSON_PATH} — skipping data import (tables are still created).")
        return

    with open(DB_JSON_PATH) as f:
        data = json.load(f)

    imported_users = 0
    for raw in data.get("users", []):
        email = raw["email"].strip().lower()
        if User.query.filter_by(email=email).first():
            continue
        user = User(
            id=raw.get("id"),
            name=raw["name"],
            email=email,
            role=raw.get("role", "customer"),
            disabled=bool(raw.get("disabled", False)),
        )
        # db.json stored plain-text passwords (fine for a mock backend, never
        # for a real one) — hash them properly on the way in.
        user.set_password(raw["password"])
        db.session.add(user)
        imported_users += 1

    imported_products = 0
    for raw in data.get("products", []):
        if Product.query.get(raw.get("id")):
            continue
        stock = int(raw.get("stock", 0))
        product = Product(
            id=raw.get("id"),
            name=raw["name"],
            category=raw.get("category", "Skincare"),
            price=raw.get("price", 0),
            stock=stock,
            status=status_for_stock(stock),
            image=raw.get("image"),
            description=raw.get("description"),
        )
        db.session.add(product)
        imported_products += 1

    db.session.commit()
    print(f"Imported {imported_users} user(s) and {imported_products} product(s) from db.json.")


def main():
    app = create_app()
    with app.app_context():
        if "--fresh" in sys.argv:
            print("Dropping all tables...")
            db.drop_all()

        print("Creating tables...")
        db.create_all()

        import_db_json(app)
        print("Done.")


if __name__ == "__main__":
    main()
