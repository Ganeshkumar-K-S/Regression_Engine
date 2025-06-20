import os
from flask import Blueprint, request, jsonify, current_app
from app.utils import get_attributes,to_dataframe,from_dataframe
import app.cache as cache

engine = Blueprint('engine', __name__)

@engine.get('/getattributes/<name>/<format>')
def send_attributes(name,format):
    cache.base_dir = os.path.dirname(os.path.abspath(__file__))
    cache.uploads_path = os.path.join(cache.base_dir, 'uploads', f"{name}.{format}")
    cache.format=format
    cache.df = to_dataframe(cache.uploads_path,format)
    res=get_attributes(cache.df)
    return jsonify(res)

@engine.get('/getdataframejson')
def send_dataframe():
    res={}
    try:
        if cache.df is None:
            raise ValueError('df frame is empty')
        res=from_dataframe(cache.df,'json')
    except ValueError as e:
        res=jsonify({'error':str(e)})
    finally:
        return res

    
