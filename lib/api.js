const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed with status ${res.status}`);
  }
  return res.json();
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export const sendChat = (userMessage) =>
  request("/chat/", { method: "POST", body: JSON.stringify({ userMessage }) });

// ─── Qdrant Search ───────────────────────────────────────────────────────────
export const searchQdrant = (question) =>
  request(`/qdrant/search?question=${encodeURIComponent(question)}`);

// ─── Training ─────────────────────────────────────────────────────────────────
export const trainQuestionSql = (data) =>
  request("/train/question-sql", { method: "POST", body: JSON.stringify(data) });

export const trainQuestionSqlBulk = (records) =>
  request("/train/question-sql/bulk", {
    method: "POST",
    body: JSON.stringify({ records }),
  });

export const trainDdl = (data) =>
  request("/train/ddl", { method: "POST", body: JSON.stringify(data) });

export const trainDdlBulk = (records) =>
  request("/train/ddl/bulk", {
    method: "POST",
    body: JSON.stringify({ records }),
  });

export const trainDocs = (data) =>
  request("/train/docs", { method: "POST", body: JSON.stringify(data) });

export const trainDocsBulk = (records) =>
  request("/train/docs/bulk", {
    method: "POST",
    body: JSON.stringify({ records }),
  });

// ─── Collection Management ───────────────────────────────────────────────────
// type: "question-sql" | "ddl" | "docs"
export const getCollection = (type) => request(`/collection/${type}`);

export const updateCollectionItem = (type, id, data) =>
  request(`/collection/${type}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteCollectionItem = (type, id) =>
  request(`/collection/${type}/${id}`, { method: "DELETE" });

// ─── SQL Execution ───────────────────────────────────────────────────────────
export const executeSQL = (sql) =>
  request("/execute/", { method: "POST", body: JSON.stringify({ sql }) });
