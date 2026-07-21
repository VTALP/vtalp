"""Central device catalog for SimLearn's core learning devices.

Keeping device metadata here prevents the dashboard, simulations, and tutorials
from drifting apart when new learning devices are added later.
"""


CORE_DEVICES = [
    {
        "slug": "multimeter",
        "name": "Digital Multimeter",
        "icon": "DMM",
        "category": "Electrical Measurement",
        "description": "Practice DC voltage, resistance, and continuity measurements in a safe virtual workspace.",
        "simulation_summary": "Practice voltage, resistance, and continuity measurements.",
        "tutorial_summary": "Learn meter parts, safety rules, and measurement modes.",
        "learning_outcome": "Measure voltage, resistance, and continuity with correct probe placement.",
        "estimated_time": "15 min",
        "skill_practiced": "Meter setup, probe placement, and safe measurements",
        "assessment_questions": 5,
        "passing_score": "3 / 5",
        "simulation_endpoint": "simulations.multimeter",
        "tutorial_endpoint": "tutorials.multimeter",
        "assessment_endpoint": "assessments.multimeter",
        "status": "Working simulation",
    },
    {
        "slug": "oscilloscope",
        "name": "Oscilloscope",
        "icon": "OSC",
        "category": "Signal Analysis",
        "description": "Learn waveform viewing, voltage scale, time base, triggering, and signal interpretation.",
        "simulation_summary": "Explore live sine, square, and triangle waveforms with frequency and amplitude controls.",
        "tutorial_summary": "Learn waveform display, probes, volts/div, time/div, and triggering.",
        "learning_outcome": "Read waveform shape, frequency, amplitude, and display scale controls.",
        "estimated_time": "20 min",
        "skill_practiced": "Signal viewing, probe connection, and waveform measurement",
        "assessment_questions": 10,
        "passing_score": "7 / 10",
        "simulation_endpoint": "simulations.oscilloscope",
        "tutorial_endpoint": "tutorials.oscilloscope",
        "assessment_endpoint": "assessments.oscilloscope",
        "status": "Working simulation",
    },
    {
        "slug": "arduino",
        "name": "Arduino Trainer",
        "icon": "ARD",
        "category": "Embedded Systems",
        "description": "Practice microcontroller basics, digital input/output, analog readings, and simple circuits.",
        "simulation_summary": "Practice LEDs, button inputs, analog sensors, and servo control in a virtual Arduino lab.",
        "tutorial_summary": "Learn board parts, digital I/O, analog input, and beginner circuit control.",
        "learning_outcome": "Understand pins, code upload, sensors, and beginner circuit behavior.",
        "estimated_time": "25 min",
        "skill_practiced": "Wiring, sketch upload, input/output, and sensor simulation",
        "assessment_questions": 12,
        "passing_score": "8 / 12",
        "simulation_endpoint": "simulations.arduino",
        "tutorial_endpoint": "tutorials.arduino",
        "assessment_endpoint": "assessments.arduino",
        "status": "Working simulation",
    },
]


def build_dashboard_devices(url_for):
    """Return device cards with resolved dashboard simulation/tutorial links."""
    devices = []

    for device in CORE_DEVICES:
        devices.append(
            {
                "slug": device["slug"],
                "name": device["name"],
                "icon": device["icon"],
                "category": device["category"],
                "description": device["description"],
                "simulation_url": url_for(device["simulation_endpoint"]),
                "tutorial_url": url_for(device["tutorial_endpoint"]),
                "assessment_url": url_for(device["assessment_endpoint"]),
                "status": device["status"],
            }
        )

    return devices


def build_simulation_items(url_for):
    """Return simulation-list items for the shared placeholder listing page."""
    return [
        {
            "name": device["name"],
            "description": device["simulation_summary"],
            "url": url_for(device["simulation_endpoint"]),
        }
        for device in CORE_DEVICES
    ]


def build_tutorial_items(url_for):
    """Return tutorial-list items for the shared placeholder listing page."""
    return [
        {
            "name": f"{device['name']} Basics",
            "description": device["tutorial_summary"],
            "url": url_for(device["tutorial_endpoint"]),
        }
        for device in CORE_DEVICES
    ]


def get_device(slug):
    """Find one core device by slug for future assessments/progress tracking."""
    return next((device for device in CORE_DEVICES if device["slug"] == slug), None)

