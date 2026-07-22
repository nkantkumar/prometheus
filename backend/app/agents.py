import datetime
from typing import Dict, Any, List
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END
from app.state import NegotiationState, AgentLog
from app.config import get_llm
from app.mock_data import SIEMENS_SUPPLIERS, DEUTSCHE_BANK_REGISTRY

# Initialize Gemini LLM
llm = get_llm()

# Agent Prompts
SIEMENS_SYSTEM_PROMPT = """You are the Siemens AG Procurement AI Agent.
You manage supply chain risk and contract negotiations for major Siemens engineering projects.
Your goal is to evaluate suppliers, manage risk, and decide on purchasing terms.

You must:
1. Review the supplier information.
2. Coordinate with the Deutsche Bank agent to fetch the credit score and risk rating.
3. Make an final decision on the procurement contract:
   - APPROVE: If credit rating is AAA, A+, or similar investment grade.
   - PENDING_FINANCE (Escrow/Guarantee): If credit rating is BB- or B+ (moderately risky), demand a collateralized Bank Guarantee or Escrow.
   - REJECT: If credit rating is below B- or payment risk is unacceptable.
4. Keep Siemens corporate tone: highly professional, compliance-driven, risk-aware, and precise.

Current Supplier: {supplier_name}
PO Value: €{po_value:,.2f}
Description: {supplier_desc}
"""

DEUTSCHE_BANK_SYSTEM_PROMPT = """You are the Deutsche Bank Corporate Finance AI Agent.
You represent the Deutsche Bank Trade Finance & Credit Risk division.
Your role is to assess supplier credit risk, return credit scores, and recommend structured trade finance solutions.

You must:
1. Look up the supplier's financial data in the Deutsche Bank credit registry.
2. Provide the credit score, default risk, and recommended trade finance programs.
3. Handle requests for Bank Guarantees or Letters of Credit: Approve them if within the supplier's credit limit.
4. Maintain a formal, strict, and precise German banking corporate tone.

Supplier Credit Data: {db_data}
"""

def siemens_agent_node(state: NegotiationState) -> Dict[str, Any]:
    supplier_id = state["supplier_id"]
    supplier_name = state["supplier_name"]
    po_value = state["po_value"]
    
    # Get supplier details
    sup_info = SIEMENS_SUPPLIERS.get(supplier_id, {})
    desc = sup_info.get("description", "No description available.")
    
    # Formulate prompt
    sys_prompt = SIEMENS_SYSTEM_PROMPT.format(
        supplier_name=supplier_name,
        po_value=po_value,
        supplier_desc=desc
    )
    
    # Prepare chat history for LLM context
    messages = [SystemMessage(content=sys_prompt)]
    
    # Add existing messages for context
    messages.extend(state["messages"])
    
    # Run LLM
    response = llm.invoke(messages)
    
    # Determine the decision & next action from content
    content_lower = response.content.lower()
    decision = state.get("siemens_decision", "INITIATED")
    action_type = "REQUEST_SCORE"
    
    if "approve" in content_lower:
        decision = "APPROVED"
        action_type = "DECISION_APPROVE"
    elif "reject" in content_lower:
        decision = "REJECTED"
        action_type = "DECISION_REJECT"
    elif "escrow" in content_lower or "guarantee" in content_lower or "finance" in content_lower:
        decision = "PENDING_FINANCE"
        action_type = "REQUEST_GUARANTEE"
    
    # Create custom log
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_log: AgentLog = {
        "sender": "Siemens Procurement Agent",
        "message": response.content,
        "timestamp": timestamp,
        "action_type": action_type
    }
    
    # Update state
    return {
        "messages": [response],
        "siemens_decision": decision,
        "current_speaker": "Deutsche Bank Agent" if decision not in ["APPROVED", "REJECTED"] else "None",
        "iteration_count": state.get("iteration_count", 0) + 1,
        "logs": state.get("logs", []) + [new_log]
    }

def deutsche_bank_agent_node(state: NegotiationState) -> Dict[str, Any]:
    supplier_id = state["supplier_id"]
    
    # Get DB Credit Registry details
    db_data = DEUTSCHE_BANK_REGISTRY.get(supplier_id, {
        "credit_score": "N/A",
        "numerical_rating": 0,
        "default_risk": "Unknown",
        "recommended_programs": ["None"],
        "max_credit_limit": 0.0
    })
    
    sys_prompt = DEUTSCHE_BANK_SYSTEM_PROMPT.format(db_data=str(db_data))
    
    # Prepare chat history for LLM context
    messages = [SystemMessage(content=sys_prompt)]
    messages.extend(state["messages"])
    
    # Run LLM
    response = llm.invoke(messages)
    
    # Parse recommendation or database details
    # In a production system, we'd parse this with structured output. 
    # Here, we fetch it directly from our python registry for accuracy and store it in state.
    db_score = db_data["credit_score"]
    num_rating = db_data["numerical_rating"]
    risk = db_data["default_risk"]
    recs = db_data["recommended_programs"]
    
    # Create custom log
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    action_type = "PROVIDE_SCORE"
    if "guarantee" in response.content.lower() or "escrow" in response.content.lower():
        action_type = "APPROVE_FINANCE"
        
    new_log: AgentLog = {
        "sender": "Deutsche Bank Credit Agent",
        "message": response.content,
        "timestamp": timestamp,
        "action_type": action_type
    }
    
    return {
        "messages": [response],
        "db_credit_score": db_score,
        "db_numerical_rating": num_rating,
        "db_risk_level": risk,
        "db_recommended_programs": recs,
        "current_speaker": "Siemens Agent",
        "iteration_count": state.get("iteration_count", 0) + 1,
        "logs": state.get("logs", []) + [new_log]
    }

# Conditional Routing
def route_negotiation(state: NegotiationState) -> str:
    # Stop if we hit a terminal decision or exceed limits
    decision = state.get("siemens_decision")
    iteration = state.get("iteration_count", 0)
    
    if decision in ["APPROVED", "REJECTED"] or iteration >= 6:
        return "end"
    
    speaker = state.get("current_speaker")
    if speaker == "Deutsche Bank Agent":
        return "deutsche_bank_agent"
    else:
        return "siemens_agent"

# Build Graph
builder = StateGraph(NegotiationState)

# Add Nodes
builder.add_node("siemens_agent", siemens_agent_node)
builder.add_node("deutsche_bank_agent", deutsche_bank_agent_node)

# Set Entry Point
builder.set_entry_point("siemens_agent")

# Add Router
builder.add_conditional_edges(
    "siemens_agent",
    route_negotiation,
    {
        "deutsche_bank_agent": "deutsche_bank_agent",
        "end": END
    }
)

builder.add_conditional_edges(
    "deutsche_bank_agent",
    route_negotiation,
    {
        "siemens_agent": "siemens_agent",
        "end": END
    }
)

# Compile Graph
negotiation_graph = builder.compile()
