'use client';

import { useState } from 'react';

export default function LoginDebugPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      console.log('📤 Sending login request...');
      
      const response = await fetch('/api/debug-login', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('📥 Response:', data);
      setResult(data);
    } catch (error: any) {
      console.error('❌ Error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Login Debug Page</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Login'}
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="font-bold mb-2">Result:</h2>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-bold mb-2">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Open browser console (F12)</li>
              <li>Click "Test Login" button</li>
              <li>Check console logs for detailed output</li>
              <li>Check terminal logs for server-side output</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
