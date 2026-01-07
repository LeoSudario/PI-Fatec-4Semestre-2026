import express from 'express';
import gymRoutes from './routes/gym.js';

const app = express();
app.use(express.json());
app.use(gymRoutes);

export default app;