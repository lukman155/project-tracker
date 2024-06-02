from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, make_response, jsonify
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
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


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


class GetUsers(Resource):
    def get(self):
        users = User.query.all()
        user_list = []
        for user in users:
            user_data = {"id": user.id, 'username': user.username, 'password_hash': user.password_hash,
                         'email': user.email, 'created_at': user.created_at}
            user_list.append(user_data)
        return {'users': user_list}, 200


class GetProjects(Resource):
    def get(self):
        projects = Project.query.all()
        Project_list = []
        for project in projects:
            project_data = {"id": project.id, 'name': project.name, 'description': project.description,
                            'category': project.category, 'gps_location': project.gps_location,
                            "owner_id": project.owner_id,
                            'created_at': project.created_at, 'updated_at': project.updated_at}
            Project_list.append(project_data)
        return {"projects": Project_list}, 200


class AddUser(Resource):
    def post(self):
        if request.is_json:
            b = User(name=request.json['username'], email=request.json['email'], password=request.json['password_hash'],
                     created_at=request.json['created_at'])
            db.session.add(b)
            db.session.commit()
            return make_response(jsonify(
                {id: b.id, 'username': b.username, 'email': b.email, 'password_hash': b.password}), 201)
        else:
            return {"error": "error must be JSON"}


class AddProject(Resource):
    def post(self):
        if request.is_json:
            b = Project(name=request.json['name'], description=request.json['description'],
                        category=request.json['category'], gps_location=request.json['gps_location'],
                        owner_id=request.json['owner_id'], created_at=request.json['created_at'],
                        updated_at=request.json['updated_at'])
            db.session.add(b)
            db.session.commit()
            return make_response(jsonify({"id": b.id, "name": b.name, "location": b.location, "user_id": b.user_id}),
                                 201)
        else:
            return {"error": "error must be JSON"}


class DeleteUser(Resource):
    def delete(self, id):
        if request.is_json:
            user = User.query.get(id)
            if user is None:
                return {'error': 'Not Found'}, 404
            db.session.delete(user)
            db.session.commit()
            return f"user with ID:{id} is deleted"


# class UpdateUser(Resource):
#     def put(self, id):
#         if request.is_json:
#             user = User.query.get(id)
#             if user is None:
#                 return {'error': 'Not Found'}, 404
#             else:
#                 user.first_name = request.json['username']
#                 user.last_name = request.json['last_name']
#                 user.project = request.json['project']
#
#                 db.session.commit()
#                 return f"updated", 200
#         else:
#             return {"error": "error must be JSON"}


# Add API endpoint
api.add_resource(CreateTables, '/api/create')
api.add_resource(GetUsers, "/api/users")
api.add_resource(GetProjects, "/api/projects")
api.add_resource(AddProject, "/api/add/project")
