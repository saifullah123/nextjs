import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getDriveClient } from '@/lib/upload';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        let fileId = '';
        let mimeTypeFromDb = '';

        if (id.startsWith('drive_')) {
            fileId = id.replace('drive_', '');
        } else {
            // Fetch media record from database
            const media = await prisma.media.findUnique({
                where: { id }
            });

            if (!media) {
                return new NextResponse('Media not found', { status: 404 });
            }

            // Check if it's a Google Drive URL
            if (media.url.includes('drive.google.com')) {
                fileId = new URL(media.url).searchParams.get('id') || '';
                mimeTypeFromDb = media.type;
            } else {
                // If it's a local URL, redirect or serve it
                return NextResponse.redirect(new URL(media.url, request.url));
            }
        }

        if (!fileId) {
            return new NextResponse('Invalid Drive ID', { status: 400 });
        }

        const drive = await getDriveClient();
        if (!drive) {
            return new NextResponse('Drive client not initialized', { status: 500 });
        }

            // Get file metadata to get the correct mime type
            const fileMetadata = await drive.files.get({
                fileId: fileId,
                fields: 'mimeType, size'
            });

            const range = request.headers.get('range');
            
            // Fetch the file content as a stream
            const response = await drive.files.get(
                { fileId: fileId, alt: 'media' },
                { 
                    responseType: 'stream',
                    headers: range ? { Range: range } : {}
                }
            );

            // Create a web-compatible ReadableStream from the Node.js stream
            const nodeStream = response.data as any;
            const stream = new ReadableStream({
                start(controller) {
                    nodeStream.on('data', (chunk: any) => {
                        try { controller.enqueue(chunk); } catch (e) {}
                    });
                    nodeStream.on('end', () => {
                        try { controller.close(); } catch (e) {}
                    });
                    nodeStream.on('error', (err: any) => {
                        try { controller.error(err); } catch (e) {}
                    });
                },
                cancel() {
                    nodeStream.destroy();
                }
            });

            // Use the mime type from database as primary source if available, fallback to drive metadata
            let contentType = mimeTypeFromDb || fileMetadata.data.mimeType || 'application/octet-stream';
            
            // Force video mime type if it looks like a video or is from a drive ID with video prefix in metadata
            if (fileMetadata.data.mimeType?.startsWith('video/') || fileId.includes('video')) {
                contentType = fileMetadata.data.mimeType || 'video/mp4';
            }

            // Handle partial content (206) if range exists
            if (range) {
                return new NextResponse(stream, {
                    status: 206,
                    headers: {
                        'Content-Type': contentType,
                        'Content-Range': response.headers['content-range'] || `bytes 0-${Number(fileMetadata.data.size || 1) - 1}/${fileMetadata.data.size}`,
                        'Accept-Ranges': 'bytes',
                        'Content-Length': response.headers['content-length'] || '',
                        'Cache-Control': 'no-cache',
                    },
                });
            }

            // Return the full stream as a response (200)
            return new NextResponse(stream, {
                headers: {
                    'Content-Type': contentType,
                    'Content-Length': fileMetadata.data.size || '',
                    'Accept-Ranges': 'bytes',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });

    } catch (error: any) {
        console.error('Proxy Error:', error.message);
        return new NextResponse('Error fetching media', { status: 500 });
    }
}
