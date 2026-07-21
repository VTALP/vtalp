# SimLearn Project Export

## Folder Structure

```text
you-are-helping-me-build-my/
|-- assessments/
|   |-- __init__.py
|   `-- routes.py
|-- backend/
|   |-- __init__.py
|   |-- device_catalog.py
|   |-- instructor_service.py
|   |-- progress_service.py
|   `-- routes.py
|-- database/
|   |-- __init__.py
|   |-- connection.py
|   `-- schema.sql
|-- frontend/
|   |-- static/
|   |   |-- css/
|   |   |   |-- arduino.css
|   |   |   |-- assessment.css
|   |   |   |-- dashboard.css
|   |   |   |-- directory.css
|   |   |   |-- instructor.css
|   |   |   |-- multimeter.css
|   |   |   |-- oscilloscope.css
|   |   |   |-- progress.css
|   |   |   |-- style.css
|   |   |   `-- tutorial.css
|   |   `-- js/
|   |       |-- arduino.js
|   |       |-- assessment.js
|   |       |-- dashboard.js
|   |       |-- main.js
|   |       |-- multimeter.js
|   |       |-- oscilloscope.js
|   |       `-- tutorial.js
|   `-- templates/
|       |-- _dashboard_sidebar.html
|       |-- arduino.html
|       |-- arduino_assessment.html
|       |-- arduino_tutorial.html
|       |-- base.html
|       |-- dashboard.html
|       |-- index.html
|       |-- instructor_dashboard.html
|       |-- learning_directory.html
|       |-- login.html
|       |-- multimeter.html
|       |-- multimeter_assessment.html
|       |-- multimeter_tutorial.html
|       |-- oscilloscope.html
|       |-- oscilloscope_assessment.html
|       |-- oscilloscope_tutorial.html
|       |-- placeholder.html
|       |-- progress.html
|       |-- register.html
|       `-- tutorial.html
|-- simulations/
|   |-- arduino/
|   |   `-- __init__.py
|   |-- multimeter/
|   |   `-- __init__.py
|   |-- oscilloscope/
|   |   `-- __init__.py
|   |-- __init__.py
|   `-- routes.py
|-- tutorials/
|   |-- arduino/
|   |   `-- __init__.py
|   |-- multimeter/
|   |   `-- __init__.py
|   |-- oscilloscope/
|   |   `-- __init__.py
|   |-- __init__.py
|   `-- routes.py
|-- .gitignore
|-- app.py
|-- Procfile
|-- README.md
|-- render.yaml
|-- requirements.txt
`-- runtime.txt
```

## requirements.txt

### requirements.txt

```text
Flask==3.0.3
gunicorn==22.0.0
```

## app.py

### app.py

```python
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
```

## routes.py Files

### assessments/routes.py

```python
from flask import Blueprint, render_template, session, url_for

from backend.device_catalog import CORE_DEVICES
from backend.progress_service import get_user_progress
from backend.routes import login_required


assessments_bp = Blueprint("assessments", __name__)


@assessments_bp.route("/")
@login_required
def assessment_home():
    """Display protected assessment categories for SimLearn's core devices."""
    progress_data = get_user_progress(session.get("user_id"), url_for)
    progress_by_slug = {device["slug"]: device for device in progress_data["devices"]}
    tests = []

    for device in CORE_DEVICES:
        progress = progress_by_slug[device["slug"]]
        current_score = (
            f"{progress['assessment_score']} / {progress['assessment_total']}"
            if progress["assessment_total"]
            else "Not Attempted"
        )
        tests.append(
            {
                "name": device["name"],
                "category": device["category"],
                "description": f"Evaluate your understanding of {device['tutorial_summary'].lower()}",
                "url": progress["assessment_url"],
                "action_label": "Take Assessment",
                "meta": [
                    {"label": "Questions", "value": str(device["assessment_questions"])},
                    {"label": "Passing Score", "value": device["passing_score"]},
                    {"label": "Current Score", "value": current_score},
                ],
            }
        )

    return render_template(
        "learning_directory.html",
        title="Assessments",
        eyebrow="Step 3",
        message="Use assessments after completing the tutorial and simulation practice.",
        items=tests,
        flow_steps=[
            {"step": "Step 1", "label": "Start with Tutorial"},
            {"step": "Step 2", "label": "Practice in Simulation"},
            {"step": "Step 3", "label": "Take Assessment", "active": True},
            {"step": "Step 4", "label": "Check Progress"},
        ],
    )


@assessments_bp.route("/multimeter")
@login_required
def multimeter():
    """Render the protected Digital Multimeter assessment page."""
    return render_template("multimeter_assessment.html", title="Digital Multimeter Assessment")


@assessments_bp.route("/oscilloscope")
@login_required
def oscilloscope():
    """Render the protected Oscilloscope assessment page."""
    return render_template("oscilloscope_assessment.html", title="Oscilloscope Assessment")


@assessments_bp.route("/arduino")
@login_required
def arduino():
    """Render the protected Arduino Trainer assessment page."""
    return render_template("arduino_assessment.html", title="Arduino Trainer Assessment")
```

### backend/routes.py

```python
from functools import wraps

from flask import Blueprint, flash, jsonify, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

from backend.device_catalog import build_dashboard_devices
from backend.instructor_service import (
    ensure_instructor_tables,
    get_instructor_dashboard_data,
    get_user_role,
    record_login_activity,
)
from backend.progress_service import (
    get_user_progress,
    record_assessment_score,
    record_exercise_completed,
    record_simulation_event,
    record_tutorial_completed,
)
from database.connection import get_db


# A Blueprint groups related routes together.
backend_bp = Blueprint("backend", __name__)


def login_required(view):
    """Redirect visitors to login when they try to open protected pages."""
    @wraps(view)
    def wrapped_view(**kwargs):
        if "user_id" not in session:
            flash("Please log in to access your dashboard.", "error")
            return redirect(url_for("backend.login"))

        return view(**kwargs)

    return wrapped_view


def instructor_required(view):
    """Allow only users with instructor or admin roles to open instructor tools."""
    @wraps(view)
    def wrapped_view(**kwargs):
        if "user_id" not in session:
            flash("Please log in to access the instructor dashboard.", "error")
            return redirect(url_for("backend.login"))

        role = session.get("role") or get_user_role(session["user_id"])
        if role not in ("instructor", "admin"):
            flash("Instructor access is required for that page.", "error")
            return redirect(url_for("backend.dashboard"))

        return view(**kwargs)

    return wrapped_view


@backend_bp.route("/")
def home():
    """Display the SimLearn homepage."""
    return render_template("index.html")


@backend_bp.route("/register", methods=("GET", "POST"))
def register():
    """Create a learner account and store it in SQLite."""
    form_data = {"full_name": "", "email": ""}
    focus_field = None

    if request.method == "POST":
        full_name = request.form.get("full_name", "").strip()
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        confirm_password = request.form.get("confirm_password", "")
        error = None
        form_data = {"full_name": full_name, "email": email}

        # Validate the form before saving anything to the database.
        if not full_name:
            error = "Full name is required."
            focus_field = "full_name"
        elif not email:
            error = "Email address is required."
            focus_field = "email"
        elif not password:
            error = "Password is required."
            focus_field = "password"
        elif len(password) < 6:
            error = "Password must be at least 6 characters long."
            focus_field = "password"
        elif password != confirm_password:
            error = "Passwords do not match."
            focus_field = "password"

        ensure_instructor_tables()
        db = get_db()
        existing_user = db.execute(
            "SELECT id FROM users WHERE email = ?",
            (email,),
        ).fetchone()

        if error is None and existing_user is not None:
            error = "An account with this email already exists."
            focus_field = "email"

        if error is None:
            password_hash = generate_password_hash(password)
            db.execute(
                """
                INSERT INTO users (full_name, email, password_hash, role)
                VALUES (?, ?, ?, 'student')
                """,
                (full_name, email, password_hash),
            )
            db.commit()

            flash("Registration successful. Please log in.", "success")
            return redirect(url_for("backend.login"))

        flash(error, "error")

    return render_template(
        "register.html",
        title="Register",
        form_data=form_data,
        focus_field=focus_field,
    )


@backend_bp.route("/login", methods=("GET", "POST"))
def login():
    """Verify a learner's email and password, then start a session."""
    ensure_instructor_tables()
    form_data = {"email": ""}
    focus_field = None

    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        error = None
        form_data = {"email": email}

        db = get_db()
        user = db.execute(
            "SELECT id, full_name, email, password_hash, role FROM users WHERE email = ?",
            (email,),
        ).fetchone()

        if not email:
            error = "Email address is required."
            focus_field = "email"
        elif not password:
            error = "Password is required."
            focus_field = "password"
        elif user is None:
            error = "Email not registered."
            focus_field = "email"
        elif not check_password_hash(user["password_hash"], password):
            error = "Invalid password."
            focus_field = "password"

        if error is None:
            # Clear any old session data before storing the logged-in user.
            session.clear()
            session["user_id"] = user["id"]
            session["full_name"] = user["full_name"]
            session["email"] = user["email"]
            session["role"] = user["role"] or "student"
            record_login_activity(user["id"], user["email"])

            flash("Login successful.", "success")
            if session["role"] in ("instructor", "admin"):
                return redirect(url_for("backend.instructor_dashboard"))
            return redirect(url_for("backend.dashboard", view="welcome"))

        flash(error, "error")

    return render_template(
        "login.html",
        title="Login",
        form_data=form_data,
        focus_field=focus_field,
    )


@backend_bp.route("/logout")
def logout():
    """End the learner session and return to the homepage."""
    session.clear()
    flash("You have been logged out.", "success")
    return redirect(url_for("backend.home"))


