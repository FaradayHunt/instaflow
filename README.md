# InstaFlow — Instagram Post Review Dashboard

Generate, review, and approve AI-powered Instagram posts with a clean dashboard interface.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (Postgres)
- **Tailwind CSS** + **shadcn/ui**
- **Anthropic Claude API** (claude-opus-4-5) for post generation and rewriting

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd instaflow
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Run the Supabase migration

In the Supabase dashboard SQL editor, run the contents of `supabase/migrations/001_init.sql`:

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  content text not null,
  status text not null default 'pending',
  decline_comment text,
  version integer not null default 1,
  source_doc_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

Or using the Supabase CLI:

```bash
supabase db push
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. **Generate** — Go to `/generate`, paste content or a Google Doc URL, and click "Extract & Generate Posts"
2. **Review** — Posts appear on the dashboard with Approve/Decline buttons
3. **Decline & Rewrite** — Declining a post lets you provide feedback; Claude rewrites the post automatically
4. **Approve** — Approved posts are marked green and ready to publish

## Deploy to Vercel

1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add the three environment variables in the Vercel project settings
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/route.ts      # POST: generate posts from content
│   │   └── posts/
│   │       ├── route.ts            # GET: list posts with filters
│   │       └── [id]/
│   │           ├── approve/route.ts # POST: approve a post
│   │           └── decline/route.ts # POST: decline + AI rewrite
│   ├── generate/page.tsx           # Generate page
│   ├── layout.tsx                  # Root layout with nav
│   └── page.tsx                    # Dashboard page
├── components/
│   ├── dashboard.tsx               # Dashboard with filter tabs
│   ├── generate-form.tsx           # Generation form
│   ├── nav.tsx                     # Navigation bar
│   ├── post-card.tsx               # Post card with actions
│   ├── post-skeleton.tsx           # Loading skeleton
│   └── ui/                         # shadcn/ui components
└── lib/
    ├── anthropic.ts                # Anthropic client
    ├── supabase.ts                 # Supabase client
    ├── types.ts                    # TypeScript types
    └── utils.ts                    # Utility functions
```
