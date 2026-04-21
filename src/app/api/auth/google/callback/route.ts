import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    // We want the Refresh Token specifically
    if (tokens.refresh_token) {
        return new NextResponse(`
            <div style="font-family: sans-serif; padding: 40px; text-align: center;">
                <h1 style="color: #10b981;">Success! Google Connected.</h1>
                <p>Please copy the <b>Refresh Token</b> below and paste it into your <b>.env</b> file:</p>
                <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; font-family: monospace; word-break: break-all; margin: 20px 0;">
                    ${tokens.refresh_token}
                </div>
                <p style="color: #6b7280; font-size: 14px;">Once you've updated your .env, restart your server.</p>
            </div>
        `, {
            headers: { 'Content-Type': 'text/html' }
        });
    } else {
        return NextResponse.json({ 
            error: 'No refresh token returned. Try removing the app from your Google account settings and trying again.',
            details: tokens
        });
    }
  } catch (error: any) {
    console.error('Exchange error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
