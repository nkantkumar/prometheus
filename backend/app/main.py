import uuid
import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.mock_data import SIEMENS_SUPPLIERS, DEUTSCHE_BANK_REGISTRY
from app.agents import negotiation_graph

app = FastAPI(
    title="Siemens & Deutsche Bank Agentic Procurement Backend",
    description="FastAPI + LangGraph backend coordinating supplier evaluations between corporate procurement and banking credit agents.",
    version="1.0.0"
)

# Enable CORS for frontend applications
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this. For development, allow all.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory database of negotiation history
negotiation_history: Dict[str, Dict[str, Any]] = {}

class NegotiationRequest(BaseModel):
    supplier_id: str
    custom_po_value: Optional[float] = None

class AgentLogItem(BaseModel):
    sender: str
    message: str
    timestamp: str
    action_type: str

class NegotiationResultResponse(BaseModel):
    session_id: str
    supplier_id: str
    supplier_name: str
    po_value: float
    db_credit_score: str
    db_numerical_rating: int
    db_risk_level: str
    db_recommended_programs: List[str]
    siemens_decision: str
    logs: List[Dict[str, Any]]
    timestamp: str

@app.get("/api/suppliers")
def get_suppliers():
    """
    Returns a unified view of Siemens suppliers and their credit registry info (for UI populating).
    """
    unified_list = []
    for sup_id, sup in SIEMENS_SUPPLIERS.items():
        db_info = DEUTSCHE_BANK_REGISTRY.get(sup_id, {})
        unified_list.append({
            "id": sup["id"],
            "name": sup["name"],
            "category": sup["category"],
            "current_po_value": sup["current_po_value"],
            "project_name": sup["project_name"],
            "description": sup["description"],
            "operational_rating": sup["operational_rating"],
            "delivery_reliability": sup["delivery_reliability"],
            "credit_score": db_info.get("credit_score", "N/A"),
            "risk_level": db_info.get("default_risk", "Unknown"),
            "numerical_rating": db_info.get("numerical_rating", 0)
        })
    return unified_list

@app.get("/api/suppliers/{supplier_id}")
def get_supplier(supplier_id: str):
    if supplier_id not in SIEMENS_SUPPLIERS:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    sup = SIEMENS_SUPPLIERS[supplier_id]
    db_info = DEUTSCHE_BANK_REGISTRY.get(supplier_id, {})
    return {
        "supplier": sup,
        "credit_details": db_info
    }

@app.post("/api/negotiate", response_model=NegotiationResultResponse)
def start_negotiation(req: NegotiationRequest):
    """
    Runs the multi-agent negotiation using LangGraph.
    Coordinated process:
    - Siemens Agent kicks off evaluation request
    - DB Agent provides score and options
    - Siemens Agent analyzes, makes a decision, and requests final contracts (Letter of credit, guarantee)
    - DB Agent confirms final setups
    """
    supplier_id = req.supplier_id
    if supplier_id not in SIEMENS_SUPPLIERS:
        raise HTTPException(status_code=404, detail=f"Supplier ID {supplier_id} not found in Siemens records.")
    
    supplier = SIEMENS_SUPPLIERS[supplier_id]
    po_value = req.custom_po_value if req.custom_po_value is not None else supplier["current_po_value"]
    
    # Initialize LangGraph State
    initial_state = {
        "messages": [],
        "supplier_id": supplier_id,
        "supplier_name": supplier["name"],
        "po_value": po_value,
        "db_credit_score": "N/A",
        "db_numerical_rating": 0,
        "db_risk_level": "Unknown",
        "db_recommended_programs": [],
        "siemens_decision": "INITIATED",
        "next_action": "Evaluate Supplier",
        "current_speaker": "Siemens Agent",
        "iteration_count": 0,
        "logs": []
    }
    
    try:
        # Run graph to completion
        final_state = negotiation_graph.invoke(initial_state)
        
        session_id = str(uuid.uuid4())
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        result = {
            "session_id": session_id,
            "supplier_id": supplier_id,
            "supplier_name": supplier["name"],
            "po_value": po_value,
            "db_credit_score": final_state.get("db_credit_score", "N/A"),
            "db_numerical_rating": final_state.get("db_numerical_rating", 0),
            "db_risk_level": final_state.get("db_risk_level", "Unknown"),
            "db_recommended_programs": final_state.get("db_recommended_programs", []),
            "siemens_decision": final_state.get("siemens_decision", "PENDING_REVIEW"),
            "logs": final_state.get("logs", []),
            "timestamp": timestamp
        }
        
        # Store in-memory history
        negotiation_history[session_id] = result
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent simulation failed: {str(e)}")

@app.get("/api/history")
def get_negotiation_history():
    """
    Returns list of past simulations run in this server session.
    """
    return list(negotiation_history.values())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
