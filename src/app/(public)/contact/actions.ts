'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendContactEmail } from '@/lib/email';

export async function submitContactForm(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const product = formData.get('product') as string;
    const size = formData.get('size') as string;
    const color = formData.get('color') as string;

    // Construct full message with product details if available
    let fullMessage = message;
    if (product || size || color) {
        fullMessage = `--- PRODUCT INQUIRY DETAILS ---\n` +
            (product ? `Product: ${product}\n` : '') +
            (size ? `Size: ${size}\n` : '') +
            (color ? `Color: ${color}\n` : '') +
            `-------------------------------\n\n` +
            message;
    }

    if (!name || !email || !message) {
        return { error: 'Please fill in all required fields' };
    }

    try {
        // Save to database
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone,
                message: fullMessage,
            },
        });

        // Send email notification
        try {
            await sendContactEmail({
                name,
                email,
                phone: phone || undefined,
                message: fullMessage,
            });
        } catch (emailError: any) {
            console.error('Email sending failed details:', {
                message: emailError.message,
                code: emailError.code,
                command: emailError.command,
                stack: emailError.stack
            });
            // Continue even if email fails - message is saved in database
        }

        revalidatePath('/contact');
        return { success: true };
    } catch (error) {
        console.error('Contact form error:', error);
        return { error: 'Failed to submit contact form. Please try again.' };
    }
}
