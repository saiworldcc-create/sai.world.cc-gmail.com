const express = require('express');
const router = express.Router();
const ImageKit = require('imagekit');
const { protect } = require('../middleware/auth');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// GET /api/v1/imagekit/auth — generates auth params for client-side upload
// Protected — only admin can upload
router.get('/auth', protect, (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return res.json({
      success: true,
      ...authParams,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  } catch (err) {
    console.error('ImageKit auth error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to generate upload credentials.' });
  }
});

// GET /api/v1/imagekit/files — list images in ImageKit
router.get('/files', protect, async (req, res) => {
  try {
    const { folder = '/sai-couriers', limit = 50, skip = 0 } = req.query;
    const files = await imagekit.listFiles({ path: folder, limit: parseInt(limit), skip: parseInt(skip) });
    return res.json({ success: true, data: files });
  } catch (err) {
    console.error('ImageKit list error:', err);
    return res.status(500).json({ success: false, message: 'Failed to list files.' });
  }
});

// DELETE /api/v1/imagekit/files/:fileId — delete an image from ImageKit
router.delete('/files/:fileId', protect, async (req, res) => {
  try {
    await imagekit.deleteFile(req.params.fileId);
    return res.json({ success: true, message: 'File deleted.' });
  } catch (err) {
    console.error('ImageKit delete error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete file.' });
  }
});

module.exports = router;
