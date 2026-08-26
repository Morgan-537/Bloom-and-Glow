import importlib
import warnings

# Each teammate owns a different route module (auth=Damaris, products=Elvis,
# orders=Timothy, users/analytics/reports=Morgan) and pushes it on their own
# branch. Importing each one individually — and skipping ones that don't
# exist yet — means a single teammate's branch (with only their own file
# added on top of this scaffold) can still start the app and run their own
# tests, instead of every branch failing to import until all four are
# merged into develop.
MODULE_NAMES = ["auth", "products", "users", "orders", "analytics", "reports"]


def register_routes(app):
    for name in MODULE_NAMES:
        try:
            module = importlib.import_module(f"app.routes.{name}")
        except ModuleNotFoundError:
            warnings.warn(
                f"app/routes/{name}.py not found yet — skipping its routes. "
                f"This is expected until every teammate's branch is merged."
            )
            continue
        app.register_blueprint(module.bp)
