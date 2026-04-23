import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// ---------------------------------------------------------
// MANAGE PAGINATION HERE:
// Change this number to change messages per page (e.g., 5 to 6)
const ITEMS_PER_PAGE = 3;
// ---------------------------------------------------------

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function MessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Fetch total count and paginated messages
  const [totalMessages, messages] = await Promise.all([
    prisma.contactMessage.count(),
    prisma.contactMessage.findMany({
      skip: skip,
      take: ITEMS_PER_PAGE,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(totalMessages / ITEMS_PER_PAGE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Contact Messages
          </h1>
          <p className="text-gray-500 font-medium italic">
            Viewing messages from your customers
          </p>
        </div>
        <div className="text-sm font-semibold text-gray-400">
          Total: {totalMessages} messages
        </div>
      </div>

      <div className="grid gap-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className="group bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-2xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {message.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {message.name}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {message.email}
                    </p>
                    {message.phone && (
                      <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {message.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 shadow-inner">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Received on
                </span>
                <p className="text-sm font-bold text-gray-700">
                  {new Date(message.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-full opacity-20"></div>
              <div className="pl-6">
                <p className="text-gray-700 leading-relaxed text-lg italic whitespace-pre-wrap">
                  "{message.message}"
                </p>
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-20 text-center border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No messages yet</h3>
            <p className="text-gray-500">When customers contact you, their messages will appear here.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-3">
          <Link
            href={`/admin/messages?page=${currentPage - 1}`}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-200 flex items-center gap-2 ${
              currentPage <= 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200 active:scale-95'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Link>
          
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === currentPage;
              return (
                <Link
                  key={pageNum}
                  href={`/admin/messages?page=${pageNum}`}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl font-bold transition-all duration-200 ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}
          </div>

          <Link
            href={`/admin/messages?page=${currentPage + 1}`}
            className={`px-6 py-3 rounded-2xl font-bold transition-all duration-200 flex items-center gap-2 ${
              currentPage >= totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200 active:scale-95'
            }`}
          >
            Next
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
