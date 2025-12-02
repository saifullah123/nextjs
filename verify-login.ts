
import { prisma } from './src/lib/prisma';
import { verifyPassword } from './src/lib/auth';

async function main() {
    const email = 'admin@example.com';
    const password = 'admin123';

    console.log(`Checking user: ${email}`);
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        console.error('❌ User not found');
        return;
    }

    console.log('✅ User found');
    console.log(`Stored hash: ${user.password}`);

    const isValid = await verifyPassword(password, user.password);
    if (isValid) {
        console.log('✅ Password matches');
    } else {
        console.error('❌ Password does NOT match');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
