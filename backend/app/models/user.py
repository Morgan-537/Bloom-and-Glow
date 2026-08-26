import uuid
from datetime import datetime, timezone

from app.extensions import db, bcrypt

ROLES = ("customer", "admin", "order_manager")


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.String(36), primary_key=True, default=lambda: uuid.uuid4().hex)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    # "customer" (default), "admin" (full access), or "order_manager"
    # (can manage orders but isn't a full admin) — see ROLES above.
    role = db.Column(db.String(20), nullable=False, default="customer")
    disabled = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    orders = db.relationship("Order", back_populates="user", lazy="select")

    def set_password(self, raw_password):
        self.password_hash = bcrypt.generate_password_hash(raw_password).decode("utf-8")

    def check_password(self, raw_password):
        return bcrypt.check_password_hash(self.password_hash, raw_password)

    def to_dict(self):
        # Matches the shape frontend/src/api/usersApi.js and authSlice.js's
        # normalizeUser() already expect from db.json's `users` collection —
        # "name" (not "fullName") is intentional, authSlice normalizes it.
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "disabled": self.disabled,
        }
