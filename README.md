# TalkToDB — Frontend Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/TypeScript-6.0.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

An elegant, highly interactive, and premium **Next.js 16** administration and chat dashboard. It provides business users with a conversational chat interface to converse with PostgreSQL databases using natural language, and offers developers tools to inspect, inject, and maintain training context within the underlying vector search engine (Qdrant).

---

## ✨ Features

- **🚀 Smart AI Chat Workspace**: Ask plain English questions and watch the AI formulate real-time SQL queries with typewriter streaming effects and beautiful interactive results tables.
- **📚 Rich Knowledge Ingestion (Training)**: Clean forms supporting custom Question↔SQL mapping, raw DDL schemas, and freeform documentation with supports for both direct single entry and bulk JSON uploads.
- **🗃️ Vector Collection Manager**: Browse, filter, search, modify, and delete training records currently vectorized inside Qdrant.
- **🎨 Premium Visual Aesthetics**:
  - Full-screen fluid layout with a collapsible, responsive sidebar.
  - Gorgeous dark-themed syntax highlights for SQL code blocks.
  - Sleek micro-interactions, responsive states, and intuitive toast notification popups.
  - Custom animations (typing indicators, load states, state transitions).

---

## 📂 Project Structure

```
frontend/
├── app/
│   ├── layout.jsx          # Root application shell, state providers, and Sidebar navigation
│   ├── page.jsx            # Dynamic root routing (Redirects to /chat)
│   │
│   ├── chat/
│   │   └── page.jsx        # Rich conversational workspace with live SQL execution
│   │
│   ├── training/
│   │   └── page.jsx        # Data insertion hub (Forms & validation for Q&A, DDL, Docs)
│   │
│   └── collection/
│       └── page.jsx        # Database browser with edit and delete capabilities
│
├── components/
│   └── Sidebar.jsx         # Highly interactive navigation menu
│
├── lib/
│   └── api.js              # Elegant Axios/Fetch-based api connector abstraction layer
│
├── public/                 # Static graphical assets & icon mappings
├── tsconfig.json           # Fully structured TypeScript typing rules
└── tailwind.config.mjs     # Next-gen Tailwind v4 build system config
```

---

## ⚙️ Tech Stack & Design System

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) for optimized static generation, fast builds, and modern UI routing patterns.
- **UI Core**: [React 19](https://react.dev/) using advanced compiler capabilities (`babel-plugin-react-compiler`).
- **Styling Engine**: [Tailwind CSS v4](https://tailwindcss.com/) for fluid, modern utility classes and rapid premium design deployment.
- **Typography**: Integrated `Geist Sans` and `Geist Mono` typography via `next/font` for high-end digital styling.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18** or newer installed on your machine.
- Running instance of **TalkToDB Backend** (usually on `http://localhost:8000`).

### 1. Installation

Clone the repository and install all dependencies:

```bash
# Clone the repository
git clone https://github.com/sujalpatel187/talktodb-frontend.git
cd talktodb-frontend

# Install dependencies using npm
npm install
```

### 2. Configure Environment

Create a `.env.local` file inside the root directory to define the backend's target base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

> If not specified, the system will fall back to `http://localhost:8000` automatically.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser to explore.

### 4. Build for Production

To compile optimized production assets and serve:

```bash
# Build the application
npm run build

# Start the node server
npm run start
```

---

## 📡 API Integrations Used

The frontend interacts with the FastAPI backend across three main modules:

| Feature Section | API Path | Method | Description |
|:---|:---|:---|:---|
| **Chat Hub** | `/chat/` | `POST` | Send natural language questions and fetch generated SQL and database results. |
| **Ingestion** | `/train/question-sql` | `POST` | Store a custom user-question to SQL pair template. |
| **Ingestion** | `/train/ddl` | `POST` | Ingest physical layout schemas. |
| **Ingestion** | `/train/docs` | `POST` | Supplement context with external documentation. |
| **Vector DB** | `/collection/:type` | `GET` | Retrieve and preview indexed payload vectors. |
| **Vector DB** | `/collection/:type/:id` | `PUT` | Mutate and update existing vectors. |
| **Vector DB** | `/collection/:type/:id` | `DELETE` | Delete vector schema keys. |

---

## 🛡️ License

This project is proprietary and confidential. Commercial or public usage, sharing, or distribution without consent is strictly prohibited.
