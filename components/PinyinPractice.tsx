'use client';

import React from 'react';
import GridCell from './GridCell';
import PracticeText from './PracticeText';
import { GridConfig, TextConfig } from '@/types';

interface PinyinPracticeProps {
  gridConfig: GridConfig;
  textConfig: TextConfig;
  content: string;
  title?: string;
  includeHeader?: boolean;
  className?: string;
}

const PinyinPractice: React.FC<PinyinPracticeProps> = ({
  gridConfig,
  textConfig,
  content,
  title = '拼音练习字帖',
  includeHeader = true,
  className = ''
}) => {
  // Process pinyin content
  const processPinyinContent = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^\u00C0-\u017F\u1E00-\u1EFFa-z\s]/g, '') // Keep pinyin letters and diacritics
      .split(/\s+/)
      .filter(word => word.length > 0);
  };

  const pinyinWords = processPinyinContent(content);
  
  // Pinyin tone marks examples
  const toneExamples = [
    { letter: 'a', tones: ['ā', 'á', 'ǎ', 'à', 'a'] },
    { letter: 'o', tones: ['ō', 'ó', 'ǒ', 'ò', 'o'] },
    { letter: 'e', tones: ['ē', 'é', 'ě', 'è', 'e'] },
    { letter: 'i', tones: ['ī', 'í', 'ǐ', 'ì', 'i'] },
    { letter: 'u', tones: ['ū', 'ú', 'ǔ', 'ù', 'u'] },
    { letter: 'ü', tones: ['ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'] },
  ];

  // Generate four-line practice rows
  const generateFourLinePractice = (words: string[], showExample: boolean = false) => {
    const rows = [];
    let wordIndex = 0;

    for (let row = 0; row < gridConfig.rows && wordIndex < words.length; row++) {
      const rowWords = [];
      
      for (let col = 0; col < gridConfig.cols && wordIndex < words.length; col++) {
        const word = words[wordIndex];
        const isExample = showExample && col === 0;
        
        rowWords.push(
          <GridCell
            key={`${row}-${col}`}
            type="four-line"
            size={gridConfig.size}
            className={isExample ? 'border-2 border-blue-300 bg-blue-50' : ''}
          >
            {word && (
              <PracticeText
                text={word}
                font="english"
                opacity={isExample ? 'dark' : textConfig.opacity}
                size={Math.floor(textConfig.size * 0.6)}
              />
            )}
          </GridCell>
        );
        
        if (word) wordIndex++;
      }
      
      rows.push(
        <div key={row} className="flex gap-1 mb-2">
          {rowWords}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className={`pinyin-practice bg-white ${className}`}>
      {includeHeader && (
        <div className="header mb-6 text-center border-b pb-4">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>拼音练习</span>
            <span>四线格</span>
            <span>姓名: ___________</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="instructions mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">练习说明:</h3>
        <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
          <li>注意拼音字母在四线格中的位置</li>
          <li>声调符号要正确标注在相应的字母上</li>
          <li>保持字母书写规范，大小适中</li>
          <li>字母间距要均匀，整体美观</li>
        </ol>
      </div>

      {/* Tone marks reference */}
      <div className="tone-reference mb-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-4">声调符号参考:</h3>
        <div className="grid grid-cols-3 gap-4">
          {toneExamples.map((example, index) => (
            <div key={index} className="tone-example">
              <div className="font-semibold text-sm mb-2">{example.letter.toUpperCase()}</div>
              <div className="flex space-x-2 text-lg">
                {example.tones.map((tone, toneIndex) => (
                  <span key={toneIndex} className="font-mono">
                    {tone}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {['一声', '二声', '三声', '四声', '轻声'][0]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice sections */}
      <div className="practice-sections">
        <div className="practice-section mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            描红练习
          </h3>
          {generateFourLinePractice(pinyinWords.slice(0, gridConfig.rows * gridConfig.cols), true)}
        </div>

        <div className="practice-section mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            临摹练习
          </h3>
          {generateFourLinePractice(pinyinWords, false)}
        </div>
      </div>

      {/* Common pinyin combinations */}
      <div className="common-combinations mt-8 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold mb-4">常用拼音组合:</h3>
        <div className="grid grid-cols-4 gap-4 text-sm">
          {['zh', 'ch', 'sh', 'ang', 'eng', 'ing', 'ong', 'ian', 'uan', 'üan', 'iao', 'uai'].map((combo, index) => (
            <div key={index} className="text-center p-2 bg-white rounded border">
              <div className="font-mono text-lg">{combo}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="footer mt-6 text-center text-xs text-gray-500 border-t pt-4">
        <div className="flex justify-between">
          <span>练习日期: ___________</span>
          <span>完成时间: ___________</span>
          <span>评分: ___________</span>
        </div>
      </div>
    </div>
  );
};

export default PinyinPractice;