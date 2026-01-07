import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import authRoutes from './routes/authRoutes.js';
import gymRoutes from './routes/gymRoutes.js';
import clientRoutes from './routes/clientRoutes.js';

const app = express();

app.set('etag', false);
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rota raiz - Welcome/Health check principal
app.get('/', (req, res) => {
  res.json({
    message: 'GymRadar API 🏋️',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      gyms: '/gyms',
      clients: '/clients'
    },
    timestamp: new Date().toISOString()
  });
});

// Health check específico
app.get('/health', (_req, res) => res.json({ ok: true, status: 'healthy' }));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/gyms', gymRoutes);
app.use('/clients', clientRoutes);

// Rota 404 - deve vir DEPOIS das rotas
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

export default app;