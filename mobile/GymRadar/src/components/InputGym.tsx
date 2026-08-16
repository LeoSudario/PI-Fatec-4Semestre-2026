import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, COLORS, SPACING, RADIUS, SHADOWS } from "@/src/config";
import { Ionicons } from "@expo/vector-icons";

type Gym = { name: string };

type Props = {
  gyms?: Gym[];
  onGymAdded?: (gym: any) => void;
  token?: string;
  apiBaseUrl?: string;
};

const InputGym: React.FC<Props> = ({ gyms = [], onGymAdded, token, apiBaseUrl }) => {
  const [form, setForm] = useState({
    address: "",
    phone: "",
    capacity: "",
    name: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const baseUrl = apiBaseUrl ?? API_URL;

  const handleSubmit = async () => {
    const name = form.name.trim();
    const capNum = Number(form.capacity);

    if (!name) {
      Alert.alert("Validation", "Name is required.");
      return;
    }
    if (!Number.isFinite(capNum) || capNum <= 0) {
      Alert.alert("Validation", "Capacity must be a positive number.");
      return;
    }
    if (gyms.find((g) => g.name.trim().toLowerCase() === name.toLowerCase())) {
      Alert.alert("Validation", "Gym with this name already exists.");
      return;
    }

    setSubmitting(true);
    const authToken = token ?? (await AsyncStorage.getItem("auth_token"));

    try {
      const res = await fetch(`${baseUrl}/gyms`, {
        method: "POST",
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        body: JSON.stringify({
          name,
          address: form.address.trim(),
          phone: form.phone.trim(),
          capacity: Math.floor(capNum),
        }),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {}

      if (!res.ok) {
        Alert.alert("Error", data?.message || `Failed (${res.status})`);
        return;
      }

      Alert.alert("Success", `"${data.name || name}" created!`);
      setForm({ address: "", phone: "", capacity: "", name: "" });
      onGymAdded?.(data);
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to create gym");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="business" size={22} color={COLORS.accent} />
        <Text style={styles.title}>Register Gym</Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gym Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. SmartFit"
          placeholderTextColor={COLORS.textMuted}
          value={form.name}
          onChangeText={handleChange("name")}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Full address"
          placeholderTextColor={COLORS.textMuted}
          value={form.address}
          onChangeText={handleChange("address")}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="(00) 00000-0000"
            placeholderTextColor={COLORS.textMuted}
            value={form.phone}
            onChangeText={handleChange("phone")}
            keyboardType="phone-pad"
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1, marginLeft: SPACING.sm }]}>
          <Text style={styles.label}>Capacity</Text>
          <TextInput
            style={styles.input}
            placeholder="200"
            placeholderTextColor={COLORS.textMuted}
            value={form.capacity}
            onChangeText={handleChange("capacity")}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          submitting && styles.buttonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <>
            <Ionicons name="add-circle" size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Create Gym</Text>
          </>
        )}
      </Pressable>
    </View>
  );
};

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
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
  },
  row: {
    flexDirection: "row",
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.sm,
    marginTop: SPACING.sm,
    ...SHADOWS.button,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
  },
});

export default InputGym;
