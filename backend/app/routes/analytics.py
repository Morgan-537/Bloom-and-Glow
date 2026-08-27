from datetime import datetime, timedelta, timezone

from flask import Blueprint, jsonify
from sqlalchemy import func

from app.decorators import role_required
from app.extensions import db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User

bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")

STAFF_ROLES = ("admin", "order_manager")


@bp.get("/dashboard")
@role_required(*STAFF_ROLES)
def dashboard():
    # Matches the shape adminSlice.js currently hardcodes as `stats` mock
    # data, so AdminDashboard.jsx just needs its data source swapped.
    total_sales = (
        db.session.query(func.coalesce(func.sum(Order.total), 0))
        .filter(Order.status != "Cancelled")
        .scalar()
    )
    order_count = db.session.query(func.count(Order.id)).scalar()
    product_count = db.session.query(func.count(Product.id)).scalar()
    active_customers = (
        db.session.query(func.count(User.id))
        .filter(User.role == "customer", User.disabled.is_(False))
        .scalar()
    )

    return jsonify(
        {
            "totalSales": float(total_sales),
            "orders": order_count,
            "products": product_count,
            "activeCustomers": active_customers,
        }
    ), 200


@bp.get("/sales-trend")
@role_required(*STAFF_ROLES)
def sales_trend():
    # 12 days of order totals, oldest first — same shape as adminSlice.js's
    # mock `salesTrend` array, so the existing chart component needs no
    # changes beyond where it gets its data.
    today = datetime.now(timezone.utc).date()
    days = [today - timedelta(days=offset) for offset in range(11, -1, -1)]

    totals_by_day = dict(
        db.session.query(
            func.date(Order.placed_at).label("day"),
            func.coalesce(func.sum(Order.total), 0),
        )
        .filter(Order.status != "Cancelled")
        .filter(func.date(Order.placed_at) >= days[0])
        .group_by("day")
        .all()
    )

    trend = [float(totals_by_day.get(day, 0)) for day in days]
    return jsonify(trend), 200


@bp.get("/top-products")
@role_required(*STAFF_ROLES)
def top_products():
    # NOTE: the old adminSlice.js mock used a `views` field, but this app
    # has never tracked product-detail page views (that would need a
    # separate "record a view" endpoint hit from ProductDetail.jsx). This
    # returns real data instead — units sold, from actual order history —
    # under `unitsSold`. Update AdminDashboard/AdminAnalytics to read that
    # field name instead of `views`.
    rows = (
        db.session.query(OrderItem.name, func.sum(OrderItem.quantity).label("units"))
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.status != "Cancelled")
        .group_by(OrderItem.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )
    return jsonify([{"name": name, "unitsSold": int(units)} for name, units in rows]), 200


@bp.get("/category-breakdown")
@role_required(*STAFF_ROLES)
def category_breakdown():
    # Powers AdminAnalytics.jsx's "revenue by category" section — currently
    # computed client-side from in-memory session orders; this computes it
    # server-side from real, persisted order history instead.
    rows = (
        db.session.query(Product.category, func.sum(OrderItem.price * OrderItem.quantity).label("revenue"))
        .join(OrderItem, OrderItem.product_id == Product.id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.status != "Cancelled")
        .group_by(Product.category)
        .order_by(func.sum(OrderItem.price * OrderItem.quantity).desc())
        .all()
    )
    return jsonify([{"category": category, "revenue": float(revenue)} for category, revenue in rows]), 200
