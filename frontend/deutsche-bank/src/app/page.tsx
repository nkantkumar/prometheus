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
      message: "Dear Deutsche Bank Agent,\nWe request a supplier credit rating assessment for NXP Semiconductors N.V. for a target Purchase Order of €980,000."
    },
    {
      sender: "Deutsche Bank Credit Agent",
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
      sender: "Deutsche Bank Credit Agent",
      action_type: "PROVIDE_SCORE",
      timestamp: "11:02:15 AM",
      message: "LumiLEDs credit rating is A (Low Risk). Standard Bank Guarantee recommended due to capital allocation structure."
    },
    {
      sender: "Philips Procurement Agent",
      action_type: "REQUEST_GUARANTEE",
      timestamp: "11:02:18 AM",
      message: "We request Deutsche Bank to register a Standard Bank Guarantee for €450,000 to secure raw material financing."
    },
    {
      sender: "Deutsche Bank Credit Agent",
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
      sender: "Deutsche Bank Credit Agent",
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
    id: "credit",
    name: "Credit Agent",
    description: "Vets supplier credit ratings and stores cleared audit transcripts in connection with your client portals.",
    popular: true,
    status: "Active"
  },
  {
    id: "calculator",
    name: "Risk Calculator Agent",
    description: "Simulates debt, equity, and liquidity risks using dynamic mathematical scoring models.",
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
  }
];

