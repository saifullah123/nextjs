import { prisma } from './src/lib/prisma';
import { verifyPassword, createToken, setAuthCookie } from './src/lib/auth';

async function simulateLogin() {
    const email = 'admin@example.com';
    const password = 'admin123';

    console.log('🔐 Simulating login for:', email);

    try {
        // Step 1: Find user
        console.log('🔍 Looking up user...');
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.error('❌ User not found');
            return;
        }

        console.log('✅ User found:', { id: user.id, email: user.email });

        // Step 2: Verify password
        console.log('🔑 Verifying password...');
        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            console.error('❌ Password verification failed');
            return;
        }

        console.log('✅ Password verified successfully');

        // Step 3: Create token
        console.log('🎫 Creating JWT token...');
        const token = await createToken(user.id);
        console.log('✅ Token created:', token.substring(0, 20) + '...');

        // Step 4: Simulate cookie setting (can't actually set in Node.js context)
        console.log('🍪 Cookie would be set with token');

        console.log('\n✅ Login simulation successful!');
        console.log('All authentication steps completed without errors.');

    } catch (error) {
        console.error('❌ Error during login simulation:', error);
    } finally {
        await prisma.$disconnect();
    }
}

simulateLogin();
