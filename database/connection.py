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

