"use client";

import { useState, useCallback } from "react";
import { getCollection, updateCollectionItem, deleteCollectionItem } from "@/lib/api";

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="fade-in flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-xl max-w-sm"
          style={{
            background: t.type === "success" ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)",
            border: `1px solid ${t.type === "success" ? "rgba(16,185,129,0.4)" : "rgba(244,63,94,0.4)"}`,
            color: t.type === "success" ? "#6ee7b7" : "#fda4af",
            backdropFilter: "blur(12px)",
          }}
        >
          {t.type === "success" ? "✓" : "✕"} {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl p-6 max-w-sm w-full fade-in" style={{ background: "#ffffff", border: "1px solid #fecdd3", boxShadow: "0 10px 40px rgba(0,0,0,0.12)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(244,63,94,0.15)" }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f43f5e" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm" style={{ color: "#0f172a" }}>Delete Record</h3>
            <p className="text-xs" style={{ color: "#64748b" }}>This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200"
            style={{ background: "linear-gradient(135deg, #f43f5e, #e11d48)", boxShadow: "0 4px 12px rgba(244,63,94,0.3)" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function EditModal({ item, fields, onSave, onCancel, accent }) {
  const [form, setForm] = useState({ ...item.payload });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(item.id, form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl p-6 max-w-lg w-full fade-in" style={{ background: "#ffffff", border: `1px solid ${accent}40`, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold" style={{ color: "#0f172a" }}>Edit Record</h3>
          <button
            onClick={onCancel}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:bg-slate-100"
            style={{ color: "#94a3b8" }}
            aria-label="Close"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-medium mb-1" style={{ color: "#64748b" }}>{f.label}</label>
              <textarea
                rows={f.rows || 2}
                value={form[f.key] ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full rounded-xl px-3 py-2 text-sm resize-y"
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  color: "#0f172a",
                  fontFamily: f.mono ? "var(--font-geist-mono, monospace)" : "inherit",
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, boxShadow: `0 4px 12px ${accent}35`, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving && (
              <svg className="animate-spin" width="13" height="13" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
              </svg>
            )}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Collection Table ─────────────────────────────────────────────────────────
function CollectionTable({ type, fields, accent, toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [deleting, setDeleting] = useState(null); // id pending delete
  const [editing, setEditing] = useState(null);   // item being edited
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCollection(type);
      // API may return { points: [...] } or an array
      setItems(Array.isArray(data) ? data : (data.points ?? data.results ?? []));
      setLoaded(true);
    } catch (err) {
      toast("error", err.message);
    } finally {
      setLoading(false);
    }
  }, [type, toast]);

  const handleDelete = async (id) => {
    try {
      await deleteCollectionItem(type, id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast("success", "Record deleted.");
    } catch (err) {
      toast("error", err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleSave = async (id, payload) => {
    try {
      await updateCollectionItem(type, id, payload);
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, payload: { ...i.payload, ...payload } } : i))
      );
      toast("success", "Record updated.");
      setEditing(null);
    } catch (err) {
      toast("error", err.message);
    }
  };

  const primaryField = fields[0].key;
  const filtered = items.filter((item) =>
    search
      ? String(item.payload?.[primaryField] ?? "").toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200"
          style={{
            background: loading ? "#f1f5f9" : `linear-gradient(135deg, ${accent}, ${accent}bb)`,
            boxShadow: loading ? "none" : `0 4px 12px ${accent}35`,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <svg className="animate-spin" width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {loading ? "Loading…" : loaded ? "Refresh" : "Load Collection"}
        </button>

        {loaded && (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search by ${fields[0].label.toLowerCase()}…`}
              className="flex-1 min-w-0 rounded-xl px-3 py-2 text-sm"
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                color: "#0f172a",
                maxWidth: "320px",
              }}
            />
            <span className="text-xs" style={{ color: "#64748b" }}>
              {filtered.length} / {items.length} records
            </span>
          </>
        )}
      </div>

      {/* Empty state */}
      {loaded && items.length === 0 && (
        <div
          className="text-center py-16 rounded-2xl"
          style={{ background: "#ffffff", border: "1px solid #e2e8f0" }}
        >
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm font-medium" style={{ color: "#475569" }}>No records found in this collection.</p>
          <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>Add data via the Training tab first.</p>
        </div>
      )}

      {/* Table */}
      {loaded && items.length > 0 && (
        <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>
                  #
                </th>
                {fields.map((f) => (
                  <th key={f.key} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>
                    {f.label}
                  </th>
                ))}
                <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "#64748b" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                    background: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                  }}
                >
                  <td className="px-4 py-3 text-xs" style={{ color: "#94a3b8" }}>{idx + 1}</td>
                  {fields.map((f) => (
                    <td key={f.key} className="px-4 py-3" style={{ color: "#334155", maxWidth: "280px" }}>
                      <div
                        className="truncate text-xs"
                        title={String(item.payload?.[f.key] ?? "")}
                        style={{ fontFamily: f.mono ? "var(--font-geist-mono, monospace)" : "inherit" }}
                      >
                        {String(item.payload?.[f.key] ?? "—")}
                      </div>
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit */}
                      <button
                        onClick={() => setEditing(item)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                        style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
                      >
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => setDeleting(item.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                        style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.25)" }}
                      >
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {deleting !== null && (
        <DeleteModal
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
      {editing !== null && (
        <EditModal
          item={editing}
          fields={fields}
          accent={accent}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  {
    id: "question-sql",
    label: "Q&A Collection",
    accent: "#6c63ff",
    icon: "❓",
    fields: [
      { key: "question", label: "Question", rows: 2 },
      { key: "sql", label: "SQL", rows: 3, mono: true },
    ],
  },
  {
    id: "ddl",
    label: "DDL Collection",
    accent: "#06b6d4",
    icon: "🗂",
    fields: [
      { key: "table_name", label: "Table Name", rows: 1 },
      { key: "ddl", label: "DDL", rows: 4, mono: true },
      { key: "description", label: "Description", rows: 2 },
    ],
  },
  {
    id: "docs",
    label: "Docs Collection",
    accent: "#10b981",
    icon: "📄",
    fields: [
      { key: "content", label: "Content", rows: 4 },
      { key: "category", label: "Category", rows: 1 },
      { key: "type", label: "Type", rows: 1 },
    ],
  },
  {
    id: "glossary",
    label: "Glossary",
    accent: "#f59e0b",
    icon: "📖",
    fields: [
      { key: "term", label: "Term", rows: 1 },
      { key: "meaning", label: "Meaning", rows: 3 },
      { key: "sql_hint", label: "SQL Hint", rows: 3, mono: true },
      { key: "category", label: "Category", rows: 1 },
    ],
  },
];

// ─── Main Collection Page ─────────────────────────────────────────────────────
export default function CollectionPage() {
  const [activeTab, setActiveTab] = useState("question-sql");
  const [toasts, setToasts] = useState([]);

  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const activeTabData = TABS.find((t) => t.id === activeTab);

  return (
      <div className="min-h-screen flex flex-col" style={{ background: "#f8fafc" }}>
      {/* Header */}
      <header
        className="flex items-center px-6 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid #e2e8f0", background: "#ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div className="ml-10 md:ml-0">
          <h2 className="font-semibold text-base" style={{ color: "#0f172a" }}>Collection</h2>
          <p className="text-xs" style={{ color: "#64748b" }}>View, edit and delete vector store records</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 px-6 pt-5">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === tab.id ? "#ffffff" : "transparent",
              border: activeTab === tab.id
                ? `1px solid ${tab.accent}40`
                : "1px solid transparent",
              color: activeTab === tab.id ? tab.accent : "#64748b",
              boxShadow: activeTab === tab.id ? "0 -1px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        className="flex-1 p-6"
        style={{
          background: "#f8fafc",
          borderTop: `1px solid ${activeTabData?.accent ?? "#6c63ff"}30`,
        }}
      >
        {TABS.map((tab) => (
          <div key={tab.id} style={{ display: activeTab === tab.id ? "block" : "none" }}>
            <CollectionTable
              type={tab.id}
              fields={tab.fields}
              accent={tab.accent}
              toast={addToast}
            />
          </div>
        ))}
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}
