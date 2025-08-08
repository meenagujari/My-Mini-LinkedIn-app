import { spawn } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';
import express, { Application, Request, Response } from 'express';
import fetch from 'node-fetch';

console.log('🚀 Starting development servers...');

// Start backend server
const backendProcess = spawn('npm', ['run', 'dev'], {
  cwd: 'backend',
  stdio: 'pipe',
  env: { ...process.env, PORT: '3001' }
});

// Start frontend server
const frontendProcess = spawn('npm', ['run', 'dev'], {
  cwd: 'frontend',
  stdio: 'pipe',
  env: { ...process.env, PORT: '3000' }
});

// Forward outputs
backendProcess.stdout.on('data', (data) => {
  console.log(`[Backend] ${data.toString()}`);
});

backendProcess.stderr.on('data', (data) => {
  console.error(`[Backend] ${data.toString()}`);
});

frontendProcess.stdout.on('data', (data) => {
  console.log(`[Frontend] ${data.toString()}`);
});

frontendProcess.stderr.on('data', (data) => {
  console.error(`[Frontend] ${data.toString()}`);
});

// Create proxy server after delay
setTimeout(() => {
  const app: Application = express();
  
  // Add body parsing middleware for the proxy
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Handle API routes - manually forward to preserve /api path
  app.all('/api/*', async (req, res) => {
    const url = `http://localhost:3001${req.originalUrl}`;
    
    
    try {
      const headers: Record<string, string> = {
        'content-type': req.headers['content-type'] || 'application/json',
        'host': 'localhost:3001'
      };
      
      // Only copy specific headers to avoid type issues
      const headersToForward = ['authorization', 'user-agent', 'accept'];
      headersToForward.forEach(headerName => {
        const headerValue = req.headers[headerName];
        if (headerValue && typeof headerValue === 'string') {
          headers[headerName] = headerValue;
        }
      });

      const options: RequestInit = {
        method: req.method,
        headers
      };
      
      if (req.body && Object.keys(req.body).length > 0) {
        options.body = JSON.stringify(req.body);
        headers['content-type'] = 'application/json';
      }
      
      const response = await fetch(url, options as any);
      
      res.status(response.status);
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      const body = await response.text();
      res.send(body);
    } catch (err) {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy failed' });
    }
  });

  // Proxy everything else to frontend
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    ws: true,
  }));

  const PORT = 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎯 Proxy server running on port ${PORT}`);
    console.log(`🔗 Backend: http://localhost:3001`);
    console.log(`🎨 Frontend: http://localhost:3000`);
    console.log(`🌐 Full app: http://localhost:${PORT}`);
  });
}, 8000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down...');
  backendProcess.kill('SIGINT');
  frontendProcess.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down...');
  backendProcess.kill('SIGTERM');
  frontendProcess.kill('SIGTERM');
  process.exit();
});