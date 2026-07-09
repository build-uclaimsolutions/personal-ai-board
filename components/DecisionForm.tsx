"use client";

import { useState, useEffect } from "react";

interface Decision {
  id: string;
  description: string;
  analysis: string;
  created_at: string;
}

interface DecisionFormProps {
  userId: string;
}

export default function DecisionForm({ userId }: DecisionFormProps) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDecisions();
  }, [userId]);

  const fetchDecisions = async () => {
    try {
      const res = await fetch(`/api/decisions?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setDecisions(data);
      }
    } catch (err) {
      console.error("Failed to fetch decisions:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/decisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, description }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit decision");
      }

      const newDecision = await res.json();
      setDecisions([newDecision, ...decisions]);
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Submit Decision</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the decision you need to make..."
            className="w-full h-32 bg-slate-700 text-white placeholder-slate-400 rounded px-3 py-2 border border-slate-600 focus:border-blue-400 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !description.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition"
          >
            {loading ? "Analyzing..." : "Get AI Analysis"}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-purple-400">Decision History</h2>
        {decisions.length > 0 ? (
          decisions.map((decision) => (
            <div
              key={decision.id}
              className="bg-slate-800 rounded-lg p-6 border border-slate-700"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-white">{decision.description}</h3>
                <span className="text-xs text-slate-500">
                  {new Date(decision.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="bg-slate-700 rounded p-4 text-sm text-slate-300 whitespace-pre-wrap">
                {decision.analysis}
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400">No decisions yet</p>
        )}
      </div>
    </div>
  );
}
