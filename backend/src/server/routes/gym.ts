import express from 'express';
import { getOccupancy, checkIn, checkOut, sendTelemetry } from '../controllers/gymController.js';

const router = express.Router();

router.get('/gym/:gymName/occupancy', getOccupancy);
router.post('/gym/:gymName/checkin', checkIn);
router.post('/gym/:gymName/checkout', checkOut);
router.post('/gym/:gymName/telemetry', sendTelemetry);

export default router;