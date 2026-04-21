
import { google } from 'googleapis';
import 'dotenv/config';

async function testDrive() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    const drive = google.drive({ version: 'v3', auth: oauth2Client });

    try {
        console.log('Testing Drive Access...');
        const res = await drive.files.get({
            fileId: '1IHY7zY1o9H-ibIs7mHLXpuxkxBJsA4LC',
            fields: 'name, mimeType'
        });
        console.log('Success!', res.data);
    } catch (error: any) {
        console.error('Failure!', error.message);
        if (error.response) console.error(error.response.data);
    }
}

testDrive();
