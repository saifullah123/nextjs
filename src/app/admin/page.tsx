import { prisma } from '@/lib/prisma';
import { 
  Package, 
  Folder, 
  MessageSquare, 
  Star, 
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import Link from 'next/link';



export default async function AdminDashboard() {
  const [productCount, categoryCount, testimonialCount, messageCount] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.testimonial.count(),
    prisma.contactMessage.count(),
  ]);

  const stats = [
    { label: 'Total Products', value: productCount, icon: Package, color: 'from-blue-500 to-cyan-500' },
    { label: 'Categories', value: categoryCount, icon: Folder, color: 'from-purple-500 to-pink-500' },
    { label: 'Testimonials', value: testimonialCount, icon: Star, color: 'from-orange-500 to-red-500' },
    { label: 'Messages', value: messageCount, icon: MessageSquare, color: 'from-green-500 to-emerald-500' },
  ];

  const apps = [
    { name: 'Products', description: 'Manage your product inventory', href: '/admin/products', icon: Package, color: 'bg-blue-100 text-blue-600' },
    { name: 'Categories', description: 'Organize products into categories', href: '/admin/categories', icon: Folder, color: 'bg-purple-100 text-purple-600' },
    { name: 'Banners', description: 'Update homepage banners', href: '/admin/banners', icon: ImageIcon, color: 'bg-pink-100 text-pink-600' },
    { name: 'Testimonials', description: 'Moderate customer reviews', href: '/admin/testimonials', icon: Star, color: 'bg-orange-100 text-orange-600' },
    { name: 'Messages', description: 'View contact form submissions', href: '/admin/messages', icon: MessageSquare, color: 'bg-green-100 text-green-600' },
    { name: 'Add Product', description: 'Create a new product listing', href: '/admin/products/new', icon: Plus, color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`text-4xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
            </div>
            <h3 className="text-gray-600 font-medium">{stat.label}</h3>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <Link
              key={app.name}
              href={app.href}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:scale-[1.02] flex items-start gap-4 border border-transparent hover:border-gray-100"
            >
              <div className={`p-3 rounded-xl ${app.color}`}>
                <app.icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{app.name}</h3>
                <p className="text-gray-500 text-sm">{app.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
