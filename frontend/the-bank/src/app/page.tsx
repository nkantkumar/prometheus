"use client";

import React, { useState, useEffect } from "react";

// Mock DB Credit Data for Philips AG (Default Client Portfolio)
const PHILIPS_PORTFOLIO = [
  {
    supplier_id: "SUP-P01",
    supplier_name: "NXP Semiconductors N.V.",
    credit_score: "AA-",
    numerical_rating: 90,
    default_risk: "Low",
    liquidity_ratio: 1.8,
    debt_to_equity: 0.65,
    payment_behavior: "Pays within 15 days",
    recommended_programs: ["Unsecured Trade Finance", "Supplier Early Payment Program"],
    max_credit_limit: 4000000.0,
    category: "Semiconductors",
    esg_rating: "AA",
    co2_footprint: "120 tons/yr",
    ethical_sourcing: "92%",
    agents_used: ["Credit Agent", "ESG Agent"],
    po_value: 980000.0,
    clearance_status: "APPROVED",
    operational_rating: "Excellent (92%)",
    delivery_reliability: "96%"
  },
  {
    supplier_id: "SUP-P02",
    supplier_name: "LumiLEDs Lighting",
    credit_score: "A",
    numerical_rating: 82,
    default_risk: "Low",
    liquidity_ratio: 1.5,
    debt_to_equity: 0.8,
    payment_behavior: "Pays within 30 days",
    recommended_programs: ["Standard Bank Guarantee"],
    max_credit_limit: 1500000.0,
    category: "Optoelectronics",
    esg_rating: "A",
    co2_footprint: "450 tons/yr",
    ethical_sourcing: "88%",
    agents_used: ["Credit Agent", "ESG Agent", "Compliance & AML Agent"],
    po_value: 450000.0,
    clearance_status: "APPROVED",
    operational_rating: "Very Good (86%)",
    delivery_reliability: "91%"
  },
  {
    supplier_id: "SUP-P03",
    supplier_name: "Medical Systems Corp",
    credit_score: "AAA",
    numerical_rating: 98,
    default_risk: "Extremely Low",
    liquidity_ratio: 2.9,
    debt_to_equity: 0.2,
    payment_behavior: "Pays within 10 days",
    recommended_programs: ["Supplier Early Payment Program"],
    max_credit_limit: 6000000.0,
    category: "Healthcare Components",
    esg_rating: "AAA",
    co2_footprint: "95 tons/yr",
    ethical_sourcing: "97%",
    agents_used: ["Credit Agent"],
    po_value: 1500000.0,
    clearance_status: "APPROVED",
    operational_rating: "Excellent (98%)",
    delivery_reliability: "99%"
  }
];

// Mock DB Credit Data for Siemens AG Portfolio (different suppliers)
const SIEMENS_PORTFOLIO = [
  {
    supplier_id: "SUP-001",
    supplier_name: "Krupp Steelworks GmbH",
    credit_score: "AAA",
    numerical_rating: 96,
    default_risk: "Extremely Low",
    liquidity_ratio: 2.4,
    debt_to_equity: 0.35,
    payment_behavior: "Pays within 10 days",
    recommended_programs: ["Supplier Early Payment Program", "Unsecured Trade Finance"],
    max_credit_limit: 5000000.0,
    category: "Raw Materials & Heavy Machinery",
    esg_rating: "A",
    co2_footprint: "2,400 tons/yr",
    ethical_sourcing: "94%",
    agents_used: ["Credit Agent", "Compliance & AML Agent"],
    po_value: 1200000.0,
    clearance_status: "APPROVED",
    operational_rating: "Excellent (94%)",
    delivery_reliability: "98%"
  },
  {
    supplier_id: "SUP-002",
    supplier_name: "Optima Microelectronics",
    credit_score: "BB-",
    numerical_rating: 58,
    default_risk: "Moderate-High",
    liquidity_ratio: 0.9,
    debt_to_equity: 1.8,
    payment_behavior: "Frequently delays 30+ days",
    recommended_programs: ["Collateralized Escrow", "Strict Letter of Credit"],
    max_credit_limit: 300000.0,
    category: "Semiconductors & Sensors",
    esg_rating: "B-",
    co2_footprint: "320 tons/yr",
    ethical_sourcing: "72%",
    agents_used: ["Credit Agent", "Compliance & AML Agent", "ESG Agent"],
    po_value: 450000.0,
    clearance_status: "PENDING_FINANCE",
    operational_rating: "Fair (76%)",
    delivery_reliability: "82%"
  },
  {
    supplier_id: "SUP-003",
    supplier_name: "Bavarian Cable Works",
    credit_score: "A+",
    numerical_rating: 84,
    default_risk: "Low",
    liquidity_ratio: 1.6,
    debt_to_equity: 0.75,
    payment_behavior: "Pays within 30 days",
    recommended_programs: ["Supplier Early Payment Program", "Standard Bank Guarantee"],
    max_credit_limit: 2000000.0,
    category: "Electrical & Cabling",
    esg_rating: "A+",
    co2_footprint: "850 tons/yr",
    ethical_sourcing: "89%",
    agents_used: ["Credit Agent", "ESG Agent"],
    po_value: 850000.0,
    clearance_status: "APPROVED",
    operational_rating: "Very Good (88%)",
    delivery_reliability: "92%"
  },
  {
    supplier_id: "SUP-004",
    supplier_name: "Voltaic Power Solutions",
    credit_score: "B+",
    numerical_rating: 68,
    default_risk: "Moderate",
    liquidity_ratio: 1.1,
    debt_to_equity: 1.2,
    payment_behavior: "Pays within 45 days",
    recommended_programs: ["Structured Trade Finance", "Triparty Escrow / Letter of Credit"],
    max_credit_limit: 1000000.0,
    category: "Green Energy Systems",
    esg_rating: "AA",
    co2_footprint: "120 tons/yr",
    ethical_sourcing: "96%",
    agents_used: ["Credit Agent", "ESG Agent"],
    po_value: 2300000.0,
    clearance_status: "APPROVED",
    operational_rating: "Pending Review",
    delivery_reliability: "New Supplier"
  }
];

