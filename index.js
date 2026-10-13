// Entry point for the Blog Portfolio API
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const blogRoutes = require('./routes/blogs');

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogDB';

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ status: 'Blog API is running' }));

// Routes
app.use('/api/blogs', blogRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log(`MongoDB connected: ${mongoose.connection.name}`))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
