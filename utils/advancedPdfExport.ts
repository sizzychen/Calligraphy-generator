'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PDFExportOptions } from '@/types';

// Advanced PDF export utility with better font handling
export class AdvancedPDFExporter {
  private static readonly A4_WIDTH = 210; // mm
  private static readonly A4_HEIGHT = 297; // mm
  private static readonly DPI = 300; // dots per inch for high quality
  private static readonly MM_TO_PX = 3.78; // conversion factor

  /**
   * Export HTML element to PDF with improved font rendering
   */
  static async exportElementToPDF(
    element: HTMLElement,
    options: PDFExportOptions
  ): Promise<void> {
    try {
      // Wait for fonts to load
      await document.fonts.ready;
      
      // Clone the element to avoid affecting the original
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Create a temporary container for the cloned element
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm';
      tempContainer.style.height = '297mm';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
      tempContainer.className = 'pdf-export';
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      // Remove elements that shouldn't be in the PDF
      const elementsToHide = clonedElement.querySelectorAll('.no-print, .preview-header, .preview-info');
      elementsToHide.forEach(el => el.remove());

      // Apply enhanced styles for better rendering
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .pdf-export * {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        .pdf-export .practice-text {
          font-family: Georgia, "Times New Roman", serif !important;
          font-size: 1.2em !important;
          color: rgba(0, 0, 0, 0.3) !important;
          font-weight: 400 !important;
          line-height: 1 !important;
          text-align: center !important;
        }
        
        .pdf-export .practice-text-light {
          color: rgba(0, 0, 0, 0.2) !important;
        }
        
        .pdf-export .practice-text-medium {
          color: rgba(0, 0, 0, 0.3) !important;
        }
        
        .pdf-export .practice-text-dark {
          color: rgba(0, 0, 0, 0.4) !important;
        }
        
        .pdf-export .grid-cell {
          border: 1px solid #000 !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(styleElement);

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create canvas from the cleaned element with optimized settings
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: clonedElement.scrollWidth,
        height: clonedElement.scrollHeight,
        windowWidth: clonedElement.scrollWidth,
        windowHeight: clonedElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Apply additional styles to cloned document
          const clonedStyle = clonedDoc.createElement('style');
          clonedStyle.textContent = `
            * {
              font-family: Georgia, "Times New Roman", serif !important;
              -webkit-font-smoothing: antialiased !important;
              -moz-osx-font-smoothing: grayscale !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
            }
            
            .practice-text {
              color: rgba(0, 0, 0, 0.3) !important;
              font-size: 1.2em !important;
              font-weight: 400 !important;
              line-height: 1 !important;
              text-align: center !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            .grid-cell {
              border: 1px solid #000 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
          `;
          clonedDoc.head.appendChild(clonedStyle);
        }
      });

      // Clean up
      document.head.removeChild(styleElement);
      document.body.removeChild(tempContainer);

      // Calculate dimensions
      const imgWidth = this.A4_WIDTH - 20; // Leave some margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Create PDF
      const pdf = new jsPDF({
        orientation: options.orientation,
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Add the image to PDF
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        10, // x margin
        10, // y margin
        imgWidth,
        Math.min(imgHeight, this.A4_HEIGHT - 20) // Ensure it fits on page
      );

      // Save the PDF
      const filename = options.filename || 'practice-sheet.pdf';
      pdf.save(filename);

    } catch (error) {
      console.error('PDF export failed:', error);
      throw error;
    }
  }

  /**
   * Alternative method using browser's print functionality
   */
  static async printToPDF(element: HTMLElement): Promise<void> {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }

    // Copy the element content to the print window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>汉字练习册</title>
        <meta charset="utf-8">
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            margin: 0;
            padding: 0;
            background: white;
          }
          .practice-text {
            font-family: Georgia, "Times New Roman", serif !important;
            color: rgba(0, 0, 0, 0.3) !important;
            font-size: 1.2em !important;
            font-weight: 400 !important;
            line-height: 1 !important;
            text-align: center !important;
          }
          .grid-cell {
            border: 1px solid #000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();
    
    // Wait for content to load
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }
}

// Export functions for backward compatibility
export const exportToPDF = AdvancedPDFExporter.exportElementToPDF;
export const printToPDF = AdvancedPDFExporter.printToPDF;