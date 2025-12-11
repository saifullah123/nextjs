'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveUploadedFile } from '@/lib/upload';

export async function createTestimonial(formData: FormData) {
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const rating = parseInt(formData.get('rating') as string);
    const content = formData.get('content') as string;
    const isActive = formData.get('isActive') === 'on';

    // Handle avatar upload
    let avatar = '';
    const avatarFile = formData.get('avatar') as File;
    if (avatarFile && avatarFile.size > 0) {
        avatar = await saveUploadedFile(avatarFile, 'testimonials');
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
    const avatarFile = formData.get('avatar') as File;
    if (avatarFile && avatarFile.size > 0) {
        avatar = await saveUploadedFile(avatarFile, 'testimonials');
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
    await prisma.testimonial.delete({
        where: { id },
    });

    revalidatePath('/admin/testimonials');
    revalidatePath('/', 'layout');
}
