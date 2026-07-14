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
    """Display the VTALP homepage."""
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
    """Display the protected dashboard for VTALP's three core learning devices."""
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
