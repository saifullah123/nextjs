import { prisma } from './src/lib/prisma';
import { verifyPassword } from './src/lib/auth';

async function testLogin() {
    const email = 'admin@example.com';
    const password = 'admin123';

    console.log('Testing login for:', email);

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error('❌ User not found in database');
        return;
    }

    console.log('✅ User found:', { id: user.id, email: user.email, name: user.name });
    console.log('Password hash in DB:', user.password.substring(0, 20) + '...');

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (isValid) {
        console.log('✅ Password verification successful!');
    } else {
        console.error('❌ Password verification failed!');
    }

    await prisma.$disconnect();
}

testLogin().catch(console.error);
