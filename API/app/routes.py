from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, set_access_cookies, unset_jwt_cookies
from werkzeug.utils import secure_filename
from .email_utils import send_reset_email, verify_reset_token, send_verification_email, verify_token
from .models import User, Project, Report, UserRoles
from datetime import datetime
from . import db, images

main = Blueprint('main', __name__)

# Auth Operations

@main.route('/api/register', methods=['POST'])
def register():
    name = request.json.get('name', None)
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    
    print(f"Received registration request: name={name}, email={email}")  # Debug print
    
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "Email already registered"}), 400
    
    try:
        new_user = User(email=email, name=name)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        print(f"Error creating user: {str(e)}")  # Debug print
        db.session.rollback()
        return jsonify({"msg": "Error creating user"}), 500
    
    try:
        send_verification_email(new_user)
    except Exception as e:
        print(f"Error sending verification email: {str(e)}")  # Debug print
        return jsonify({"msg": "User created but error sending verification email"}), 500
    
    return jsonify({"msg": "User created successfully. Please check your email to verify your account."}), 201

@main.route('/api/login', methods=['POST'])
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        if not user.is_verified:
            return jsonify({"msg": "Please verify your email before logging in"}), 401
        access_token = create_access_token(identity=email)
        response = jsonify({"msg": "Login successful", "user": {"email": email}})
        set_access_cookies(response, access_token)
        return response, 200
    
    return jsonify({"msg": "Bad email or password"}), 401


@main.route('/api/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response, 200

@main.route('/api/check-auth', methods=['GET'])
@jwt_required()
def check_auth():
    current_user = get_jwt_identity()
    return jsonify(user={"email": current_user}), 200


@main.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    email = request.json.get('email')
    user = User.query.filter_by(email=email).first()
    if user:
        send_reset_email(user)
    return jsonify({"message": "If an account with that email exists, a password reset link has been sent."}), 200


@main.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    email = verify_reset_token(token)
    if not email:
        return jsonify({"error": "Invalid or expired token"}), 400
    
    new_password = request.json.get('password')
    if not new_password:
        return jsonify({"error": "New password is required"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": "Password has been reset successfully"}), 200


@main.route('/api/resend-verification', methods=['POST'])
def resend_verification():
    email = request.json.get('email')
    user = User.query.filter_by(email=email).first()
    if user and not user.is_verified:
        send_verification_email(user)
        return jsonify({"message": "Verification email sent"}), 200
    return jsonify({"message": "User not found or already verified"}), 400


@main.route('/api/verify-email/<token>', methods=['GET'])
def verify_email(token):
    email = verify_token(token, 'email-verification-salt')
    if not email:
        return jsonify({"error": "Invalid or expired token"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if user.is_verified:
        return jsonify({"message": "Email already verified"}), 200
    
    user.is_verified = True
    db.session.commit()
    return jsonify({"message": "Email verified successfully"}), 200


# Project CRUD operations

@main.route('/api/projects', methods=['POST'])
@jwt_required()
def create_project():
    try:
        current_user = get_jwt_identity()
        user = User.query.filter_by(email=current_user).first()
        
        if not user:
            return jsonify({"msg": "User not found"}), 404

        name = request.form.get('name')
        description = request.form.get('description')
        category = request.form.get('category')
        gps_location = request.form.get('gps_location')

        image = request.files.get('image')
        image_filename = None
        if image:
            filename = secure_filename(image.filename)
            image_filename = images.save(image, name=filename)

        new_project = Project(
            name=name,
            description=description,
            category=category,
            gps_location=gps_location,
            owner_id=user.id,
            image_filename=image_filename
        )
        db.session.add(new_project)
        db.session.commit()

        return jsonify({
            "msg": "Project created successfully", 
            "id": new_project.id,
            "image_url": images.url(image_filename) if image_filename else None
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating project: {str(e)}")
        return jsonify({"msg": "Error creating project", "error": str(e)}), 500
    
@main.route('/api/projects', methods=['GET'])
@jwt_required()
def get_projects():
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    projects = Project.query.filter_by(owner_id=user.id).all()
    return jsonify([{
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "category": p.category,
        "gps_location": p.gps_location,
        "created_at": p.created_at,
        "updated_at": p.updated_at,
        "image_url": images.url(p.image_filename) if p.image_filename else None,

    } for p in projects]), 200

@main.route('/api/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    project = Project.query.get_or_404(project_id)
    return jsonify({
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "category": project.category,
        "gps_location": project.gps_location,
        "created_at": project.created_at,
        "updated_at": project.updated_at,
        "image_url": images.url(project.image_filename) if project.image_filename else None,
    }), 200

@main.route('/api/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    project = Project.query.get_or_404(project_id)
    data = request.json
    project.name = data.get('name', project.name)
    project.description = data.get('description', project.description)
    project.category = data.get('category', project.category)
    project.gps_location = data.get('gps_location', project.gps_location)
    project.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"msg": "Project updated successfully"}), 200

@main.route('/api/projects/<int:project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()
    return jsonify({"msg": "Project deleted successfully"}), 200

# Report CRUD operations
@main.route('/api/reports', methods=['POST'])
@jwt_required()
def create_report():
    data = request.json
    new_report = Report(
        project_id=data['project_id'],
        name=data['name'],
        description=data.get('description'),
        status=data.get('status', 'pending'),
        due_date=datetime.fromisoformat(data['due_date']) if 'due_date' in data else None
    )
    db.session.add(new_report)
    db.session.commit()
    return jsonify({"msg": "Report created successfully", "id": new_report.id}), 201

@main.route('/api/reports/<int:report_id>', methods=['GET'])
@jwt_required()
def get_report(report_id):
    report = Report.query.get_or_404(report_id)
    return jsonify({
        "id": report.id,
        "project_id": report.project_id,
        "name": report.name,
        "description": report.description,
        "status": report.status,
        "created_at": report.created_at,
        "updated_at": report.updated_at,
        "due_date": report.due_date,
        "image_url": url_for(report.image_filename),
    }), 200

@main.route('/api/reports/<int:report_id>', methods=['PUT'])
@jwt_required()
def update_report(report_id):
    report = Report.query.get_or_404(report_id)
    data = request.json
    report.name = data.get('name', report.name)
    report.description = data.get('description', report.description)
    report.status = data.get('status', report.status)
    report.due_date = datetime.fromisoformat(data['due_date']) if 'due_date' in data else report.due_date
    report.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"msg": "Report updated successfully"}), 200

@main.route('/api/reports/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    report = Report.query.get_or_404(report_id)
    db.session.delete(report)
    db.session.commit()
    return jsonify({"msg": "Report deleted successfully"}), 200

# UserRoles operations
@main.route('/api/user-roles', methods=['POST'])
@jwt_required()
def add_user_role():
    data = request.json
    new_role = UserRoles(
        user_id=data['user_id'],
        role=data['role']
    )
    db.session.add(new_role)
    db.session.commit()
    return jsonify({"msg": "User role added successfully", "id": new_role.id}), 201

@main.route('/api/user-roles/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_roles(user_id):
    roles = UserRoles.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": r.id, "role": r.role} for r in roles]), 200

@main.route('/api/user-roles/<int:role_id>', methods=['DELETE'])
@jwt_required()
def delete_user_role(role_id):
    role = UserRoles.query.get_or_404(role_id)
    db.session.delete(role)
    db.session.commit()
    return jsonify({"msg": "User role deleted successfully"}), 200
