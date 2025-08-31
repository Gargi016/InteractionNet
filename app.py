import pandas as pd
from flask import Flask, request, jsonify, render_template
import joblib
from rdkit import Chem
from rdkit.Chem import AllChem
import numpy as np
import os

# Create the Flask application
app = Flask(__name__)

# Global variables for the trained model
model = None

# A function to load the model once when the app starts
def load_model():
    global model
    try:
        # Load the model directly from the local file system
        model = joblib.load('ddi_fingerprint_model.pkl')
        print("Model loaded successfully from local file.")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

# A function to generate a molecular fingerprint from a SMILES string
def get_morgan_fingerprint(smiles_string, nBits=2048):
    try:
        mol = Chem.MolFromSmiles(smiles_string)
        if mol is not None:
            fp = AllChem.GetMorganFingerprintAsBitVect(mol, 2, nBits=nBits)
            return np.array(list(fp))
        return np.zeros(nBits)
    except:
        return np.zeros(nBits)

# Load the model at the start of the app
if load_model():
    print("Application is ready to go.")
else:
    print("Application failed to start. Check the files.")

# Main route to serve the homepage
@app.route('/')
def home():
    return render_template('index.html')

# API endpoint for predictions
@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.json
    drug_1_smiles = data.get('drug1_smiles')
    drug_2_smiles = data.get('drug2_smiles')

    if not drug_1_smiles or not drug_2_smiles:
        return jsonify({"error": "Please provide both drug SMILES strings."}), 400

    try:
        # Generate fingerprints for the input SMILES strings
        fp_1 = get_morgan_fingerprint(drug_1_smiles)
        fp_2 = get_morgan_fingerprint(drug_2_smiles)

        # Concatenate the two fingerprints into a single feature vector
        input_features = np.concatenate((fp_1, fp_2)).reshape(1, -1)
        
        # Make a prediction and get the probability
        prediction = model.predict(input_features)
        prediction_proba = model.predict_proba(input_features)
        
        # Return the prediction as a JSON response
        result = {
            'prediction': int(prediction[0]),
            'probability': float(max(prediction_proba[0]))
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
