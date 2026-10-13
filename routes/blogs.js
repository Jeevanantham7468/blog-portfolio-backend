const express = require('express');
const Blog = require('../models/Blog');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Public: list all blogs, newest first
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: read a single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: 'Invalid blog id' });
  }
});

// Public: like a blog
router.patch('/like/:id', async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Blog not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Invalid blog id' });
  }
});

// Admin: create a blog (any authenticated user)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { newTitle, newContent, date, likes } = req.body;

    if (!newTitle || !newContent) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    const blog = await Blog.create({
      newTitle,
      newContent,
      date:
        date ||
        new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      likes: Number(likes) || 0,
      author: req.user.email,
      authorId: req.user.id,
    });

    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: update a blog (any authenticated user)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { newTitle, newContent, date, likes } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { newTitle, newContent, date, likes },
      { new: true, runValidators: true }
    );

    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: delete a blog (any authenticated user)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted', id: req.params.id });
  } catch (err) {
    res.status(400).json({ message: 'Invalid blog id' });
  }
});

module.exports = router;
