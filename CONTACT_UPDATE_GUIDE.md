# Contact Information Update Guide

## How to Update Your Email Address

If you need to change your contact email address in the future, follow these simple steps:

### Main Configuration File
**File to Update:** `src/config/contact.ts`

This is the **ONLY** file you need to edit to update your email address and other contact information.

### Current Email
```
ksaifullah680@gmail.com
```

### Steps to Update:

1. Open the file: `src/config/contact.ts`
2. Find the line with `email: 'ksaifullah680@gmail.com'`
3. Replace the email address with your new email
4. Save the file

That's it! The email will automatically update throughout the entire website including:
- Footer (with clickable mailto link)
- Any other components that use contact information

### Other Contact Information You Can Update

In the same file (`src/config/contact.ts`), you can also update:

- **Phone number**: Update the `phone` field
- **Business address**: Update the `address` field
- **Business hours**: Update the `businessHours` field
- **Social media links**: Update the `social` object (Facebook, Instagram, LinkedIn, Twitter)
- **Company information**: Update the `company` object (name, tagline, description)

### Example:

```typescript
export const CONTACT_INFO = {
  email: 'your-new-email@example.com',  // ← Change this line
  phone: '+1 (555) 987-6543',           // ← Or this
  // ... rest of the configuration
}
```

### Where This Email Appears:

Currently, your email appears in:
- **Footer component** (`src/components/Footer.tsx`) - as a clickable mailto link
- Any future components that import `CONTACT_INFO`

### Benefits of This Setup:

✅ **Single source of truth** - Update once, changes everywhere  
✅ **Easy to maintain** - No need to search through multiple files  
✅ **Type-safe** - TypeScript ensures consistency  
✅ **Centralized** - All contact info in one place  

---

**Last Updated:** December 2, 2025  
**Current Email:** ksaifullah680@gmail.com
