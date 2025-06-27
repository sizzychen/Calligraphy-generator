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
}

const StrokeOrderPractice: React.FC<StrokeOrderPracticeProps> = ({
  gridConfig,
  textConfig,
  characters,
  className = ''
}) => {
  // Process characters into unique characters
  const uniqueChars = Array.from(new Set(characters.replace(/\s+/g, '').split('')))
    .filter(char => char.trim().length > 0);

  // Generate practice row for each character
  const generateCharacterPracticeRow = (char: string) => {
    const practiceSteps = 6; // Number of practice cells per character
    const cells = [];
    
    for (let i = 0; i < Math.min(gridConfig.cols, practiceSteps); i++) {
      const isExample = i === 0;
      const isPractice = i > 0 && i <= 3;
      const isEmpty = i > 3;
      
      cells.push(
        <GridCell
          key={`${char}-${i}`}
          type={gridConfig.type}
          size={gridConfig.size}
          className={isExample ? 'border-2 border-blue-300 bg-blue-50' : ''}
        >
          {(isExample || isPractice) && (
            <PracticeText
              text={char}
              font={textConfig.font}
              opacity={isExample ? 'dark' : 'light'}
              size={textConfig.size}
            />
          )}
        </GridCell>
      );
    }
    
    // Fill remaining cells in row if needed
    while (cells.length < gridConfig.cols) {
      cells.push(
        <GridCell
          key={`${char}-empty-${cells.length}`}
          type={gridConfig.type}
          size={gridConfig.size}
        />
      );
    }
    
    return (
      <div className="flex gap-1 mb-1">
        {cells}
      </div>
    );
  };

  const totalRows = Math.min(gridConfig.rows, uniqueChars.length);

  return (
    <div className={`stroke-order-practice bg-white ${className}`}>
      {/* Practice instructions */}
      <div className="instructions mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">笔顺练习说明:</h3>
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>第一格为示范字，颜色较深，用于临摹</li>
          <li>第2-4格为练习格，有淡色底字引导</li>
          <li>第5-6格为空白练习格，独立书写</li>
          <li>按照正确的笔顺进行练习</li>
        </ul>
      </div>

      <div className="practice-content">
        {uniqueChars.slice(0, totalRows).map((char, index) => (
          <div key={index} className="character-section mb-2">
            <div className="character-label text-sm text-gray-600 mb-1 font-medium">
              练习字符: {char}
            </div>
            {generateCharacterPracticeRow(char)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StrokeOrderPractice;