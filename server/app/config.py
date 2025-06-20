import os
import secrets

class Config:
    DEBUG = True
    TESTING = False
    SECRET_KEY = os.environ.get("SECRET_KEY") or secrets.token_hex(32)
    CORS_HEADERS = 'Content-Type'
    
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
    
    MAX_CONTENT_LENGTH = 250 * 1024 * 1024  # 256 MB
    ALLOWED_EXTENSIONS = {'csv', 'json', 'xlsx', 'xls', 'txt'}
