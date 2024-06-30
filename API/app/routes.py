from flask import Blueprint, request, jsonify, url_for
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, set_access_cookies, unset_jwt_cookies
from .email_utils import send_reset_email, verify_reset_token, send_verification_email, verify_token
from .models import User
from . import db

main = Blueprint('main', __name__)


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
    return jsonify(user=current_user), 200


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