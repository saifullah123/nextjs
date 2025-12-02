import { prisma } from '@/lib/prisma';
import { updateTestimonial } from '../../actions';
import { notFound } from 'next/navigation';
import { TestimonialFormClient } from '@/components/TestimonialFormClient';

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
  });

  if (!testimonial) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Testimonial</h1>
        <p className="text-gray-600">Update testimonial information</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
        <TestimonialFormClient
          onSubmit={async (formData) => {
            'use server';
            await updateTestimonial(id, formData);
          }}
          initialData={{
            name: testimonial.name,
            role: testimonial.role || '',
            avatar: testimonial.avatar || '',
            rating: testimonial.rating,
            content: testimonial.content,
            isActive: testimonial.isActive,
          }}
          submitLabel="Update Testimonial"
        />
      </div>
    </div>
  );
}
