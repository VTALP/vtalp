import os

from flask import Flask

from assessments.routes import assessments_bp
from backend.routes import backend_bp
from database.connection import close_db, ensure_db_initialized, init_db_command
from simulations.routes import simulations_bp
from tutorials.routes import tutorials_bp


def create_app():
    """Create and configure the SimLearn Flask application."""
    app = Flask(
        __name__,
        template_folder="frontend/templates",
        static_folder="frontend/static",
    )

    # Secret keys are used by Flask for sessions and form security.
    # In production, load this value from an environment variable.
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "change-this-secret-key")

    # Register route groups so the project stays modular as it grows.
    app.register_blueprint(backend_bp)
    app.register_blueprint(simulations_bp, url_prefix="/simulations")
    app.register_blueprint(tutorials_bp, url_prefix="/tutorials")
    app.register_blueprint(assessments_bp, url_prefix="/assessments")

    # Register database cleanup and setup commands.
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)

    # Render may start with a brand-new SQLite file. Ensure the base schema
    # exists before any request, especially login, can query the users table.
    with app.app_context():
        ensure_db_initialized()

    return app


app = create_app()


if __name__ == "__main__":
    # debug=True reloads the server automatically while developing.
    app.run(debug=True)

