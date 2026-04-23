'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableTextProps {
  content: string;
  maxHeight?: number;
}

export default function ExpandableText({ content, maxHeight = 150 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
    }
  }, [content, maxHeight]);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          !isExpanded ? `max-h-[${maxHeight}px]` : 'max-h-[2000px]'
        }`}
        style={{ maxHeight: !isExpanded ? `${maxHeight}px` : '2000px' }}
      >
        <div
          className="text-gray-600 leading-relaxed font-medium space-y-4 text-lg prose prose-slate max-w-3xl prose-p:text-gray-400 prose-p:italic prose-p:font-medium"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {isOverflowing && (
        <div className={`mt-4 ${!isExpanded ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#fafafa] to-transparent pt-20 flex justify-center' : 'flex justify-center'}`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600 hover:text-purple-700 transition-colors bg-white px-6 py-3 rounded-full shadow-sm border border-purple-100"
          >
            {isExpanded ? (
              <>
                See Less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                See More <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
