'use server';

import { createServerSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { saveUploadedFile, saveMultipleFiles } from '@/lib/upload';

export async function createProduct(formData: FormData) {
    const supabase = createServerSupabaseClient();

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const sku = formData.get('sku') as string || null;
    const price = parseFloat(formData.get('price') as string);
    const quantityStr = formData.get('quantity') as string;
    const quantity = quantityStr !== '' ? parseInt(quantityStr) : 0; // Default to 0 if NaN

    if (isNaN(quantity)) {
        throw new Error('Quantity is required');
    }
    const shortDescription = formData.get('shortDescription') as string;
    const longDescription = formData.get('longDescription') as string;
    const isFeatured = formData.get('isFeatured') === 'on';
    const status = formData.get('status') as string || 'in_stock';
    const categoryId = formData.get('categoryId') as string;

    // Check if slug is unique
    const { data: existingProduct } = await supabase
        .from('Product')
        .select('id')
        .eq('slug', slug)
        .single();

    if (existingProduct) {
        throw new Error(`Slug "${slug}" is already in use. Please choose a different slug.`);
    }

    // Check if SKU is unique (if provided)
    if (sku) {
        const { data: existingSKU } = await supabase
            .from('Product')
            .select('id')
            .eq('sku', sku)
            .single();

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
    const rawGalleryFiles = formData.getAll('galleryImages') as File[];
    const galleryFiles = rawGalleryFiles.filter(file => file.size > 0);
    console.log('Total gallery files to upload:', galleryFiles.length);

    if (galleryFiles.length > 0) {
        const galleryPaths = await saveMultipleFiles(galleryFiles, 'products/gallery');
        galleryImages = galleryPaths.join(',');
    }

    const { error } = await supabase.from('Product').insert({
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
        metaTitle: formData.get('metaTitle') as string,
        metaDescription: formData.get('metaDescription') as string,
        metaKeywords: formData.get('metaKeywords') as string,
        // Supabase handles createdAt/updatedAt automatically if defined as default(now())
    });

    if (error) {
        console.error('Error creating product:', error);
        throw new Error('Failed to create product');
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
    const supabase = createServerSupabaseClient();

    const title = formData.get('title') as string;
    // Slug is not updatable
    const sku = formData.get('sku') as string || null;
    const price = parseFloat(formData.get('price') as string);
    const quantityStr = formData.get('quantity') as string;
    const quantity = quantityStr !== '' ? parseInt(quantityStr) : 0;

    if (isNaN(quantity)) {
        throw new Error('Quantity is required');
    }
    const shortDescription = formData.get('shortDescription') as string;
    const longDescription = formData.get('longDescription') as string;
    const isFeatured = formData.get('isFeatured') === 'on';
    const isActive = formData.get('isActive') === 'on';
    const status = formData.get('status') as string || 'in_stock';
    const categoryId = formData.get('categoryId') as string;
    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const metaKeywords = formData.get('metaKeywords') as string;

    // Check if SKU is unique (if provided and changed)
    if (sku) {
        const { data: existingSKU } = await supabase
            .from('Product')
            .select('id')
            .eq('sku', sku)
            .single();

        if (existingSKU && existingSKU.id !== id) {
            throw new Error(`SKU "${sku}" is already in use. Please choose a different SKU.`);
        }
    }

    // Get current product to keep existing images if no new ones uploaded
    const { data: currentProduct } = await supabase
        .from('Product')
        .select('mainImage')
        .eq('id', id)
        .single();

    // Handle main image upload
    let mainImage = currentProduct?.mainImage || '';
    const mainImageFile = formData.get('mainImage') as File;
    if (mainImageFile && mainImageFile.size > 0) {
        mainImage = await saveUploadedFile(mainImageFile, 'products');
    }

    // Handle gallery images upload
    const existingGalleryImagesJson = formData.get('existingGalleryImages') as string;
    let existingGalleryImages: string[] = [];
    if (existingGalleryImagesJson) {
        try {
            existingGalleryImages = JSON.parse(existingGalleryImagesJson);
        } catch (e) {
            console.error('Failed to parse existingGalleryImages', e);
        }
    }

    const rawGalleryFiles = formData.getAll('galleryImages') as File[];
    const galleryFiles = rawGalleryFiles.filter(file => file.size > 0);
    console.log('Update: Total gallery files to upload:', galleryFiles.length);

    let newGalleryPaths: string[] = [];
    if (galleryFiles.length > 0) {
        newGalleryPaths = await saveMultipleFiles(galleryFiles, 'products/gallery');
    }

    const galleryImages = [...existingGalleryImages, ...newGalleryPaths].join(',');

    const { error } = await supabase
        .from('Product')
        .update({
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
            metaTitle,
            metaDescription,
            metaKeywords,
            updatedAt: new Date().toISOString(),
        })
        .eq('id', id);

    if (error) {
        console.error('Error updating product:', error);
        throw new Error('Failed to update product');
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    redirect('/admin/products');
}

export async function deleteProduct(id: string) {
    const supabase = createServerSupabaseClient();

    // Check if product exists before deleting? Not strictly necessary for delete,
    // but good practice if we were deleting related images too.

    const { error } = await supabase
        .from('Product')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        // Don't throw here to avoid crashing the UI entirely if possible, or handle it in UI
    }

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
}
