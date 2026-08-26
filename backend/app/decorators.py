from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request


def role_required(*allowed_roles):
    """Require a valid JWT AND that the token's role claim is one of
    `allowed_roles`. Use after (or combined with) @jwt_required-style access.

    Usage: @role_required("admin") or @role_required("admin", "order_manager")
    """

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") not in allowed_roles:
                return jsonify({"error": "Forbidden — insufficient role"}), 403
            return fn(*args, **kwargs)

        return wrapper

    return decorator
