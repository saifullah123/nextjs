import React, { useMemo } from 'react';

interface SeoAnalysisProps {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  baseTitle?: string; // The product or category name
}

interface AnalysisItem {
  label: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}

export function SeoAnalysis({ metaTitle, metaDescription, metaKeywords, baseTitle }: SeoAnalysisProps) {
  const analysis = useMemo(() => {
    const items: AnalysisItem[] = [];
    let score = 0;
    let totalScore = 100;

    // 1. Meta Title Analysis (30 points)
    if (!metaTitle) {
      items.push({
        label: 'Meta Title',
        status: 'error',
        message: 'Meta title is missing.',
      });
    } else {
      score += 10;
      if (metaTitle.length >= 30 && metaTitle.length <= 60) {
        score += 20;
        items.push({
          label: 'Meta Title Length',
          status: 'success',
          message: 'Perfect length (30-60 characters).',
        });
      } else {
        items.push({
          label: 'Meta Title Length',
          status: 'warning',
          message: `Current length: ${metaTitle.length}. Recommended: 30-60 characters.`,
        });
      }

      if (baseTitle && !metaTitle.toLowerCase().includes(baseTitle.toLowerCase())) {
        items.push({
          label: 'Keyword Consistency',
          status: 'warning',
          message: 'Meta title does not contain the main product/category name.',
        });
      } else if (baseTitle) {
         // Bonus points for consistency, but kept within the 30 for simplicity or add extra
      }
    }

    // 2. Meta Description Analysis (40 points)
    if (!metaDescription) {
      items.push({
        label: 'Meta Description',
        status: 'error',
        message: 'Meta description is missing.',
      });
    } else {
      score += 10;
      if (metaDescription.length >= 120 && metaDescription.length <= 160) {
        score += 30;
        items.push({
          label: 'Meta Description Length',
          status: 'success',
          message: 'Perfect length (120-160 characters).',
        });
      } else if (metaDescription.length < 120) {
        items.push({
          label: 'Meta Description Length',
          status: 'warning',
          message: 'Too short. Recommended: 120-160 characters.',
        });
        score += 10;
      } else {
        items.push({
          label: 'Meta Description Length',
          status: 'warning',
          message: 'Too long. Recommended: 120-160 characters.',
        });
        score += 10;
      }
    }

    // 3. Meta Keywords Analysis (30 points)
    if (!metaKeywords) {
      items.push({
        label: 'Meta Keywords',
        status: 'warning',
        message: 'No keywords provided.',
      });
    } else {
      const keywordsList = metaKeywords.split(',').filter(k => k.trim().length > 0);
      if (keywordsList.length > 0) {
        score += 30;
        items.push({
          label: 'Meta Keywords',
          status: 'success',
          message: `${keywordsList.length} keywords found.`,
        });
      } else {
         items.push({
          label: 'Meta Keywords',
          status: 'warning',
          message: 'Keywords field is empty.',
        });
      }
    }

    return { score, items };
  }, [metaTitle, metaDescription, metaKeywords, baseTitle]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">SEO Analysis</h3>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getScoreBg(analysis.score)}`}>
          <span className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
            {analysis.score}
          </span>
          <span className={`text-sm font-medium ${getScoreColor(analysis.score)}`}>/ 100</span>
        </div>
      </div>

      <div className="space-y-4">
        {analysis.items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-1">
              {item.status === 'success' && (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {item.status === 'warning' && (
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
              {item.status === 'error' && (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">{item.label}</p>
              <p className="text-sm text-gray-600">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
