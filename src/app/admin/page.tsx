import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [productCount, categoryCount, testimonialCount, messageCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.testimonial.count(),
    prisma.contactMessage.count(),
  ]);

  const stats = [
    { label: 'Total Products', value: productCount, icon: '📦', color: 'from-blue-500 to-cyan-500' },
    { label: 'Categories', value: categoryCount, icon: '📁', color: 'from-purple-500 to-pink-500' },
    { label: 'Testimonials', value: testimonialCount, icon: '⭐', color: 'from-orange-500 to-red-500' },
    { label: 'Messages', value: messageCount, icon: '✉️', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                {stat.icon}
              </div>
              <div className={`text-4xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
            </div>
            <h3 className="text-gray-600 font-medium">{stat.label}</h3>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition border border-blue-200"
          >
            <span className="text-2xl">➕</span>
            <span className="font-semibold text-gray-700">Add Product</span>
          </a>
          <a
            href="/admin/categories"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition border border-purple-200"
          >
            <span className="text-2xl">📂</span>
            <span className="font-semibold text-gray-700">Manage Categories</span>
          </a>
          <a
            href="/admin/messages"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition border border-green-200"
          >
            <span className="text-2xl">📬</span>
            <span className="font-semibold text-gray-700">View Messages</span>
          </a>
        </div>
      </div>
    </div>
  );
}
