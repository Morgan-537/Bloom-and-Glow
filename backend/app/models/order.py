import time
import uuid
from datetime import datetime, timezone

from app.extensions import db

ORDER_STATUSES = ("Processing", "Shipped", "Delivered", "Cancelled")


def generate_invoice_id():
    # Matches the format the frontend used to generate client-side in
    # orderSlice.js's placeOrder.prepare() (`INV-${Date.now()}`) so existing
    # invoice ids/screenshots/docs stay consistent. Now generated
    # server-side so it can't collide or be spoofed by the client.
    return f"INV-{int(time.time() * 1000)}"


class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.String(40), primary_key=True, default=generate_invoice_id)
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=False)

    # Denormalized snapshot of who placed the order, so the admin orders
    # table and invoice view never need a join just to show a name — same
    # reasoning as the old orderSlice.js comment ("orders don't track a
    # userId yet"), except now we track user_id too for real ownership.
    customer = db.Column(db.String(120), nullable=False)

    subtotal = db.Column(db.Numeric(10, 2), nullable=False)
    delivery_fee = db.Column(db.Numeric(10, 2), nullable=False)
    total = db.Column(db.Numeric(10, 2), nullable=False)

    delivery_full_name = db.Column(db.String(120), nullable=False)
    delivery_street_address = db.Column(db.String(255), nullable=False)
    delivery_city = db.Column(db.String(120), nullable=False)
    delivery_postal_code = db.Column(db.String(20), nullable=False)

    billing_name_on_card = db.Column(db.String(120), nullable=False)
    billing_card_last4 = db.Column(db.String(4), nullable=False)

    status = db.Column(db.String(20), nullable=False, default="Processing")
    placed_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = db.relationship("User", back_populates="orders")
    items = db.relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    def to_dict(self):
        # Shape matches what orderSlice.js's placeOrder already puts in
        # Redux state, so OrderConfirmationPage / OrderHistory / AdminOrders
        # need minimal changes to switch from local state to this API.
        return {
            "id": self.id,
            "placedAt": self.placed_at.isoformat(),
            "customer": self.customer,
            "items": [item.to_dict() for item in self.items],
            "subtotal": float(self.subtotal),
            "deliveryFee": float(self.delivery_fee),
            "total": float(self.total),
            "deliveryAddress": {
                "fullName": self.delivery_full_name,
                "streetAddress": self.delivery_street_address,
                "city": self.delivery_city,
                "postalCode": self.delivery_postal_code,
            },
            "billing": {
                "nameOnCard": self.billing_name_on_card,
                "cardLast4": self.billing_card_last4,
            },
            "status": self.status,
        }


class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.String(36), primary_key=True, default=lambda: uuid.uuid4().hex)
    order_id = db.Column(db.String(40), db.ForeignKey("orders.id"), nullable=False)
    # Nullable + ON DELETE SET NULL: if a product is later deleted from the
    # catalog, past orders should still show what was actually bought (via
    # the snapshot fields below), not break or vanish. Without
    # ondelete="SET NULL" here, Postgres's default FK behavior (RESTRICT)
    # would make DELETE /api/products/:id fail with a 500 the moment any
    # order has ever included that product.
    product_id = db.Column(db.String(36), db.ForeignKey("products.id", ondelete="SET NULL"), nullable=True)

    # Snapshot of the product at time of purchase — price/name changes to
    # the live product afterward must never rewrite historical invoices.
    name = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    image = db.Column(db.Text, nullable=True)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    order = db.relationship("Order", back_populates="items")

    def to_dict(self):
        return {
            "id": self.product_id or self.id,
            "name": self.name,
            "price": float(self.price),
            "image": self.image,
            "quantity": self.quantity,
        }
