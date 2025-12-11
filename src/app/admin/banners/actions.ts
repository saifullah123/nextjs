'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveUploadedFile } from '@/lib/upload';

export async function createBanner(formData: FormData) {
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const link = formData.get('link') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const isActive = formData.get('isActive') === 'on';

    // Handle image upload
    let image = '';
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
        image = await saveUploadedFile(imageFile, 'banners');
    } else {
        throw new Error('Banner image is required');
    }

    await prisma.banner.create({
        data: {
            title,
            subtitle,
            image,
            link,
            order,
            isActive,
        },
    });

    revalidatePath('/admin/banners');
    revalidatePath('/');
    redirect('/admin/banners');
}

export async function updateBanner(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const link = formData.get('link') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const isActive = formData.get('isActive') === 'on';

    const currentBanner = await prisma.banner.findUnique({
        where: { id },
    });

    if (!currentBanner) {
        throw new Error('Banner not found');
    }

    // Handle image upload
    let image = currentBanner.image;
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
        image = await saveUploadedFile(imageFile, 'banners');
    }

    await prisma.banner.update({
        where: { id },
        data: {
            title,
            subtitle,
            image,
            link,
            order,
            isActive,
        },
    });

    revalidatePath('/admin/banners');
    revalidatePath('/');
    redirect('/admin/banners');
}

export async function deleteBanner(id: string) {
    await prisma.banner.delete({
        where: { id },
    });

    revalidatePath('/admin/banners');
    revalidatePath('/');
}
