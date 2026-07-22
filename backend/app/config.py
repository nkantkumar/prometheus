import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_core.messages import BaseMessage, AIMessage
from typing import Any, List, Optional

from langchain_core.outputs import ChatResult, ChatGeneration

# Load environment variables
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PORT = int(os.getenv("PORT", 8000))
HOST = os.getenv("HOST", "0.0.0.0")

class MockGeminiModel(BaseChatModel):
    """
    A mock ChatModel that acts like Gemini when GOOGLE_API_KEY is not available.
    Ensures that the application runs, responds, and can be demoed without errors.
    """
    def _generate(self, messages: List[BaseMessage], stop: Optional[List[str]] = None, **kwargs: Any) -> ChatResult:
        # Simplistic mocking logic based on content and conversation length
        last_message = messages[-1].content.lower() if messages else ""
        num_turns = len(messages)
        
        if num_turns >= 5:
            # Finalize deal
            response_text = (
                "Siemens AG Procurement Agent decision:\n"
                "Based on the credit rating and trade finance options provided by Deutsche Bank, Siemens AG formally APPROVES the supplier contract. We will proceed with the recommended Standard Bank Guarantee."
            )
        elif "credit score" in last_message or "supplier score" in last_message or "rating" in last_message:
            response_text = (
                "Deutsche Bank Credit Agent analysis:\n"
                "After reviewing our database, the supplier has a credit score of 'AAA' with low risk of default. "
                "The recommended trade finance program is the 'Supplier Early Payment Program' or a 'Standard Bank Guarantee'."
            )
        elif "siemens" in last_message and ("approve" in last_message or "proceed" in last_message):
            response_text = (
                "Siemens AG Procurement Agent decision:\n"
                "Based on the credit rating and risk assessment provided by Deutsche Bank, we approve the procurement contract. "
                "We request Deutsche Bank to issue a Standard Bank Guarantee to finalize the supplier agreement."
            )
        elif "guarantee" in last_message or "letter of credit" in last_message:
            response_text = (
                "Deutsche Bank Trade Finance Agent response:\n"
                "We acknowledge the request for a Bank Guarantee. The transaction has been processed and registered successfully. "
                "The collateral has been locked and terms are finalized."
            )
        else:
            response_text = (
                "Siemens AG Procurement Agent:\n"
                "We are evaluating a new procurement contract. Please retrieve the official credit score and risk assessment for this supplier from Deutsche Bank."
            )

        return ChatResult(
            generations=[
                ChatGeneration(message=AIMessage(content=response_text))
            ]
        )
    
    @property
    def _llm_type(self) -> str:
        return "mock-gemini"

def get_llm(model_name: str = "gemini-1.5-flash") -> BaseChatModel:
    """
    Returns ChatGoogleGenerativeAI if key is present, otherwise returns a mock LLM.
    """
    if GOOGLE_API_KEY and GOOGLE_API_KEY != "your_gemini_api_key_here":
        try:
            return ChatGoogleGenerativeAI(
                model=model_name,
                google_api_key=GOOGLE_API_KEY,
                temperature=0.7
            )
        except Exception as e:
            print(f"Warning: Failed to initialize Google Gemini LLM ({e}). Falling back to mock model.")
            return MockGeminiModel()
    else:
        print("Warning: GOOGLE_API_KEY not found or is set to placeholder. Running in Mock LLM mode.")
        return MockGeminiModel()