// Pre-loaded Audit History logs specifically for Philips AG's suppliers
const PHILIPS_AUDIT_LOGS: Record<string, any[]> = {
  "SUP-P01": [
    {
      sender: "Philips Procurement Agent",
      action_type: "REQUEST_SCORE",
      timestamp: "10:14:22 AM",
      message: "Dear The Bank Agent,\nWe request a supplier credit rating assessment for NXP Semiconductors N.V. for a target Purchase Order of €980,000."
    },
    {
      sender: "The Bank Credit Agent",
      action_type: "PROVIDE_SCORE",
      timestamp: "10:14:24 AM",
      message: "Sehr geehrte Damen und Herren,\n\nWe have retrieved credit metrics for NXP Semiconductors N.V. Credit rating: AA- (Low Default Risk). Payment behavior: Pays within 15 days.\nRecommended trade program: Supplier Early Payment Program."
    },
    {
      sender: "Philips Procurement Agent",
      action_type: "DECISION_APPROVE",
      timestamp: "10:14:26 AM",
      message: "The credit rating (AA-) matches our procurement standards. Philips AG formally APPROVES the supplier contract. We will proceed under the Supplier Early Payment Program."
    }
  ],
  "SUP-P02": [
    {
      sender: "Philips Procurement Agent",
      action_type: "REQUEST_SCORE",
      timestamp: "11:02:11 AM",
      message: "Vetting requested for LumiLEDs Lighting on PO €450,000."
    },
    {
      sender: "The Bank Credit Agent",
      action_type: "PROVIDE_SCORE",
      timestamp: "11:02:15 AM",
      message: "LumiLEDs credit rating is A (Low Risk). Standard Bank Guarantee recommended due to capital allocation structure."
    },
    {
      sender: "Philips Procurement Agent",
      action_type: "REQUEST_GUARANTEE",
      timestamp: "11:02:18 AM",
      message: "We request The Bank to register a Standard Bank Guarantee for €450,000 to secure raw material financing."
    },
    {
      sender: "The Bank Credit Agent",
      action_type: "APPROVE_FINANCE",
      timestamp: "11:02:22 AM",
      message: "Standard Bank Guarantee of €450,000 issued and registered under the supplier limit registry."
    },
    {
      sender: "Philips Procurement Agent",
      action_type: "DECISION_APPROVE",
      timestamp: "11:02:25 AM",
      message: "Guarantee confirmed. Philips formally APPROVES the contract with LumiLEDs."
    }
  ],
  "SUP-P03": [
    {
      sender: "Philips Procurement Agent",
      action_type: "REQUEST_SCORE",
      timestamp: "09:30:00 AM",
      message: "Vetting requested for Medical Systems Corp. Target PO amount: €1,500,000."
    },
    {
      sender: "The Bank Credit Agent",
      action_type: "PROVIDE_SCORE",
      timestamp: "09:30:02 AM",
      message: "Medical Systems Corp has a rating of AAA (Extremely Low Risk of default). High liquidity, zero payment delay history.\nRecommended program: Unsecured Early Payment Program."
    },
    {
      sender: "Philips Procurement Agent",
      action_type: "DECISION_APPROVE",
      timestamp: "09:30:05 AM",
      message: "Credit profile is pristine. Philips formally APPROVES the contract immediately."
    }
  ]
};

