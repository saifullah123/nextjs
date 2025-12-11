# ⚡ Supabase Quick Setup - TL;DR

## 1️⃣ Get Credentials (2 minutes)
```
Dashboard → Settings → Database → Connection String (Session Mode)
Dashboard → Settings → API → Copy URL & Anon Key
```

## 2️⃣ Update .env
```env
DATABASE_URL="postgresql://postgres.nvymbbrilznoqrsqbwqy:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://nvymbbrilznoqrsqbwqy.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-key-here"
```

## 3️⃣ Run Commands
```bash
npx prisma generate
npx prisma db push
npx tsx test-supabase-connection.ts
npm run dev
```

## ✅ Done!

---

**Important:**
- Username MUST be: `postgres.nvymbbrilznoqrsqbwqy`
- Port MUST be: `6543`
- Use Session pooler, not direct connection

**Files Updated:**
- ✅ `prisma/schema.prisma` → PostgreSQL
- ✅ `src/lib/supabase.ts` → Supabase client
- ✅ `test-supabase-connection.ts` → Test script

**Full Guide:** See `SUPABASE_SETUP_WORKFLOW.md`
