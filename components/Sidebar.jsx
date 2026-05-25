"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  {
    href: "/chat",
    label: "Chat",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    accent: "#6c63ff",
    bg: "rgba(108,99,255,0.12)",
  },
  {
    href: "/training",
    label: "Training",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    accent: "#06b6d4",
    bg: "rgba(6,182,212,0.12)",
  },
  {
    href: "/collection",
    label: "Collection",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    accent: "#10b981",
    bg: "rgba(16,185,129,0.12)",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle sidebar"
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
        style={{ background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.35)", color: "#6c63ff" }}
      >
        {open ? (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={close}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 w-64 flex flex-col transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{
          background: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          boxShadow: "2px 0 12px rgba(0,0,0,0.06)",
        }}
      >
        {/* Logo */}
        <div className="px-5 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #6c63ff 0%, #06b6d4 100%)" }}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <div>
              <h1
                className="font-bold text-base leading-tight"
                style={{
                  background: "linear-gradient(135deg, #a78bfa, #67e8f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                TalkToDB
              </h1>
              <p className="text-xs" style={{ color: "#94a3b8" }}>NL → SQL Dashboard</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-4 h-px mb-3" style={{ background: "#f1f5f9" }} />

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV.map(({ href, label, icon, accent, bg }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={close}
                className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group"
                style={{
                  background: active ? bg : "transparent",
                  border: `1px solid ${active ? accent + "40" : "transparent"}`,
                  color: active ? accent : "#475569",
                }}
              >
                <span
                  className="transition-colors duration-200"
                  style={{ color: active ? accent : "#94a3b8" }}
                >
                  {icon}
                </span>
                <span className="font-medium text-sm">{label}</span>
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: accent }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Stats / footer card */}
        <div className="p-3 mb-2">
          <div
            className="rounded-xl p-3 space-y-2"
            style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#94a3b8" }}>
              Backend
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs" style={{ color: "#64748b" }}>localhost:8000</span>
            </div>
            <div className="text-xs" style={{ color: "#94a3b8" }}>FastAPI · vLLM · Qdrant</div>
          </div>
        </div>
      </aside>
    </>
  );
}
