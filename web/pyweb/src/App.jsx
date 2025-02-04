import React, { useState } from 'react';

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

	const handleOptionChange = (e) => {
		setOption(e.target.value);
		setResult(null); // Reset result when option changes
	};

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
			setLoading(false); // End loading once the request is done
		}
	};

	const renderResult = () => {
		if (loading) {
			return <h3>Loading...</h3>;
		}

		if (result?.error) {
			return <h3>{result.error}</h3>;
		}

		if (option === 'climate-impact' && result?.climate_impact_analysis) {
			return (
				<div>
					<h3>Climate Impact Analysis:</h3>
					<p><strong>Temperature Impact:</strong> {result.climate_impact_analysis.temperature_impact}</p>
					<p><strong>Humidity Impact:</strong> {result.climate_impact_analysis.humidity_impact}</p>
					<p><strong>Rainfall Impact:</strong> {result.climate_impact_analysis.rainfall_impact}</p>
				</div>
			);
		}

		return result && <h3>Result: {JSON.stringify(result)}</h3>;
	};

	return (
		<div className="container">
			<h2>Smart Crop Prediction System</h2>
			<div className="form-group">
				<label>Choose an option:</label>
				<select value={option} onChange={handleOptionChange} className="form-control">
					<option value="" disabled>Select an option</option>
					<option value="predict">Predict Crop</option>
					<option value="fertilizer">Recommend Fertilizer</option>
					<option value="pesticide">Suggest Pesticide</option>
					<option value="irrigation">Irrigation Scheduling</option>
					<option value="climate-impact">Climate Impact Analysis</option>
				</select>
			</div>
			{option && (
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label>Nitrogen:</label>
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
						<label>Phosphorus:</label>
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
						<label>Potassium:</label>
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
						<label>Temperature:</label>
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
						<label>Humidity:</label>
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
						<label>pH:</label>
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
						<label>Rainfall:</label>
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
						Submit
					</button>
				</form>
			)}
			{renderResult()}
		</div>
	);
};

export default PredictCrop;