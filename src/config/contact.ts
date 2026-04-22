/**
 * Contact Information Configuration
 * 
 * This file contains all contact information for the website.
 * Update this file when contact details change.
 */

export const CONTACT_INFO = {
    // Primary contact email - Update this when email changes
    email: 'ksaifullah680@gmail.com',

    // Alternative contact methods (optional)
    phone: '', // Removed as per request
    address: 'India', // Updated with your requested location

    // Business hours (optional)
    businessHours: 'Monday - Saturday: 10:00 AM - 7:00 PM',

    // Social media links
    social: {
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
    },

    // Company information
    company: {
        name: 'Net Gate',
        tagline: 'Luxury Performance - Unrivaled Comfort For Your Companion',
        description: 'Crafting premium equestrian gear that marries centuries-old saddlery traditions with modern performance innovation.',
    }
} as const;
