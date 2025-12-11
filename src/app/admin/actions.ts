'use server';

import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken, setAuthCookie, clearAuthCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
    try {
        const email = (formData.get('email') as string)?.trim();
        const password = formData.get('password') as string;

        console.log('🔐 Login attempt:', { email, passwordLength: password?.length });

        if (!email || !password) {
            console.log('❌ Missing credentials');
            return { error: 'Email and password are required' };
        }

        console.log('🔍 Looking up user...');
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('❌ User not found');
            return { error: 'Invalid credentials' };
        }

        console.log('✅ User found:', user.id);
        console.log('🔑 Verifying password...');
        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            console.log('❌ Password verification failed');
            return { error: 'Invalid credentials' };
        }

        console.log('✅ Password verified');
        console.log('🎫 Creating token...');
        const token = await createToken(user.id);

        console.log('🍪 Setting auth cookie...');
        await setAuthCookie(token);

        console.log('✅ Login successful, redirecting to /admin');
        redirect('/admin');
    } catch (error) {
        console.error('❌ Login error:', error);
        return { error: 'An error occurred during login. Please try again.' };
    }
}

export async function logoutAction() {
    await clearAuthCookie();
    redirect('/admin/login');
}
