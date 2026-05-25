"use client";

import { useState } from "react";
import {
  trainQuestionSql, trainQuestionSqlBulk,
  trainDdl, trainDdlBulk,
  trainDocs, trainDocsBulk,
} from "@/lib/api";

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
          {t.type === "success" ? (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} className="flex-shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="flex-shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Card({ title, subtitle, accent, children }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "#ffffff",
        border: `1px solid ${accent}30`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div className="mb-4">
        <h3 className="font-semibold text-sm" style={{ color: "#0f172a" }}>{title}</h3>
        {subtitle && <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ─── Field components ─────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "#64748b" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  color: "#0f172a",
  borderRadius: "10px",
  padding: "10px 14px",
  fontSize: "13px",
  width: "100%",
  fontFamily: "inherit",
};

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  fontFamily: "var(--font-geist-mono, monospace)",
};

// ─── Submit button ────────────────────────────────────────────────────────────
function SubmitBtn({ loading, label, accent }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
      style={{
        background: loading ? "#f1f5f9" : `linear-gradient(135deg, ${accent} 0%, ${accent}bb 100%)`,
        boxShadow: loading ? "none" : `0 4px 15px ${accent}35`,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? (
        <svg className="animate-spin" width="15" height="15" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke={loading ? "#94a3b8" : "currentColor"} strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      )}
      {loading ? "Saving…" : label}
    </button>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "qa", label: "Q&A Pairs", accent: "#6c63ff", icon: "❓" },
  { id: "ddl", label: "DDL Schemas", accent: "#06b6d4", icon: "🗂" },
  { id: "docs", label: "Documentation", accent: "#10b981", icon: "📄" },
];

// ─── Q&A Training Tab ─────────────────────────────────────────────────────────
function QATab({ toast }) {
  const [single, setSingle] = useState({ question: "", sql: "" });
  const [bulk, setBulk] = useState("");
  const [loadSingle, setLoadSingle] = useState(false);
  const [loadBulk, setLoadBulk] = useState(false);
  const ACCENT = "#6c63ff";

  const handleSingle = async (e) => {
    e.preventDefault();
    if (!single.question.trim() || !single.sql.trim()) return;
    setLoadSingle(true);
    try {
      await trainQuestionSql(single);
      toast("success", "Q&A pair saved successfully!");
      setSingle({ question: "", sql: "" });
    } catch (err) {
      toast("error", err.message);
    } finally {
      setLoadSingle(false);
    }
  };

  const handleBulk = async (e) => {
    e.preventDefault();
    let records;
    try {
      records = JSON.parse(bulk);
      if (!Array.isArray(records)) throw new Error("Must be a JSON array");
    } catch {
      toast("error", "Invalid JSON — must be an array of { question, sql } objects.");
      return;
    }
    setLoadBulk(true);
    try {
      await trainQuestionSqlBulk(records);
      toast("success", `${records.length} Q&A record(s) saved!`);
      setBulk("");
    } catch (err) {
      toast("error", err.message);
    } finally {
      setLoadBulk(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Single */}
      <Card title="Add Single Q&A Pair" subtitle="One question → SQL mapping" accent={ACCENT}>
        <form onSubmit={handleSingle} className="space-y-3">
          <Field label="Natural Language Question">
            <input
              style={inputStyle}
              value={single.question}
              onChange={(e) => setSingle((s) => ({ ...s, question: e.target.value }))}
              placeholder="e.g. How many PACS are in Karnataka?"
              required
            />
          </Field>
          <Field label="SQL Query">
            <textarea
              style={{ ...textareaStyle, minHeight: "100px" }}
              value={single.sql}
              onChange={(e) => setSingle((s) => ({ ...s, sql: e.target.value }))}
              placeholder={"SELECT COUNT(*) FROM pacs WHERE state = 'Karnataka';"}
              required
            />
          </Field>
          <SubmitBtn loading={loadSingle} label="Save Q&A Pair" accent={ACCENT} />
        </form>
      </Card>

      {/* Bulk */}
      <Card title="Bulk Upload Q&A" subtitle="Paste a JSON array of records" accent={ACCENT}>
        <form onSubmit={handleBulk} className="space-y-3">
          <Field label="JSON Array">
            <textarea
              style={{ ...textareaStyle, minHeight: "172px" }}
              value={bulk}
              onChange={(e) => setBulk(e.target.value)}
              placeholder={`[\n  { "question": "Total PACS count", "sql": "SELECT COUNT(*) FROM pacs" },\n  { "question": "State-wise PACS", "sql": "SELECT state, COUNT(*) FROM pacs GROUP BY state" }\n]`}
              required
            />
          </Field>
          <SubmitBtn loading={loadBulk} label="Bulk Upload" accent={ACCENT} />
        </form>
      </Card>
    </div>
  );
}

// ─── DDL Training Tab ─────────────────────────────────────────────────────────
function DDLTab({ toast }) {
  const [single, setSingle] = useState({ table_name: "", ddl: "", description: "" });
  const [bulk, setBulk] = useState("");
  const [loadSingle, setLoadSingle] = useState(false);
  const [loadBulk, setLoadBulk] = useState(false);
  const ACCENT = "#06b6d4";

  const handleSingle = async (e) => {
    e.preventDefault();
    if (!single.table_name.trim() || !single.ddl.trim()) return;
    setLoadSingle(true);
    try {
      await trainDdl(single);
      toast("success", "DDL schema saved successfully!");
      setSingle({ table_name: "", ddl: "", description: "" });
    } catch (err) {
      toast("error", err.message);
    } finally {
      setLoadSingle(false);
    }
  };

  const handleBulk = async (e) => {
    e.preventDefault();
    let records;
    try {
      records = JSON.parse(bulk);
      if (!Array.isArray(records)) throw new Error("Must be a JSON array");
    } catch {
      toast("error", "Invalid JSON — must be an array of { table_name, ddl, description } objects.");
      return;
    }
    setLoadBulk(true);
    try {
      await trainDdlBulk(records);
      toast("success", `${records.length} DDL record(s) saved!`);
      setBulk("");
    } catch (err) {
      toast("error", err.message);
    } finally {
      setLoadBulk(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Single */}
      <Card title="Add Single DDL Schema" subtitle="One table schema definition" accent={ACCENT}>
        <form onSubmit={handleSingle} className="space-y-3">
          <Field label="Table Name">
            <input
              style={inputStyle}
              value={single.table_name}
              onChange={(e) => setSingle((s) => ({ ...s, table_name: e.target.value }))}
              placeholder="e.g. pacs"
              required
            />
          </Field>
          <Field label="DDL Statement">
            <textarea
              style={{ ...textareaStyle, minHeight: "100px" }}
              value={single.ddl}
              onChange={(e) => setSingle((s) => ({ ...s, ddl: e.target.value }))}
              placeholder={"CREATE TABLE pacs (\n  id SERIAL PRIMARY KEY,\n  state VARCHAR(100),\n  district VARCHAR(100)\n);"}
              required
            />
          </Field>
          <Field label="Description (optional)">
            <input
              style={inputStyle}
              value={single.description}
              onChange={(e) => setSingle((s) => ({ ...s, description: e.target.value }))}
              placeholder="Brief description of this table"
            />
          </Field>
          <SubmitBtn loading={loadSingle} label="Save DDL Schema" accent={ACCENT} />
        </form>
      </Card>

      {/* Bulk */}
      <Card title="Bulk Upload DDL" subtitle="Paste a JSON array of table schemas" accent={ACCENT}>
        <form onSubmit={handleBulk} className="space-y-3">
          <Field label="JSON Array">
            <textarea
              style={{ ...textareaStyle, minHeight: "210px" }}
              value={bulk}
              onChange={(e) => setBulk(e.target.value)}
              placeholder={`[\n  {\n    "table_name": "pacs",\n    "ddl": "CREATE TABLE pacs (...)",\n    "description": "Primary Agricultural Credit Societies"\n  }\n]`}
              required
            />
          </Field>
          <SubmitBtn loading={loadBulk} label="Bulk Upload" accent={ACCENT} />
        </form>
      </Card>
    </div>
  );
}

// ─── Docs Training Tab ────────────────────────────────────────────────────────
function DocsTab({ toast }) {
  const [single, setSingle] = useState({ content: "", category: "", type: "" });
  const [bulk, setBulk] = useState("");
  const [loadSingle, setLoadSingle] = useState(false);
  const [loadBulk, setLoadBulk] = useState(false);
  const ACCENT = "#10b981";

  const handleSingle = async (e) => {
    e.preventDefault();
    if (!single.content.trim()) return;
    setLoadSingle(true);
    try {
      await trainDocs(single);
      toast("success", "Documentation record saved!");
      setSingle({ content: "", category: "", type: "" });
    } catch (err) {
      toast("error", err.message);
    } finally {
      setLoadSingle(false);
    }
  };

  const handleBulk = async (e) => {
    e.preventDefault();
    let records;
    try {
      records = JSON.parse(bulk);
      if (!Array.isArray(records)) throw new Error("Must be a JSON array");
    } catch {
      toast("error", "Invalid JSON — must be an array of { content, category, type } objects.");
      return;
    }
    setLoadBulk(true);
    try {
      await trainDocsBulk(records);
      toast("success", `${records.length} documentation record(s) saved!`);
      setBulk("");
    } catch (err) {
      toast("error", err.message);
    } finally {
      setLoadBulk(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {/* Single */}
      <Card title="Add Documentation" subtitle="Single documentation chunk" accent={ACCENT}>
        <form onSubmit={handleSingle} className="space-y-3">
          <Field label="Content">
            <textarea
              style={{ ...textareaStyle, minHeight: "110px" }}
              value={single.content}
              onChange={(e) => setSingle((s) => ({ ...s, content: e.target.value }))}
              placeholder="The PACS table stores primary agricultural credit societies across all states…"
              required
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category (optional)">
              <input
                style={inputStyle}
                value={single.category}
                onChange={(e) => setSingle((s) => ({ ...s, category: e.target.value }))}
                placeholder="e.g. overview"
              />
            </Field>
            <Field label="Type (optional)">
              <input
                style={inputStyle}
                value={single.type}
                onChange={(e) => setSingle((s) => ({ ...s, type: e.target.value }))}
                placeholder="e.g. schema_info"
              />
            </Field>
          </div>
          <SubmitBtn loading={loadSingle} label="Save Doc" accent={ACCENT} />
        </form>
      </Card>

      {/* Bulk */}
      <Card title="Bulk Upload Docs" subtitle="Paste a JSON array of documentation chunks" accent={ACCENT}>
        <form onSubmit={handleBulk} className="space-y-3">
          <Field label="JSON Array">
            <textarea
              style={{ ...textareaStyle, minHeight: "210px" }}
              value={bulk}
              onChange={(e) => setBulk(e.target.value)}
              placeholder={`[\n  {\n    "content": "The pacs table contains...",\n    "category": "overview",\n    "type": "schema_info"\n  }\n]`}
              required
            />
          </Field>
          <SubmitBtn loading={loadBulk} label="Bulk Upload" accent={ACCENT} />
        </form>
      </Card>
    </div>
  );
}

// ─── Main Training Page ───────────────────────────────────────────────────────
export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState("qa");
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
          <h2 className="font-semibold text-base" style={{ color: "#0f172a" }}>Training</h2>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Add data to vector collections
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div
        className="flex gap-1 px-6 pt-5 pb-0"
        role="tablist"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === tab.id ? "#ffffff" : "transparent",
              border: activeTab === tab.id
                ? `1px solid ${tab.accent}40`
                : "1px solid transparent",
              borderBottom: activeTab === tab.id ? "1px solid #ffffff" : "1px solid transparent",
              color: activeTab === tab.id ? tab.accent : "#64748b",
              boxShadow: activeTab === tab.id ? "0 -1px 4px rgba(0,0,0,0.05)" : "none",
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        className="flex-1 p-6"
        style={{
          background: "#f8fafc",
          borderTop: `1px solid ${activeTabData?.accent ?? "#6c63ff"}30`,
        }}
      >
        {activeTab === "qa" && <QATab toast={addToast} />}
        {activeTab === "ddl" && <DDLTab toast={addToast} />}
        {activeTab === "docs" && <DocsTab toast={addToast} />}
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}
