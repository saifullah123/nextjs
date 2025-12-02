import { createTestimonial } from '../actions';
import { TestimonialFormClient } from '@/components/TestimonialFormClient';

export default function NewTestimonialPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Add Testimonial</h1>
        <p className="text-gray-600">Create a new customer testimonial</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
        <TestimonialFormClient
          onSubmit={createTestimonial}
          submitLabel="Create Testimonial"
        />
      </div>
    </div>
  );
}
