# Mock database for Siemens Suppliers and Deutsche Bank Credit Registry

# 1. Siemens Suppliers Database
# This contains the procurement records of suppliers that Siemens AG is currently evaluating for project contracts.
SIEMENS_SUPPLIERS = {
    "SUP-001": {
        "id": "SUP-001",
        "name": "Krupp Steelworks GmbH",
        "category": "Raw Materials & Heavy Machinery",
        "current_po_value": 1200000.0, # €1.2M
        "project_name": "Hamburg Wind Farm Infrastructure",
        "description": "Supplements steel and structural components for heavy engineering and renewable installations.",
        "operational_rating": "Excellent (94%)",
        "delivery_reliability": "98%"
    },
    "SUP-002": {
        "id": "SUP-002",
        "name": "Optima Microelectronics",
        "category": "Semiconductors & Sensors",
        "current_po_value": 450000.0, # €450k
        "project_name": "Munich Smart Factory Upgrade",
        "description": "Provides high-precision sensors and PLC controller microchips.",
        "operational_rating": "Fair (76%)",
        "delivery_reliability": "82%"
    },
    "SUP-003": {
        "id": "SUP-003",
        "name": "Bavarian Cable Works",
        "category": "Electrical & Cabling",
        "current_po_value": 850000.0, # €850k
        "project_name": "Berlin High-Speed Rail Electrification",
        "description": "Manufactures high-voltage insulated copper cables and electrical grids.",
        "operational_rating": "Very Good (88%)",
        "delivery_reliability": "92%"
    },
    "SUP-004": {
        "id": "SUP-004",
        "name": "Voltaic Power Solutions",
        "category": "Green Energy Systems",
        "current_po_value": 2300000.0, # €2.3M
        "project_name": "North Sea Offshore Grid Integration",
        "description": "Custom developer of industrial power grid converters and battery arrays.",
        "operational_rating": "Pending Review",
        "delivery_reliability": "New Supplier"
    }
}

# 2. Deutsche Bank Credit Registry
# This is Deutsche Bank's internal scoring and creditworthiness data for these suppliers.
DEUTSCHE_BANK_REGISTRY = {
    "SUP-001": {
        "supplier_id": "SUP-001",
        "supplier_name": "Krupp Steelworks GmbH",
        "credit_score": "AAA",
        "numerical_rating": 96,
        "default_risk": "Extremely Low",
        "liquidity_ratio": "2.4", # Healthy
        "debt_to_equity": "0.35", # Conservative
        "payment_behavior": "Pays within 10 days",
        "recommended_programs": ["Supplier Early Payment Program", "Unsecured Trade Finance"],
        "max_credit_limit": 5000000.0
    },
    "SUP-002": {
        "supplier_id": "SUP-002",
        "supplier_name": "Optima Microelectronics",
        "credit_score": "BB-",
        "numerical_rating": 58,
        "default_risk": "Moderate-High",
        "liquidity_ratio": "0.9", # Tight cashflow
        "debt_to_equity": "1.8", # High debt
        "payment_behavior": "Frequently delays 30+ days",
        "recommended_programs": ["Collateralized Escrow", "Strict Letter of Credit"],
        "max_credit_limit": 300000.0
    },
    "SUP-003": {
        "supplier_id": "SUP-003",
        "supplier_name": "Bavarian Cable Works",
        "credit_score": "A+",
        "numerical_rating": 84,
        "default_risk": "Low",
        "liquidity_ratio": "1.6",
        "debt_to_equity": "0.75",
        "payment_behavior": "Pays within 30 days",
        "recommended_programs": ["Supplier Early Payment Program", "Standard Bank Guarantee"],
        "max_credit_limit": 2000000.0
    },
    "SUP-004": {
        "supplier_id": "SUP-004",
        "supplier_name": "Voltaic Power Solutions",
        "credit_score": "B+",
        "numerical_rating": 68,
        "default_risk": "Moderate",
        "liquidity_ratio": "1.1",
        "debt_to_equity": "1.2",
        "payment_behavior": "Pays within 45 days",
        "recommended_programs": ["Structured Trade Finance", "Triparty Escrow / Letter of Credit"],
        "max_credit_limit": 1000000.0
    }
}
