"use client";

import { useState, useEffect } from "react";

interface Contact {
  id: string;
  name: string;
  role: string;
  opportunity: string;
  autoIntro?: string;
}

interface NetworkMapProps {
  userId: string;
}

export default function NetworkMap({ userId }: NetworkMapProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [opportunity, setOpportunity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [userId]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`/api/network?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name, role, opportunity }),
      });

      if (!res.ok) {
        throw new Error("Failed to add contact");
      }

      const newContact = await res.json();
      setContacts([newContact, ...contacts]);
      setName("");
      setRole("");
      setOpportunity("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateIntro = async (contact: Contact) => {
    try {
      const res = await fetch(
        `/api/network?userId=${userId}&generateIntro=true`
      );
      if (res.ok) {
        const data = await res.json();
        setSelectedContact({ ...contact, autoIntro: data.autoIntro });
      }
    } catch (err) {
      console.error("Failed to generate intro:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold mb-4 text-blue-400">Add Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contact name"
            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded px-3 py-2 border border-slate-600 focus:border-blue-400 focus:outline-none"
            disabled={loading}
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role or title"
            className="w-full bg-slate-700 text-white placeholder-slate-400 rounded px-3 py-2 border border-slate-600 focus:border-blue-400 focus:outline-none"
            disabled={loading}
          />
          <textarea
            value={opportunity}
            onChange={(e) => setOpportunity(e.target.value)}
            placeholder="Opportunity (what you can help with or learn)"
            className="w-full h-20 bg-slate-700 text-white placeholder-slate-400 rounded px-3 py-2 border border-slate-600 focus:border-blue-400 focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !name.trim() || !role.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded transition"
          >
            {loading ? "Adding..." : "Add Contact"}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-purple-400">Network</h2>
        {contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700 cursor-pointer hover:border-purple-400 transition"
                onClick={() => setSelectedContact(contact)}
              >
                <h3 className="font-bold text-white">{contact.name}</h3>
                <p className="text-sm text-slate-400">{contact.role}</p>
                <p className="text-xs text-slate-500 mt-2">{contact.opportunity}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    generateIntro(contact);
                  }}
                  className="mt-3 text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition"
                >
                  Generate Intro
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">No contacts yet</p>
        )}
      </div>

      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-2">
              {selectedContact.name}
            </h3>
            <p className="text-slate-400 mb-4">{selectedContact.role}</p>
            {selectedContact.autoIntro && (
              <div className="bg-slate-700 rounded p-4 text-sm text-slate-300 mb-4 max-h-32 overflow-y-auto">
                {selectedContact.autoIntro}
              </div>
            )}
            <button
              onClick={() => setSelectedContact(null)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
