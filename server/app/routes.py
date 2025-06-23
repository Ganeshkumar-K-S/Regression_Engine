import os
from flask import Blueprint, request, jsonify, current_app,session
from app.utils import get_attributes,to_dataframe,from_dataframe
from app.regression import Model,generateModel,generateGLSModel
import app.cache as cache
import app.utils as utils
import numpy as np
import uuid

engine = Blueprint('engine', __name__)

@engine.get('/getattributes/<name>/<format>')
def send_attributes(name, format):
    try:
        upload_dir = current_app.config['UPLOAD_FOLDER']
        if 'uid' not in session:
            session['uid']='u0001'
        #     raise KeyError('uid not in session')
        
        uid=session.get('uid','123')
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

@engine.route('/clearcache', methods=['POST', 'DELETE'])
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
    
@engine.route('/gettargetfeature', methods=['POST'])
def get_target_feature():
    uid=session.get('uid')
    print(uid)
    try:
        response=request.get_json()
        if 'uid' not in session:
            raise KeyError('uid not in session')
        uid=session.get('uid')
        if 'target' not in response:
            raise KeyError('target is not in the session')
        if 'feature' not in response:
            raise KeyError('feature is not in the session')
        cache.cache[uid]['target']=response['target']
        cache.cache[uid]['feature']=response['feature']
        return jsonify(response)
    except Exception as e:
        return jsonify({"error":str(e)})
    
@engine.route('/getnull',methods=['GET'])
def send_null_attributes():
    res={}
    try:
        if 'uid' not in session:
            raise KeyError('uid not in session')
        uid=session.get('uid')

        if 'feature' not in cache.cache[uid]:
            raise KeyError('feature not in the session')
        if 'target' not in cache.cache[uid]:
            raise KeyError('Target not in session')
        if 'df' not in cache.cache[uid]:
            raise KeyError("dataframe is not in cache")
        
        target=cache.cache[uid]['target']
        feature=cache.cache[uid]['feature']
        cache.cache[uid]['df']= cache.cache[uid]['df'][[target] + feature]
        df=cache.cache[uid]['df']
        for col in df.columns:
            count= df[col].isna().sum()
            if count > 0:
                res[col]=int(count)
        print(res)
        return jsonify(res)
    except Exception as e:
        return jsonify({"error":str(e)})
    
@engine.route('/treat-null', methods=['POST'])
def api_treat_null():
    try:
        response = request.get_json()
        if 'uid' not in session:
            session['uid']='u0001'

        uid = session.get('uid')

        for col_name, config in response.items():
            method = config.get('method')
            value = config.get('value', None)

            if method is None:
                return jsonify({'error': f'Method missing for column "{col_name}"'}), 400

            # Apply treatment
            cache.cache[uid]['df'] = utils.treat_null(
                cache.cache[uid]['df'], col_name, method, value
            )

        return jsonify({'message': 'Null treatment applied successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@engine.route('/makemodel',methods=['GET'])
def make_model():
    try: 
        if 'uid' not in session:
                # raise KeyError('Uid is not in the session')
                session['uid']='u0001'
        uid=session.get("uid")
        if uid not in cache.cache:
            raise KeyError('Uid not in cache')

        if 'feature' not in cache.cache[uid]:
            raise KeyError('feature not in the session')
        if 'target' not in cache.cache[uid]:
            raise KeyError('Target not in session')
        if 'df' not in cache.cache[uid]:
            raise KeyError("dataframe is not in cache")
        target=cache.cache[uid]['target']
        feature=cache.cache[uid]['feature']
        df=cache.cache[uid]['df']
        cache.cache[uid]['model']=Model(df,target=target,features=feature)

        return jsonify({"message" : "model created successfully"}),200
    except Exception as e:
        return jsonify({"Error":str(e)})
    

@engine.route('/assumptions')
def api_assumptions():
    try:
        if 'uid' not in session:
                session['uid']='u0001'
        uid=session.get("uid")

        if uid not in cache.cache:
            raise KeyError('Uid not in cache')
        if 'model' not in cache.cache[uid]:
            raise KeyError('model is not in the cache')
        model=cache.cache[uid]['model']
        
        target_transform=False


        # assumption - 3
        test_result_3=utils.normality_of_errors_test(model.getModel())
        y_pred = model.getModel().predict(model.X_test)
        residuals = model.y_test - y_pred

        y_pred = np.array(y_pred, dtype=np.float64)
        residuals = np.array(residuals, dtype=np.float64)

        utils.plot_equal_variance(uid, y_pred, residuals)

        target_transform=(test_result_3['result']=="failure")
        

        # assumption - 4
        test_result_4=utils.perfect_multicollinearity_test(model.X_train,list(model.X_train.columns))
        print(test_result_4)
        utils.plot_correlation_heatmap(uid,model.X_train,list(model.X_train.columns))


        # assumption - 5
        test_result_5=utils.equal_variance_test(model.getModel())
        utils.plot_equal_variance(uid,y_pred,residuals)

        target_transform=(test_result_5['result']=="failure")

        if target_transform:
                    model.y_train[model.target]=np.log(model.y_train['target'])
                    model.y_test[model.target]=np.log(model.y_test['target'])
                    model.setModel(generateModel(model.y_train,model.X_train))

        return jsonify(test_result_5)
        
    except Exception as e:
        return jsonify({"Error":str(e)})