from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from datetime import datetime
from flask_restful import Api, Resource

# Assuming you have already created your Flask app instance
app = Flask(__name__)

# Assuming you have configured your Flask app to use SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

api = Api(app)
# Create an instance of SQLAlchemy
db = SQLAlchemy(app)


# Define SQLAlchemy models

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.UTC)


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    gps_location = db.Column(db.String(50))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)


class Report(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime)


# Define UserRoles as a separate table
class UserRoles(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    role = db.Column(db.String(20), nullable=False)


class CreateTables(Resource):
    def get(self):
        db.create_all()


class Users(Resource):
    def get(self):
        users = User.query.all()
        user_list = []
        for user in users:
            user_data = {"id": user.id, 'username': user.username, 'password_hash': user.password_hash,
                         'email': user.email, 'created_at': user.created_at}
            user_list.append(user_data)
        return {'users': user_list}, 200


# Add API endpoint
api.add_resource(CreateTables,'/api/create')
api.add_resource(Users, "/api/users")

