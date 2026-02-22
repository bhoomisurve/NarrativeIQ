# NarrativeIQ 

> AI-powered writing intelligence — enhance scripts, analyze consistency, track characters, and map narratives.

NarrativeIQ is a full-stack SaaS platform that gives writers, screenwriters, and storytellers a suite of AI tools to craft better narratives. It combines a React + TypeScript frontend with a Python FastAPI backend, Supabase for auth and storage, and Stripe for payments.

---

## Features

| Feature | Description | Credits |
|---|---|---|
| **Persona Enhancement** | Rewrite text in 6 distinct voices — Technical, Business, Finance, Simplified, Comedian, Poet | 1 |
| **Consistency Analysis** | Detect plot holes, timeline errors, character contradictions, and tone shifts | 2 |
| **Character Evolution** | Track a character's emotional arc and behavioral changes across the narrative | 2 |
| **Narrative Mindmap** | Extract characters, locations, themes & relationships as an interactive knowledge graph | 2 |

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui** for components
- **Framer Motion** for animations
- **React Router** for navigation
- **Supabase JS** for auth (JWT)
- **Stripe.js** for payments

### Backend
- **FastAPI** (Python 3.10+) — async, fully typed
- **LiteLLM** — unified LLM gateway (provider-agnostic)
- **spaCy** — local NER for entity extraction in the mindmap pipeline
- **Supabase** — PostgreSQL database + Auth + Row Level Security
- **Stripe** — payment processing with webhook support

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, router registration
│   ├── config.py            # Environment settings, credit costs, pricing
│   ├── middleware/
│   │   └── auth.py          # Supabase JWT verification dependency
│   ├── db/
│   │   └── supabase.py      # Credit ops, analysis logging, Supabase client
│   ├── models/
│   │   └── schemas.py       # Pydantic request/response models
│   ├── routers/
│   │   ├── enhance.py       # POST /enhance — streaming SSE persona rewrite
│   │   ├── consistency.py   # POST /consistency — plot/timeline analysis
│   │   ├── evolution.py     # POST /evolution — character arc tracking
│   │   ├── mindmap.py       # POST /mindmap — entity graph generation
│   │   └── credits.py       # GET/POST /credits — balance, Stripe, webhooks
│   └── services/
│       ├── llm.py           # LLM calls (enhance, stream, generic run_llm)
│       ├── graph.py         # Mindmap pipeline: spaCy → LLM → graph
│       ├── nlp.py           # spaCy NER + heuristic theme extraction
│       └── diff.py          # Word-level diff for enhance results

frontend/
├── src/
│   ├── pages/
│   │   ├── Index.tsx        # Landing page with feature cards
│   │   ├── Dashboard.tsx    # Main workspace
│   │   ├── Auth.tsx         # Login / signup
│   │   └── Credits.tsx      # Credit purchase page
│   ├── components/
│   │   ├── DiffView.tsx     # Highlighted before/after diff
│   │   └── AnalysisPanel.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Supabase session + user state
│   └── lib/
│       └── api.ts           # All API calls to FastAPI backend
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

Create a `.env` file:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# LLM
LLM_PROVIDER=gemini/gemini-1.5-flash
LLM_API_KEY=your-api-key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
FRONTEND_URL=http://localhost:5173
APP_ENV=development
```

Run the server:

```bash
uvicorn app.main:app --reload
```

API docs available at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

```bash
npm run dev
```

---


---

## Credit Packs

| Pack | Credits | Price |
|---|---|---|
| Starter | 20 | ₹99 |
| Pro | 60 | ₹249 |
| Unlimited | 150 | ₹499 |

---

## API Overview

All endpoints require a `Authorization: Bearer <supabase_jwt>` header.

```
GET  /credits                    → current balance
POST /credits/create-order       → create Stripe PaymentIntent
POST /credits/verify-payment     → verify & credit after payment
POST /credits/webhook            → Stripe webhook handler

POST /enhance                    → persona rewrite (SSE streaming)
POST /consistency                → consistency analysis
POST /evolution                  → character arc tracking
POST /mindmap                    → narrative knowledge graph
```

---

