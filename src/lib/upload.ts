import { writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { google } from 'googleapis';
import { Readable } from 'stream';
import { unlink } from 'fs/promises';

export async function getDriveClient() {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
        return null;
    }

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        return google.drive({ version: 'v3', auth: oauth2Client });
    } catch (error) {
        console.error("Failed to create Drive client:", error);
        return null;
    }
}

export async function deleteFromStorage(url: string) {
    try {
        if (url.startsWith('https://drive.google.com')) {
            const fileId = new URL(url).searchParams.get('id');
            if (fileId) {
                const drive = await getDriveClient();
                if (drive) {
                    await drive.files.delete({ fileId });
                    console.log('✅ DRIVE DELETE SUCCESS! File ID:', fileId);
                }
            }
        }
    } catch (error: any) {
        console.error("❌ DELETE ERROR:", error.message);
    }
}

export async function saveUploadedFile(file: File, folder: string = 'products'): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // DEBUG LOGS
    console.log('--- Upload System Check ---');
    console.log('Has Client ID:', !!process.env.GOOGLE_CLIENT_ID);
    console.log('Has Client Secret:', !!process.env.GOOGLE_CLIENT_SECRET);
    console.log('Has Refresh Token:', !!process.env.GOOGLE_REFRESH_TOKEN);

    // Try Google Drive OAuth2
    const drive = await getDriveClient();
    if (drive) {
        try {
            console.log('Attempting Google Drive Upload...');
            const fileMetadata: any = {
                name: file.name,
            };
            
            if (process.env.GOOGLE_DRIVE_FOLDER_ID) {
                fileMetadata.parents = [process.env.GOOGLE_DRIVE_FOLDER_ID];
                console.log('Using Folder ID:', process.env.GOOGLE_DRIVE_FOLDER_ID);
            }
            
            const media = {
                mimeType: file.type,
                body: Readable.from(buffer),
            };

            const response = await drive.files.create({
                requestBody: fileMetadata,
                media: media,
                fields: 'id',
            });

            if (response.data.id) {
                console.log('✅ DRIVE UPLOAD SUCCESS! File ID:', response.data.id);
                // Grant public read permission
                await drive.permissions.create({
                    fileId: response.data.id,
                    requestBody: {
                        role: 'reader',
                        type: 'anyone',
                    },
                });
                
                return `https://drive.google.com/uc?export=view&id=${response.data.id}`;
            }
        } catch (error: any) {
            console.error("❌ GOOGLE DRIVE ERROR:", error.message);
            if (error.response) console.error("Details:", error.response.data);
            console.error("Falling back to local storage...");
        }
    } else {
        console.warn('⚠️ Google Drive credentials missing in .env! Skipping Drive upload.');
    }

    // Fallback to local storage removed as per user request
    throw new Error('Google Drive upload failed. Please check your credentials and network connection.');
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
