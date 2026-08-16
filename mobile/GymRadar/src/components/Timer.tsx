import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS } from "@/src/config";

const Timer = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");
  const ss = now.getSeconds().toString().padStart(2, "0");
  const timeStr = `${hh}:${mm}:${ss}`;

  return (
    <View style={styles.container}>
      <Ionicons name="time-outline" size={14} color={COLORS.accent} />
      <Text style={styles.timerText}>{timeStr}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(10, 10, 15, 0.6)",
    borderRadius: RADIUS.full,
    borderColor: COLORS.accent + "40",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,

  },
  timerText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
    letterSpacing: 1,
  },
});

export default Timer;
