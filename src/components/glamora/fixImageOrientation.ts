/**
 * Normalizes image orientation by drawing to canvas.
 * Modern browsers handle EXIF orientation in <img> tags but
 * when we read raw base64 and send it to AI, the orientation
 * metadata may cause the generated image to come back rotated.
 * Drawing to canvas strips EXIF and produces a correctly-oriented image.
 *
 * Uses createObjectURL instead of FileReader.readAsDataURL to avoid
 * memory pressure on devices like iPad with very large camera photos.
 */
export const fixImageOrientation = (file: File, maxDimension = 1536): Promise<string> => {
  return new Promise((resolve, reject) => {
    let objectUrl: string | null = null;

    const cleanup = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    };

    try {
      objectUrl = URL.createObjectURL(file);
    } catch (err) {
      reject(new Error("Failed to create object URL"));
      return;
    }

    const img = new Image();

    img.onload = () => {
      try {
        let { width, height } = img;

        // Scale down if needed — use a lower max on mobile to reduce memory
        const effectiveMax = Math.min(maxDimension, 1280);
        if (width > effectiveMax || height > effectiveMax) {
          const ratio = Math.min(effectiveMax / width, effectiveMax / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          cleanup();
          reject(new Error("Canvas context failed"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

        // Free canvas memory immediately
        canvas.width = 0;
        canvas.height = 0;

        cleanup();
        resolve(dataUrl);
      } catch (err) {
        cleanup();
        reject(err instanceof Error ? err : new Error("Canvas draw failed"));
      }
    };

    img.onerror = () => {
      cleanup();
      reject(new Error("Image load failed"));
    };

    img.src = objectUrl;
  });
};
