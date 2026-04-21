/**
 * Media utility functions shared between client and server.
 * This file MUST NOT import any Node.js specific modules (fs, path, googleapis, etc.)
 */

export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // If it's already a relative path or proxied URL, return it
  if (url.startsWith('/') || url.startsWith('blob:')) return url;
  
  if (url.includes('drive.google.com')) {
    try {
      const driveUrl = new URL(url);
      const fileId = driveUrl.searchParams.get('id');
      if (fileId) return `/api/media/drive_${fileId}`;
    } catch (e) {
      return url;
    }
  }
  
  return url;
}
