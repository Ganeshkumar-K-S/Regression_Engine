import os
from flask import Blueprint, request, jsonify, current_app,session 
from app.utils import get_attributes,to_dataframe,from_dataframe
from app.regression import Model
import app.cache as cache
import app.utils as utils
from app.utils import encode_image_to_base64
import numpy as np
import uuid

engine = Blueprint('engine', __name__)

@engine.get('/getattributes/<name>/<format>')
def send_attributes(name, format):
    try:
        upload_dir = current_app.config['UPLOAD_FOLDER']
        if 'uid' not in session:
            raise KeyError("uid not in session")
        uid=session.get('uid')
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
        print(f"UID in session: {uid}")  # ✅ Debug print

        # Delete uploaded file if it exists
        if uid in cache.cache and 'uploads_path' in cache.cache[uid]:
            file_path = cache.cache[uid]['uploads_path']
            print(f"Trying to delete uploaded file: {file_path}")  # ✅ Debug print
            if os.path.exists(file_path):
                os.remove(file_path)
            else:
                print("File not found")

        # Recursively delete files with uid in their name under /static/images
        base_dir = os.path.abspath(os.path.dirname(__file__))
        images_dir = os.path.join(base_dir, 'static', 'images')

        if os.path.exists(images_dir):
            for root, dirs, files in os.walk(images_dir):
                for file_name in files:
                    if uid in file_name:
                        file_path = os.path.join(root, file_name)
                        try:
                            os.remove(file_path)
                            print(f"Deleted: {file_path}")  # ✅ Confirm deletion
                        except Exception as e:
                            print(f"Error deleting {file_path}: {e}")

        # Clear cache and session
        cache.cache.pop(uid, None)
        session.pop('uid', None)
        session.clear()

        return jsonify({'message': 'Cache, file, and UID-related images cleared successfully'}), 200

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
        return response

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
            raise KeyError('uid not in session')

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
            raise KeyError('uid not in session')
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
        model=cache.cache[uid]['model']
        print(model.getMetrics()['adjusted_R2'])
        return jsonify({
            "message" : "model created successfully",
            "r2_score": model.getMetrics()['adjusted_R2']}),200
    except Exception as e:
        return jsonify({"Error":str(e)})
    
@engine.route('/treat-outliers', methods=['GET'])
def api_treat_outliers():
    try:
        if 'uid' not in session:
            raise KeyError('uid not in session')
      
        uid = session.get('uid')
        features=cache.cache[uid]['feature']
        df=cache.cache[uid]['df']
        utils.visualize_before_outliers(uid,features,df)
        cache.cache[uid]['df'] = utils.treat_outliers(
                cache.cache[uid]['df'],  2, features
            )
        utils.visualize_after_outliers(uid,features,cache.cache[uid]['df'])
        return jsonify({"message" : "Outliers treated successfully"}),200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@engine.route('/assumptions')
def api_assumptions():
    try:
        if 'uid' not in session:
            raise KeyError('uid not in session')
        uid=session.get("uid")

        if uid not in cache.cache:
            raise KeyError('Uid not in cache')
        if 'model' not in cache.cache[uid]:
            raise KeyError('model is not in the cache')
        model=cache.cache[uid]['model']
        target=cache.cache[uid]['target']
        feature=cache.cache[uid]['feature']
        target_transform=False
        df=cache.cache[uid]['df']
        y_pred = model.getModel().predict(model.X_test)
        residuals = model.y_test - y_pred

        y_pred = np.array(y_pred, dtype=np.float64)
        residuals = np.array(residuals, dtype=np.float64)

        # #assumption 1
        print(target)
        encoded_df=utils.concatenate_df(model.y_train,model.X_train)
        print(encoded_df)
        flattened = [f"{key}_{value}" for key, values in model.getOneHotMappings().items() for value in values]
        test_result_1=utils.linearity_test(encoded_df,target,list(model.X_train.columns),flattened)
        print(test_result_1)
        utils.visualize_linearity(uid, encoded_df, target,list(model.X_train.columns),flattened)

        #assumption 2
        test_result_2=utils.independence_of_errors_test(model.getModel())
        print(test_result_2)
        utils.visualize_independence_error(uid, y_pred, residuals)

        # fix_ind=(test_result_2['result']=='failure')
        
        # assumption - 3
        test_result_3=utils.normality_of_errors_test(model.getModel())    

        utils.plot_residual_histogram(uid,residuals)

        # target_transform=(test_result_3['result']=="failure")
        
        # assumption - 4
        test_result_4=utils.perfect_multicollinearity_test(model.X_train,list(model.X_train.columns))
        print(test_result_4)
        utils.plot_correlation_heatmap(uid,model.X_train,list(model.X_train.columns))


        # assumption - 5
        test_result_5=utils.equal_variance_test(model.getModel())
        utils.plot_equal_variance(uid,y_pred,residuals)

        # target_transform=(test_result_5['result']=="failure")

        # if target_transform:
        #     model.y_train=np.log(model.y_train)
        #     model.y_test=np.log(model.y_test)

        # if fix_ind:
        #     model.setModel(generateGLSModel(model.y_train,model.X_train))
        # elif target_transform:
        #     model.setModel(generateModel(model.y_train,model.X_train))
            
        
        res={
            "assumption_1":test_result_1,
            "assumption_2":test_result_2,
            "assumption_3":test_result_3,
            "assumption_4":test_result_4,
            "assumption_5":test_result_5
        }
        
        print(res)
        
        return jsonify(res)
        
    except Exception as e:
        return jsonify({"Error":str(e)})

