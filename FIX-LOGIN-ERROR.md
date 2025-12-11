# Fix for "Prepared Statement Does Not Exist" Error

## Problem
You're getting this error when trying to login:
```
prepared statement "s56" does not exist
```

This happens because Supabase's connection pooler (pgBouncer) doesn't support prepared statements.

## Solution

### Step 1: Stop the dev server
Press `Ctrl+C` in the terminal where `npm run dev` is running.

### Step 2: Update your environment variables
You need TWO connection strings from Supabase:

1. **DATABASE_URL** - Use the "Transaction" mode connection string (with pgbouncer)
2. **DIRECT_URL** - Use the "Session" mode connection string (direct connection)

In Supabase:
- Go to Project Settings → Database
- Find "Connection string" section
- Copy the "Transaction" pooler URL → use for `DATABASE_URL`
- Copy the "Session" pooler URL → use for `DIRECT_URL`

Example `.env` file:
```env
# Transaction mode (for queries) - uses connection pooler
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session mode (for migrations) - direct connection
DIRECT_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# JWT Secret for authentication
JWT_SECRET="your-secret-key-change-in-production"
```

### Step 3: Regenerate Prisma Client
```bash
npx prisma generate
```

### Step 4: Restart the dev server
```bash
npm run dev
```

### Step 5: Try logging in again
Go to `http://localhost:3000/admin/login` and use:
- Email: `admin@example.com`
- Password: `admin123`

## What I Changed

1. **prisma/schema.prisma** - Added `directUrl` support
2. **src/lib/prisma.ts** - Simplified configuration

The key is using TWO different connection strings:
- `DATABASE_URL` with `?pgbouncer=true` for regular queries
- `DIRECT_URL` without pgbouncer for migrations and schema operations

This tells Prisma to use the pooled connection for queries (which is faster) but avoid prepared statements that cause the error.
