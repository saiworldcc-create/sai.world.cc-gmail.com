const express = require('express');
const router = express.Router();
const PageContent = require('../models/PageContent');
const { protect } = require('../middleware/auth');

// GET /api/v1/content/:page  — public, used by frontend to load page content
router.get('/:page', async (req, res) => {
  try {
    const page = req.params.page.toLowerCase().trim();
    const content = await PageContent.findOne({ page }).lean();

    if (!content) {
      return res.status(404).json({ success: false, message: `Content for page "${page}" not found.` });
    }

    return res.json({ success: true, data: content.sections, updatedAt: content.updatedAt });
  } catch (err) {
    console.error('Content GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// GET /api/v1/content  — admin only, list all pages
router.get('/', protect, async (req, res) => {
  try {
    const pages = await PageContent.find({}, 'page updatedAt lastEditedBy').sort('page').lean();
    return res.json({ success: true, data: pages });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/v1/content/:page  — admin only, full replace of a page's sections
router.put('/:page', protect, async (req, res) => {
  try {
    const page = req.params.page.toLowerCase().trim();
    const { sections } = req.body;

    if (!sections || typeof sections !== 'object') {
      return res.status(400).json({ success: false, message: 'sections object is required.' });
    }

    const content = await PageContent.findOneAndUpdate(
      { page },
      {
        $set: {
          sections,
          lastEditedBy: req.admin.email,
        },
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.json({ success: true, message: 'Page content updated.', data: content.sections });
  } catch (err) {
    console.error('Content PUT error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PATCH /api/v1/content/:page  — admin only, merge-update specific sections
router.patch('/:page', protect, async (req, res) => {
  try {
    const page = req.params.page.toLowerCase().trim();
    const { section, data } = req.body;

    if (!section || !data) {
      return res.status(400).json({ success: false, message: 'section and data are required.' });
    }

    // Get existing content
    let contentDoc = await PageContent.findOne({ page });
    if (!contentDoc) {
      contentDoc = new PageContent({ page, sections: {} });
    }

    // Merge the specific section
    contentDoc.sections = {
      ...contentDoc.sections,
      [section]: {
        ...(contentDoc.sections[section] || {}),
        ...data,
      },
    };
    contentDoc.lastEditedBy = req.admin.email;
    contentDoc.markModified('sections');
    await contentDoc.save();

    return res.json({ success: true, message: `Section "${section}" updated.`, data: contentDoc.sections[section] });
  } catch (err) {
    console.error('Content PATCH error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
