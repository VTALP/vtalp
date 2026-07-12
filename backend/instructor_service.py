"""Instructor dashboard helpers for VTALP.

This module keeps class-level analytics separate from learner progress logic.
The users table receives a simple role column: learner accounts stay as
students, while users promoted to instructor or admin can view this dashboard.
"""

from backend.device_catalog import CORE_DEVICES
from database.connection import get_db


def ensure_instructor_tables():
    """Create instructor-related fields/tables for new and existing databases."""
    db = get_db()

    try:
        db.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'student'")
    except Exception:
        # SQLite raises an error when the column already exists.
        pass

    db.execute(
        """
        CREATE TABLE IF NOT EXISTS login_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            email TEXT NOT NULL,
            logged_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
        """
    )
    db.commit()


def record_login_activity(user_id, email):
    """Record successful learner/instructor logins for the activity log."""
    ensure_instructor_tables()
    db = get_db()
    db.execute(
        "INSERT INTO login_activity (user_id, email) VALUES (?, ?)",
        (user_id, email),
    )
    db.commit()


def get_user_role(user_id):
    """Return the role for the current user, defaulting to student."""
    ensure_instructor_tables()
    db = get_db()
    user = db.execute("SELECT role FROM users WHERE id = ?", (user_id,)).fetchone()
    return user["role"] if user and user["role"] else "student"


def get_instructor_dashboard_data():
    """Build class-level progress, performance, and activity data."""
    ensure_instructor_tables()
    db = get_db()
    devices = {device["slug"]: device for device in CORE_DEVICES}

    total_users = db.execute("SELECT COUNT(*) AS total FROM users").fetchone()["total"]
    total_tutorials_completed = db.execute(
        "SELECT COUNT(*) AS total FROM completed_tutorials"
    ).fetchone()["total"]
    total_assessments_taken = db.execute(
        "SELECT COUNT(*) AS total FROM assessment_scores"
    ).fetchone()["total"]
    average_score = db.execute(
        "SELECT COALESCE(ROUND(AVG(percentage)), 0) AS average FROM assessment_scores"
    ).fetchone()["average"]
    completion_rate = db.execute(
        "SELECT COALESCE(ROUND(AVG(progress_percent)), 0) AS rate FROM user_progress"
    ).fetchone()["rate"]

    most_used_row = db.execute(
        """
        SELECT device_slug, SUM(opened_count) AS total_opened
        FROM simulation_activity
        GROUP BY device_slug
        ORDER BY total_opened DESC
        LIMIT 1
        """
    ).fetchone()
    most_used_device = (
        devices.get(most_used_row["device_slug"], {}).get("name", "No simulations yet")
        if most_used_row
        else "No simulations yet"
    )

    student_rows = db.execute(
        """
        SELECT id, full_name, email, role
        FROM users
        ORDER BY full_name
        """
    ).fetchall()
    students = []
    for student in student_rows:
        tutorial_count = db.execute(
            "SELECT COUNT(*) AS total FROM completed_tutorials WHERE user_id = ?",
            (student["id"],),
        ).fetchone()["total"]
        simulation_count = db.execute(
            "SELECT COUNT(*) AS total FROM simulation_activity WHERE user_id = ? AND used_count > 0",
            (student["id"],),
        ).fetchone()["total"]
        assessment_average = db.execute(
            "SELECT COALESCE(ROUND(AVG(percentage)), 0) AS average FROM assessment_scores WHERE user_id = ?",
            (student["id"],),
        ).fetchone()["average"]
        latest_score = db.execute(
            """
            SELECT score, total_questions, percentage
            FROM assessment_scores
            WHERE user_id = ?
            ORDER BY completed_at DESC, id DESC
            LIMIT 1
            """,
            (student["id"],),
        ).fetchone()

        students.append(
            {
                "name": student["full_name"],
                "email": student["email"],
                "role": student["role"] or "student",
                "tutorials_completed": tutorial_count,
                "simulations_used": simulation_count,
                "assessment_average": assessment_average,
                "latest_score": (
                    f"{latest_score['percentage']}% ({latest_score['score']}/{latest_score['total_questions']})"
                    if latest_score
                    else "No assessment"
                ),
            }
        )

    activity_log = get_student_activity_log(db, devices)

    return {
        "stats": {
            "total_users": total_users,
            "total_tutorials_completed": total_tutorials_completed,
            "total_assessments_taken": total_assessments_taken,
            "average_score": average_score,
            "completion_rate": completion_rate,
            "most_used_device": most_used_device,
        },
        "students": students,
        "activity_log": activity_log,
    }


def get_student_activity_log(db, devices):
    """Merge login, tutorial, and assessment records into one instructor log."""
    events = []

    login_rows = db.execute(
        """
        SELECT la.email, la.logged_in_at, users.full_name
        FROM login_activity la
        LEFT JOIN users ON users.id = la.user_id
        ORDER BY la.logged_in_at DESC
        LIMIT 20
        """
    ).fetchall()
    tutorial_rows = db.execute(
        """
        SELECT users.full_name, users.email, completed_tutorials.device_slug, completed_tutorials.completed_at
        FROM completed_tutorials
        JOIN users ON users.id = completed_tutorials.user_id
        ORDER BY completed_tutorials.completed_at DESC
        LIMIT 20
        """
    ).fetchall()
    assessment_rows = db.execute(
        """
        SELECT users.full_name, users.email, assessment_scores.device_slug,
               assessment_scores.percentage, assessment_scores.completed_at
        FROM assessment_scores
        JOIN users ON users.id = assessment_scores.user_id
        ORDER BY assessment_scores.completed_at DESC, assessment_scores.id DESC
        LIMIT 20
        """
    ).fetchall()

    for row in login_rows:
        events.append(
            {
                "type": "Login activity",
                "student": row["full_name"] or row["email"],
                "detail": "Logged in to VTALP",
                "timestamp": row["logged_in_at"],
            }
        )

    for row in tutorial_rows:
        events.append(
            {
                "type": "Tutorial completion",
                "student": row["full_name"],
                "detail": f"Completed {devices.get(row['device_slug'], {}).get('name', row['device_slug'])} tutorial",
                "timestamp": row["completed_at"],
            }
        )

    for row in assessment_rows:
        events.append(
            {
                "type": "Assessment attempt",
                "student": row["full_name"],
                "detail": f"Scored {row['percentage']}% on {devices.get(row['device_slug'], {}).get('name', row['device_slug'])}",
                "timestamp": row["completed_at"],
            }
        )

    events.sort(key=lambda event: event["timestamp"] or "", reverse=True)
    return events[:20]
