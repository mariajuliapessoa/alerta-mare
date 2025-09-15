import pandas as pd
import numpy as np
from datetime import datetime
import json
import unicodedata

def normalizar_nome_praia(nome):
    """
    Normaliza nomes de praia (minúsculo, remove acentos e troca espaços por _)
    """
    nome = nome.lower()
    nome = ''.join(c for c in unicodedata.normalize('NFKD', nome) if not unicodedata.combining(c))
    nome = nome.replace(' ', '_')
    return nome

def criar_features(latitude, longitude, data_str, hora_str):
    """
    Cria as features necessárias para o modelo XGBoost a partir de lat, lon, data e hora
    """
    data = pd.to_datetime(data_str)
    hora_decimal = int(hora_str.split(':')[0]) + int(hora_str.split(':')[1])/60

    # Hora em sen/cos
    hora_rad = 2 * np.pi * hora_decimal / 24
    hora_sin = np.sin(hora_rad)
    hora_cos = np.cos(hora_rad)

    # Mês
    mes = data.month
    mes_rad = 2 * np.pi * mes / 12
    mes_sin = np.sin(mes_rad)
    mes_cos = np.cos(mes_rad)

    # Dia da semana
    dia_sem = data.weekday()  # 0=segunda,6=domingo
    dia_sem_rad = 2 * np.pi * dia_sem / 7
    dia_sin = np.sin(dia_sem_rad)
    dia_cos = np.cos(dia_sem_rad)

    return pd.DataFrame([{
        'latitude': latitude,
        'longitude': longitude,
        'hora_sin': hora_sin,
        'hora_cos': hora_cos,
        'mes_sin': mes_sin,
        'mes_cos': mes_cos,
        'dia_sin': dia_sin,
        'dia_cos': dia_cos
    }])

def prever_mare_auto(nome_usuario, data_str, df, model, hora_str="12:00", json_path="../public/praias.json"):
    """
    Previsão de altura de maré para qualquer praia (dataset ou JSON externo)
    
    Args:
        nome_usuario (str): Nome da praia informado pelo usuário.
        data_str (str): Data no formato 'YYYY-MM-DD'.
        df (pd.DataFrame): Dataset tratado.
        model: Modelo treinado (ex: XGBRegressor).
        hora (str ou list, opcional): Hora(s) no formato 'HH:MM'. Se None, usa horas padrão.
        json_path (str): Caminho para JSON de praias.
    
    Retorna:
        pd.DataFrame com colunas ['praia', 'data', 'hora', 'altura_prevista'].
    """
    nome_dataset = normalizar_nome_praia(nome_usuario)

    # Primeiro, tenta encontrar no dataset
    if nome_dataset in df['praia'].unique():
        df_praia = df[df['praia'] == nome_dataset].iloc[0]  # pega primeira linha para lat/lon
        latitude = df_praia['latitude']
        longitude = df_praia['longitude']
    else:
        # Busca no JSON de praias
        with open(json_path, 'r', encoding='utf-8') as f:
            praias_json = json.load(f)
        praia_info = next((p for p in praias_json if normalizar_nome_praia(p['praia']) == nome_dataset), None)
        if praia_info is None:
            raise ValueError(f"Praia '{nome_usuario}' não encontrada no dataset nem no JSON.")
        latitude = praia_info['lat']
        longitude = praia_info['lon']

    # Define horas padrão se hora=None
    if hora_str is None:
        horas = ['00:00','04:00','08:00','12:00','16:00','20:00']
    elif isinstance(hora_str, str):
        horas = [hora_str]
    else:
        horas = hora_str

    # Gera previsões
    resultados = []
    for h in horas:
        X_pred = criar_features(latitude, longitude, data_str, h)
        altura_prevista = model.predict(X_pred)[0]
        resultados.append({
            'praia': nome_usuario,
            'data': data_str,
            'hora': h,
            'altura_prevista': altura_prevista
        })
    return pd.DataFrame(resultados)