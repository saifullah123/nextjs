# Supabase Database Connection Guide

## Current Status
Your application is currently using **SQLite** (`dev.db`) and working correctly.

## Issue Encountered
When attempting to connect to Supabase, we encountered:
1. **IPv6 connectivity issues** - Your network cannot reach the direct database connection
2. **"Tenant or user not found"** - Incorrect username format for pooler connection

## Solution: Proper Supabase Connection Setup

### Step 1: Get the Correct Connection String

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: `nvymbbrilznoqrsqbwqy`
3. Click **Project Settings** (gear icon) → **Database**
4. Under **Connection String** section:
   - **Mode**: Select **"Session"** (recommended for Prisma)
   - **Type**: Select **"URI"**
   - You should see a connection string like:
   
   ```
   postgresql://postgres.nvymbbrilznoqrsqbwqy:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

### Step 2: Important Connection String Details

**Key differences from standard PostgreSQL:**
- **Username format**: `postgres.nvymbbrilznoqrsqbwqy` (NOT just `postgres`)
- **Port**: `6543` for Session pooler (NOT `5432`)
- **Host**: `aws-0-ap-southeast-1.pooler.supabase.com` (pooler, not direct db connection)

### Step 3: Update Your Configuration

Once you have the correct connection string:

1. **Update `.env` file**:
   ```env
   DATABASE_URL="postgresql://postgres.nvymbbrilznoqrsqbwqy:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
   ```

2. **Update `prisma/schema.prisma`**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. **Stop the dev server** (if running):
   ```powershell
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

4. **Regenerate Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Push schema to Supabase**:
   ```bash
   npx prisma db push
   ```

6. **Start your dev server**:
   ```bash
   npm run dev
   ```

### Step 4: Verify Connection

Test the connection with this script:

```typescript
// test-supabase.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log("✅ Connected to Supabase successfully!")
    
    // Test query
    const userCount = await prisma.user.count()
    console.log(`📊 Users in database: ${userCount}`)
  } catch (e) {
    console.error("❌ Connection failed:", e)
  } finally {
    await prisma.$disconnect()
  }
}

main()
```

Run with: `npx tsx test-supabase.ts`

## Troubleshooting

### Error: "Can't reach database server"
- **Cause**: Network/firewall blocking connection
- **Solution**: 
  - Check if you're behind a corporate firewall
  - Try using a VPN
  - Verify Supabase project is not paused

### Error: "Tenant or user not found"
- **Cause**: Incorrect username format
- **Solution**: Ensure username is `postgres.nvymbbrilznoqrsqbwqy` (not just `postgres`)

### Error: "Invalid connection string"
- **Cause**: Wrong port or missing parameters
- **Solution**: Use port `6543` for pooler, ensure `?pgbouncer=true` is NOT added for Session mode

## Alternative: Direct Connection (Not Recommended)

If you must use direct connection (port 5432):
```
postgresql://postgres:[YOUR-PASSWORD]@db.nvymbbrilznoqrsqbwqy.supabase.co:5432/postgres
```

**Note**: This requires IPv6 support and may not work on all networks.

## Migration from SQLite to PostgreSQL

When you're ready to migrate:

1. **Export SQLite data** (if you have existing data):
   ```bash
   npx prisma db pull
   ```

2. **Switch to PostgreSQL** (follow Steps 1-3 above)

3. **Push schema**:
   ```bash
   npx prisma db push
   ```

4. **Manually migrate data** (if needed):
   - Export data from SQLite
   - Import into PostgreSQL using Prisma Studio or SQL scripts

## Current Configuration

**Active Database**: SQLite (`file:./dev.db`)
**Supabase Project**: `nvymbbrilznoqrsqbwqy`
**Region**: ap-southeast-1 (Singapore)

## Next Steps

1. Get the correct connection string from Supabase dashboard
2. Verify the username format includes the project reference
3. Update `.env` with the correct connection string
4. Follow Step 3 to complete the migration

---

**Need Help?**
If you continue to experience connection issues, please provide:
- Screenshot of the Supabase connection string settings
- Any error messages you receive
- Your network environment (corporate, home, VPN, etc.)
