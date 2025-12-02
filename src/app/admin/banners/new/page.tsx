import { createBanner } from '../actions';
import { BannerFormClient } from '@/components/BannerFormClient';

export default function NewBannerPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Add Banner</h1>
        <p className="text-gray-600">Create a new homepage banner</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
        <BannerFormClient
          onSubmit={createBanner}
          submitLabel="Create Banner"
        />
      </div>
    </div>
  );
}
