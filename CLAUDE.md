# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**VerkView Landing Page** - A single-page waitlist landing page for a modern issue tracking SaaS product. Dark, minimal design built with Tailwind CSS.

**Domain**: www.verkview.eu (Hostinger)

## Architecture

### Stack
- **Frontend**: Vercel (hosting)
- **Backend**: Vercel Serverless Functions (`/api/waitlist.js`)
- **Database**: Supabase (PostgreSQL, free tier)
- **Email**: Brevo (confirmation emails from info@verkview.eu)

### Data Flow
```
User submits form → Vercel Function → Supabase (save) + Brevo (send email)
```

## Key Files

- `index.html` - Main landing page (renamed from home.html)
- `/api/waitlist.js` - Serverless function for waitlist signup
- `vercel.json` - Vercel configuration

## Development

### Local Development
```bash
# Install Vercel CLI
npm install -g vercel

# Run locally (includes serverless functions)
vercel dev

# Or simple static server
python -m http.server 8000
```

### Testing
```bash
# Test API locally
curl -X POST "http://localhost:3000/api/waitlist" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

## Deployment

```bash
# Deploy to production
vercel --prod

# Environment variables needed in Vercel dashboard:
# SUPABASE_URL
# SUPABASE_ANON_KEY
# BREVO_API_KEY
```

## Database Schema (Supabase)

```sql
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at);
```

## Important Details

### Waitlist Forms
- Two forms: `#hero-waitlist-form` and `#cta-waitlist-form`
- Shared handler: `handleWaitlistSubmit()`
- Includes: loading states, error handling, success messages
- Duplicate emails return success (prevents email enumeration)

### Custom Tailwind 3D Utilities
Inline Tailwind config generates custom transforms:
- `rotate-x-{value}`, `rotate-y-{value}`, `rotate-z-{value}`
- `perspective-{size}` classes
- Used for 3D UI preview mockup in hero section

### Styling
- All styles inline in `<style>` tag
- Dark theme: zinc-950 background
- Tailwind CSS + Lucide icons (both via CDN)
- Custom animations with staggered delays

## Making Changes

### Add Form Fields
1. Update HTML form in `index.html`
2. Update JavaScript handler to capture field
3. Update `/api/waitlist.js` validation
4. Update Supabase table schema if needed

### Change API Endpoint
Update `API_BASE_URL` in `<script>` section of `index.html`

### View Waitlist Entries
Access Supabase Dashboard → Table Editor → waitlist table

## Environment Variables

Set in Vercel dashboard (Settings → Environment Variables):

- `SUPABASE_URL` - From Supabase project settings
- `SUPABASE_ANON_KEY` - From Supabase project API settings
- `BREVO_API_KEY` - From Brevo account settings
