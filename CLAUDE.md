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

## Analytics (PostHog)

PostHog is loaded via CDN snippet in `<head>` of `index.html`. No build step required — it's a plain `<script>` tag.

**Config:**
- Token: `phc_s9JjgzMusUEmdaYV42zpX33V5C5iiSrYkG5ewuUZRJJN` (same project as `app.verkview.eu`)
- Host: `https://eu.i.posthog.com`
- `person_profiles: 'always'` — anonymous visitors tracked from first load
- `cookie_domain: '.verkview.eu'` — shared with `app.verkview.eu` for cross-subdomain journey stitching
- `autocapture: true` — button clicks, scroll depth, link clicks captured automatically
- `session_recording: { maskAllInputs: true }` — email field masked for GDPR

**Custom events tracked:**

| Event | Where | Properties |
|-------|-------|------------|
| `waitlist_signup` | `handleWaitlistSubmit()` on success | `source: 'hero' \| 'cta'` |

On `waitlist_signup`, `posthog.identify(email, { email })` is also called to link the anonymous session to the user's email. This allows PostHog to merge their pre-signup browsing session with their account in `app.verkview.eu` after they register.

**Cross-domain funnel:**
`verkview.eu` → `app.verkview.eu` use the same `.verkview.eu` cookie, so a visitor who lands on the marketing page, joins the waitlist, and later creates an app account appears as one continuous user in PostHog.

Full analytics reference: `/Users/marcosimioni/Documents/development/kanban_project/docs/analytic/ANALYTICS_IMPLEMENTATION.md`

## Environment Variables

Set in Vercel dashboard (Settings → Environment Variables):

- `SUPABASE_URL` - From Supabase project settings
- `SUPABASE_ANON_KEY` - From Supabase project API settings
- `BREVO_API_KEY` - From Brevo account settings
