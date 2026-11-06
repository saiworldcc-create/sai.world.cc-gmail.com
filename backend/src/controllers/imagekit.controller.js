const storageService = require('../services/storageService');

exports.getAuthParams = (req, res) => {
  try {
    const params = storageService.getAuthParams();
    return res.json({
      success: true,
      ...params,
    });
  } catch (err) {
    console.error('Storage auth error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to generate upload credentials.' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided.' });
    const result = await storageService.uploadFile(
      req.file.buffer,
      req.file.originalname || 'product-image',
      'ecommerce',
      req.file.mimetype
    );
    return res.json({
      success: true,
      data: {
        url: result.url,
        fileId: result.fileId,
        name: result.name,
        thumbnailUrl: result.thumbnailUrl,
        provider: result.provider
      }
    });
  } catch (err) {
    console.error('Storage upload error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to upload image.' });
  }
};

exports.listFiles = async (req, res) => {
  try {
    return res.json({ success: true, data: [] });
  } catch (err) {
    console.error('Storage list error:', err);
    return res.status(500).json({ success: false, message: 'Failed to list files.' });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const result = await storageService.deleteFile(req.params.fileId);
    return res.json({ success: true, ...result });
  } catch (err) {
    console.error('Storage delete error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete file.' });
  }
};
