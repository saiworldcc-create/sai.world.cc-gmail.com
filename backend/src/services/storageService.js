const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');

const UPLOADS_DIR = path.join(__dirname, '../../public/uploads');

// Ensure local uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

let imagekitClient = null;
const isImageKitConfigured = Boolean(
  process.env.IMAGEKIT_PUBLIC_KEY &&
  process.env.IMAGEKIT_PRIVATE_KEY &&
  process.env.IMAGEKIT_URL_ENDPOINT &&
  !process.env.IMAGEKIT_PRIVATE_KEY.includes('YOUR_') &&
  !process.env.IMAGEKIT_PRIVATE_KEY.includes('dummy')
);

if (isImageKitConfigured) {
  try {
    imagekitClient = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  } catch (err) {
    console.warn('⚠️ StorageAdapter: ImageKit initialization warning:', err.message);
  }
}

/**
 * Storage Service Adapter
 * Seamlessly toggles between ImageKit Free Tier (20GB) and Zero-Cost Local Static File Storage
 */
class StorageService {
  /**
   * Upload file buffer to active storage provider
   */
  async uploadFile(buffer, fileName, folder = 'general', mimeType = 'image/jpeg') {
    const sanitizedFileName = `${Date.now()}_${path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    // 1. Try ImageKit if configured and not explicitly forced to local
    if (imagekitClient && process.env.STORAGE_PROVIDER !== 'local') {
      try {
        const result = await imagekitClient.upload({
          file: buffer,
          fileName: sanitizedFileName,
          folder: `/sai_logistics/${folder.replace(/^\//, '')}`,
        });
        return {
          success: true,
          provider: 'imagekit',
          url: result.url,
          fileId: result.fileId,
          name: result.name,
          thumbnailUrl: result.thumbnailUrl || result.url,
        };
      } catch (err) {
        console.warn(`⚠️ StorageAdapter: ImageKit upload failed (${err.message}). Falling back to local storage.`);
      }
    }

    // 2. High-Fidelity Local Storage Fallback (Zero-Cost / Offline)
    try {
      const targetFolder = path.join(UPLOADS_DIR, folder);
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });
      }

      const filePath = path.join(targetFolder, sanitizedFileName);
      fs.writeFileSync(filePath, buffer);

      const serverPort = process.env.PORT || 5000;
      const relativePath = `/uploads/${folder}/${sanitizedFileName}`.replace(/\/+/g, '/');
      const publicUrl = `http://localhost:${serverPort}${relativePath}`;

      return {
        success: true,
        provider: 'local_storage',
        url: publicUrl,
        fileId: `local_${folder}_${sanitizedFileName}`,
        name: sanitizedFileName,
        thumbnailUrl: publicUrl,
      };
    } catch (localErr) {
      console.error('❌ StorageAdapter: Local disk write failed:', localErr);
      throw new Error('File storage failed on both cloud and local fallback.');
    }
  }

  /**
   * Generate authentication parameters for client-side uploads
   */
  getAuthParams() {
    if (imagekitClient && isImageKitConfigured) {
      try {
        const auth = imagekitClient.getAuthenticationParameters();
        return {
          provider: 'imagekit',
          ...auth,
          publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
          urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
        };
      } catch (e) {
        console.warn('ImageKit auth param generation failed:', e.message);
      }
    }

    return {
      provider: 'local_storage',
      token: 'local_demo_token',
      expire: Math.floor(Date.now() / 1000) + 3600,
      signature: 'local_demo_signature',
      uploadEndpoint: `/api/v1/imagekit/upload`,
    };
  }

  /**
   * Delete file
   */
  async deleteFile(fileId) {
    if (fileId.startsWith('local_')) {
      // Local file removal
      const parts = fileId.replace('local_', '').split('_');
      const folder = parts[0];
      const filename = parts.slice(1).join('_');
      const filePath = path.join(UPLOADS_DIR, folder, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return { success: true, message: 'Local file deleted' };
    }

    if (imagekitClient) {
      await imagekitClient.deleteFile(fileId);
      return { success: true, message: 'Cloud file deleted from ImageKit' };
    }

    return { success: true, message: 'No-op' };
  }
}

module.exports = new StorageService();

