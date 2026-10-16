/**
 * VidyaPath - Scholarship & Government Scheme Matchmaker
 * Server entrypoint
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static assets
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'VidyaPath - Scholarship Matchmaker',
    timestamp: new Date().toISOString()
  });
});

// Single Page Application Fallback for client-side routing
app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
});

// Start server if directly executed
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🎓 VidyaPath - Scholarship Matchmaker is running!`);
    console.log(`🌐 Local Web Portal: http://localhost:${PORT}`);
    console.log(`⚙️  Admin Dashboard: http://localhost:${PORT}/admin.html`);
    console.log(`📡 Health Check:     http://localhost:${PORT}/health`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