@backend_bp.route("/dashboard")
@login_required
def dashboard():
    """Display the protected dashboard for SimLearn's three core learning devices."""
    sidebar_expanded = request.args.get("view", "welcome") == "expanded"
    # Device cards come from one shared catalog so simulations, tutorials,
    # assessments, and progress tracking can reuse the same device structure.
    instruments = build_dashboard_devices(url_for)
    progress_data = get_user_progress(session["user_id"], url_for)
    summary = progress_data["summary"]
    progress_by_slug = {device["slug"]: device for device in progress_data["devices"]}
    dashboard_devices = [
        {
            **instrument,
            "completion_percentage": progress_by_slug[instrument["slug"]]["completion_percentage"],
        }
        for instrument in instruments
    ]

    return render_template(
        "dashboard.html",
        title="Dashboard",
        full_name=session.get("full_name"),
        dashboard_devices=dashboard_devices,
        overall_completion=summary["overall_completion"],
        summary=summary,
        sidebar_expanded=sidebar_expanded,
    )


@backend_bp.route("/instructor")
@instructor_required
def instructor_dashboard():
    """Display class-level monitoring tools for lecturers and instructors."""
    dashboard_data = get_instructor_dashboard_data()
    return render_template(
        "instructor_dashboard.html",
        title="Instructor Dashboard",
        full_name=session.get("full_name"),
        stats=dashboard_data["stats"],
        students=dashboard_data["students"],
        activity_log=dashboard_data["activity_log"],
    )


@backend_bp.route("/progress")
@login_required
def progress():
    """Display detailed progress tracking for the current logged-in user."""
    progress_data = get_user_progress(session["user_id"], url_for)
    return render_template(
        "progress.html",
        title="Progress",
        devices=progress_data["devices"],
        summary=progress_data["summary"],
        activity_timeline=progress_data["timeline"],
        achievements=progress_data["achievements"],
    )


@backend_bp.post("/progress/api/tutorial/<device_slug>")
@login_required
def complete_tutorial(device_slug):
    """Store tutorial completion from the frontend completion button."""
    saved = record_tutorial_completed(session["user_id"], device_slug)
    progress_data = get_user_progress(session["user_id"], url_for)
    return jsonify({"saved": saved, "progress": progress_data["summary"]})


@backend_bp.post("/progress/api/exercise/<device_slug>/<exercise_slug>")
@login_required
def complete_exercise(device_slug, exercise_slug):
    """Store tutorial exercise completion without treating it as an assessment."""
    saved = record_exercise_completed(session["user_id"], device_slug, exercise_slug)
    progress_data = get_user_progress(session["user_id"], url_for)
    return jsonify({"saved": saved, "progress": progress_data["summary"]})


@backend_bp.post("/progress/api/assessment/<device_slug>")
@login_required
def save_assessment(device_slug):
    """Store an assessment score submitted by the frontend scorer."""
    payload = request.get_json(silent=True) or {}
    score = int(payload.get("score", 0))
    total = int(payload.get("total", 0))
    result = record_assessment_score(session["user_id"], device_slug, score, total)
    return jsonify({"saved": result is not None, "result": result})


@backend_bp.post("/progress/api/simulation/<device_slug>/event")
@login_required
def save_simulation_event(device_slug):
    """Store detailed simulation milestones from interactive labs."""
    payload = request.get_json(silent=True) or {}
    event_type = str(payload.get("event", "")).strip()
    event_detail = (
        payload.get("detail")
        or payload.get("behavior")
        or payload.get("component")
        or ""
    )
    saved = record_simulation_event(session["user_id"], device_slug, event_type, str(event_detail).strip())
    progress_data = get_user_progress(session["user_id"], url_for)
    return jsonify({"saved": saved, "progress": progress_data["summary"]})
```

### simulations/routes.py

```python
from flask import Blueprint, redirect, render_template, session, url_for

from backend.routes import login_required
from backend.device_catalog import CORE_DEVICES
from backend.progress_service import record_simulation_opened
from backend.progress_service import get_user_progress


simulations_bp = Blueprint("simulations", __name__)


@simulations_bp.route("/")
@login_required
def simulation_home():
    """Display available virtual instrument simulations."""
    progress_data = get_user_progress(session.get("user_id"), url_for)
    progress_by_slug = {device["slug"]: device for device in progress_data["devices"]}
    instruments = []

    for device in CORE_DEVICES:
        progress = progress_by_slug[device["slug"]]
        status = "Not Opened"
        if progress["simulation_used"]:
            status = "Completed" if progress["completion_percentage"] >= 100 else "In Progress"

        instruments.append(
            {
                "name": device["name"],
                "category": device["category"],
                "description": device["simulation_summary"],
                "url": progress["simulation_url"],
                "action_label": "Open Lab" if device["slug"] == "arduino" else "Open Simulation",
                "meta": [
                    {"label": "Skill Practiced", "value": device["skill_practiced"]},
                    {"label": "Status", "value": status},
                ],
            }
        )

    return render_template(
        "learning_directory.html",
        title="Simulations",
        eyebrow="Step 2",
        message="Practice with a virtual lab after reviewing the matching tutorial.",
        items=instruments,
        flow_steps=[
            {"step": "Step 1", "label": "Start with Tutorial"},
            {"step": "Step 2", "label": "Practice in Simulation", "active": True},
            {"step": "Step 3", "label": "Take Assessment"},
            {"step": "Step 4", "label": "Check Progress"},
        ],
    )


@simulations_bp.route("/digital-multimeter")
@login_required
def digital_multimeter():
    """Keep the old URL working by sending users to the new simulation route."""
    return redirect(url_for("simulations.multimeter"))


@simulations_bp.route("/multimeter")
@simulations_bp.route("/dmm")
@login_required
def multimeter():
    """Display the protected Digital Multimeter simulation page."""
    record_simulation_opened(session.get("user_id"), "multimeter")
    return render_template("multimeter.html", title="Digital Multimeter Simulation")


@simulations_bp.route("/oscilloscope")
@login_required
def oscilloscope():
    """Display the protected Oscilloscope simulation page."""
    record_simulation_opened(session.get("user_id"), "oscilloscope")
    return render_template("oscilloscope.html", title="Oscilloscope Simulation")


@simulations_bp.route("/arduino")
@login_required
def arduino():
    """Display the protected Arduino Trainer simulation page."""
    record_simulation_opened(session.get("user_id"), "arduino")
    return render_template("arduino.html", title="Arduino Trainer Simulation")
```

### tutorials/routes.py

```python
from flask import Blueprint, render_template, session, url_for

from backend.device_catalog import CORE_DEVICES
from backend.progress_service import get_user_progress
from backend.routes import login_required


tutorials_bp = Blueprint("tutorials", __name__)


@tutorials_bp.route("/")
@login_required
def tutorial_home():
    """Display the protected tutorial landing page for all SimLearn devices."""
    progress_data = get_user_progress(session.get("user_id"), url_for)
    progress_by_slug = {device["slug"]: device for device in progress_data["devices"]}
    lessons = []

    for device in CORE_DEVICES:
        progress = progress_by_slug[device["slug"]]
        status = "Completed" if progress["tutorial_completed"] else "Not Started"
        if not progress["tutorial_completed"] and (
            progress["simulation_used"] or progress["exercise_count"] or progress["assessment_completed"]
        ):
            status = "In Progress"

        lessons.append(
            {
                "name": device["name"],
                "category": device["category"],
                "description": device["tutorial_summary"],
                "url": progress["tutorial_url"],
                "action_label": "Open Tutorial",
                "meta": [
                    {"label": "Learning Outcome", "value": device["learning_outcome"]},
                    {"label": "Estimated Time", "value": device["estimated_time"]},
                    {"label": "Status", "value": status},
                ],
            }
        )

    return render_template(
        "learning_directory.html",
        title="Tutorials",
        eyebrow="Step 1",
        message="Start here before using the simulations. Tutorials explain the device, safety rules, controls, and beginner concepts.",
        items=lessons,
        flow_steps=[
            {"step": "Step 1", "label": "Start with Tutorial", "active": True},
            {"step": "Step 2", "label": "Practice in Simulation"},
            {"step": "Step 3", "label": "Take Assessment"},
            {"step": "Step 4", "label": "Check Progress"},
        ],
    )


@tutorials_bp.route("/multimeter")
@login_required
def multimeter():
    """Render the dedicated Digital Multimeter tutorial page."""
    return render_template("multimeter_tutorial.html", title="Digital Multimeter Tutorial")


@tutorials_bp.route("/oscilloscope")
@login_required
def oscilloscope():
    """Render the dedicated Oscilloscope tutorial page."""
    return render_template("oscilloscope_tutorial.html", title="Oscilloscope Tutorial")


@tutorials_bp.route("/arduino")
@login_required
def arduino():
    """Render the dedicated Arduino Trainer tutorial page."""
    return render_template("arduino_tutorial.html", title="Arduino Trainer Tutorial")
```

## Database and Models Files

### database/__init__.py

```python
"""Database package for SQLite setup and future data access helpers."""
```

### database/connection.py

```python
import os
import sqlite3
from pathlib import Path

import click
from flask import g


BASE_DIR = Path(__file__).resolve().parent
DATABASE_PATH = Path(os.environ.get("DATABASE_PATH", BASE_DIR / "vtalp.sqlite3"))
SCHEMA_PATH = BASE_DIR / "schema.sql"
_SCHEMA_INITIALIZED = False


def get_db():
    """Open one SQLite connection for the current web request."""
    if "db" not in g:
        DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
        g.db = sqlite3.connect(DATABASE_PATH)
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(error=None):
    """Close the database connection after each request finishes."""
    db = g.pop("db", None)

    if db is not None:
        db.close()


def init_db():
    """Create database tables from database/schema.sql."""
    db = get_db()

    with open(SCHEMA_PATH, "r", encoding="utf-8") as schema_file:
        db.executescript(schema_file.read())
    db.commit()


def ensure_db_initialized():
    """Create the SQLite schema once per process without replacing existing data."""
    global _SCHEMA_INITIALIZED

    if _SCHEMA_INITIALIZED:
        return

    init_db()
    _SCHEMA_INITIALIZED = True


@click.command("init-db")
def init_db_command():
    """Flask command used to create the starter SQLite database."""
    init_db()
    click.echo("Initialized the SimLearn SQLite database.")
