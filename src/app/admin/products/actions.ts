'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveUploadedFile, saveMultipleFiles } from '@/lib/upload';

export async function createProduct(formData: FormData) {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const sku = formData.get('sku') as string || null;
    const price = parseFloat(formData.get('price') as string);
    const quantity = parseInt(formData.get('quantity') as string) || 0;
    const shortDescription = formData.get('shortDescription') as string;
    const longDescription = formData.get('longDescription') as string;
    const isFeatured = formData.get('isFeatured') === 'on';
    const status = formData.get('status') as string || 'in_stock';
    const categoryId = formData.get('categoryId') as string;

    // Check if slug is unique
    const existingProduct = await prisma.product.findUnique({
        where: { slug },
    });

    if (existingProduct) {
        throw new Error(`Slug "${slug}" is already in use. Please choose a different slug.`);
    }

    // Check if SKU is unique (if provided)
    if (sku) {
        const existingSKU = await prisma.product.findUnique({
            where: { sku },
        });

        if (existingSKU) {
            throw new Error(`SKU "${sku}" is already in use. Please choose a different SKU.`);
        }
    }

    // Handle main image upload
    let mainImage = '';
    const mainImageFile = formData.get('mainImage') as File;
    if (mainImageFile && mainImageFile.size > 0) {
        mainImage = await saveUploadedFile(mainImageFile, 'products');
    }

    // Handle gallery images upload
    let galleryImages = '';
    const galleryFiles: File[] = [];
    let i = 0;
    while (formData.has(`galleryImages-${i}`)) {
        const file = formData.get(`galleryImages-${i}`) as File;
        if (file && file.size > 0) {
            galleryFiles.push(file);
        }
        i++;
    }

    if (galleryFiles.length > 0) {
        const galleryPaths = await saveMultipleFiles(galleryFiles, 'products/gallery');
        galleryImages = galleryPaths.join(',');
    }

    await prisma.product.create({
        data: {
            title,
            slug,
            sku,
            price,
            quantity,
            shortDescription,
            longDescription,
            mainImage,
            galleryImages,
            isFeatured,
            status,
            isActive: formData.get('isActive') === 'on',
            categoryId,
        },
    });

    revalidatePath('/admin/products');
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    // Slug is not updatable
    const sku = formData.get('sku') as string || null;
    const price = parseFloat(formData.get('price') as string);
    const quantity = parseInt(formData.get('quantity') as string) || 0;
    const shortDescription = formData.get('shortDescription') as string;
    const longDescription = formData.get('longDescription') as string;
    const isFeatured = formData.get('isFeatured') === 'on';
    const isActive = formData.get('isActive') === 'on';
    const status = formData.get('status') as string || 'in_stock';
    const categoryId = formData.get('categoryId') as string;

    // Check if SKU is unique (if provided and changed)
    if (sku) {
        const existingSKU = await prisma.product.findUnique({
            where: { sku },
        });

        if (existingSKU && existingSKU.id !== id) {
            throw new Error(`SKU "${sku}" is already in use. Please choose a different SKU.`);
        }
    }

    // Get current product to keep existing images if no new ones uploaded
    const currentProduct = await prisma.product.findUnique({
        where: { id },
    });

    // Handle main image upload
    let mainImage = currentProduct?.mainImage || '';
    const mainImageFile = formData.get('mainImage') as File;
    if (mainImageFile && mainImageFile.size > 0) {
        mainImage = await saveUploadedFile(mainImageFile, 'products');
    }

    // Handle gallery images upload
    let galleryImages = currentProduct?.galleryImages || '';
    const galleryFiles: File[] = [];
    let i = 0;
    while (formData.has(`galleryImages-${i}`)) {
        const file = formData.get(`galleryImages-${i}`) as File;
        if (file && file.size > 0) {
            galleryFiles.push(file);
        }
        i++;
    }

    if (galleryFiles.length > 0) {
        const galleryPaths = await saveMultipleFiles(galleryFiles, 'products/gallery');
        galleryImages = galleryPaths.join(',');
    }

    await prisma.product.update({
        where: { id },
        data: {
            title,
            // slug is intentionally omitted
            sku,
            price,
            quantity,
            shortDescription,
            longDescription,
            mainImage,
            galleryImages,
            isFeatured,
            status,
            isActive,
            categoryId,
        },
    });

    revalidatePath('/admin/products');
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id },
    });

    revalidatePath('/admin/products');
}
