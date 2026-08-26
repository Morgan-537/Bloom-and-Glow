import os


class Config:
    # Postgres connection string, e.g.
    # postgresql://user:password@host:5432/dbname
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "postgresql://bloomglow:bloomglow_dev@localhost:5432/bloom_and_glow"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")
    # Access tokens are what the frontend stores and sends as
    # `Authorization: Bearer <token>` on every request — see authSlice.js's
    # `token` field. 7 days is generous for a capstone demo; tighten this
    # (and add refresh tokens) if this ever needs to be more than a demo.
    JWT_ACCESS_TOKEN_EXPIRES = 60 * 60 * 24 * 7  # 7 days, in seconds

    CORS_ORIGINS = [
        origin.strip()
        for origin in os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]


class TestConfig(Config):
    TESTING = True
    # Tests default to a throwaway local SQLite file rather than Postgres —
    # no separate test database (or any Postgres server at all) needs to
    # exist just to run `pytest`. This matters in particular if your only
    # Postgres instance is a free one on Render: Render's free tier allows
    # only *one* free Postgres per account, so it can't also host a
    # disposable test database without risking your real dev/demo data
    # (each test drops and recreates every table). Set TEST_DATABASE_URL to
    # override this with a real Postgres instance if you ever need to test
    # Postgres-specific SQL.
    SQLALCHEMY_DATABASE_URI = os.environ.get("TEST_DATABASE_URL", "sqlite:////tmp/bloom_and_glow_test.db")
    JWT_SECRET_KEY = "test-secret"
