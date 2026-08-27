const mongoose = require('mongoose');

/**
 * PageContent — stores all editable content for a given page.
 * Each page has a JSON `sections` object structured as:
 * {
 *   hero: { title, subtitle, description, badgeText, image, imageMobile, ... },
 *   brandStory: { heading, paragraph1, paragraph2, image, ... },
 *   ...
 * }
 */
const pageContentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // home | about | services | food-shipping | branches | customs-guide
      // calculator | tracking | book-pickup | contact | portal | pay-online
    },
    sections: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    lastEditedBy: { type: String, default: 'system' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PageContent', pageContentSchema);
