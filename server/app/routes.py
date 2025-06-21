import os
from flask import Blueprint, request, jsonify, current_app,session
from app.utils import get_attributes,to_dataframe,from_dataframe
import app.cache as cache
import app.utils as utils
import uuid

engine = Blueprint('engine', __name__)

@engine.get('/getattributes/<name>/<format>')
def send_attributes(name, format):
    try:
        upload_dir = current_app.config['UPLOAD_FOLDER']
        if 'uid' not in session:
            raise KeyError('uid not in session')
        uid=session.get('uid')
        print(uid)
        cache.cache[uid]={}
        cache.cache[uid]['uploads_path'] = os.path.join(upload_dir, f"{name}.{format}")
        cache.cache[uid]['format'] = format
        cache.cache[uid]['df'] = to_dataframe(cache.cache[uid]['uploads_path'], format)
        res = get_attributes(cache.cache[uid]['df'])
        return jsonify(res)

    except Exception as e:
        print(str(e))
        return jsonify({'Error': str(e)})

@engine.get('/getdataframejson')
def send_dataframe():
    res={}
    try:
        if 'uid' not in session:
            raise KeyError("uid is not in the session")
        uid=session.get('uid')
        if cache.cache[uid]['df'] is None:
            raise ValueError('dataframe is empty')
        res=from_dataframe(cache.cache[uid]['df'],'json')
        return res
    except ValueError as e:
        res=jsonify({'error':str(e)})


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

        # Generate UUID and store in session
        file_uuid = str(uuid.uuid4())
        session['uid'] = file_uuid

        # Save the file
        save_filename = f"{file_uuid}{ext}"
        upload_dir = current_app.config['UPLOAD_FOLDER']
        os.makedirs(upload_dir, exist_ok=True)
        save_path = os.path.join(upload_dir, save_filename)
        uploaded_file.save(save_path)

        return jsonify({
            'message': f'File uploaded successfully as {save_filename}',
            'uuid': file_uuid
        }), 200

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 501

@engine.delete('/clearcache')
def clear_cache():
    try:
        if 'uid' not in session:
            raise ValueError('session does not have uid')
        
        uid = session.get('uid')
        if uid in cache.cache and 'uploads_path' in cache.cache[uid]:
            file_path = cache.cache[uid]['uploads_path']
            if os.path.exists(file_path):
                os.remove(file_path)
            else:
                raise FileNotFoundError("File not found")
        cache.cache.pop(uid, None)
        session.pop('uid', None)
        session.clear()
        return jsonify({'message': 'Cache and file cleared successfully'}), 200

    except ValueError as e:
        print(e)
        return jsonify({'error': str(e)}), 403

    except KeyError:
        print("uid not found in session")
        return jsonify({'error': 'uid not found in session'}), 404

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    
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
    
@engine.route('/treat-null/<method>', methods=['POST'])
def api_treat_null():
    status=200
    try:
        response = request.get_json()
        if 'uid' not in session:
            raise KeyError('uid not in session')
        uid=session.get('uid')

        for col_name, config in response.items():
            method = config.get('method')
            value = config.get('value', None)

            if method is None:
                return jsonify({'error': f'Method missing for column "{col_name}"'}), 400

            cache.cache[uid]['df'] = utils.treat_null(cache.cache[uid]['df'], col_name, method, value)

        return jsonify({'message': 'Null treatment applied successfully'}), 200 

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        return status

    