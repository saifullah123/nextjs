import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
    console.log('🔄 Testing Supabase connection...\n')

    try {
        // Test database connection
        await prisma.$connect()
        console.log('✅ Successfully connected to Supabase database!\n')

        // Test queries
        console.log('📊 Running test queries...')

        const userCount = await prisma.user.count()
        console.log(`   Users: ${userCount}`)

        const categoryCount = await prisma.category.count()
        console.log(`   Categories: ${categoryCount}`)

        const productCount = await prisma.product.count()
        console.log(`   Products: ${productCount}`)

        const testimonialCount = await prisma.testimonial.count()
        console.log(`   Testimonials: ${testimonialCount}`)

        const bannerCount = await prisma.banner.count()
        console.log(`   Banners: ${bannerCount}`)

        const messageCount = await prisma.contactMessage.count()
        console.log(`   Contact Messages: ${messageCount}`)

        console.log('\n✅ All tests passed! Your Supabase connection is working perfectly.')

    } catch (error) {
        console.error('\n❌ Connection failed!')
        console.error('Error details:', error)
        console.error('\n💡 Troubleshooting tips:')
        console.error('   1. Check your DATABASE_URL in .env file')
        console.error('   2. Ensure the format is: postgresql://postgres.nvymbbrilznoqrsqbwqy:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres')
        console.error('   3. Verify your Supabase project is not paused')
        console.error('   4. Check if you\'re behind a firewall blocking port 6543')
    } finally {
        await prisma.$disconnect()
    }
}

testConnection()
