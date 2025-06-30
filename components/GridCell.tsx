'use client';

import React from 'react';
import { GridType } from '@/types';

interface GridCellProps {
  type: GridType | 'four-line'; // Allow four-line for English practice
  size: number;
  children?: React.ReactNode;
  className?: string;
  gridHeight?: number; // Optional height for four-line grids
}

const GridCell: React.FC<GridCellProps> = ({ type, size, children, className = '', gridHeight }) => {
  const getGridClass = () => {
    switch (type) {
      case 'tian-zi':
        return 'tian-zi-grid';
      case 'mi-zi':
        return 'mi-zi-grid';
      case 'four-line':
        return 'four-line-grid';
      case 'blank':
      default:
        return '';
    }
  };

  const cellStyle = {
    width: `${size}px`,
    height: type === 'four-line' ? `${gridHeight || 80}px` : `${size}px`,
    minWidth: `${size}px`,
    minHeight: type === 'four-line' ? `${gridHeight || 80}px` : `${size}px`,
  };

  return (
    <div
      className={`grid-cell ${getGridClass()} ${className}`}
      style={cellStyle}
    >
      {children}
    </div>
  );
};

export default GridCell;