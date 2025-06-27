'use client';

import React from 'react';
import GridCell from './GridCell';
import { GridConfig } from '@/types';

interface BlankGridPaperProps {
  gridConfig: GridConfig;
  title?: string;
  includeHeader?: boolean;
  className?: string;
}

const BlankGridPaper: React.FC<BlankGridPaperProps> = ({
  gridConfig,
  title = '练习格子纸',
  includeHeader = true,
  className = ''
}) => {
  const generateRows = () => {
    const rows = [];
    for (let row = 0; row < gridConfig.rows; row++) {
      const cells = [];
      for (let col = 0; col < gridConfig.cols; col++) {
        cells.push(
          <GridCell
            key={`${row}-${col}`}
            type={gridConfig.type}
            size={gridConfig.size}
          />
        );
      }
      rows.push(
        <div
          key={row}
          className="flex gap-1 mb-1"
          style={{ gap: `${gridConfig.spacing}px`, marginBottom: `${gridConfig.spacing}px` }}
        >
          {cells}
        </div>
      );
    }
    return rows;
  };

  const getGridTypeName = () => {
    switch (gridConfig.type) {
      case 'tian-zi':
        return '田字格';
      case 'mi-zi':
        return '米字格';
      case 'four-line':
        return '四线格';
      case 'blank':
      default:
        return '空白格';
    }
  };

  return (
    <div className={`blank-grid-paper bg-white ${className}`}>
      {includeHeader && (
        <div className="header mb-6 text-center border-b pb-4">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <div className="text-sm text-gray-600 flex justify-between mb-2">
            <span>格子类型: {getGridTypeName()}</span>
            <span>规格: {gridConfig.rows} × {gridConfig.cols}</span>
            <span>姓名: ___________</span>
          </div>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>练习日期: ___________</span>
            <span>完成时间: ___________</span>
            <span>评分: ___________</span>
          </div>
        </div>
      )}
      
      <div className="grid-container">
        {generateRows()}
      </div>
    </div>
  );
};

export default BlankGridPaper;