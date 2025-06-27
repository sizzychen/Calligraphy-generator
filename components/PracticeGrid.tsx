'use client';

import React from 'react';
import GridRow from './GridRow';
import { GridConfig, TextConfig } from '@/types';

interface PracticeGridProps {
  gridConfig: GridConfig;
  textConfig: TextConfig;
  content: string;
  className?: string;
}

const PracticeGrid: React.FC<PracticeGridProps> = ({
  gridConfig,
  textConfig,
  content,
  className = ''
}) => {
  // Split content into characters and organize into rows
  const characters = content.replace(/\s+/g, '').split('');
  const totalCells = gridConfig.rows * gridConfig.cols;
  
  // Pad characters array to fill all grid cells
  const paddedCharacters = [...characters];
  while (paddedCharacters.length < totalCells) {
    paddedCharacters.push('');
  }

  // Group characters into rows
  const rows = [];
  for (let i = 0; i < gridConfig.rows; i++) {
    const startIndex = i * gridConfig.cols;
    const endIndex = startIndex + gridConfig.cols;
    rows.push(paddedCharacters.slice(startIndex, endIndex));
  }

  return (
    <div className={`practice-grid ${className}`}>
      {rows.map((rowCharacters, rowIndex) => (
        <GridRow
          key={rowIndex}
          gridConfig={gridConfig}
          textConfig={textConfig}
          characters={rowCharacters}
        />
      ))}
    </div>
  );
};

export default PracticeGrid;