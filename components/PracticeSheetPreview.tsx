'use client';

import React from 'react';
import BlankGridPaper from './BlankGridPaper';
import StrokeOrderPractice from './StrokeOrderPractice';
import ArticlePractice from './ArticlePractice';
import SingleCharPractice from './SingleCharPractice';
import EnglishPractice from './EnglishPractice';
import ExportButton from './ExportButton';
import { PracticeSheetConfig } from '@/types';

interface PracticeSheetPreviewProps {
  config: PracticeSheetConfig;
  className?: string;
}

const PracticeSheetPreview: React.FC<PracticeSheetPreviewProps> = ({
  config,
  className = ''
}) => {
  const previewId = 'practice-sheet-preview';

  const renderPracticeSheet = () => {
    const commonProps = {
      gridConfig: config.grid,
      textConfig: config.text,
    };

    switch (config.mode) {
      case 'blank-paper':
        return (
          <BlankGridPaper
            {...commonProps}
          />
        );

      case 'stroke-order':
        return (
          <StrokeOrderPractice
            {...commonProps}
            characters={config.text.content}
            title="带笔顺练习字帖"
            includeHeader={true}
          />
        );

      case 'article':
        return (
          <ArticlePractice
            {...commonProps}
            content={config.text.content}
          />
        );

      case 'single-char':
        // For single character, take the first character from content
        const firstChar = config.text.content.trim().charAt(0) || '字';
        return (
          <SingleCharPractice
            {...commonProps}
            character={firstChar}
          />
        );

      case 'english':
        return (
          <EnglishPractice
            {...commonProps}
            content={config.text.content}
          />
        );

      default:
        return (
          <div className="text-center py-12 text-gray-500">
            请选择练习模式
          </div>
        );
    }
  };

  const hasContent = () => {
    switch (config.mode) {
      case 'blank-paper':
      case 'article': // Always show content for article mode (will show blank grid if no content)
        return true; 
      case 'stroke-order':
      case 'single-char':
      case 'english':
        return config.text.content.trim().length > 0;
      default:
        return false;
    }
  };

  // Show empty state with instructions when no content (except for blank-paper mode)
  if (!hasContent()) {
    return (
      <div className={`practice-sheet-preview ${className}`}>
        {/* Preview Header */}
        <div className="preview-header mb-4 flex justify-between items-center no-print">
          <h2 className="text-xl font-semibold text-gray-800">字帖预览</h2>
          <div>
            {/* Empty space for consistent layout */}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              字帖预览
            </h3>
            <p className="text-gray-500 mb-4">
              请在左侧输入练习内容以生成字帖预览
            </p>
            <div className="text-sm text-gray-400">
              当前模式: {
                {
                  'blank-paper': '空格子纸',
                  'stroke-order': '笔顺练习',
                  'article': '文章练习',
                  'single-char': '单字强化',
                  'english': '英文练习'
                }[config.mode] || '未选择'
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show the actual practice sheet with export button
  return (
    <div className={`practice-sheet-preview ${className}`}>
      {/* Preview Header */}
      <div className="preview-header mb-4 flex justify-between items-center no-print">
        <h2 className="text-xl font-semibold text-gray-800">字帖预览</h2>
        <ExportButton
          elementId={previewId}
          practiceType={config.mode}
          title="字帖练习"
          disabled={!hasContent()}
        />
      </div>

      {/* Preview Content */}
      <div className="preview-content bg-white rounded-lg shadow-lg overflow-hidden">
        <div 
          id={previewId}
          className="preview-sheet p-4"
          style={{
            minHeight: '290mm', // Increased height to fill more space
            width: '100%',
            maxWidth: '210mm', // A4 width
            margin: '0 auto',
            backgroundColor: 'white',
          }}
        >
          {renderPracticeSheet()}
        </div>
      </div>
    </div>
  );
};

export default PracticeSheetPreview;