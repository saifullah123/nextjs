'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { saveUploadedFile, deleteFromStorage } from '@/lib/upload';

export async function getMediaLibrary(folderId?: string) {
  try {
    const media = await prisma.media.findMany({
      where: folderId ? { folderId } : {},
      orderBy: { createdAt: 'desc' }
    });
    return media;
  } catch (error) {
    console.error("Failed to fetch media:", error);
    return [];
  }
}

export async function getFolders() {
  try {
    const folders = await prisma.folder.findMany({
      orderBy: { name: 'asc' }
    });
    return folders;
  } catch (error) {
    console.error("Failed to fetch folders:", error);
    return [];
  }
}

export async function createFolderAction(name: string) {
  try {
    const folder = await prisma.folder.create({
      data: { name }
    });
    revalidatePath('/admin/media');
    return { success: true, folder };
  } catch (error) {
    return { error: 'Failed to create folder' };
  }
}

export async function uploadMediaAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const folderId = formData.get('folderId') as string || null;
    
    if (!file) throw new Error('No file provided');

    // Make sure it's an image/video file
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
       throw new Error('Only images and videos are allowed');
    }

    const fileUrl = await saveUploadedFile(file, file.type.startsWith('video/') ? 'videos' : 'images');
    
    // Save to database
    const mediaRecord = await prisma.media.create({
      data: {
        name: file.name,
        url: fileUrl,
        type: file.type,
        size: file.size,
        folderId: folderId && folderId !== 'all' ? folderId : null
      }
    });

    revalidatePath('/admin/media');
    return { success: true, media: mediaRecord };
  } catch (error: any) {
    console.error("Media upload failed:", error);
    return { error: error.message || 'Upload failed' };
  }
}

export async function deleteMediaAction(id: string) {
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (media) {
        await deleteFromStorage(media.url);
        await prisma.media.delete({ where: { id } });
    }
    revalidatePath('/admin/media');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete media' };
  }
}

export async function deleteMultipleMediaAction(ids: string[]) {
  try {
    const mediaItems = await prisma.media.findMany({
      where: { id: { in: ids } }
    });

    for (const item of mediaItems) {
      await deleteFromStorage(item.url);
    }

    await prisma.media.deleteMany({
      where: { id: { in: ids } }
    });

    revalidatePath('/admin/media');
    return { success: true };
  } catch (error) {
    console.error("Bulk delete failed:", error);
    return { error: 'Failed to delete selected media' };
  }
}

export async function deleteFolderAction(id: string) {
  try {
    // Delete all media in this folder first? Or just nullify them?
    // Let's just nullify for safety, or we could delete them.
    // Usually, users expect files to be gone if folder is deleted.
    // For now, let's keep it simple and just delete the folder if empty or disconnect.
    await prisma.media.updateMany({
        where: { folderId: id },
        data: { folderId: null }
    });
    await prisma.folder.delete({ where: { id } });
    revalidatePath('/admin/media');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete folder' };
  }
}
