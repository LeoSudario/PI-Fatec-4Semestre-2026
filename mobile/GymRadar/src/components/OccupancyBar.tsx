import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS, SHADOWS } from "@/src/config";

export type Gym = {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  capacity: number;
  occupancy: number;
};

type Props = {
  gym: Gym;
  children?: React.ReactNode;
  onDelete?: (id: string) => void | Promise<void>;
};

export default function OccupancyBar({ gym, children, onDelete }: Props) {
  const safeCapacity =
    typeof gym.capacity === "number" && gym.capacity > 0 ? gym.capacity : 50;
  const safeCurrent = Math.max(
    0,
    typeof gym.occupancy === "number" ? gym.occupancy : 0
  );
  const progress = Math.max(0, Math.min(1, safeCurrent / safeCapacity));
  const percentage = progress * 100;

  const barColor =
    percentage < 50 ? COLORS.green : percentage < 90 ? COLORS.orange : COLORS.accent;
  const statusLabel =
    percentage < 50 ? "Low" : percentage < 90 ? "Moderate" : "High";
  const statusColor =
    percentage < 50 ? COLORS.green : percentage < 90 ? COLORS.orange : COLORS.accent;

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: progress,
      useNativeDriver: false,
      tension: 70,
      friction: 12,
    }).start();
  }, [progress, anim]);

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  function confirmDelete() {
    if (!onDelete) return;
    Alert.alert(
      "Delete Gym",
      `Are you sure you want to delete "${gym.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete(gym.id) },
      ],
      { cancelable: true }
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View style={styles.nameRow}>
          <Ionicons name="business" size={18} color={COLORS.accent} />
          <Text style={styles.title} numberOfLines={1}>
            {gym.name}
          </Text>
        </View>
        {onDelete && (
          <TouchableOpacity
            onPress={confirmDelete}
            hitSlop={{ top: 8, left: 8, right: 8, bottom: 8 }}
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.accent} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.countText}>
          {safeCurrent}
          <Text style={styles.countSeparator}> / </Text>
          {safeCapacity}
        </Text>
        <View style={[styles.badge, { backgroundColor: statusColor + "20", borderColor: statusColor + "40" }]}>
          <View style={[styles.badgeDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.badgeText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.barBg}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width,
              backgroundColor: barColor,
            },
          ]}
        />
      </View>

      <Text style={styles.percentage}>{percentage.toFixed(1)}% capacity</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    flex: 1,
  },
  deleteBtn: {
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.accent + "10",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
  },
  countText: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },
  countSeparator: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.textMuted,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  barBg: {
    width: "100%",
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: RADIUS.full,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: RADIUS.full,
  },
  percentage: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: "600",
    marginTop: SPACING.sm,
  },
});
