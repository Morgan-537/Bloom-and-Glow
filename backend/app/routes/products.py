from flask import Blueprint, jsonify, request

from app.decorators import role_required
from app.extensions import db
from app.models.product import Product, status_for_stock

bp = Blueprint("products", __name__, url_prefix="/api/products")


@bp.get("")
def list_products():
    # Public — browsing the shop doesn't require login.
    products = Product.query.order_by(Product.created_at.desc()).all()
    return jsonify([p.to_dict() for p in products]), 200


@bp.post("")
@role_required("admin")
def create_product():
    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    category = (body.get("category") or "").strip()
    if not name or not category:
        return jsonify({"error": "name and category are required"}), 400

    try:
        price = float(body.get("price", 0))
        stock = int(body.get("stock", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "price and stock must be numbers"}), 400

    product = Product(
        name=name,
        category=category,
        price=price,
        stock=stock,
        status=status_for_stock(stock),
        image=body.get("image"),
        description=body.get("description"),
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@bp.patch("/<product_id>")
@role_required("admin")
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404

    body = request.get_json(silent=True) or {}
    if "name" in body:
        product.name = body["name"]
    if "category" in body:
        product.category = body["category"]
    if "price" in body:
        try:
            product.price = float(body["price"])
        except (TypeError, ValueError):
            return jsonify({"error": "price must be a number"}), 400
    if "stock" in body:
        try:
            product.stock = int(body["stock"])
        except (TypeError, ValueError):
            return jsonify({"error": "stock must be a number"}), 400
    if "image" in body:
        product.image = body["image"]
    if "description" in body:
        product.description = body["description"]

    # Always recomputed from current stock — see status_for_stock's
    # comment in app/models/product.py.
    product.status = status_for_stock(product.stock)

    db.session.commit()
    return jsonify(product.to_dict()), 200


@bp.delete("/<product_id>")
@role_required("admin")
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    db.session.delete(product)
    db.session.commit()
    return "", 204
