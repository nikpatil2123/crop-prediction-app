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

@app.route('/', methods=['POST'])
def predict():
    try:
        # Get the features from the request
        features = request.get_json()  # Get the JSON data sent from React
        input_data = np.array([list(features.values())])  # Convert input to numpy array
        scaled_data = scaler.transform(input_data)  # Scale the input data
        
        # Make prediction
        prediction = model.predict(scaled_data)
        predicted_label = label_encoder.inverse_transform(prediction)[0]
        
        # Send the response back to the frontend
        return jsonify({'predicted_crop': predicted_label})
    
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)