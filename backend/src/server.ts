import app from './app';
import { config } from './config/env';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`🚀 Examination Management System Backend running on port ${PORT} [${config.nodeEnv}]`);
});

// Process signal handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default server;
