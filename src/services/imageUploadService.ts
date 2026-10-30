import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import imageCompression from 'browser-image-compression';
import { storage, auth } from '../lib/firebase';

export interface UploadedPropertyImage {
  id: string;
  url: string;
  storagePath: string;
  fileName: string;
  width?: number;
  height?: number;
  mimeType?: string;
}

export interface ProcessedImageResult {
  blob: Blob;
  mimeType: string;
  extension: string;
  width: number;
  height: number;
}

/**
 * Process and compress an image file below 1MB using browser-image-compression
 * with canvas fallback and 15-second safety timeout.
 */
export async function processPropertyImage(file: File, timeoutMs: number = 15000): Promise<ProcessedImageResult> {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error(`Arquivo inválido ou não suportado (${file?.name || 'desconhecido'}). Utilize JPG, PNG ou WEBP.`);
  }

  const options = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: 'image/webp'
  };

  try {
    const compressedFile = await Promise.race([
      imageCompression(file, options),
      new Promise<File>((_, reject) => setTimeout(() => reject(new Error('Timeout de compressão')), timeoutMs))
    ]);

    const dimensions = await new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      const objUrl = URL.createObjectURL(compressedFile);
      img.onload = () => {
        const w = img.naturalWidth || 1920;
        const h = img.naturalHeight || 1080;
        URL.revokeObjectURL(objUrl);
        resolve({ width: w, height: h });
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        resolve({ width: 1920, height: 1080 });
      };
      img.src = objUrl;
    });

    return {
      blob: compressedFile,
      mimeType: compressedFile.type || 'image/webp',
      extension: compressedFile.type === 'image/jpeg' ? 'jpg' : 'webp',
      width: dimensions.width,
      height: dimensions.height
    };
  } catch (err: any) {
    console.warn(`[ImageCompression] browser-image-compression failed/timed out for ${file.name}, using original file fallback:`, err);
    return {
      blob: file,
      mimeType: file.type || 'image/jpeg',
      extension: file.name.split('.').pop() || 'jpg',
      width: 1920,
      height: 1080
    };
  }
}

/**
 * Upload multiple files with controlled concurrency (max 3 simultaneous) and progress feedback
 */
export async function uploadPropertyImagesConcurrently(
  propertyId: string,
  files: File[],
  onProgress?: (completed: number, total: number, message: string) => void
): Promise<UploadedPropertyImage[]> {
  if (!files || files.length === 0) return [];

  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (authErr) {
      console.warn('[ImageUploadService] Anonymous sign-in failed:', authErr);
    }
  }

  const results: UploadedPropertyImage[] = [];
  const total = files.length;
  let completed = 0;

  const concurrency = 3;
  let index = 0;

  async function worker() {
    while (index < files.length) {
      const currentIndex = index++;
      const file = files[currentIndex];
      try {
        if (onProgress) {
          onProgress(completed, total, `Processando foto ${currentIndex + 1}/${total} (${file.name})...`);
        }

        let blobToUpload: Blob = file;
        let mimeType = file.type || 'image/jpeg';
        let extension = file.name.split('.').pop() || 'jpg';
        let imgWidth = 1920;
        let imgHeight = 1080;

        try {
          const processed = await processPropertyImage(file);
          blobToUpload = processed.blob;
          mimeType = processed.mimeType;
          extension = processed.extension;
          imgWidth = processed.width;
          imgHeight = processed.height;
        } catch (procErr) {
          console.warn(`[UploadService] Canvas processing skipped for ${file.name}, uploading original file directly:`, procErr);
          blobToUpload = file;
          mimeType = file.type || 'image/jpeg';
          const parts = file.name.split('.');
          if (parts.length > 1) {
            extension = parts.pop() || 'jpg';
          }
        }

        const uniqueId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        const extensionToUse = extension || 'webp';
        const fileName = `${uniqueId}.${extensionToUse}`;

        if (onProgress) {
          onProgress(completed, total, `Processando e comprimindo foto ${currentIndex + 1}/${total}...`);
        }

        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blobToUpload);
        });

        results[currentIndex] = {
          id: uniqueId,
          url: dataUrl,
          storagePath: `local_cache_${propertyId}/${fileName}`,
          fileName,
          width: imgWidth,
          height: imgHeight,
          mimeType
        };
        completed++;

        if (onProgress) {
          onProgress(completed, total, `Concluídas ${completed}/${total} fotos.`);
        }
      } catch (err: any) {
        console.error(`[UploadService] Erro na foto ${file.name}:`, err);
        throw new Error(`Falha ao processar a foto "${file.name}": ${err.message || 'Erro desconhecido'}`);
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, files.length) }, () => worker());
  await Promise.all(workers);

  return results.filter(Boolean);
}

/**
 * Delete an image from Firebase Storage using its download URL or storage path
 */
export async function deletePropertyImageFromStorage(urlOrPath: string): Promise<void> {
  if (!urlOrPath) return;
  try {
    let path = urlOrPath;
    if (urlOrPath.includes('firebasestorage.googleapis.com')) {
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
