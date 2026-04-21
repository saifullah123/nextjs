'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveUploadedFile, deleteFromStorage } from '@/lib/upload';

export async function createTestimonial(formData: FormData) {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const rating = parseInt(formData.get('rating') as string);
    const content = formData.get('content') as string;
    const isActive = formData.get('isActive') === 'on';

    // Handle avatar upload
    let avatar = '';
    const avatarUrl = formData.get('avatarUrl') as string;
    const avatarFile = formData.get('avatar') as File;
    if (avatarFile && avatarFile.size > 0) {
        avatar = await saveUploadedFile(avatarFile, 'testimonials');
    } else if (avatarUrl) {
        avatar = avatarUrl;
    }

    await prisma.testimonial.create({
        data: {
            name,
            role,
            avatar,
            rating,
            content,
            isActive,
        },
    });

    revalidatePath('/admin/testimonials');
    revalidatePath('/', 'layout');
    redirect('/admin/testimonials');
}

export async function updateTestimonial(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const rating = parseInt(formData.get('rating') as string);
    const content = formData.get('content') as string;
    const isActive = formData.get('isActive') === 'on';

    const currentTestimonial = await prisma.testimonial.findUnique({
        where: { id },
    });

    // Handle avatar upload
    let avatar = currentTestimonial?.avatar || '';
    const avatarUrl = formData.get('avatarUrl') as string;
    const avatarFile = formData.get('avatar') as File;
    if (avatarFile && avatarFile.size > 0) {
        avatar = await saveUploadedFile(avatarFile, 'testimonials');
    } else if (avatarUrl) {
        avatar = avatarUrl;
    }

    console.log(`Updating testimonial ${id} with rating: ${rating}`);
    await prisma.testimonial.update({
        where: { id },
        data: {
            name,
            role,
            avatar,
            rating,
            content,
            isActive,
        },
    });

    revalidatePath('/admin/testimonials');
    revalidatePath('/', 'layout');
    redirect('/admin/testimonials');
}

export async function deleteTestimonial(id: string) {
    return await deleteMultipleTestimonials([id]);
}

export async function deleteMultipleTestimonials(ids: string[]) {
    try {
        const testimonials = await prisma.testimonial.findMany({
            where: { id: { in: ids } },
        });

        for (const t of testimonials) {
            if (t.avatar) await deleteFromStorage(t.avatar);
        }

        await prisma.testimonial.deleteMany({
            where: { id: { in: ids } },
        });

        revalidatePath('/admin/testimonials');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Error deleting multiple testimonials:', error);
        return { error: 'Failed to delete selected testimonials' };
    }
}
