'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveUploadedFile, deleteFromStorage } from '@/lib/upload';

export async function createBanner(formData: FormData) {
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const link = formData.get('link') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const isActive = formData.get('isActive') === 'on';

    // Handle image upload
    let image = '';
    const imageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
        image = await saveUploadedFile(imageFile, 'banners');
    } else if (imageUrl) {
        image = imageUrl;
    }

    // Validation: Require at least one media
    if (!image) {
        throw new Error('An image is required');
    }

    await prisma.banner.create({
        data: {
            title,
            subtitle,
            image: image || null,
            video: null,
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
    const imageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
        image = await saveUploadedFile(imageFile, 'banners');
    } else if (imageUrl) {
        image = imageUrl;
    }

    await prisma.banner.update({
        where: { id },
        data: {
            title,
            subtitle,
            image: image || null,
            video: null,
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
    return await deleteMultipleBanners([id]);
}

export async function deleteMultipleBanners(ids: string[]) {
    try {
        const banners = await prisma.banner.findMany({
            where: { id: { in: ids } },
        });

        for (const banner of banners) {
            if (banner.image) await deleteFromStorage(banner.image);
            if (banner.video) await deleteFromStorage(banner.video);
        }

        await prisma.banner.deleteMany({
            where: { id: { in: ids } },
        });

        revalidatePath('/admin/banners');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting multiple banners:', error);
        return { error: 'Failed to delete selected banners' };
    }
}
