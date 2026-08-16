import React, { useCallback, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useGym } from "../src/context/GymContext";
import OccupancyBar from "../src/components/OccupancyBar";
import { useAuth } from "../src/context/AuthContext";
import { router, type Href, useFocusEffect } from "expo-router";
import Timer from "../src/components/Timer";
import CheckInNOut from "@/src/components/CheckInNOut";
import * as GymAPI from "../src/api/gym";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS, SHADOWS } from "@/src/config";

type Gym = {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  capacity: number;
  occupancy: number;
};

export default function Home() {
  const { gym: gymState, refresh } = useGym();
  const { logout, user } = useAuth();
  const [gyms, setGyms] = useState<Gym[]>([]);

  const reloadGyms = useCallback(async () => {
    try {
      const list = await GymAPI.getGyms();
      setGyms(list);
    } catch {
      console.log("Failed to fetch gyms");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      const tick = async () => {
        try {
          const list = await GymAPI.getGyms();
          if (alive) setGyms(list);
        } catch {
          // silent
        }
      };
      tick();
      const id = setInterval(tick, 1000);
      return () => {
        alive = false;
        clearInterval(id);
      };
    }, [])
  );

  async function handleDeleteGym(id: string) {
    try {
      setGyms((prev) => prev.filter((g) => g.id !== id));
      await GymAPI.deleteGym(id);
    } catch (err: any) {
      Alert.alert("Delete failed", err?.message ?? String(err));
      reloadGyms();
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerImg}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
            }}
            style={styles.imageBackground}
            imageStyle={styles.imageStyle}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(10,10,15,0.85)", "rgba(10,10,15,0.5)", "transparent"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.hero}>
              <View style={styles.headerContainer}>
                <View>
                  <Text style={styles.greeting}>Hello,</Text>
                  <Text style={styles.header}>{user?.username ?? "Member"}</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.logOutButton,
                    pressed && { opacity: 0.8 },
                  ]}
                  onPress={() => {
                    logout();
                    router.push("/login" as Href);
                  }}
                >
                  <Ionicons name="log-out-outline" size={18} color={COLORS.white} />
                </Pressable>
              </View>
              <Timer />
              <Text style={styles.heroTitle}>
                Push Your{"\n"}
                <Text style={styles.highlight}>Limits</Text>
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.sectionHeader}>
          <Ionicons name="business" size={18} color={COLORS.accent} />
          <Text style={styles.sectionTitle}>Your Gyms</Text>
          <Text style={styles.gymCount}>{gyms.length}</Text>
        </View>

        {gyms.map((g) => (
          <View key={g.id} style={{ marginBottom: SPACING.md }}>
            <OccupancyBar gym={g} onDelete={handleDeleteGym} />
          </View>
        ))}

        {gyms.length === 0 && (
          <OccupancyBar
            gym={{
              id: "context-fallback",
              name: gymState.name ?? "Configured Gym",
              address: "",
              phone: "",
              capacity: gymState.capacity,
              occupancy: gymState.current,
            }}
          />
        )}

        <View style={{ height: SPACING.sm }} />

        <Pressable
          style={({ pressed }) => [
            styles.dashboardButton,
            pressed && styles.dashboardButtonPressed,
          ]}
          onPress={() => router.push("/dashboard" as Href)}
        >
          <LinearGradient
            colors={[COLORS.surface, COLORS.surfaceLight]}
            style={styles.dashboardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.dashBtnContent}>
              <View style={styles.dashBtnLeft}>
                <Ionicons name="stats-chart" size={20} color={COLORS.accent} />
                <Text style={styles.dashboardButtonText}>Analytics Dashboard</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </View>
          </LinearGradient>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.registerGymButton,
            pressed && styles.registerGymButtonPressed,
          ]}
          onPress={() => router.push("/addGym" as Href)}
        >
          <Ionicons name="add-circle-outline" size={20} color={COLORS.white} />
          <Text style={styles.registerGymText}>Register New Gym</Text>
        </Pressable>

        <View style={{ height: SPACING.md }} />

        <CheckInNOut
          username={user?.username ?? undefined}
          onClientAdded={() => {
            refresh();
            reloadGyms();
          }}
          onClientDeleted={() => {
            refresh();
            reloadGyms();
          }}
        />

        <View style={{ height: SPACING.lg }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingBottom: 32,
  },
  containerImg: {
    height: 280,
    width: "100%",
    overflow: "hidden",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageStyle: {},
  hero: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.sm,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.white,
  },
  logOutButton: {
    backgroundColor: COLORS.accent + "30",
    borderRadius: RADIUS.full,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accent + "40",
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
  },
  highlight: {
    color: COLORS.accent,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
  },
  gymCount: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.accent,
    backgroundColor: COLORS.accent + "15",
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  dashboardButton: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.subtle,
  },
  dashboardGradient: {
    borderRadius: RADIUS.lg,
  },
  dashboardButtonPressed: {
    opacity: 0.85,
  },
  dashBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.lg,
  },
  dashBtnLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  dashboardButtonText: {
    color: COLORS.text,
    fontWeight: "700",
    fontSize: 16,
  },
  registerGymButton: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.md,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    ...SHADOWS.button,
  },
  registerGymButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  registerGymText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },
});
