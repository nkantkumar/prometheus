"use client";

import React, { useState, useEffect, useRef } from "react";

// Mock Siemens Suppliers
const INITIAL_SUPPLIERS = [
  {
    id: "SUP-001",
    name: "Krupp Steelworks GmbH",
    category: "Raw Materials & Heavy Machinery",
    current_po_value: 1200000.0,
    project_name: "Hamburg Wind Farm Infrastructure",
    description: "Supplements steel and structural components for heavy engineering and renewable installations.",
    operational_rating: "Excellent (94%)",
    delivery_reliability: "98%",
    credit_score: "AAA",
    risk_level: "Extremely Low",
    numerical_rating: 96,
    performance_trends: [92, 94, 95, 96, 94, 98],
    esg_rating: "A",
    co2_footprint: "2,400 tons/yr",
    ethical_sourcing: "94%",
    country: "Germany",
    flag: "🇩🇪"
  },
  {
    id: "SUP-002",
    name: "Optima Microelectronics",
    category: "Semiconductors & Sensors",
    current_po_value: 450000.0,
    project_name: "Munich Smart Factory Upgrade",
    description: "Provides high-precision sensors and PLC controller microchips.",
    operational_rating: "Fair (76%)",
    delivery_reliability: "82%",
    credit_score: "BB-",
    risk_level: "Moderate-High",
    numerical_rating: 58,
    performance_trends: [85, 80, 78, 76, 82, 82],
    esg_rating: "B-",
    co2_footprint: "320 tons/yr",
    ethical_sourcing: "72%",
    country: "United States",
    flag: "🇺🇸"
  },
  {
    id: "SUP-003",
    name: "Bavarian Cable Works",
    category: "Electrical & Cabling",
    current_po_value: 850000.0,
    project_name: "Berlin High-Speed Rail Electrification",
    description: "Manufactures high-voltage insulated copper cables and electrical grids.",
    operational_rating: "Very Good (88%)",
    delivery_reliability: "92%",
    credit_score: "A+",
    risk_level: "Low",
    numerical_rating: 84,
    performance_trends: [89, 90, 88, 87, 92, 92],
    esg_rating: "A+",
    co2_footprint: "850 tons/yr",
    ethical_sourcing: "89%",
    country: "Switzerland",
    flag: "🇨🇭"
  },
  {
    id: "SUP-004",
    name: "Voltaic Power Solutions",
    category: "Green Energy Systems",
    current_po_value: 2300000.0,
    project_name: "North Sea Offshore Grid Integration",
    description: "Custom developer of industrial power grid converters and battery arrays.",
    operational_rating: "Pending Review",
    delivery_reliability: "New Supplier",
    credit_score: "B+",
    risk_level: "Moderate",
    numerical_rating: 68,
    performance_trends: [0, 0, 0, 60, 65, 68],
    esg_rating: "AA",
    co2_footprint: "120 tons/yr",
    ethical_sourcing: "96%",
    country: "Denmark",
    flag: "🇩🇰"
  }
];

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  action_type?: string;
}

// Siemens Agent options
const SIEMENS_AGENTS = [
  {
    id: "calculator",
    name: "Risk Calculator Agent",
    description: "Simulates debt, equity, and liquidity risks using dynamic mathematical scoring models.",
    status: "Active"
  },
  {
    id: "credit",
    name: "Credit Agent",
    description: "Vets supplier credit ratings and clears PO limits in connection with active registers.",
    status: "Active"
  },
  {
    id: "esg",
    name: "ESG Agent",
    description: "Audits environmental impact, carbon footprint ratings, and ethical governance standards.",
    status: "Active"
  },
  {
    id: "compliance",
    name: "Compliance & AML Agent",
    description: "Performs real-time Anti-Money Laundering checks and global sanctions validation audits.",
    status: "Active"
  },
  {
    id: "legal",
    name: "Legal check agent",
    description: "Validates corporate contracts, jurisdiction constraints, and compliance-related legal provisions.",
    status: "Inactive"
  }
];

