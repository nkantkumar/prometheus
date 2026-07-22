import sys
import os

# Adjust sys.path to run directly
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.main import start_negotiation, NegotiationRequest

if __name__ == "__main__":
    print("Testing multi-agent simulation for supplier SUP-001 (Krupp Steelworks GmbH)...")
    req = NegotiationRequest(supplier_id="SUP-001")
    try:
        res = start_negotiation(req)
        print("\n--- Negotiation Completed Successfully! ---")
        print(f"Session ID: {res['session_id']}")
        print(f"Supplier Name: {res['supplier_name']}")
        print(f"Deutsche Bank Score: {res['db_credit_score']} (Numerical: {res['db_numerical_rating']})")
        print(f"Siemens Final Decision: {res['siemens_decision']}")
        print("\nNegotiation Log Steps:")
        for i, log in enumerate(res['logs']):
            print(f"\nStep {i+1} [{log['sender']} - {log['action_type']}]:")
            print(log['message'])
    except Exception as e:
        print(f"Test failed with error: {e}")
        sys.exit(1)
