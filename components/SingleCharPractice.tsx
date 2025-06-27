'use client';

import React from 'react';
import GridCell from './GridCell';
import PracticeText from './PracticeText';
import { GridConfig, TextConfig, CharacterInfo } from '@/types';

interface SingleCharPracticeProps {
  gridConfig: GridConfig;
  textConfig: TextConfig;
  character: string;
  title?: string;
  includeHeader?: boolean;
  className?: string;
}

const SingleCharPractice: React.FC<SingleCharPracticeProps> = ({
  gridConfig,
  textConfig,
  character,
  title = '单字强化练习',
  includeHeader = true,
  className = ''
}) => {
  // Get character information
  const getCharacterInfo = (char: string): CharacterInfo => {
    const charData: { [key: string]: CharacterInfo } = {
      '汉': {
        char: '汉',
        pinyin: 'hàn',
        strokeOrder: ['丶', '丶', '一', '丨', '〡', '一'],
        strokeCount: 6
      },
      '字': {
        char: '字',
        pinyin: 'zì',
        strokeOrder: ['丶', '乀', '一', '丨', '一', '一'],
        strokeCount: 6
      },
      '练': {
        char: '练',
        pinyin: 'liàn',
        strokeOrder: ['⺌', '⺍', '⺌', '一', '丨', '一', '一'],
        strokeCount: 8
      },
      '习': {
        char: '习',
        pinyin: 'xí',
        strokeOrder: ['丿', '一', '一'],
        strokeCount: 3
      },
      '书': {
        char: '书',
        pinyin: 'shū',
        strokeOrder: ['丿', '一', '丨', '一'],
        strokeCount: 4
      },
      '法': {
        char: '法',
        pinyin: 'fǎ',
        strokeOrder: ['丶', '丶', '一', '丨', '一', '丨', '丿', '一'],
        strokeCount: 8
      }
    };

    return charData[char] || {
      char,
      pinyin: '',
      strokeOrder: [],
      strokeCount: 0
    };
  };

  const charInfo = getCharacterInfo(character);

  // Generate a row with the same character in all cells
  const generateCharacterRow = (
    showExample: boolean,
    showTracing: boolean,
    key: string
  ) => {
    const rowCells = [];
    const cellsPerRow = gridConfig.cols;
    
    for (let col = 0; col < cellsPerRow; col++) {
      const isExample = showExample && col === 0; // First cell shows darker example
      const isTracing = showTracing && col > 0; // Rest show lighter tracing
      
      rowCells.push(
        <GridCell
          key={`${key}-${col}`}
          type={gridConfig.type}
          size={gridConfig.size}
          className={isExample ? 'border-2 border-red-300 bg-red-50' : ''}
        >
          {(isExample || isTracing) && (
            <PracticeText
              text={character}
              font={textConfig.font}
              opacity={isExample ? 'dark' : textConfig.opacity}
              size={textConfig.size}
            />
          )}
        </GridCell>
      );
    }
    
    return (
      <div key={key} className="flex gap-1 mb-2">
        {rowCells}
      </div>
    );
  };

  // Generate different sections of practice
  const generatePracticeSection = (
    sectionTitle: string,
    showExample: boolean,
    showTracing: boolean,
    rows: number
  ) => {
    const rowElements = [];
    
    for (let row = 0; row < rows; row++) {
      const isExample = showExample && row === 0;
      const isTracing = showTracing && row < 2; // First two rows for tracing
      
      rowElements.push(
        generateCharacterRow(isExample, isTracing, `${sectionTitle}-${row}`)
      );
    }

    return (
      <div className="practice-section mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {sectionTitle}
        </h3>
        <div className="practice-rows">
          {rowElements}
        </div>
      </div>
    );
  };

  return (
    <div className={`single-char-practice bg-white ${className}`}>
      {includeHeader && (
        <div className="header mb-6 text-center border-b pb-4">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <div className="text-sm text-gray-600 flex justify-between mb-2">
            <span>练习汉字: {character}</span>
            <span>拼音: {charInfo.pinyin}</span>
            <span>姓名: ___________</span>
          </div>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>练习日期: ___________</span>
            <span>完成时间: ___________</span>
            <span>老师评分: ___________</span>
          </div>
        </div>
      )}
      
      {/* Practice sections */}
      {generatePracticeSection('描红练习', true, true, 3)}
      {generatePracticeSection('临摹练习', true, false, 3)}
      {generatePracticeSection('默写练习', false, false, 4)}
    </div>
  );
};

export default SingleCharPractice;