```

### database/schema.sql

```sql
-- Starter SQLite schema for SimLearn.
-- This file can be expanded as authentication, simulations, and assessments grow.

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    email TEXT NOT NULL,
    logged_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    module_name TEXT NOT NULL,
    progress_percent INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS assessment_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    assessment_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Progress tracking tables for the three SimLearn core devices.
-- These tables are user-specific and can support more devices later by storing
-- the device slug instead of hard-coding separate tables per instrument.

CREATE TABLE IF NOT EXISTS completed_tutorials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    device_slug TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, device_slug),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS simulation_activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    device_slug TEXT NOT NULL,
    opened_count INTEGER DEFAULT 0,
    used_count INTEGER DEFAULT 0,
    last_opened_at TIMESTAMP,
    last_used_at TIMESTAMP,
    UNIQUE (user_id, device_slug),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS assessment_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    device_slug TEXT NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage INTEGER NOT NULL,
    passed INTEGER DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS completed_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    device_slug TEXT NOT NULL,
    exercise_slug TEXT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, device_slug, exercise_slug),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    device_slug TEXT NOT NULL,
    tutorial_completed INTEGER DEFAULT 0,
    simulation_used INTEGER DEFAULT 0,
    assessment_score INTEGER DEFAULT 0,
    assessment_total INTEGER DEFAULT 0,
    assessment_percentage INTEGER DEFAULT 0,
    progress_percent INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, device_slug),
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Authentication and Login Related Files

### frontend/templates/login.html

```html
{% extends "base.html" %}

{% block body_class %}auth-page login-page{% endblock %}

{% block content %}
<section class="auth-section">
    <div class="auth-background" aria-hidden="true"></div>
    <div class="auth-panel">
        <div class="auth-copy">
            <p class="eyebrow">Welcome Back</p>
            <h1>Log in to SimLearn</h1>
            <p>Continue your virtual instrument practice and track your learning progress.</p>
        </div>

        <form class="auth-form" method="post" action="{{ url_for('backend.login') }}">
            <div class="auth-field">
                <label for="email">Email address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    value="{{ form_data.email|default('', true) }}"
                    {% if focus_field == "email" %}autofocus data-error-focus="true"{% endif %}
                    required
                >
            </div>

            <div class="auth-field">
                <label for="password">Password</label>
                <div class="password-control">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autocomplete="current-password"
                        {% if focus_field == "password" %}autofocus data-error-focus="true"{% endif %}
                        required
                    >
                    <button class="password-toggle" type="button" aria-label="Show password" aria-controls="password">Show</button>
                </div>
            </div>

            <button class="button primary form-button" type="submit">Log In</button>

            <p class="form-note">
                New to SimLearn?
                <a href="{{ url_for('backend.register') }}">Create an account</a>
            </p>
        </form>
    </div>
</section>
{% endblock %}
```

### frontend/templates/register.html

```html
{% extends "base.html" %}

{% block body_class %}auth-page register-page{% endblock %}

{% block content %}
<section class="auth-section">
    <div class="auth-background" aria-hidden="true"></div>
    <div class="auth-panel">
        <div class="auth-copy">
            <p class="eyebrow">Create Account</p>
            <h1>Join SimLearn</h1>
            <p>Register to access simulations, tutorials, assessments, and personal progress tracking.</p>
        </div>

        <form class="auth-form" method="post" action="{{ url_for('backend.register') }}">
            <div class="auth-field">
                <label for="full_name">Full name</label>
                <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    autocomplete="name"
                    value="{{ form_data.full_name|default('', true) }}"
                    {% if focus_field == "full_name" %}autofocus data-error-focus="true"{% endif %}
                    required
                >
            </div>

            <div class="auth-field">
                <label for="email">Email address</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    value="{{ form_data.email|default('', true) }}"
                    {% if focus_field == "email" %}autofocus data-error-focus="true"{% endif %}
                    required
                >
            </div>

            <div class="auth-field">
                <label for="password">Password</label>
                <div class="password-control">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autocomplete="new-password"
                        minlength="6"
                        {% if focus_field == "password" %}autofocus data-error-focus="true"{% endif %}
                        required
                    >
                    <button class="password-toggle" type="button" aria-label="Show password" aria-controls="password">Show</button>
                </div>
            </div>

            <div class="auth-field">
                <label for="confirm_password">Confirm password</label>
                <div class="password-control">
                    <input id="confirm_password" name="confirm_password" type="password" autocomplete="new-password" minlength="6" required>
                    <button class="password-toggle" type="button" aria-label="Show confirm password" aria-controls="confirm_password">Show</button>
                </div>
                <p class="password-match-message" data-password-match-message aria-live="polite"></p>
            </div>

            <button class="button primary form-button" type="submit">Create Account</button>

            <p class="form-note">
                Already have an account?
                <a href="{{ url_for('backend.login') }}">Log in</a>
            </p>
        </form>
    </div>
</section>
{% endblock %}
```

### frontend/static/js/main.js

```javascript
document.addEventListener("DOMContentLoaded", () => {
    initPasswordToggles();
    initErrorFocus();
    initPasswordMatchFeedback();

    const isHomepage = document.body.classList.contains("homepage");

    if (!isHomepage) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const featureCards = Array.from(document.querySelectorAll("[data-feature-card]"));
    const revealItems = Array.from(document.querySelectorAll("[data-reveal-item]"));

    if (prefersReducedMotion) {
        featureCards.forEach((card) => card.classList.add("is-visible"));
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    let ticking = false;
    const updateHeroState = () => {
        const hasScrolled = window.scrollY > 24;
        document.body.classList.toggle("hero-compact", hasScrolled);
        document.body.classList.toggle("nav-scrolled", hasScrolled);
        ticking = false;
    };

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeroState);
                ticking = true;
            }
        },
        { passive: true }
    );
    updateHeroState();

    if ("IntersectionObserver" in window) {
        const cardObserver = new IntersectionObserver(
            (entries, entryObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const card = entry.target;
                    card.style.transitionDelay = `${featureCards.indexOf(card) * 90}ms`;
                    card.classList.add("is-visible");
                    entryObserver.unobserve(card);
                });
            },
            { threshold: 0.2 }
        );

        const revealObserver = new IntersectionObserver(
            (entries, entryObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const item = entry.target;
                    item.style.transitionDelay = `${revealItems.indexOf(item) * 80}ms`;
                    item.classList.add("is-visible");
                    entryObserver.unobserve(item);
                });
            },
            { threshold: 0.18 }
        );

        featureCards.forEach((card) => cardObserver.observe(card));
        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        featureCards.forEach((card) => card.classList.add("is-visible"));
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }
});

function initPasswordToggles() {
    document.querySelectorAll(".password-toggle").forEach((toggle) => {
        const inputId = toggle.getAttribute("aria-controls");
        const input = inputId ? document.getElementById(inputId) : null;

        if (!input) {
            return;
        }

        toggle.addEventListener("click", () => {
            const isPassword = input.type === "password";
            input.type = isPassword ? "text" : "password";
            toggle.textContent = isPassword ? "Hide" : "Show";
            toggle.setAttribute(
                "aria-label",
                `${isPassword ? "Hide" : "Show"} ${inputId === "confirm_password" ? "confirm password" : "password"}`
            );
        });
    });
}

function initErrorFocus() {
    const target = document.querySelector("[data-error-focus='true']");

    if (!target) {
        return;
    }

    window.requestAnimationFrame(() => {
        target.focus({ preventScroll: true });
    });
}

function initPasswordMatchFeedback() {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirm_password");
    const message = document.querySelector("[data-password-match-message]");

    if (!password || !confirmPassword || !message) {
        return;
    }

    const updateMessage = () => {
        const hasConfirmValue = confirmPassword.value.length > 0;
        const matches = password.value === confirmPassword.value;

        message.classList.toggle("is-visible", hasConfirmValue);
        message.classList.toggle("is-match", hasConfirmValue && matches);
        message.classList.toggle("is-mismatch", hasConfirmValue && !matches);

        if (!hasConfirmValue) {
            message.textContent = "";
        } else {
            message.textContent = matches ? "✓ Passwords match" : "✕ Passwords do not match";
        }
    };

    password.addEventListener("input", updateMessage);
    confirmPassword.addEventListener("input", updateMessage);
}
```

### frontend/static/css/style.css

