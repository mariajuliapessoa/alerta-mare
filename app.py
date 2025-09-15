from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import pickle
from previsoes import prever_mare_auto  

app = FastAPI(
    title="API de Previsão de Marés",
    description="Previsão de altura de maré para praias do Brasil",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    df = pd.read_csv("dataset_mare_tratado.csv")  # seu CSV normalizado
except FileNotFoundError:
    raise FileNotFoundError("Dataset não encontrado em dataset_mare_tratado.csv")

try:
    with open("model/modelo_xgb.pkl", "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    raise FileNotFoundError("Modelo não encontrado em model/modelo_xgb.pkl")


@app.get("/")
def home():
    return {"mensagem": "API de Previsão de Marés ativa. Use /prever?praia=...&data=...&hora=..."}

@app.get("/prever")
def prever(praia: str, data: str, hora: str = "12:00"):
    
    try:
        df_result = prever_mare_auto(nome_usuario=praia,
                                     data_str=data,
                                     df=df,
                                     model=model,
                                     hora_str=hora,
                                     json_path="public/praias.json")
        return df_result.to_dict(orient="records")
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")
