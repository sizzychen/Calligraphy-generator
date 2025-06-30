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

  // Generate blank grid when no character is provided
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
        <div key={row} className="flex mb-2">
          {rowCells}
        </div>
      );
    }

    return rows;
  };

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
      
      rowCells.push(
        <GridCell
          key={`${key}-${col}`}
          type={gridConfig.type}
          size={gridConfig.size}
          className={isExample ? 'border-2 border-red-300 bg-red-50' : ''}
        >
          {/* Only show character in example cell (first cell), rest are blank */}
          {isExample && (
            <PracticeText
              text={character}
              font={textConfig.font}
              opacity="dark"
              size={textConfig.size}
            />
          )}
        </GridCell>
      );
    }
    
    return (
      <div key={key} className="flex mb-2">
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
      
      rowElements.push(
        generateCharacterRow(isExample, false, `${sectionTitle}-${row}`)
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
            <span>练习汉字: {character || '空白练习'}</span>
            <span>拼音: {charInfo.pinyin || ''}</span>
            <span></span>
          </div>
          <div className="text-sm text-gray-600 flex justify-between">
            <span>姓名: ___________</span>
            <span>练习日期: ___________</span>
            <span>签名: ___________</span>
          </div>
        </div>
      )}
      
      {/* Practice sections */}
      {!character || character.trim() === '' ? (
        <div className="practice-section">
          {generateBlankGrid()}
        </div>
      ) : (
        <>
          {generatePracticeSection('描红练习', true, false, 3)}
          {generatePracticeSection('临摹练习', true, false, 3)}
          {generatePracticeSection('默写练习', false, false, 4)}
        </>
      )}
    </div>
  );
};

export default SingleCharPractice;