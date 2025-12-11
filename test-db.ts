import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres.nvymbbrilznoqrsqbwqy:admin123@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
        }
    }
})

async function main() {
    try {
        await prisma.$connect()
        console.log("Connected successfully!")
    } catch (e) {
        console.error("Connection failed:", e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