```css
:root {
    --bg: #f7f9fc;
    --surface: #ffffff;
    --ink: #172033;
    --muted: #5d6b82;
    --primary: #1864ab;
    --primary-dark: #124f86;
    --accent: #0f766e;
    --border: #d9e2ec;
}

* {
    box-sizing: border-box;
}

html,
body {
    max-width: 100%;
    overflow-x: hidden;
}

body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.6;
}

a {
    color: inherit;
    text-decoration: none;
}

.site-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
}

.homepage .site-header {
    position: sticky;
    top: 0;
    transition: background 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
    z-index: 20;
}

.homepage.nav-scrolled .site-header {
    background: rgba(255, 255, 255, 0.96);
    border-color: rgba(217, 226, 236, 0.7);
    box-shadow: 0 10px 28px rgba(23, 32, 51, 0.10);
}

.nav {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 1120px;
    padding: 16px 20px;
}

.brand {
    color: var(--primary);
    font-size: 1.35rem;
    font-weight: 700;
}

.nav-links {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: flex-end;
    min-width: 0;
}

.nav-links a {
    color: var(--muted);
    font-weight: 600;
}

.nav-dashboard-trigger {
    background: transparent;
    border: 0;
    color: var(--muted);
    cursor: pointer;
    font: inherit;
    font-weight: 600;
    padding: 0;
}

.nav-links a:hover {
    color: var(--primary);
}

.nav-dashboard-trigger:hover {
    color: var(--primary);
}

.hero {
    background: linear-gradient(135deg, #eaf6ff 0%, #eefaf6 100%);
    border-bottom: 1px solid var(--border);
    overflow: hidden;
    padding: 72px 20px;
    position: relative;
    transition: padding 260ms ease;
}

.hero-background {
    background:
        radial-gradient(circle at 84% 22%, rgba(24, 100, 171, 0.14), transparent 27%),
        radial-gradient(circle at 68% 72%, rgba(15, 118, 110, 0.10), transparent 24%),
        radial-gradient(circle at 12% 18%, rgba(24, 100, 171, 0.08), transparent 22%),
        linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
        linear-gradient(0deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
    background-size: auto, auto, auto, 34px 34px, 34px 34px;
    inset: 0;
    opacity: 0.7;
    pointer-events: none;
    position: absolute;
}

.hero-content,
.page-section {
    margin: 0 auto;
    max-width: 1120px;
}

.hero-content {
    position: relative;
    z-index: 1;
}

.hero-layout {
    align-items: center;
    display: grid;
    gap: 42px;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
}

.hero-copy {
    min-width: 0;
}

.eyebrow {
    color: var(--accent);
    font-size: 0.9rem;
    font-weight: 700;
    margin: 0 0 8px;
    text-transform: uppercase;
}

h1,
h2,
p {
    margin-top: 0;
}

h1 {
    font-size: clamp(2.1rem, 5vw, 4rem);
    line-height: 1.08;
    margin-bottom: 18px;
    max-width: 780px;
}

.hero-title {
    animation: heroFadeUp 560ms ease both;
    transform-origin: left center;
    transition: transform 260ms ease;
}

.title-highlight {
    animation: titleSheen 6s ease-in-out infinite;
    background: linear-gradient(90deg, var(--ink), var(--primary), var(--accent), var(--ink));
    background-clip: text;
    background-size: 240% 100%;
    color: transparent;
    -webkit-background-clip: text;
}

.hero-text {
    animation: heroFadeUp 560ms ease 140ms both;
    color: var(--muted);
    font-size: 1.2rem;
    max-width: 620px;
    transition: opacity 260ms ease, transform 260ms ease;
}

.hero-actions {
    animation: heroFadeUp 560ms ease 260ms both;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
}

.button {
    align-items: center;
    border-radius: 6px;
    display: inline-flex;
    font-weight: 700;
    justify-content: center;
    min-width: 150px;
    padding: 12px 18px;
    transition: background 240ms ease, border-color 240ms ease, box-shadow 240ms ease, color 240ms ease, transform 240ms ease;
}

.button:hover {
    box-shadow: 0 14px 26px rgba(23, 32, 51, 0.14);
    transform: translateY(-3px);
}

.button:focus-visible,
.nav-dashboard-trigger:focus-visible,
.nav-links a:focus-visible,
.brand:focus-visible {
    outline: 3px solid #bfdbfe;
    outline-offset: 4px;
}

.page-link-group {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: flex-end;
}

.primary {
    background: var(--primary);
    color: #ffffff;
}

.primary:hover {
    background: var(--primary-dark);
}

.secondary {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--primary);
}

.secondary:hover {
    border-color: #9cc4e7;
    background: #f8fbff;
}

.hero-illustration {
    animation: instrumentFloat 7s ease-in-out infinite;
    max-width: 430px;
    width: 100%;
}

.hero-illustration svg {
    display: block;
    height: auto;
    width: 100%;
}

.stats-strip {
    align-items: stretch;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: grid;
    gap: 0;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin: 0 auto;
    max-width: 1120px;
    padding: 22px 20px;
}

.stat-item {
    border-right: 1px solid var(--border);
    opacity: 0;
    padding: 2px 22px;
    transform: translateY(12px);
    transition: opacity 420ms ease, transform 420ms ease;
}

.stat-item:last-child {
    border-right: 0;
}

.stat-item strong,
.stat-item span {
    display: block;
}

.stat-item strong {
    color: var(--primary);
    font-size: 1.25rem;
    line-height: 1.2;
}

.stat-item span {
    color: var(--muted);
    font-size: 0.95rem;
    margin-top: 4px;
}

.features,
.item-grid {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    margin: 0 auto;
    max-width: 1120px;
    padding: 48px 20px;
}

.how-it-works {
    margin: 0 auto;
    max-width: 1120px;
    padding: 10px 20px 56px;
}

.how-it-works .section-heading {
    margin-bottom: 20px;
}

.journey-steps {
    align-items: stretch;
    display: grid;
    gap: 14px;
    grid-template-columns: minmax(0, 1fr) 34px minmax(0, 1fr) 34px minmax(0, 1fr);
}

.journey-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    opacity: 0;
    padding: 22px;
    transform: translateY(18px);
    transition: border-color 180ms ease, box-shadow 180ms ease, opacity 420ms ease, transform 420ms ease;
}

.journey-card:hover {
    border-color: #b8cce0;
    box-shadow: 0 16px 34px rgba(23, 32, 51, 0.10);
    transform: translateY(-4px);
}

.journey-number {
    align-items: center;
    background: #e8f3ff;
    border: 1px solid #cfe4f8;
    border-radius: 999px;
    color: var(--primary);
    display: inline-flex;
    font-weight: 700;
    height: 34px;
    justify-content: center;
    margin-bottom: 14px;
    width: 34px;
}

.journey-card h3 {
    font-size: 1.15rem;
    margin: 0 0 8px;
}

.journey-card p {
    color: var(--muted);
    margin: 0;
}

.journey-connector {
    align-self: center;
    background: linear-gradient(90deg, var(--border), var(--primary));
    height: 2px;
    opacity: 0.6;
    position: relative;
}

.journey-connector::after {
    border-bottom: 5px solid transparent;
    border-left: 7px solid var(--primary);
    border-top: 5px solid transparent;
    content: "";
    position: absolute;
    right: -1px;
    top: 50%;
    transform: translateY(-50%);
}

.dashboard-grid {
    display: grid;
    gap: 18px;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    margin-top: 28px;
}

.feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    opacity: 0;
    padding: 22px;
    transform: translateY(18px);
    transition: border-color 180ms ease, box-shadow 180ms ease, opacity 420ms ease, transform 420ms ease;
}

.feature-card.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.stat-item.is-visible,
.journey-card.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.feature-card:hover {
    border-color: #b8cce0;
    box-shadow: 0 16px 34px rgba(23, 32, 51, 0.10);
    transform: translateY(-4px);
}

.feature-icon {
    align-items: center;
    background: #e8f3ff;
    border: 1px solid #cfe4f8;
    border-radius: 8px;
    color: var(--primary);
    display: inline-flex;
    height: 38px;
    justify-content: center;
    margin-bottom: 14px;
    width: 38px;
}

.feature-icon svg {
    fill: none;
    height: 22px;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: 1.8;
    width: 22px;
}

.feature-card h2 {
    font-size: 1.15rem;
    margin-bottom: 10px;
}

.feature-card p {
    color: var(--muted);
    margin-bottom: 0;
}

.homepage.hero-compact .hero {
    padding-bottom: 56px;
    padding-top: 56px;
}

.homepage.hero-compact .hero-title {
    transform: scale(0.96);
}

.homepage.hero-compact .hero-text {
    opacity: 0.84;
    transform: translateY(-4px);
}

@keyframes heroFadeUp {
    from {
        opacity: 0;
        transform: translateY(14px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes titleSheen {
    0%,
    100% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }
}

@keyframes instrumentFloat {
    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-8px);
    }
}

@keyframes authCopyIn {
    from {
        opacity: 0;
        transform: translateY(16px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes authFormIn {
    from {
        opacity: 0;
        transform: translateX(18px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes authFieldIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes flashSlideIn {
    from {
        opacity: 0;
        transform: translateY(-8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.flash-area {
    margin: 18px auto 0;
    max-width: 1120px;
    padding: 0 20px;
}

.flash-message {
    animation: flashSlideIn 360ms ease both;
    border-radius: 6px;
    font-weight: 700;
    margin: 0 0 10px;
    padding: 12px 14px;
}

.flash-message.error {
    background: #fff1f2;
    border: 1px solid #fecdd3;
    color: #9f1239;
}

.flash-message.success {
    background: #ecfdf5;
    border: 1px solid #bbf7d0;
    color: #166534;
}

.page-section {
    min-height: 60vh;
    padding: 56px 20px;
}

.auth-section,
.dashboard-section {
    margin: 0 auto;
    max-width: 1120px;
    min-height: 68vh;
    padding: 56px 20px;
}

.auth-section {
    overflow: hidden;
    position: relative;
}

.auth-background {
    background:
        radial-gradient(circle at 15% 24%, rgba(24, 100, 171, 0.08), transparent 28%),
        radial-gradient(circle at 86% 18%, rgba(15, 118, 110, 0.08), transparent 24%),
        linear-gradient(90deg, rgba(24, 100, 171, 0.035) 1px, transparent 1px),
        linear-gradient(0deg, rgba(24, 100, 171, 0.035) 1px, transparent 1px);
    background-size: auto, auto, 36px 36px, 36px 36px;
    inset: 0;
    pointer-events: none;
    position: absolute;
}

.auth-panel {
    align-items: stretch;
    display: grid;
    gap: 24px;
    grid-template-columns: minmax(0, 0.9fr) minmax(320px, 1fr);
    position: relative;
    z-index: 1;
}

.auth-copy {
    animation: authCopyIn 560ms ease both;
    align-self: center;
}

.auth-copy p {
    color: var(--muted);
    max-width: 520px;
}

.auth-form {
    animation: authFormIn 620ms ease 120ms both;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    padding: 24px;
    box-shadow: 0 14px 34px rgba(23, 32, 51, 0.08);
    transition: box-shadow 240ms ease, transform 240ms ease;
}

.auth-form:hover,
.auth-form:focus-within {
    box-shadow: 0 18px 40px rgba(23, 32, 51, 0.12);
    transform: translateY(-2px);
}

.auth-field {
    animation: authFieldIn 460ms ease both;
    display: flex;
    flex-direction: column;
}

.auth-field:nth-of-type(1) {
    animation-delay: 220ms;
}

.auth-field:nth-of-type(2) {
    animation-delay: 280ms;
}

.auth-field:nth-of-type(3) {
    animation-delay: 340ms;
}

.auth-field:nth-of-type(4) {
    animation-delay: 400ms;
}

.auth-form label {
    font-weight: 700;
    margin-bottom: 8px;
}

.auth-form input {
    border: 1px solid var(--border);
    border-radius: 6px;
    font: inherit;
    margin-bottom: 18px;
    padding: 12px 14px;
    transition: border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease;
    width: 100%;
}

.auth-form input:hover {
    border-color: #b8cce0;
}

.auth-form input:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 4px #dbeafe;
    outline: 0;
    transform: translateY(-1px);
}

.password-control {
    align-items: center;
    display: flex;
    position: relative;
}

.password-control input {
    padding-right: 76px;
}

.password-toggle {
    background: transparent;
    border: 0;
    color: var(--primary);
    cursor: pointer;
    font: inherit;
    font-size: 0.9rem;
    font-weight: 700;
    padding: 4px 8px;
    position: absolute;
    right: 8px;
    top: 12px;
}

.password-toggle:focus-visible {
    border-radius: 4px;
    outline: 3px solid #bfdbfe;
    outline-offset: 2px;
}

.password-match-message {
    font-size: 0.9rem;
    font-weight: 700;
    margin: -10px 0 14px;
    min-height: 1.35em;
    opacity: 0;
    transform: translateY(-3px);
    transition: color 180ms ease, opacity 180ms ease, transform 180ms ease;
}

.password-match-message.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.password-match-message.is-match {
    color: #166534;
}

.password-match-message.is-mismatch {
    color: #9f1239;
}

.form-button {
    animation: authFieldIn 460ms ease 480ms both;
    border: 0;
    cursor: pointer;
    margin-top: 4px;
    width: 100%;
}

.form-button:hover {
    background: var(--primary-dark);
    box-shadow: 0 14px 26px rgba(24, 100, 171, 0.22);
    transform: translateY(-2px);
}

.form-note {
    color: var(--muted);
    margin: 18px 0 0;
}

.form-note a {
    color: var(--primary);
    font-weight: 700;
}

.section-heading {
    max-width: 720px;
}

.section-heading p {
    color: var(--muted);
    font-size: 1.05rem;
}

.text-link {
    color: var(--primary);
    display: inline-block;
    font-weight: 700;
    margin-top: 16px;
}

.site-footer {
    border-top: 1px solid var(--border);
    color: var(--muted);
    padding: 20px;
    text-align: center;
}

.site-footer p {
    margin: 0;
}

@media (max-width: 720px) {
    .nav {
        align-items: flex-start;
        flex-direction: column;
        gap: 12px;
        padding: 14px clamp(16px, 5vw, 20px);
    }

    .nav-links {
        gap: 12px 16px;
        justify-content: flex-start;
        width: 100%;
    }

    .hero {
        padding: 48px 20px;
    }

    .hero-layout {
        grid-template-columns: 1fr;
    }

    .hero-illustration {
        margin: 4px auto 0;
        max-width: 330px;
    }

    .stats-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        row-gap: 18px;
    }

    .stat-item {
        border-right: 0;
        padding: 0 10px;
    }

    .journey-steps {
        grid-template-columns: 1fr;
    }

    .journey-connector {
        height: 28px;
        justify-self: center;
        width: 2px;
    }

    .journey-connector::after {
        border-bottom: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 7px solid var(--primary);
        bottom: -1px;
        right: 50%;
        top: auto;
        transform: translateX(50%);
    }

    .homepage.hero-compact .hero {
        padding-bottom: 42px;
        padding-top: 42px;
    }

    .auth-panel {
        grid-template-columns: 1fr;
    }

    .auth-section {
        padding: 40px 20px;
    }

    .auth-form {
        padding: 20px;
    }
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.01ms !important;
    }

    .feature-card {
        opacity: 1;
        transform: none;
    }

    .stat-item,
    .journey-card,
    .auth-copy,
    .auth-form,
    .auth-field,
    .form-button,
    .flash-message {
        opacity: 1;
        transform: none;
    }

    .button:hover,
    .feature-card:hover,
    .journey-card:hover,
    .auth-form:hover,
    .auth-form:focus-within,
    .auth-form input:focus,
    .homepage.hero-compact .hero-title,
    .homepage.hero-compact .hero-text,
    .hero-illustration {
        transform: none;
    }
}
```

