# AI Startup Co-Founder (MVP)

🚀 **Live Website Demo**: [https://ai-startup-co-founder-beta.vercel.app](https://ai-startup-co-founder-beta.vercel.app)

**AI Startup Co-Founder** is an intelligent full-stack application that transforms startup ideas into structured, validated business blueprints.

Instead of generic advice, the AI acts like an experienced co-founder and accelerator mentor (e.g. Y Combinator / Techstars), generating actionable outputs including:
- **Startup Name Candidates & Elevator Pitch**
- **Problem Statement & Solution Edge**
- **Target Customer Personas & TAM / SAM / SOM Market Sizing**
- **Competitor Landscape Matrix** (Strengths & Weaknesses)
- **Unique Selling Proposition (USP) & Revenue Models**
- **9-Box Business Model Canvas (BMC)**
- **MVP Feature Tiers** (Must Have, Nice to Have, Future)
- **Recommended Tech Stack**
- **Go-To-Market & Launch Strategy**
- **Risks & SWOT Analysis**
- **Next 30-Day Week-by-Week Action Roadmap**
- **Investor Pitch & 0-100 Startup Score Dial**

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Zustand, Lucide Icons.
- **Backend**: FastAPI (Python 3.12), Pydantic v2 (strict request/response validation), SQLAlchemy ORM.
- **Database**: PostgreSQL (SQLAlchemy with SQLite fallback for zero-dependency dev/testing).
- **Authentication**: JWT Auth (Access & Refresh Tokens with bcrypt password hashing).
- **AI Engine**: Anthropic Claude API (`claude-sonnet-4-6`) called strictly server-side with single-attempt retry logic on JSON schema mismatch.

---

## 📁 Repository Structure

```
AI-Startup-CoFounder/
├── frontend/
│   ├── app/
│   │   ├── page.tsx                    # Landing Hero Page
│   │   ├── login/page.tsx              # Auth Login Page
│   │   ├── signup/page.tsx             # Auth Signup Page
│   │   ├── dashboard/page.tsx          # Saved Projects Dashboard
│   │   ├── projects/new/page.tsx       # New Startup Wizard Form
│   │   └── projects/[id]/page.tsx      # Saved Project Detail & Analysis History
│   ├── components/
│   │   ├── Navbar.tsx                  # Header Navigation
│   │   └── BlueprintResults.tsx        # Blueprint Visual Dashboard (Score Dial, BMC, SWOT)
│   ├── lib/
│   │   ├── api.ts                      # Central API Client for all backend endpoints
│   │   ├── store.ts                    # Zustand Auth & Project Store
│   │   └── utils.ts                    # Helpers
│   ├── types/
│   │   └── index.ts                    # TypeScript types matching Pydantic backend schemas
│   ├── package.json
│   └── tailwind.config.js
│
├── backend/
│   ├── api/                            # FastAPI Route Handlers (auth, projects, analyses, health)
│   ├── services/                       # AI Service (Claude API client) & Auth Service (JWT/bcrypt)
│   ├── prompts/                        # Versioned system & user prompt templates (blueprint_v1.txt)
│   ├── models/                         # SQLAlchemy DB Models (User, Project, Analysis)
│   ├── schemas/                        # Pydantic schemas (Blueprint, Auth, Project)
│   ├── database/                       # Engine connection & session management
│   ├── tests/                          # Pytest suite
│   ├── scripts/                        # Live E2E smoke test script
│   └── main.py                         # FastAPI App Entry point with CORS middleware
│
├── .github/workflows/
│   └── backend-tests.yml               # GitHub Actions CI workflow
├── .env.example
└── README.md
```

---

## 🔌 API Endpoints Contract

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/health` | Server health check | No |
| `POST` | `/auth/register` | User registration `{email, password, name}` | No |
| `POST` | `/auth/login` | User login `{email, password}` | No |
| `POST` | `/auth/refresh` | Refresh access token `{refresh_token}` | No |
| `POST` | `/auth/logout` | Revoke session | No |
| `GET` | `/auth/me` | Fetch authenticated user | **Yes** |
| `GET` | `/projects` | List current user's projects | **Yes** |
| `POST` | `/projects` | Create new startup project | **Yes** |
| `GET` | `/projects/{id}` | Get project detail | **Yes** |
| `PATCH` | `/projects/{id}` | Update project fields | **Yes** |
| `DELETE` | `/projects/{id}` | Delete project | **Yes** |
| `POST` | `/projects/{id}/analyze` | Trigger AI Blueprint generation | **Yes** |
| `GET` | `/projects/{id}/analyses` | List analyses for project | **Yes** |
| `GET` | `/analyses/{id}` | Get single analysis detail | **Yes** |
| `GET` | `/analyses/{id}/report` | Download Markdown report file (`?format=md`) | **Yes** |

---

## ⚡ Quickstart (Local Development)

### 1. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv .venv
# Activate virtual environment (Windows / Linux)
.venv\Scripts\activate   # Windows
source .venv/bin/activate # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env

# Run FastAPI server
uvicorn backend.main:app --reload --port 8000
```

### 2. Run Backend Pytest Suite & E2E Smoke Test
```bash
# Run pytest unit & integration tests
pytest backend/tests -v

# Run E2E live smoke test script (with server running on port 8000)
python backend/scripts/smoke_test.py
```

### 3. Frontend Setup
```bash
cd frontend
# Install npm dependencies
npm install

# Start Next.js dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License
MIT License.
