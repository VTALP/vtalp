from flask import Blueprint, render_template, session, url_for

from backend.device_catalog import CORE_DEVICES
from backend.progress_service import get_user_progress
from backend.routes import login_required


tutorials_bp = Blueprint("tutorials", __name__)


@tutorials_bp.route("/")
@login_required
def tutorial_home():
    """Display the protected tutorial landing page for all VTALP devices."""
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
