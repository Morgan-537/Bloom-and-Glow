import uuid
from datetime import datetime, timezone

from app.extensions import db

LOW_STOCK_THRESHOLD = 10


def status_for_stock(stock):
    if stock <= 0:
        return "Out of Stock"
    if stock < LOW_STOCK_THRESHOLD:
        return "Low Stock"
    return "Active"


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.String(36), primary_key=True, default=lambda: uuid.uuid4().hex)
    name = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    # Recomputed from `stock` on every create/update (see status_for_stock)
    # rather than trusted from the client, so it can never drift out of sync
    # the way a couple of rows in the old db.json mock data did.
    status = db.Column(db.String(20), nullable=False, default="Active")
    image = db.Column(db.Text, nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "price": float(self.price),
            "stock": self.stock,
            "status": self.status,
            "image": self.image,
            "description": self.description,
        }
