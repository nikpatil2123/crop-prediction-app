from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

# Load the saved model, scaler, and label encoder
with open('crop_model.pkl', 'rb') as f:
    model, scaler, label_encoder, _ = pickle.load(f)  # Adjusted to handle additional object

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/predict', methods=['POST'])
def predict():
    try:
        features = request.get_json()
        input_data = np.array([list(features.values())])
        scaled_data = scaler.transform(input_data)
        prediction = model.predict(scaled_data)
        predicted_label = label_encoder.inverse_transform(prediction)[0]
        return jsonify({'predicted_crop': predicted_label})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/climate-impact', methods=['POST'])
def climate_impact():
    try:
        climate_params = request.get_json()
        temperature = climate_params.get('temperature')
        humidity = climate_params.get('humidity')
        rainfall = climate_params.get('rainfall')

        impact_analysis = {
            'temperature_impact': f'High temperatures ({temperature}°C) can cause heat stress, while low temperatures can cause frost damage.',
            'humidity_impact': f'High humidity ({humidity}%) can promote fungal diseases, while low humidity can cause drought stress.',
            'rainfall_impact': f'High rainfall ({rainfall}mm) can cause waterlogging and root rot, while low rainfall can cause drought stress.'
        }

        return jsonify({'climate_impact_analysis': impact_analysis})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)