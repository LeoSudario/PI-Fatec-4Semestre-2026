import { DEFAULT_GYM_ID } from "../config";
import apiClient from "./client";

export type Gym = {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  capacity: number;
  occupancy: number;
};

export async function getGyms(): Promise<Gym[]> {
  const gyms = await apiClient.get<Gym[]>(`/gyms?ts=${Date.now()}`);
  return gyms;
}

export async function getOccupancy(): Promise<{
  current: number;
  capacity: number;
  name: string;
}> {
  const gyms = await getGyms();
  const target = DEFAULT_GYM_ID.trim().toLowerCase();
  const gym = gyms.find((g) => g.name.trim().toLowerCase() === target);
  const current = typeof gym?.occupancy === "number" ? gym!.occupancy : 0;
  const capacity =
    typeof gym?.capacity === "number" && gym!.capacity > 0 ? gym!.capacity : 50;
  return { current, capacity, name: gym?.name ?? DEFAULT_GYM_ID };
}

export async function addClient(
  name: string,
  email: string,
  phone: string
) {
  const body = { name, gymName: DEFAULT_GYM_ID, email, phone };
  await apiClient.post("/clients", body);
}

export async function checkoutClient(name: string) {
  const body = { name, gymName: DEFAULT_GYM_ID };
  await apiClient.post("/clients/checkout", body);
}

export async function deleteGym(id: string) {
  await apiClient.delete(`/gyms/${id}`);
}

export async function getDashboardAnalytics(gymName?: string) {
  const url = gymName
    ? `/gyms/dashboard/analytics?gymName=${encodeURIComponent(gymName)}`
    : `/gyms/dashboard/analytics`;
  const res = await apiClient.get(url);
  return res;
}
