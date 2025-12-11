import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export async function saveUploadedFile(file: File, folder: string = 'products'): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
    if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = file.name.split('.').pop();
    const filename = `${uniqueSuffix}.${extension}`;
    const filepath = join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Return public URL path
    return `/uploads/${folder}/${filename}`;
}

export async function saveMultipleFiles(files: File[], folder: string = 'products'): Promise<string[]> {
    const paths: string[] = [];
    for (const file of files) {
        try {
            const path = await saveUploadedFile(file, folder);
            paths.push(path);
        } catch (error) {
            console.error(`Failed to save file ${file.name}:`, error);
        }
    }
    return paths;
}
