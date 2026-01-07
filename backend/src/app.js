import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import authRoutes from './routes/authRoutes.js';
import gymRoutes from './routes/gymRoutes. js';
import clientRoutes from './routes/clientRoutes.js';

const app = express();

const corsOptions = {
  origin:  process.env.NODE_ENV === 'production' 
    ?  [
        'https://pi-fatec-4semestre-2026.onrender.com',
        'exp://*',
        'http://localhost:8081',
      ]
    : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders:  ['Content-Type', 'Authorization'],
};

app.set('etag', false);
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({
    message: 'GymRadar API',
    status: 'running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      health: '/health',
      auth: '/auth',
      gyms: '/gyms',
      clients: '/clients'
    },
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (_req, res) => {
  res.json({ 
    ok: true, 
    status:  'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.use('/auth', authRoutes);
app.use('/gyms', gymRoutes);
app.use('/clients', clientRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req. path,
    method: req. method
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    .. .(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
});

export default app;