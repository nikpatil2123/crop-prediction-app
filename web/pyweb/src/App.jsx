// PredictCrop.jsx
import React, { useState, useEffect } from 'react';

const PredictCrop = () => {
	const [option, setOption] = useState('');
	const [nitrogen, setNitrogen] = useState('');
	const [phosphorus, setPhosphorus] = useState('');
	const [potassium, setPotassium] = useState('');
	const [temperature, setTemperature] = useState('');
	const [humidity, setHumidity] = useState('');
	const [ph, setPh] = useState('');
	const [rainfall, setRainfall] = useState('');
	const [result, setResult] = useState(null);
	const [loading, setLoading] = useState(false);
	const [currentDateTime, setCurrentDateTime] = useState('');
	const [userLogin] = useState('nikpatil2123'); // You can make this dynamic if needed

	useEffect(() => {
		// Update date time every second
		const timer = setInterval(() => {
			const now = new Date();
			setCurrentDateTime(now.toISOString().slice(0, 19).replace('T', ' '));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const handleOptionChange = (e) => {
		setOption(e.target.value);
		setResult(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const features = {
			nitrogen: parseFloat(nitrogen),
			phosphorus: parseFloat(phosphorus),
			potassium: parseFloat(potassium),
			temperature: parseFloat(temperature),
			humidity: parseFloat(humidity),
			ph: parseFloat(ph),
			rainfall: parseFloat(rainfall)
		};

		let endpoint = '';
		switch (option) {
			case 'predict':
				endpoint = 'http://127.0.0.1:5000/predict';
				break;
			case 'fertilizer':
				endpoint = 'http://127.0.0.1:5000/fertilizer';
				break;
			case 'pesticide':
				endpoint = 'http://127.0.0.1:5000/pesticide';
				break;
			case 'irrigation':
				endpoint = 'http://127.0.0.1:5000/irrigation';
				break;
			case 'climate-impact':
				endpoint = 'http://127.0.0.1:5000/climate-impact';
				break;
			default:
				return;
		}

		try {
			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(features),
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			setResult(data);
		} catch (error) {
			console.error("Error:", error);
			setResult({ error: "Error occurred while processing." });
		} finally {
			setLoading(false);
		}
	};

	const renderResult = () => {
		if (loading) {
			return <div className="loading-state">⏳ Processing your request...</div>;
		}

		if (result?.error) {
			return <div className="error-state">❌ {result.error}</div>;
		}

		if (option === 'climate-impact' && result?.climate_impact_analysis) {
			return (
				<div className="result-card climate-impact">
					<h3 className="result-header">🌍 Climate Impact Analysis</h3>
					<div className="result-details">
						<div className="result-item">
							<span className="result-label">🌡️ Temperature Impact:</span>
							<span className="result-value">
								{result.climate_impact_analysis.temperature_impact}
							</span>
						</div>
						<div className="result-item">
							<span className="result-label">💧 Humidity Impact:</span>
							<span className="result-value">
								{result.climate_impact_analysis.humidity_impact}
							</span>
						</div>
						<div className="result-item">
							<span className="result-label">🌧️ Rainfall Impact:</span>
							<span className="result-value">
								{result.climate_impact_analysis.rainfall_impact}
							</span>
						</div>
					</div>
					<div className="timestamp">
						<span>🕒 Analysis Time: {currentDateTime}</span>
					</div>
				</div>
			);
		}

		if (result) {
			return (
				<div className="result-card">
					<div className="result-header">
						{option === 'predict' && '🌱 Crop Prediction'}
						{option === 'fertilizer' && '💪 Fertilizer Recommendation'}
						{option === 'pesticide' && '🧪 Pesticide Suggestion'}
						{option === 'irrigation' && '💧 Irrigation Schedule'}
					</div>
					<div className="result-details">
						<div className="result-item highlight">
							{option === 'predict' && (
								<>
									<span className="result-label">Recommended Crop:</span>
									<span className="result-value">{result.predicted_crop}</span>
								</>
							)}
							{option === 'fertilizer' && (
								<>
									<span className="result-label">Recommended Fertilizer:</span>
									<ul className="result-value">
										{result.recommended_fertilizer.map((item, index) => (
											<li key={index}>{item}</li>
										))}
									</ul>
								</>
							)}
							{option === 'pesticide' && (
								<>
									<span className="result-label">Suggested Pesticide:</span>
									<ul className="result-value">
										{result.suggested_pesticide.map((item, index) => (
											<li key={index}>{item}</li>
										))}
									</ul>
								</>
							)}
							{option === 'irrigation' && result.irrigation_schedule && (
								<div className="irrigation-details">
									<p><strong>Frequency:</strong> {result.irrigation_schedule.frequency}</p>
									<p><strong>Amount:</strong> {result.irrigation_schedule.amount}</p>
									<p><strong>Note:</strong> {result.irrigation_schedule.note}</p>
								</div>
							)}
						</div>
					</div>
					<div className="timestamp">
						<span>🕒 Generated: {currentDateTime}</span>
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="container">
			<div className="header-info">
				<div className="datetime">🕒 {currentDateTime} UTC</div>
				<div className="user-info">👤 {userLogin}</div>
			</div>
			<h2>🌱 Smart Crop Prediction System 🌾</h2>
			<div className="panels-container">
				<div className="input-panel">
					<h3 className="panel-title">📝 Input Parameters</h3>
					<div className="form-group">
						<label>🎯 Choose an option:</label>
						<select value={option} onChange={handleOptionChange} className="form-control">
							<option value="" disabled>Select an option</option>
							<option value="predict">🌿 Predict Crop</option>
							<option value="fertilizer">💪 Recommend Fertilizer</option>
							<option value="pesticide">🧪 Suggest Pesticide</option>
							<option value="irrigation">💧 Irrigation Scheduling</option>
							<option value="climate-impact">🌍 Climate Impact Analysis</option>
						</select>
					</div>
					{option && (
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label>🧪 Nitrogen:</label>
								<input
									type="number"
									value={nitrogen}
									onChange={(e) => setNitrogen(e.target.value)}
									className="form-control"
									placeholder="0-200 mg/kg"
									min="0"
									max="200"
								/>
							</div>
							<div className="form-group">
								<label>⚡ Phosphorus:</label>
								<input
									type="number"
									value={phosphorus}
									onChange={(e) => setPhosphorus(e.target.value)}
									className="form-control"
									placeholder="0-100 mg/kg"
									min="0"
									max="100"
								/>
							</div>
							<div className="form-group">
								<label>🔋 Potassium:</label>
								<input
									type="number"
									value={potassium}
									onChange={(e) => setPotassium(e.target.value)}
									className="form-control"
									placeholder="0-500 mg/kg"
									min="0"
									max="500"
								/>
							</div>
							<div className="form-group">
								<label>🌡️ Temperature:</label>
								<input
									type="number"
									value={temperature}
									onChange={(e) => setTemperature(e.target.value)}
									className="form-control"
									placeholder="-10 to 50°C"
									min="-10"
									max="50"
									required={option === 'climate-impact'}
								/>
							</div>
							<div className="form-group">
								<label>💧 Humidity:</label>
								<input
									type="number"
									value={humidity}
									onChange={(e) => setHumidity(e.target.value)}
									className="form-control"
									placeholder="0-100%"
									min="0"
									max="100"
									required={option === 'climate-impact'}
								/>
							</div>
							<div className="form-group">
								<label>🧪 pH:</label>
								<input
									type="number"
									value={ph}
									onChange={(e) => setPh(e.target.value)}
									className="form-control"
									placeholder="4.0-9.0"
									min="4"
									max="9"
									step="0.1"
								/>
							</div>
							<div className="form-group">
								<label>🌧️ Rainfall:</label>
								<input
									type="number"
									value={rainfall}
									onChange={(e) => setRainfall(e.target.value)}
									className="form-control"
									placeholder="0-500 mm"
									min="0"
									max="500"
									required={option === 'climate-impact'}
								/>
							</div>
							<button type="submit" className="btn">
								{loading ? '⏳ Processing...' : '✨ Submit'}
							</button>
						</form>
					)}
				</div>
				<div className="result-panel">
					<h3 className="panel-title">📊 Results</h3>
					<div className="result-content">
						{renderResult()}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PredictCrop;