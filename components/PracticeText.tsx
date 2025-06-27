'use client';

import React from 'react';
import { FontType, TextOpacity } from '@/types';

interface PracticeTextProps {
  text: string;
  font: FontType;
  opacity: TextOpacity;
  size: number;
  showPinyin?: boolean;
  className?: string;
}

const PracticeText: React.FC<PracticeTextProps> = ({
  text,
  font,
  opacity,
  size,
  showPinyin = false,
  className = ''
}) => {
  const getFontClass = () => {
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

  const getOpacityClass = () => {
    switch (opacity) {
      case 'light':
        return 'practice-text-light';
      case 'medium':
        return 'practice-text-medium';
      case 'dark':
        return 'practice-text-dark';
      default:
        return 'practice-text-light';
    }
  };

  const textStyle = {
    fontSize: `${size}px`,
    lineHeight: '1',
  };

  // Simple pinyin extraction (this would need a proper pinyin library in production)
  const getPinyin = (char: string): string => {
    // This is a placeholder - in a real app, you'd use a pinyin library
    const pinyinMap: { [key: string]: string } = {
      '汉': 'hàn',
      '字': 'zì',
      '练': 'liàn',
      '习': 'xí',
      '书': 'shū',
      '法': 'fǎ',
      '中': 'zhōng',
      '国': 'guó',
      '文': 'wén',
      '化': 'huà',
    };
    return pinyinMap[char] || '';
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {showPinyin && font !== 'english' && (
        <div 
          className="text-xs text-gray-500 mb-1"
          style={{ fontSize: `${size * 0.3}px` }}
        >
          {getPinyin(text)}
        </div>
      )}
      <div
        className={`practice-text ${getFontClass()} ${getOpacityClass()}`}
        style={textStyle}
      >
        {text}
      </div>
    </div>
  );
};

export default PracticeText;