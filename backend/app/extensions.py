from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS

# Instantiated here, initialized against the app in create_app() (app/__init__.py).
# Keeping them here (rather than as globals in __init__.py) avoids circular
# imports, since models and routes both need to import `db`.
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()
cors = CORS()
