import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteTestimonial } from './actions';
import TestimonialList from './TestimonialList';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Testimonials</h1>
          <p className="text-gray-600">Manage customer reviews</p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
        >
          + Add Testimonial
        </Link>
      </div>

      <TestimonialList testimonials={testimonials} />
    </div>
  );
}
