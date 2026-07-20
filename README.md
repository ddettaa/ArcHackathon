# ArcGent

**If This, Then Pay.** Autonomous agents that listen to real-world signals — GitHub merges, API calls, flight delays — and automatically pay people with USDC based on AI reasoning.

Built for [Arc Agentic Economy Hackathon](https://arc.network). Runs on **Circle Agent Stack** + **Arc Network**.

---

## The Problem

Today's autonomous agents can monitor and reason, but they can't **pay**. ArcGent bridges that gap: signals → AI evaluation → onchain USDC settlement. Fully autonomous. No humans in the loop.

---

## Features

### Live Signal Simulator
Click one button. Watch the full flow: signal fires → AI evaluates → **real USDC payment** on Arc Network. All in < 5 seconds.

```
[1] Webhook received: github/pr_merged
[2] 1 matching rule found
[3] AI: 80% confidence — contributor deserves payment
[4] 0.01 USDC sent → 0x350e...B16a
[5] TX: 0x1132...b62dd (ArcScan)
```

### AI-Powered Auto-Pay
- **3 confidence tiers**: ≥80% AUTO, 60-80% REVIEW, <60% REJECT
- LLM evaluates signal context before triggering payment
- Nanopayments (< $0.01) and standard USDC transfers
- Paymaster policies for gas sponsorship

### Multi-Tenant Architecture
- Every user gets their own agent via wallet signature verification
- Per-user rules, payments, and balance tracking
- Shared physical agent wallet with `ownerAddress` scoping
- Session tokens with 24h expiry

### Full Dashboard Suite

| Page | Description |
|------|-------------|
| **Dashboard** | Real-time agent status, rules CRUD, kill switch, simulator |
| **Marketplace** | Browse agents, hire services, my-agent card |
| **Analytics** | Payment volume, top earners/spenders, date range filter |
| **A2A Log** | Agent-to-agent payment trace, status filter, agent filter |
| **Onboarding** | Wallet connect → pick template → activate agent |
| **Login** | Signature-based auth, auto-redirect |

### Security
- 3-role auth system: Viewer (0), Operator (1), Admin (2)
- Wallet signature verification for user login
- API key + session token dual auth
- Per-user agent kill switch

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    SIGNAL SOURCES                      │
│  GitHub   API   Oracle   Webhook   Flight   Weather   │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│                 ARC GENT AGENT                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ Signal   │  │   AI     │  │  Circle Agent     │  │
│  │ Monitor  │──│ Evaluator│──│  Stack            │  │
│  └──────────┘  └──────────┘  │  ┌─────────────┐  │  │
│                               │  │ CircleWallet │  │  │
│  ┌──────────┐                 │  │ sendUSDC()   │  │  │
│  │  Rule    │                 │  │ nanopayment()│  │  │
│  │  Engine  │                 │  └─────────────┘  │  │
│  └──────────┘                 └───────────────────┘  │
└──────────────────┬───────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────────────────┐
│                    ARC NETWORK                        │
│         USDC Transfers · ArcScan · Sub-second        │
└──────────────────────────────────────────────────────┘
```

---

## Monorepo

```
arcgent/
├── apps/
│   ├── web/                  # Next.js 15 dashboard
│   │   ├── src/app/          # 7 pages (landing, dashboard, marketplace,
│   │   │                     #   analytics, onboarding, commlog, login)
│   │   └── src/components/   # NavBar, WalletConnect, Notifications
│   └── agent/                # Bun + Hono backend
│       ├── src/agent.ts      # Core agent loop
│       ├── src/api.ts        # 41 REST endpoints
│       ├── src/ai/           # LLM evaluator (9Router)
│       ├── src/auth/         # 3-role auth (keys, session tokens)
│       ├── src/db/           # Drizzle ORM + SQLite (8 tables)
│       └── src/payments/     # CircleWallet, Paymaster
├── packages/
│   └── shared/               # TypeScript types, constants
└── .env.example
```

---

## Quick Start

### Prerequisites
- [Bun](https://bun.com) 1.2+
- Circle API key ([Console](https://console.circle.com))
- Arc Testnet RPC access
- LLM endpoint (9Router or OpenAI-compatible)

### Setup

```bash
# Clone & install
git clone https://github.com/ddettaa/ArcGent.git
cd ArcGent
bun install

# Configure
cp .env.example .env
# Edit .env with your credentials

# Run agent (port 3001)
cd apps/agent && bun run dev

# Run dashboard (port 3000)
cd apps/web && bun run dev
```

Open `http://localhost:3000` → click **See It Live** → watch AI pay USDC onchain.

---

## API Reference (41 Endpoints)

### Core
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | - | Agent uptime |
| GET | `/api/status` | Viewer | Full agent state |
| POST | `/api/simulate` | Operator | **Demo: signal → AI → pay** |

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/verify` | - | Wallet signature → session token |
| GET | `/api/auth/keys` | Admin | List API keys |

### Rules
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/rules` | Viewer | List rules (owner-filtered) |
| POST | `/api/rules` | Operator | Create rule |
| PATCH | `/api/rules/:id` | Operator | Update rule |
| POST | `/api/rules/:id/toggle` | Operator | Enable/disable rule |

### Payments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/payments` | Viewer | Payment history |
| GET | `/api/payments/history` | Viewer | Aggregated stats (time-filtered) |
| POST | `/api/nanopayments/send` | Operator | Send nanopayment |

### Agents
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/agents` | Viewer | List agents |
| POST | `/api/my-agent` | Viewer | Auto-provision per wallet |
| POST | `/api/my-agent/kill` | Viewer | Kill user's agent |
| POST | `/api/my-agent/revive` | Viewer | Revive user's agent |
| POST | `/api/agents/pay` | Operator | A2A payment |

### Webhooks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/webhook/github/pr-merged` | Operator | PR merge signal |
| POST | `/api/webhook/github/issue-closed` | Operator | Issue close signal |
| POST | `/api/webhook/flight/delayed` | Operator | Flight delay signal |
| POST | `/api/webhook/weather/bad` | Operator | Weather alert signal |
| POST | `/api/webhook/views/milestone` | Operator | Views milestone |

### AI & Risk
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/ai/evaluate` | Operator | LLM evaluation |
| GET | `/api/ai/stats` | Viewer | AI call metrics |
| GET | `/api/risk` | Viewer | Risk limits status |
| POST | `/api/risk/limits` | Admin | Set risk caps |

### Paymaster
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/paymaster/policies` | Viewer | Gas sponsorship policies |
| GET | `/api/paymaster/stats` | Viewer | Paymaster metrics |
| POST | `/api/paymaster/sponsor` | Operator | Sponsor transaction |

---

## Real Transaction Proofs

All features verified with real USDC payments on Arc Testnet:

| Feature | TX Hash | Amount |
|---------|---------|--------|
| Standard USDC | `0xd1e03...` | 0.01 USDC |
| Nanopayment | `0xa5836...` | 500 μUSDC |
| Agent-to-Agent | `0x91c4c...` | 5000 μUSDC |
| Simulator Demo | `0x11326...` | 0.01 USDC |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Blockchain | Arc Network (Chain ID: 5042002) |
| Wallet | Circle Agent Stack (@circle-fin/app-kit) |
| Agent | Bun + Hono (TypeScript) |
| AI/LLM | 9Router / OpenAI-compatible |
| Frontend | Next.js 15 + shadcn/ui |
| Database | Drizzle ORM + SQLite |
| Auth | API Keys + Wallet Signatures |
| USDC | 0x360000...0002 (6 decimals) |

---

## License

MIT
