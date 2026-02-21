/**
 * Converts image files to WebP format with compression to keep them under 800KB
 */
export async function convertToWebp(files: File[]): Promise<File[]> {
  if (!files || files.length === 0) return [];

  const convertedFiles: File[] = [];

  for (const file of files) {
    try {
      const webpFile = await convertImageToWebp(file);
      convertedFiles.push(webpFile);
    } catch (error) {
      console.error(`Error converting ${file.name} to WebP:`, error);
      // If conversion fails, try to use the original file
      convertedFiles.push(file);
    }
  }

  return convertedFiles;
}

/**
 * Converts a single image file to WebP format with adaptive quality compression
 */
async function convertImageToWebp(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const img = new Image();

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          // Set canvas dimensions
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image on canvas
          ctx.drawImage(img, 0, 0);

          // Convert to WebP with adaptive quality compression
          let quality = 0.8; // Start with 80% quality
          let webpBlob: Blob | null = null;

          const attemptConversion = (q: number) => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Failed to convert to WebP"));
                  return;
                }

                // Check if file size is under 800KB
                if (blob.size <= 800 * 1024) {
                  webpBlob = blob;
                  const webpFile = new File([webpBlob], `${getFileName(file.name)}.webp`, {
                    type: "image/webp",
                  });
                  resolve(webpFile);
                } else if (q > 0.1) {
                  // Reduce quality and retry
                  quality = q - 0.1;
                  attemptConversion(quality);
                } else {
                  // If still over 800KB at low quality, return it anyway
                  const webpFile = new File([blob], `${getFileName(file.name)}.webp`, {
                    type: "image/webp",
                  });
                  resolve(webpFile);
                }
              },
              "image/webp",
              q,
            );
          };

          attemptConversion(quality);
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        img.src = e.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Helper function to extract filename without extension
 */
function getFileName(fullName: string): string {
  return fullName.substring(0, fullName.lastIndexOf(".")) || fullName;
}
