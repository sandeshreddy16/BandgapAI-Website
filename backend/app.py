from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

from pymatgen.core import Composition
from matminer.featurizers.composition import ElementProperty


app = FastAPI(title="Band Gap Predictor API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://bandgapai.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load trained modelpython -m uvicorn app:app --reload
model = joblib.load("xgboost_tuned_model.pkl")

# Load the exact feature names used during training
feature_names = joblib.load("feature_names.pkl")

# Create the SAME Magpie featurizer used during training
featurizer = ElementProperty.from_preset("magpie")


class MaterialInput(BaseModel):
    formula: str


@app.get("/")
def home():
    return {
        "message": "Band Gap Predictor API is running!"
    }


@app.post("/predict")
def predict_bandgap(data: MaterialInput):

    try:
        # Convert chemical formula → pymatgen Composition
        composition = Composition(data.formula)

        # Create a one-row DataFrame
        df = pd.DataFrame({
            "composition": [composition]
        })

        # Generate Magpie features
        df = featurizer.featurize_dataframe(
            df,
            col_id="composition",
            ignore_errors=False
        )

        # Select ONLY the features used by the model
        X = df[feature_names]

        # Predict
        prediction = model.predict(X)[0]

        return {
            "formula": data.formula,
            "band_gap": round(float(prediction), 4),
            "unit": "eV"
        }

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )