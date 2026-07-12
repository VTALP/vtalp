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
