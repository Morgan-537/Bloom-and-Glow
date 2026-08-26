from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from app.extensions import db
from app.models.user import User

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _issue_token(user):
    # role is embedded as a JWT claim so route decorators (role_required)
    # don't need a DB lookup on every request. Trade-off: if an admin
    # changes a user's role, that user's *existing* token keeps the old
    # role claim until they log in again. Fine for a capstone demo; a
    # production app would want shorter-lived tokens + refresh, or a
    # DB check on sensitive routes.
    token = create_access_token(identity=user.id, additional_claims={"role": user.role})
    return token


@bp.post("/register")
def register():
    body = request.get_json(silent=True) or {}
    name = (body.get("name") or "").strip()
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not name or not email or not password:
        return jsonify({"error": "name, email, and password are all required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    user = User(name=name, email=email, role="customer")
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"user": user.to_dict(), "token": _issue_token(user)}), 201


@bp.post("/login")
def login():
    body = request.get_json(silent=True) or {}
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    if user.disabled:
        return jsonify({"error": "This account has been disabled. Contact an admin."}), 403

    return jsonify({"user": user.to_dict(), "token": _issue_token(user)}), 200


@bp.get("/me")
@jwt_required()
def me():
    # Lets the frontend re-validate a stored token (and pick up a role
    # change) on app load, instead of trusting the JWT's claims blindly.
    user = User.query.get(get_jwt_identity())
    if not user or user.disabled:
        return jsonify({"error": "Account not found or disabled"}), 401
    return jsonify({"user": user.to_dict()}), 200
