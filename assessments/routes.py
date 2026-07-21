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

