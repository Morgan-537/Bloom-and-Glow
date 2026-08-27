import csv
import io

from flask import Blueprint, Response

from app.decorators import role_required
from app.models.order import Order
from app.models.product import Product

bp = Blueprint("reports", __name__, url_prefix="/api/reports")

STAFF_ROLES = ("admin", "order_manager")


def _csv_response(rows, header, filename):
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(header)
    writer.writerows(rows)
    return Response(
        buffer.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@bp.get("/products.csv")
@role_required(*STAFF_ROLES)
def products_csv():
    products = Product.query.order_by(Product.name).all()
    rows = [(p.id, p.name, p.category, p.price, p.stock, p.status) for p in products]
    return _csv_response(rows, ["id", "name", "category", "price", "stock", "status"], "products.csv")


@bp.get("/orders.csv")
@role_required(*STAFF_ROLES)
def orders_csv():
    orders = Order.query.order_by(Order.placed_at.desc()).all()
    rows = [
        (o.id, o.placed_at.isoformat(), o.customer, o.total, o.status, len(o.items))
        for o in orders
    ]
    return _csv_response(
        rows, ["id", "placed_at", "customer", "total", "status", "item_count"], "orders.csv"
    )
