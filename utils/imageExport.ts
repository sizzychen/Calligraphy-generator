'use client';

import html2canvas from 'html2canvas';

export interface ImageExportOptions {
  filename: string;
  format?: 'png' | 'jpeg';
  quality?: number;
  scale?: number;
}

/**
 * Image export utility using html2canvas
 */
export class ImageExporter {
  /**
   * Export HTML element to image file
   */
  static async exportElementToImage(
    element: HTMLElement,
    options: ImageExportOptions
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
      tempContainer.style.backgroundColor = 'white';
      tempContainer.className = 'image-export';
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      // Remove elements that shouldn't be in the image
      const elementsToHide = clonedElement.querySelectorAll('.no-print, .preview-header, .preview-info');
      elementsToHide.forEach(el => el.remove());

      // Apply enhanced styles for better rendering
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .image-export * {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }
        
        .image-export .practice-text {
          font-family: Georgia, "Times New Roman", serif !important;
          font-size: 1.2em !important;
          color: rgba(0, 0, 0, 0.3) !important;
          font-weight: 400 !important;
          line-height: 1 !important;
          text-align: center !important;
        }
        
        .image-export .practice-text-light {
          color: rgba(0, 0, 0, 0.2) !important;
        }
        
        .image-export .practice-text-medium {
          color: rgba(0, 0, 0, 0.3) !important;
        }
        
        .image-export .practice-text-dark {
          color: rgba(0, 0, 0, 0.4) !important;
        }
        
        .image-export .grid-cell {
          border: 1px solid #000 !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(styleElement);

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create canvas from the cleaned element with optimized settings
      const canvas = await html2canvas(clonedElement, {
        scale: options.scale || 2,
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

      // Convert canvas to image data
      const format = options.format || 'png';
      const quality = options.quality || 0.95;
      const imageData = canvas.toDataURL(`image/${format}`, quality);

      // Create download link
      const link = document.createElement('a');
      link.download = options.filename;
      link.href = imageData;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Image export failed:', error);
      throw error;
    }
  }

  /**
   * Export element to PNG
   */
  static async exportToPNG(element: HTMLElement, filename: string): Promise<void> {
    return this.exportElementToImage(element, {
      filename: filename.endsWith('.png') ? filename : `${filename}.png`,
      format: 'png'
    });
  }

  /**
   * Export element to JPEG
   */
  static async exportToJPEG(element: HTMLElement, filename: string, quality: number = 0.9): Promise<void> {
    return this.exportElementToImage(element, {
      filename: filename.endsWith('.jpg') || filename.endsWith('.jpeg') ? filename : `${filename}.jpg`,
      format: 'jpeg',
      quality
    });
  }
}