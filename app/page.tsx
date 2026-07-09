"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import DecisionForm from "@/components/DecisionForm";
import NetworkMap from "@/components/NetworkMap";
import TaskBoard from "@/components/TaskBoard";
import TaxCalculator from "@/components/TaxCalculator";

type Tab = "dashboard" | "decisions" | "network" | "tasks" | "tax";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [userId] = useState("user-123");

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "decisions", label: "Decisions" },
    { id: "network", label: "Network" },
    { id: "tasks", label: "Tasks" },
    { id: "tax", label: "Tax Calculator" },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-slate-700">
        <div className="flex gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`pb-2 px-1 font-medium transition ${
                activeTab === tab.id
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {activeTab === "dashboard" && <Dashboard userId={userId} />}
        {activeTab === "decisions" && <DecisionForm userId={userId} />}
        {activeTab === "network" && <NetworkMap userId={userId} />}
        {activeTab === "tasks" && <TaskBoard userId={userId} />}
        {activeTab === "tax" && <TaxCalculator />}
      </div>
    </div>
  );
}
