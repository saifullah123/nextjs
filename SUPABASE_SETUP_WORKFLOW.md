# 🚀 Complete Supabase Connection Workflow

## Prerequisites
- ✅ Supabase account created
- ✅ Supabase project created (ID: nvymbbrilznoqrsqbwqy)
- ✅ @supabase/supabase-js installed
- ✅ Prisma configured

---

## Step 1: Get Supabase Credentials

### A. Database Connection String
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **nvymbbrilznoqrsqbwqy**
3. Navigate to **Settings** → **Database**
4. Under **Connection String**:
   - Mode: **Session** (recommended for Prisma)
   - Type: **URI**
5. Copy the connection string (format):
   ```
   postgresql://postgres.nvymbbrilznoqrsqbwqy:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

### B. API Credentials (Optional - for Supabase features)
1. Navigate to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://nvymbbrilznoqrsqbwqy.supabase.co`
   - **Anon/Public Key**: Your public API key

---

## Step 2: Update Environment Variables

Update your `.env` file with the following:

```env
# Prisma Database Connection
DATABASE_URL="postgresql://postgres.nvymbbrilznoqrsqbwqy:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

# Supabase Client (Optional - for Storage, Auth, Realtime)
NEXT_PUBLIC_SUPABASE_URL="https://nvymbbrilznoqrsqbwqy.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Optional: Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**Important Notes:**
- Replace `[YOUR-PASSWORD]` with your actual database password
- Replace `your-anon-key-here` with your actual anon key
- Keep the username as `postgres.nvymbbrilznoqrsqbwqy` (includes project ID)
- Port must be `6543` for Session pooler

---

## Step 3: Update Prisma Configuration

✅ **Already Done!** Your `prisma/schema.prisma` has been updated to use PostgreSQL.

Current configuration:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## Step 4: Migrate Database Schema

Run these commands in order:

```bash
# 1. Stop the dev server (if running)
npm run dev
# Press Ctrl+C to stop

# 2. Generate Prisma Client for PostgreSQL
npx prisma generate

# 3. Push your schema to Supabase
npx prisma db push

# 4. (Optional) Seed your database
npm run seed
```

---

## Step 5: Test Connection

Run the test script:

```bash
npx tsx test-supabase-connection.ts
```

**Expected Output:**
```
🔄 Testing Supabase connection...

✅ Successfully connected to Supabase database!

📊 Running test queries...
   Users: 0
   Categories: 0
   Products: 0
   Testimonials: 0
   Banners: 0
   Contact Messages: 0

✅ All tests passed! Your Supabase connection is working perfectly.
```

---

## Step 6: Start Your Application

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🔧 Troubleshooting

### Error: "Can't reach database server"
**Causes:**
- Network/firewall blocking port 6543
- Supabase project is paused
- IPv6 connectivity issues

**Solutions:**
1. Check Supabase project status in dashboard
2. Try using a VPN
3. Verify firewall settings
4. Ensure you're using the **pooler** connection (port 6543), not direct (port 5432)

### Error: "Tenant or user not found"
**Cause:** Incorrect username format

**Solution:** Username must be `postgres.nvymbbrilznoqrsqbwqy` (not just `postgres`)

### Error: "Invalid connection string"
**Causes:**
- Wrong port number
- Missing project ID in username
- Incorrect password

**Solution:** Double-check the connection string format:
```
postgresql://postgres.nvymbbrilznoqrsqbwqy:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

### Error: "Schema not found"
**Cause:** Schema not pushed to Supabase

**Solution:**
```bash
npx prisma db push
```

---

## 📊 Migrating Existing SQLite Data

If you have existing data in `dev.db` that you want to migrate:

### Option 1: Manual Export/Import

1. **Export from SQLite:**
   ```bash
   # Using Prisma Studio
   npx prisma studio
   # Manually export data
   ```

2. **Import to Supabase:**
   - Connect to Supabase (update .env)
   - Run seed script or use Prisma Studio to import

### Option 2: Using SQL Scripts

1. Create a migration script to copy data
2. Run it after connecting to Supabase

---

## 🎯 Using Supabase Features

### Storage (for images)

```typescript
import { supabase } from '@/lib/supabase'

// Upload file
const { data, error } = await supabase.storage
  .from('product-images')
  .upload('path/to/file.jpg', file)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl('path/to/file.jpg')
```

### Realtime Subscriptions

```typescript
import { supabase } from '@/lib/supabase'

// Subscribe to changes
const channel = supabase
  .channel('products')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'Product' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

---

## ✅ Verification Checklist

- [ ] Supabase credentials obtained
- [ ] `.env` file updated with DATABASE_URL
- [ ] Prisma schema updated to PostgreSQL
- [ ] `npx prisma generate` completed successfully
- [ ] `npx prisma db push` completed successfully
- [ ] Test script runs without errors
- [ ] Application starts successfully
- [ ] Can create/read/update/delete data

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

## 🆘 Need Help?

If you encounter issues:
1. Check the error message carefully
2. Review the troubleshooting section above
3. Verify all environment variables are set correctly
4. Ensure Supabase project is active (not paused)
5. Check network/firewall settings

**Current Configuration:**
- **Project ID**: nvymbbrilznoqrsqbwqy
- **Region**: ap-southeast-1 (Singapore)
- **Database**: PostgreSQL 15
- **Connection**: Session Pooler (port 6543)
