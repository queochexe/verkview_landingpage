# VerkView Landing Page

A modern, dark-themed landing page with waitlist functionality.

**Live Site:** [www.verkview.eu](https://www.verkview.eu)

## Tech Stack

- **Frontend:** HTML + Tailwind CSS (CDN)
- **Hosting:** Vercel
- **Backend:** Vercel Serverless Functions
- **Database:** Supabase (PostgreSQL)
- **Email:** Brevo

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Services
Follow the complete guide in [SETUP.md](./SETUP.md)

### 3. Run Locally
```bash
npm run dev
```

### 4. Deploy
```bash
npm run deploy
```

## Project Structure

```
/
├── index.html              # Landing page
├── api/
│   └── waitlist.js        # Serverless function for waitlist signup
├── supabase-setup.sql     # Database schema
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies
├── SETUP.md               # Complete setup guide
└── CLAUDE.md              # AI assistant context
```

## Environment Variables

Required in Vercel:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `BREVO_API_KEY`

## Features

- ✅ Dark, modern design with 3D effects
- ✅ Email validation and duplicate prevention
- ✅ Automated confirmation emails
- ✅ Secure database storage
- ✅ IP & user agent tracking
- ✅ Mobile responsive
- ✅ Zero cost (free tier services)

## Documentation

- [Complete Setup Guide](./SETUP.md) - Step-by-step setup instructions
- [CLAUDE.md](./CLAUDE.md) - Technical architecture and development guide

## License

Private project
