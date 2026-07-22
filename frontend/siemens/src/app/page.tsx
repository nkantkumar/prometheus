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
    ethical_sourcing: "94%"
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
    ethical_sourcing: "72%"
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
    ethical_sourcing: "89%"
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
    ethical_sourcing: "96%"
  }
];

interface ChatMessage {
  id: string;
  sender: "User" | "Siemens Procurement Agent" | "Deutsche Bank Credit Agent" | "Siemens ESG Agent" | "Siemens Compliance Agent";
  message: string;
  timestamp: string;
  action_type?: string;
}

// Siemens Agent options
const SIEMENS_AGENTS = [
  { id: "procurement", name: "Procurement Agent", description: "Vets credit and clears PO limits." },
  { id: "esg", name: "ESG Vetting Agent", description: "Audits environmental impact and sourcing ethics." },
  { id: "compliance", name: "Compliance Agent", description: "Vets AML registries and sanction records." }
];

export default function SiemensDashboard() {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [selectedSupplierId, setSelectedSupplierId] = useState("SUP-001");
  const [selectedAgentId, setSelectedAgentId] = useState("procurement");
  const [negotiating, setNegotiating] = useState(false);
  const [dbScoreResult, setDbScoreResult] = useState<any>(null);
  const [finalDecision, setFinalDecision] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Custom PO Value Editing
  const [customPoValue, setCustomPoValue] = useState<string>("");

  // Tab Control in the Right Panel
  const [activeConsoleTab, setActiveConsoleTab] = useState<"dialogue" | "analytics">("dialogue");

  // Chatbot Messages State
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, negotiating]);

  const resetChatForActiveSupplier = () => {
    const activeAgent = SIEMENS_AGENTS.find(a => a.id === selectedAgentId) || SIEMENS_AGENTS[0];
    
    // Welcome message has NO mention of Deutsche Bank in the beginning
    setChatMessages([
      {
        id: "welcome",
        sender: activeAgent.id === "procurement" 
          ? "Siemens Procurement Agent" 
          : activeAgent.id === "esg" 
            ? "Siemens ESG Agent" 
            : "Siemens Compliance Agent",
        message: `Willkommen! I am the Siemens AG ${activeAgent.name}. Vetting scope loaded for: ${selectedSupplier.name}. Type 'evaluate' or write a custom command below to begin.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
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

    // Route workflow based on which Agent is selected
    if (selectedAgentId === "procurement") {
      // Procurement Agent: queries credit profile from Deutsche Bank Credit Agent
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setChatMessages(prev => [
          ...prev,
          {
            id: `siemens-query-${Date.now()}`,
            sender: "Siemens Procurement Agent",
            message: `Evaluation initiated for ${selectedSupplier.name} (PO Allocation: €${poValueNum.toLocaleString()}). Querying Deutsche Bank Credit Agent to inspect creditworthiness registers...`,
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
          setChatMessages(prev => [
            ...prev,
            {
              id: `bubble-${Date.now()}-${Math.random()}`,
              sender: log.sender,
              message: log.message,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action_type: log.action_type
            }
          ]);
        }

        setFinalDecision(data.siemens_decision);
        setDbScoreResult({
          score: data.db_credit_score,
          rating: data.db_numerical_rating,
          risk: data.db_risk_level,
          programs: data.db_recommended_programs
        });

      } catch (err: any) {
        setErrorMsg("Failed to connect to LangGraph Backend. Simulating offline clearance run...");
        
        // Mock credit clearing dialogue (first queries DB agent)
        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `db-reply-mock-${Date.now()}`,
            sender: "Deutsche Bank Credit Agent",
            message: `Sehr geehrte Damen und Herren,\n\nWe have retrieved credit metrics for ${selectedSupplier.name}. Rating: "${selectedSupplier.credit_score || 'AAA'}" | Risk: "${selectedSupplier.risk_level || 'Extremely Low'}".\n\nFinancial Score: ${selectedSupplier.numerical_rating || 95}/100.\nRecommended program: ${poValueNum > 1000000 ? 'Standard Bank Guarantee & Escrow' : 'Supplier Early Payment Program'}.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1000));

        let decisionText = "";
        let mockDecision = "APPROVED";

        if ((selectedSupplier.credit_score && ["BB-", "B+"].includes(selectedSupplier.credit_score)) || selectedSupplier.id === "SUP-002") {
          mockDecision = "PENDING_FINANCE";
          decisionText = `The credit rating (${selectedSupplier.credit_score}) indicates moderate risk. We require a collateralized Escrow structure and 100% Bank Guarantee to release funding. Let's register a bank guarantee.`;
          
          setChatMessages(prev => [
            ...prev,
            {
              id: `siemens-guar-mock-${Date.now()}`,
              sender: "Siemens Procurement Agent",
              message: decisionText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);

          await new Promise(resolve => setTimeout(resolve, 1000));
          setChatMessages(prev => [
            ...prev,
            {
              id: `db-confirm-mock-${Date.now()}`,
              sender: "Deutsche Bank Credit Agent",
              message: "Deutsche Bank confirms setup of a Collateralized Escrow account. Credit limits verified. Bank Guarantee issued.",
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
            sender: "Siemens Procurement Agent",
            message: decisionText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        setFinalDecision(mockDecision);
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
            sender: "Siemens ESG Agent",
            message: `Initiating ESG compliance audit for ${selectedSupplier.name}...\nFetching carbon footprint and supply chain ethical sourcing integrity indexes.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1200));
        setChatMessages(prev => [
          ...prev,
          {
            id: `esg-2-${Date.now()}`,
            sender: "Siemens ESG Agent",
            message: `ESG Database Audit Results:\n- Carbon Footprint Rating: ${selectedSupplier.co2_footprint || "1,200 tons/yr"}\n- Ethical Raw Sourcing Vetting: ${selectedSupplier.ethical_sourcing || "90%"}\n- Supply Chain Integrity Vetting Index: PASSED`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `esg-3-${Date.now()}`,
            sender: "Siemens ESG Agent",
            message: `ESG Audit Score for ${selectedSupplier.name} is "${selectedSupplier.esg_rating || "A"}" (Compliant). Siemens Formally clears the circular supplier standards.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setFinalDecision("ESG_COMPLIANT");
      } finally {
        setNegotiating(false);
      }
    } else {
      // Compliance & Legal Agent: Vets Anti-Money Laundering registries & OFAC databases
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `comp-1-${Date.now()}`,
            sender: "Siemens Compliance Agent",
            message: `Vetting corporate registry logs and legal entities for ${selectedSupplier.name}...\nScanning global sanctions indexes and Anti-Money Laundering registers.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1200));
        setChatMessages(prev => [
          ...prev,
          {
            id: `comp-2-${Date.now()}`,
            sender: "Siemens Compliance Agent",
            message: `Compliance Scanning Completed:\n- OFAC Sanctions Database Vetting: NO MATCHES / CLEARED\n- Politically Exposed Persons (PEP) Check: NO MATCHES / CLEARED\n- AML Registry Score Index: 98/100 (Extremely Low Risk)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `comp-3-${Date.now()}`,
            sender: "Siemens Compliance Agent",
            message: `Legal vetting completed successfully. Supplier ${selectedSupplier.name} is certified as COMPLIANT and cleared for trade transactions.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setFinalDecision("COMPLIANCE_CLEARED");
      } finally {
        setNegotiating(false);
      }
    }
  };

  const triggerClearanceSuggestion = () => {
    setChatInput("evaluate");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Siemens Header */}
      <header className="bg-slate-900 text-white border-b-4 border-[#009999] px-6 py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="font-extrabold text-2xl tracking-[0.2em] text-[#009999] flex items-center">
              SIEMENS
              <span className="text-white text-xs font-normal tracking-wide ml-2 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Procurement
              </span>
            </div>
            <div className="h-6 w-px bg-slate-700 hidden md:block"></div>
            <span className="text-sm font-semibold tracking-wider uppercase text-slate-300 hidden md:inline">
              Supplier Risk Intelligence & Agent Terminal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009999] animate-pulse"></span>
              Gemini AI Agents Connected
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Supplier Register & Dossier (Lg: 5cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          {/* Supplier List */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
                Siemens Active Suppliers
              </h2>
              <span className="text-xs bg-[#009999] px-2 py-0.5 rounded text-white font-medium">
                {suppliers.length} Records
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
              {suppliers.map((supplier) => (
                <button
                  key={supplier.id}
                  onClick={() => setSelectedSupplierId(supplier.id)}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition flex flex-col gap-1.5 focus:outline-none ${
                    selectedSupplierId === supplier.id ? "bg-[#009999]/5 border-l-4 border-[#009999]" : "border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="font-bold text-slate-800 text-sm leading-tight">
                      {supplier.name}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-500">
                      {supplier.id}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{supplier.category}</span>
                  
                  <div className="flex justify-between items-center mt-1 w-full text-xs">
                    <span className="text-slate-500">
                      Allocated PO: <strong className="text-slate-700">€{supplier.current_po_value.toLocaleString()}</strong>
                    </span>
                    
                    <span className={`px-1.5 py-0.2 rounded font-extrabold text-[10px] ${
                      supplier.credit_score?.startsWith('A') 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : supplier.credit_score === 'N/A' 
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      Score: {supplier.credit_score || 'N/A'}
                    </span>
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

              {/* Editable Purchase Order Value */}
              <div className="border-t border-slate-100 pt-3 flex flex-col gap-1.5">
                <label className="text-[10px] text-[#009999] font-bold uppercase tracking-wider block">
                  Purchase Order Budget (€)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400 font-medium">€</span>
                  <input
                    type="number"
                    value={customPoValue}
                    onChange={(e) => setCustomPoValue(e.target.value)}
                    placeholder="Enter Custom PO amount"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-7 py-2 focus:outline-none focus:border-[#009999] focus:bg-white text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="bg-slate-50 rounded border p-3.5 text-xs text-slate-500 mt-2">
                <p className="leading-relaxed">
                  Vetting clearance is initiated from the agent chatbot terminal.
                </p>
                <button
                  onClick={triggerClearanceSuggestion}
                  className="text-xs text-[#009999] font-bold underline mt-1 block hover:text-[#007f7f]"
                >
                  Prepare audit command for {selectedSupplier.name}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Chatbot Console / Operational Analytics Tabs (Lg: 7cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* OPTION TO SELECT ONE VETTING AGENT AT A TIME */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Active Vetting Agent (Select One)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {SIEMENS_AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`py-2 px-3 text-left rounded border transition focus:outline-none flex flex-col gap-0.5 ${
                    selectedAgentId === agent.id 
                      ? "bg-[#009999] border-[#009999] text-white shadow-sm font-semibold" 
                      : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  <span className="text-[11px] block">{agent.name}</span>
                  <span className={`text-[8px] leading-tight ${selectedAgentId === agent.id ? "text-teal-100" : "text-slate-400"}`}>
                    {agent.id === "procurement" ? "Queries DB registry" : "Local Audit"}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg shadow-xl border border-slate-855 overflow-hidden flex flex-col flex-1 min-h-[460px]">
            
            {/* Tab Navigation Menu */}
            <div className="bg-slate-950 px-4 py-1 flex items-center justify-between border-b border-slate-800">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveConsoleTab("dialogue")}
                  className={`py-3 font-mono text-xs font-semibold uppercase tracking-wider border-b-2 transition focus:outline-none ${
                    activeConsoleTab === "dialogue" 
                      ? "text-[#009999] border-[#009999]" 
                      : "text-slate-500 border-transparent hover:text-slate-300"
                  }`}
                >
                  Agent Chatbot Terminal
                </button>
                <button
                  onClick={() => setActiveConsoleTab("analytics")}
                  className={`py-3 font-mono text-xs font-semibold uppercase tracking-wider border-b-2 transition focus:outline-none ${
                    activeConsoleTab === "analytics" 
                      ? "text-[#009999] border-[#009999]" 
                      : "text-slate-500 border-transparent hover:text-slate-300"
                  }`}
                >
                  Operational Risk Analytics
                </button>
              </div>

              <span className="text-[10px] font-mono text-slate-500">
                {negotiating ? "Running analysis..." : "Standby"}
              </span>
            </div>

            {/* TAB 1: Chatbot Dialogue (Siemens Petrol style background) */}
            {activeConsoleTab === "dialogue" && (
              <div className="flex-1 bg-[#0c1f1f] flex flex-col justify-between border border-[#009999]/10">
                {/* Chat Message Box */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 max-h-[350px] min-h-[280px]">
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
                  <div ref={messagesEndRef} />
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
                    placeholder={`Type 'evaluate' to run active agent analysis...`}
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
            )}

            {/* TAB 2: Operational Analytics */}
            {activeConsoleTab === "analytics" && (
              <div className="flex-1 p-6 space-y-6 text-slate-300">
                <div className="border-b border-slate-800 pb-3">
                  <h4 className="text-sm font-bold text-slate-200">Historical Reliability & Ratings Chart</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Supplier credit history trends over the past 6 quarters.</p>
                </div>

                {/* SVG Visual Graph representing credit scoring trends */}
                <div className="h-44 bg-slate-950/40 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
                  <div className="flex-1 flex items-end gap-3 justify-between px-4">
                    {selectedSupplier.performance_trends.map((val, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        {/* Interactive Bar */}
                        <div 
                          className="w-full bg-[#009999]/30 border border-[#009999] hover:bg-[#009999]/50 rounded-t transition-all duration-500"
                          style={{ height: val > 0 ? `${(val / 100) * 110}px` : "1px" }}
                        ></div>
                        <span className="text-[9px] text-slate-500 font-mono">Q{idx + 1} ({val > 0 ? `${val}%` : 'N/A'})</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="bg-slate-950/30 border border-slate-800 p-4 rounded-lg flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500">Numerical Rating</span>
                    <strong className="text-xl text-[#009999] mt-1">
                      {selectedSupplier.numerical_rating ? `${selectedSupplier.numerical_rating} / 100` : "Audit Pending"}
                    </strong>
                    <span className="text-[9px] text-slate-600 mt-2">Determined by Deutsche Bank Audit registry</span>
                  </div>

                  <div className="bg-slate-950/30 border border-slate-800 p-4 rounded-lg flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500">Clearance Status</span>
                    <strong className="text-xl text-slate-200 mt-1">
                      {finalDecision || "Awaiting Verification"}
                    </strong>
                    <span className="text-[9px] text-slate-600 mt-2">Siemens procurement authorization</span>
                  </div>
                </div>
              </div>
            )}

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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 Siemens AG. General Procurement Division.</span>
          <span className="text-slate-500 uppercase tracking-widest text-[9px]">Restricted - Corporate Sourcing Only</span>
        </div>
      </footer>
    </div>
  );
}
