import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteTestimonial } from './actions';
import { GenericDeleteButton } from '@/components/GenericDeleteButton';

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

      <div className="grid gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="flex items-start gap-4">
              {testimonial.avatar && (
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{testimonial.name}</h3>
                    {testimonial.role && (
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        testimonial.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {testimonial.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex gap-3">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                  <GenericDeleteButton
                    itemId={testimonial.id}
                    itemName="testimonial"
                    onDelete={async () => {
                      'use server';
                      await deleteTestimonial(testimonial.id);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-gray-500">
            No testimonials yet. Create your first testimonial!
          </div>
        )}
      </div>
    </div>
  );
}