@engine.route('/cross-validation', methods=['GET'])
def cross_validation_api():
    try:
        if 'uid' not in session:
            raise KeyError("uid not in session")
        uid=session.get("uid")
        
        if uid not in cache.cache:
            raise KeyError('Uid not in cache')
        
        if 'model' not in cache.cache[uid]:
            raise KeyError('model is not in the cache')
        
        model=cache.cache[uid]['model']

        result= utils.cross_validation(model.X_train,model.y_train)

        return result

    except Exception as e:
        return jsonify({"Error":str(e)})   

@engine.route('/getinference')
def get_inference():
    try:
        if 'uid' not in session:
            raise KeyError("uid not in the session")
        uid=session.get("uid")

        if uid not in cache.cache:
            raise KeyError('Uid not in cache')
        if 'model' not in cache.cache[uid]:
            raise KeyError('model is not in the cache')
        model=cache.cache[uid]['model']
        return jsonify(model.make_inference())
        
    except Exception as e:
        return jsonify({"Error":str(e)})
    
@engine.route('/getprediction',methods=['POST'])
def get_prediction():
    try:
        if 'uid' not in session:
            raise KeyError("uid not in the session")
        data=request.get_json()
        uid=session.get("uid")

        if uid not in cache.cache:
            raise KeyError('Uid not in cache')
        if 'model' not in cache.cache[uid]:
            raise KeyError('model is not in the cache')
        model=cache.cache[uid]['model']
        pred=utils.make_predictions(model,data=data)
        result={
            "result":pred
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"Error":str(e)})
    
@engine.route('/get-images', methods=['POST'])
def get_images_by_prefix():
    try:
        data = request.json
        folder = data.get('folderName')
        uuid = data.get('uuid')
        features = data.get('features', [])

        if not folder or not uuid or not features:
            return jsonify({"error": "Missing required fields"}), 400


        base_dir = os.path.abspath(os.path.dirname(__file__))
        static_folder = os.path.join(base_dir,'static', 'images', folder)
        if not os.path.exists(static_folder):
            return jsonify({"error": "Folder does not exist"}), 404

        matched_images = []
        for file in os.listdir(static_folder):
            for feature in features:
                if file.startswith(f"{uuid}{feature}") and file.endswith(".jpeg"):
                    file_path = os.path.join(static_folder, file)
                    base64_data = encode_image_to_base64(file_path)
                    matched_images.append({
                        "filename": file,
                        "base64": base64_data
                    })

        return jsonify(matched_images)

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

    
@engine.get('/getmetrics')
def get_metrics():
    try:
        if 'uid' not in session:
            raise KeyError("uid not in the session")
        uid=session.get("uid")

        if uid not in cache.cache:
            raise KeyError('Uid not in cache')
        if 'model' not in cache.cache[uid]:
            raise KeyError('model is not in the cache')
        model=cache.cache[uid]['model']
        return jsonify(model.getMetrics())
    except Exception as e:
        return jsonify({"Error":str(e)})

@engine.get('/getfeaturevalues')
def get_feature_values():
    try:
        if 'uid' not in session:
            raise KeyError("uid not in the session")
        uid=session.get("uid")

        if uid not in cache.cache:
            raise KeyError('Uid not in cache')
        if 'model' not in cache.cache[uid]:
            raise KeyError('model is not in the cache')
        model=cache.cache[uid]['model']
        res1=model.getOneHotMappings()
        res2 = model.getBayesMappings()
        res2 = {feature: list(mapping.keys()) for feature, mapping in res2.items()}
        res=res1 | res2
        return jsonify(res)

    except Exception as e:
        return jsonify({"Error":str(e)})


