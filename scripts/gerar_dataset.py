import os
import json
import pandas as pd
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(BASE_DIR, "..", "public")
PRAIAS_FILE = os.path.join(PUBLIC_DIR, "praias.json")
PREVISOES_DIR = os.path.join(PUBLIC_DIR, "jsons")
OUTPUT_FILE = os.path.join(PUBLIC_DIR, "dataset_mare.csv")

def carregar_praias():
    with open(PRAIAS_FILE, "r", encoding="utf-8") as f:
        return {p["praia"]: p for p in json.load(f)}

def processar_previsoes(praia_id, praia_info):
    previsao_file = os.path.join(PREVISOES_DIR, f"{praia_id}.json")
    if not os.path.exists(previsao_file):
        print(f" Arquivo de previsão não encontrado para {praia_id}")
        return []

    with open(previsao_file, "r", encoding="utf-8") as f:
        dados = json.load(f)

    registros = []
    for p in dados.get("previsoes", []):
        data = datetime.strptime(p["data"], "%d/%m/%Y").strftime("%Y-%m-%d")
        mes = datetime.strptime(p["data"], "%d/%m/%Y").strftime("%m")

        for i in range(1, 5): 
            hora = p.get(f"hora{i}")
            altura = p.get(f"altura{i}")
            if hora and altura:
                hora_formatada = f"{hora[:2]}:{hora[2:]}"
                registros.append({
                    "praia": praia_info["nome"],
                    "data": data,
                    "mes": mes,
                    "hora": hora_formatada,
                    "altura": float(altura),
                    "latitude": praia_info["lat"],
                    "longitude": praia_info["lon"]
                })
    return registros

def main():
    praias = carregar_praias()
    todos_registros = []

    for praia_id, praia_info in praias.items():
        registros = processar_previsoes(praia_id, praia_info)
        todos_registros.extend(registros)

    if not todos_registros:
        print("Nenhum registro processado!")
        return

    df = pd.DataFrame(todos_registros)
    df.to_csv(OUTPUT_FILE, index=False, encoding="utf-8")
    print(f"Dataset salvo em {OUTPUT_FILE}")
    print(df.head(10))

if __name__ == "__main__":
    main()
