import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGym } from "@/src/context/GymContext";
import { API_URL, COLORS, SPACING, RADIUS, SHADOWS } from "@/src/config";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onClientAdded?: () => void;
  onClientDeleted?: () => void;
  username?: string;
  apiBaseUrl?: string;
};

export default function CheckInNOut({
  onClientAdded,
  onClientDeleted,
  username,
  apiBaseUrl,
}: Props) {
  const [gymName, setGymName] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { refresh } = useGym();
  const baseUrl = apiBaseUrl ?? API_URL;

  const handleCheckIn = async () => {
    setMessage("");
    setSuccess(false);
    const payloadGymName = (gymName || "").trim();
    if (!payloadGymName) {
      setMessage("Gym name is required.");
      return;
    }
    setSubmitting(true);
    const authToken = await AsyncStorage.getItem("auth_token");
    try {
      const res = await fetch(`${baseUrl}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify({ gymName: payloadGymName }),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {}
      if (!res.ok) {
        setMessage(data?.message || `Check-in failed (${res.status}).`);
        return;
      }
      setMessage("Checked in successfully!");
      setSuccess(true);
      await refresh();
      onClientAdded?.();
    } catch (err: any) {
      setMessage("Check-in failed: " + (err?.message || "error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    setMessage("");
    setSuccess(false);
    const payloadGymName = (gymName || "").trim();
    if (!payloadGymName) {
      setMessage("Gym name is required.");
      return;
    }
    setSubmitting(true);
    const authToken = await AsyncStorage.getItem("auth_token");
    try {
      const res = await fetch(`${baseUrl}/clients/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify({ gymName: payloadGymName }),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {}
      if (!res.ok) {
        setMessage(data?.message || `Check-out failed (${res.status}).`);
        return;
      }
      setMessage("Checked out successfully!");
      setSuccess(true);
      await refresh();
      onClientDeleted?.();
    } catch (err: any) {
      setMessage("Check-out failed: " + (err?.message || "error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="finger-print" size={22} color={COLORS.blue} />
        <Text style={styles.title}>Check-In / Check-Out</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter gym name..."
        placeholderTextColor={COLORS.textMuted}
        value={gymName}
        onChangeText={setGymName}
      />

      <View style={styles.buttonsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.checkInBtn,
            pressed && styles.btnPressed,
            submitting && styles.btnDisabled,
          ]}
          onPress={handleCheckIn}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <>
              <Ionicons name="log-in" size={18} color={COLORS.white} />
              <Text style={styles.btnText}>Check In</Text>
            </>
          )}
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.checkOutBtn,
            pressed && styles.btnPressed,
            submitting && styles.btnDisabled,
          ]}
          onPress={handleCheckOut}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <>
              <Ionicons name="log-out" size={18} color={COLORS.white} />
              <Text style={styles.btnText}>Check Out</Text>
            </>
          )}
        </Pressable>
      </View>

      {!!message && (
        <View
          style={[
            styles.messageBox,
            { borderColor: success ? COLORS.green : COLORS.accent },
          ]}
        >
          <Ionicons
            name={success ? "checkmark-circle" : "alert-circle"}
            size={16}
            color={success ? COLORS.green : COLORS.accent}
          />
          <Text
            style={[
              styles.message,
              { color: success ? COLORS.green : COLORS.accentLight },
            ]}
          >
            {message}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.input,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    textAlign: "center",
    fontWeight: "600",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  checkInBtn: {
    flex: 1,
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...SHADOWS.subtle,
  },
  checkOutBtn: {
    flex: 1,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    ...SHADOWS.subtle,
  },
  btnText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  btnDisabled: {
    opacity: 0.5,
  },
  messageBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
  },
  message: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
});
