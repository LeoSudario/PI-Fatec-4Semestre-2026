import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import InputGym from "@/src/components/InputGym";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS, SHADOWS } from "@/src/config";

export default function AddGymScreen() {
  const [createdGym, setCreatedGym] = useState<any | null>(null);

  const handleGymAdded = async (g: any) => {
    setCreatedGym(g);
    setTimeout(() => router.replace("/"), 1200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </Pressable>
        <Ionicons name="business" size={20} color={COLORS.accent} />
        <Text style={styles.headerTitle}>Add New Gym</Text>
      </View>

      <View style={styles.content}>
        <InputGym onGymAdded={handleGymAdded} />

        {createdGym && (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={40} color={COLORS.green} />
            <Text style={styles.successTitle}>{createdGym.name}</Text>
            <Text style={styles.successSubtitle}>
              Capacity: {createdGym.capacity}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    paddingTop: 56,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.header,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.xs,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  successCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.green + "30",
    ...SHADOWS.card,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  successSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});
