// Grid types
export type GridType = 'blank' | 'tian-zi' | 'mi-zi' | 'four-line';

// Practice sheet modes
export type PracticeMode = 
  | 'stroke-order'     // 带笔顺字帖
  | 'article'          // 文章字帖
  | 'single-char'      // 单字强化帖
  | 'english';         // 英文字帖

// Font options
export type FontType = 
  | 'chinese-regular'      // 常规中文字体
  | 'chinese-calligraphy'  // 书法字体
  | 'stroke-order'         // 笔顺字体
  | 'english'              // 英文字体 Arial
  | 'english-serif'        // 英文衬线字体 Times New Roman
  | 'english-mono'         // 英文等宽字体 Courier New
  | 'english-hand';        // 英文手写字体 Comic Sans MS

// Text opacity levels
export type TextOpacity = 'light' | 'medium' | 'dark';

// Paper size
export type PaperSize = 'A4';

// Grid configuration
export interface GridConfig {
  type: GridType;
  size: number;        // Grid cell size in pixels
  rows: number;        // Number of rows per page
  cols: number;        // Number of columns per row
  spacing: number;     // Spacing between grids
}

// Text configuration
export interface TextConfig {
  content: string;
  font: FontType;
  opacity: TextOpacity;
  size: number;        // Font size
  showPinyin?: boolean;
  showStrokeOrder?: boolean;
}

// Practice sheet configuration
export interface PracticeSheetConfig {
  mode: PracticeMode;
  grid: GridConfig;
  text: TextConfig;
  title?: string;
  paperSize: PaperSize;
  includeHeader?: boolean;
  includeFooter?: boolean;
}

// Character with stroke order information
export interface CharacterInfo {
  char: string;
  pinyin?: string;
  strokeOrder?: string[];
  strokeCount?: number;
}

// PDF export options
export interface PDFExportOptions {
  filename: string;
  quality: number;     // 0.1 to 1.0
  format: PaperSize;
  orientation: 'portrait' | 'landscape';
}

// Image export options
export interface ImageExportOptions {
  filename: string;
  format?: 'png' | 'jpeg';
  quality?: number;    // 0.1 to 1.0
  scale?: number;      // 1-3 for different quality levels
}

// Export type
export type ExportType = 'pdf' | 'png' | 'jpeg';

// Component props
export interface GridCellProps {
  type: GridType;
  size: number;
  children?: React.ReactNode;
  className?: string;
}

export interface PracticeTextProps {
  text: string;
  font: FontType;
  opacity: TextOpacity;
  size: number;
  showPinyin?: boolean;
  className?: string;
}

export interface PracticeSheetProps {
  config: PracticeSheetConfig;
  onConfigChange: (config: PracticeSheetConfig) => void;
}

// Settings panel props
export interface SettingsPanelProps {
  config: PracticeSheetConfig;
  onConfigChange: (config: PracticeSheetConfig) => void;
}

// Preview component props
export interface PreviewProps {
  config: PracticeSheetConfig;
  onExportPDF: () => void;
}

// Available fonts
export const FONT_OPTIONS: { value: FontType; label: string; preview: string }[] = [
  { value: 'chinese-regular', label: '常规字体', preview: '汉字练习' },
  { value: 'chinese-calligraphy', label: '书法字体', preview: '汉字练习' },
  { value: 'stroke-order', label: '笔顺字体', preview: '汉字练习' },
  { value: 'english', label: '英文字体 (Arial)', preview: 'English' },
  { value: 'english-serif', label: '英文衬线 (Times)', preview: 'English' },
  { value: 'english-mono', label: '英文等宽 (Courier)', preview: 'English' },
  { value: 'english-hand', label: '英文手写 (Comic Sans)', preview: 'English' },
];

// Available grid types
export const GRID_OPTIONS: { value: GridType; label: string; description: string }[] = [
  { value: 'blank', label: '空白格', description: '无辅助线的空白格子' },
  { value: 'tian-zi', label: '田字格', description: '带十字辅助线的田字格' },
  { value: 'mi-zi', label: '米字格', description: '带米字辅助线的米字格' },
];

// Available practice modes
export const PRACTICE_MODE_OPTIONS: { value: PracticeMode; label: string; description: string }[] = [
  { value: 'stroke-order', label: '带笔顺字帖', description: '显示汉字笔顺的练习字帖' },
  { value: 'article', label: '文章字帖', description: '根据文章内容生成的练习字帖' },
  { value: 'single-char', label: '单字强化帖', description: '针对单个汉字的强化练习' },
  { value: 'english', label: '英文字帖', description: '英文字母和单词练习字帖' },
];

// Text opacity options
export const OPACITY_OPTIONS: { value: TextOpacity; label: string; opacity: number }[] = [
  { value: 'light', label: '浅灰', opacity: 0.15 },
  { value: 'medium', label: '中灰', opacity: 0.25 },
  { value: 'dark', label: '深灰', opacity: 0.35 },
];

// Default configurations
export const DEFAULT_GRID_CONFIG: GridConfig = {
  type: 'tian-zi',
  size: 60,
  rows: 12,
  cols: 10,
  spacing: 2,
};

export const DEFAULT_TEXT_CONFIG: TextConfig = {
  content: '',
  font: 'chinese-regular',
  opacity: 'light',
  size: 48,
  showPinyin: false,
  showStrokeOrder: false,
};

export const DEFAULT_PRACTICE_SHEET_CONFIG: PracticeSheetConfig = {
  mode: 'article',
  grid: DEFAULT_GRID_CONFIG,
  text: DEFAULT_TEXT_CONFIG,
  title: '汉字练习字帖',
  paperSize: 'A4',
  includeHeader: true,
  includeFooter: false,
};

// PDF Export options
export interface PDFExportOptions {
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'A4' | 'A3' | 'A5' | 'letter';
  quality?: number;
}