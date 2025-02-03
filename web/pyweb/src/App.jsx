import React, { useState } from 'react';
// import './agriculture-theme.css';

const PredictCrop = () => {
	const [nitrogen, setNitrogen] = useState('');
	const [phosphorus, setPhosphorus] = useState('');
	const [potassium, setPotassium] = useState('');
	const [temperature, setTemperature] = useState('');
	const [humidity, setHumidity] = useState('');
	const [ph, setPh] = useState('');
	const [rainfall, setRainfall] = useState('');
	const [prediction, setPrediction] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true); // Start loading

		const features = {
			nitrogen: parseFloat(nitrogen),
			phosphorus: parseFloat(phosphorus),
			potassium: parseFloat(potassium),
			temperature: parseFloat(temperature),
			humidity: parseFloat(humidity),
			ph: parseFloat(ph),
			rainfall: parseFloat(rainfall)
		};

		try {
			const response = await fetch('http://127.0.0.1:5000/', {
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
			// Update the prediction according to the response
			setPrediction(data.predicted_crop || data.error);
		} catch (error) {
			console.error("Error:", error);
			setPrediction("Error occurred while predicting.");
		} finally {
			setLoading(false); // End loading once the request is done
		}
	};

	return (
		<div className="container">
			<h2>Smart Crop Prediction System</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Nitrogen:</label>
					<input
						type="number"
						value={nitrogen}
						onChange={(e) => setNitrogen(e.target.value)}
						className="form-control"
						required
					/>
				</div>
				<div className="form-group">
					<label>Phosphorus:</label>
					<input
						type="number"
						value={phosphorus}
						onChange={(e) => setPhosphorus(e.target.value)}
						className="form-control"
						required
					/>
				</div>
				<div className="form-group">
					<label>Potassium:</label>
					<input
						type="number"
						value={potassium}
						onChange={(e) => setPotassium(e.target.value)}
						className="form-control"
						required
					/>
				</div>
				<div className="form-group">
					<label>Temperature:</label>
					<input
						type="number"
						value={temperature}
						onChange={(e) => setTemperature(e.target.value)}
						className="form-control"
						required
					/>
				</div>
				<div className="form-group">
					<label>Humidity:</label>
					<input
						type="number"
						value={humidity}
						onChange={(e) => setHumidity(e.target.value)}
						className="form-control"
						required
					/>
				</div>
				<div className="form-group">
					<label>pH:</label>
					<input
						type="number"
						value={ph}
						onChange={(e) => setPh(e.target.value)}
						className="form-control"
						required
					/>
				</div>
				<div className="form-group">
					<label>Rainfall:</label>
					<input
						type="number"
						value={rainfall}
						onChange={(e) => setRainfall(e.target.value)}
						className="form-control"
						required
					/>
				</div>
				<button type="submit" className="btn">
					Predict Crop
				</button>
			</form>
			<h3>
				{loading ? 'Loading prediction...' : `Prediction: ${prediction}`}
			</h3>
		</div>
	);
};

export default PredictCrop;
