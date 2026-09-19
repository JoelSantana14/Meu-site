import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Process and compress an image file in the browser before upload:
 * - Max dimensions: 1920x1920 (maintaining aspect ratio)
 * - Format: WebP (quality 0.80) with JPEG fallback
 * - Handles EXIF orientation where possible via canvas rendering
 */
export async function processPropertyImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = (error) => reject(error);
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = (error) => reject(error);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1920;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Falha ao inicializar contexto canvas 2D.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (quality 0.80), fallback to JPEG 0.80
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob) resolve(jpegBlob);
                  else reject(new Error('Falha ao compactar imagem.'));
                },
                'image/jpeg',
                0.80
              );
            }
          },
          'image/webp',
          0.80
        );
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a single image file to Firebase Storage under properties/{propertyId}/images/{filename}.webp
 */
export async function uploadPropertyImage(propertyId: string, file: File, onProgress?: (msg: string) => void): Promise<string> {
  const compressedBlob = await processPropertyImage(file);
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const storagePath = `properties/${propertyId}/images/${uniqueId}.webp`;
  const storageRef = ref(storage, storagePath);

  if (onProgress) onProgress(`Enviando ${file.name}...`);
  
  const snapshot = await uploadBytes(storageRef, compressedBlob, {
    contentType: 'image/webp',
    customMetadata: { originalName: file.name }
  });

  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

/**
 * Delete an image from Firebase Storage using its download URL or storage path
 */
export async function deletePropertyImageFromStorage(urlOrPath: string): Promise<void> {
  if (!urlOrPath) return;
  try {
    let path = urlOrPath;
    if (urlOrPath.includes('firebasestorage.googleapis.com')) {
      // Extract path from Firebase Storage URL
      const decoded = decodeURIComponent(urlOrPath);
      const match = decoded.match(/\/o\/(.+?)\?/);
      if (match && match[1]) {
        path = match[1];
      }
    }
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('[ImageUploadService] Could not delete file from storage (might already be removed):', err);
  }
}
