import os
from flask import Blueprint, request, jsonify, current_app
from app.utils import get_attributes
import pandas as pd
import app.cache as cache

engine = Blueprint('engine', __name__)

@engine.route('/getattributes/<name>/<format>')
def send_attributes(name,format):
    cache.base_dir = os.path.dirname(os.path.abspath(__file__))
    cache.uploads_path = os.path.join(cache.base_dir, 'uploads', f"{name}.{format}")
    cache.df = pd.read_csv(cache.uploads_path)
    res=get_attributes(cache.df)
    return jsonify(res)


