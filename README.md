# Virtual Technology Access and Learning Platform (VTALP)

VTALP is a beginner-friendly Flask web application for learning and interacting with virtual technology instruments such as a Digital Multimeter, Oscilloscope, and Arduino Trainer.

## Project Structure

```text
VTALP/
├── app.py
├── requirements.txt
├── README.md
├── backend/
│   ├── __init__.py
│   └── routes.py
├── database/
│   ├── __init__.py
│   ├── connection.py
│   └── schema.sql
├── frontend/
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── main.js
│   └── templates/
│       ├── base.html
│       └── index.html
├── simulations/
│   ├── arduino/
│   ├── multimeter/
│   ├── oscilloscope/
│   ├── __init__.py
│   └── routes.py
├── tutorials/
│   ├── arduino/
│   ├── multimeter/
│   ├── oscilloscope/
│   ├── __init__.py
│   └── routes.py
└── assessments/
    ├── __init__.py
    └── routes.py
```

## Folder And File Purpose

- `app.py`: Starts the Flask application and connects all route modules.
- `requirements.txt`: Lists the Python packages needed to run the project.
- `README.md`: Explains the project setup, structure, and local run steps.
- `backend/`: Holds the main backend logic, such as homepage routes, authentication routes, dashboard routes, and progress tracking routes.
- `backend/device_catalog.py`: Defines the three core VTALP devices in one reusable catalog for dashboards, simulations, tutorials, and future tracking.
- `backend/routes.py`: Defines the homepage, registration, login, logout, and protected dashboard routes.
- `database/`: Stores database-related files.
- `database/connection.py`: Provides helper functions for opening SQLite, closing it safely, and initializing database tables.
- `database/schema.sql`: Contains the starter SQLite table definitions for users, progress, and assessment results.
- `frontend/templates/`: Stores HTML pages rendered by Flask.
- `frontend/templates/base.html`: Main page layout shared by other pages.
- `frontend/templates/index.html`: Basic homepage for the VTALP platform.
- `frontend/templates/register.html`: Registration form for new learners.
- `frontend/templates/login.html`: Login form for existing learners.
- `frontend/templates/dashboard.html`: Protected learner dashboard shown after login.
- `frontend/static/css/`: Stores CSS files.
- `frontend/static/css/style.css`: Main stylesheet for the starter interface.
- `frontend/static/js/`: Stores browser JavaScript files.
- `frontend/static/js/main.js`: Starter JavaScript file for frontend interactions.
- `simulations/`: Holds simulation-related routes and future simulation logic.
- `simulations/routes.py`: Defines routes for the Digital Multimeter, Oscilloscope, and Arduino Trainer simulations.
- `simulations/multimeter/`: Reserved module folder for Digital Multimeter simulation upgrades.
- `simulations/oscilloscope/`: Reserved module folder for Oscilloscope simulation upgrades.
- `simulations/arduino/`: Reserved module folder for Arduino Trainer simulation upgrades.
- `tutorials/`: Holds tutorial-related routes and future lesson content.
- `tutorials/routes.py`: Defines a starter tutorials page.
- `tutorials/multimeter/`: Reserved module folder for Digital Multimeter tutorial content.
- `tutorials/oscilloscope/`: Reserved module folder for Oscilloscope tutorial content.
- `tutorials/arduino/`: Reserved module folder for Arduino Trainer tutorial content.
- `assessments/`: Holds assessment-related routes and future quiz logic.
- `assessments/routes.py`: Defines a starter assessments page.

## How To Run Locally

1. Open a terminal in this project folder.
2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate the virtual environment:

```bash
venv\Scripts\activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Start the Flask app:

```bash
python app.py
```

6. Open the local address shown in the terminal, usually:

```text
http://127.0.0.1:5000
```

## Optional Database Setup

After installing the requirements, initialize the SQLite database with:

```bash
flask --app app init-db
```

This creates `database/vtalp.sqlite3` using the tables in `database/schema.sql`.

## Authentication System

Registration saves the learner's full name, email, hashed password, and creation date in the SQLite `users` table. Passwords are hashed with Werkzeug before storage, so the plain password is never saved.

Login checks the submitted email, verifies the password hash, then stores the user's `id`, `full_name`, and `email` in Flask's session. The dashboard checks the session before loading; users without a session are redirected to login.

Logout clears the session and redirects the learner to the homepage.

## Starter Pages

- Homepage: `http://127.0.0.1:5000/`
- Login: `http://127.0.0.1:5000/login`
- Register: `http://127.0.0.1:5000/register`
- Dashboard: `http://127.0.0.1:5000/dashboard`
- Simulations: `http://127.0.0.1:5000/simulations/`
- Digital Multimeter Simulation: `http://127.0.0.1:5000/simulations/multimeter`
- Oscilloscope Simulation: `http://127.0.0.1:5000/simulations/oscilloscope`
- Arduino Trainer Simulation: `http://127.0.0.1:5000/simulations/arduino`
- Tutorials: `http://127.0.0.1:5000/tutorials/`
- Digital Multimeter Tutorial: `http://127.0.0.1:5000/tutorials/multimeter`
- Oscilloscope Tutorial: `http://127.0.0.1:5000/tutorials/oscilloscope`
- Arduino Trainer Tutorial: `http://127.0.0.1:5000/tutorials/arduino`
- Assessments: `http://127.0.0.1:5000/assessments/`
