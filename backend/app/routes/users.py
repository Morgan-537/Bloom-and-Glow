from flask import Blueprint, jsonify, request

from app.decorators import role_required
from app.extensions import db
from app.models.user import ROLES, User

bp = Blueprint("users", __name__, url_prefix="/api/users")


@bp.get("")
@role_required("admin")
def list_users():
    users = User.query.order_by(User.created_at.desc()).all()
    return jsonify([u.to_dict() for u in users]), 200


@bp.patch("/<user_id>")
@role_required("admin")
def update_user(user_id):
    # Matches usersApi.js: updateUserRole() and setUserDisabled() both PATCH
    # this same endpoint with a partial body ({role} or {disabled}), so both
    # are handled here rather than as separate routes.
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    body = request.get_json(silent=True) or {}

    if "role" in body:
        if body["role"] not in ROLES:
            return jsonify({"error": f"role must be one of {ROLES}"}), 400
        user.role = body["role"]

    if "disabled" in body:
        user.disabled = bool(body["disabled"])

    db.session.commit()
    return jsonify(user.to_dict()), 200