## Assessment and Lesson Data Storage Files

### backend/progress_service.py

```python
"""User progress helpers for SimLearn.

The functions here keep progress calculation in one place so dashboard,
progress pages, simulations, tutorials, and assessments do not duplicate SQL.
"""

from backend.device_catalog import CORE_DEVICES
from database.connection import ensure_db_initialized, get_db


DEVICE_SLUGS = [device["slug"] for device in CORE_DEVICES]
EXERCISE_TOTALS = {
    "multimeter": 5,
    "oscilloscope": 8,
    "arduino": 8,
}
EXERCISE_SLUGS = {
    "multimeter": {"battery", "resistor", "fuse", "outlet", "lamp"},
    "oscilloscope": {
        "function-generator-waveforms",
        "frequency-change",
        "amplitude-change",
        "ac-source",
        "pwm-generator",
        "sensor-signal",
        "audio-signal",
        "noisy-signal",
    },
    "arduino": {
        "blink-led",
        "push-button",
        "servo-motor",
        "potentiometer",
        "buzzer",
        "ldr",
        "temperature-sensor",
        "ultrasonic-sensor",
    },
}

COMPONENT_TOTALS = {
    "arduino": 8,
}


def ensure_progress_tables():
    """Create progress tables for existing databases that predate this module."""
    ensure_db_initialized()
    db = get_db()
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS completed_tutorials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            device_slug TEXT NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (user_id, device_slug),
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS simulation_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            device_slug TEXT NOT NULL,
            opened_count INTEGER DEFAULT 0,
            used_count INTEGER DEFAULT 0,
            last_opened_at TIMESTAMP,
            last_used_at TIMESTAMP,
            UNIQUE (user_id, device_slug),
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS assessment_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            device_slug TEXT NOT NULL,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            percentage INTEGER NOT NULL,
            passed INTEGER DEFAULT 0,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS completed_exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            device_slug TEXT NOT NULL,
            exercise_slug TEXT NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (user_id, device_slug, exercise_slug),
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS user_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            device_slug TEXT NOT NULL,
            tutorial_completed INTEGER DEFAULT 0,
            simulation_used INTEGER DEFAULT 0,
            assessment_score INTEGER DEFAULT 0,
            assessment_total INTEGER DEFAULT 0,
            assessment_percentage INTEGER DEFAULT 0,
            progress_percent INTEGER DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (user_id, device_slug),
            FOREIGN KEY (user_id) REFERENCES users (id)
        );

        CREATE TABLE IF NOT EXISTS simulation_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            device_slug TEXT NOT NULL,
            event_type TEXT NOT NULL,
            event_detail TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        );
        """
    )
    db.commit()


def record_simulation_opened(user_id, device_slug):
    """Record that the current user opened or used a simulation."""
    if not user_id or device_slug not in DEVICE_SLUGS:
        return

    ensure_progress_tables()
    db = get_db()
    db.execute(
        """
        INSERT INTO simulation_activity (user_id, device_slug, opened_count, used_count, last_opened_at, last_used_at)
        VALUES (?, ?, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, device_slug) DO UPDATE SET
            opened_count = opened_count + 1,
            used_count = used_count + 1,
            last_opened_at = CURRENT_TIMESTAMP,
            last_used_at = CURRENT_TIMESTAMP
        """,
        (user_id, device_slug),
    )
    refresh_user_device_progress(user_id, device_slug)
    db.commit()


def record_simulation_event(user_id, device_slug, event_type, event_detail=None):
    """Store detailed lab actions such as USB, upload, run, and tested component events."""
    allowed_events = {"opened", "usb_connected", "code_uploaded", "simulation_run", "component_tested"}
    if not user_id or device_slug not in DEVICE_SLUGS or event_type not in allowed_events:
        return False

    ensure_progress_tables()
    db = get_db()
    db.execute(
        """
        INSERT INTO simulation_events (user_id, device_slug, event_type, event_detail)
        VALUES (?, ?, ?, ?)
        """,
        (user_id, device_slug, event_type, event_detail),
    )

    # Opening a lab and running a simulation both contribute to normal progress.
    # USB/upload/component events are kept for richer Arduino analytics without
    # changing how DMM and Oscilloscope progress is calculated.
    if event_type == "opened":
        db.execute(
            """
            INSERT INTO simulation_activity (user_id, device_slug, opened_count, used_count, last_opened_at, last_used_at)
            VALUES (?, ?, 1, 0, CURRENT_TIMESTAMP, NULL)
            ON CONFLICT(user_id, device_slug) DO UPDATE SET
                opened_count = opened_count + 1,
                last_opened_at = CURRENT_TIMESTAMP
            """,
            (user_id, device_slug),
        )
    elif event_type == "simulation_run":
        db.execute(
            """
            INSERT INTO simulation_activity (user_id, device_slug, opened_count, used_count, last_opened_at, last_used_at)
            VALUES (?, ?, 0, 1, NULL, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, device_slug) DO UPDATE SET
                used_count = used_count + 1,
                last_used_at = CURRENT_TIMESTAMP
            """,
            (user_id, device_slug),
        )

    refresh_user_device_progress(user_id, device_slug)
    db.commit()
    return True


def record_tutorial_completed(user_id, device_slug):
    """Record tutorial completion for the current user."""
    if not user_id or device_slug not in DEVICE_SLUGS:
        return False

    ensure_progress_tables()
    db = get_db()
    db.execute(
        """
        INSERT INTO completed_tutorials (user_id, device_slug)
        VALUES (?, ?)
        ON CONFLICT(user_id, device_slug) DO UPDATE SET
            completed_at = CURRENT_TIMESTAMP
        """,
        (user_id, device_slug),
    )
    refresh_user_device_progress(user_id, device_slug)
    db.commit()
    return True


def record_exercise_completed(user_id, device_slug, exercise_slug):
    """Record a tutorial practice exercise completion for the current user."""
    if not user_id or device_slug not in DEVICE_SLUGS or not exercise_slug:
        return False
    if exercise_slug not in EXERCISE_SLUGS.get(device_slug, set()):
        return False

    ensure_progress_tables()
    db = get_db()
    db.execute(
        """
        INSERT INTO completed_exercises (user_id, device_slug, exercise_slug)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, device_slug, exercise_slug) DO UPDATE SET
            completed_at = CURRENT_TIMESTAMP
        """,
        (user_id, device_slug, exercise_slug),
    )
    refresh_user_device_progress(user_id, device_slug)
    db.commit()
    return True


def record_assessment_score(user_id, device_slug, score, total_questions):
    """Store an assessment attempt and refresh latest progress.

    Scores are stored as attempts in assessment_scores. user_progress keeps the
    latest submitted score for dashboard display and can later be extended to
    show best score or full assessment history.
    """
    if not user_id or device_slug not in DEVICE_SLUGS or total_questions <= 0:
        return None

    ensure_progress_tables()
    percentage = round((score / total_questions) * 100)
    passed = 1 if percentage >= 60 else 0
    db = get_db()
    db.execute(
        """
        INSERT INTO assessment_scores (user_id, device_slug, score, total_questions, percentage, passed)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (user_id, device_slug, score, total_questions, percentage, passed),
    )
    refresh_user_device_progress(user_id, device_slug)
    db.commit()
    return {"score": score, "total": total_questions, "percentage": percentage, "passed": bool(passed)}


def refresh_user_device_progress(user_id, device_slug):
    """Calculate one device's progress percentage for the current user.

    Each device has three equal progress parts: tutorial completion, simulation
    use, and assessment completion. This keeps the calculation transparent and
    easy to expand for future devices or richer scoring rules.
    """
    db = get_db()
    tutorial = db.execute(
        "SELECT 1 FROM completed_tutorials WHERE user_id = ? AND device_slug = ?",
        (user_id, device_slug),
    ).fetchone()
    simulation = db.execute(
        "SELECT used_count FROM simulation_activity WHERE user_id = ? AND device_slug = ?",
        (user_id, device_slug),
    ).fetchone()
    exercise_count = db.execute(
        "SELECT COUNT(*) AS total FROM completed_exercises WHERE user_id = ? AND device_slug = ?",
        (user_id, device_slug),
    ).fetchone()["total"]
    latest_score = db.execute(
        """
        SELECT score, total_questions, percentage, passed
        FROM assessment_scores
        WHERE user_id = ? AND device_slug = ?
        ORDER BY completed_at DESC, id DESC
        LIMIT 1
        """,
        (user_id, device_slug),
    ).fetchone()

    tutorial_completed = 1 if tutorial else 0
    simulation_used = 1 if simulation and simulation["used_count"] > 0 else 0
    exercise_total = EXERCISE_TOTALS.get(device_slug, 0)
    exercise_count = min(exercise_count, exercise_total) if exercise_total else exercise_count
    exercises_completed = 1 if exercise_total and exercise_count >= exercise_total else 0
    assessment_score = latest_score["score"] if latest_score else 0
    assessment_total = latest_score["total_questions"] if latest_score else 0
    assessment_percentage = latest_score["percentage"] if latest_score else 0
    assessment_completed = 1 if latest_score else 0
    progress_parts = [tutorial_completed, simulation_used, assessment_completed]
    if exercise_total:
        progress_parts.insert(2, exercises_completed)
    progress_percent = round((sum(progress_parts) / len(progress_parts)) * 100)

    db.execute(
        """
        INSERT INTO user_progress (
            user_id, device_slug, tutorial_completed, simulation_used,
            assessment_score, assessment_total, assessment_percentage, progress_percent, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, device_slug) DO UPDATE SET
            tutorial_completed = excluded.tutorial_completed,
            simulation_used = excluded.simulation_used,
            assessment_score = excluded.assessment_score,
            assessment_total = excluded.assessment_total,
            assessment_percentage = excluded.assessment_percentage,
            progress_percent = excluded.progress_percent,
            updated_at = CURRENT_TIMESTAMP
        """,
        (
            user_id,
            device_slug,
            tutorial_completed,
            simulation_used,
            assessment_score,
            assessment_total,
            assessment_percentage,
            progress_percent,
        ),
    )


def get_user_progress(user_id, url_for=None):
    """Return dashboard-ready progress data for all core SimLearn devices."""
    ensure_progress_tables()
    db = get_db()
    rows = {
        row["device_slug"]: row
        for row in db.execute(
            "SELECT * FROM user_progress WHERE user_id = ?",
            (user_id,),
        ).fetchall()
    }

    device_progress = []
    for device in CORE_DEVICES:
        row = rows.get(device["slug"])
        tutorial_completed = bool(row["tutorial_completed"]) if row else False
        simulation_used = bool(row["simulation_used"]) if row else False
        assessment_score = row["assessment_score"] if row else 0
        assessment_total = row["assessment_total"] if row else 0
        assessment_percentage = row["assessment_percentage"] if row else 0
        progress_percent = row["progress_percent"] if row else 0
        latest_score = db.execute(
            """
            SELECT passed
            FROM assessment_scores
            WHERE user_id = ? AND device_slug = ?
            ORDER BY completed_at DESC, id DESC
            LIMIT 1
            """,
            (user_id, device["slug"]),
        ).fetchone()
        assessment_passed = bool(latest_score["passed"]) if latest_score else False
        exercise_total = EXERCISE_TOTALS.get(device["slug"], 0)
        exercise_count = db.execute(
            "SELECT COUNT(*) AS total FROM completed_exercises WHERE user_id = ? AND device_slug = ?",
            (user_id, device["slug"]),
        ).fetchone()["total"]
        if exercise_total:
            exercise_count = min(exercise_count, exercise_total)
        component_total = COMPONENT_TOTALS.get(device["slug"], 0)
        component_count = db.execute(
            """
            SELECT COUNT(DISTINCT event_detail) AS total
            FROM simulation_events
            WHERE user_id = ?
                AND device_slug = ?
                AND event_type = 'component_tested'
                AND event_detail IS NOT NULL
                AND event_detail != ''
            """,
            (user_id, device["slug"]),
        ).fetchone()["total"]

        device_progress.append(
            {
                "slug": device["slug"],
                "name": device["name"],
                "icon": device["icon"],
                "tutorial_completed": tutorial_completed,
                "tutorial_status": "Completed" if tutorial_completed else "Not completed",
                "simulation_used": simulation_used,
                "simulation_status": "Tried" if simulation_used else "Not tried",
                "exercise_count": exercise_count,
                "exercise_total": exercise_total,
                "exercise_status": (
                    f"{exercise_count}/{exercise_total} completed"
                    if exercise_total
                    else "No tutorial exercises yet"
                ),
                "exercises_completed": bool(exercise_total and exercise_count >= exercise_total),
                "component_count": component_count,
                "component_total": component_total,
                "component_status": (
                    f"{component_count}/{component_total} tested"
                    if component_total
                    else "Not tracked"
                ),
                "assessment_score": assessment_score,
                "assessment_total": assessment_total,
                "assessment_label": f"{assessment_score}/{assessment_total}" if assessment_total else "Not attempted",
                "assessment_percentage": assessment_percentage,
                "assessment_completed": bool(assessment_total),
                "assessment_passed": assessment_passed,
                "completion_percentage": progress_percent,
                "tutorial_url": url_for(device["tutorial_endpoint"]) if url_for else "#",
                "simulation_url": url_for(device["simulation_endpoint"]) if url_for else "#",
                "assessment_url": url_for(f"assessments.{device['slug']}") if url_for else "#",
            }
        )

    return {
        "devices": device_progress,
        "summary": calculate_overall_summary(device_progress),
        "timeline": get_learning_activity_timeline(user_id),
        "achievements": build_achievement_badges(device_progress),
    }


def calculate_overall_summary(device_progress):
    """Calculate platform-wide progress values from per-device progress."""
    total_devices = len(device_progress)
    tutorials_completed = sum(1 for device in device_progress if device["tutorial_completed"])
    simulations_tried = sum(1 for device in device_progress if device["simulation_used"])
    exercises_completed = sum(device["exercise_count"] for device in device_progress)
    total_exercises = sum(device["exercise_total"] for device in device_progress)
    assessments_completed = sum(1 for device in device_progress if device["assessment_completed"])
    attempted_scores = [device["assessment_percentage"] for device in device_progress if device["assessment_total"]]
    average_assessment = round(sum(attempted_scores) / len(attempted_scores)) if attempted_scores else 0
    overall_completion = round(sum(device["completion_percentage"] for device in device_progress) / total_devices)

    return {
        "tutorials_completed": tutorials_completed,
        "total_tutorials": total_devices,
        "simulations_tried": simulations_tried,
        "total_simulations": total_devices,
        "exercises_completed": exercises_completed,
        "total_exercises": total_exercises,
        "assessments_completed": assessments_completed,
        "total_assessments": total_devices,
        "average_assessment": average_assessment,
        "overall_completion": overall_completion,
    }


def get_learning_activity_timeline(user_id):
    """Return recent learning events from tutorials, simulations, and assessments."""
    db = get_db()
    events = []
    device_names = {device["slug"]: device["name"] for device in CORE_DEVICES}

    tutorial_rows = db.execute(
        """
        SELECT device_slug, completed_at
        FROM completed_tutorials
        WHERE user_id = ?
        ORDER BY completed_at DESC
        """,
        (user_id,),
    ).fetchall()
    simulation_rows = db.execute(
        """
        SELECT device_slug, last_opened_at
        FROM simulation_activity
        WHERE user_id = ? AND last_opened_at IS NOT NULL
        ORDER BY last_opened_at DESC
        """,
        (user_id,),
    ).fetchall()
    assessment_rows = db.execute(
        """
        SELECT device_slug, percentage, passed, completed_at
        FROM assessment_scores
        WHERE user_id = ?
        ORDER BY completed_at DESC, id DESC
        """,
        (user_id,),
    ).fetchall()
    exercise_rows = db.execute(
        """
        SELECT device_slug, exercise_slug, completed_at
        FROM completed_exercises
        WHERE user_id = ?
        ORDER BY completed_at DESC
        """,
        (user_id,),
    ).fetchall()
    simulation_event_rows = db.execute(
        """
        SELECT device_slug, event_type, event_detail, created_at
        FROM simulation_events
        WHERE user_id = ? AND event_type != 'opened'
        ORDER BY created_at DESC
        """,
        (user_id,),
    ).fetchall()

    for row in tutorial_rows:
        events.append(
            {
                "type": "Tutorial Completed",
                "device": device_names.get(row["device_slug"], row["device_slug"]),
                "detail": "Guided tutorial marked complete",
                "timestamp": row["completed_at"],
            }
        )

    for row in simulation_rows:
        events.append(
            {
                "type": "Simulation Opened",
                "device": device_names.get(row["device_slug"], row["device_slug"]),
                "detail": "Virtual lab opened for practice",
                "timestamp": row["last_opened_at"],
            }
        )

    for row in exercise_rows:
        events.append(
            {
                "type": "Exercise Completed",
                "device": device_names.get(row["device_slug"], row["device_slug"]),
                "detail": f"Completed practice exercise: {row['exercise_slug'].replace('-', ' ').title()}",
                "timestamp": row["completed_at"],
            }
        )

    event_labels = {
        "usb_connected": "USB Connected",
        "code_uploaded": "Code Uploaded",
        "simulation_run": "Simulation Run",
        "component_tested": "Component Tested",
    }
    for row in simulation_event_rows:
        events.append(
            {
                "type": event_labels.get(row["event_type"], "Simulation Activity"),
                "device": device_names.get(row["device_slug"], row["device_slug"]),
                "detail": row["event_detail"] or "Arduino lab activity recorded",
                "timestamp": row["created_at"],
            }
        )

    for row in assessment_rows:
        events.append(
            {
                "type": "Assessment Taken",
                "device": device_names.get(row["device_slug"], row["device_slug"]),
                "detail": f"Scored {row['percentage']}% {'and passed' if row['passed'] else 'and needs review'}",
                "timestamp": row["completed_at"],
            }
        )

    events.sort(key=lambda event: event["timestamp"] or "", reverse=True)
    return events[:8]


def build_achievement_badges(device_progress):
    """Create dashboard achievement badges from current learning milestones."""
    device_map = {device["slug"]: device for device in device_progress}
    return [
        {
            "name": "First Tutorial Completed",
            "description": "Complete any device tutorial",
            "earned": any(device["tutorial_completed"] for device in device_progress),
        },
        {
            "name": "First Simulation Used",
            "description": "Open any virtual simulation",
            "earned": any(device["simulation_used"] for device in device_progress),
        },
        {
            "name": "First Assessment Passed",
            "description": "Score at least 60% on any assessment",
            "earned": any(device["assessment_passed"] for device in device_progress),
        },
        {
            "name": "DMM Beginner",
            "description": "Complete the DMM tutorial",
            "earned": device_map.get("multimeter", {}).get("tutorial_completed", False),
        },
        {
            "name": "DMM Explorer",
            "description": "Use the DMM simulation and complete its practice exercises",
            "earned": (
                device_map.get("multimeter", {}).get("simulation_used", False)
                and device_map.get("multimeter", {}).get("exercises_completed", False)
            ),
        },
        {
            "name": "Oscilloscope Beginner",
            "description": "Start Oscilloscope learning with a tutorial or simulation",
            "earned": (
                device_map.get("oscilloscope", {}).get("tutorial_completed", False)
                or device_map.get("oscilloscope", {}).get("simulation_used", False)
            ),
        },
        {
            "name": "Arduino Beginner",
            "description": "Start Arduino learning with a tutorial or simulation",
            "earned": (
                device_map.get("arduino", {}).get("tutorial_completed", False)
                or device_map.get("arduino", {}).get("simulation_used", False)
            ),
        },
    ]
```

