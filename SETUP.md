# VerkView Landing Page - Complete Setup Guide

This guide will walk you through setting up your landing page with Vercel, Supabase, and Brevo.

**Total Setup Time:** ~20 minutes
**Cost:** $0 (all free tiers)

---

## 🎯 Overview

**What we're building:**
- Landing page hosted on Vercel
- Database on Supabase (PostgreSQL)
- Email confirmations via Brevo
- Custom domain: www.verkview.eu

**Architecture:**
```
User fills form → Vercel Function → Supabase (save) + Brevo (email)
```

---

## 📋 Prerequisites

- [ ] Domain purchased from Hostinger (www.verkview.eu) ✅
- [ ] Brevo account with info@verkview.eu configured ✅
- [ ] GitHub account (for Vercel deployment)
- [ ] 20 minutes of time

---

## Step 1: Setup Supabase (5 minutes)

### 1.1 Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"**
3. Sign in with GitHub
4. Click **"New Project"**

### 1.2 Create Project

- **Organization:** Create new or use existing
- **Project Name:** `verkview-landing`
- **Database Password:** (generate strong password - save it!)
- **Region:** Choose closest to Europe (e.g., Frankfurt, London)
- **Pricing:** Free tier (selected by default)

Click **"Create new project"** (takes ~2 minutes)

### 1.3 Setup Database

1. Once project is ready, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy the entire contents of `supabase-setup.sql` from this repo
4. Paste into the query editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)

You should see: ✅ **Success. No rows returned**

### 1.4 Get API Credentials

1. Go to **Project Settings** (gear icon at bottom left)
2. Click **API** in the sidebar
3. Copy and save these values:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Keep these safe - you'll need them for Vercel!**

---

## Step 2: Get Brevo API Key (2 minutes)

### 2.1 Access Brevo Dashboard

