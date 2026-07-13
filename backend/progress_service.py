"""User progress helpers for VTALP.

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
    """Return dashboard-ready progress data for all core VTALP devices."""
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
