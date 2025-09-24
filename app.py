from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os

# Initialize Flask app
app = Flask(__name__)

# Load the model
model_path = os.path.join('models', 'model.pkl')
model = joblib.load(model_path)

# Main routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/developer')
def developer():
    return render_template('developer.html')

@app.route('/predict')
def predict_form():
    return render_template('predict.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get form data
        data = request.get_json()
        
        
        input_dict = {
            'age': float(data.get('age', 50)),
            'trestbps': float(data.get('trestbps', 120)),
            'chol': float(data.get('chol', 200)),
            'fbs': 1 if data.get('fbs') == 'yes' else 0,
            'thalch': float(data.get('thalch', 150)),
            'exang': 1 if data.get('exang') == 'yes' else 0,
            'oldpeak': float(data.get('oldpeak', 1.0)),
            'ca': int(data.get('ca', 0)),
            'sex_Male': 1 if data.get('sex') == 'Male' else 0,
            'cp_atypical angina': int(data.get('cp') == 'atypical angina'),
            'cp_non-anginal': int(data.get('cp') == 'non-anginal'),
            'cp_typical angina': int(data.get('cp') == 'typical angina'),
            'restecg_normal': int(data.get('restecg') == 'normal'),
            'restecg_st-t abnormality': int(data.get('restecg') == 'st-t abnormality'),
            'slope_flat': int(data.get('slope') == 'flat'),
            'slope_upsloping': int(data.get('slope') == 'upsloping'),
            'thal_normal': int(data.get('thal') == 'normal'),
            'thal_reversable defect': int(data.get('thal') == 'reversable defect')
        }

        # Convert to DataFrame
        input_df = pd.DataFrame([input_dict])

        # Ensure column order
        expected_columns = [
            'age', 'trestbps', 'chol', 'fbs', 'thalch', 'exang', 'oldpeak', 'ca',
            'sex_Male', 'cp_atypical angina', 'cp_non-anginal', 'cp_typical angina',
            'restecg_normal', 'restecg_st-t abnormality', 'slope_flat',
            'slope_upsloping', 'thal_normal', 'thal_reversable defect'
        ]

        # Add any missing columns
        for col in expected_columns:
            if col not in input_df.columns:
                input_df[col] = 0

        input_df = input_df[expected_columns]

        # Make prediction
        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0]

        # Return result
        result = {
            'prediction': int(prediction),
            'probability': {
                'no_disease': float(probability[0]),
                'disease': float(probability[1])
            },
            'risk_level': 'High Risk' if prediction == 1 else 'Low Risk'
        }
        
        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)