import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Occupancy snapshot
export const getOccupancy = async (req, res) => {
  const { gymName } = req.params;
  const gym = await prisma.gym.findFirst({ where: { name: gymName } });
  if (!gym) return res.status(404).json({ message: 'Gym not found' });
  return res.json({ current: gym.occupancy ?? 0, capacity: gym.capacity ?? 50 });
};

// Check-in (no client record required)
export const checkIn = async (req, res) => {
  const { gymName } = req.params;
  const gym = await prisma.gym.findFirst({ where: { name: gymName } });
  if (!gym) return res.status(404).json({ message: 'Gym not found' });

  const updated = await prisma.gym.update({
    where: { id: gym.id },
    data: { occupancy: (gym.occupancy ?? 0) + 1 },
  });

  return res.status(200).json({ current: updated.occupancy, capacity: updated.capacity });
};

// Check-out (floor at 0)
export const checkOut = async (req, res) => {
  const { gymName } = req.params;
  const gym = await prisma.gym.findFirst({ where: { name: gymName } });
  if (!gym) return res.status(404).json({ message: 'Gym not found' });

  const updated = await prisma.gym.update({
    where: { id: gym.id },
    data: { occupancy: Math.max(0, (gym.occupancy ?? 0) - 1) },
  });

  return res.status(200).json({ current: updated.occupancy, capacity: updated.capacity });
};

// Temperature telemetry (optional)
export const sendTelemetry = async (req, res) => {
  const { gymName } = req.params;
  const { temperature, at } = req.body || {};
  // You can persist telemetry in a table or just log:
  console.log('[telemetry]', { gymName, temperature, at: at || new Date().toISOString() });
  return res.status(200).json({ ok: true });
};