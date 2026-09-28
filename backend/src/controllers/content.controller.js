const PageContent = require('../models/PageContent');

exports.getPageContent = async (req, res) => {
  try {
    const page = req.params.page.toLowerCase().trim();
    const content = await PageContent.findOne({ page }).lean();
    if (!content) return res.status(404).json({ success: false, message: `Content for page "${page}" not found.` });
    return res.json({ success: true, data: content.sections, updatedAt: content.updatedAt });
  } catch (err) {
    console.error('Content GET error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getAllPages = async (req, res) => {
  try {
    const pages = await PageContent.find({}, 'page updatedAt lastEditedBy').sort('page').lean();
    return res.json({ success: true, data: pages });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updatePageContent = async (req, res) => {
  try {
    const page = req.params.page.toLowerCase().trim();
    const { sections } = req.body;
    if (!sections || typeof sections !== 'object') return res.status(400).json({ success: false, message: 'sections object is required.' });

    const content = await PageContent.findOneAndUpdate(
      { page }, { $set: { sections, lastEditedBy: req.admin.email } }, { upsert: true, new: true, runValidators: true }
    );
    return res.json({ success: true, message: 'Page content updated.', data: content.sections });
  } catch (err) {
    console.error('Content PUT error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.patchPageContent = async (req, res) => {
  try {
    const page = req.params.page.toLowerCase().trim();
    const { section, data } = req.body;
    if (!section || !data) return res.status(400).json({ success: false, message: 'section and data are required.' });

    let contentDoc = await PageContent.findOne({ page });
    if (!contentDoc) contentDoc = new PageContent({ page, sections: {} });

    contentDoc.sections = { ...contentDoc.sections, [section]: { ...(contentDoc.sections[section] || {}), ...data } };
    contentDoc.lastEditedBy = req.admin.email;
    contentDoc.markModified('sections');
    await contentDoc.save();

    return res.json({ success: true, message: `Section "${section}" updated.`, data: contentDoc.sections[section] });
  } catch (err) {
    console.error('Content PATCH error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