### frontend/static/js/assessment.js

```javascript
document.addEventListener("DOMContentLoaded", () => {
    const assessmentLayout = document.querySelector(".assessment-layout");

    if (!assessmentLayout) {
        return;
    }

    const assessmentSlug = assessmentLayout.dataset.assessment;
    const form = document.getElementById("assessmentForm");
    const scoreDisplay = document.getElementById("scoreDisplay");
    const passMessage = document.getElementById("passMessage");
    const feedbackPanel = document.getElementById("feedbackPanel");
    const retakeButton = document.getElementById("retakeButton");
    const resultData = document.getElementById("assessmentResultData");
    const questions = Array.from(form.querySelectorAll("fieldset"));
    const passingScore = Number(assessmentLayout.dataset.passingScore || 3);

    const assessmentResult = {
        device: assessmentSlug,
        score: 0,
        total: questions.length,
        passed: false,
        submitted: false,
    };

    // Temporary frontend storage: a future Flask endpoint can receive this
    // object and save score, user_id, device, and timestamp into SQLite.
    window.vtalpAssessmentResult = assessmentResult;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        gradeAssessment();
    });

    retakeButton.addEventListener("click", () => {
        form.reset();
        questions.forEach((question) => question.classList.remove("correct", "incorrect"));
        feedbackPanel.classList.remove("visible");
        feedbackPanel.innerHTML = "";
        updateResult(0, false, false);
    });

    function gradeAssessment() {
        let score = 0;
        const feedbackItems = [];

        questions.forEach((question, index) => {
            const correctAnswer = question.dataset.answer;
            const selected = question.querySelector("input[type='radio']:checked");
            const isCorrect = selected?.value === correctAnswer;

            // Score calculation: each question is worth one point. The correct
            // answer is stored in the fieldset's data-answer attribute.
            if (isCorrect) {
                score += 1;
            }

            question.classList.toggle("correct", isCorrect);
            question.classList.toggle("incorrect", !isCorrect);
            feedbackItems.push(
                `<li>Question ${index + 1}: ${isCorrect ? "Correct" : "Review this topic again."}</li>`
            );
        });

        updateResult(score, score >= passingScore, true);
        saveAssessmentResult(score);
        feedbackPanel.innerHTML = `<strong>Immediate Feedback</strong><ul>${feedbackItems.join("")}</ul>`;
        feedbackPanel.classList.add("visible");
    }

    function updateResult(score, passed, submitted) {
        assessmentResult.score = score;
        assessmentResult.passed = passed;
        assessmentResult.submitted = submitted;

        scoreDisplay.textContent = `Score: ${score} / ${assessmentResult.total}`;
        passMessage.classList.remove("pass", "fail");

        if (!submitted) {
            passMessage.textContent = "Submit your answers to see your result.";
        } else if (passed) {
            passMessage.textContent = "Passed. Good work, you are ready to continue practicing.";
            passMessage.classList.add("pass");
        } else {
            passMessage.textContent = "Not yet passed. Review the tutorial and retake the assessment.";
            passMessage.classList.add("fail");
        }

        // Future database integration hook. These data attributes mirror the
        // current score so an API call can later persist them to SQLite.
        resultData.dataset.score = String(score);
        resultData.dataset.total = String(assessmentResult.total);
        resultData.dataset.passed = String(passed);
    }

    function saveAssessmentResult(score) {
        fetch(`/progress/api/assessment/${assessmentSlug}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ score, total: assessmentResult.total }),
        }).catch(() => {
            // The visible score remains available even if backend persistence fails.
        });
    }

    updateResult(0, false, false);
});
```

### frontend/static/css/assessment.css

```css
.assessment-hero {
    align-items: center;
    background: #f2f7fb;
    border-bottom: 1px solid #d8e5ec;
    display: flex;
    gap: 20px;
    justify-content: space-between;
    padding: 38px max(20px, calc((100vw - 1160px) / 2));
}