// Available bank agents list
const ALL_BANK_AGENTS = [
  {
    id: "calculator",
    name: "Risk Calculator",
    description: "Simulates debt, equity, and liquidity risks using dynamic mathematical scoring models.",
    popular: true,
    status: "Active",
    category: "corporate"
  },
  {
    id: "credit",
    name: "Credit",
    description: "Vets supplier credit ratings and stores cleared audit transcripts in connection with your client portals.",
    popular: true,
    status: "Active",
    category: "corporate"
  },
  {
    id: "esg",
    name: "ESG",
    description: "Audits environmental impact, carbon footprint ratings, and ethical governance standards.",
    popular: false,
    status: "Active",
    category: "corporate"
  },
  {
    id: "compliance",
    name: "Compliance & AML",
    description: "Performs real-time Anti-Money Laundering checks and global sanctions validation audits.",
    popular: false,
    status: "Active",
    category: "corporate"
  },
  {
    id: "legal",
    name: "Legal check",
    description: "Validates corporate contracts, jurisdiction constraints, and compliance-related legal provisions.",
    popular: false,
    status: "Inactive",
    category: "corporate"
  },
  {
    id: "mortgage",
    name: "Mortgage Vetting",
    description: "Evaluates individual property loan applications, credit scores, debt-to-income ratios, and collateral valuations.",
    popular: true,
    status: "Active",
    category: "retail"
  },
  {
    id: "wealth",
    name: "Wealth Advisor",
    description: "Formulates personalized investment portfolios, risk tolerance profiles, and retirement planning strategies.",
    popular: true,
    status: "Active",
    category: "retail"
  },
  {
    id: "fraud",
    name: "Fraud Detection",
    description: "Monitors personal account activities, transaction behavior patterns, and anomalous retail banking requests.",
    popular: false,
    status: "Active",
    category: "retail"
  },
  {
    id: "personal_credit",
    name: "Personal Credit Scorer",
    description: "Computes FICO score simulations, consumer repayment probability, and credit card limit recommendations.",
    popular: false,
    status: "Active",
    category: "retail"
  }
];

