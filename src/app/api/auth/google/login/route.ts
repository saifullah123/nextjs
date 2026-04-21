import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('--- Google Auth Debug ---');
  console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Found (starts with ' + process.env.GOOGLE_CLIENT_ID.substring(0, 10) + ')' : 'MISSING');
  console.log('Redirect URI:', process.env.GOOGLE_REDIRECT_URI);
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // CRITICAL: This gives us the Refresh Token
    scope: ['https://www.googleapis.com/auth/drive'],
    prompt: 'consent', // Forces it to show the refresh token every time we test
  });

  return NextResponse.redirect(authUrl);
}
