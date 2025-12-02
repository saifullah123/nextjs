# ProductCase - Complete Product Website

A full-stack e-commerce website built with Next.js 14, TypeScript, Tailwind CSS, and Prisma with SQLite.

## Features

### 🌐 Public Frontend
- **Hero Banner**: Eye-catching homepage banner slider with CTA
- **Global Search**: Search bar in header available on all pages
- **Category Tabs**: Interactive product filtering by category
- **Product Listings**: Beautiful product cards with images and pricing
- **Product Details**: Comprehensive product pages with galleries
- **Testimonials**: Auto-rotating customer review slider
- **Contact Form**: Functional contact form with database storage
- **About Page**: Company information and mission
- **Mobile Menu**: Fully functional responsive navigation
- **Custom 404 Page**: Beautiful error page with helpful links
- **Responsive Design**: Mobile-first, fully responsive layout
- **SEO Optimized**: Dynamic metadata for all pages

### 🔐 Admin Panel (`/admin`)
- **Authentication**: Secure login with JWT and HTTP-only cookies
- **Dashboard**: Overview with statistics cards
- **Category Management**: Full CRUD for product categories
- **Product Management**: Full CRUD for products with image URLs
- **Banner Management**: Full CRUD for homepage banners
- **Testimonial Management**: Full CRUD for customer reviews
- **Contact Messages**: View submitted contact form messages
- **Protected Routes**: Middleware-based route protection
- **Responsive Admin**: Mobile-friendly sidebar with toggle menu

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with jose + bcryptjs
- **UI Components**: Custom React components

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd e:/nextjs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   The database is already configured with SQLite. The `.env` file contains:
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. **Run database migrations** (if not already done):
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

6. **Seed the database** (optional - creates sample data):
   ```bash
   npm run seed
   ```
   
   **Note**: If you encounter Prisma v7 adapter issues with the seed script, you can manually create data through the admin panel instead.

### Running the Application

1. **Development mode**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

2. **Production build**:
   ```bash
   npm run build
   npm start
   ```

## Default Admin Credentials

- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## Project Structure

```
e:/nextjs/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed data script
│   └── migrations/            # Database migrations
├── src/
│   ├── app/
│   │   ├── (public)/          # Public-facing pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── products/      # Product pages
│   │   │   ├── contact/       # Contact page
│   │   │   └── about/         # About page
│   │   ├── admin/             # Admin panel
│   │   │   ├── login/         # Admin login
│   │   │   ├── categories/    # Category CRUD
│   │   │   ├── products/      # Product CRUD
│   │   │   ├── testimonials/  # Testimonial CRUD
│   │   │   └── messages/      # Contact messages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── CategoryTabs.tsx
│   │   └── TestimonialSlider.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   └── auth.ts            # Authentication utilities
│   └── middleware.ts          # Route protection
└── package.json
```

## Database Models

- **User**: Admin users with hashed passwords
- **Category**: Product categories (name, slug, description)
- **Product**: Products with pricing, images, and category relations
- **Testimonial**: Customer reviews with ratings
- **ContactMessage**: Form submissions from contact page

## Key Features Implementation

### Authentication
- JWT-based authentication with HTTP-only cookies
- Password hashing with bcryptjs
- Middleware protection for admin routes
- Automatic redirect for authenticated users

### Admin CRUD Operations
- Server Actions for all mutations
- Optimistic UI updates with revalidation
- Form validation and error handling
- Confirmation dialogs for deletions

### Frontend Features
- Server Components for data fetching
- Client Components for interactivity
- Image optimization ready (add next/image)
- SEO-friendly metadata

## Customization

### Adding Products
1. Log in to admin panel at `/admin/login`
2. Navigate to Products section
3. Click "Add Product"
4. Fill in details and image URLs (use Unsplash or your own images)

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind config for custom colors
- Component styles use Tailwind utility classes

### Database
- To switch from SQLite to PostgreSQL:
  1. Update `prisma/schema.prisma` datasource
  2. Update `DATABASE_URL` in `.env`
  3. Run `npx prisma migrate dev`

## Troubleshooting

### Prisma v7 Adapter Issues
If you encounter issues with the Prisma adapter when running the seed script:
1. You can manually create data through the admin panel
2. Or downgrade to Prisma v5 by updating package.json

### Build Errors
- Run `npx prisma generate` if you see Prisma client errors
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`

## Production Deployment

1. **Update environment variables**:
   - Change `JWT_SECRET` to a strong random string
   - Update `DATABASE_URL` for production database

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Deploy to Vercel/Netlify**:
   - Connect your Git repository
   - Set environment variables
   - Deploy!

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please create an issue in the repository or contact the development team.
