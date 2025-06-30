'use client';

import React from 'react';
import PracticeGrid from './PracticeGrid';
import { GridConfig, TextConfig } from '@/types';

interface ArticlePracticeProps {
  gridConfig: GridConfig;
  textConfig: TextConfig;
  content: string;
  title?: string;
  includeHeader?: boolean;
  className?: string;
}

const ArticlePractice: React.FC<ArticlePracticeProps> = ({
  gridConfig,
  textConfig,
  content,
  title = '文章练习字帖',
  includeHeader = true,
  className = ''
}) => {
  // Process content to handle paragraphs and special characters
  const processContent = (text: string): string => {
    return text
      .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
      .replace(/[^\u4e00-\u9fa5\u3400-\u4dbf\u3000-\u303f\uff01-\uff5ea-zA-Z0-9\s]/g, '') // Keep Chinese, punctuation, letters, numbers
      .trim();
  };

  const processedContent = processContent(content);
  const characters = processedContent.replace(/\s+/g, '');
  const totalChars = characters.length;
  const charsPerPage = gridConfig.rows * gridConfig.cols;
  
  // If no content, default to blank grid paper (1 page)
  const totalPages = totalChars > 0 ? Math.ceil(totalChars / charsPerPage) : 1;

  // Split content into pages
  const getPageContent = (pageIndex: number): string => {
    const startIndex = pageIndex * charsPerPage;
    const endIndex = startIndex + charsPerPage;
    return characters.slice(startIndex, endIndex);
  };

  // Extract unique characters for vocabulary section
  const getUniqueCharacters = (): string[] => {
    const uniqueChars = Array.from(new Set(characters.split('')));
    return uniqueChars.filter(char => /[\u4e00-\u9fa5]/.test(char)); // Only Chinese characters
  };

  const uniqueChars = getUniqueCharacters();

  const renderPage = (pageIndex: number) => {
    const pageContent = getPageContent(pageIndex);
    
    return (
      <div key={pageIndex} className="practice-page mb-12 print-page">
        {includeHeader && pageIndex === 0 && (
          <div className="header mb-6 text-center border-b pb-4">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <div className="text-sm text-gray-600 flex justify-between">
              <span>姓名: ___________</span>
              <span>练习日期: ___________</span>
              <span>签名: ___________</span>
            </div>
          </div>
        )}
        
        <PracticeGrid
          gridConfig={gridConfig}
          textConfig={textConfig}
          content={pageContent}
        />
      </div>
    );
  };

  return (
    <div className={`article-practice bg-white ${className}`}>
      {/* Main practice pages */}
      {Array.from({ length: totalPages }, (_, index) => renderPage(index))}
    </div>
  );
};

export default ArticlePractice;