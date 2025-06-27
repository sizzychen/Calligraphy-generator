'use client';

import React from 'react';
import GridCell from './GridCell';
import PracticeText from './PracticeText';
import { GridConfig, TextConfig } from '@/types';

interface EnglishPracticeProps {
  gridConfig: GridConfig;
  textConfig: TextConfig;
  content: string;
  title?: string;
  includeHeader?: boolean;
  className?: string;
}

const EnglishPractice: React.FC<EnglishPracticeProps> = ({
  gridConfig,
  textConfig,
  content,
  title = 'English Practice Sheet',
  includeHeader = true,
  className = ''
}) => {
  // Process English content
  const processEnglishContent = (text: string): string[] => {
    return text
      .toLowerCase()
      .replace(/[^a-z\s]/g, '') // Keep only letters and spaces
      .split(/\s+/)
      .filter(word => word.length > 0);
  };

  const englishWords = processEnglishContent(content);
  
  // Alphabet practice
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const lowercaseAlphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  // Generate four-line practice rows
  const generateFourLinePractice = (items: string[], showExample: boolean = false) => {
    const rows = [];
    let itemIndex = 0;

    for (let row = 0; row < Math.min(gridConfig.rows, Math.ceil(items.length / gridConfig.cols)); row++) {
      const rowItems = [];
      
      for (let col = 0; col < gridConfig.cols && itemIndex < items.length; col++) {
        const item = items[itemIndex];
        const isExample = showExample && col === 0;
        
        rowItems.push(
          <GridCell
            key={`${row}-${col}`}
            type="four-line"
            size={gridConfig.size}
            className={isExample ? 'border-2 border-green-300 bg-green-50' : ''}
          >
            {item && (
              <PracticeText
                text={item}
                font="english"
                opacity={isExample ? 'dark' : textConfig.opacity}
                size={Math.floor(textConfig.size * 0.7)}
              />
            )}
          </GridCell>
        );
        
        if (item) itemIndex++;
      }
      
      rows.push(
        <div key={row} className="flex gap-1 mb-2">
          {rowItems}
        </div>
      );
    }

    return rows;
  };

  // Generate letter practice (both uppercase and lowercase)
  const generateLetterPractice = (letters: string[], showExample: boolean = false) => {
    const rows = [];
    
    for (let i = 0; i < letters.length; i += gridConfig.cols) {
      const rowLetters = letters.slice(i, i + gridConfig.cols);
      const rowCells = [];
      
      rowLetters.forEach((letter, index) => {
        const isExample = showExample && index === 0;
        
        rowCells.push(
          <GridCell
            key={`${i + index}`}
            type="four-line"
            size={gridConfig.size}
            className={isExample ? 'border-2 border-purple-300 bg-purple-50' : ''}
          >
            <PracticeText
              text={letter}
              font="english"
              opacity={isExample ? 'dark' : textConfig.opacity}
              size={Math.floor(textConfig.size * 0.8)}
            />
          </GridCell>
        );
      });
      
      // Fill remaining cells in row
      while (rowCells.length < gridConfig.cols) {
        rowCells.push(
          <GridCell
            key={`empty-${i}-${rowCells.length}`}
            type="four-line"
            size={gridConfig.size}
          />
        );
      }
      
      rows.push(
        <div key={i} className="flex gap-1 mb-2">
          {rowCells}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className={`english-practice bg-white ${className}`}>
      {includeHeader && (
        <div className="header mb-6 text-center border-b pb-4">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>English Writing Practice</span>
            <span>Four-Line Grid</span>
            <span>Name: ___________</span>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="instructions mb-6 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold mb-2">Practice Instructions:</h3>
        <ol className="text-sm text-gray-700 list-decimal list-inside space-y-1">
          <li>Follow proper letter formation and positioning</li>
          <li>Keep letters within the four-line boundaries</li>
          <li>Maintain consistent letter size and spacing</li>
          <li>Practice both uppercase and lowercase letters</li>
        </ol>
      </div>

      {/* Four-line guide */}
      <div className="line-guide mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-3">Four-Line Guide:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium mb-2">Letter positioning:</div>
            <ul className="space-y-1 text-gray-700">
              <li>• Top line: tall letters (b, d, f, h, k, l, t)</li>
              <li>• Middle area: most letters (a, c, e, i, m, n, o, r, s, u, v, w, x, z)</li>
              <li>• Bottom line: descending letters (g, j, p, q, y)</li>
            </ul>
          </div>
          <div>
            <div className="font-medium mb-2">Uppercase letters:</div>
            <ul className="space-y-1 text-gray-700">
              <li>• Use the space between top and middle lines</li>
              <li>• Keep consistent height and width</li>
              <li>• Leave proper spacing between letters</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Practice sections */}
      <div className="practice-sections">
        {/* Uppercase alphabet */}
        <div className="practice-section mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Uppercase Letters (A-Z)
          </h3>
          {generateLetterPractice(alphabet, true)}
        </div>

        {/* Lowercase alphabet */}
        <div className="practice-section mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Lowercase Letters (a-z)
          </h3>
          {generateLetterPractice(lowercaseAlphabet, true)}
        </div>

        {/* Word practice */}
        {englishWords.length > 0 && (
          <div className="practice-section mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Word Practice
            </h3>
            {generateFourLinePractice(englishWords, true)}
          </div>
        )}
      </div>

      {/* Common word patterns */}
      <div className="word-patterns mt-8 p-4 bg-yellow-50 rounded-lg">
        <h3 className="font-semibold mb-4">Common Word Patterns:</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium mb-2">CVC Pattern:</div>
            <div className="space-y-1">
              <div>cat, dog, run, sit</div>
              <div>big, red, top, fun</div>
            </div>
          </div>
          <div>
            <div className="font-medium mb-2">Long Vowels:</div>
            <div className="space-y-1">
              <div>cake, bike, home</div>
              <div>cute, game, time</div>
            </div>
          </div>
          <div>
            <div className="font-medium mb-2">Blends:</div>
            <div className="space-y-1">
              <div>stop, tree, frog</div>
              <div>play, swim, craft</div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer mt-6 text-center text-xs text-gray-500 border-t pt-4">
        <div className="flex justify-between">
          <span>Practice Date: ___________</span>
          <span>Completion Time: ___________</span>
          <span>Grade: ___________</span>
        </div>
      </div>
    </div>
  );
};

export default EnglishPractice;