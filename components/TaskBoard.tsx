"use client";

import { useState, useEffect } from "react";

interface Task {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  decision_id: string;
  created_at: string;
}

interface TaskBoardProps {
  userId: string;
}

export default function TaskBoard({ userId }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [decisionId, setDecisionId] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, decisionId, title }),
      });

      if (!res.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setTitle("");
      setDecisionId("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const statuses = ["pending", "in_progress", "completed"] as const;

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Create Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={decisionId}
            onChange={(e) => setDecisionId(e.target.value)}
            placeholder="Decision ID (or leave blank)"
            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded px-3 py-2 border border-slate-600 focus:border-blue-400 focus:outline-none text-sm"
            disabled={loading}
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded px-3 py-2 border border-slate-600 focus:border-blue-400 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statuses.map((status) => (
          <div key={status} className="space-y-3">
            <h3 className="font-bold text-slate-300 capitalize text-sm">
              {status.replace("_", " ")}
            </h3>
            <div className="space-y-2 min-h-32">
              {tasks
                .filter((t) => t.status === status)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-slate-800 rounded p-3 border-l-2 border-purple-400"
                  >
                    <p className="font-medium text-sm text-white">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(task.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
