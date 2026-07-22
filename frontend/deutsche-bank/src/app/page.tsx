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
      message: "Dear Prometheus Bank Agent,\nWe request a supplier credit rating assessment for NXP Semiconductors N.V. for a target Purchase Order of €980,000."
    },
    {
      sender: "Prometheus Bank Credit Agent",
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
      sender: "Prometheus Bank Credit Agent",
      action_type: "PROVIDE_SCORE",
      timestamp: "11:02:15 AM",
      message: "LumiLEDs credit rating is A (Low Risk). Standard Bank Guarantee recommended due to capital allocation structure."
    },
    {
      sender: "Philips Procurement Agent",
      action_type: "REQUEST_GUARANTEE",
      timestamp: "11:02:18 AM",
      message: "We request Prometheus Bank to register a Standard Bank Guarantee for €450,000 to secure raw material financing."
    },
    {
      sender: "Prometheus Bank Credit Agent",
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
      sender: "Prometheus Bank Credit Agent",
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
    name: "Risk Calculator Agent",
    description: "Simulates debt, equity, and liquidity risks using dynamic mathematical scoring models.",
    popular: true,
    status: "Active"
  },
  {
    id: "credit",
    name: "Credit Agent",
    description: "Vets supplier credit ratings and stores cleared audit transcripts in connection with your client portals.",
    popular: true,
    status: "Active"
  },
  {
    id: "esg",
    name: "ESG Agent",
    description: "Audits environmental impact, carbon footprint ratings, and ethical governance standards.",
    popular: false,
    status: "Active"
  },
  {
    id: "compliance",
    name: "Compliance & AML Agent",
    description: "Performs real-time Anti-Money Laundering checks and global sanctions validation audits.",
    popular: false,
    status: "Active"
  },
  {
    id: "legal",
    name: "Legal check agent",
    description: "Validates corporate contracts, jurisdiction constraints, and compliance-related legal provisions.",
    popular: false,
    status: "Inactive"
  }
];

