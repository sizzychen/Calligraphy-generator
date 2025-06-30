'use client';

import React from 'react';
import GridCell from './GridCell';
import PracticeText from './PracticeText';
import { GridConfig, TextConfig, CharacterInfo } from '@/types';

interface StrokeOrderPracticeProps {
  gridConfig: GridConfig;
  textConfig: TextConfig;
  characters: string;
  className?: string;
  title?: string;
  includeHeader?: boolean;
}

const StrokeOrderPractice: React.FC<StrokeOrderPracticeProps> = ({
  gridConfig,
  textConfig,
  characters,
  className = '',
  title = '带笔顺练习字帖',
  includeHeader = true
}) => {
  // Process characters into unique characters
  const uniqueChars = Array.from(new Set(characters.replace(/\s+/g, '').split('')))
    .filter(char => char.trim().length > 0);

  // Generate blank grid when no characters provided
  const generateBlankGrid = () => {
    const rows = [];
    const totalRows = gridConfig.rows || 12;
    const totalCols = gridConfig.cols || 10;

    for (let row = 0; row < totalRows; row++) {
      const rowCells = [];
      
      for (let col = 0; col < totalCols; col++) {
        rowCells.push(
          <GridCell
            key={`${row}-${col}`}
            type={gridConfig.type}
            size={gridConfig.size}
          />
        );
      }
      
      rows.push(
        <div key={row} className="flex mb-1">
          {rowCells}
        </div>
      );
    }

    return rows;
  };

  // Get stroke order progression for a character
  const getStrokeProgression = (char: string): string[] => {
    // Basic stroke progression data - in a real app this would come from a database
    const strokeData: { [key: string]: string[] } = {
      '人': ['丿', '人'],
      '大': ['一', '大', '大'],
      '小': ['丨', '八', '小'],
      '上': ['卜', '上'],
      '下': ['一', '下', '下'],
      '中': ['丨', '口', '中'],
      '木': ['一', '十', '木', '木'],
      '火': ['丶', '人', '火', '火'],
      '水': ['丿', '水', '水', '水'],
      '土': ['一', '十', '土'],
      '口': ['丨', '日', '口'],
      '日': ['丨', '日', '日', '日'],
      '月': ['丿', '月', '月', '月'],
      '山': ['丨', '山', '山'],
      '手': ['一', '手', '手', '手'],
      '心': ['丶', '心', '心', '心'],
    };

    return strokeData[char] || [char]; // If no stroke data, just return the character
  };

  // Generate practice row for each character with stroke progression
  const generateCharacterPracticeRow = (char: string) => {
    const strokeProgression = getStrokeProgression(char);
    const totalCols = gridConfig.cols;
    const cells = [];
    
    // First cell: complete character (example)
    cells.push(
      <GridCell
        key={`${char}-example`}
        type={gridConfig.type}
        size={gridConfig.size}
        className="border-2 border-blue-300 bg-blue-50"
      >
        <PracticeText
          text={char}
          font={textConfig.font}
          opacity="dark"
          size={textConfig.size}
        />
      </GridCell>
    );

    // Fill remaining cells with stroke progression, repeating the final character
    for (let i = 1; i < totalCols; i++) {
      const progressionIndex = Math.min(i - 1, strokeProgression.length - 1);
      const displayChar = strokeProgression[progressionIndex];
      
      cells.push(
        <GridCell
          key={`${char}-${i}`}
          type={gridConfig.type}
          size={gridConfig.size}
        >
          <PracticeText
            text={displayChar}
            font={textConfig.font}
            opacity="light"
            size={textConfig.size}
          />
        </GridCell>
      );
    }
    
    return (
      <div className="flex mb-1">
        {cells}
      </div>
    );
  };

  const totalRows = Math.min(gridConfig.rows, uniqueChars.length);

  return (
    <div className={`stroke-order-practice bg-white ${className}`}>
      {includeHeader && (
        <div className="header mb-6 text-center border-b pb-4">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>姓名: ___________</span>
            <span>练习日期: ___________</span>
            <span>签名: ___________</span>
          </div>
        </div>
      )}
      
      {/* Practice instructions */}
      <div className="instructions mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">笔顺练习说明:</h3>
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>第一格为示范字，颜色较深，用于临摹</li>
          <li>其余格子显示笔顺进展，用于练习</li>
          <li>按照正确的笔顺进行练习</li>
        </ul>
      </div>

      <div className="practice-content">
        {uniqueChars.length === 0 ? (
          generateBlankGrid()
        ) : (
          uniqueChars.slice(0, totalRows).map((char, index) => (
            <div key={index} className="character-section mb-2">
              <div className="character-label text-sm text-gray-600 mb-1 font-medium">
                练习字符: {char}
              </div>
              {generateCharacterPracticeRow(char)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StrokeOrderPractice;