import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            404
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">What would you like to do?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition border border-purple-200"
            >
              <span className="text-4xl">🏠</span>
              <span className="font-semibold text-gray-700">Go Home</span>
            </Link>
            <Link
              href="/products"
              className="flex flex-col items-center gap-2 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition border border-blue-200"
            >
              <span className="text-4xl">🛍️</span>
              <span className="font-semibold text-gray-700">Shop Products</span>
            </Link>
            <Link
              href="/contact"
              className="flex flex-col items-center gap-2 p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition border border-green-200"
            >
              <span className="text-4xl">📧</span>
              <span className="font-semibold text-gray-700">Contact Us</span>
            </Link>
          </div>
        </div>

        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition shadow-lg"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
