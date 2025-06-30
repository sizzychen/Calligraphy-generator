'use client';

import React from 'react';
import { 
  PracticeSheetConfig, 
  PracticeMode, 
  GridType, 
  FontType,
  TextOpacity,
  OPACITY_OPTIONS
} from '@/types';

interface SettingsPanelProps {
  config: PracticeSheetConfig;
  onConfigChange: (config: PracticeSheetConfig) => void;
  className?: string;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  config,
  onConfigChange,
  className = ''
}) => {
  const updateConfig = <K extends keyof PracticeSheetConfig>(
    key: K,
    value: PracticeSheetConfig[K]
  ) => {
    onConfigChange({
      ...config,
      [key]: value,
    });
  };

  const updateGridConfig = <K extends keyof PracticeSheetConfig['grid']>(
    key: K,
    value: PracticeSheetConfig['grid'][K]
  ) => {
    onConfigChange({
      ...config,
      grid: {
        ...config.grid,
        [key]: value,
      },
    });
  };

  const updateTextConfig = <K extends keyof PracticeSheetConfig['text']>(
    key: K,
    value: PracticeSheetConfig['text'][K]
  ) => {
    onConfigChange({
      ...config,
      text: {
        ...config.text,
        [key]: value,
      },
    });
  };

  // Auto-calculate grid size based on A4 paper and columns
  const calculateGridSize = (cols: number) => {
    const a4WidthMm = 210;
    const marginMm = 20; // 10mm margin on each side
    const usableWidthMm = a4WidthMm - marginMm;
    const usableWidthPx = usableWidthMm * 3.78; // Convert mm to px
    const gridSize = Math.floor(usableWidthPx / cols);
    return Math.max(30, Math.min(80, gridSize)); // Ensure reasonable size
  };

  const handleColsChange = (cols: number) => {
    const newGridSize = calculateGridSize(cols);
    onConfigChange({
      ...config,
      grid: {
        ...config.grid,
        cols,
        size: newGridSize,
      },
    });
  };

  const practiceOptions = [
    { value: 'stroke-order', label: '带笔顺字帖' },
    { value: 'article', label: '文章字帖' },
    { value: 'single-char', label: '单字强化帖' },
    { value: 'english', label: '英文字帖' },
  ];

  const gridOptions = [
    { value: 'blank', label: '空白格' },
    { value: 'tian-zi', label: '田字格' },
    { value: 'mi-zi', label: '米字格' },
  ];

  const fontOptions = [
    { value: 'chinese-regular', label: '宋体' },
    { value: 'chinese-calligraphy', label: '楷体' },
    { value: 'stroke-order', label: '行书' },
    { value: 'english', label: '隶书' },
  ];

  const englishFontOptions = [
    { value: 'english', label: 'Arial' },
    { value: 'english-serif', label: 'Times New Roman' },
    { value: 'english-mono', label: 'Courier New' },
    { value: 'english-hand', label: 'Comic Sans MS' },
  ];

  const getCurrentFontOptions = () => {
    return config.mode === 'english' ? englishFontOptions : fontOptions;
  };

  return (
    <div className={`settings-panel bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-lg font-bold mb-4 text-gray-800">字帖设置</h2>
      
      {/* Content Input - Always First */}
      <div className="setting-group mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          练习内容
        </label>
        <textarea
          value={config.text.content}
          onChange={(e) => updateTextConfig('content', e.target.value)}
          placeholder="请输入要练习的内容（留空生成空白格子纸）..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical text-sm"
        />
      </div>

      {/* Practice Mode Selection */}
      <div className="setting-group mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          练习模式
        </label>
        <select
          value={config.mode}
          onChange={(e) => updateConfig('mode', e.target.value as PracticeMode)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {practiceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid Type Selection - Hidden for English mode */}
      {config.mode !== 'english' && (
        <div className="setting-group mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            格子类型
          </label>
          <select
            value={config.grid.type}
            onChange={(e) => updateGridConfig('type', e.target.value as GridType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {gridOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Columns Setting - Hidden for English mode */}
      {config.mode !== 'english' && (
        <div className="setting-group mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            每行格子数: {config.grid.cols}
          </label>
          <input
            type="range"
            min="6"
            max="16"
            step="1"
            value={config.grid.cols}
            onChange={(e) => handleColsChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>6</span>
            <span>16</span>
          </div>
        </div>
      )}

      {/* Font Selection */}
      <div className="setting-group mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          字体
        </label>
        <select
          value={config.text.font}
          onChange={(e) => updateTextConfig('font', e.target.value as FontType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {getCurrentFontOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Text Opacity */}
      <div className="setting-group mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          字体颜色深浅
        </label>
        <select
          value={config.text.opacity}
          onChange={(e) => updateTextConfig('opacity', e.target.value as TextOpacity)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {OPACITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="setting-group mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          字体大小: {config.text.size}px
        </label>
        <input
          type="range"
          min="20"
          max="60"
          step="2"
          value={config.text.size}
          onChange={(e) => updateTextConfig('size', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>20px</span>
          <span>60px</span>
        </div>
      </div>

      {/* Grid Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600">
          <div>格子大小: {config.grid.size}px (自动计算)</div>
          <div>总行数: {config.grid.rows}</div>
          <div>页面规格: A4</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;