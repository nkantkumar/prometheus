# Siemens AG & Deutsche Bank Multi-Agent Procurement Platform

An agentic trade finance and supplier clearance simulator coordinating multi-agent negotiations using **FastAPI**, **LangGraph**, and **Google Gemini** on the backend, integrated with two custom Next.js dashboards styled after the public portals of **Siemens AG** and **Deutsche Bank**.

---

## 🏗️ Project Architecture

The project consists of three main components:

1. **`backend/`**: A FastAPI server that runs a LangGraph state machine. It manages a conversation between:
   - **Siemens AG Procurement Agent**: Evaluates suppliers, reviews credit ratings, requests collateral guarantees, and makes approval decisions.
   - **Deutsche Bank Credit Agent**: Performs supplier checks against a mock credit registry, scores risk levels, and approves letters of credit.
2. **`frontend/siemens/`**: Next.js App Router portal representing the Siemens AG Procurement dashboard.
3. **`frontend/deutsche-bank/`**: Next.js App Router portal representing the Deutsche Bank Risk & Trade Finance dashboard.

---

## 🚀 Getting Started (Run Locally)

Prerequisites: Ensure you have **Python 3.10+** and **Node.js 18+** installed.

### Step 1: Run the FastAPI Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up your environment variables:
   ```bash
   cp .env.example .env
   ```
   *(Optional)* Edit the `.env` file and insert your `GOOGLE_API_KEY` to run the live Google Gemini models. If left as a placeholder, the system runs in an offline **Mock LLM** fallback mode to allow local testing without credentials.
3. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server:
   ```bash
   python app/main.py
   ```
   The backend service starts at `http://localhost:8000`. You can inspect the interactive API documentation at `http://localhost:8000/docs`.

### Step 2: Start the Siemens AG Dashboard

1. Navigate to the Siemens frontend directory:
   ```bash
   cd frontend/siemens
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000` to access the Siemens Procurement Portal.

### Step 3: Start the Deutsche Bank Dashboard

1. Navigate to the Deutsche Bank frontend directory:
   ```bash
   cd frontend/deutsche-bank
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The Deutsche Bank Trade Finance Portal starts on `http://localhost:3001` (configured in `package.json` to prevent port conflict). Open your browser to `http://localhost:3001` to view it.

---

## 🧪 Testing the Agentic State Graph

To test the LangGraph state machine programmatically without starting the servers, run the test script in the backend directory:
```bash
cd backend
python test_agents.py
```
This runs the agents through a full negotiation cycle for a mock supplier and logs the step-by-step reasoning outputs to the console.
