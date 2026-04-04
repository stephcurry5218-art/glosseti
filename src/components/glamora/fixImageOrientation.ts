/**
 * Normalizes image orientation by drawing to canvas.
 * Modern browsers handle EXIF orientation in <img> tags but
 * when we read raw base64 and send it to AI, the orientation
 * metadata may cause the generated image to come back rotated.
 * Drawing to canvas strips EXIF and produces a correctly-oriented image.
 */
export const fixImageOrientation = (file: File, maxDimension = 1536): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if needed
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas context failed")); return; }

      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      resolve(dataUrl);
    };
    img.onerror = () => reject(new Error("Image load failed"));

    const reader = new FileReader();
    reader.onload = (e) => { img.src = e.target?.result as string; };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
};
