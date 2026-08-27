import { useState, useRef } from 'react';
import { getImageKitAuth } from '../../services/api';

const IMAGEKIT_PUBLIC_KEY = 'public_mhye3LabtJvJX/zprTucrxNhfiA=';

/**
 * Checks whether a given URL points to a video file.
 */
function isVideoUrl(url) {
  if (!url || typeof url !== 'string') return false;
  return /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(url.trim());
}

/**
 * ImageUploader / MediaUploader
 * Supports uploading photos (JPG, PNG, WebP, SVG) AND videos (MP4, WebM, MOV) to ImageKit.
 * Calls onUpload(mediaUrl, fileId, responseData).
 */
export default function ImageUploader({
  onUpload,
  folder = '/sai-couriers',
  label = 'Upload Photo',
  currentImage = null,
  allowVideo = true,
  allowVideoOnly = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState(''); // 'photo' | 'video'
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState('');
  const photoInputRef = useRef();
  const videoInputRef = useRef();

  const handleUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (type === 'photo') {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, WebP, SVG).');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError('Photo size must be under 15MB.');
        return;
      }
    } else if (type === 'video') {
      if (!file.type.startsWith('video/') && !/\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name)) {
        setError('Please select a valid video file (MP4, WebM, MOV).');
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('Video file size must be under 100MB.');
        return;
      }
    }

    setError('');
    setUploading(true);
    setUploadType(type);

    try {
      // Get auth token from backend
      const authRes = await getImageKitAuth();
      if (!authRes || !authRes.signature) {
        throw new Error('Failed to obtain ImageKit authentication parameters.');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
      formData.append('folder', folder);
      formData.append('publicKey', authRes.publicKey || IMAGEKIT_PUBLIC_KEY);
      formData.append('signature', authRes.signature);
      formData.append('expire', authRes.expire);
      formData.append('token', authRes.token);

      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await uploadRes.json();
      if (!uploadRes.ok) {
        throw new Error(data.message || 'Upload failed.');
      }

      setPreview(data.url);
      onUpload(data.url, data.fileId, data);
    } catch (err) {
      console.error('Media upload error:', err);
      setError(`Upload failed: ${err.message || 'Please check the file and try again.'}`);
    } finally {
      setUploading(false);
      setUploadType('');
    }
  };

  const isVideo = isVideoUrl(preview);

  return (
    <div className="image-uploader">
      {preview && (
        <div className="image-uploader-preview" style={{ marginBottom: '0.65rem' }}>
          {isVideo ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <video
                controls
                src={preview}
                style={{
                  maxHeight: '180px',
                  maxWidth: '320px',
                  borderRadius: '10px',
                  border: '1.5px solid #DDEFF7',
                  background: '#0F1F2C',
                  display: 'block',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  left: '6px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  pointerEvents: 'none',
                }}
              >
                <i className="fa-solid fa-video"></i> Video
              </span>
            </div>
          ) : (
            <img
              src={preview}
              alt="Preview"
              style={{
                maxHeight: '140px',
                maxWidth: '260px',
                borderRadius: '8px',
                objectFit: 'cover',
                border: '1px solid #DDEFF7',
                display: 'block',
              }}
            />
          )}

          <button
            type="button"
            className="image-uploader-remove"
            onClick={() => {
              setPreview(null);
              onUpload('', '');
              if (photoInputRef.current) photoInputRef.current.value = '';
              if (videoInputRef.current) videoInputRef.current.value = '';
            }}
            title="Remove media"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      <div className="media-uploader-row">
        {/* Upload Photo Button */}
        {!allowVideoOnly && (
          <label className={`image-uploader-btn${uploading && uploadType === 'photo' ? ' uploading' : ''}`}>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, 'photo')}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            {uploading && uploadType === 'photo' ? (
              <><i className="fa-solid fa-circle-notch fa-spin"></i> Uploading Photo…</>
            ) : (
              <><i className="fa-solid fa-cloud-arrow-up"></i> {label || 'Upload Photo'}</>
            )}
          </label>
        )}

        {/* Upload Video Button */}
        {(allowVideo || allowVideoOnly) && (
          <label className={`image-uploader-btn media-uploader-btn-video${uploading && uploadType === 'video' ? ' uploading' : ''}`}>
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/ogg,video/*"
              onChange={(e) => handleUpload(e, 'video')}
              disabled={uploading}
              style={{ display: 'none' }}
            />
            {uploading && uploadType === 'video' ? (
              <><i className="fa-solid fa-circle-notch fa-spin"></i> Uploading Video…</>
            ) : (
              <><i className="fa-solid fa-video"></i> Upload Video</>
            )}
          </label>
        )}
      </div>

      {error && (
        <p className="image-uploader-error" style={{ marginTop: '0.4rem' }}>
          <i className="fa-solid fa-circle-exclamation"></i> {error}
        </p>
      )}
    </div>
  );
}
