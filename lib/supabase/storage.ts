import { supabase } from './client';

const BUCKET_NAME = 'jimpitan-photos';

/**
 * Upload photo to Supabase Storage
 * @param file - File object to upload
 * @param jimpitanId - ID of the jimpitan record
 * @returns Public URL of the uploaded photo
 */
export async function uploadJimpitanPhoto(
  file: File,
  jimpitanId: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // DEBUG: Log authentication status
    const { data: { session } } = await supabase.auth.getSession();
    console.log('[DEBUG] Upload photo - Auth status:', {
      hasSession: !!session,
      userId: session?.user?.id,
      bucketName: BUCKET_NAME
    });

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'
      };
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Ukuran file terlalu besar. Maksimal 5MB.'
      };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${jimpitanId}_${Date.now()}.${fileExt}`;

    console.log('[DEBUG] Attempting to upload:', {
      fileName,
      fileSize: file.size,
      fileType: file.type
    });

    // Upload file
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('Error uploading photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal mengupload foto'
    };
  }
}

/**
 * Delete photo from Supabase Storage
 * @param photoUrl - Public URL of the photo
 */
export async function deleteJimpitanPhoto(
  photoUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Extract filename from URL
    const urlParts = photoUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting photo:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal menghapus foto'
    };
  }
}

/**
 * Compress image before upload (optional optimization)
 * @param file - Original file
 * @param maxWidth - Maximum width in pixels
 * @param quality - JPEG quality (0-1)
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1024,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Gagal mengompresi gambar'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => reject(new Error('Gagal memuat gambar'));
    img.src = URL.createObjectURL(file);
  });
}
