import os
from flask import Blueprint, request, jsonify, current_app
from app.utils import get_attributes,to_dataframe,from_dataframe
import app.cache as cache

engine = Blueprint('engine', __name__)

@engine.get('/getattributes/<name>/<format>')
def send_attributes(name, format):
    try:
        upload_dir = current_app.config['UPLOAD_FOLDER']
        cache.uploads_path = os.path.join(upload_dir, f"{name}.{format}")
        cache.format = format
        cache.df = to_dataframe(cache.uploads_path, format)
        res = get_attributes(cache.df)
        return jsonify(res)

    except Exception as e:
        print(str(e))
        return jsonify({'Error': str(e)}), 501


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

@engine.route('/uploads/', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return 'No file part in the request', 400

        uploaded_file = request.files['file']
        
        if uploaded_file.filename == '':
            return 'No selected file', 400

        ext = os.path.splitext(uploaded_file.filename)[1].lower()

        if ext not in ['.csv', '.json']:
            return 'Invalid file format. Only CSV and JSON are allowed.', 400

        save_filename = f'data{ext}'
        upload_dir = current_app.config['UPLOAD_FOLDER']

        # ✅ Ensure the directory exists
        os.makedirs(upload_dir, exist_ok=True)

        save_path = os.path.join(upload_dir, save_filename)

        uploaded_file.save(save_path)

        return f'File uploaded successfully as {save_filename}', 200

    except Exception as e:
        print(e)
        return jsonify({'Error': str(e)}), 501

