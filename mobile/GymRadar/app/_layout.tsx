import React, { useEffect } from "react";
import { Slot, useRouter, usePathname, useRootNavigationState } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { GymProvider } from "../src/context/GymContext";
import { COLORS } from "../src/config";

function Gate() {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const navState = useRootNavigationState();

  useEffect(() => {
    if (!navState?.key || loading) return;
    const publicRoutes = new Set(["/login", "/signup"]);
    const isPublic = publicRoutes.has(pathname);
    if (!isAuthenticated && !isPublic) {
      router.replace("/login");
    } else if (isAuthenticated && isPublic) {
      router.replace("/");
    }
  }, [isAuthenticated, loading, pathname, router, navState?.key]);

  if (loading || !navState?.key) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingDot} />
        <View style={[styles.loadingDot, styles.loadingDotMiddle]} />
        <View style={styles.loadingDot} />
      </View>
    );
  }

  return <Slot />;
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <GymProvider>
          <Gate />
        </GymProvider>
      </AuthProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    flexDirection: "row",
    gap: 8,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent + "60",
  },
  loadingDotMiddle: {
    backgroundColor: COLORS.accent,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
