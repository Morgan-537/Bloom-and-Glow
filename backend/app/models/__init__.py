import warnings

# Same reasoning as app/routes/__init__.py: user.py (Damaris), product.py
# (Elvis), and order.py (Timothy) each land on their own branch. Every
# route file imports directly from its own model file (e.g.
# `from app.models.product import Product`), NOT through this file — but
# Python still runs this __init__.py first whenever the `app.models`
# package is touched at all, so if it unconditionally imported all three
# and one didn't exist yet, importing ANY model (even ones that do exist)
# would crash. Guarding each import individually avoids that.
__all__ = []

try:
    from app.models.user import User  # noqa: F401

    __all__.append("User")
except ModuleNotFoundError:
    warnings.warn("app/models/user.py not found yet.")

try:
    from app.models.product import Product  # noqa: F401

    __all__.append("Product")
except ModuleNotFoundError:
    warnings.warn("app/models/product.py not found yet.")

try:
    from app.models.order import Order, OrderItem  # noqa: F401

    __all__ += ["Order", "OrderItem"]
except ModuleNotFoundError:
    warnings.warn("app/models/order.py not found yet.")
