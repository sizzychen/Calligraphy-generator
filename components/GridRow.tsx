'use client';

import React from 'react';
import GridCell from './GridCell';
import PracticeText from './PracticeText';
import { GridConfig, TextConfig } from '@/types';

interface GridRowProps {
  gridConfig: GridConfig;
  textConfig: TextConfig;
  characters: string[];
  className?: string;
}

const GridRow: React.FC<GridRowProps> = ({
  gridConfig,
  textConfig,
  characters,
  className = ''
}) => {
  return (
    <div className={`flex mb-1 ${className}`}>
      {Array.from({ length: gridConfig.cols }, (_, index) => {
        const char = characters[index] || '';
        return (
          <GridCell
            key={index}
            type={gridConfig.type}
            size={gridConfig.size}
          >
            {char && (
              <PracticeText
                text={char}
                font={textConfig.font}
                opacity={textConfig.opacity}
                size={textConfig.size}
                showPinyin={textConfig.showPinyin}
              />
            )}
          </GridCell>
        );
      })}
    </div>
  );
};

export default GridRow;