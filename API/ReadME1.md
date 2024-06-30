# Project Tracker

A project management application.

## Table of Contents

- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

    git clone <https://github.com/lukman155/project-tracker>
    cd project-tracker/api

2. Set up a virtual environment (optional but recommended):

    python -m venv venv (to create virtual environment)
    source venv/bin/activate  # On Windows use venv\Scripts\activate (to activate virtual env)

3. Install the required packages:

    pip install -r requirements.txt

## Database Setup

1. Initialize the database:

    flask db init

2. Create the initial migration:

    flask db migrate -m "Initial migration"

3. Apply the migration:

    flask db upgrade

**Note:** Run these commands only once to set up the database. Running them multiple times may result in loss of existing data.

## Running the Application

To start the application, run:

    python run.py

The application should now be running on `http://localhost:5000` (or whichever port you've configured).

## API Endpoints

## Contributing

Instructions for how to contribute to your project.

## License

Fully licensed for profit/commercial use.
