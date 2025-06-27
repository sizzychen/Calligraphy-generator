'use client';

import React from 'react';
import { FontType, FONT_OPTIONS } from '@/types';

interface FontSelectorProps {
  selectedFont: FontType;
  onFontChange: (font: FontType) => void;
  className?: string;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFont,
  onFontChange,
  className = ''
}) => {
  const getFontClass = (font: FontType): string => {
    switch (font) {
      case 'chinese-regular':
        return 'font-chinese-regular';
      case 'chinese-calligraphy':
        return 'font-chinese-calligraphy';
      case 'stroke-order':
        return 'font-stroke-order';
      case 'english':
        return 'font-sans';
      default:
        return 'font-chinese-regular';
    }
  };

  return (
    <div className={`font-selector ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        选择字体
      </label>
      <div className="grid grid-cols-1 gap-2">
        {FONT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onFontChange(option.value)}
            className={`
              flex items-center justify-between p-3 border rounded-lg transition-all
              ${selectedFont === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400 bg-white'
              }
            `}
          >
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">
                {option.label}
              </span>
              <span className={`text-lg ${getFontClass(option.value)} mt-1`}>
                {option.preview}
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={`
                  w-4 h-4 rounded-full border-2 transition-all
                  ${selectedFont === option.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                  }
                `}
              >
                {selectedFont === option.value && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Font preview section */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">字体预览</h4>
        <div className={`text-2xl ${getFontClass(selectedFont)} text-center py-4`}>
          汉字练习 English Practice 123
        </div>
      </div>
    </div>
  );
};

export default FontSelector;