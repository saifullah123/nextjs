import { prisma } from '@/lib/prisma';




export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Contact Messages</h1>
        <p className="text-gray-600">View messages from customers</p>
      </div>

      <div className="grid gap-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{message.name}</h3>
                <p className="text-sm text-gray-600">{message.email}</p>
                {message.phone && (
                  <p className="text-sm text-gray-600">{message.phone}</p>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-gray-500">
            No messages yet.
          </div>
        )}
      </div>
    </div>
  );
}