.assessment-hero h1 {
    font-size: clamp(2rem, 4vw, 3.15rem);
    margin-bottom: 10px;
}

.assessment-hero p:last-child {
    color: #4b5f6b;
    max-width: 760px;
}

.back-link {
    background: #ffffff;
    border: 1px solid #c4d3dc;
    border-radius: 8px;
    color: #175c75;
    font-weight: 800;
    padding: 12px 16px;
    white-space: nowrap;
}

.assessment-layout {
    align-items: start;
    display: grid;
    gap: 22px;
    grid-template-columns: 300px minmax(0, 1fr);
    margin: 0 auto;
    max-width: 1160px;
    padding: 26px 20px 56px;
}

.assessment-status,
.assessment-form {
    background: #ffffff;
    border: 1px solid #d8e5ec;
    border-radius: 8px;
    padding: 20px;
}

.assessment-status {
    position: sticky;
    top: 18px;
}

.assessment-status h2 {
    font-size: 1.12rem;
    margin-bottom: 12px;
}

.score-display {
    color: #0f3443;
    font-size: 1.5rem;
    font-weight: 900;
    margin-bottom: 10px;
}

.pass-message {
    background: #f6fafb;
    border-radius: 8px;
    color: #334155;
    margin-bottom: 14px;
    padding: 10px;
}

.pass-message.pass {
    background: #ecfdf3;
    color: #166534;
}

.pass-message.fail {
    background: #fff7ed;
    color: #9a3412;
}

.retake-button,
.dashboard-button,
.submit-button {
    border-radius: 8px;
    cursor: pointer;
    display: block;
    font: inherit;
    font-weight: 900;
    padding: 11px 14px;
    text-align: center;
    width: 100%;
}

.retake-button,
.submit-button {
    background: #175c75;
    border: 0;
    color: #ffffff;
}

.dashboard-button {
    background: #ffffff;
    border: 1px solid #c4d3dc;
    color: #175c75;
    margin-top: 10px;
}

.assessment-form {
    display: grid;
    gap: 14px;
}

.assessment-form fieldset {
    border: 1px solid #e1e8ee;
    border-radius: 8px;
    padding: 14px;
}

.assessment-form legend {
    color: #0f3443;
    font-weight: 900;
    padding: 0 6px;
}

.assessment-form label {
    color: #334155;
    display: block;
    margin-top: 9px;
}

.assessment-form fieldset.correct {
    background: #ecfdf3;
    border-color: #a7f3c4;
}

