# Personal AI Board

A full-stack Next.js application for managing decisions, tasks, network contacts, and wealth tracking with AI-powered analysis.

## Features

- **Decision Analysis**: Submit decisions and get AI-powered pro/con analysis via Claude API
- **Task Management**: Create tasks linked to decisions and track status (pending → in_progress → completed)
- **Network Map**: Maintain contacts and generate AI-powered introduction messages
- **Net Worth Tracking**: Monitor and breakdown your personal net worth
- **Tax Calculator**: Get AI-estimated tax savings strategies based on income

## Tech Stack

- **Frontend**: React 19, Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API (Anthropic)
- **Deployment**: Vercel-ready

## Project Structure

```
personal-ai-board/
├── app/
│   ├── api/
│   │   ├── decisions/route.ts        # Decision analysis endpoint
│   │   ├── tasks/route.ts            # Task management endpoint
│   │   ├── network/route.ts          # Contact management & intros
│   │   ├── net-worth/route.ts        # Net worth tracking
│   │   └── tax-calculator/route.ts   # Tax estimation endpoint
│   ├── components/
│   │   ├── Dashboard.tsx             # Net worth & recent decisions
│   │   ├── DecisionForm.tsx          # Decision submission & history
│   │   ├── NetworkMap.tsx            # Contact list & intro generator
│   │   ├── TaskBoard.tsx             # Kanban-style task board
│   │   └── TaxCalculator.tsx         # Tax savings estimator
│   ├── layout.tsx                    # Root layout with nav
│   ├── page.tsx                      # Main dashboard page
│   └── globals.css                   # Tailwind styles
├── lib/
│   ├── supabase.ts                   # Supabase client & types
│   └── claude.ts                     # Claude API functions
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── postcss.config.js
└── .env.example
```

## Database Schema

### users
- `id` (UUID)
- `email` (string)
- `created_at` (timestamp)

### decisions
- `id` (UUID)
- `user_id` (UUID, foreign key)
- `description` (text)
- `analysis` (text)
- `created_at` (timestamp)

### tasks
- `id` (UUID)
- `user_id` (UUID, foreign key)
- `decision_id` (UUID, foreign key)
- `title` (string)
- `status` (enum: pending, in_progress, completed)
- `created_at` (timestamp)

### contacts
- `id` (UUID)
- `user_id` (UUID, foreign key)
- `name` (string)
- `role` (string)
- `opportunity` (text)
- `created_at` (timestamp)

### net_worth
- `id` (UUID)
- `user_id` (UUID, foreign key)
- `total` (numeric)
- `breakdown` (JSONB)
- `updated_at` (timestamp)

## Setup

1. **Clone and install dependencies**:
   ```bash
   cd ~/Projects/personal-ai-board
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   ```
   Add your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
   - `ANTHROPIC_API_KEY`: Claude API key from Anthropic

3. **Create Supabase database** (use SQL editor):
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email TEXT UNIQUE NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE decisions (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES users(id),
     description TEXT NOT NULL,
     analysis TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE tasks (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES users(id),
     decision_id UUID REFERENCES decisions(id),
     title TEXT NOT NULL,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE contacts (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES users(id),
     name TEXT NOT NULL,
     role TEXT NOT NULL,
     opportunity TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE net_worth (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID NOT NULL REFERENCES users(id),
     total NUMERIC NOT NULL,
     breakdown JSONB NOT NULL,
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`

## API Endpoints

### POST /api/decisions
Submit a decision for AI analysis.
```json
{
  "userId": "user-123",
  "description": "Should I accept a new job offer?"
}
```

### GET /api/decisions?userId=user-123
Fetch all decisions for a user.

### POST /api/tasks
Create a new task.
```json
{
  "userId": "user-123",
  "decisionId": "decision-id",
  "title": "Review job contract"
}
```

### GET /api/tasks?userId=user-123
Fetch all tasks for a user.

### POST /api/network
Add a network contact.
```json
{
  "userId": "user-123",
  "name": "John Doe",
  "role": "CTO at TechCorp",
  "opportunity": "Cloud infrastructure expertise"
}
```

### GET /api/network?userId=user-123
Fetch all contacts for a user.

### POST /api/net-worth
Record net worth.
```json
{
  "userId": "user-123",
  "total": 500000,
  "breakdown": {
    "Savings": 200000,
    "Investments": 250000,
    "Other": 50000
  }
}
```

### GET /api/net-worth?userId=user-123
Fetch latest net worth for a user.

### POST /api/tax-calculator
Get tax savings estimate.
```json
{
  "income": 150000
}
```

## Local Development

```bash
# Type checking
npm run type-check

# Build
npm run build

# Start production server
npm run start
```

## Deployment

Deploy to Vercel:
1. Push repo to GitHub
2. Connect repo in Vercel dashboard
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ANTHROPIC_API_KEY`
4. Deploy

## Notes

- Currently uses hardcoded `userId: "user-123"` for demo. Implement proper auth for production.
- Claude API calls will consume credits. Set up cost monitoring.
- Tax calculator output is for informational purposes only, not professional tax advice.
