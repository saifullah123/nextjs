# Email Configuration Guide for Contact Form

## 📧 Setting Up Email Notifications

Your contact form is now configured to send emails! Follow these steps to set up your email credentials.

## Step 1: Choose Your Email Service

### Option A: Gmail (Recommended for beginners)

1. **Create a Gmail App Password** (Required for security)
   - Go to: https://myaccount.google.com/apppasswords
   - Sign in to your Google account
   - Create a new app password for "Mail"
   - Copy the 16-character password

2. **Add to your `.env` file:**
   ```env
   EMAIL_USER="your-email@gmail.com"
   EMAIL_PASSWORD="your-16-character-app-password"
   ```

### Option B: Outlook/Hotmail

1. **Use your Outlook credentials:**
   ```env
   EMAIL_USER="your-email@outlook.com"
   EMAIL_PASSWORD="your-outlook-password"
   ```

2. **Update `src/lib/email.ts`:**
   Change line 7 from:
   ```typescript
   service: 'gmail',
   ```
   to:
   ```typescript
   service: 'outlook',
   ```

### Option C: Custom SMTP Server

If you have a custom email server, update `src/lib/email.ts`:

```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## Step 2: Update Your .env File

1. **Open or create** `.env` file in the root directory (`e:\nextjs\.env`)

2. **Add these lines** (if not already present):
   ```env
   EMAIL_USER="ksaifullah680@gmail.com"
   EMAIL_PASSWORD="your-app-password-here"
   ```

3. **Replace** `your-app-password-here` with your actual app password

## Step 3: Restart Your Development Server

After updating `.env`, restart your server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 📬 What Happens When Someone Submits the Contact Form?

1. **Message saved to database** ✅
2. **Email sent to you** (ksaifullah680@gmail.com) with:
   - Customer's name
   - Customer's email
   - Customer's phone (if provided)
   - Their message
   
3. **Auto-reply sent to customer** with:
   - Thank you message
   - Copy of their inquiry
   - Your contact information

## 🎨 Email Templates

Both emails use professional HTML templates with:
- Purple and pink gradient design (matching your website)
- Responsive layout
- Clickable email and phone links
- Timestamp in IST timezone

## 🔧 Troubleshooting

### Email not sending?

1. **Check your `.env` file** - Make sure EMAIL_USER and EMAIL_PASSWORD are set correctly
2. **Gmail users** - You MUST use an App Password, not your regular password
3. **Check console** - Look for error messages in your terminal
4. **Verify email service** - Make sure the service in `src/lib/email.ts` matches your provider

### Still having issues?

The contact form will still work even if email fails - messages are always saved to the database. You can view them in the admin panel at `/admin/messages`.

## 📝 Current Configuration

- **Your email:** ksaifullah680@gmail.com (from `src/config/contact.ts`)
- **Email service:** Gmail (can be changed in `src/lib/email.ts`)
- **Emails sent:** 2 per submission (one to you, one auto-reply to customer)

## 🔐 Security Notes

- Never commit your `.env` file to Git (it's already in `.gitignore`)
- Use App Passwords instead of regular passwords
- Keep your email credentials secure

---

**Need to change your email address?**
Update it in `src/config/contact.ts` - it will automatically update in the email templates!
