# Alerta Mare - Previsão de Marés

## Descrição do Projeto

O **Alerta Mare** é uma aplicação para previsão de marés em praias brasileiras. O projeto utiliza dados históricos de marés em formato CSV/JSON, treina um modelo de aprendizado de máquina (XGBoost) e disponibiliza uma API para consulta de previsões em qualquer praia, incluindo praias não presentes no dataset histórico, utilizando latitude e longitude obtidas via JSON externo.

O sistema foi desenvolvido em Python e FastAPI, permitindo consultas via navegador, `curl` ou integração com frontends e aplicativos móveis.

---

## Estrutura do Projeto

```
alerta-mare/
│
├── app.py                  # Script principal FastAPI
├── previsoes.py            # Funções para previsão de maré (normalização, criação de features, previsão)
├── modelo/                 
│   └── modelo_xgb.pkl      # Modelo XGBoost treinado e salvo com pickle
├── public/
│   └── praias.json         # JSON com latitude e longitude de praias adicionais
├── data/
│   └── mares.csv           # Dataset histórico de marés
├── venv/                   # Ambiente virtual
├── requirements.txt        # Dependências Python
└── README.md
```

---

## Pré-requisitos

* Python >= 3.11
* Git
* Pip
* Recomendado: criar um ambiente virtual (`venv`)

---

## Instalação

1. **Clonar o repositório**

```bash
git clone <URL_DO_REPOSITORIO>
cd alerta-mare
```

2. **Criar e ativar ambiente virtual**

Windows PowerShell:

```bash
python -m venv venv
& "venv/Scripts/Activate.ps1"
```

Linux/Mac:

```bash
python3 -m venv venv
source venv/bin/activate
```

3. **Instalar dependências**

```bash
pip install -r requirements.txt
```

Dependências principais:

* fastapi
* uvicorn
* pandas
* numpy
* xgboost
* scikit-learn

---

## Treinamento e Salvamento do Modelo

> Caso queira treinar o modelo novamente no notebook:

```python
import pickle
import xgboost as xgb

# Treinar seu modelo XGBoost
model = xgb.XGBRegressor(
    learning_rate=0.05,
    max_depth=6,
    n_estimators=500,
    colsample_bytree=0.8
)

model.fit(X_train, y_train)

# Salvar o modelo
with open("modelo/modelo_xgb.pkl", "wb") as f:
    pickle.dump(model, f)
```

> Se você já possui `modelo_xgb.pkl`, pode pular esta etapa.

---

## Estrutura das Funções de Previsão

O arquivo `previsoes.py` contém:

* `normalizar_nome_praia(nome_usuario)`
  Converte nomes digitados pelo usuário para o formato do dataset, remove acentos e espaços.

* `criar_features(latitude, longitude, data_str, hora_str)`
  Converte data e hora em features contínuas (sen/cos de hora, mês e dia da semana) para o modelo.

* `prever_mare_auto(nome_usuario, data_str, df, model, hora_str='12:00', json_path="public/praias.json")`
  Retorna a previsão de maré para qualquer praia, usando dados do dataset ou JSON externo.

---

## Executando a API

1. **Ativar ambiente virtual** (se ainda não ativo):

```bash
& "venv/Scripts/Activate.ps1"
```

2. **Iniciar servidor FastAPI**

```bash
uvicorn app:app --reload
```

Por padrão, o servidor será iniciado em `http://127.0.0.1:8000`.

3. **Acessando documentação automática**

* FastAPI fornece interface Swagger:
  `http://127.0.0.1:8000/docs`
* Documentação alternativa Redoc:
  `http://127.0.0.1:8000/redoc`

---

## Exemplos de Consulta

**Consulta via navegador ou curl:**

```bash
curl -X GET "http://127.0.0.1:8000/prever?praia=Itapuama&data=2025-01-01&hora=14:30" -H "accept: application/json"
```

**Resposta esperada:**

```json
[
  {
    "praia": "Itapuama",
    "data": "2025-01-01",
    "hora": "14:30",
    "altura_prevista": 1.232759
  }
]
```

> O campo `altura_prevista` é calculado pelo modelo XGBoost baseado em latitude, longitude, data e hora.

---

## Atualização de Dados

* O arquivo `public/praias.json` pode ser atualizado para adicionar novas praias.
* O dataset `data/mares.csv` pode ser expandido com novos registros históricos.
* Para que novas praias sejam reconhecidas automaticamente, utilize `normalizar_nome_praia()` ou adicione ao JSON.

---

## Publicação

1. Commit das mudanças:

```bash
git add .
git commit -m "Implementação inicial do Alerta Mare com API FastAPI"
```

2. Push para o repositório remoto:

```bash
git push origin main
```

---

## Notas Técnicas

* O modelo XGBoost espera features específicas: latitude, longitude, hora\_sin, hora\_cos, mes\_sin, mes\_cos, dia\_sin, dia\_cos.
* A API FastAPI inclui tratamento de erros:

  * `404`: praia não encontrada no dataset ou JSON
  * `500`: erro interno na função de previsão
* Todos os nomes de praias digitados pelo usuário são normalizados para minimizar erros de digitação.

---

Se você quiser, posso também escrever uma **versão resumida do README** com instruções de execução rápida para usuários que só querem testar a API localmente, sem tanta parte técnica.

Quer que eu faça isso?
