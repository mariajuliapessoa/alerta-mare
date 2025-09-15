# Alerta Maré

Sistema completo para consulta automatizada do **nível da maré** no Brasil.
Inclui:

* **Backend (FastAPI)** → API de previsões de maré.
* **Frontend (Next.js + TailwindCSS)** → Interface web moderna.
* **Scripts (Node.js)** → Tratamento de dados e geração de arquivos auxiliares.
* **Base de dados CSV** → Informações históricas e processadas da maré.

---

## Objetivo

O projeto resolve o problema de Marcelo, que precisava consultar manualmente em vários sites o nível da maré antes de surfar.
Com essa solução, ele pode acessar **via navegador ou API** os dados mais recentes da maré em Itapuama e, futuramente, em qualquer praia do Brasil.

---

## Requisitos

Você precisará ter instalado:

* [Python 3.9+](https://www.python.org/downloads/)
* [Node.js 18+](https://nodejs.org/en/download/)
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) ou [yarn](https://yarnpkg.com/)
* [Git](https://git-scm.com/downloads)
* [Docker](https://www.docker.com/get-started) (opcional, para rodar containerizado)

---

## Instalação e Execução

### Clone o repositório

```bash
git clone https://github.com/seu-usuario/alerta-mare.git
cd alerta-mare
```

### Configuração do ambiente

Crie o arquivo `.env` na raiz do projeto (baseado em `.env.example`) e ajuste as variáveis conforme necessário.

---

### Backend (FastAPI)

```bash
# Ative o ambiente virtual
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

# Instale dependências
pip install -r requirements.txt

# Rode o backend
uvicorn app:app --reload
```

Endereço da API:
[http://127.0.0.1:8000](http://127.0.0.1:8000)
Documentação Swagger: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### Frontend (Next.js + TailwindCSS)

```bash
# Instale dependências
npm install   # ou yarn install

# Rode o frontend
npm run dev   # ou yarn dev
```

O frontend ficará disponível em:
[http://localhost:3000](http://localhost:3000)

---

### Scripts auxiliares (Node.js)

Você tem scripts JS para manipulação e normalização de dados:

```bash
# Corrige datas do dataset
node corrigirDatas.js

# Gera JSONs de previsão
node generateJSONs.js
```

---

## Exemplos de Endpoints

Quando abrir o Swagger UI em [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs), você verá algo como:

```
GET /
  Summary: Status da API
  Response:
  {
    "status": "ok",
    "message": "API Alerta Maré ativa"
  }

GET /mare/itapuama
  Summary: Retorna o nível da maré para Itapuama
  Response:
  {
    "praia": "Itapuama",
    "data": "2025-09-15",
    "mare": [
      {"hora": "06:00", "altura": "1.2m"},
      {"hora": "12:00", "altura": "0.5m"},
      {"hora": "18:00", "altura": "1.4m"}
    ]
  }

GET /mare/{praia}
  Summary: Consulta maré de qualquer praia cadastrada
  Parameters:
    - name: praia
      in: path
      required: true
      example: "copacabana"
```

---

## Estrutura do projeto

```
alerta-mare/
│── app.py                # API FastAPI
│── previsoes.py          # Lógica de previsão de maré
│── corrigirDatas.js      # Script Node.js para ajustar datas
│── generateJSONs.js      # Script Node.js para gerar arquivos JSON
│── dataset_mare.csv      # Dados originais
│── dataset_mare_tratado.csv # Dados tratados
│── package.json          # Dependências Node.js
│── tailwind.config.ts    # Configuração do Tailwind
│── next.config.js        # Configuração do Next.js
│── requirements.txt      # Dependências Python
│── .env.example          # Exemplo de variáveis de ambiente
│
├── app/                  # Backend (FastAPI)
├── components/           # Componentes React (frontend)
├── lib/                  # Funções auxiliares frontend
├── model/                # Modelos de dados (Pydantic, etc.)
├── public/               # Arquivos estáticos frontend
├── scripts/              # Scripts auxiliares
├── tabuas25/             # Dados de tábuas de maré
└── venv/                 # Ambiente virtual Python
```