export default function SiemensDashboard() {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [selectedSupplierId, setSelectedSupplierId] = useState("SUP-001");
  const [selectedAgentId, setSelectedAgentId] = useState("calculator");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [negotiating, setNegotiating] = useState(false);
  const [dbScoreResult, setDbScoreResult] = useState<any>(null);
  const [finalDecision, setFinalDecision] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Vetting History for suppliers
  const [vettingHistory, setVettingHistory] = useState<Record<string, Array<{ agentName: string; score: string; timestamp: string }>>>({
    "SUP-001": [
      { agentName: "Risk Calculator Agent", score: "Low Probability (1.2%)", timestamp: "10:24 AM" },
      { agentName: "Credit Agent", score: "Cleared (AAA, 96/100)", timestamp: "10:25 AM" },
      { agentName: "ESG Agent", score: "Compliant (A)", timestamp: "10:26 AM" },
      { agentName: "Compliance & AML Agent", score: "Passed (98/100)", timestamp: "10:27 AM" }
    ],
    "SUP-002": [
      { agentName: "Credit Agent", score: "Escrow Required (BB-, 58/100)", timestamp: "11:15 AM" }
    ]
  });
  
  // Custom PO Value Editing
  const [customPoValue, setCustomPoValue] = useState<string>("");

  // Tab Control in the Right Panel
  const [activeConsoleTab, setActiveConsoleTab] = useState<"dialogue" | "analytics">("dialogue");

  // Chatbot Messages State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0];

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // WIPE history and reset chat when supplier selection changes
  useEffect(() => {
    if (selectedSupplier) {
      setCustomPoValue(selectedSupplier.current_po_value.toString());
      resetChatForActiveSupplier();
    }
  }, [selectedSupplierId, selectedAgentId]); // Also resets if agent type is switched!

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, negotiating]);

  const resetChatForActiveSupplier = () => {
    const activeAgent = SIEMENS_AGENTS.find(a => a.id === selectedAgentId) || SIEMENS_AGENTS[0];
    
    setChatMessages([]);
    setFinalDecision(null);
    setDbScoreResult(null);
    setErrorMsg(null);
  };

  const fetchSuppliers = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/suppliers");
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const merged = data.map((apiSup: any) => {
            const initial = INITIAL_SUPPLIERS.find(i => i.id === apiSup.id);
            return {
              ...apiSup,
              performance_trends: initial ? initial.performance_trends : [75, 75, 75, 75, 75, 75]
            };
          });
          setSuppliers(merged);
        }
      }
    } catch (e) {
      console.warn("Could not connect to backend, running with fallback mock data.");
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || negotiating) return;

    const userText = chatInput.trim();
    setChatInput("");
    setErrorMsg(null);

    // 1. Add User Message
    setChatMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "User",
        message: userText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setNegotiating(true);
    setActiveConsoleTab("dialogue");

    const poValueNum = parseFloat(customPoValue) || selectedSupplier.current_po_value;
    const activeAgent = SIEMENS_AGENTS.find(a => a.id === selectedAgentId) || SIEMENS_AGENTS[0];
    const agentSenderName = `Siemens ${activeAgent.name}`;

    // Route workflow based on which Agent is selected
    if (selectedAgentId === "calculator") {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setChatMessages(prev => [
          ...prev,
          {
            id: `calc-query-${Date.now()}`,
            sender: agentSenderName,
            message: `Mathematical risk simulation initiated for ${selectedSupplier.name} (PO Allocation: €${poValueNum.toLocaleString()}). Analyzing liquidity, leverage, and capital indicators...`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `calc-results-${Date.now()}`,
            sender: agentSenderName,
            message: `Risk Simulator Results:\n- Expected Default Probability: 0.8% (Extremely Low)\n- Current Liquidity Ratio: ${(selectedSupplier as any).liquidity_ratio || 2.1} (Satisfactory)\n- Debt-to-Equity Ratio: ${(selectedSupplier as any).debt_to_equity || 0.8} (Stable)\n- Risk Rating: Approved for PO threshold.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setFinalDecision("RISK_APPROVED");
        setVettingHistory(prev => ({
          ...prev,
          [selectedSupplierId]: [
            ...(prev[selectedSupplierId] || []),
            { agentName: activeAgent.name, score: "Low Probability (0.8%)", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        }));
      } finally {
        setNegotiating(false);
      }
    } else if (selectedAgentId === "credit") {
      // Credit Agent: queries credit profile from registers
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setChatMessages(prev => [
          ...prev,
          {
            id: `siemens-query-${Date.now()}`,
            sender: agentSenderName,
            message: `Evaluation initiated for ${selectedSupplier.name} (PO Allocation: €${poValueNum.toLocaleString()}). Vetting credit registers and querying trade ratings...`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        const res = await fetch("http://localhost:8000/api/negotiate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supplier_id: selectedSupplierId,
            custom_po_value: poValueNum
          }),
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        const fullLogs = data.logs || [];
        
        for (const log of fullLogs) {
          await new Promise(resolve => setTimeout(resolve, 900));
          // Single-agent constraint: Override log.sender to represent only the selected Credit Agent!
          setChatMessages(prev => [
            ...prev,
            {
              id: `bubble-${Date.now()}-${Math.random()}`,
              sender: agentSenderName,
              message: log.message,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action_type: log.action_type
            }
          ]);
        }

        setFinalDecision(data.siemens_decision);
        setVettingHistory(prev => ({
          ...prev,
          [selectedSupplierId]: [
            ...(prev[selectedSupplierId] || []),
            { agentName: activeAgent.name, score: `Cleared (${data.db_credit_score}, ${data.db_numerical_rating}/100)`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        }));
        setDbScoreResult({
          score: data.db_credit_score,
          rating: data.db_numerical_rating,
          risk: data.db_risk_level,
          programs: data.db_recommended_programs
        });

      } catch (err: any) {
        setErrorMsg("Failed to connect to LangGraph Backend. Simulating offline clearance run...");
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `db-reply-mock-${Date.now()}`,
            sender: agentSenderName,
            message: `I have retrieved credit metrics from the database registries for ${selectedSupplier.name}. Rating: "${selectedSupplier.credit_score || 'AAA'}" | Risk: "${selectedSupplier.risk_level || 'Extremely Low'}".\n\nFinancial Score: ${selectedSupplier.numerical_rating || 95}/100.\nRecommended program: ${poValueNum > 1000000 ? 'Standard Bank Guarantee & Escrow' : 'Supplier Early Payment Program'}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1000));

        let decisionText = "";
        let mockDecision = "APPROVED";

        if ((selectedSupplier.credit_score && ["BB-", "B+"].includes(selectedSupplier.credit_score)) || selectedSupplier.id === "SUP-002") {
          mockDecision = "PENDING_FINANCE";
          decisionText = `The credit rating (${selectedSupplier.credit_score}) indicates moderate risk. We require a collateralized Escrow structure and 100% Bank Guarantee to release funding. Setting up bank guarantee registers now...`;
          
          setChatMessages(prev => [
            ...prev,
            {
              id: `siemens-guar-mock-${Date.now()}`,
              sender: agentSenderName,
              message: decisionText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);

          await new Promise(resolve => setTimeout(resolve, 1000));
          setChatMessages(prev => [
            ...prev,
            {
              id: `db-confirm-mock-${Date.now()}`,
              sender: agentSenderName,
              message: "Setup of a Collateralized Escrow account is confirmed. Credit limits verified. Bank Guarantee issued.",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);

          await new Promise(resolve => setTimeout(resolve, 1000));
          decisionText = `Escrow setup confirmed. Siemens formally APPROVES the supplier contract for ${selectedSupplier.name} under Escrow and Bank Guarantee terms.`;
        } else {
          decisionText = `The credit rating (${selectedSupplier.credit_score || 'AAA'}) meets our investment grade requirements. Siemens formally APPROVES this procurement contract. Standard payment terms apply.`;
        }

        setChatMessages(prev => [
          ...prev,
          {
            id: `siemens-final-mock-${Date.now()}`,
            sender: agentSenderName,
            message: decisionText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        setFinalDecision(mockDecision);
        setVettingHistory(prev => ({
          ...prev,
          [selectedSupplierId]: [
            ...(prev[selectedSupplierId] || []),
            { agentName: activeAgent.name, score: mockDecision === "APPROVED" ? `Cleared (${selectedSupplier.credit_score || 'AAA'}, ${selectedSupplier.numerical_rating || 95}/100)` : `Escrow Required (${selectedSupplier.credit_score || 'BB-'}, ${selectedSupplier.numerical_rating || 58}/100)`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        }));
        setDbScoreResult({
          score: selectedSupplier.credit_score || "AAA",
          rating: selectedSupplier.numerical_rating || 95,
          risk: selectedSupplier.risk_level || "Low",
          programs: selectedSupplier.id === "SUP-002" ? ["Collateralized Escrow"] : ["Supplier Early Payment Program"]
        });
      } finally {
        setNegotiating(false);
      }
    } else if (selectedAgentId === "esg") {
      // ESG Vetting Agent: Vets carbon footprint and social governance ratings
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `esg-1-${Date.now()}`,
            sender: agentSenderName,
            message: `Initiating ESG compliance audit for ${selectedSupplier.name}...\nFetching carbon footprint and supply chain ethical sourcing integrity indexes.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1200));
        setChatMessages(prev => [
          ...prev,
          {
            id: `esg-2-${Date.now()}`,
            sender: agentSenderName,
            message: `ESG Database Audit Results:\n- Carbon Footprint Rating: ${selectedSupplier.co2_footprint || "1,200 tons/yr"}\n- Ethical Raw Sourcing Vetting: ${selectedSupplier.ethical_sourcing || "90%"}\n- Supply Chain Integrity Vetting Index: PASSED`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `esg-3-${Date.now()}`,
            sender: agentSenderName,
            message: `ESG Audit Score for ${selectedSupplier.name} is "${selectedSupplier.esg_rating || "A"}" (Compliant). Siemens Formally clears the circular supplier standards.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setFinalDecision("ESG_COMPLIANT");
        setVettingHistory(prev => ({
          ...prev,
          [selectedSupplierId]: [
            ...(prev[selectedSupplierId] || []),
            { agentName: activeAgent.name, score: `Compliant (${selectedSupplier.esg_rating || "A"})`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        }));
      } finally {
        setNegotiating(false);
      }
    } else if (selectedAgentId === "compliance") {
      // Compliance & Legal Agent: Vets Anti-Money Laundering registries & OFAC databases
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `comp-1-${Date.now()}`,
            sender: agentSenderName,
            message: `Vetting corporate registry logs and legal entities for ${selectedSupplier.name}...\nScanning global sanctions indexes and Anti-Money Laundering registers.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1200));
        setChatMessages(prev => [
          ...prev,
          {
            id: `comp-2-${Date.now()}`,
            sender: agentSenderName,
            message: `Compliance Scanning Completed:\n- OFAC Sanctions Database Vetting: NO MATCHES / CLEARED\n- Politically Exposed Persons (PEP) Check: NO MATCHES / CLEARED\n- AML Registry Score Index: 98/100 (Extremely Low Risk)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `comp-3-${Date.now()}`,
            sender: agentSenderName,
            message: `Legal vetting completed successfully. Supplier ${selectedSupplier.name} is certified as COMPLIANT and cleared for trade transactions.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setFinalDecision("COMPLIANCE_CLEARED");
        setVettingHistory(prev => ({
          ...prev,
          [selectedSupplierId]: [
            ...(prev[selectedSupplierId] || []),
            { agentName: activeAgent.name, score: "Passed (98/100)", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          ]
        }));
      } finally {
        setNegotiating(false);
      }
    } else if (selectedAgentId === "legal") {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setChatMessages(prev => [
          ...prev,
          {
            id: `legal-inactive-${Date.now()}`,
            sender: agentSenderName,
            message: `Legal Check Agent is currently INACTIVE. Session auditing and real-time legal vetting are suspended.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } finally {
        setNegotiating(false);
      }
    }
  };

  const triggerClearanceSuggestion = () => {
    setChatInput("evaluate");
  };

  const activeAgent = SIEMENS_AGENTS.find(a => a.id === selectedAgentId) || SIEMENS_AGENTS[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Siemens Header */}
      <header className="bg-slate-900 text-white border-b-4 border-[#009999] px-6 py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-[80%] w-[80%] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="font-extrabold text-2xl tracking-[0.2em] text-[#009999] flex items-center">
              SIEMENS
              <span className="text-white text-xs font-normal tracking-wide ml-2 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Procurement
              </span>
            </div>
            <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
            <span className="text-sm font-semibold tracking-wider uppercase text-slate-300 hidden md:inline">
              Supplier Intelligence & Agent Terminal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009999] animate-pulse"></span>
              prometheus agents connected
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[80%] w-[80%] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Supplier Register & Dossier (Lg: 5cols) */}
        <section className="lg:col-span-5 flex flex-col gap-3">
          {/* Supplier List */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            {/* Supplier Search Bar (Moved Above Header) */}
            <div className="p-3 border-b border-slate-200 bg-slate-50/50 relative">
              <input
                type="text"
                placeholder="Search active suppliers..."
                value={supplierSearch}
                onChange={(e) => setSupplierSearch(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#009999] text-slate-800 font-medium"
              />
              <svg className="w-3.5 h-3.5 text-slate-400 absolute left-5 top-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <h2 className="font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
                Suppliers list
              </h2>
            </div>

            <div className="divide-y divide-slate-100 max-h-[145px] overflow-y-scroll">
              {suppliers
                .filter(supplier =>
                  supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                  supplier.id.toLowerCase().includes(supplierSearch.toLowerCase())
                )
                .map((supplier) => (
                  <button
                    key={supplier.id}
                    onClick={() => setSelectedSupplierId(supplier.id)}
                    className={`w-full text-left p-4 hover:bg-slate-50 transition flex flex-col gap-1 focus:outline-none ${
                      selectedSupplierId === supplier.id ? "bg-[#009999]/5 border-l-4 border-[#009999]" : "border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className="font-bold text-slate-800 text-sm leading-tight">
                        {supplier.name}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{supplier.category}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-sm">{(supplier as any).flag}</span>
                      <span className="text-xs text-slate-500 font-medium">{(supplier as any).country}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Supplier Dossier */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
            <h3 className="text-[#009999] font-bold text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Supplier Dossier Detail
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Company Name</label>
                <div className="text-sm font-bold text-slate-800">{selectedSupplier.name}</div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Project Scope</label>
                <div className="text-xs font-semibold text-slate-700">{selectedSupplier.project_name}</div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Supplier Profile</label>
                <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{selectedSupplier.description}</p>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Origin Country</label>
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mt-0.5">
                  <span className="text-sm">{(selectedSupplier as any).flag}</span>
                  <span className="text-xs">{(selectedSupplier as any).country}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Operational Status</label>
                  <span className="font-bold text-slate-700 block mt-0.5">{selectedSupplier.operational_rating}</span>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Delivery Reliability</label>
                  <span className="font-bold text-slate-700 block mt-0.5">{selectedSupplier.delivery_reliability}</span>
                </div>
              </div>

              {/* Vetting History logs */}
              <div className="border-t border-slate-100 pt-3">
                <label className="text-[10px] text-[#009999] font-bold uppercase tracking-wider block mb-1.5">
                  Multi-Agent Vetting History
                </label>
                <div className="space-y-1.5 text-xs font-mono">
                  {vettingHistory[selectedSupplier.id] && vettingHistory[selectedSupplier.id].length > 0 ? (
                    vettingHistory[selectedSupplier.id].map((v, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 border border-slate-100 rounded">
                        <span className="font-bold text-[#009999]">{v.agentName}:</span>
                        <span className="font-bold text-slate-700 text-[11px]">{v.score}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-400 italic text-[10px] py-1">No vetting records found. Run analysis from chatbot terminal.</div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded border p-3.5 text-xs text-slate-500 mt-2 flex flex-col items-start gap-1.5">
                <p className="leading-relaxed font-bold uppercase text-[10px] text-slate-400">
                  re-initialte clearance
                </p>
                <button
                  onClick={triggerClearanceSuggestion}
                  className="bg-[#009999] hover:bg-[#007f7f] text-white font-bold text-xs uppercase tracking-wider px-4 py-1.5 rounded transition focus:outline-none cursor-pointer"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Chatbot Console (Lg: 7cols) */}
        <section className="lg:col-span-7 flex flex-col gap-2">
          
          {/* OPTION TO SELECT ONE VETTING AGENT AT A TIME */}
          <div className="bg-white rounded-lg border border-slate-200 p-2.5 shadow-sm flex flex-col gap-1.5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {SIEMENS_AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`py-2 px-2.5 text-left rounded border transition focus:outline-none flex flex-col gap-0.5 min-w-0 ${
                    selectedAgentId === agent.id 
                      ? "bg-[#009999] border-[#009999] text-white shadow-sm font-semibold" 
                      : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  <span className="text-[10px] block truncate font-bold leading-tight">{agent.name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-red-550"}`}></span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${selectedAgentId === agent.id ? "text-teal-100" : (agent.status === "Active" ? "text-emerald-500" : "text-red-500")}`}>
                      {agent.status === "Active" ? "Live" : "Offline"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg shadow-xl border border-slate-855 overflow-hidden flex flex-col flex-1 min-h-[460px]">
            
            {/* Tab Navigation Menu (Analytics removed) */}
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#009999]">
                Agent Terminal
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {negotiating ? "Running analysis..." : "Standby"}
              </span>
            </div>

            {/* Chatbot Dialogue (Siemens Petrol style background) */}
            <div className="flex-1 bg-[#0c1f1f] flex flex-col justify-between border border-[#009999]/10">
              
              {/* Active Session Info - Bold and Larger supplier name and agent type */}
              <div className="bg-slate-950/45 border-b border-[#009999]/10 p-3.5 flex flex-col gap-0.5">
                <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono">Vetting Session</div>
                <div className="text-white text-base md:text-lg font-black leading-tight">
                  Supplier: <span className="underline decoration-[#009999] decoration-2 underline-offset-4">{selectedSupplier.name}</span>
                </div>
                <div className="text-[#009999] text-xs font-black uppercase tracking-wider mt-1 font-mono">
                  Requested Agent: {activeAgent.name}
                </div>
              </div>
              {/* Chat Message Box */}
              <div ref={chatContainerRef} className="flex-1 p-4 md:p-6 overflow-y-scroll space-y-4 max-h-[350px] min-h-[280px]">
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === "User";
                  const isSiemens = msg.sender.includes("Siemens");
                  
                  return (
                    <div 
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${
                        isUser ? "ml-auto items-end" : "mr-auto items-start"
                      }`}
                    >
                      <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider mb-1 font-mono">
                        {msg.sender} &bull; {msg.timestamp}
                      </span>

                      <div 
                        className={`p-3 rounded-lg text-xs leading-relaxed shadow-sm ${
                          isUser 
                            ? "bg-slate-800 text-white rounded-tr-none border border-slate-700" 
                            : isSiemens
                              ? "bg-[#009999] text-white rounded-tl-none border border-[#007979]/40"
                              : "bg-[#002f6c] text-white rounded-tl-none border border-blue-905/45"
                        }`}
                      >
                        <p className="whitespace-pre-line">{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
                {negotiating && (
                  <div className="flex items-center gap-2 text-[10px] text-teal-400/80 font-mono italic animate-pulse">
                    <span className="w-1.5 h-1.5 bg-[#009999] rounded-full animate-bounce"></span>
                    <span>Clearing nodes...</span>
                  </div>
                )}
              </div>

              {/* Chat input box */}
              <form 
                onSubmit={handleSendMessage}
                className="bg-slate-900 border-t border-[#009999]/20 p-3 flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="ask me..."
                  className="flex-1 bg-slate-950 text-xs text-white border border-[#009999]/30 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#009999]"
                  disabled={negotiating}
                />
                <button
                  type="submit"
                  disabled={negotiating || !chatInput.trim()}
                  className="bg-[#009999] hover:bg-[#007f7f] disabled:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg transition focus:outline-none"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Offline banner warning */}
            {errorMsg && (
              <div className="bg-amber-500/10 border-t border-amber-500/20 px-4 py-2 text-xs text-amber-300 font-mono text-center">
                {errorMsg}
              </div>
            )}

            {/* Console Footer: Decision display */}
            {finalDecision && (
              <div className="bg-slate-950 p-4 border-t border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">Final Decision:</span>
                  <div className={`px-3 py-1 rounded font-bold font-mono text-xs ${
                    finalDecision.includes("APPROVED") || finalDecision.includes("CLEARED") || finalDecision.includes("COMPLIANT")
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}>
                    {finalDecision}
                  </div>
                </div>
                {dbScoreResult && (
                  <span className="text-xs font-mono text-slate-500 hidden md:inline">
                    Credit Rating Score: <strong className="text-slate-300">{dbScoreResult.score}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs px-6 py-4 mt-8">
        <div className="max-w-[80%] w-[80%] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 Siemens AG. General Procurement Division.</span>
          <span className="text-slate-500 uppercase tracking-widest text-[9px]">Restricted - Corporate Sourcing Only</span>
        </div>
      </footer>
    </div>
  );
}