.assessment-form fieldset.incorrect {
    background: #fff1f2;
    border-color: #fecdd3;
}

.feedback-panel {
    background: #f6fafb;
    border-radius: 8px;
    color: #334155;
    display: none;
    padding: 14px;
}

.feedback-panel.visible {
    display: block;
}

.feedback-panel ul {
    margin: 8px 0 0;
    padding-left: 20px;
}

@media (max-width: 860px) {
    .assessment-hero {
        align-items: flex-start;
        flex-direction: column;
        padding: 32px 20px;
    }

    .assessment-layout {
        grid-template-columns: 1fr;
    }

    .assessment-status {
        position: static;
    }
}
```

### frontend/static/css/progress.css

```css
.progress-page {
    display: grid;
    gap: 20px;
    min-width: 0;
}

.overall-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    min-width: 0;
}

.overall-grid article,
.overall-bar-card,
.progress-device-card,
.progress-section-card {
    background: #ffffff;
    border: 1px solid #d8e5ec;
    border-radius: 8px;
    min-width: 0;
    padding: 20px;
}

.overall-grid span,
.status-grid span {
    color: #5d6b82;
    display: block;
    font-weight: 800;
    margin-bottom: 8px;
}

.overall-grid strong {
    color: #0f3443;
    display: block;
    font-size: 1.8rem;
    line-height: 1;
}

.section-heading-row,
.device-card-heading {
    align-items: center;
    display: flex;
    gap: 14px;
    justify-content: space-between;
}

.section-heading-row h2,
.device-card-heading h2 {
    font-size: 1.2rem;
    margin: 0;
}

.large-progress-bar {
    background: #e8f0f5;
    border-radius: 999px;
    height: 14px;
    margin-top: 16px;
    overflow: hidden;
}

.large-progress-bar span {
    background: #0f766e;
    display: block;
    height: 100%;
}

.device-progress-list {
    display: grid;
    gap: 18px;
    min-width: 0;
}

.progress-device-card {
    display: grid;
    gap: 16px;
    width: 100%;
}

.device-card-heading {
    justify-content: flex-start;
}

.device-icon {
    align-items: center;
    background: linear-gradient(135deg, #e0f2fe, #ccfbf1);
    border: 1px solid #bae6fd;
    border-radius: 8px;
    color: #075985;
    display: flex;
    font-weight: 900;
    height: 64px;
    justify-content: center;
    width: 64px;
}

.device-card-heading p {
    color: #5d6b82;
    margin: 4px 0 0;
}

.status-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    min-width: 0;
}

.status-grid div {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    min-width: 0;
    padding: 14px;
}

.status-grid strong {
    color: #0f3443;
    display: block;
    margin-bottom: 10px;
}

.status-grid a {
    color: #1864ab;
    font-weight: 900;
}

.section-heading-row p {
    color: #5d6b82;
    margin: 4px 0 0;
}

.achievement-grid {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin-top: 18px;
    min-width: 0;
}

.achievement-card {
    align-items: center;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    display: grid;
    gap: 12px;
    grid-template-columns: 46px minmax(0, 1fr);
    padding: 16px;
}

.achievement-card.earned {
    background: #f0fdf4;
    border-color: #a7f3c4;
}

.achievement-icon {
    align-items: center;
    background: #e8f0f5;
    border-radius: 50%;
    color: #64748b;
    display: flex;
    font-weight: 900;
    height: 42px;
    justify-content: center;
    width: 42px;
}

.achievement-card.earned .achievement-icon {
    background: #19a974;
    color: #ffffff;
}

.achievement-card h3 {
    font-size: 0.98rem;
    margin: 0 0 3px;
}

.achievement-card p {
    color: #5d6b82;
    margin: 0;
}

.progress-lower-grid {
    display: grid;
    gap: 18px;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    min-width: 0;
}

.action-list {
    display: grid;
    gap: 10px;
    margin-top: 14px;
}

.action-list a {
    background: #f8fafc;
    border: 1px solid #d9e2ec;
    border-radius: 8px;
    color: #172033;
    font-weight: 800;
    padding: 12px 14px;
}

.action-list a:hover {
    border-color: #1864ab;
    color: #1864ab;
}

.learning-timeline ul {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
}

.learning-timeline li {
    border-bottom: 1px solid #e5edf5;
    color: #5d6b82;
    display: grid;
    gap: 12px;
    grid-template-columns: 16px minmax(0, 1fr);
    padding: 12px 0;
}

.learning-timeline li:last-child {
    border-bottom: 0;
}

.timeline-dot {
    background: #2dd4bf;
    border: 3px solid #e0f7f4;
    border-radius: 50%;
    height: 14px;
    margin-top: 3px;
    width: 14px;
}

.learning-timeline strong {
    color: #172033;
}

.learning-timeline p {
    margin: 3px 0;
}

.learning-timeline small {
    color: #94a3b8;
    font-weight: 800;
}

.empty-analytics-state {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    color: #5d6b82;
    margin-top: 14px;
    padding: 16px;
}

.empty-analytics-state strong {
    color: #172033;
}

.empty-analytics-state p {
    margin: 6px 0 0;
}

@media (max-width: 900px) {
    .overall-grid,
    .status-grid,
    .achievement-grid,
    .progress-lower-grid {
        grid-template-columns: 1fr;
    }

    .section-heading-row {
        align-items: flex-start;
        flex-direction: column;
    }

}

@media (max-width: 768px) {
    .progress-page {
        gap: 18px;
    }

    .overall-grid {
        gap: 12px;
    }

    .overall-grid article,
    .overall-bar-card,
    .progress-device-card,
    .progress-section-card {
        padding: 18px;
        width: 100%;
    }

    .overall-grid strong {
        font-size: 1.45rem;
    }

    .device-card-heading {
        align-items: flex-start;
        flex-direction: column;
    }

    .status-grid {
        gap: 12px;
    }

    .status-grid strong,
    .achievement-card h3,
    .learning-timeline strong {
        overflow-wrap: break-word;
    }

    .achievement-card {
        grid-template-columns: 38px minmax(0, 1fr);
        padding: 14px;
    }

    .achievement-icon {
        height: 36px;
        width: 36px;
    }
}
```

## Template Files

```text
frontend/templates/_dashboard_sidebar.html
frontend/templates/arduino.html
frontend/templates/arduino_assessment.html
frontend/templates/arduino_tutorial.html
frontend/templates/base.html
frontend/templates/dashboard.html
frontend/templates/index.html
frontend/templates/instructor_dashboard.html
frontend/templates/learning_directory.html
frontend/templates/login.html
frontend/templates/multimeter.html
frontend/templates/multimeter_assessment.html
frontend/templates/multimeter_tutorial.html
frontend/templates/oscilloscope.html
frontend/templates/oscilloscope_assessment.html
frontend/templates/oscilloscope_tutorial.html
frontend/templates/placeholder.html
frontend/templates/progress.html
frontend/templates/register.html
frontend/templates/tutorial.html
```

## JavaScript Files

```text
frontend/static/js/arduino.js
frontend/static/js/assessment.js
frontend/static/js/dashboard.js
frontend/static/js/main.js
frontend/static/js/multimeter.js
frontend/static/js/oscilloscope.js
frontend/static/js/tutorial.js
```

## Recent Changes

- Deployment readiness was improved for Render, including production startup support, Gunicorn configuration, deployment metadata, and safer ignored/generated-file handling.
- Database initialization was hardened so required SQLite tables, including `users`, are created safely on first startup without overwriting existing data.
- The homepage was visually polished with a more professional educational-platform feel, including a technical hero illustration, subtle background treatment, statistics strip, "How SimLearn Works" section, smoother navbar/hero interactions, and a revised CTA order that now recommends tutorials before simulations.
- Login and Register pages received route-aware navigation cleanup, subtle entrance animations, password show/hide controls, improved focus states, better flash styling, form persistence after validation errors, specific login feedback, and live password-match feedback.
- The dashboard was simplified into a calmer learning hub with a welcome message, overall progress summary, recommended Tutorial to Simulation to Assessment to Progress flow, and three main device cards.
- Dashboard/sidebar navigation was refined: duplicate Dashboard links were removed, sidebar links were reordered, compact icons were added, a small close control replaced bulky close text, and shared open/close behavior now works across Dashboard, Tutorials, Simulations, Assessments, and Progress.
- Mobile layout issues on Tutorials and other shared learning pages were addressed by making directory cards, metadata boxes, buttons, progress grids, and dashboard containers fluid and full-width on small screens.
- Tutorials, Simulations, Assessments, and Progress directory pages were made more structured and consistent, with clearer cards, metadata rows, and cleaner spacing.
- Simulation page headers were made more compact and consistent, with redundant Dashboard toolbar links removed and a Simulation Switcher added for direct movement between DMM, Oscilloscope, and Arduino labs.
- The Digital Multimeter lab was redesigned around a cleaner electronics workbench layout, compact components panel, larger circuit workspace, compact learning assistant, realistic polarity behavior, empty initial workspace, improved probe snapping, probe layering, anchor points, and corrected probe orientation.
- The DMM workspace was extended so students can place and rearrange multiple components for simple circuits while preserving existing measurement behavior.
- The Oscilloscope lab was cleaned up by moving long educational content to tutorials, redesigning the lab layout, improving the signal workspace, resetting source connections on source changes, preventing connection while powered off, improving probe connection visuals, enlarging measurement readings, and adding optional sound for supported sources without autoplay.
- The Arduino lab evolved from a feature-heavy simulator into a guided beginner lesson workspace with lessons, task progression, wiring validation, USB/upload/run flow, output tabs, lesson completion, workspace clearing, and Free Build mode.
- The Arduino Uno board was made more interactive while preserving its visual style, including hover tooltips, clickable board parts, pin state highlights, USB/reset interactions, built-in LED behavior, and improved board spacing/scaling.
- Arduino breadboard and wiring interactions were improved with guided wiring, wire colors, movable/snappable components, reset wiring behavior, and clearer component placement.
- Free Build gained navigation back to guided lessons, workspace clearing, save/load support through local storage, saved-state indicators, and safer leave/clear confirmations.