from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from flask import send_file

@engine.route('/generatereport')
def download_pdf():
    base_dir = os.path.abspath(os.path.dirname(__file__))
    template_dir = os.path.join(base_dir, 'templates')
    font_path_medium = os.path.join(base_dir, 'static', 'fonts', 'Montserrat-Medium.ttf')
    font_path_bold = os.path.join(base_dir, 'static', 'fonts', 'Montserrat-Bold.ttf')
    icon_path = os.path.join(base_dir, 'static', 'images', 'icon.svg')
    output_path = os.path.join(base_dir, 'static', 'downloads', 'styled_report.pdf')

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    env = Environment(loader=FileSystemLoader(template_dir))
    template = env.get_template('report.html')

    # Dummy data
    target = "Price"
    features = ["X", "Y", "Z", "table", "carat", "clarity"]
    equation=[' - 1.701\n', 
              ' - 0.672(carat)\n', 
              ' - 0.279(cut_Ideal)\n',
                ' - 0.323(cut_Premium)\n',
                  ' - 0.347(cut_Good)\n',
                    ' - 0.310(cut_Very Good)\n',
                      ' - 0.443(cut_Fair)\n',
                        ' - 0.091(color_E)\n',
                          ' - 0.418(color_I)\n',
                            ' - 0.556(color_J)\n',
                             ' - 0.291(color_H)\n', ' - 0.124(color_F)\n', ' - 0.191(color_G)\n', ' - 0.031(color_D)\n', ' - 0.481(clarity_SI2)\n', ' - 0.313(clarity_SI1)\n', ' - 0.104(clarity_VS1)\n', ' - 0.169(clarity_VS2)\n', ' + 0.019(clarity_VVS2)\n', ' + 0.087(clarity_VVS1)\n', ' - 0.920(clarity_I1)\n', ' + 0.180(clarity_IF)\n', ' + 0.050(depth)\n', ' + 0.009(table)\n', ' + 1.159(x)\n', ' + 0.024(y)\n', ' + 0.108(z)\n']

    result={
		"assumption_1": {
			"features": [
				"const",
				"clarity_SI1",
				"clarity_VS1",
				"clarity_VS2",
				"clarity_VVS2",
				"clarity_VVS1",
				"clarity_I1",
				"clarity_IF",
				"cut_Ideal",
				"cut_Premium",
				"cut_Good",
				"cut_Very Good",
				"cut_Fair"
			],
			"result": "failure"
		},
		"assumption_2": {
			"result": "success",
			"test_val_dbw": 1.9910171345615393
		},
		"assumption_3": {
			"result": "failure",
			"test_val_jb": 0.0
		},
		"assumption_4": {
			"high_vif_features": [
				"const",
				"clarity_SI2",
				"clarity_SI1",
				"clarity_VS1",
				"clarity_VS2",
				"clarity_VVS2",
				"clarity_VVS1",
				"clarity_I1",
				"clarity_IF",
				"cut_Ideal",
				"cut_Premium",
				"cut_Good",
				"cut_Very Good"
			],
			"result": "failure",
			"vif": {
				"clarity_I1": 6593850113280.4,
				"clarity_IF": 1356097448771.6,
				"clarity_SI1": 201465128.3,
				"clarity_SI2": 321697176854.2,
				"clarity_VS1": 8337567519.4,
				"clarity_VS2": 5390304760467.4,
				"clarity_VVS1": 1125899906842624.0,
				"clarity_VVS2": 26036706.0,
				"const": 2329126222.0,
				"cut_Fair": 1.2,
				"cut_Good": 131086262293.9,
				"cut_Ideal": 143298485.3,
				"cut_Premium": 2792677145.1,
				"cut_Very Good": 181332733.6
			}
		},
		"assumption_5": {
			"f_stat": 102.9324334840852,
			"lm_stat": 1394.9567487753548,
			"p_value": 1.9796547240158326e-289,
			"result": "failure"
		}
	}

    metrics={
        'MAE': 0.11022949369154744, 
         'MSE': 0.03722808672074357, 
         'RMSE': 0.19294581291322072, 
         'R2': 0.9633148813538335,
         'adjusted_R2': 0.9632842508623394
	}
    
    html_out = template.render(
        font_path_medium=font_path_medium,
        font_path_bold=font_path_bold,
        icon_path=icon_path,
        target=target,
        features=features,
        equation=equation,
        result=result,
        metrics=metrics
    )

    # Generate PDF
    HTML(string=html_out, base_url=base_dir).write_pdf(output_path)
    return send_file(output_path, as_attachment=True, download_name="styled_report.pdf")
