'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const isActive = formData.get('isActive') === 'on';
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const metaKeywords = formData.get('metaKeywords') as string;

    // Check if slug is unique
    const existingCategory = await prisma.category.findUnique({
        where: { slug },
    });

    if (existingCategory) {
        throw new Error(`Slug "${slug}" is already in use. Please choose a different slug.`);
    }

    await prisma.category.create({
        data: {
            name,
            slug,
            description,
            isActive,
            metaTitle,
            metaDescription,
            metaKeywords,
        },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/');
    redirect('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const isActive = formData.get('isActive') === 'on';
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const metaKeywords = formData.get('metaKeywords') as string;

    // Note: Slug is not updatable after creation (intentionally omitted)
    // This prevents breaking existing URLs and links

    await prisma.category.update({
        where: { id },
        data: {
            name,
            description,
            isActive,
            metaTitle,
            metaDescription,
            metaKeywords,
        },
    });

    revalidatePath('/admin/categories');
    revalidatePath('/');
    redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
    return await deleteMultipleCategories([id]);
}

export async function deleteMultipleCategories(ids: string[]) {
    try {
        await prisma.category.deleteMany({
            where: { id: { in: ids } },
        });

        revalidatePath('/admin/categories');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting multiple categories:', error);
        return { error: 'Failed to delete selected categories' };
    }
}
