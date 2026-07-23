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

const COUNTRY_FLAGS: Record<string, string> = {
  "Germany": "🇩🇪",
  "United States": "🇺🇸",
  "Switzerland": "🇨🇭",
  "Denmark": "🇩🇰",
  "France": "🇫🇷",
  "United Kingdom": "🇬🇧",
  "Japan": "🇯🇵",
  "China": "🇨🇳",
  "India": "🇮🇳"
};

export default function SiemensDashboard() {
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [selectedSupplierId, setSelectedSupplierId] = useState("SUP-001");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [negotiating, setNegotiating] = useState(false);
  const [dbScoreResult, setDbScoreResult] = useState<any>(null);
  const [finalDecision, setFinalDecision] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal form states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierCategory, setNewSupplierCategory] = useState("Raw Materials & Heavy Machinery");
  const [newSupplierPoValue, setNewSupplierPoValue] = useState("");
  const [newSupplierProjectName, setNewSupplierProjectName] = useState("");
  const [newSupplierDescription, setNewSupplierDescription] = useState("");
  const [newSupplierCountry, setNewSupplierCountry] = useState("Germany");

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
  const chatInputRef = useRef<HTMLInputElement>(null);
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

    const lowerText = userText.toLowerCase();
    if (lowerText.includes("kyoto controls")) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        let responseMsg = "";
        let decision = "SOURCING_INPROGRESS";
        
        if (lowerText.includes("esg")) {
          responseMsg = `ESG Database Audit Results for Kyoto Controls Ltd:\n- Carbon Footprint Rating: 410 tons/yr\n- Ethical Raw Sourcing Vetting: 93%\n- Supply Chain Integrity Vetting Index: PASSED\n- ESG Audit Score: "A+" (Compliant). Siemens formally clears the circular supplier standards for Kyoto Controls Ltd.`;
          decision = "ESG_COMPLIANT";
        } else if (lowerText.includes("compliance") || lowerText.includes("sanction") || lowerText.includes("aml") || lowerText.includes("legal")) {
          responseMsg = `Compliance & Legal Scanning Completed for Kyoto Controls Ltd:\n- OFAC Sanctions Database Vetting: NO MATCHES / CLEARED\n- Politically Exposed Persons (PEP) Check: NO MATCHES / CLEARED\n- AML Registry Score Index: 95/100 (Low Risk)\nSiemens formally clears Kyoto Controls Ltd for procurement transactions.`;
          decision = "COMPLIANCE_CLEARED";
        } else if (lowerText.includes("credit") || lowerText.includes("risk") || lowerText.includes("calculator")) {
          responseMsg = `Credit Register Vetting Results for Kyoto Controls Ltd:\n- Trade Credit Rating: "AA-" | Risk: "Very Low"\n- Numerical Financial Score: 88/100\n- Recommended Program: Supplier Early Payment Program\nSiemens formally APPROVES the procurement PO release for Kyoto Controls Ltd.`;
          decision = "APPROVED";
        } else {
          responseMsg = `Vetting profile details for Kyoto Controls Ltd (Japan):\n- Operational Rating: Excellent (91%)\n- Delivery Reliability: 96%\n- Credit Rating: AA-\n- ESG Rating: A+\nWould you like me to run a detailed Credit, ESG, or Compliance audit on this supplier?`;
        }

        setChatMessages(prev => [
          ...prev,
          {
            id: `kyoto-reply-${Date.now()}`,
            sender: "Prometheus Agent",
            message: responseMsg,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setFinalDecision(decision);
      } finally {
        setNegotiating(false);
      }
      return;
    }

    if (!selectedAgentId) {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setChatMessages(prev => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            sender: "Prometheus Agent",
            message: `Searching global registries for new alternative suppliers matching "${userText}"...\nHere are some candidate recommendations:\n1. Apex Advanced Parts Corp (Score: 92/100, Location: USA)\n2. Rhine Precision Metalworks (Score: 89/100, Location: Germany)\n3. Kyoto Controls Ltd (Score: 88/100, Location: Japan)\nWould you like me to start credit risk or compliance vetting on any of these?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setFinalDecision("SOURCING_INPROGRESS");
      } finally {
        setNegotiating(false);
      }
      return;
    }

    const poValueNum = parseFloat(customPoValue) || selectedSupplier.current_po_value;
    const activeAgent = SIEMENS_AGENTS.find(a => a.id === selectedAgentId);
    if (!activeAgent) {
      setNegotiating(false);
      return;
    }
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
            sender: "Prometheus Agent",
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
              sender: log.action_type === "result" || log.message.toLowerCase().includes("result") || log.message.toLowerCase().includes("approve") ? "Prometheus Agent" : agentSenderName,
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
            sender: "Prometheus Agent",
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
              sender: "Prometheus Agent",
              message: decisionText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);

          await new Promise(resolve => setTimeout(resolve, 1000));
          setChatMessages(prev => [
            ...prev,
            {
              id: `db-confirm-mock-${Date.now()}`,
              sender: "Prometheus Agent",
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
            sender: "Prometheus Agent",
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
            sender: "Prometheus Agent",
            message: `ESG Database Audit Results:\n- Carbon Footprint Rating: ${selectedSupplier.co2_footprint || "1,200 tons/yr"}\n- Ethical Raw Sourcing Vetting: ${selectedSupplier.ethical_sourcing || "90%"}\n- Supply Chain Integrity Vetting Index: PASSED`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `esg-3-${Date.now()}`,
            sender: "Prometheus Agent",
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
            sender: "Prometheus Agent",
            message: `Compliance Scanning Completed:\n- OFAC Sanctions Database Vetting: NO MATCHES / CLEARED\n- Politically Exposed Persons (PEP) Check: NO MATCHES / CLEARED\n- AML Registry Score Index: 98/100 (Extremely Low Risk)`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);

        await new Promise(resolve => setTimeout(resolve, 1000));
        setChatMessages(prev => [
          ...prev,
          {
            id: `comp-3-${Date.now()}`,
            sender: "Prometheus Agent",
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
    } else if (selectedAgentId === "sourcing") {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setChatMessages(prev => [
          ...prev,
          {
            id: `sourcing-reply-${Date.now()}`,
            sender: agentSenderName,
            message: `Searching global registries for new suppliers matching your criteria...\nHere are some candidate recommendations:\n1. Apex Advanced Parts Corp (Score: 92/100, Location: USA)\n2. Rhine Precision Metalworks (Score: 89/100, Location: Germany)\n3. Kyoto Controls Ltd (Score: 88/100, Location: Japan)\nWould you like me to start credit risk or compliance vetting on any of these?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setFinalDecision("SOURCING_INPROGRESS");
      } finally {
        setNegotiating(false);
      }
    }
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplierName.trim()) return;

    const nextIdNum = suppliers.length + 1;
    const newId = `SUP-${String(nextIdNum).padStart(3, "0")}`;
    const countryFlag = COUNTRY_FLAGS[newSupplierCountry] || "🌍";

    const newSup = {
      id: newId,
      name: newSupplierName,
      category: newSupplierCategory,
      current_po_value: parseFloat(newSupplierPoValue) || 0.0,
      project_name: newSupplierProjectName || "General Procurement Vetting",
      description: newSupplierDescription || "Newly registered supplier pending full security audit.",
      operational_rating: "Pending Review",
      delivery_reliability: "New Supplier",
      credit_score: "A",
      risk_level: "Low",
      numerical_rating: 80,
      performance_trends: [80, 80, 80, 80, 80, 80],
      esg_rating: "A",
      co2_footprint: "0 tons/yr",
      ethical_sourcing: "100%",
      country: newSupplierCountry,
      flag: countryFlag
    };

    setSuppliers(prev => [...prev, newSup]);
    setSelectedSupplierId(newId);

    // Reset form & close modal
    setNewSupplierName("");
    setNewSupplierCategory("Raw Materials & Heavy Machinery");
    setNewSupplierPoValue("");
    setNewSupplierProjectName("");
    setNewSupplierDescription("");
    setNewSupplierCountry("Germany");
    setIsAddModalOpen(false);
  };

  const triggerClearanceSuggestion = () => {
    setChatInput("evaluate");
  };

  const activeAgent = SIEMENS_AGENTS.find(a => a.id === selectedAgentId);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Siemens Header */}
      <header className="bg-slate-900 text-white border-b-4 border-[#009999] px-6 py-4 shadow-md sticky top-0 z-50">
        <div className="max-w-[80%] w-[80%] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 whitespace-nowrap min-w-0">
            <div className="font-extrabold text-2xl tracking-[0.2em] text-[#009999] flex items-center shrink-0">
              SIEMENS
              <span className="text-white text-xs font-normal tracking-wide ml-2 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Procurement
              </span>
            </div>
            <div className="h-6 w-px bg-slate-700 hidden md:block shrink-0"></div>
            <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-slate-300 hidden md:inline truncate">
              Supplier Intelligence & Agent Terminal
            </span>
          </div>

          <div className="flex items-center lg:pr-[6.67%] shrink-0">
            <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-700 whitespace-nowrap">
              <span className="w-2.5 h-2.5 rounded-full bg-[#009999] animate-pulse"></span>
              prometheus agents connected
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[80%] w-[80%] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Supplier Register & Dossier (Lg: 4cols) */}
        <section className="lg:col-span-4 flex flex-col gap-3">
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

            <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-[#009999] font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                Suppliers list
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="w-6 h-6 rounded-full bg-[#009999]/10 text-[#009999] hover:bg-[#009999] hover:text-white flex items-center justify-center transition focus:outline-none cursor-pointer"
                title="Add Supplier"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
              </button>
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
                    className={`w-full text-left p-4 hover:bg-slate-50 transition flex flex-col gap-1 focus:outline-none ${selectedSupplierId === supplier.id ? "bg-[#009999]/5 border-l-4 border-[#009999]" : "border-l-4 border-transparent"
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

        {/* Right Column: Chatbot Console (Lg: 8cols) */}
        <section className="lg:col-span-8 flex flex-col gap-2">

          {/* OPTION TO SELECT ONE VETTING AGENT AT A TIME */}
          <div className="bg-white rounded-lg border border-slate-200 p-2.5 shadow-sm flex flex-col gap-1.5 max-w-[90%]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {SIEMENS_AGENTS.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`py-2 px-2.5 text-left rounded border transition focus:outline-none flex flex-col gap-0.5 min-w-0 ${selectedAgentId === agent.id
                      ? "bg-emerald-600 border-emerald-600 text-white shadow-sm font-semibold"
                      : "bg-slate-50 border-slate-100 hover:bg-slate-100 text-slate-800"
                    }`}
                >
                  <span className="text-[10px] block truncate font-bold leading-tight">{agent.name}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "Active" ? "bg-emerald-400 animate-pulse" : "bg-red-550"}`}></span>
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${selectedAgentId === agent.id ? "text-emerald-100" : (agent.status === "Active" ? "text-emerald-500" : "text-red-500")}`}>
                      {agent.status === "Active" ? "Live" : "Offline"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl border border-emerald-200/60 overflow-hidden flex flex-col flex-1 min-h-[640px] max-w-[90%]">

            {/* Tab Navigation Menu */}
            <div className="bg-emerald-800 px-4 py-3 flex items-center justify-between border-b border-emerald-700 shadow-sm">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-100">
                Agent Terminal
              </span>
              <span className="text-[10px] font-mono text-emerald-200/80">
                {negotiating ? "Running analysis..." : "Standby"}
              </span>
            </div>

            {/* Chatbot Dialogue (Light Green / White AI Gradient Background) */}
            <div className="flex-1 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/60 flex flex-col justify-between border border-emerald-100/50 relative overflow-hidden">

              {/* AI theme background elements */}
              <div className="absolute inset-0 pointer-events-none opacity-20 z-0">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                      <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#10b981" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-emerald-300/30 rounded-full blur-3xl pointer-events-none z-0"></div>
              <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-200/20 rounded-full blur-3xl pointer-events-none z-0"></div>

              {/* Active Session Info - Unbolded matching font */}
              {selectedAgentId && (
                <div className="bg-white/75 backdrop-blur-sm border-b border-emerald-100 p-3 flex flex-col gap-1 z-10 text-xs text-slate-700 font-sans">
                  <div>
                    Supplier: <span className="underline decoration-emerald-500 decoration-1 underline-offset-2 text-slate-900">{selectedSupplier.name}</span>
                  </div>
                  <div>
                    Requested Agent: <span className="text-emerald-700 font-normal">{activeAgent?.name}</span>
                  </div>
                </div>
              )}

              {/* Chat Message Box */}
              <div ref={chatContainerRef} className="flex-1 px-4 md:px-6 py-1 overflow-y-scroll space-y-4 max-h-[490px] min-h-[390px] z-10">
                {/* Onboard options when no agent is selected and history is empty */}
                {!selectedAgentId && chatMessages.length === 0 && (
                  <div className="flex flex-col gap-3 mb-4 mt-2">
                    <div className="flex flex-col items-start mr-auto max-w-[85%]">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1 font-mono">
                        Siemens Sourcing Assistant &bull; System
                      </span>
                      <div className="p-3 rounded-lg text-xs leading-relaxed shadow-sm bg-emerald-600 text-white rounded-tl-none border border-emerald-500">
                        Welcome to the Siemens Sourcing Terminal. Please select a specialized vetting agent above or ask me a question here.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 max-w-xl w-full mt-1">
                      {/* Card 1: Select a Vetting Agent */}
                      <div className="p-3 bg-white/70 backdrop-blur-md rounded-lg border border-emerald-100/80 shadow-sm flex flex-col items-center gap-1.5 text-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-800 leading-tight">Select a Vetting Agent</h4>
                        <p className="text-[9px] text-slate-500 leading-relaxed">
                          Select one of the specialized agents above to audit active supplier records.
                        </p>
                      </div>

                      {/* Card 2: Find a new supplier */}
                      <button
                        type="button"
                        onClick={() => {
                          chatInputRef.current?.focus();
                        }}
                        className="p-3 bg-white/75 hover:bg-emerald-50/50 backdrop-blur-md rounded-lg border border-emerald-100/80 shadow-sm flex flex-col items-center gap-1.5 cursor-pointer transition-all hover:scale-[1.02] border-dashed hover:border-emerald-300 text-center"
                      >
                        <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-650 flex items-center justify-center shadow-inner">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <h4 className="text-[11px] font-bold text-slate-800 leading-tight">Find a new supplier</h4>
                        <p className="text-[9px] text-slate-500 leading-relaxed">
                          Query the AI sourcing assistant to find new matching suppliers for procurement.
                        </p>
                      </button>
                    </div>
                  </div>
                )}

                {chatMessages.map((msg) => {
                  const isUser = msg.sender === "User";
                  const isSiemens = msg.sender.includes("Siemens");
                  const isPrometheus = msg.sender.includes("Prometheus");

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[85%] ${isUser ? "ml-auto items-end" : "mr-auto items-start"
                        }`}
                    >
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1 font-mono">
                        {msg.sender} &bull; {msg.timestamp}
                      </span>

                      <div
                        className={`p-3 rounded-lg text-xs leading-relaxed shadow-sm ${isUser
                            ? "bg-slate-800 text-white rounded-tr-none border border-slate-700"
                            : isPrometheus
                              ? "bg-blue-600 text-white rounded-tl-none border border-blue-500"
                              : isSiemens
                                ? "bg-emerald-600 text-white rounded-tl-none border border-emerald-500"
                                : "bg-teal-700 text-white rounded-tl-none border border-teal-600"
                          }`}
                      >
                        <p className="whitespace-pre-line">{msg.message}</p>
                      </div>
                    </div>
                  );
                })}
                {negotiating && (
                  <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-mono italic animate-pulse py-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                    <span>Clearing nodes...</span>
                  </div>
                )}
              </div>

              {/* Chat input box */}
              <form
                onSubmit={handleSendMessage}
                className="bg-white/80 backdrop-blur-sm border-t border-emerald-100/80 p-3 flex gap-2 z-10"
              >
                <input
                  ref={chatInputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-50 text-xs text-slate-800 border border-emerald-100 rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500"
                  disabled={negotiating}
                />
                <button
                  type="submit"
                  disabled={negotiating || !chatInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs uppercase tracking-wider p-2.5 rounded-lg transition focus:outline-none flex items-center justify-center cursor-pointer"
                  title="Send message"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Offline banner warning */}
            {errorMsg && (
              <div className="bg-amber-500/10 border-t border-amber-500/20 px-4 py-2 text-xs text-amber-800 font-mono text-center z-10">
                {errorMsg}
              </div>
            )}

            {/* Console Footer: Decision display */}
            {finalDecision && (
              <div className="bg-slate-50 p-4 border-t border-emerald-100/80 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-mono">Final Decision:</span>
                  <div className={`px-3 py-1 rounded font-bold font-mono text-xs ${finalDecision.includes("APPROVED") || finalDecision.includes("CLEARED") || finalDecision.includes("COMPLIANT")
                      ? "bg-emerald-100 text-emerald-850 border border-emerald-200"
                      : "bg-amber-100 text-amber-850 border border-amber-200"
                    }`}>
                    {finalDecision}
                  </div>
                </div>
                {dbScoreResult && (
                  <span className="text-xs font-mono text-slate-650 hidden md:inline">
                    Credit Rating Score: <strong className="text-slate-800">{dbScoreResult.score}</strong>
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

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden transform transition-all flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.0} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Register New Supplier
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white transition focus:outline-none cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleAddSupplier} className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[85vh]">
              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  placeholder="e.g. Siemens Turbine Engineering GmbH"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600 text-slate-800 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Category</label>
                  <select
                    value={newSupplierCategory}
                    onChange={(e) => setNewSupplierCategory(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600 text-slate-800 font-medium"
                  >
                    <option value="Raw Materials & Heavy Machinery">Raw Materials & Heavy Machinery</option>
                    <option value="Semiconductors & Sensors">Semiconductors & Sensors</option>
                    <option value="Electrical & Cabling">Electrical & Cabling</option>
                    <option value="Green Energy Systems">Green Energy Systems</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Current PO Value (€)</label>
                  <input
                    type="number"
                    value={newSupplierPoValue}
                    onChange={(e) => setNewSupplierPoValue(e.target.value)}
                    placeholder="e.g. 750000"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600 text-slate-800 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Project Scope</label>
                  <input
                    type="text"
                    value={newSupplierProjectName}
                    onChange={(e) => setNewSupplierProjectName(e.target.value)}
                    placeholder="e.g. Hamburg Wind Farm"
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600 text-slate-800 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Origin Country</label>
                  <select
                    value={newSupplierCountry}
                    onChange={(e) => setNewSupplierCountry(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600 text-slate-800 font-medium"
                  >
                    {Object.keys(COUNTRY_FLAGS).map((c) => (
                      <option key={c} value={c}>
                        {COUNTRY_FLAGS[c]} {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Supplier Profile Description</label>
                <textarea
                  value={newSupplierDescription}
                  onChange={(e) => setNewSupplierDescription(e.target.value)}
                  placeholder="Provide a summary of the supplier scope and logistics profile..."
                  rows={3}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600 text-slate-800 font-medium resize-none"
                />
              </div>

              {/* Form Footer */}
              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition focus:outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition focus:outline-none cursor-pointer shadow-sm"
                >
                  Create Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
