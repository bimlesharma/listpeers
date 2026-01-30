# PeerList - Student Academic Analytics Platform

A privacy-first, consent-driven academic analytics platform built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 **Privacy First**: Row Level Security, consent management, and tiered visibility
- 📊 **Deep Analytics**: SGPA/CGPA trends, grade distributions, credit-weighted insights
- 🏆 **Optional Rankboard**: Opt-in peer comparison with anonymous mode by default
- 📱 **Responsive Design**: Works on all devices with dark/light theme support
- 📝 **Self-Submitted Data**: Students voluntarily submit their own academic data

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Charts | Recharts |
| Backend | Supabase (PostgreSQL + Auth) |
| Authentication | GitHub OAuth |

## Getting Started

### 1. Clone and Install

```bash
cd peerlist
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Authentication > Providers** and enable **GitHub**
3. Create GitHub OAuth App:
   - Go to [github.com/settings/developers](https://github.com/settings/developers)
   - Click **New OAuth App**
   - Set **Homepage URL**: `http://localhost:3000`
   - Set **Callback URL**: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
   - Copy **Client ID** and **Client Secret** to Supabase
4. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
5. Copy your project URL and anon key from **Settings > API**

### 3. Configure Environment

Create `.env.local` from the example:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page with Google sign-in
│   ├── onboarding/              # First-time user setup
│   ├── auth/callback/           # OAuth callback handler
│   └── (authenticated)/         # Protected routes
│       ├── dashboard/           # Analytics dashboard
│       ├── submit/              # Academic data entry
│       ├── records/             # View/manage submissions
│       ├── rankboard/           # Peer comparison
│       └── settings/            # Consent management
├── components/
│   ├── Charts/                  # Recharts components
│   ├── Navbar.tsx               # Navigation
│   ├── ThemeProvider.tsx        # Dark/light mode
│   └── DisclaimerFooter.tsx     # Legal disclaimer
├── lib/
│   ├── supabase/                # Supabase clients
│   ├── grading.ts               # SGPA/CGPA calculations
│   └── utils.ts                 # Utility functions
└── types/
    └── index.ts                 # TypeScript interfaces
```

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Enrollment Uniqueness**: Prevents duplicate registrations
- **Consent Audit Logging**: All consent changes are logged with timestamps
- **Tiered Visibility**: Anonymous by default, explicit opt-in for visibility
- **Marks Visibility Confirmation**: Extra confirmation required to share detailed marks

## Disclaimer

This is an independent, student-driven platform. It is not affiliated with or endorsed by any university. All data is voluntarily submitted by students. Rankboards are generated solely from self-submitted data and do not represent official academic rankings.