1. Log in to [Brevo](https://app.brevo.com)
2. Go to your account settings (top right)

### 2.2 Generate API Key

1. Click **"SMTP & API"** → **"API Keys"**
2. Click **"Generate a new API key"**
3. Name: `VerkView Landing`
4. Click **"Generate"**
5. **Copy the key immediately** (you won't see it again!)

Should look like: `xkeysib-xxxxxxxxxxxxx...`

---

## Step 3: Deploy to Vercel (10 minutes)

### 3.1 Install Dependencies

```bash
cd /Users/marcosimioni/Desktop/development/kanban_landingpage
npm install
```

### 3.2 Install Vercel CLI

```bash
npm install -g vercel
```

### 3.3 Login to Vercel

```bash
vercel login
```

Follow prompts to authenticate with GitHub/Email.

### 3.4 Deploy Project

```bash
vercel
```

**Answer the prompts:**

```
? Set up and deploy "~/Desktop/development/kanban_landingpage"? [Y/n] Y
? Which scope do you want to deploy to? Your Name
? Link to existing project? [y/N] N
? What's your project's name? verkview-landing
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

Vercel will:
- Upload your files
- Deploy the site
- Give you a URL like: `https://verkview-landing.vercel.app`

**Don't test yet** - we need to add environment variables first!

### 3.5 Add Environment Variables

```bash
# Open Vercel dashboard
vercel --prod
```

Or go to [vercel.com/dashboard](https://vercel.com/dashboard)

1. Find your project **verkview-landing**
2. Go to **Settings** → **Environment Variables**
3. Add these three variables:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` (from Step 1.4) |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` (from Step 1.4) |
| `BREVO_API_KEY` | `xkeysib-...` (from Step 2.2) |

4. Click **"Save"** for each

### 3.6 Redeploy with Environment Variables

```bash
vercel --prod
```

This triggers a new deployment with your environment variables.

**Your site is now live!** 🎉

---

## Step 4: Connect Custom Domain (3 minutes)

### 4.1 Add Domain in Vercel

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Type: `www.verkview.eu`
4. Click **"Add"**

Vercel will show you DNS records to configure.

### 4.2 Configure DNS in Hostinger

1. Log in to [Hostinger](https://www.hostinger.com)
2. Go to **Domains** → **verkview.eu** → **DNS / Name Servers**
3. Add/Update these records:

**For www.verkview.eu:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

**For verkview.eu (optional - redirects to www):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

4. Save changes

### 4.3 Wait for DNS Propagation

- Usually takes **5-30 minutes**
- Check status in Vercel dashboard (will show ✅ when ready)
- Test at: https://www.verkview.eu

---

## Step 5: Test Everything (5 minutes)

### 5.1 Test the Landing Page

1. Visit https://www.verkview.eu
2. Page should load with your design ✅

### 5.2 Test Waitlist Signup

1. Scroll to the hero form
2. Enter a test email (use your real email!)
3. Click **"Join Waitlist"**
4. Should see: ✅ **"You're on the waitlist! Check your email for confirmation."**

### 5.3 Verify Database Entry

1. Go to Supabase dashboard
2. Click **Table Editor** (left sidebar)
3. Click **waitlist** table
4. You should see your test entry with:
   - ✅ Email
   - ✅ IP address
   - ✅ User agent
   - ✅ Timestamp

### 5.4 Verify Email Sent

1. Check your email inbox
2. You should receive email from **info@verkview.eu**
3. Subject: **"You're on the VerkView waitlist! 🎉"**
4. Check spam folder if not in inbox

### 5.5 Test Duplicate Email

1. Try submitting the same email again
2. Should still show success (prevents email enumeration)
3. Database should **not** create duplicate (check Supabase)

### 5.6 Test Invalid Email

1. Try: `notanemail`
2. Should show error: **"Invalid email format"**

---

## ✅ Success Checklist

- [ ] Supabase project created and database setup
- [ ] Brevo API key obtained
- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] Custom domain connected (www.verkview.eu)
- [ ] Test signup saves to database
- [ ] Confirmation email received
- [ ] Duplicate prevention works
- [ ] Invalid email rejected

---

## 🔧 Troubleshooting

### Issue: "Failed to join waitlist"

**Check:**
1. Vercel logs: `vercel logs`
2. Environment variables are set correctly
3. Supabase project is active (not paused)

### Issue: No confirmation email

**Check:**
1. Brevo API key is correct
2. Brevo sender email (info@verkview.eu) is verified
3. Check spam folder
4. Check Brevo dashboard for email logs

### Issue: CORS errors

**Check:**
1. `vercel.json` is present in root
2. Redeploy: `vercel --prod`

### Issue: "Supabase error"

**Check:**
1. `supabase-setup.sql` ran successfully
2. Table `waitlist` exists in Supabase Table Editor
3. Row Level Security policies are active

### Issue: Domain not working

**Check:**
1. DNS propagation (can take up to 48 hours, usually 30 minutes)
2. DNS records in Hostinger match Vercel's requirements
3. Use [dnschecker.org](https://dnschecker.org) to verify DNS

---

## 📊 Monitoring & Management

### View Waitlist Entries

**Supabase Dashboard:**
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. **Table Editor** → **waitlist**
4. See all signups with timestamps

### Export Waitlist to CSV

1. Supabase dashboard → **Table Editor** → **waitlist**
2. Click **"Download as CSV"** (top right)

### View API Logs

```bash
# View recent logs
vercel logs

# Stream live logs
vercel logs --follow
```

### Monitor Email Delivery

1. Go to [Brevo Dashboard](https://app.brevo.com)
2. **Statistics** → **Email**
3. See delivery rates, opens, etc.

---

## 🎨 Customization

### Change Email Template

Edit `/api/waitlist.js`, find the `htmlContent` section around line 35.

Redeploy after changes:
```bash
vercel --prod
```

### Add Name Field to Form

1. Add input to `index.html`:
```html
<input type="text" name="name" placeholder="Your name">
```

2. Update JavaScript handler to capture name field

3. No backend changes needed (already supports name!)

### Change "From" Email

Update Brevo sender in `/api/waitlist.js`:
```javascript
sender: {
  name: 'VerkView Team',
  email: 'info@verkview.eu'  // Change this
}
```

---

## 💰 Free Tier Limits

### Vercel Free Tier
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Custom domains
- ✅ Automatic SSL
- ⚠️ Limit: 100GB-hours compute/month (very generous)

### Supabase Free Tier
- ✅ 500MB database storage
- ✅ 1GB file storage
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests
- ⚠️ Projects pause after 7 days of inactivity (free tier only)

### Brevo Free Tier
- ✅ 300 emails/day
- ✅ Unlimited contacts
- ⚠️ Brevo logo in emails (removable with paid plan)

**Expected usage:**
- 100 signups/day = well within all limits
- Only pay if you exceed (very unlikely for a waitlist)

---

## 🚀 Next Steps

Now that your waitlist is live, consider:

1. **Add Analytics**
   - Google Analytics
   - Plausible Analytics
   - Vercel Analytics (built-in)

2. **Create Social Sharing**
   - Add Open Graph meta tags
   - Create Twitter/LinkedIn preview images

3. **A/B Testing**
   - Test different headlines
   - Test CTA button text
   - Use Vercel Edge Config for split testing

4. **Email Sequence**
   - Setup automated follow-up emails in Brevo
   - Send weekly updates to waitlist

5. **Referral System**
   - Give early access to users who refer others
   - Add referral tracking to Supabase

---

## 📞 Support

### Documentation
- **Vercel:** [vercel.com/docs](https://vercel.com/docs)
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Brevo:** [developers.brevo.com](https://developers.brevo.com)

### Quick Links
- Vercel Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Supabase Dashboard: [supabase.com/dashboard](https://supabase.com/dashboard)
- Brevo Dashboard: [app.brevo.com](https://app.brevo.com)

---

## 🎉 Congratulations!

Your landing page is now live with:
- ✅ Professional hosting (Vercel)
- ✅ Secure database (Supabase)
- ✅ Automated emails (Brevo)
- ✅ Custom domain (www.verkview.eu)
- ✅ Zero hosting costs

**Your waitlist is ready to collect signups!** 🚀

---

**Last Updated:** December 28, 2025
**Version:** 1.0
**Questions?** Review CLAUDE.md for technical details
