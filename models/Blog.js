const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    newTitle: { type: String, required: true, trim: true },
    newContent: { type: String, required: true },
    date: { type: String },
    likes: { type: Number, default: 0 },
    author: { type: String, default: '' },
    authorId: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
