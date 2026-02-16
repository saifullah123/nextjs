'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
// Note: Local file system saving will not work on Vercel.
// We need to move to Supabase Storage for production efficiently.
// For now, we'll try to keep the logic but wrap it to not crash if it fails, or better yet, just fix the DB part.
import { saveUploadedFile, saveMultipleFiles } from '@/lib/upload';

export async function createProduct(formData: FormData) {
    try {
        // 1. Validate Basic Inputs first
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const sku = formData.get('sku') as string || null;
        const price = parseFloat(formData.get('price') as string);
        const quantityStr = formData.get('quantity') as string;
        const quantity = quantityStr !== '' ? parseInt(quantityStr) : 0;
        const categoryId = formData.get('categoryId') as string;

        if (isNaN(quantity)) return { error: 'Quantity is required' };
        if (!title || !slug || !price || !categoryId) return { error: 'Missing required fields' };

        // 2. Check Uniqueness using Prisma
        const existingSlug = await prisma.product.findUnique({ where: { slug } });
        if (existingSlug) return { error: `Slug "${slug}" is already in use.` };

        if (sku) {
            const existingSKU = await prisma.product.findUnique({ where: { sku } });
            if (existingSKU) return { error: `SKU "${sku}" is already in use.` };
        }

        // 3. Handle Images (Note: Local file writes fail on Vercel)
        let mainImage = '';
        try {
            const mainImageFile = formData.get('mainImage') as File;
            if (mainImageFile && mainImageFile.size > 0) {
                mainImage = await saveUploadedFile(mainImageFile, 'products');
            }
        } catch (e) {
            console.error("Image upload failed (likely read-only fs):", e);
        }

        let galleryImages = '';
        try {
            const rawGalleryFiles = formData.getAll('galleryImages') as File[];
            const galleryFiles = rawGalleryFiles.filter(file => file.size > 0);
            if (galleryFiles.length > 0) {
                const galleryPaths = await saveMultipleFiles(galleryFiles, 'products/gallery');
                galleryImages = galleryPaths.join(',');
            }
        } catch (e) {
            console.error("Gallery upload failed:", e);
        }

        // 4. Create in Database using Prisma
        await prisma.product.create({
            data: {
                title,
                slug,
                sku,
                price,
                quantity,
                shortDescription: formData.get('shortDescription') as string,
                longDescription: formData.get('longDescription') as string,
                mainImage,
                galleryImages,
                isFeatured: formData.get('isFeatured') === 'on',
                status: formData.get('status') as string || 'in_stock',
                isActive: formData.get('isActive') === 'on',
                categoryId,
                metaTitle: formData.get('metaTitle') as string,
                metaDescription: formData.get('metaDescription') as string,
                metaKeywords: formData.get('metaKeywords') as string,
            }
        });

    } catch (error: any) {
        console.error('Create Product Error:', error);
        return { error: `Failed to create product: ${error.message}` };
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const sku = formData.get('sku') as string || null;
        const price = parseFloat(formData.get('price') as string);
        const quantityStr = formData.get('quantity') as string;
        const quantity = quantityStr !== '' ? parseInt(quantityStr) : 0;
        const categoryId = formData.get('categoryId') as string;

        if (isNaN(quantity)) return { error: 'Quantity is required' };

        // Check SKU uniqueness if changed
        if (sku) {
            const existingSKU = await prisma.product.findUnique({ where: { sku } });
            if (existingSKU && existingSKU.id !== id) {
                return { error: `SKU "${sku}" is already in use.` };
            }
        }

        // Get current product to keep existing images
        const currentProduct = await prisma.product.findUnique({
            where: { id },
            select: { mainImage: true }
        });

        // Handle main image upload
        let mainImage = currentProduct?.mainImage || '';
        try {
            const mainImageFile = formData.get('mainImage') as File;
            if (mainImageFile && mainImageFile.size > 0) {
                mainImage = await saveUploadedFile(mainImageFile, 'products');
            }
        } catch (e) {
            console.error("Image upload failed:", e);
        }

        // Handle gallery images
        const existingGalleryImagesJson = formData.get('existingGalleryImages') as string;
        let existingGalleryImages: string[] = [];
        if (existingGalleryImagesJson) {
            try {
                existingGalleryImages = JSON.parse(existingGalleryImagesJson);
            } catch (e) {
                console.error('Failed to parse existingGalleryImages', e);
            }
        }

        let newGalleryPaths: string[] = [];
        try {
            const rawGalleryFiles = formData.getAll('galleryImages') as File[];
            const galleryFiles = rawGalleryFiles.filter(file => file.size > 0);
            if (galleryFiles.length > 0) {
                newGalleryPaths = await saveMultipleFiles(galleryFiles, 'products/gallery');
            }
        } catch (e) {
            console.error("Gallery upload failed:", e);
        }

        const galleryImages = [...existingGalleryImages, ...newGalleryPaths].join(',');

        await prisma.product.update({
            where: { id },
            data: {
                title,
                sku,
                price,
                quantity,
                shortDescription: formData.get('shortDescription') as string,
                longDescription: formData.get('longDescription') as string,
                mainImage,
                galleryImages,
                isFeatured: formData.get('isFeatured') === 'on',
                status: formData.get('status') as string || 'in_stock',
                isActive: formData.get('isActive') === 'on',
                categoryId,
                metaTitle: formData.get('metaTitle') as string,
                metaDescription: formData.get('metaDescription') as string,
                metaKeywords: formData.get('metaKeywords') as string,
            }
        });
    } catch (error: any) {
        console.error('Update Product Error:', error);
        return { error: `Failed to update product: ${error.message}` };
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id }
        });
    } catch (error) {
        console.error('Error deleting product:', error);
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
}
