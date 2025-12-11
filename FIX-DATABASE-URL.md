# 🔴 CRITICAL FIX REQUIRED - Update Your .env File

## The Problem:
Your DATABASE_URL is using Supabase's connection pooler (port 6543), which uses pgBouncer.
pgBouncer does NOT support prepared statements, causing this error:
"prepared statement does not exist"

## ✅ THE SOLUTION - Change Port 6543 to 5432

You need to edit your `.env` file and change the port number.

### Current (BROKEN):
```env
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

### Fixed (WORKING):
```env
DATABASE_URL="postgresql://postgres.xxxxx:password@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

**Only change: 6543 → 5432**

---

## 📋 Step-by-Step Instructions:

1. **Open your `.env` file** (in the root of your project: `e:\nextjs\.env`)

2. **Find the line that starts with `DATABASE_URL=`**

3. **Change `:6543/` to `:5432/`**
   - Look for the port number in your connection string
   - Change `6543` to `5432`

4. **Save the file**

5. **Restart the dev server:**
   - Press `Ctrl+C` to stop
   - Run `npm run dev` again

6. **Try logging in** at `http://localhost:3000/admin/login`
   - Email: `admin@example.com`
   - Password: `admin123`

---

## 🎯 What This Does:

- **Port 6543** = Connection Pooler (pgBouncer) - Fast but doesn't support prepared statements ❌
- **Port 5432** = Direct Connection - Slightly slower but fully compatible ✅

---

## 📝 Example .env File:

```env
# Supabase Database - Direct Connection (port 5432)
DATABASE_URL="postgresql://postgres.abcdefghijklmnop:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# JWT Secret
JWT_SECRET="your-secret-key-change-in-production"
```

---

## ⚠️ Can't Find Your .env File?

If you don't have a `.env` file:

1. Create a new file called `.env` in `e:\nextjs\`
2. Go to your Supabase project dashboard
3. Navigate to: **Project Settings → Database**
4. Under **Connection string**, select **URI**
5. Choose **Session mode** (this uses port 5432)
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your actual database password
8. Add it to your `.env` file as shown above

---

**After making this change, login will work perfectly!** 🚀
