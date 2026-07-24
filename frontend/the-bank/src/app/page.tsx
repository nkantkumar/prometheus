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
    agents_used: ["Credit Score", "ESG Agent"],
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
    agents_used: ["Credit Score", "ESG Agent", "Compliance & AML Agent"],
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
    agents_used: ["Credit Score"],
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
    agents_used: ["Credit Score", "Compliance & AML Agent"],
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
    agents_used: ["Credit Score", "Compliance & AML Agent", "ESG Agent"],
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
    agents_used: ["Credit Score", "ESG Agent"],
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
    agents_used: ["Credit Score", "ESG Agent"],
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
      sender: "The Bank Credit Score",
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
      sender: "The Bank Credit Score",
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
      sender: "The Bank Credit Score",
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
      sender: "The Bank Credit Score",
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
    name: "Financial Risk Assessment",
    description: "Simulates debt, equity, and liquidity risks using dynamic mathematical scoring models.",
    popular: true,
    status: "Active",
    category: "corporate"
  },
  {
    id: "credit",
    name: "Credit Score",
    description: "Vets supplier credit ratings and stores cleared audit transcripts in connection with your client portals.",
    popular: true,
    status: "Active",
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
        <svg className="w-28 h-28 mx-auto animate-float drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="calcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00b4d8" />
              <stop offset="100%" stopColor="#002f6c" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffb703" />
              <stop offset="100%" stopColor="#fb8500" />
            </linearGradient>
            <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>
          <rect x="20" y="10" width="60" height="80" rx="6" fill="url(#calcGrad)" filter="url(#shadow3d)" stroke="#00b4d8" strokeWidth="1.5" />
          <rect x="28" y="18" width="44" height="16" rx="3" fill="#0f172a" stroke="#475569" strokeWidth="1" />
          <line x1="34" y1="26" x2="66" y2="26" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="36" cy="48" r="4.5" fill="url(#goldGrad)" />
          <circle cx="50" cy="48" r="4.5" fill="url(#goldGrad)" />
          <circle cx="64" cy="48" r="4.5" fill="url(#goldGrad)" />

          <circle cx="36" cy="62" r="4.5" fill="#f87171" />
          <circle cx="50" cy="62" r="4.5" fill="#38bdf8" />
          <circle cx="64" cy="62" r="4.5" fill="#34d399" />

          <circle cx="36" cy="76" r="4.5" fill="#e2e8f0" />
          <circle cx="50" cy="76" r="4.5" fill="#e2e8f0" />
          <rect x="59" y="71" width="10" height="10" rx="2" fill="url(#goldGrad)" />
        </svg>
      );
    case "credit":
      return (
        <svg className="w-28 h-28 mx-auto animate-pulse-slow drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffe57f" />
              <stop offset="100%" stopColor="#ffb300" />
            </linearGradient>
            <filter id="shadow3d2" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="5" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>
          <rect x="15" y="22" width="70" height="48" rx="6" fill="url(#cardGrad)" filter="url(#shadow3d2)" stroke="#ffffff" strokeWidth="1" />
          <rect x="15" y="32" width="70" height="10" fill="#0f172a" opacity="0.85" />
          <rect x="25" y="48" width="14" height="11" rx="2" fill="url(#goldGrad2)" filter="url(#shadow3d2)" />
          <line x1="32" y1="48" x2="32" y2="59" stroke="#b78103" strokeWidth="1" />
          <line x1="25" y1="53" x2="39" y2="53" stroke="#b78103" strokeWidth="1" />
          <circle cx="64" cy="54" r="7" fill="#ff4d4d" opacity="0.9" />
          <circle cx="71" cy="54" r="7" fill="#ffb300" opacity="0.9" />
        </svg>
      );
    case "esg":
      return (
        <svg className="w-28 h-28 mx-auto animate-rotate-slow drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="esgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="shadow3d3" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="5" stdDeviation="3.5" floodColor="#047857" floodOpacity="0.3" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="30" fill="url(#esgGrad)" filter="url(#shadow3d3)" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M50,22 C66,22 76,34 76,50 C76,66 66,78 50,78 C50,78 38,62 50,50 C62,38 50,22 50,22 Z" fill="url(#leafGrad)" opacity="0.95" filter="url(#shadow3d3)" />
          <circle cx="50" cy="50" r="10" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      );
    case "compliance":
      return (
        <svg className="w-28 h-28 mx-auto animate-float drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="checkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="shadow3d4" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="6" stdDeviation="3" floodColor="#78350f" floodOpacity="0.4" />
            </filter>
          </defs>
          <path d="M50,15 L78,25 L78,50 C78,69 66,83 50,87 C34,83 22,69 22,50 L22,25 Z" fill="url(#shieldGrad)" filter="url(#shadow3d4)" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M38,48 L46,56 L62,38" stroke="url(#checkGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" filter="url(#shadow3d4)" />
        </svg>
      );
    case "legal":
      return (
        <svg className="w-28 h-28 mx-auto animate-pulse-slow drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gavelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <filter id="shadow3d5" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="5" stdDeviation="3.5" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>
          <rect x="25" y="15" width="50" height="70" rx="4" fill="url(#gavelGrad)" filter="url(#shadow3d5)" stroke="#ffffff" strokeWidth="1" />
          <line x1="35" y1="28" x2="65" y2="28" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="35" y1="38" x2="65" y2="38" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="35" y1="48" x2="55" y2="48" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="42" y="58" width="28" height="14" rx="2" fill="url(#woodGrad)" filter="url(#shadow3d5)" transform="rotate(-15 56 65)" />
          <rect x="52" y="68" width="6" height="20" rx="1" fill="url(#woodGrad)" filter="url(#shadow3d5)" transform="rotate(-15 56 65)" />
        </svg>
      );
    case "mortgage":
      return (
        <svg className="w-28 h-28 mx-auto animate-float drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="houseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#be185d" />
            </linearGradient>
            <filter id="shadow3d6" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="5" stdDeviation="3" floodColor="#0c4a6e" floodOpacity="0.35" />
            </filter>
          </defs>
          <path d="M15,50 L50,18 L85,50 Z" fill="url(#roofGrad)" filter="url(#shadow3d6)" stroke="#ffffff" strokeWidth="1" />
          <rect x="25" y="48" width="50" height="38" rx="4" fill="url(#houseGrad)" filter="url(#shadow3d6)" stroke="#ffffff" strokeWidth="1" />
          <rect x="44" y="62" width="12" height="24" rx="2" fill="#be185d" stroke="#ffffff" strokeWidth="1" />
          <circle cx="36" cy="58" r="4.5" fill="#fef08a" />
          <circle cx="64" cy="58" r="4.5" fill="#fef08a" />
        </svg>
      );
    case "wealth":
      return (
        <svg className="w-28 h-28 mx-auto animate-rotate-slow drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wealthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="goldGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <filter id="shadow3d7" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="5" stdDeviation="3" floodColor="#1e1b4b" floodOpacity="0.35" />
            </filter>
          </defs>
          <circle cx="50" cy="50" r="30" fill="url(#wealthGrad)" filter="url(#shadow3d7)" stroke="#ffffff" strokeWidth="1.5" />
          <path d="M25,65 L43,47 L58,57 L75,32" stroke="url(#goldGrad3)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#shadow3d7)" />
          <polyline points="65,32 75,32 75,42" stroke="url(#goldGrad3)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="43" cy="47" r="2.5" fill="#ffffff" />
          <circle cx="58" cy="57" r="2.5" fill="#ffffff" />
        </svg>
      );
    case "fraud":
      return (
        <svg className="w-28 h-28 mx-auto animate-pulse-slow drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fraudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>
            <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <filter id="shadow3d8" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="3" dy="5" stdDeviation="3" floodColor="#7f1d1d" floodOpacity="0.4" />
            </filter>
          </defs>
          <circle cx="46" cy="46" r="22" fill="url(#fraudGrad)" filter="url(#shadow3d8)" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="60" y1="60" x2="80" y2="80" stroke="#fca5a5" strokeWidth="5" strokeLinecap="round" filter="url(#shadow3d8)" />
          <circle cx="46" cy="46" r="12" fill="url(#lensGrad)" stroke="#ffffff" strokeWidth="1" />
          <path d="M38,46 C38,41 41,38 46,38" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "personal_credit":
      return (
        <svg className="w-28 h-28 mx-auto animate-float drop-shadow-md" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <linearGradient id="needleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="shadow3d9" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="5" stdDeviation="3.5" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>
          <path d="M20,68 A32,32 0 0,1 80,68" stroke="url(#gaugeGrad)" strokeWidth="9" strokeLinecap="round" filter="url(#shadow3d9)" />
          <line x1="50" y1="68" x2="68" y2="44" stroke="url(#needleGrad)" strokeWidth="3" strokeLinecap="round" filter="url(#shadow3d9)" />
          <circle cx="50" cy="68" r="6" fill="#0f172a" stroke="#ffffff" strokeWidth="1.5" />
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
  const [addedAgentId, setAddedAgentId] = useState<string | null>(null);
  const [addedAgentIds, setAddedAgentIds] = useState<string[]>([]);
  const [loginTime, setLoginTime] = useState("");
  const [popupAgentId, setPopupAgentId] = useState<string | null>(null);
  const [setupSuccessId, setSetupSuccessId] = useState<string | null>(null);
  const [copiedAgentId, setCopiedAgentId] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [setupDone, setSetupDone] = useState<boolean>(false);

  useEffect(() => {
    const now = new Date();
    setLoginTime(now.toLocaleString());
  }, []);

  const handleAddToCart = (e: React.MouseEvent, agentId: string) => {
    e.stopPropagation();
    setAddedAgentId(agentId);
    if (!addedAgentIds.includes(agentId)) {
      setAddedAgentIds([...addedAgentIds, agentId]);
    }
    setPopupAgentId(agentId);
    setTimeout(() => {
      setAddedAgentId(null);
    }, 1000);
  };

  const handleCopyUrl = (e: React.MouseEvent, agentId: string, url: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedAgentId(agentId);
    setTimeout(() => {
      setCopiedAgentId(null);
    }, 2000);
  };

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

  // Filter and sort agents list so popular are at the beginning
  const filteredAgents = ALL_BANK_AGENTS.filter(agent =>
    agent.category === agentCategory &&
    (agent.name.toLowerCase().includes(agentSearch.toLowerCase()) ||
      agent.description.toLowerCase().includes(agentSearch.toLowerCase()))
  ).sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return 0;
  });

  const activeAgentInfo = ALL_BANK_AGENTS.find(a => a.id === selectedAgentId) ||
    ALL_BANK_AGENTS.find(a => a.category === agentCategory) ||
    ALL_BANK_AGENTS[0];

  const popupAgent = ALL_BANK_AGENTS.find(a => a.id === popupAgentId);

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
          <div className="flex items-center gap-8">
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

            {/* Main Navigation Menus similar to Deutsche Bank */}
            <nav className="hidden xl:flex items-center gap-6 text-[13px] font-semibold text-blue-100 tracking-wider">
              <a href="#" className="hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-white pb-1">Corporate Bank</a>
              <a href="#" className="hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-white pb-1">Investment Bank</a>
              <a href="#" className="hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-white pb-1">Private Bank</a>
              <a href="#" className="hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-white pb-1">Asset Management</a>
              <a href="#" className="hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-white pb-1">Products</a>
              <a href="#" className="hover:text-white transition-colors duration-200 border-b-2 border-transparent hover:border-white pb-1">About Us</a>
            </nav>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-[12px] md:text-sm text-white flex items-center gap-1.5 font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Login as : Ethan Ma(SpaceY)
            </span>
            {loginTime && (
              <span className="text-[10px] text-blue-200 font-semibold tracking-wider">
                Last Login: {loginTime}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Workspace (Stacked Vertically: Up and Down) */}
      <main className="flex-1 max-w-[80%] w-[80%] mx-auto pt-6 pb-6 px-4 md:pt-8 md:pb-8 md:px-6 flex flex-col gap-6">

        {/* ROW 1: Prometheus AI Agent Gardens (SINGLE CONTAINER - 30% LARGER IN VISUAL HEIGHT & SPACING) */}
        <div className="w-full flex-1 bg-white/70 backdrop-blur-md rounded-xl border border-blue-200/40 p-8 shadow-md flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-blue-50 pb-4">
            <div className="flex items-center gap-2.5">
              {/* 3D Garden SVG Icon */}
              <svg className="w-6 h-6 animate-float drop-shadow-md shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <filter id="gardShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#047857" floodOpacity="0.3" />
                  </filter>
                </defs>
                <path d="M50,15 C65,15 75,25 75,40 C75,55 65,65 50,65 C50,65 40,50 50,40 C60,30 50,15 50,15 Z" fill="url(#gardGrad)" filter="url(#gardShadow)" />
                <path d="M50,40 C35,40 25,50 25,65 C25,80 35,90 50,90 C50,90 60,75 50,65 C40,55 50,40 50,40 Z" fill="url(#gardGrad)" filter="url(#gardShadow)" />
              </svg>
              <h1 className="text-[18px] text-[#059669] font-bold tracking-tight">
                Prometheus AI Agent Gardens
              </h1>
            </div>

            {/* Align Corporate/Retail client tabs alongside search inside the body card header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
              <div className="flex border-b border-slate-100 pb-1 gap-4">
                <button
                  onClick={() => {
                    setAgentCategory("corporate");
                    setSelectedAgentId("esg");
                  }}
                  className={`pb-1 px-1 text-[13px] font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${agentCategory === "corporate"
                      ? "border-[#002f6c] text-[#17233C]"
                      : "border-transparent text-[#60708A] hover:text-[#17233C]"
                    }`}
                >
                  🏢 Corporate
                </button>
                <button
                  onClick={() => {
                    setAgentCategory("retail");
                    setSelectedAgentId("mortgage");
                  }}
                  className={`pb-1 px-1 text-[13px] font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${agentCategory === "retail"
                      ? "border-[#002f6c] text-[#17233C]"
                      : "border-transparent text-[#60708A] hover:text-[#17233C]"
                    }`}
                >
                  👤 Retail
                </button>
              </div>

              {/* Agent Search */}
              <div className="relative w-full sm:w-52">
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={agentSearch}
                  onChange={(e) => setAgentSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-blue-100 rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-[#002f6c] text-[#17233C] font-medium"
                />
                <svg className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Tabs & description wrapped with a smaller vertical gap to reduce space */}
          <div className="flex flex-col gap-2 flex-1">

            {/* Agent Selection Grid (Horizontal List - Modern cards matching the DB Developer portal style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-2">
              {filteredAgents.map((agent) => {
                const isSelected = selectedAgentId === agent.id;
                const isAdded = addedAgentIds.includes(agent.id);
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`relative bg-white rounded-2xl border p-5 flex flex-col justify-between transition-all duration-355 cursor-pointer ${isSelected
                        ? "border-2 border-[#002f6c] ring-4 ring-[#00b4d8]/25 shadow-2xl scale-[1.02] -translate-y-1.5 z-10"
                        : "border-slate-200/80 shadow-xs hover:border-slate-300"
                      }`}
                  >
                    {/* Added Overlay Banner */}
                    {addedAgentId === agent.id && (
                      <div className="absolute inset-0 bg-[#4ea800]/95 rounded-2xl flex flex-col items-center justify-center text-white z-40 transition-opacity duration-300 font-bold text-sm">
                        <svg className="w-8 h-8 mb-1.5 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Added!
                      </div>
                    )}

                    {/* Top status badge */}
                    <div className="flex gap-1.5 mb-3 flex-wrap font-sans items-center">
                      {agent.status === "Active" ? (
                        <span
                          className="bg-[#4ea800]/10 text-[#4ea800] border border-[#4ea800]/25 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px]"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#4ea800] animate-pulse"></span>
                          Live
                        </span>
                      ) : (
                        <span
                          className="bg-[#ff9e1b]/10 text-[#ff9e1b] border border-[#ff9e1b]/25 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px]"
                        >
                          <span className="w-1 h-1 rounded-full bg-[#ff9e1b]"></span>
                          Simulation
                        </span>
                      )}
                      {agent.popular && (
                        <span
                          className="bg-[#002f6c]/10 text-[#002f6c] border border-[#002f6c]/25 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px]"
                        >
                          <svg className="w-2 h-2 text-[#002f6c]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Popular
                        </span>
                      )}
                    </div>

                    {/* Center illustration */}
                    <div className="py-3 flex justify-center bg-slate-50/50 rounded-xl mb-4 border border-slate-100/50">
                      {getAgentIllustration(agent.id)}
                    </div>

                    {/* Agent details */}
                    <div className="flex-1 flex flex-col justify-between min-h-[220px] transition-all duration-305">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#17233C] text-[18px] font-bold tracking-tight">
                          {agent.name}
                        </h3>
                        <p className="text-[#60708A] text-[15px] font-normal leading-[1.6] line-clamp-4 mt-2">
                          {agent.description}
                        </p>
                      </div>

                      {/* Card Bottom Actions */}
                      <div className="pt-2 mt-auto border-t border-slate-100 flex items-center justify-end">
                        {!isAdded ? (
                          <button
                            onClick={(e) => handleAddToCart(e, agent.id)}
                            className="bg-[#00b4d8] hover:bg-[#0096c7] text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5 text-[14px] transition cursor-pointer shadow-sm"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-slate-100 text-slate-400 border border-slate-200 font-semibold py-2 px-4 rounded-lg text-[14px] cursor-not-allowed shadow-none"
                          >
                            Added
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredAgents.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-400 text-sm font-mono">No agents match.</div>
              )}
            </div>


          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-[#002f6c]/90 backdrop-blur-sm text-slate-300 text-sm md:text-base px-6 py-4 mt-0 border-t border-blue-900">
        <div className="max-w-[80%] w-[80%] mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 The Bank AG. Member FDIC.</span>
        </div>
      </footer>

      {/* Popup Modal */}
      {popupAgent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Modal Box */}
          <div className="bg-white rounded-3xl border border-slate-100/50 shadow-2xl p-8 max-w-lg w-full flex flex-col gap-6 relative animate-fadeIn transform scale-100">

            {/* Close Button */}
            <button
              onClick={() => {
                setPopupAgentId(null);
                setSetupSuccessId(null);
                setShowInstructions(false);
                setSetupDone(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo and Header info */}
            <div className="flex flex-col items-center text-center gap-4 border-b border-slate-100 pb-4">
              <div className="py-2 px-6 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                {getAgentIllustration(popupAgent.id)}
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-[#17233C] text-[24px] font-bold font-sans">
                  {popupAgent.name}
                </h2>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#60708A] uppercase tracking-wider block">
                Description
              </span>
              <p className="text-[#60708A] text-[15px] font-normal leading-[1.6]">
                {popupAgent.description}
              </p>
            </div>

            {/* Agent Card (formerly Agent Access URL) section */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#17233C] uppercase tracking-wider block">
                Agent Card
              </span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value="https://banking-risk-agent-1067236812899.asia-south1.run.app"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-16 py-3 text-[15px] font-medium text-[#17233C] focus:outline-none focus:border-[#00b4d8] select-all cursor-text"
                />
                {/* Copy Button */}
                <button
                  onClick={(e) => handleCopyUrl(e, popupAgent.id, "https://banking-risk-agent-1067236812899.asia-south1.run.app")}
                  className="absolute right-3 p-1.5 text-[#60708A] hover:text-[#00b4d8] transition rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Copy URL"
                >
                  {copiedAgentId === popupAgent.id ? (
                    <span className="text-[11px] text-emerald-600 font-bold">Copied!</span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Token section */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#17233C] uppercase tracking-wider block">
                Token
              </span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={`tok_thebank_${popupAgent.id}_8a9d2f4e0c838291a0b3`}
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-16 py-3 text-[15px] font-mono text-[#17233C] focus:outline-none focus:border-[#00b4d8] select-all cursor-text"
                />
                {/* Copy Button */}
                <button
                  onClick={(e) => handleCopyUrl(e, popupAgent.id + "-token", `tok_thebank_${popupAgent.id}_8a9d2f4e0c838291a0b3`)}
                  className="absolute right-3 p-1.5 text-[#60708A] hover:text-[#00b4d8] transition rounded-lg hover:bg-slate-100 cursor-pointer"
                  title="Copy Token"
                >
                  {copiedAgentId === popupAgent.id + "-token" ? (
                    <span className="text-[11px] text-emerald-600 font-bold">Copied!</span>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-4 mt-2">
              {!showInstructions && !setupDone ? (
                // Initial State: Setup button is clickable
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setShowInstructions(true)}
                    className="bg-[#002f6c] hover:bg-blue-800 text-white font-semibold py-2.5 px-5 rounded-xl text-[14px] flex items-center gap-2 transition cursor-pointer shadow-md shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Setup
                  </button>
                </div>
              ) : showInstructions && !setupDone ? (
                // Setup Instruction panel
                <div className="flex flex-col gap-3.5 w-full bg-slate-50 p-5 rounded-2xl border border-slate-150 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-[#17233C] uppercase tracking-wider">
                      📋 Setup Instructions
                    </span>
                  </div>

                  <ol className="text-[15px] text-[#60708A] flex flex-col gap-2.5 leading-[1.6] font-normal">
                    <li className="flex gap-2">
                      <span className="font-bold text-[#00b4d8] shrink-0">1.</span>
                      <span>Copy the <strong>Agent Card</strong> URL and <strong>Token</strong> generated above.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-[#00b4d8] shrink-0">2.</span>
                      <span>Paste these connection details in the <strong>Registered Agents</strong> configuration interface.</span>
                    </li>
                  </ol>

                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setShowInstructions(false)}
                      className="text-[#60708A] hover:text-[#17233C] font-semibold py-1.5 px-3.5 rounded-lg text-[14px] transition cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setSetupDone(true);
                        setSetupSuccessId(popupAgent.id);
                      }}
                      className="bg-[#002f6c] hover:bg-blue-800 text-white font-semibold py-1.5 px-4 rounded-lg text-[14px] transition cursor-pointer shadow-sm"
                    >
                      Complete Setup
                    </button>
                  </div>
                </div>
              ) : (
                // Success State with Checkmark & Success Banner
                <div className="flex flex-col items-center justify-center gap-3 py-2 w-full animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center border border-emerald-200 shadow-sm">
                    <svg className="w-6 h-6 text-emerald-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-emerald-700 font-bold text-[14px] uppercase tracking-wider flex items-center gap-1.5">
                    setup done successfully
                  </span>
                  <button
                    onClick={() => {
                      setSetupDone(false);
                      setShowInstructions(true);
                    }}
                    className="mt-1 text-[#60708A] hover:text-[#17233C] text-[12px] underline font-semibold"
                  >
                    View Instructions Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
