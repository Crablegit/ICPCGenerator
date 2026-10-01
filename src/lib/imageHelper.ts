/**
 * Processes and compresses an uploaded or pasted image file.
 * Resizes the image to a maximum dimension while maintaining aspect ratio and transparency.
 * Keeps dataURL size tiny (~15KB-40KB) to prevent localStorage quota errors.
 */
export function processImageFile(file: File | Blob, maxWidth = 280, maxHeight = 280): Promise<string> {
  return new Promise((resolve, reject) => {
    // If SVG, read as text or dataURL directly if small
    if (file.type === 'image/svg+xml' && file.size < 100 * 1024) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        // Draw image on canvas
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Export as PNG to preserve transparent backgrounds in school logos
        const dataUrl = canvas.toDataURL('image/png', 0.92);
        resolve(dataUrl);
      };

      img.onerror = () => {
        // Fallback to raw dataURL if image loading fails
        resolve(reader.result as string);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
