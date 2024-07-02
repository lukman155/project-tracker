from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail

from .config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()


def create_app(config_class=Config):
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
    
    app.config.from_object(config_class)
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    
    from .routes import main
    app.register_blueprint(main)
    
    return app