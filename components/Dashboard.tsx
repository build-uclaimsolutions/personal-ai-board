"use client";

import { useEffect, useState } from "react";

interface NetWorthData {
  total: number;
  breakdown: Record<string, number>;
}

interface Decision {
  id: string;
  description: string;
  created_at: string;
}

interface DashboardProps {
  userId: string;
}

export default function Dashboard({ userId }: DashboardProps) {
  const [netWorth, setNetWorth] = useState<NetWorthData | null>(null);
  const [recentDecisions, setRecentDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [netWorthRes, decisionsRes] = await Promise.all([
          fetch(`/api/net-worth?userId=${userId}`),
          fetch(`/api/decisions?userId=${userId}`),
        ]);

        if (netWorthRes.ok) {
          const data = await netWorthRes.json();
          setNetWorth(data);
        }

        if (decisionsRes.ok) {
          const data = await decisionsRes.json();
          setRecentDecisions(data.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Net Worth</h2>
        {netWorth ? (
          <div className="space-y-4">
            <div className="text-4xl font-bold text-green-400">
              ${netWorth.total.toLocaleString()}
            </div>
            <div className="space-y-2">
              {Object.entries(netWorth.breakdown).map(([category, value]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-slate-300">{category}</span>
                  <span className="font-mono">${value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No net worth data yet</p>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-purple-400">
          Recent Decisions
        </h2>
        {recentDecisions.length > 0 ? (
          <ul className="space-y-3">
            {recentDecisions.map((decision) => (
              <li key={decision.id} className="text-sm border-l-2 border-purple-400 pl-3">
                <p className="text-slate-300">{decision.description}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(decision.created_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">No decisions yet</p>
        )}
      </div>
    </div>
  );
}