export default function DeutscheBankDashboard() {
  const [selectedAgentId, setSelectedAgentId] = useState("credit");
  const [agentSearch, setAgentSearch] = useState("");
  
  // Client Portfolio search states
  const [clientSearch, setClientSearch] = useState("");
  const [activeClient, setActiveClient] = useState<"Philips AG" | "Siemens AG">("Philips AG");
  const [selectedSupId, setSelectedSupId] = useState("SUP-P01");

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
  const rawSupplier = activeRegistry.find(s => s.supplier_id === selectedSupId) || activeRegistry[0];

  // If Siemens is active, check if there's a live run in the backend history to override supplier ratings
  const matchedHistory = activeClient === "Siemens AG" 
    ? backendHistory.find(h => h.supplier_id === rawSupplier.supplier_id) 
    : null;

  const selectedSupplier = matchedHistory 
    ? {
        ...rawSupplier,
        credit_score: matchedHistory.db_credit_score,
        numerical_rating: matchedHistory.db_numerical_rating,
        default_risk: matchedHistory.db_risk_level,
        po_value: matchedHistory.po_value,
        clearance_status: matchedHistory.siemens_decision,
        logs: matchedHistory.logs
      }
    : rawSupplier;

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/60 via-slate-50 to-blue-100/40 text-slate-900 font-sans flex flex-col">
      {/* Deutsche Bank Header */}
      <header className="bg-[#002f6c] text-white px-6 py-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center font-bold bg-[#0018a8] shadow-inner relative">
              <div className="absolute w-[2px] h-[34px] bg-white rotate-[45deg]"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-wide">Deutsche Bank</span>
              <span className="text-[10px] text-blue-200 font-medium tracking-widest uppercase">
                Prometheus-Futurize Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 bg-[#0018a8] px-3 py-1.5 rounded flex items-center gap-2 border border-blue-400/30">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-350 animate-pulse"></span>
              Live Sync Node Active
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-8">
        
        {/* ROW 1: prometheus Agents SELECTOR (LEFT) & prometheus Agents DETAILS (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Row 1 Left: prometheus Agents panel (Lg: 4cols) */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-blue-100/60 p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xs text-[#002f6c] font-bold uppercase tracking-wider">
                prometheus Agents
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-blue-100 rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:border-[#002f6c] text-slate-800"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
              {filteredAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`w-full text-left p-3 rounded-lg border transition flex flex-col gap-1 focus:outline-none ${
                    selectedAgentId === agent.id 
                      ? "bg-[#002f6c] border-[#002f6c] text-white shadow-md font-semibold animate-pulseFast"
                      : "bg-slate-50 border-blue-50 hover:bg-blue-50/50 text-slate-800"
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className="font-bold text-xs">{agent.name}</span>
                    <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      selectedAgentId === agent.id ? "bg-blue-800 text-white" : "bg-emerald-50 text-emerald-800"
                    }`}>
                      {agent.status}
                    </span>
                  </div>
                </button>
              ))}
              {filteredAgents.length === 0 && (
                <div className="text-center py-4 text-slate-400 text-xs font-mono">No agents match.</div>
              )}
            </div>
          </div>

          {/* Row 1 Right: prometheus Agents Details (Lg: 8cols) */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-blue-100/60 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              
              {/* Dynamic Header */}
              <div className="border-b border-blue-50 pb-2">
                <h3 className="text-[#002f6c] font-bold text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                  {activeAgentInfo.name} Desk
                </h3>
              </div>

              {/* 1. BANK AGENTS DESCRIPTION (ALWAYS FIRST AS REQUESTED) */}
              <div className="bg-blue-50/50 p-3.5 rounded-lg border border-blue-100 text-xs text-slate-650 leading-relaxed">
                <span className="font-bold text-[#002f6c] block mb-1">Agent Role & Capabilities:</span>
                {activeAgentInfo.description}
              </div>

              {/* 2. AUDIT HISTORY & TOOLS (FOLLOWS AFTER DESCRIPTION AS REQUESTED) */}
              {selectedAgentId === "credit" && (
                <div className="flex flex-col gap-4 mt-2 animate-fadeIn">
                  <span className="text-[10px] text-[#002f6c] font-bold uppercase tracking-wider block">
                    audit history - {activeClient}
                  </span>

                  <div className="p-3.5 bg-slate-900 text-slate-100 rounded border border-slate-800 font-mono text-[11px] max-h-[170px] overflow-y-auto space-y-2.5">
                    {activeClient === "Philips AG" && PHILIPS_AUDIT_LOGS[selectedSupplier.supplier_id] ? (
                      PHILIPS_AUDIT_LOGS[selectedSupplier.supplier_id].map((log: any, idx: number) => (
                        <div key={idx} className="border-b border-slate-800 pb-1.5 mb-1.5 last:border-b-0 last:pb-0 last:mb-0">
                          <div className="flex justify-between items-center text-[9px] text-slate-500 font-semibold mb-1">
                            <span className={log.sender.includes("Philips") ? "text-teal-400" : "text-blue-400"}>
                              {log.sender}
                            </span>
                            <span>{log.timestamp}</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed">{log.message}</p>
                        </div>
                      ))
                    ) : activeClient === "Siemens AG" && matchedHistory && matchedHistory.logs ? (
                      matchedHistory.logs.map((log: any, idx: number) => (
                        <div key={idx} className="border-b border-slate-800 pb-1.5 mb-1.5 last:border-b-0 last:pb-0 last:mb-0">
                          <div className="flex justify-between items-center text-[9px] text-slate-500 font-semibold mb-1">
                            <span className={log.sender.includes("Siemens") ? "text-teal-400" : "text-blue-400"}>
                              {log.sender}
                            </span>
                            <span>{log.timestamp}</span>
                          </div>
                          <p className="text-slate-350 leading-relaxed">{log.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 py-6 text-center">
                        No active clearing logs for this portfolio supplier in the session.
                        {activeClient === "Siemens AG" && (
                          <span className="text-[9px] block mt-1 text-slate-600">Confer with agents in the Siemens Dashboard to build an audit history.</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedAgentId === "calculator" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 animate-fadeIn">
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex flex-col gap-1">
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

                    <div className="flex flex-col gap-1">
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
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Credit Rating</span>
                      <strong className="text-2xl font-black text-[#002f6c] mt-1">{calcResult.score}</strong>
                      <span className="text-[9px] text-slate-500 font-semibold mt-0.5">Rating: {calcResult.rating}/100</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedAgentId === "esg" && (
                <div className="grid grid-cols-3 gap-3 mt-2 animate-fadeIn text-xs">
                  <div className="bg-slate-50 border border-blue-50 p-3 rounded flex flex-col justify-between">
                    <span className="text-[9px] text-slate-450 font-bold uppercase">ESG Score</span>
                    <strong className="text-emerald-700 text-lg mt-1">{selectedSupplier.esg_rating}</strong>
                  </div>
                  <div className="bg-slate-50 border border-blue-50 p-3 rounded flex flex-col justify-between">
                    <span className="text-[9px] text-slate-450 font-bold uppercase">CO2 Footprint</span>
                    <strong className="text-slate-800 text-sm mt-1">{selectedSupplier.co2_footprint}</strong>
                  </div>
                  <div className="bg-slate-50 border border-blue-50 p-3 rounded flex flex-col justify-between">
                    <span className="text-[9px] text-slate-450 font-bold uppercase">Ethical Sourcing</span>
                    <strong className="text-slate-850 text-sm mt-1">{selectedSupplier.ethical_sourcing}</strong>
                  </div>
                </div>
              )}

              {selectedAgentId === "compliance" && (
                <div className="space-y-2 text-xs font-mono mt-2 animate-fadeIn">
                  <div className="flex justify-between p-2.5 bg-slate-50 border border-blue-50 rounded">
                    <span>OFAC Sanctions Vetting:</span>
                    <span className="text-emerald-700 font-bold">PASSED</span>
                  </div>
                  <div className="flex justify-between p-2.5 bg-slate-50 border border-blue-50 rounded">
                    <span>PEP Lists registry Check:</span>
                    <span className="text-emerald-700 font-bold">PASSED</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ROW 2: Client Portfolio history (LEFT) & Supplier Sourcing Audit (RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Row 2 Left: Client Portfolio history Selector (Lg: 4cols) */}
          <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-blue-100/60 p-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xs text-[#002f6c] font-bold uppercase tracking-wider">
                Client Portfolio history
              </h2>
              {/* Portfolio Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search client (Siemens, Philips)..."
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-blue-100 rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:border-[#002f6c] text-slate-800 font-medium"
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-blue-50 pt-2.5 font-bold">
              <span className="text-slate-400 font-bold">ACTIVE RECORD:</span>
              <strong className="text-[#002f6c] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                {activeClient}
              </strong>
            </div>

            {/* List of Suppliers */}
            <div className="divide-y divide-blue-50 max-h-[160px] overflow-y-auto border border-blue-100/60 rounded bg-blue-50/10">
              {activeRegistry.map((sup) => (
                <button
                  key={sup.supplier_id}
                  onClick={() => setSelectedSupId(sup.supplier_id)}
                  className={`w-full text-left p-3 hover:bg-blue-50/40 transition flex items-center justify-between focus:outline-none ${
                    selectedSupId === sup.supplier_id ? "bg-blue-50/70 border-l-4 border-[#002f6c]" : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-xs truncate max-w-[150px]">{sup.supplier_name}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">{sup.supplier_id}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-700">{sup.credit_score}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Row 2 Right: Supplier Dossier Audit (Lg: 8cols) */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-blue-100/60 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              
              <div className="border-b border-blue-50 pb-2 flex justify-between items-center">
                <h3 className="text-[#002f6c] font-bold text-sm uppercase tracking-wider">
                  Supplier Vetting Scorecard
                </h3>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  selectedSupplier.clearance_status === "APPROVED" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-150" 
                    : "bg-amber-50 text-amber-700 border border-amber-150"
                }`}>
                  {selectedSupplier.clearance_status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Scorecard Parameters */}
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Company Name</label>
                    <div className="text-sm font-bold text-slate-800 mt-0.5">{selectedSupplier.supplier_name}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-blue-50 pt-2">
                    <div>
                      <label className="text-[9px] text-slate-450 font-bold uppercase block tracking-wider">Target PO Amount</label>
                      <strong className="text-slate-700 block mt-0.5">€{selectedSupplier.po_value.toLocaleString()}</strong>
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-450 font-bold uppercase block tracking-wider">Max Credit Limit</label>
                      <strong className="text-slate-750 block mt-0.5">€{selectedSupplier.max_credit_limit.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 border-t border-blue-50 pt-2">
                    <div>
                      <label className="text-[9px] text-slate-455 font-bold uppercase block tracking-wider">Liquidity Ratio</label>
                      <span className="font-semibold text-slate-700 block mt-0.5">{selectedSupplier.liquidity_ratio}</span>
                    </div>
                    <div>
                      <label className="text-[9px] text-slate-455 font-bold uppercase block tracking-wider">Debt-to-Equity</label>
                      <span className="font-semibold text-slate-700 block mt-0.5">{selectedSupplier.debt_to_equity}</span>
                    </div>
                  </div>
                </div>

                {/* Agent vetting and audits */}
                <div className="flex flex-col gap-3 justify-between">
                  <div>
                    <label className="text-[9px] text-slate-450 font-bold uppercase block tracking-wider"> Vetting Agents Used</label>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {selectedSupplier.agents_used.map((agentName, idx) => (
                        <span 
                          key={idx} 
                          className="bg-blue-50 text-[#002f6c] border border-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          {agentName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-blue-50 pt-3">
                    <label className="text-[9px] text-slate-450 font-bold uppercase block tracking-wider">Sourcing Vetting Remarks</label>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                      {selectedSupplier.payment_behavior}. Risk metrics and PO parameters are updated dynamically in sync with the client procurement portals.
                    </p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="border-t border-blue-50 pt-3 mt-4 text-[10px] text-slate-450 font-mono flex items-center justify-between">
              <span>Security Code: DB-VETTED-RECORD</span>
              <span>Audit Clearance Certified</span>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#002f6c] text-slate-350 text-xs px-6 py-4 mt-8 border-t border-blue-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 Deutsche Bank AG. Member FDIC.</span>
          <span className="text-slate-400 font-semibold uppercase tracking-widest text-[9px]">
            RESTRICTED AUDITING ENVIRONMENT
          </span>
        </div>
      </footer>
    </div>
  );
}
