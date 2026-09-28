const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

exports.getAuthParams = (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return res.json({
      success: true, ...authParams,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  } catch (err) {
    console.error('ImageKit auth error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to generate upload credentials.' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file provided.' });
    const result = await imagekit.upload({ file: req.file.buffer, fileName: req.file.originalname || 'product-image', folder: '/sai-couriers/ecommerce' });
    return res.json({ success: true, data: { url: result.url, fileId: result.fileId, name: result.name, thumbnailUrl: result.thumbnailUrl } });
  } catch (err) {
    console.error('ImageKit upload error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Failed to upload image.' });
  }
};

exports.listFiles = async (req, res) => {
  try {
    const { folder = '/sai-couriers', limit = 50, skip = 0 } = req.query;
    const files = await imagekit.listFiles({ path: folder, limit: parseInt(limit), skip: parseInt(skip) });
    return res.json({ success: true, data: files });
  } catch (err) {
    console.error('ImageKit list error:', err);
    return res.status(500).json({ success: false, message: 'Failed to list files.' });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    await imagekit.deleteFile(req.params.fileId);
    return res.json({ success: true, message: 'File deleted.' });
  } catch (err) {
    console.error('ImageKit delete error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete file.' });
  }
};
