# Crop Prediction System with Flask API & React Frontend

This project provides a smart crop prediction system that leverages an XGBoost model to recommend the best crop based on soil and climate parameters. The backend is implemented with a Flask API, which exposes prediction endpoints, and the React frontend consumes this API to display results to users.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## Overview

The Crop Prediction System is designed to help farmers and agricultural experts determine the most suitable crop for a given region using key features such as:

- **Soil Nutrients:** Nitrogen (N), Phosphorus (P), Potassium (K), pH
- **Climate Parameters:** Temperature (°C), Humidity (%), Rainfall (mm)

An XGBoost classifier is trained on historical crop data to make predictions. The Flask API handles model inference and serves the predictions, which are then consumed by the React frontend for a user-friendly display.

## Features

- **Accurate Predictions:** Uses an XGBoost classifier for multi-class crop prediction.
- **RESTful API:** Flask API exposes a `/` endpoint to provide crop predictions.
- **React Frontend:** A modern, interactive UI for entering data and displaying prediction results.
- **Model Evaluation:** The backend logs and displays model accuracy during training.

## Architecture

The project consists of two main components:

1. **Backend (Flask API):**
   - **Model Training:** Loads data, preprocesses it (including label encoding and feature scaling), trains the XGBoost model, and saves the model.
   - **API Endpoints:** Provides a `/predict` endpoint to accept POST requests with soil and climate parameters and returns the predicted crop along with confidence scores.

2. **Frontend (React):**
   - A React application that provides a form for entering the required parameters.
   - Makes POST requests to the Flask API and displays the returned crop prediction.

## Installation

### Prerequisites

- Python 3.7+
- Node.js and npm (for the React frontend)

### Setup Backend

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/nikpatil2123/crop-prediction-app.git
   cd crop-prediction-app/backend
   ```

2. Install Python Dependencies:
    ```
    pip install -r requirements.txt
    ```
3. Train the Model(if not already trained):
    ```
    python ml.py
    ```
### Setup Frontend
1. **Navigate to the Frontend Directory:**
    ```
    cd ../web/pyweb
    ```
2. **Install Node Dependencies:**
    ```
    npm install
    ```
## Usage

#### Running the Flask API (Backend)
1. **Start the Flask Server:**
    ```
    python flaskapi.py
    ```
    By default, the API runs at http://127.0.0.1:5000

2. **API Endpoint:**
    - **API Endpoint:**
        - POST /

            - Request Body (JSON Example):
            ```
            {
              "N": 90,
              "P": 42,
              "K": 43,
              "ph": 6.5,
              "temperature": 21,
              "humidity": 82,
              "rainfall": 203
            }
            ```
        - The response will include the predicted crop and confidence score.
     

      - POST /
         - Request Body: Same as /
            - The response will include fertilizer recommendations.
            - POST `/pesticide`

         - Request Body: Same as /
            - The response will suggest suitable pesticides.
            - POST `/irrigation`
         
         - Request Body: Same as /
            - The response will provide an irrigation schedule.
            - POST `/climate-impact`
         
         - Request Body: Same as /
            - The response will analyze the impact of climate parameters on crop health.

### Running the React Frontend
1. **Start the React App**
    ```
    npm run dev
    ```
2. **Usage**
    - Open your browser and navigate to http://localhost:3000.
    - Enter the soil and climate parameters in the provided form.
    - Click the button to submit the data and view the crop prediction result.

## Project Structure


```
├── backend
│   ├── flaskapi.py         # Flask API application
│   ├── ml.py      # Script to train and save the XGBoost model
│   ├── crop_model.pkl      # Pickled model, scaler, and accuracy (generated after training)
│   ├── requirements.txt    # Python dependencies for backend
│   └── ...
├── web
├──- pyweb
│   ├── public
│   ├── src
│   │   ├── App.js          # Main React component for UI
│   │   └── ...
│   ├── package.json        # Node dependencies for React app
│   └── ...
├── README.md

```
## Contributing

Contributions are welcome! Please fork the repository and submit pull requests. For major changes, open an issue first to discuss your ideas.


```
This should meet your requirements. Let me know if you need any further adjustments!
```


















