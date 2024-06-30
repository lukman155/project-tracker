# Run
## Install Requirements 
#### pip install -r requirements.txt

## goto /create endpoint to create tables
#### Note: You only run once or risk loosing entries in db.


Database Initialization
To set up the database, run the following commands
flask db init
flask db migrate -m "Initial migration"
flask db upgrade