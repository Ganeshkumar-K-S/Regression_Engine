from flask import Flask
from flask_cors import CORS
from app.config import Config
from app.routes import engine

def create_app():
    app = Flask(
        __name__,
        static_folder='static',           # Root static folder
        static_url_path='/static'         # URL prefix to serve static files
    )
    app.config.from_object(Config)
    CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:*"]}})
    app.register_blueprint(engine, url_prefix='/api')
    return app
