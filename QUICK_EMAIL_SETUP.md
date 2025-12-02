# Quick Email Setup Instructions

## ⚡ Quick Start (3 Steps)

### Step 1: Get Gmail App Password

1. Go to: **https://myaccount.google.com/apppasswords**
2. Sign in with **ksaifullah680@gmail.com**
3. Create app password for "Mail"
4. **Copy the 16-character password** (looks like: xxxx xxxx xxxx xxxx)

### Step 2: Add to .env File

Open `e:\nextjs\.env` and add these lines:

```env
EMAIL_USER="ksaifullah680@gmail.com"
EMAIL_PASSWORD="paste-your-16-char-password-here"
```

### Step 3: Restart Server

```bash
# Press Ctrl+C to stop the server
# Then run:
npm run dev
```

## ✅ That's It!

Your contact form will now send emails automatically!

---

**For detailed instructions, see:** `EMAIL_SETUP_GUIDE.md`
