from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required

from app.decorators import role_required
from app.extensions import db
from app.models.order import ORDER_STATUSES, Order, OrderItem
from app.models.product import Product, status_for_stock
from app.models.user import User

bp = Blueprint("orders", __name__, url_prefix="/api/orders")

STAFF_ROLES = ("admin", "order_manager")


@bp.post("")
@jwt_required()
def place_order():
    user = User.query.get(get_jwt_identity())
    if not user or user.disabled:
        return jsonify({"error": "Account not found or disabled"}), 401

    body = request.get_json(silent=True) or {}
    items = body.get("items") or []
    delivery = body.get("deliveryAddress") or {}
    billing = body.get("billingInfo") or {}

    if not items:
        return jsonify({"error": "Cannot place an order with no items"}), 400
    for field in ("fullName", "streetAddress", "city", "postalCode"):
        if not delivery.get(field):
            return jsonify({"error": f"deliveryAddress.{field} is required"}), 400
    if not billing.get("nameOnCard") or not billing.get("cardNumber"):
        return jsonify({"error": "billingInfo.nameOnCard and cardNumber are required"}), 400

    try:
        subtotal = float(body.get("subtotal", 0))
        delivery_fee = float(body.get("deliveryFee", 0))
        total = float(body.get("total", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "subtotal, deliveryFee, and total must be numbers"}), 400

    order = Order(
        user_id=user.id,
        customer=delivery["fullName"],
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        total=total,
        delivery_full_name=delivery["fullName"],
        delivery_street_address=delivery["streetAddress"],
        delivery_city=delivery["city"],
        delivery_postal_code=delivery["postalCode"],
        billing_name_on_card=billing["nameOnCard"],
        # Payment is simulated (see orderSlice.js's old prepare() comment) —
        # never store/accept a full card number, only the last 4 for display.
        billing_card_last4=str(billing["cardNumber"])[-4:],
        status="Processing",
    )

    for raw_item in items:
        quantity = max(1, int(raw_item.get("quantity", 1)))
        product_id = raw_item.get("id")
        product = Product.query.get(product_id) if product_id else None

        order.items.append(
            OrderItem(
                product_id=product.id if product else None,
                name=raw_item.get("name", "Unknown product"),
                price=float(raw_item.get("price", 0)),
                image=raw_item.get("image"),
                quantity=quantity,
            )
        )

        # Decrement stock so the catalog reflects real availability.
        # Best-effort: if stock would go negative (e.g. a race with another
        # checkout), clamp at 0 rather than rejecting the whole order — a
        # stricter reservation system is beyond this phase's scope.
        if product:
            product.stock = max(0, product.stock - quantity)
            product.status = status_for_stock(product.stock)

    db.session.add(order)
    db.session.commit()

    return jsonify(order.to_dict()), 201


@bp.get("")
@jwt_required()
def list_orders():
    claims = get_jwt()
    query = Order.query.order_by(Order.placed_at.desc())
    if claims.get("role") not in STAFF_ROLES:
        query = query.filter_by(user_id=get_jwt_identity())
    return jsonify([o.to_dict() for o in query.all()]), 200


@bp.get("/<order_id>")
@jwt_required()
def get_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    claims = get_jwt()
    if claims.get("role") not in STAFF_ROLES and order.user_id != get_jwt_identity():
        return jsonify({"error": "Forbidden"}), 403

    return jsonify(order.to_dict()), 200


@bp.patch("/<order_id>/status")
@role_required(*STAFF_ROLES)
def update_order_status(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"error": "Order not found"}), 404

    body = request.get_json(silent=True) or {}
    new_status = body.get("status")
    if new_status not in ORDER_STATUSES:
        return jsonify({"error": f"status must be one of {ORDER_STATUSES}"}), 400

    order.status = new_status
    db.session.commit()
    return jsonify(order.to_dict()), 200
