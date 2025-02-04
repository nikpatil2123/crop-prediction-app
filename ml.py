import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import accuracy_score
import xgboost as xgb
import pickle
import tkinter as tk
from tkinter import ttk
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# Load dataset
file_path = 'crops.xlsx'  # Replace with your dataset path
xls = pd.ExcelFile(file_path)
df = pd.read_excel(xls, 'Sheet1')  # Adjust sheet name if needed

# Show first few rows
df.head()

# Define the feature columns and target variable
X = df.drop('CROP', axis=1)  # Replace 'crop' with the actual name of the target column
y = df['CROP']  # Target column (crop type)

# Encode target variable
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train the model
model = xgb.XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    objective='multi:softmax',  # Ensures multi-class classification
    num_class=len(np.unique(y_train)),  # Set number of output classes explicitly
    random_state=42
)

model.fit(X_train_scaled, y_train)

# Make predictions
y_pred_encoded = model.predict(X_test_scaled)
y_pred = label_encoder.inverse_transform(y_pred_encoded)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred_encoded)
print(f"Model Accuracy: {accuracy:.2%}")

# Save the model
with open('crop_model.pkl', 'wb') as f:
    pickle.dump((model, scaler, label_encoder, accuracy), f)

# Define the prediction function
def predict_crop():
    try:
        # Get inputs from GUI
        inputs = [float(entry.get()) for entry in entries.values()]
        input_data = pd.DataFrame([inputs], columns=X.columns)
        scaled_data = scaler.transform(input_data)

        # Make prediction
        prediction_encoded = model.predict(scaled_data)[0]
        prediction = label_encoder.inverse_transform([prediction_encoded])[0]
        probability = max(model.predict_proba(scaled_data)[0])

        # Display result
        result_text = f"Recommended Crop: {prediction}\nConfidence: {probability*100:.1f}%"
        result_label.config(text=result_text, fg='green' if probability > 0.7 else 'orange')
    except Exception as e:
        result_label.config(text=f"Error: {str(e)}", fg='red')