'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFExportOptions } from '@/types';

// PDF export utility functions
export class PDFExporter {
  private static readonly A4_WIDTH = 210; // mm
  private static readonly A4_HEIGHT = 297; // mm
  private static readonly DPI = 300; // dots per inch for high quality
  private static readonly MM_TO_PX = 3.78; // conversion factor

  /**
   * Export HTML element to PDF
   */
  static async exportElementToPDF(
    element: HTMLElement,
    options: PDFExportOptions
  ): Promise<void> {
    try {
      // Clone the element to avoid affecting the original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Create a temporary container for the cloned element
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm';
      tempContainer.style.minHeight = '297mm';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.className = 'pdf-export';
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      // Remove elements that shouldn't be in the PDF
      const elementsToHide = clonedElement.querySelectorAll('.no-print, .preview-header, .preview-info');
      elementsToHide.forEach(el => el.remove());

      // Create canvas from the cleaned element
      const canvas = await html2canvas(clonedElement, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
        foreignObjectRendering: true, // Better text rendering
        letterRendering: true, // Better letter rendering
        onclone: (clonedDoc) => {
          // Apply print styles to the cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap');
            * { 
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif !important;
            }
            .grid-cell { 
              border: 1px solid #333 !important; 
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              position: relative !important;
            }
            .practice-text { 
              position: absolute !important;
              top: 50% !important;
              left: 50% !important;
              transform: translate(-50%, -50%) !important;
              width: 90% !important;
              height: 90% !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', serif !important;
              font-weight: 400 !important;
              line-height: 1 !important;
              color: rgba(0, 0, 0, 0.25) !important;
              font-size: inherit !important;
            }
            .practice-text-light {
              color: rgba(0, 0, 0, 0.15) !important;
            }
            .practice-text-medium {
              color: rgba(0, 0, 0, 0.25) !important;
            }
            .practice-text-dark {
              color: rgba(0, 0, 0, 0.35) !important;
            }
            .mi-zi-grid {
              background-image: 
                url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cline x1='0' y1='0' x2='100' y2='100' stroke='%23ccc' stroke-width='1' stroke-dasharray='2,2' /%3E%3Cline x1='100' y1='0' x2='0' y2='100' stroke='%23ccc' stroke-width='1' stroke-dasharray='2,2' /%3E%3C/svg%3E") !important;
              background-size: 100% 100% !important;
              background-repeat: no-repeat !important;
            }
            .mi-zi-grid::before {
              content: '' !important;
              position: absolute !important;
              top: 0 !important;
              left: 50% !important;
              width: 0 !important;
              height: 100% !important;
              border-left: 1px dashed #ccc !important;
            }
            .mi-zi-grid::after {
              content: '' !important;
              position: absolute !important;
              top: 50% !important;
              left: 0 !important;
              width: 100% !important;
              height: 0 !important;
              border-top: 1px dashed #ccc !important;
            }
            .tian-zi-grid::before {
              content: '' !important;
              position: absolute !important;
              top: 50% !important;
              left: 0 !important;
              width: 100% !important;
              height: 0 !important;
              border-top: 1px dashed #ccc !important;
            }
            .tian-zi-grid::after {
              content: '' !important;
              position: absolute !important;
              top: 0 !important;
              left: 50% !important;
              width: 0 !important;
              height: 100% !important;
              border-left: 1px dashed #ccc !important;
            }
            .four-line-grid {
              border-top: 2px solid #333 !important;
              border-bottom: 2px solid #333 !important;
              position: relative !important;
            }
            .four-line-grid::before {
              content: '' !important;
              position: absolute !important;
              top: 33.33% !important;
              left: 0 !important;
              width: 100% !important;
              height: 0 !important;
              border-top: 1px dashed #999 !important;
            }
            .four-line-grid::after {
              content: '' !important;
              position: absolute !important;
              top: 66.66% !important;
              left: 0 !important;
              width: 100% !important;
              height: 0 !important;
              border-top: 1px dashed #999 !important;
            }
            .no-print { 
              display: none !important; 
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Clean up temporary container
      document.body.removeChild(tempContainer);

      // Calculate dimensions
      const imgWidth = this.A4_WIDTH;
      const pageHeight = this.A4_HEIGHT;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Create PDF
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: 'a4',
      });

      let position = 0;

      // Add pages as needed
      while (heightLeft >= 0) {
        const pageCanvas = document.createElement('canvas');
        const pageContext = pageCanvas.getContext('2d');
        
        if (!pageContext) {
          throw new Error('Failed to get canvas context');
        }

        // Calculate page dimensions
        const pageStartY = position * canvas.width / imgWidth;
        const pageEndY = Math.min(pageStartY + (pageHeight * canvas.width / imgWidth), canvas.height);
        
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageEndY - pageStartY;

        // Draw the portion of the canvas for this page
        pageContext.drawImage(
          canvas,
          0, pageStartY, canvas.width, pageEndY - pageStartY,
          0, 0, canvas.width, pageEndY - pageStartY
        );

        const pageImgData = pageCanvas.toDataURL('image/jpeg', options.quality);
        
        if (position > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          pageImgData,
          'JPEG',
          0,
          0,
          imgWidth,
          Math.min(pageHeight, (pageEndY - pageStartY) * imgWidth / canvas.width)
        );

        heightLeft -= pageHeight;
        position += pageHeight;
      }

      // Save the PDF
      pdf.save(options.filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw new Error('PDF导出失败，请重试');
    }
  }

  /**
   * Export multiple elements as separate pages
   */
  static async exportMultipleElementsToPDF(
    elements: HTMLElement[],
    options: PDFExportOptions
  ): Promise<void> {
    try {
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: 'a4',
      });

      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        
        // Clone the element to avoid affecting the original
        const clonedElement = element.cloneNode(true) as HTMLElement;
        
        // Create a temporary container for the cloned element
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '210mm';
        tempContainer.style.minHeight = '297mm';
        tempContainer.style.backgroundColor = 'white';
        tempContainer.className = 'pdf-export';
        tempContainer.appendChild(clonedElement);
        document.body.appendChild(tempContainer);

        // Remove elements that shouldn't be in the PDF
        const elementsToHide = clonedElement.querySelectorAll('.no-print, .preview-header, .preview-info');
        elementsToHide.forEach(el => el.remove());
        
        // Create canvas from HTML element
        const canvas = await html2canvas(clonedElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: clonedElement.scrollWidth,
          height: clonedElement.scrollHeight,
          onclone: (clonedDoc) => {
            // Apply print styles to the cloned document
            const style = clonedDoc.createElement('style');
            style.textContent = `
              * { 
                print-color-adjust: exact !important;
                -webkit-print-color-adjust: exact !important;
              }
              .grid-cell { 
                border: 1px solid #333 !important; 
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                position: relative !important;
              }
              .practice-text { 
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                width: 100% !important;
                height: 100% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: inherit !important;
              }
              .practice-text-light {
                color: rgba(0, 0, 0, 0.15) !important;
              }
              .practice-text-medium {
                color: rgba(0, 0, 0, 0.25) !important;
              }
              .practice-text-dark {
                color: rgba(0, 0, 0, 0.35) !important;
              }
              .mi-zi-grid {
                background-image: 
                  linear-gradient(45deg, transparent 49.5%, #ccc 49.5%, #ccc 50.5%, transparent 50.5%),
                  linear-gradient(-45deg, transparent 49.5%, #ccc 49.5%, #ccc 50.5%, transparent 50.5%) !important;
                background-size: 100% 100% !important;
                background-repeat: no-repeat !important;
              }
              .mi-zi-grid::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 50% !important;
                width: 0 !important;
                height: 100% !important;
                border-left: 1px dashed #ccc !important;
              }
              .mi-zi-grid::after {
                content: '' !important;
                position: absolute !important;
                top: 50% !important;
                left: 0 !important;
                width: 100% !important;
                height: 0 !important;
                border-top: 1px dashed #ccc !important;
              }
              .tian-zi-grid::before {
                content: '' !important;
                position: absolute !important;
                top: 50% !important;
                left: 0 !important;
                width: 100% !important;
                height: 0 !important;
                border-top: 1px dashed #ccc !important;
              }
              .tian-zi-grid::after {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 50% !important;
                width: 0 !important;
                height: 100% !important;
                border-left: 1px dashed #ccc !important;
              }
              .four-line-grid {
                border-top: 2px solid #333 !important;
                border-bottom: 2px solid #333 !important;
                position: relative !important;
              }
              .four-line-grid::before {
                content: '' !important;
                position: absolute !important;
                top: 33.33% !important;
                left: 0 !important;
                width: 100% !important;
                height: 0 !important;
                border-top: 1px dashed #999 !important;
              }
              .four-line-grid::after {
                content: '' !important;
                position: absolute !important;
                top: 66.66% !important;
                left: 0 !important;
                width: 100% !important;
                height: 0 !important;
                border-top: 1px dashed #999 !important;
              }
              .no-print { 
                display: none !important; 
              }
            `;
            clonedDoc.head.appendChild(style);
          }
        });

        // Clean up temporary container
        document.body.removeChild(tempContainer);

        const imgData = canvas.toDataURL('image/jpeg', options.quality);
        const imgWidth = this.A4_WIDTH;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (i > 0) {
          pdf.addPage();
        }

        // If image is taller than page, scale it down
        if (imgHeight > this.A4_HEIGHT) {
          const scaledHeight = this.A4_HEIGHT;
          const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
          pdf.addImage(imgData, 'JPEG', 0, 0, scaledWidth, scaledHeight);
        } else {
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        }
      }

