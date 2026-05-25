# TalkToDB — Frontend

A **Next.js 16** dashboard that lets you chat with your database using natural language. Type a question in plain English, and the AI converts it into SQL, executes it, and returns the result — no SQL knowledge required.

---

## Features

| Page | Description |
|------|-------------|
| **Chat** | Conversational interface — ask questions in natural language, get back SQL + results with a typewriter streaming effect |
| **Training** | Teach the AI by adding Question↔SQL pairs, DDL schemas, and documentation — supports single entry and bulk upload |
| **Collection** | Browse, search, edit, and delete all training data stored in the Qdrant vector database |

- Responsive layout with a collapsible sidebar (mobile-friendly)
- SQL code blocks with one-click copy
- Animated typing indicator while the AI is thinking
- Toast notifications for all actions
- Dark-themed code blocks, light UI panels

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **UI:** React 19 + [Tailwind CSS v4](https://tailwindcss.com/)
- **Fonts:** Geist Sans & Geist Mono (via `next/font`)
- **Backend API:** Connects to a Python backend (default: `http://localhost:8000`)

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.jsx          # Root layout with Sidebar
│   ├── page.jsx            # Redirects → /chat
│   ├── chat/page.jsx       # Chat interface
│   ├── training/page.jsx   # Training data input forms
│   └── collection/page.jsx # Collection viewer & editor
├── components/
│   └── Sidebar.jsx         # Navigation sidebar
├── lib/
│   └── api.js              # All backend API calls
└── public/
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- The TalkToDB backend running at `http://localhost:8000`

### Installation

```bash
# Clone the repository
git clone https://github.com/sujalpatel187/talktodb-frontend.git
cd talktodb-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root to point to your backend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

If not set, it defaults to `http://localhost:8000`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## API Endpoints Used

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat/` | Send a natural language question |
| `POST` | `/train/question-sql` | Add a Question↔SQL pair |
| `POST` | `/train/question-sql/bulk` | Bulk add Question↔SQL pairs |
| `POST` | `/train/ddl` | Add a DDL schema |
| `POST` | `/train/ddl/bulk` | Bulk add DDL schemas |
| `POST` | `/train/docs` | Add documentation text |
| `POST` | `/train/docs/bulk` | Bulk add documentation |
| `GET` | `/collection/:type` | List training data (`question-sql`, `ddl`, `docs`) |
| `PUT` | `/collection/:type/:id` | Update a training record |
| `DELETE` | `/collection/:type/:id` | Delete a training record |

---

## License

This project is private and not licensed for public distribution.
