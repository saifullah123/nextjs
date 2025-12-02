import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us - ProductCase',
  description: 'Learn more about ProductCase, our mission, and our commitment to premium quality and stylish protection for your devices.',
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">About Us</h1>
            <p className="text-gray-600 text-lg">
              Your trusted partner in premium product protection
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-700 leading-relaxed">
                ProductCase was founded with a simple mission: to provide high-quality, stylish protection
                for your valuable devices. We believe that protection shouldn't compromise on style, and
                style shouldn't compromise on protection.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                We're committed to delivering exceptional products that combine durability, functionality,
                and aesthetic appeal. Every case we offer is carefully selected and tested to ensure it
                meets our high standards of quality.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-4xl mb-3">🛡️</div>
                  <h3 className="font-bold text-gray-800 mb-2">Premium Quality</h3>
                  <p className="text-gray-600 text-sm">
                    Only the best materials and craftsmanship
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="font-bold text-gray-800 mb-2">Stylish Designs</h3>
                  <p className="text-gray-600 text-sm">
                    Modern aesthetics that complement your style
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-4xl mb-3">💯</div>
                  <h3 className="font-bold text-gray-800 mb-2">Customer First</h3>
                  <p className="text-gray-600 text-sm">
                    Your satisfaction is our top priority
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