export default function PrometheusBankDashboard() {
  const [selectedAgentId, setSelectedAgentId] = useState("calculator");
  const [agentSearch, setAgentSearch] = useState("");

  // Client Portfolio search states
  const [clientSearch, setClientSearch] = useState("");
  const [activeClient, setActiveClient] = useState<"Philips AG" | "Siemens AG">("Philips AG");
  const [selectedSupId, setSelectedSupId] = useState<string | null>(null);

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
    } else {
      setActiveClient("Philips AG");
    }
    setSelectedSupId(null);
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

  // Filter agents list based on search query
  const filteredAgents = ALL_BANK_AGENTS.filter(agent =>
    agent.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
    agent.description.toLowerCase().includes(agentSearch.toLowerCase())
  );

  const activeAgentInfo = ALL_BANK_AGENTS.find(a => a.id === selectedAgentId) || ALL_BANK_AGENTS[0];

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
      {/* Prometheus Bank Header */}
      <header className="bg-[#002f6c]/90 backdrop-blur-md text-white px-6 py-4 shadow-lg sticky top-0 z-50 border-b border-blue-900/30">
        <div className="max-w-[80%] w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Custom glowing fire logo representing Prometheus Bank */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#002f6c] via-[#0018a8] to-blue-900 flex items-center justify-center shadow-lg border border-white/20 relative overflow-hidden">
              <div className="absolute w-6 h-6 rounded-full bg-orange-500/30 blur-md animate-pulse"></div>
              <svg className="w-7 h-7 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] z-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.555-.398-1.152-.385-1.708a1 1 0 00-.607-.906 1 1 0 00-1.153.276 8.358 8.358 0 00-1.72 4.482C3.338 13.5 5.5 17 9.5 17c.5 0 1 0 1.5-.117a4.996 4.996 0 003.784-2.503 6.94 6.94 0 001.07-3.192 7.02 7.02 0 00-.18-2.616c-.08-.432-.2-.841-.358-1.222a.144.144 0 00-.016-.03c-.223-.518-.5-.992-.807-1.396a8.435 8.435 0 00-1.196-1.37zM14 15.078v-.03c-.002 0-.004-.001-.006-.001-.002 0-.003.001-.005.001v.03c0 .03.001.06.002.09h-.006a3.502 3.502 0 01-1.159-2.226 1 1 0 00-1.037-.81h-.033a1 1 0 00-.915.65 6.005 6.005 0 01-1.077 1.954C8.423 16.037 7.07 16.5 6 15.347c.725-.138 1.433-.674 1.83-1.427a1 1 0 00-.251-1.312 3.5 3.5 0 01-1.1-2.484c0-.66.173-1.282.477-1.824a6.012 6.012 0 012.923 2.924 1 1 0 001.075.642 3.502 3.502 0 012.96 1.815c.162.308.283.642.353.992a6.01 6.01 0 011.082 1.979z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xl md:text-2xl tracking-wide">Prometheus Bank</span>
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

        {/* ROW 1: promAgents (SINGLE CONTAINER - 30% LARGER IN VISUAL HEIGHT & SPACING) */}
        <div className="w-full bg-white/70 backdrop-blur-md rounded-xl border border-blue-200/40 p-8 shadow-md flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-50 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-[#002f6c] animate-pulse"></span>
              <h2 className="text-lg md:text-xl text-[#002f6c] font-black uppercase tracking-wider">
                promAgents
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
          <div className="flex flex-col gap-2">
            {/* Agent Selection Grid (Horizontal List - Modern cards with 3D icons, no description) */}
            <div className="flex flex-wrap items-stretch gap-2.5">
              {filteredAgents.map((agent) => {
                const agentImg = agent.id === "credit" ? "/credit_agent.png" : agent.id === "calculator" ? "/risk_agent.png" : agent.id === "esg" ? "/esg_agent.png" : agent.id === "compliance" ? "/compliance_agent.png" : "/legal_agent.png";
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`flex-1 sm:flex-initial min-w-[180px] text-left p-3 rounded-xl border transition flex items-center gap-3 focus:outline-none cursor-pointer hover:shadow-sm ${selectedAgentId === agent.id
                      ? "bg-blue-50/60 border-2 border-[#002f6c] text-[#002f6c] shadow-sm font-semibold"
                      : "bg-slate-50 border border-blue-50 hover:bg-blue-50/50 text-slate-800 hover:border-blue-200"
                      }`}
                  >
                    <img src={agentImg} alt={agent.name} className="w-9 h-9 rounded-lg object-cover bg-white/10 p-0.5 border border-blue-100/10 shadow-sm" />
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <span className="font-bold text-xs md:text-sm truncate leading-tight">{agent.name}</span>
                      <span className={`text-[9px] md:text-xs self-start px-1.5 py-0.2 rounded font-bold uppercase leading-none ${agent.status === "Inactive" ? "bg-slate-200 text-slate-500 border border-slate-350" : (selectedAgentId === agent.id ? "bg-blue-800 text-white" : "bg-emerald-50 text-emerald-800")}`}>
                        {agent.status}
                      </span>
                    </div>
                  </button>
                );
              })}
              {filteredAgents.length === 0 && (
                <div className="w-full text-center py-4 text-slate-400 text-sm font-mono">No agents match.</div>
              )}
            </div>

            {/* Active Agent Workspace / Description Layout */}
            <div className="bg-white/80 backdrop-blur-md rounded-xl border-2 border-[#002f6c]/85 p-6 shadow-md mt-0">
            <div className="flex flex-col gap-4">

              {/* 1. BANK AGENTS DESCRIPTION (ALWAYS FIRST AS REQUESTED - POSITIONED RIGHT UNDER SELECTED TAB) */}
              <div className="bg-blue-50/30 p-4 rounded-lg border border-blue-200 text-sm md:text-base text-[#002f6c] leading-relaxed shadow-sm font-medium">
                <span className="font-bold block mb-1">Agent Role & Capabilities:</span>
                {activeAgentInfo.description}
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

              {selectedAgentId === "esg" && (
                <div className="mt-2 animate-fadeIn">
                  {!selectedSupplier ? (
                    <div className="bg-slate-50 border border-blue-50 p-4 rounded text-center text-slate-400 text-sm font-mono">
                      Please select a supplier from the Client Agents history list below to view ESG ratings.
                    </div>
                  ) : (
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
                  )}
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

            </div>
          </div>
        </div>
      </div>
        {/* ROW 2: Client Agents history (SINGLE CONTAINER REDUCED BY 30%, SMALLER FONT) */}
        <div className="w-full bg-white/70 backdrop-blur-md rounded-xl border border-blue-200/40 p-4 shadow-sm flex flex-col gap-4">

          {/* Top Header & Search Area */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-blue-50 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#002f6c] animate-pulse"></span>
              <h2 className="text-sm md:text-base text-[#002f6c] font-black uppercase tracking-wider">
                Client Agents history
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
              {/* Active record styled with a 3D glowing indicator badge instead of active text */}
              <div className="text-xs md:text-sm font-bold flex items-center gap-2 bg-slate-50/50 backdrop-blur-sm border border-blue-100 rounded-lg py-1 px-2.5 shadow-sm">
                <div className="relative flex items-center justify-center">
                  <img
                    src="/active_badge.png"
                    alt="Active Status"
                    className="w-4 h-4 object-contain"
                    style={{ animation: 'spin 12s linear infinite', filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' }}
                  />
                  <span className="absolute w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase leading-none">Active Record</span>
                  <strong className="text-[#002f6c] text-xs font-black leading-none mt-0.5">
                    {activeClient}
                  </strong>
                </div>
              </div>

              {/* Portfolio Search */}
              <div className="relative w-full md:w-44">
                <input
                  type="text"
                  placeholder="Search..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full text-[11px] bg-slate-50 border border-blue-100 rounded-lg pl-7 pr-2 py-1.5 focus:outline-none focus:border-[#002f6c] text-slate-800 font-medium"
                />
                <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Supplier Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {activeRegistry.map((sup) => (
              <button
                key={sup.supplier_id}
                onClick={() => setSelectedSupId(sup.supplier_id)}
                className={`w-full text-left p-3 rounded-lg border transition flex flex-col gap-1.5 focus:outline-none cursor-pointer ${selectedSupId === sup.supplier_id
                  ? "bg-[#002f6c] border-[#002f6c] text-white shadow-md font-semibold"
                  : "bg-slate-50 border-blue-50 hover:bg-blue-50/50 text-slate-800 hover:border-blue-200"
                  }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-bold text-xs truncate max-w-[150px]">{sup.supplier_name}</span>
                  <span className={`text-[10px] font-black ${selectedSupId === sup.supplier_id ? "text-blue-200" : "text-[#002f6c]"
                    }`}>{sup.credit_score}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-semibold">
                  <span className={selectedSupId === sup.supplier_id ? "text-blue-100" : "text-slate-400"}>
                    ID: {sup.supplier_id}
                  </span>
                  <span className={selectedSupId === sup.supplier_id ? "text-blue-100" : "text-slate-500"}>
                    Risk: {sup.default_risk}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Description Layout (Up and Down - only shown if selection exists) */}
          <div className="bg-blue-50/20 backdrop-blur-sm rounded-xl border border-blue-100/40 p-4 mt-2 shadow-inner text-[10px]">
            {!selectedSupplier ? (
              <div className="text-center py-8 flex flex-col items-center justify-center gap-2">
                <svg className="w-10 h-10 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-slate-455 font-bold text-xs">No Supplier Selected</span>
                <p className="text-slate-400 text-[10px] max-w-sm">
                  Please select a supplier from the Client Agents history list above to view their details and vetting scorecard.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 animate-fadeIn">
                <div className="border-b border-blue-50 pb-1.5 flex justify-between items-center">
                  <h3 className="text-[#002f6c] font-bold text-xs uppercase tracking-wider">
                    Supplier Vetting Scorecard - {selectedSupplier.supplier_name}
                  </h3>
                  <span className={`px-2 py-0.2 rounded text-[9px] font-bold ${selectedSupplier.clearance_status === "APPROVED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                    : "bg-amber-50 text-amber-700 border border-amber-150"
                    }`}>
                    {selectedSupplier.clearance_status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">

                  {/* Scorecard Parameters */}
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="text-[8px] text-slate-450 font-bold uppercase tracking-wider block">Company Name</label>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedSupplier.supplier_name}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-blue-50 pt-1.5">
                      <div>
                        <label className="text-[8px] text-slate-450 font-bold uppercase block tracking-wider">Target PO Amount</label>
                        <strong className="text-slate-700 text-xs block mt-0.5 font-bold">€{selectedSupplier.po_value.toLocaleString()}</strong>
                      </div>
                      <div>
                        <label className="text-[8px] text-slate-450 font-bold uppercase block tracking-wider">Max Credit Limit</label>
                        <strong className="text-slate-750 text-xs block mt-0.5 font-bold">€{selectedSupplier.max_credit_limit.toLocaleString()}</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-blue-50 pt-1.5">
                      <div>
                        <label className="text-[8px] text-slate-455 font-bold uppercase block tracking-wider">Liquidity Ratio</label>
                        <span className="font-semibold text-slate-700 block mt-0.5 text-xs">{selectedSupplier.liquidity_ratio}</span>
                      </div>
                      <div>
                        <label className="text-[8px] text-slate-455 font-bold uppercase block tracking-wider">Debt-to-Equity</label>
                        <span className="font-semibold text-slate-700 block mt-0.5 text-xs">{selectedSupplier.debt_to_equity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent vetting and audits */}
                  <div className="flex flex-col gap-2 justify-between">
                    <div>
                      <label className="text-[8px] text-slate-450 font-bold uppercase block tracking-wider"> Vetting Agents Used</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedSupplier.agents_used.map((agentName, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-[#002f6c] border border-blue-100 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1"
                          >
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            {agentName}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-blue-50 pt-1.5">
                      <label className="text-[8px] text-slate-450 font-bold uppercase block tracking-wider">Sourcing Vetting Remarks</label>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                        {selectedSupplier.payment_behavior}. Risk metrics and PO parameters are updated dynamically in sync with the client procurement portals.
                      </p>
                    </div>
                  </div>

                </div>

                <div className="border-t border-blue-50 pt-2 mt-2 text-[9px] text-slate-455 font-mono flex items-center justify-between">
                  <span>Security Code: DB-VETTED-RECORD</span>
                  <span>Audit Clearance Certified</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#002f6c]/90 backdrop-blur-sm text-slate-300 text-sm md:text-base px-6 py-4 mt-8 border-t border-blue-900">
        <div className="max-w-[80%] w-[80%] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 Prometheus Bank AG. Member FDIC.</span>
          <span className="text-slate-400 font-semibold uppercase tracking-widest text-[11px] md:text-xs">
            RESTRICTED AUDITING ENVIRONMENT
          </span>
        </div>
      </footer>
    </div>
  );
}
