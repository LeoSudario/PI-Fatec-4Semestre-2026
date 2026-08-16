import { ExpoConfig } from "expo/config";
const config: ExpoConfig = {
  name: "GymRadar",
  slug: "gymradar",
  scheme: "gymradar",
  version: "1.0.0",
  orientation: "portrait",
  platforms: ["ios", "android", "web"],
  extra: {
    backendUrl:
      process.env.EXPO_PUBLIC_BACKEND_URL ||
      "https://pi-fatec-4semestre-2026.onrender.com",
    gymId: process.env.EXPO_PUBLIC_GYM_ID || "Academia Centro",
  },
};
export default config;