function getAgentIllustration(id: string) {
  switch (id) {
    case "calculator":
      return (
        <svg className="w-20 h-20 text-[#00b4d8] mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="25" y="15" width="50" height="15" rx="2" />
          <line x1="30" y1="22" x2="70" y2="22" strokeDasharray="2 2" />
          <rect x="20" y="10" width="60" height="75" rx="4" />
          <circle cx="35" cy="45" r="4" />
          <circle cx="50" cy="45" r="4" />
          <circle cx="65" cy="45" r="4" />
          <circle cx="35" cy="58" r="4" />
          <circle cx="50" cy="58" r="4" />
          <circle cx="65" cy="58" r="4" />
          <circle cx="35" cy="71" r="4" />
          <circle cx="50" cy="71" r="4" />
          <rect x="61" y="67" width="8" height="8" rx="1" />
        </svg>
      );
    case "credit":
      return (
        <svg className="w-20 h-20 text-[#00b4d8] mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="20" y="25" width="60" height="40" rx="4" />
          <line x1="20" y1="35" x2="80" y2="35" strokeWidth="2" />
          <rect x="30" y="45" width="10" height="8" rx="1" />
          <circle cx="65" cy="50" r="5" />
          <circle cx="70" cy="50" r="5" />
        </svg>
      );
    case "esg":
      return (
        <svg className="w-20 h-20 text-[#00b4d8] mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="50" cy="50" r="25" />
          <path d="M50,25 C65,25 75,35 75,50 C75,65 65,75 50,75 C50,75 40,60 50,50 C60,40 50,25 50,25 Z" />
          <path d="M35,45 Q42,40 50,50" />
        </svg>
      );
    case "compliance":
      return (
        <svg className="w-20 h-20 text-[#00b4d8] mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M50,15 L75,25 L75,50 C75,68 64,81 50,85 C36,81 25,68 25,50 L25,25 Z" />
          <path d="M40,50 L47,57 L62,42" />
        </svg>
      );
    case "legal":
      return (
        <svg className="w-20 h-20 text-[#00b4d8] mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="25" y="15" width="50" height="70" rx="3" />
          <line x1="35" y1="30" x2="65" y2="30" />
          <line x1="35" y1="42" x2="65" y2="42" />
          <line x1="35" y1="54" x2="55" y2="54" />
          <circle cx="60" cy="70" r="8" />
          <path d="M56,70 L64,70" />
        </svg>
      );
    case "mortgage":
      return (
        <svg className="w-20 h-20 text-[#00b4d8] mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20,50 L50,25 L80,50" />
          <rect x="30" y="50" width="40" height="35" />
          <rect x="45" y="65" width="10" height="20" />
        </svg>
      );
    case "wealth":
      return (
        <svg className="w-20 h-20 text-[#00b4d8] mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20,75 L40,50 L60,60 L80,35" />
          <polyline points="72,35 80,35 80,43" />
          <circle cx="50" cy="50" r="30" strokeDasharray="3 3" />
        </svg>
      );
    case "fraud":
      return (
        <svg className="w-20 h-20 text-[#00b4d8] mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="45" cy="45" r="18" />
          <line x1="58" y1="58" x2="78" y2="78" strokeWidth="3" />
          <path d="M35,45 C35,39 39,35 45,35" />
        </svg>
      );
    case "personal_credit":
      return (
        <svg className="w-20 h-20 text-[#00b4d8] mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20,70 A35,35 0 0,1 80,70" />
          <line x1="50" y1="70" x2="65" y2="45" strokeWidth="2.5" />
          <circle cx="50" cy="70" r="5" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export default function TheBankDashboard() {
  const [selectedAgentId, setSelectedAgentId] = useState("calculator");
  const [agentCategory, setAgentCategory] = useState<"corporate" | "retail">("corporate");
  const [agentSearch, setAgentSearch] = useState("");

  // Client Portfolio search states
  const [clientSearch, setClientSearch] = useState("");
  const [activeClient, setActiveClient] = useState<"Philips AG" | "Siemens AG">("Philips AG");
  const [selectedSupId, setSelectedSupId] = useState<string | null>("SUP-P01");

  // Siemens Sync History
  const [backendHistory, setBackendHistory] = useState<any[]>([]);

  // Risk Calculator Agent States
  const [calcLiquidity, setCalcLiquidity] = useState(1.5);
  const [calcDebtToEquity, setCalcDebtToEquity] = useState(0.8);
  const [calcPoValue, setCalcPoValue] = useState(500000);
  const [calcResult, setCalcResult] = useState({ score: "A", risk: "Low", rating: 80 });

  // Sync with backend history for Siemens interactions
  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000); // Poll backend history every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/history");
      if (res.ok) {
        const data = await res.json();
        setBackendHistory(data);
      }
    } catch (e) {
      // Backend offline
    }
  };

  // Dynamically choose active registry based on search & state
  const isSiemensSearching = clientSearch.toLowerCase().includes("siemens");

  // React to search changes
  useEffect(() => {
    if (isSiemensSearching) {
      setActiveClient("Siemens AG");
      setSelectedSupId("SUP-001");
    } else {
      setActiveClient("Philips AG");
      setSelectedSupId("SUP-P01");
    }
  }, [clientSearch]);

  const activeRegistry = activeClient === "Siemens AG" ? SIEMENS_PORTFOLIO : PHILIPS_PORTFOLIO;

  // Find matching supplier details
  const rawSupplier = selectedSupId
    ? (activeRegistry.find(s => s.supplier_id === selectedSupId) || null)
    : null;

  // If Siemens is active, check if there's a live run in the backend history to override supplier ratings
  const matchedHistory = (activeClient === "Siemens AG" && rawSupplier)
    ? backendHistory.find(h => h.supplier_id === rawSupplier.supplier_id)
    : null;

  const selectedSupplier = rawSupplier
    ? (matchedHistory
      ? {
        ...rawSupplier,
        credit_score: matchedHistory.db_credit_score,
        numerical_rating: matchedHistory.db_numerical_rating,
        default_risk: matchedHistory.db_risk_level,
        po_value: matchedHistory.po_value,
        clearance_status: matchedHistory.siemens_decision,
        logs: matchedHistory.logs
      }
      : rawSupplier)
    : null;


  useEffect(() => {
    calculateRiskMetrics();
  }, [calcLiquidity, calcDebtToEquity, calcPoValue]);

  // Dynamic Risk Calculator Logic
  const calculateRiskMetrics = () => {
    let rating = 50;
    rating += (calcLiquidity - 1) * 20;
    rating -= (calcDebtToEquity - 1) * 20;
    if (calcPoValue > 1500000) rating -= 10;
    else if (calcPoValue < 300000) rating += 5;

    rating = Math.max(10, Math.min(100, Math.round(rating)));

    let score = "BBB";
    let risk = "Medium";

    if (rating >= 90) {
      score = "AAA";
      risk = "Extremely Low";
    } else if (rating >= 80) {
      score = "A+";
      risk = "Low";
    } else if (rating >= 70) {
      score = "A";
      risk = "Low";
    } else if (rating >= 60) {
      score = "BBB";
      risk = "Medium";
    } else if (rating >= 50) {
      score = "B+";
      risk = "Moderate";
    } else {
      score = "BB-";
      risk = "Moderate-High";
    }

    setCalcResult({ score, risk, rating });
  };

  // Filter agents list based on category & search query
  const filteredAgents = ALL_BANK_AGENTS.filter(agent =>
    agent.category === agentCategory &&
    (agent.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
     agent.description.toLowerCase().includes(agentSearch.toLowerCase()))
  );

  const activeAgentInfo = ALL_BANK_AGENTS.find(a => a.id === selectedAgentId) || 
                          ALL_BANK_AGENTS.find(a => a.category === agentCategory) ||
                          ALL_BANK_AGENTS[0];

  return (
    <div
      className="min-h-screen text-slate-900 font-sans flex flex-col"
      style={{
        backgroundImage: "radial-gradient(circle at center, rgba(225, 238, 255, 0.78) 0%, rgba(195, 220, 255, 0.9) 100%), url('/futuristic_bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* The Bank Header */}
      <header className="bg-[#002f6c]/90 backdrop-blur-md text-white px-6 py-4 shadow-lg sticky top-0 z-50 border-b border-blue-900/30">
        <div className="max-w-[80%] w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Custom glowing fire logo representing The Bank */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002f6c] via-[#0018a8] to-blue-900 flex items-center justify-center shadow-lg border border-white/20 relative overflow-hidden">
              <div className="absolute w-6 h-6 rounded-full bg-orange-500/30 blur-md animate-pulse"></div>
              <svg className="w-7 h-7 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.555-.398-1.152-.385-1.708a1 1 0 00-.607-.906 1 1 0 00-1.153.276 8.358 8.358 0 00-1.72 4.482C3.338 13.5 5.5 17 9.5 17c.5 0 1 0 1.5-.117a4.996 4.996 0 003.784-2.503 6.94 6.94 0 001.07-3.192 7.02 7.02 0 00-.18-2.616c-.08-.432-.2-.841-.358-1.222a.144.144 0 00-.016-.03c-.223-.518-.5-.992-.807-1.396a8.435 8.435 0 00-1.196-1.37zM14 15.078v-.03c-.002 0-.004-.001-.006-.001-.002 0-.003.001-.005.001v.03c0 .03.001.06.002.09h-.006a3.502 3.502 0 01-1.159-2.226 1 1 0 00-1.037-.81h-.033a1 1 0 00-.915.65 6.005 6.005 0 01-1.077 1.954C8.423 16.037 7.07 16.5 6 15.347c.725-.138 1.433-.674 1.83-1.427a1 1 0 00-.251-1.312 3.5 3.5 0 01-1.1-2.484c0-.66.173-1.282.477-1.824a6.012 6.012 0 012.923 2.924 1 1 0 001.075.642 3.502 3.502 0 012.96 1.815c.162.308.283.642.353.992a6.01 6.01 0 011.082 1.979z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xl md:text-2xl tracking-wide">The Bank</span>
              <span className="text-xs md:text-sm text-blue-200 font-medium tracking-widest uppercase mt-0.5">
                Futurize Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] md:text-xs text-emerald-350 bg-[#0018a8]/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-blue-400/30 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Secure Link
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace (Stacked Vertically: Up and Down) */}
      <main className="flex-1 max-w-[80%] w-[80%] mx-auto p-4 md:p-6 flex flex-col gap-6">

        {/* ROW 1: prometheus ai gardens (SINGLE CONTAINER - 30% LARGER IN VISUAL HEIGHT & SPACING) */}
        <div className="w-full flex-1 bg-white/70 backdrop-blur-md rounded-xl border border-blue-200/40 p-8 shadow-md flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-50 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#002f6c] animate-pulse"></span>
              <h2 className="text-lg md:text-xl text-[#002f6c] font-black uppercase tracking-wider">
                prometheus ai gardens
              </h2>
            </div>
            {/* Agent Search - kept on top of the layout */}
            <div className="relative w-full md:w-56">
              <input
                type="text"
                placeholder="Search agents..."
                value={agentSearch}
                onChange={(e) => setAgentSearch(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-blue-100 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-[#002f6c] text-slate-800 font-medium"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Tabs & description wrapped with a smaller vertical gap to reduce space */}
          <div className="flex flex-col gap-2 flex-1">
            {/* Category Tabs: Corporate vs Retail */}
            <div className="flex border-b border-blue-100 pb-2 mb-2 gap-4">
              <button
                onClick={() => {
                  setAgentCategory("corporate");
                  setSelectedAgentId("calculator");
                }}
                className={`pb-2 px-1 text-sm font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  agentCategory === "corporate"
                    ? "border-[#002f6c] text-[#002f6c]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                🏢 Corporate Agents
              </button>
              <button
                onClick={() => {
                  setAgentCategory("retail");
                  setSelectedAgentId("mortgage");
                }}
                className={`pb-2 px-1 text-sm font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                  agentCategory === "retail"
                    ? "border-[#002f6c] text-[#002f6c]"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                👤 Retail Agents
              </button>
            </div>

            {/* Agent Selection Grid (Horizontal List - Modern cards matching the DB Developer portal style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-2">
              {filteredAgents.map((agent) => {
                const isSelected = selectedAgentId === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md ${
                      isSelected
                        ? "border-[#00b4d8] ring-1 ring-[#00b4d8]/20"
                        : "border-slate-200/60 hover:border-slate-350"
                    }`}
                  >
                    {/* Top status badge */}
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      {agent.status === "Active" ? (
                        <span className="bg-[#4ea800] text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
                          Live
                        </span>
                      ) : (
                        <span className="bg-[#ff9e1b] text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
                          Simulation
                        </span>
                      )}
                      {agent.popular && (
                        <span className="bg-[#002f6c] text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Center illustration */}
                    <div className="py-3 flex justify-center bg-slate-50/50 rounded-xl mb-4 border border-slate-100/50">
                      {getAgentIllustration(agent.id)}
                    </div>

                    {/* Agent details */}
                    <div className="flex-1 flex flex-col justify-between min-h-[140px]">
                      <div>
                        <h3 className="text-slate-800 text-sm md:text-base font-bold tracking-tight mb-2">
                          {agent.name}
                        </h3>
                        <p className="text-slate-500 text-[11px] md:text-xs leading-relaxed mb-4 font-medium line-clamp-4">
                          {agent.description}
                        </p>
                      </div>

                      {/* Footer CTA */}
                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-auto">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected 
                            ? "bg-[#00b4d8]/10 border-[#00b4d8] text-[#00b4d8]" 
                            : "border-slate-300 text-slate-400"
                        }`}>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <span className={`text-[10px] md:text-xs font-bold transition-all ${
                          isSelected ? "text-[#00b4d8]" : "text-slate-500 hover:text-slate-700"
                        }`}>
                          {isSelected ? "Active Agent" : "Use Product"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredAgents.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-400 text-sm font-mono">No agents match.</div>
              )}
            </div>

            {/* Active Agent Workspace / Description Layout */}
            <div className="flex-1 bg-white/80 backdrop-blur-md rounded-xl border border-blue-200/50 p-6 shadow-md mt-0 flex flex-col">
              <div className="flex flex-col gap-4 flex-1">

                {/* 1. BANK AGENTS DESCRIPTION (ALWAYS FIRST AS REQUESTED - POSITIONED RIGHT UNDER SELECTED TAB) */}
                <div className="bg-blue-50/30 p-4 rounded-lg border border-blue-100 text-sm md:text-base text-[#002f6c] leading-relaxed shadow-sm font-medium">
                  <h3 className="text-[#002f6c] text-lg font-black uppercase tracking-wider mb-1 flex items-center gap-2">
                    🤖 {activeAgentInfo.name}
                  </h3>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                    {activeAgentInfo.description}
                  </p>
                </div>



                {selectedAgentId === "calculator" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 animate-fadeIn">
                    <div className="flex flex-col gap-4 text-sm">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>Liquidity Ratio</span>
                          <span className="text-[#002f6c]">{calcLiquidity}</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="3.5"
                          step="0.1"
                          value={calcLiquidity}
                          onChange={(e) => setCalcLiquidity(parseFloat(e.target.value))}
                          className="w-full accent-[#002f6c] h-1"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between font-bold text-slate-700">
                          <span>Debt-to-Equity</span>
                          <span className="text-[#002f6c]">{calcDebtToEquity}</span>
                        </div>
                        <input
                          type="range"
                          min="0.1"
                          max="2.5"
                          step="0.1"
                          value={calcDebtToEquity}
                          onChange={(e) => setCalcDebtToEquity(parseFloat(e.target.value))}
                          className="w-full accent-[#002f6c] h-1"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50/20 border border-blue-100 px-4 py-3 rounded-lg flex items-center justify-between text-center">
                      <div className="flex flex-col items-center justify-center w-full">
                        <span className="text-[11px] md:text-xs text-slate-400 font-bold uppercase tracking-wider block">Estimated Credit Rating</span>
                        <strong className="text-3xl font-black text-[#002f6c] mt-1">{calcResult.score}</strong>
                        <span className="text-[11px] md:text-xs text-slate-500 font-semibold mt-0.5">Rating: {calcResult.rating}/100</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAgentId === "esg" && selectedSupplier && (
                  <div className="mt-2 animate-fadeIn">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-slate-50 border border-blue-50 p-3 rounded flex flex-col justify-between">
                        <span className="text-[11px] md:text-xs text-slate-450 font-bold uppercase">ESG Score</span>
                        <strong className="text-emerald-700 text-xl mt-1">{selectedSupplier.esg_rating}</strong>
                      </div>
                      <div className="bg-slate-50 border border-blue-50 p-3 rounded flex flex-col justify-between">
                        <span className="text-[11px] md:text-xs text-slate-450 font-bold uppercase">CO2 Footprint</span>
                        <strong className="text-slate-800 text-base mt-1">{selectedSupplier.co2_footprint}</strong>
                      </div>
                      <div className="bg-slate-50 border border-blue-50 p-3 rounded flex flex-col justify-between">
                        <span className="text-[11px] md:text-xs text-slate-450 font-bold uppercase">Ethical Sourcing</span>
                        <strong className="text-slate-855 text-base mt-1">{selectedSupplier.ethical_sourcing}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {selectedAgentId === "compliance" && (
                  <div className="space-y-2 text-sm font-mono mt-2 animate-fadeIn">
                    <div className="flex justify-between p-3 bg-slate-50 border border-blue-50 rounded">
                      <span>OFAC Sanctions Vetting:</span>
                      <span className="text-emerald-700 font-bold">PASSED</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 border border-blue-50 rounded">
                      <span>PEP Lists registry Check:</span>
                      <span className="text-emerald-700 font-bold">PASSED</span>
                    </div>
                  </div>
                )}

                {selectedAgentId === "legal" && (
                  <div className="mt-2 animate-fadeIn flex flex-col gap-2.5">
                    <span className="text-xs md:text-sm text-[#002f6c] font-bold uppercase tracking-wider block">
                      Vetting Parameters (Currently Suspended)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="flex justify-between p-3 bg-slate-50/60 border border-slate-200 text-slate-400 rounded-lg">
                        <span>Contract Clause Verification</span>
                        <span className="text-amber-600 font-bold">SUSPENDED</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50/60 border border-slate-200 text-slate-400 rounded-lg">
                        <span>Jurisdictional Audits</span>
                        <span className="text-amber-600 font-bold">SUSPENDED</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50/60 border border-slate-200 text-slate-400 rounded-lg">
                        <span>Corporate Shield Vetting</span>
                        <span className="text-amber-600 font-bold">SUSPENDED</span>
                      </div>
                      <div className="flex justify-between p-3 bg-slate-50/60 border border-slate-200 text-slate-400 rounded-lg">
                        <span>Insurance Bond Clearance</span>
                        <span className="text-amber-600 font-bold">SUSPENDED</span>
                      </div>
                    </div>
                    <div className="bg-slate-100/60 border border-slate-200 p-3 rounded-lg text-center text-slate-450 text-[10px] font-mono mt-1">
                      ⚠️ Legal check agent is currently INACTIVE. Session auditing and real-time compliance vetting are suspended.
                    </div>
                  </div>
                )}

                {selectedAgentId === "mortgage" && (
                  <div className="mt-2 animate-fadeIn grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 bg-slate-50 border border-blue-50 rounded-lg flex flex-col gap-1.5">
                      <span className="font-bold text-[#002f6c] uppercase">Mortgage Risk Assessment</span>
                      <div className="flex justify-between border-b border-blue-50/50 pb-1">
                        <span>Debt-to-Income (DTI):</span>
                        <span className="text-emerald-700 font-bold">28% (Optimal)</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-50/50 pb-1">
                        <span>Loan-to-Value (LTV):</span>
                        <span className="text-emerald-700 font-bold">75% (Safe)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Co-Signer Vetting:</span>
                        <span className="text-slate-500 font-bold">Not Required</span>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg flex flex-col justify-center items-center text-center">
                      <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Pre-Approval Recommendation</span>
                      <strong className="text-2xl font-black text-emerald-700 mt-1">APPROVED</strong>
                      <span className="text-[9px] text-slate-500 mt-1">Maximum Eligible: $1,200,000</span>
                    </div>
                  </div>
                )}

                {selectedAgentId === "wealth" && (
                  <div className="mt-2 animate-fadeIn flex flex-col gap-3 font-mono text-xs">
                    <span className="text-xs md:text-sm text-[#002f6c] font-bold uppercase tracking-wider block">
                      Target Portfolio Allocation
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="bg-slate-50 border border-blue-50 p-3 rounded flex flex-col justify-between">
                        <span className="text-[9px] text-slate-450 font-bold uppercase">Equities</span>
                        <strong className="text-slate-800 text-lg mt-1">60%</strong>
                      </div>
                      <div className="bg-slate-50 border border-blue-50 p-3 rounded flex flex-col justify-between">
                        <span className="text-[9px] text-slate-455 font-bold uppercase">Fixed Income</span>
                        <strong className="text-slate-800 text-lg mt-1">25%</strong>
                      </div>
                      <div className="bg-slate-50 border border-blue-50 p-3 rounded flex flex-col justify-between">
                        <span className="text-[9px] text-slate-455 font-bold uppercase">Alternatives</span>
                        <strong className="text-slate-800 text-lg mt-1">10%</strong>
                      </div>
                      <div className="bg-slate-50 border border-blue-50 p-3 rounded flex flex-col justify-between">
                        <span className="text-[9px] text-slate-455 font-bold uppercase">Cash</span>
                        <strong className="text-slate-800 text-lg mt-1">5%</strong>
                      </div>
                    </div>
                    <div className="bg-blue-50/30 border border-blue-100 p-2.5 rounded-lg text-slate-650 text-[10px] leading-relaxed">
                      ℹ️ **Strategy**: Diversified Growth. Optimized for moderate-high risk tolerance with bi-annual rebalancing signals activated.
                    </div>
                  </div>
                )}

                {selectedAgentId === "fraud" && (
                  <div className="mt-2 animate-fadeIn space-y-2 text-sm font-mono">
                    <div className="flex justify-between p-3 bg-slate-50 border border-blue-50 rounded">
                      <span>IP Geolocation Audit:</span>
                      <span className="text-emerald-700 font-bold">MATCH (Within 5 miles)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50 border border-blue-50 rounded">
                      <span>Biometric keystroke verification:</span>
                      <span className="text-emerald-700 font-bold">98.4% CONFIDENCE</span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50/40 border border-red-100 rounded text-red-800">
                      <span>Suspicious Transaction Flag:</span>
                      <span className="font-bold">CLEARED (0 Flags)</span>
                    </div>
                  </div>
                )}

                {selectedAgentId === "personal_credit" && (
                  <div className="mt-2 animate-fadeIn grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 bg-slate-50 border border-blue-50 rounded-lg flex flex-col gap-1.5">
                      <span className="font-bold text-[#002f6c] uppercase">Consumer Credit Metrics</span>
                      <div className="flex justify-between border-b border-blue-50/50 pb-1">
                        <span>Equifax score:</span>
                        <span className="text-emerald-700 font-bold">785 (Excellent)</span>
                      </div>
                      <div className="flex justify-between border-b border-blue-50/50 pb-1">
                        <span>TransUnion score:</span>
                        <span className="text-emerald-700 font-bold">790 (Excellent)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Credit Utilization:</span>
                        <span className="text-emerald-700 font-bold">12.5%</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-blue-50 rounded-lg flex flex-col justify-center gap-1.5">
                      <div className="flex justify-between">
                        <span>Derogatory Marks:</span>
                        <span className="text-emerald-700 font-bold">0</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Average Account Age:</span>
                        <span className="text-slate-700 font-bold">8.4 Years</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span>Recommended Limit:</span>
                        <span className="text-slate-700 font-bold">$25,000 (Visa Signature)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Right Use Me Button */}
                <div className="flex justify-end mt-auto pt-4 border-t border-slate-100">
                  <button 
                    onClick={() => alert(`Agent "${activeAgentInfo.name}" activated!`)}
                    className="bg-[#002f6c] hover:bg-blue-800 text-white font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 text-xs transition cursor-pointer shadow-md"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Use Me
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#002f6c]/90 backdrop-blur-sm text-slate-300 text-sm md:text-base px-6 py-4 mt-8 border-t border-blue-900">
        <div className="max-w-[80%] w-[80%] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 The Bank AG. Member FDIC.</span>
          <span className="text-slate-400 font-semibold uppercase tracking-widest text-[11px] md:text-xs">
            RESTRICTED AUDITING ENVIRONMENT
          </span>
        </div>
      </footer>
    </div>
  );
}
