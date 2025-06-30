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

  // Calculate optimal rows and grid height based on font size and page size
  const calculateGridDimensions = () => {
    // Base grid height should adapt to font size
    // For English text, we need more height to accommodate ascenders and descenders
    const baseGridHeight = Math.max(textConfig.size * 2.8, 100); // Increased multiplier and minimum height
    
    // Calculate available space for content (excluding header and footer)
    const pageHeight = 1123; // A4 height in pixels at 96 DPI (210mm)
    const headerHeight = includeHeader ? 120 : 0;
    const footerHeight = 60;
    const margins = 80; // Top and bottom margins
    const availableHeight = pageHeight - headerHeight - footerHeight - margins;
    
    // Calculate number of rows that can fit
    const rowSpacing = 8; // mb-2 class spacing
    const optimalRows = Math.floor(availableHeight / (baseGridHeight + rowSpacing));
    
    return {
      gridHeight: baseGridHeight,
      rows: Math.max(optimalRows, 6), // Minimum 6 rows (reduced due to larger height)
      cols: gridConfig.cols || 10
    };
  };

  const { gridHeight, rows: calculatedRows, cols: calculatedCols } = calculateGridDimensions();

  // Generate empty four-line practice rows when no content
  const generateEmptyFourLinePractice = () => {
    const rows = [];

    for (let row = 0; row < calculatedRows; row++) {
      const rowCells = [];
      
      for (let col = 0; col < calculatedCols; col++) {
        rowCells.push(
          <GridCell
            key={`${row}-${col}`}
            type="four-line"
            size={gridConfig.size}
            gridHeight={gridHeight}
          />
        );
      }
      
      rows.push(
        <div key={row} className="flex mb-2">
          {rowCells}
        </div>
      );
    }

    return rows;
  };

  // Generate four-line practice rows
  const generateFourLinePractice = (items: string[], showExample: boolean = false) => {
    const rows = [];
    let itemIndex = 0;

    // Calculate how many rows we need based on content and available space
    const contentRows = Math.min(calculatedRows, Math.ceil(items.length / calculatedCols));
    // Fill remaining space with empty rows if needed
    const totalRowsToRender = calculatedRows;

    for (let row = 0; row < totalRowsToRender; row++) {
      const rowItems = [];
      
      for (let col = 0; col < calculatedCols; col++) {
        const item = row < contentRows && itemIndex < items.length ? items[itemIndex] : null;
        const isExample = showExample && col === 0 && item;
        
        rowItems.push(
          <GridCell
            key={`${row}-${col}`}
            type="four-line"
            size={gridConfig.size}
            gridHeight={gridHeight}
            className={isExample ? 'border-2 border-green-300 bg-green-50' : ''}
          >
            {item && (
              <PracticeText
                text={item}
                font="english"
                opacity={isExample ? 'dark' : textConfig.opacity}
                size={Math.floor(textConfig.size * 0.8)} // Increased from 0.7 to 0.8
              />
            )}
          </GridCell>
        );
        
        if (item) itemIndex++;
      }
      
      rows.push(
        <div key={row} className="flex mb-2">
          {rowItems}
        </div>
      );
    }

    return rows;
  };

  // Generate letter practice (both uppercase and lowercase)
  const generateLetterPractice = (letters: string[], showExample: boolean = false) => {
    const rows = [];
    
    for (let i = 0; i < letters.length; i += calculatedCols) {
      const rowLetters = letters.slice(i, i + calculatedCols);
      const rowCells = [];
      
      rowLetters.forEach((letter, index) => {
        const isExample = showExample && index === 0;
        
        rowCells.push(
          <GridCell
            key={`${i + index}`}
            type="four-line"
            size={gridConfig.size}
            gridHeight={gridHeight}
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
      while (rowCells.length < calculatedCols) {
        rowCells.push(
          <GridCell
            key={`empty-${i}-${rowCells.length}`}
            type="four-line"
            size={gridConfig.size}
            gridHeight={gridHeight}
          />
        );
      }
      
      rows.push(
        <div key={i} className="flex mb-2">
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
            <span>Name: ___________</span>
            <span>Date: ___________</span>
            <span>Signature: ___________</span>
          </div>
        </div>
      )}

      {/* Practice sections */}
      <div className="practice-sections">
        {/* Show empty grids when no content, otherwise show word practice */}
        {englishWords.length === 0 ? (
          <div className="practice-section">
            {generateEmptyFourLinePractice()}
          </div>
        ) : (
          <div className="practice-section mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Word Practice
            </h3>
            {generateFourLinePractice(englishWords, false)}
          </div>
        )}
      </div>

      <div className="footer mt-6 text-center text-xs text-gray-500 border-t pt-4">
        <div className="flex justify-between">
          <span>Practice Date: ___________</span>
          <span>Completion Time: ___________</span>
          <span>Signature: ___________</span>
        </div>
      </div>
    </div>
  );
};

export default EnglishPractice;