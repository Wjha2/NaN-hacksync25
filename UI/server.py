from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import pickle
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load models
with open('xgboost_cognitive_overload.pkl', 'rb') as f:
    model_cognitive_overload = pickle.load(f)

with open('xgboost_social_engagement.pkl', 'rb') as f:
    model_social_engagement = pickle.load(f)

with open('xgboost_work_life_balance.pkl', 'rb') as f:
    model_work_life_balance = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    social_activity = data.get("SOCIAL_ACTIVITY_SCORE", 0.0)
    work_productivity = data.get("WORK_PRODUCTIVITY_SCORE", 0.0)
    self_care = data.get("SELF_CARE_SCORE", 0.0)
    stress_impact = data.get("STRESS_IMPACT", 0.0)

    features = ["SOCIAL_ACTIVITY_SCORE", "WORK_PRODUCTIVITY_SCORE", "SELF_CARE_SCORE", "STRESS_IMPACT"]
    X = pd.DataFrame([[social_activity, work_productivity, self_care, stress_impact]], columns=features)

    cognitive_overload_pred = model_cognitive_overload.predict(X)[0]
    social_engagement_pred = model_social_engagement.predict(X)[0]
    work_life_balance_pred = model_work_life_balance.predict(X)[0]

    result = {
        "cognitive_overload": int(cognitive_overload_pred),
        "social_engagement_needs": int(social_engagement_pred),
        "work_life_balance_adjust": int(work_life_balance_pred)
    }
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
