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

@app.route('/fertilizer', methods=['POST'])
def recommend_fertilizer():
    try:
        features = request.get_json()
        n = features.get('nitrogen')
        p = features.get('phosphorus')
        k = features.get('potassium')

        recommendations = []
        
        if n < 50:
            recommendations.append("Urea (46-0-0)")
        elif n < 100:
            recommendations.append("Ammonium Sulfate (21-0-0)")
            
        if p < 50:
            recommendations.append("Triple Superphosphate (0-45-0)")
        elif p < 100:
            recommendations.append("Rock Phosphate (0-20-0)")
            
        if k < 50:
            recommendations.append("Potassium Chloride (0-0-60)")
        elif k < 100:
            recommendations.append("Potassium Sulfate (0-0-50)")
            
        if not recommendations:
            recommendations.append("NPK levels are optimal. No specific fertilizer needed.")
            
        return jsonify({'recommended_fertilizer': recommendations})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/pesticide', methods=['POST'])
def suggest_pesticide():
    try:
        features = request.get_json()
        humidity = features.get('humidity')
        temperature = features.get('temperature')
        
        suggestions = []
        
        if humidity > 80:
            suggestions.append("Fungicide: Mancozeb - prevents fungal diseases in high humidity")
        if temperature > 30:
            suggestions.append("Insecticide: Neem oil - controls pests in warm conditions")
        if humidity > 70 and temperature > 25:
            suggestions.append("Preventive: Copper oxychloride - broad spectrum protection")
            
        if not suggestions:
            suggestions.append("Current conditions don't require immediate pesticide application")
            
        return jsonify({'suggested_pesticide': suggestions})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/irrigation', methods=['POST'])
def irrigation_scheduling():
    try:
        features = request.get_json()
        temperature = features.get('temperature')
        humidity = features.get('humidity')
        rainfall = features.get('rainfall')
        
        schedule = {}
        
        if rainfall > 200:
            schedule['frequency'] = "No irrigation needed - sufficient rainfall"
        elif temperature > 35 and humidity < 50:
            schedule['frequency'] = "Irrigate twice daily"
            schedule['amount'] = "15-20mm per session"
        elif temperature > 25:
            schedule['frequency'] = "Daily irrigation"
            schedule['amount'] = "20-25mm per day"
        else:
            schedule['frequency'] = "Irrigate every other day"
            schedule['amount'] = "25-30mm per session"
            
        schedule['note'] = "Adjust based on soil moisture and crop stage"
        
        return jsonify({'irrigation_schedule': schedule})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)