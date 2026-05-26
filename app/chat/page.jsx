"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { sendChat } from "@/lib/api";

// ─── Results Table ────────────────────────────────────────────────────────────
function ResultsTable({ columns, rows, rowCount, onStreamTick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleRowCount, setVisibleRowCount] = useState(0);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(rows.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  useEffect(() => {
    setVisibleRowCount(0);
    if (currentRows.length === 0) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= currentRows.length) {
        setVisibleRowCount(currentRows.length);
        clearInterval(interval);
      } else {
        setVisibleRowCount(i);
      }
      onStreamTick?.();
    }, 60); // 60ms per row for a sleek cascading stream
    return () => clearInterval(interval);
  }, [currentPage, rows]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    onStreamTick?.();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="mt-3 rounded-xl overflow-hidden w-full"
      style={{ border: "1px solid rgba(16,185,129,0.3)", maxWidth: "100%" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: "rgba(16,185,129,0.08)", borderBottom: "1px solid rgba(16,185,129,0.2)" }}
      >
        <div className="flex items-center gap-2">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="text-xs font-semibold" style={{ color: "#10b981" }}>
            Query Results
          </span>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}
        >
          {rowCount} row{rowCount !== 1 ? "s" : ""}
        </span>
      </div>
      {/* Table */}
      <div style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto", width: "100%" }}>
        <table className="w-full text-xs" style={{ borderCollapse: "collapse", tableLayout: "auto" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {columns.map((col, i) => {
                const formattedCol = col
                  ? col
                      .split("_")
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")
                  : "";
                return (
                  <th
                    key={i}
                    className="text-left px-3 py-2 font-semibold whitespace-nowrap"
                    style={{ color: "#334155", borderBottom: "2px solid #e2e8f0", position: "sticky", top: 0, background: "#f8fafc", zIndex: 1 }}
                  >
                    {formattedCol}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {currentRows.slice(0, visibleRowCount).map((row, ri) => (
              <tr
                key={ri}
                className="fade-in"
                style={{
                  background: ri % 2 === 0 ? "#ffffff" : "#f8fafc",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-3 py-2 whitespace-nowrap"
                    style={{ color: cell === null ? "#94a3b8" : "#0f172a", fontStyle: cell === null ? "italic" : "normal" }}
                  >
                    {cell === null ? "NULL" : String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {rows.length > 0 && (
        <div
          className="flex flex-col sm:flex-row items-center justify-between px-4 py-2.5 gap-2"
          style={{ background: "#f8fafc", borderTop: "1px solid rgba(16,185,129,0.2)" }}
        >
          <div className="text-[11px] font-medium" style={{ color: "#64748b" }}>
            Showing {rows.length === 0 ? 0 : indexOfFirstRow + 1} to {Math.min(indexOfLastRow, rows.length)} of {rows.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-md text-[11px] font-semibold transition-all duration-200"
              style={{
                background: currentPage === 1 ? "#f1f5f9" : "#ffffff",
                color: currentPage === 1 ? "#94a3b8" : "#334155",
                border: "1px solid #e2e8f0",
                cursor: currentPage === 1 ? "not-allowed" : "pointer"
              }}
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded-md text-[11px] font-semibold transition-all duration-200"
              style={{
                background: currentPage === 1 ? "#f1f5f9" : "#ffffff",
                color: currentPage === 1 ? "#94a3b8" : "#334155",
                border: "1px solid #e2e8f0",
                cursor: currentPage === 1 ? "not-allowed" : "pointer"
              }}
            >
              Previous
            </button>
            <span
              className="px-2 py-1 rounded-md text-[11px] font-bold"
              style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded-md text-[11px] font-semibold transition-all duration-200"
              style={{
                background: currentPage === totalPages ? "#f1f5f9" : "#ffffff",
                color: currentPage === totalPages ? "#94a3b8" : "#334155",
                border: "1px solid #e2e8f0",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer"
              }}
            >
              Next
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded-md text-[11px] font-semibold transition-all duration-200"
              style={{
                background: currentPage === totalPages ? "#f1f5f9" : "#ffffff",
                color: currentPage === totalPages ? "#94a3b8" : "#334155",
                border: "1px solid #e2e8f0",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer"
              }}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SQL Code Block ───────────────────────────────────────────────────────────
function SqlBlock({ sql, streaming = false, onStreamTick, onStreamComplete }) {
  const [copied, setCopied] = useState(false);
  const [displayedSql, setDisplayedSql] = useState(streaming ? "" : sql);
  const [sqlCursor, setSqlCursor] = useState(streaming);


  useEffect(() => {
    if (!streaming || !sql) return;
    let i = 0;
    const CHARS = 1;
    const MS = 18; // ms per char
    const timer = setInterval(() => {
      i += CHARS;
      if (i >= sql.length) {
        setDisplayedSql(sql);
        setSqlCursor(false);
        clearInterval(timer);
        onStreamTick?.();
        onStreamComplete?.();
      } else {
        setDisplayedSql(sql.slice(0, i));
        onStreamTick?.();
      }
    }, MS);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = useCallback(() => {
    navigator.clipboard.writeText(sql).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [sql]);


  return (
      <div
        className="mt-3 rounded-xl overflow-hidden w-full max-w-full"
        style={{ background: "#0d1117", border: "1px solid rgba(108,99,255,0.3)", maxWidth: "100%" }}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ background: "rgba(108,99,255,0.1)", borderBottom: "1px solid rgba(108,99,255,0.2)" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs font-semibold ml-1" style={{ color: "#6c63ff" }}>
              Generated SQL
            </span>
          </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg transition-all duration-200"
          style={{
            background: copied ? "rgba(16,185,129,0.2)" : "rgba(108,99,255,0.15)",
            color: copied ? "#10b981" : "#a78bfa",
            border: `1px solid ${copied ? "rgba(16,185,129,0.4)" : "rgba(108,99,255,0.3)"}`,
          }}
        >
          {copied ? (
            <>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
        </div>
        {/* Code */}
        <pre
          className="p-4 overflow-x-auto text-sm leading-relaxed w-full max-w-full"
          style={{ color: "#c9d1d9", fontFamily: "var(--font-geist-mono, monospace)", margin: 0, maxWidth: "100%", overflowX: "auto" }}
        >
          <code>
            {displayedSql}
            {sqlCursor && (
              <span
                style={{
                  display: "inline-block",
                  width: "2px",
                  height: "1em",
                  background: "#6c63ff",
                  marginLeft: "1px",
                  verticalAlign: "text-bottom",
                  animation: "blink-cursor 0.7s steps(1) infinite",
                }}
              />
            )}
          </code>
        </pre>
      </div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4 fade-in">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
        style={{ background: "linear-gradient(135deg, #6c63ff, #06b6d4)" }}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div
        className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
        style={{ background: "#ede9fe", border: "1px solid #ddd6fe" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="dot-bounce w-2 h-2 rounded-full"
            style={{ background: "#6c63ff", animationDelay: `${i * 0.18}s`, display: "inline-block" }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Single Message ───────────────────────────────────────────────────────────
function ChatMessage({ msg, onStreamTick }) {
  const isUser = msg.role === "user";

  // Typewriter streaming effect for assistant messages
  const [displayed, setDisplayed] = useState(
    msg.streaming ? "" : (msg.content || "")
  );
  const [showSql, setShowSql] = useState(!msg.streaming);
  const [cursor, setCursor] = useState(!!msg.streaming && !!msg.content);
  const [sqlFinished, setSqlFinished] = useState(!msg.streaming || !msg.sql);

  useEffect(() => {
    if (!msg.streaming || !msg.content) return;
    const content = msg.content;
    let i = 0;
    const CHARS = 1; // chars revealed per tick
    const MS = 30;   // ms per tick ≈ 33 chars/sec
    const timer = setInterval(() => {
      i += CHARS;
      if (i >= content.length) {
        setDisplayed(content);
        setCursor(false);
        setShowSql(true);
        clearInterval(timer);
        onStreamTick?.();
      } else {
        setDisplayed(content.slice(0, i));
        onStreamTick?.();
      }
    }, MS);
    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isUser) {
    return (
      <div className="flex justify-end mb-4 fade-in">
        <div className="max-w-sm sm:max-w-md">
          <div
            className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-white leading-relaxed"
            style={{ background: "linear-gradient(135deg, #6c63ff 0%, #8b5cf6 100%)", boxShadow: "0 4px 20px rgba(108,99,255,0.25)" }}
          >
            {msg.content}
          </div>
          <p className="text-xs mt-1 text-right pr-1" style={{ color: "#334155" }} suppressHydrationWarning>
            {msg.time}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-4 fade-in">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
        style={{ background: "linear-gradient(135deg, #6c63ff, #06b6d4)" }}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0 max-w-full overflow-hidden">
        <div
          className="rounded-2xl rounded-tl-sm p-4 text-sm leading-relaxed max-w-full overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {msg.error ? (
            <div
              className="flex items-start gap-2 rounded-lg p-3"
              style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)", color: "#be123c" }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{msg.error}</span>
            </div>
          ) : (
            <>
              <p style={{ color: "#334155" }}>
                {displayed}
                {cursor && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "2px",
                      height: "1em",
                      background: "#6c63ff",
                      marginLeft: "2px",
                      verticalAlign: "text-bottom",
                      animation: "blink-cursor 0.7s steps(1) infinite",
                    }}
                  />
                )}
              </p>
              {showSql && msg.sql && (
                <div style={{ animation: "fadeInUp 0.35s ease forwards" }}>
                  <SqlBlock
                    sql={msg.sql}
                    streaming={!!msg.streaming}
                    onStreamTick={onStreamTick}
                    onStreamComplete={() => setSqlFinished(true)}
                  />
                </div>
              )}
              {showSql && sqlFinished && msg.columns && msg.columns.length > 0 && (
                <div style={{ animation: "fadeInUp 0.35s ease forwards" }}>
                  <ResultsTable
                    columns={msg.columns}
                    rows={msg.rows}
                    rowCount={msg.rowCount}
                    onStreamTick={onStreamTick}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <p className="text-xs mt-1 pl-1" style={{ color: "#334155" }} suppressHydrationWarning>
          {msg.time}
        </p>
      </div>
    </div>
  );
}

// ─── Example prompts ──────────────────────────────────────────────────────────
const EXAMPLES = [
  "How many PACS are registered in Karnataka?",
  "Show me the top 10 societies by member count",
  "What is the total loan amount disbursed this year?",
  "List all districts with more than 50 dairy societies",
];

// ─── Main Chat Page ───────────────────────────────────────────────────────────
export default function ChatPage() {
  const WELCOME = {
    role: "assistant",
    content:
      "Hello! I'm TalkToDB — ask me a natural language question about your database and I'll generate the SQL for you.",
    time: "",
  };

  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Stamp the welcome message time only on the client to avoid SSR/client mismatch
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m, i) =>
        i === 0 && m.time === ""
          ? { ...m, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
          : m
      )
    );
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  const handleSend = useCallback(
    async (text) => {
      const msg = (text || input).trim();
      if (!msg || loading) return;
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      setMessages((prev) => [...prev, { role: "user", content: msg, time }]);
      setInput("");
      setLoading(true);

      try {
        const data = await sendChat(msg);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.error ? "" : (data.userMessage || "Query processed successfully."),
            sql: data.generatedSQL || null,
            columns: data.columns || [],
            rows: data.rows || [],
            rowCount: data.rowCount || 0,
            error: data.error || null,
            streaming: !data.error,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "",
            error: err.message || "Failed to reach backend. Is it running on port 8000?",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [input, loading]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared. Ask me a new question!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  const isEmpty = messages.length <= 1;

  return (
    <div className="flex flex-col h-screen max-w-full overflow-hidden" style={{ background: "#f8fafc" }}>
      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{
          borderBottom: "1px solid #e2e8f0",
          background: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        <div className="ml-10 md:ml-0">
          <h2 className="font-semibold text-base" style={{ color: "#0f172a" }}>Chat</h2>
          <p className="text-xs" style={{ color: "#475569" }}>
            {messages.length - 1} message{messages.length - 1 !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
          style={{ background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}
        >
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear
        </button>
      </header>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-32 sm:px-6 max-w-full overflow-x-hidden">
        {messages.map((msg, i) => (
          <ChatMessage key={i} msg={msg} onStreamTick={scrollToBottom} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* ── Example prompts (shown when chat is fresh) ── */}
      {isEmpty && !loading && (
        <div className="px-4 sm:px-6 pb-3">
          <p className="text-xs mb-2 font-medium" style={{ color: "#64748b" }}>
            Try an example:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => handleSend(ex)}
                className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 hover:opacity-80"
                style={{
                  background: "#f0f0ff",
                  border: "1px solid rgba(108,99,255,0.3)",
                  color: "#6c63ff",
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div
        className="flex-shrink-0 px-4 sm:px-6 pt-3 pb-4"
        style={{ borderTop: "1px solid #e2e8f0", background: "#ffffff", boxShadow: "0 -1px 3px rgba(0,0,0,0.04)" }}
      >
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a question about your database… (e.g. How many PACS are in Karnataka?)"
            rows={2}
            disabled={loading}
            className="flex-1 resize-none rounded-xl px-4 py-3 text-sm leading-relaxed"
            style={{
              background: "#f8fafc",
              border: "1px solid #d1d5db",
              color: "#0f172a",
              fontFamily: "inherit",
              caretColor: "#6c63ff",
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white flex-shrink-0 transition-all duration-200"
            style={{
              background:
                loading || !input.trim()
                  ? "rgba(108,99,255,0.25)"
                  : "linear-gradient(135deg, #6c63ff 0%, #8b5cf6 100%)",
              boxShadow: loading || !input.trim() ? "none" : "0 4px 15px rgba(108,99,255,0.35)",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              minWidth: "80px",
            }}
          >
            {loading ? (
              <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
            {loading ? "…" : "Send"}
          </button>
        </form>
        <p className="text-xs mt-2" style={{ color: "#94a3b8" }}>
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
