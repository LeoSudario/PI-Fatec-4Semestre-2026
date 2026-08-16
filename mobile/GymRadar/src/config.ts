import Constants from "expo-constants";

const extra =
  (Constants?.manifest as any)?.extra ||
  (Constants as any)?.expoConfig?.extra ||
  {};

const BACKEND_URL: string =
  process.env.EXPO_PUBLIC_BACKEND_URL ||
  extra.backendUrl ||
  "https://pi-fatec-4semestre-2026.onrender.com";

const GYM_ID: string =
  process.env.EXPO_PUBLIC_GYM_ID ||
  extra.gymId ||
  "Academia Centro";

export const API_URL = BACKEND_URL;
export const DEFAULT_GYM_ID = GYM_ID;

export const COLORS = {
  bg: "#0A0A0F",
  surface: "#14141F",
  surfaceLight: "#1C1C2E",
  header: "#1A1A2E",
  accent: "#E63946",
  accentDark: "#B71C1C",
  accentLight: "#FF6B6B",
  blue: "#457B9D",
  blueDark: "#1D3557",
  blueLight: "#A8DADC",
  green: "#2ECC71",
  greenDark: "#27AE60",
  orange: "#F39C12",
  orangeDark: "#E67E22",
  text: "#F1FAEE",
  textSecondary: "#A8DADC",
  textMuted: "#6B7280",
  border: "#2A2A3E",
  borderLight: "#3A3A4E",
  card: "#14141F",
  input: "#1C1C2E",
  white: "#FFFFFF",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const SHADOWS = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  button: {
    shadowColor: "#E63946",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  subtle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
};
