import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import healthHandler from './api/health.ts';
import groqHandler from './api/groq.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isDev = process.env.NODE_ENV !== 'production';

  // Body parsing for JSON API requests (up to 25MB for image analysis)
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API Routes
  app.all('/api/health', (req, res) => {
    return healthHandler(req, res);
  });

  app.all('/api/groq', (req, res) => {
    return groqHandler(req, res);
  });

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log(`[RoadSentry AI] Vite dev server mounted in middleware mode`);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log(`[RoadSentry AI] Serving static production build from ${distPath}`);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[RoadSentry AI] Production/Dev server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('[RoadSentry AI] Fatal server error:', err);
  process.exit(1);
});
