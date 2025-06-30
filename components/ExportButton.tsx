'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AdvancedPDFExporter } from '@/utils/advancedPdfExport';
import { ImageExporter } from '@/utils/imageExport';
import { PracticeMode, ExportType } from '@/types';

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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = async (exportType: ExportType) => {
    if (disabled || isExporting) return;

    setIsExporting(true);
    setExportStatus('idle');
    setShowDropdown(false);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('找不到要导出的元素');
      }

      const baseFilename = `${getPracticeTypeName(practiceType)}_${title || ''}`.replace(/\s+/g, '_');
      
      if (exportType === 'pdf') {
        await AdvancedPDFExporter.exportElementToPDF(element, {
          filename: `${baseFilename}.pdf`,
          orientation: 'portrait',
          format: 'A4',
          quality: 0.95
        });
      } else if (exportType === 'png') {
        await ImageExporter.exportToPNG(element, baseFilename);
      } else if (exportType === 'jpeg') {
        await ImageExporter.exportToJPEG(element, baseFilename);
      }
      
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

  const exportOptions = [
    { type: 'pdf' as ExportType, label: 'PDF文件', icon: '📄' },
    { type: 'png' as ExportType, label: 'PNG图片', icon: '🖼️' },
    { type: 'jpeg' as ExportType, label: 'JPEG图片', icon: '📷' },
  ];

  const getButtonText = () => {
    if (isExporting) return '导出中...';
    if (exportStatus === 'success') return '导出成功！';
    if (exportStatus === 'error') return '导出失败';
    return '导出';
  };

  const getButtonClass = () => {
    let baseClass = `
      relative flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200
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
    <div className="relative" ref={dropdownRef}>
      <div className="flex">
        {/* Main export button */}
        <button
          onClick={() => handleExport('pdf')}
          disabled={disabled || isExporting}
          className={`${getButtonClass()} rounded-r-none`}
        >
          {getIcon()}
          <span>{getButtonText()}</span>
        </button>

        {/* Dropdown toggle button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={disabled || isExporting}
          className={`
            px-2 py-3 border-l border-blue-500 rounded-r-lg font-medium transition-all duration-200
            ${disabled || isExporting 
              ? 'bg-gray-400 text-white cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }
          `}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Dropdown menu */}
      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="py-1">
            {exportOptions.map((option, index) => (
              <button
                key={option.type}
                onClick={() => handleExport(option.type)}
                disabled={isExporting}
                className={`
                  flex items-center space-x-3 w-full px-4 py-3 text-left text-sm transition-colors duration-150
                  ${isExporting 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }
                  ${index === 0 ? 'rounded-t-xl' : ''}
                  ${index === exportOptions.length - 1 ? 'rounded-b-xl' : ''}
                `}
              >
                <span className="text-xl">{option.icon}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-gray-500">
                    {option.type === 'pdf' && '适合打印的矢量格式'}
                    {option.type === 'png' && '高质量透明背景图片'}
                    {option.type === 'jpeg' && '适合分享的压缩图片'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;