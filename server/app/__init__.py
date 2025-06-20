from flask import Flask
from flask_cors import CORS
from app.config import Config

def create_app():
    app=Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    from app.routes import engine
    app.register_blueprint(engine,url_prefix='/api')

    return app