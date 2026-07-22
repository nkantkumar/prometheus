from typing import List, Dict, Any, TypedDict, Annotated
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentLog(TypedDict):
    sender: str
    message: str
    timestamp: str
    action_type: str # e.g. "REQUEST_SCORE", "PROVIDE_SCORE", "DECISION_APPROVE", "REQUEST_GUARANTEE", "COMPLETE"

class NegotiationState(TypedDict):
    # Standard LangGraph message thread
    messages: Annotated[List[BaseMessage], add_messages]
    
    # Metadata and evaluation state
    supplier_id: str
    supplier_name: str
    po_value: float
    
    # Deutsche Bank analysis outputs
    db_credit_score: str
    db_numerical_rating: int
    db_risk_level: str
    db_recommended_programs: List[str]
    
    # Siemens analysis outputs
    siemens_decision: str # "APPROVED", "REJECTED", "PENDING_FINANCE", "INITIATED"
    next_action: str
    
    # Control variables for routing
    current_speaker: str # "Siemens Agent", "Deutsche Bank Agent", "None"
    iteration_count: int
    
    # Custom history for easy frontend consumption
    logs: List[AgentLog]
