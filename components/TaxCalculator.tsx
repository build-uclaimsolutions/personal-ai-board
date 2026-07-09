"use client";

import { useState } from "react";

interface TaxResult {
  income: number;
  analysis: string;
  timestamp: string;
}

export default function TaxCalculator() {
  const [income, setIncome] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const incomeNum = parseFloat(income);
      if (isNaN(incomeNum) || incomeNum < 0) {
        throw new Error("Please enter a valid income amount");
      }

      const res = await fetch("/api/tax-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ income: incomeNum }),
      });

      if (!res.ok) {
        throw new Error("Failed to calculate tax estimate");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Tax Savings Calculator</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Annual Income
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="Enter your annual income"
              className="w-full bg-slate-700 text-white placeholder-slate-400 rounded px-3 py-2 border border-slate-600 focus:border-blue-400 focus:outline-none"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !income.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition w-full"
          >
            {loading ? "Calculating..." : "Calculate Tax Savings"}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>

      {result && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-green-400 mb-4">
            Results for ${result.income.toLocaleString()}
          </h3>
          <div className="bg-slate-700 rounded p-4 text-sm text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
            {result.analysis}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Calculated: {new Date(result.timestamp).toLocaleDateString()}
          </p>
          <p className="text-xs text-red-400 mt-2">
            ⚠ This is an estimate only, not professional tax advice. Consult a tax professional.
          </p>
        </div>
      )}
    </div>
  );
}
