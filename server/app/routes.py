import os
from flask import Blueprint, request, jsonify, current_app,session
from app.utils import get_attributes,to_dataframe,from_dataframe
import app.cache as cache

engine = Blueprint('engine', __name__)

@engine.get('/getattributes/<name>/<format>')
def send_attributes(name, format):
    try:
        upload_dir = current_app.config['UPLOAD_FOLDER']
        if 'uid' not in session:
            raise ValueError('Uid not in session')
        uid=session.get('uid')
        cache.cache[uid]['uploads_path'] = os.path.join(upload_dir, f"{name}.{format}")
        cache.cache[uid]['format'] = format
        cache.cache[uid]['df'] = to_dataframe(cache.uploads_path, format)
        res = get_attributes(cache.cache[uid]['df'])
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
        uid=None
        session['uid']=uid
        uploaded_file = request.files['file']
        
        if uploaded_file.filename == '':
            return 'No selected file', 400

        ext = os.path.splitext(uploaded_file.filename)[1].lower()

        if ext not in ['.csv', '.json']:
            return 'Invalid file format. Only CSV and JSON are allowed.', 400

        save_filename = f'data{ext}'
        upload_dir = current_app.config['UPLOAD_FOLDER']

        os.makedirs(upload_dir, exist_ok=True)

        save_path = os.path.join(upload_dir, save_filename)

        uploaded_file.save(save_path)

        return f'File uploaded successfully as {save_filename}', 200

    except Exception as e:
        print(e)
        return jsonify({'Error': str(e)}), 501

@engine.route('/clearcache')
def clear_cache():
    status=200
    try:
         if 'uid' not in session:
             raise ValueError('session dont have uid')
         del session['uid']
    except ValueError as e:
        print(e)
        status=403
    except KeyError as e:
        print("uid not found in session")
        status=404
    finally:
        return status
    
@engine.post('/gettargetfeature')
def get_target_feature():
    status=200
    try:
        response=request.get_json()
        if 'uid' not in session:
            raise KeyError('uid not in session')
        uid=session.get('uid')
        cache.cache[uid]['target']=response['target']
        cache.cache[uid]['feature']=response['feature']
    except Exception as e:
        print(e)
        status=403
    finally:
        return status
    