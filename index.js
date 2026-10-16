/**
 * VidyaPath Application Entry Point for Render / Cloud Production
 * Starts the Express HTTP server on the configured PORT
 */
const app = require('./server');
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🎓 VidyaPath - Scholarship Matchmaker is running!`);
  console.log(`🌐 Web Portal live on port: ${PORT}`);
  console.log(`📡 Health Check: http://0.0.0.0:${PORT}/health`);
  console.log(`=======================================================`);
});
