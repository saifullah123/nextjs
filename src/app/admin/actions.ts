'use server';

import { prisma } from '@/lib/prisma';
import { verifyPassword, createToken, setAuthCookie, clearAuthCookie } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;

    console.log('Login attempt:', { email, passwordLength: password?.length });


    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { error: 'Invalid credentials' };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        return { error: 'Invalid credentials' };
    }

    const token = await createToken(user.id);
    await setAuthCookie(token);

    redirect('/admin');
}

export async function logoutAction() {
    await clearAuthCookie();
    redirect('/admin/login');
}
