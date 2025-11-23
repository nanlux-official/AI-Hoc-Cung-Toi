const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Import routes
const aiMentorRoutes = require('../server/routes/aiMentor');
const aiReflectRoutes = require('../server/routes/aiReflect');
const challengeRoutes = require('../server/routes/challenge');
const trackerRoutes = require('../server/routes/tracker');
const videoRoutes = require('../server/routes/video');
const healthRoutes = require('../server/routes/health');

// API routes
app.use('/api/mentor', aiMentorRoutes);
app.use('/api/reflect', aiReflectRoutes);
app.use('/api/challenge', challengeRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/health', healthRoutes);

// Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'AI Hoc Cung Toi API' });
});

module.exports = app;
