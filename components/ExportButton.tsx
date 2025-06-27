'use client';

import React, { useState } from 'react';
import { AdvancedPDFExporter } from '@/utils/advancedPdfExport';
import { PracticeMode } from '@/types';

interface ExportButtonProps {
  elementId: string;
  practiceType: PracticeMode;
  title?: string;
  disabled?: boolean;
  className?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  elementId,
  practiceType,
  title,
  disabled = false,
  className = ''
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const getPracticeTypeName = (type: PracticeMode): string => {
    const names = {
      'blank-paper': '空格子纸',
      'stroke-order': '笔顺字帖',
      'article': '文章字帖',
      'single-char': '单字练习',
      'english': '英文字帖',
    };
    return names[type] || '练习字帖';
  };

  const handleExport = async () => {
    if (disabled || isExporting) return;

    setIsExporting(true);
    setExportStatus('idle');

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('找不到要导出的元素');
      }

      const filename = `${getPracticeTypeName(practiceType)}_${title || ''}.pdf`.replace(/\s+/g, '_');
      
      await AdvancedPDFExporter.exportElementToPDF(element, {
        filename,
        orientation: 'portrait',
        format: 'A4'
      });
      
      setExportStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setExportStatus('idle');
      }, 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonText = () => {
    if (isExporting) return '导出中...';
    if (exportStatus === 'success') return '导出成功！';
    if (exportStatus === 'error') return '导出失败';
    return '导出PDF';
  };

  const getButtonClass = () => {
    let baseClass = `
      px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2
      ${className}
    `;

    if (disabled || isExporting) {
      baseClass += ' bg-gray-400 text-white cursor-not-allowed';
    } else if (exportStatus === 'success') {
      baseClass += ' bg-green-600 text-white hover:bg-green-700';
    } else if (exportStatus === 'error') {
      baseClass += ' bg-red-600 text-white hover:bg-red-700';
    } else {
      baseClass += ' bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800';
    }

    return baseClass;
  };

  const getIcon = () => {
    if (isExporting) {
      return (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    }

    if (exportStatus === 'success') {
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      );
    }

    if (exportStatus === 'error') {
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      );
    }

    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || isExporting}
      className={getButtonClass()}
      title={disabled ? '请先配置练习内容' : '导出为PDF文件'}
    >
      {getIcon()}
      <span>{getButtonText()}</span>
    </button>
  );
};

export default ExportButton;