      pdf.save(options.filename);
    } catch (error) {
      console.error('Error exporting multiple elements to PDF:', error);
      throw new Error('PDF导出失败，请重试');
    }
  }

  /**
   * Prepare element for PDF export (optimize for printing)
   */
  static prepareElementForExport(element: HTMLElement): void {
    // Add print-specific styles
    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';
    element.style.fontSize = '12pt';
    element.style.lineHeight = '1.2';

    // Ensure borders are visible
    const gridCells = element.querySelectorAll('.grid-cell');
    gridCells.forEach((cell) => {
      (cell as HTMLElement).style.border = '1px solid #cccccc';
    });

    // Make practice text more visible for PDF
    const practiceTexts = element.querySelectorAll('.practice-text');
    practiceTexts.forEach((text) => {
      const htmlElement = text as HTMLElement;
      const currentOpacity = parseFloat(getComputedStyle(htmlElement).opacity || '0.2');
      htmlElement.style.opacity = Math.max(currentOpacity, 0.15).toString();
    });
  }

  /**
   * Restore element after PDF export
   */
  static restoreElementAfterExport(element: HTMLElement): void {
    // Remove inline styles added for export
    element.style.backgroundColor = '';
    element.style.color = '';
    element.style.fontSize = '';
    element.style.lineHeight = '';

    // Restore grid cell styles
    const gridCells = element.querySelectorAll('.grid-cell');
    gridCells.forEach((cell) => {
      (cell as HTMLElement).style.border = '';
    });

    // Restore practice text opacity
    const practiceTexts = element.querySelectorAll('.practice-text');
    practiceTexts.forEach((text) => {
      (text as HTMLElement).style.opacity = '';
    });
  }

  /**
   * Generate filename based on current date and practice type
   */
  static generateFilename(practiceType: string, title?: string): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, ''); // HHMMSS format
    
    let filename = `${practiceType}_${dateStr}_${timeStr}`;
    
    if (title && title.trim()) {
      const sanitizedTitle = title.trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '_');
      filename = `${sanitizedTitle}_${filename}`;
    }
    
    return `${filename}.pdf`;
  }

  /**
   * Validate export options
   */
  static validateExportOptions(options: PDFExportOptions): boolean {
    if (!options.filename || options.filename.trim() === '') {
      return false;
    }
    
    if (options.quality < 0.1 || options.quality > 1.0) {
      return false;
    }
    
    return true;
  }
}

/**
 * Quick export function for common use cases
 */
export async function exportPracticeSheetToPDF(
  elementId: string,
  practiceType: string,
  title?: string,
  quality: number = 0.9
): Promise<void> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('未找到要导出的元素');
  }

  const options: PDFExportOptions = {
    filename: PDFExporter.generateFilename(practiceType, title),
    quality,
    format: 'A4',
    orientation: 'portrait',
  };

  if (!PDFExporter.validateExportOptions(options)) {
    throw new Error('导出选项无效');
  }

  // Prepare element for export
  PDFExporter.prepareElementForExport(element);

  try {
    await PDFExporter.exportElementToPDF(element, options);
  } finally {
    // Always restore element state
    PDFExporter.restoreElementAfterExport(element);
  }
}

/**
 * Export with custom options
 */
export async function exportWithCustomOptions(
  elementId: string,
  options: PDFExportOptions
): Promise<void> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error('未找到要导出的元素');
  }

  if (!PDFExporter.validateExportOptions(options)) {
    throw new Error('导出选项无效');
  }

  PDFExporter.prepareElementForExport(element);

  try {
    await PDFExporter.exportElementToPDF(element, options);
  } finally {
    PDFExporter.restoreElementAfterExport(element);
  }
}