import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const email = (formData.get('email') as string)?.trim();
        const password = formData.get('password') as string;

        console.log('🔐 Debug login attempt:', { email, passwordLength: password?.length });

        const steps: any[] = [];

        // Step 1: Validate input
        if (!email || !password) {
            steps.push({ step: 'validate', status: 'failed', message: 'Missing credentials' });
            return NextResponse.json({ success: false, error: 'Missing credentials', steps });
        }
        steps.push({ step: 'validate', status: 'success' });

        // Step 2: Find user
        console.log('🔍 Looking up user...');
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            steps.push({ step: 'findUser', status: 'failed', message: 'User not found' });
            console.log('❌ User not found');
            return NextResponse.json({ success: false, error: 'User not found', steps });
        }
        steps.push({ step: 'findUser', status: 'success', userId: user.id });
        console.log('✅ User found:', user.id);

        // Step 3: Verify password
        console.log('🔑 Verifying password...');
        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            steps.push({ step: 'verifyPassword', status: 'failed' });
            console.log('❌ Password verification failed');
            return NextResponse.json({ success: false, error: 'Invalid password', steps });
        }
        steps.push({ step: 'verifyPassword', status: 'success' });
        console.log('✅ Password verified');

        // Step 4: Create token
        console.log('🎫 Creating token...');
        const token = await createToken(user.id);
        steps.push({ step: 'createToken', status: 'success', tokenPreview: token.substring(0, 20) + '...' });
        console.log('✅ Token created');

        // Step 5: Set cookie
        console.log('🍪 Setting auth cookie...');
        await setAuthCookie(token);
        steps.push({ step: 'setCookie', status: 'success' });
        console.log('✅ Cookie set');

        console.log('✅ Login successful!');
        return NextResponse.json({
            success: true,
            message: 'Login successful!',
            user: { id: user.id, email: user.email, name: user.name },
            steps
        });

    } catch (error: any) {
        console.error('❌ Debug login error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
