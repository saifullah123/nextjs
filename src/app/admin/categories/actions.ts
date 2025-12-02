'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const isActive = formData.get('isActive') === 'on';

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
        },
    });

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const isActive = formData.get('isActive') === 'on';

    // Note: Slug is not updatable after creation (intentionally omitted)
    // This prevents breaking existing URLs and links

    await prisma.category.update({
        where: { id },
        data: {
            name,
            description,
            isActive,
        },
    });

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
    await prisma.category.delete({
        where: { id },
    });

    revalidatePath('/admin/categories');
}
