import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";
import { LineChart, BarChart } from "react-native-chart-kit";
import * as GymAPI from "../src/api/gym";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, RADIUS, SHADOWS } from "@/src/config";

const screenWidth = Dimensions.get("window").width;

export default function DashboardScreen() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gyms, setGyms] = useState<any[]>([]);
  const [selectedGym, setSelectedGym] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        const list = await GymAPI.getGyms();
        setGyms(list);
      } catch (e) {
        console.error("Failed to fetch gyms", e);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res: any = await GymAPI.getDashboardAnalytics(selectedGym);
        setData(res?.data ? res.data : res);
      } catch (e) {
        console.error("Dashboard analytics error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedGym]);

  const lineChartData = useMemo(() => {
    const targetData = data?.data || data;
    if (!targetData?.evolucao_hora || targetData.evolucao_hora.length === 0)
      return null;

    const grouped: any = {};
    targetData.evolucao_hora.forEach((item: any) => {
      if (!grouped[item.hora]) grouped[item.hora] = 0;
      grouped[item.hora] += item.checkins;
    });

    const sortedHours = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);
    const labels = sortedHours.map((h) => `${h}h`);
    const dataset = sortedHours.map((h) => grouped[h]);

    return {
      labels: labels.length > 0 ? labels : ["0h"],
      datasets: [
        {
          data: dataset.length > 0 ? dataset : [0],
          color: (opacity = 1) => `rgba(238, 50, 53, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  }, [data]);

  const barChartData = useMemo(() => {
    const targetData = data?.data || data;
    if (!targetData?.volume_dia || targetData.volume_dia.length === 0) return null;

    const grouped: any = {};
    targetData.volume_dia.forEach((item: any) => {
      if (!grouped[item.dia_semana]) grouped[item.dia_semana] = 0;
      grouped[item.dia_semana] += item.checkins;
    });

    const order = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ];
    const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const labels = [];
    const dataset = [];
    for (let i = 0; i < order.length; i++) {
      if (grouped[order[i]] !== undefined) {
        labels.push(shortDays[i]);
        dataset.push(grouped[order[i]]);
      }
    }
    if (labels.length === 0) return null;

    return {
      labels,
      datasets: [{ data: dataset }],
    };
  }, [data]);

  const predictions = useMemo(() => {
    const targetData = data?.data || data;
    if (!targetData?.evolucao_hora || targetData.evolucao_hora.length === 0)
      return { empty: null, packed: null };

    const grouped: { [key: number]: number } = {};
    targetData.evolucao_hora.forEach((item: any) => {
      const h = Number(item.hora);
      if (!grouped[h]) grouped[h] = 0;
      grouped[h] += item.checkins;
    });

    const hours = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);
    if (hours.length === 0) return { empty: null, packed: null };

    const values = hours.map((h) => grouped[h]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stddev = Math.sqrt(variance);
    const sortedValues = [...values].sort((a, b) => a - b);
    const q1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
    const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)];

    const emptyThreshold = Math.max(q1, mean - stddev * 0.5);
    const packedThreshold = Math.min(q3, mean + stddev * 0.5);

    const emptyHours = hours.filter((h) => grouped[h] <= emptyThreshold);
    const packedHours = hours.filter((h) => grouped[h] >= packedThreshold);

    const formatBlocks = (hrList: number[]) => {
      if (!hrList || hrList.length === 0) return "N/A";
      const blocks: { start: number; end: number }[] = [];
      let currentBlock = { start: hrList[0], end: hrList[0] };
      for (let i = 1; i < hrList.length; i++) {
        if (hrList[i] === currentBlock.end + 1) {
          currentBlock.end = hrList[i];
        } else {
          blocks.push(currentBlock);
          currentBlock = { start: hrList[i], end: hrList[i] };
        }
      }
      blocks.push(currentBlock);
      return blocks.map((b) => `${b.start}:00 - ${b.end + 1}:00`).join("  |  ");
    };

    return {
      empty: formatBlocks(emptyHours),
      packed: formatBlocks(packedHours),
    };
  }, [data]);

  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    color: (opacity = 1) => `rgba(241, 250, 238, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: COLORS.accent,
    },
    decimalPlaces: 0,
  };

  const targetData = data?.data || data || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </Pressable>
        <Ionicons name="stats-chart" size={20} color={COLORS.accent} />
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <View style={styles.pillContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillScroll}
        >
          <Pressable
            style={[styles.pill, selectedGym === "" && styles.pillActive]}
            onPress={() => setSelectedGym("")}
          >
            <Text style={[styles.pillText, selectedGym === "" && styles.pillTextActive]}>
              All Gyms
            </Text>
          </Pressable>
          {gyms.map((g) => (
            <Pressable
              key={g.id || g._id}
              style={[styles.pill, selectedGym === g.name && styles.pillActive]}
              onPress={() => setSelectedGym(g.name)}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedGym === g.name && styles.pillTextActive,
                ]}
              >
                {g.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 60 }} />
        ) : !data ? (
          <View style={styles.emptyState}>
            <Ionicons name="analytics-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No data available</Text>
          </View>
        ) : (
          <>
            <View style={styles.kpiGrid}>
              <View style={styles.kpiCard}>
                <View style={[styles.kpiAccent, { backgroundColor: COLORS.accent }]} />
                <Text style={styles.kpiLabel}>Total Check-ins</Text>
                <Text style={styles.kpiValue}>{targetData.total_checkins || 0}</Text>
              </View>
              <View style={styles.kpiCard}>
                <View style={[styles.kpiAccent, { backgroundColor: COLORS.blue }]} />
                <Text style={styles.kpiLabel}>Avg / Hour</Text>
                <Text style={styles.kpiValue}>
                  {Number(targetData.media_hora || 0).toFixed(1)}
                </Text>
              </View>
              <View style={styles.kpiCard}>
                <View style={[styles.kpiAccent, { backgroundColor: COLORS.green }]} />
                <Text style={styles.kpiLabel}>Median / Hour</Text>
                <Text style={styles.kpiValue}>
                  {Number(targetData.mediana_hora || 0).toFixed(1)}
                </Text>
              </View>
              <View style={styles.kpiCard}>
                <View style={[styles.kpiAccent, { backgroundColor: COLORS.orange }]} />
                <Text style={styles.kpiLabel}>Peak Time %</Text>
                <Text style={styles.kpiValue}>
                  {Number(targetData.pct_pico || 0).toFixed(1)}%
                </Text>
              </View>
            </View>

            <View style={styles.predictionContainer}>
              <View style={styles.predHeader}>
                <Ionicons name="trending-down" size={18} color={COLORS.green} />
                <Text style={styles.predictionTitle}>
                  Best hours for {selectedGym || "all gyms"}
                </Text>
              </View>
              <Text style={styles.predictionText}>
                {predictions?.empty || "No data available"}
              </Text>

              <View style={styles.predDivider} />

              <View style={styles.predHeader}>
                <Ionicons name="trending-up" size={18} color={COLORS.orange} />
                <Text style={[styles.predictionTitle, { color: COLORS.orange }]}>
                  Busiest hours for {selectedGym || "all gyms"}
                </Text>
              </View>
              <Text style={styles.predictionText}>
                {predictions?.packed || "No data available"}
              </Text>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Hourly Check-ins</Text>
              {lineChartData ? (
                <LineChart
                  data={lineChartData}
                  width={screenWidth - 64}
                  height={200}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chartStyle}
                />
              ) : (
                <Text style={styles.noData}>No hourly data available.</Text>
              )}
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Daily Volume</Text>
              {barChartData ? (
                <BarChart
                  data={barChartData}
                  width={screenWidth - 64}
                  height={200}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  style={styles.chartStyle}
                  showBarTops={false}
                  showValuesOnTopOfBars={true}
                  withInnerLines={false}
                />
              ) : (
                <Text style={styles.noData}>No daily data available.</Text>
              )}
            </View>
          </>
        )}
      </ScrollView>
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
    paddingTop: 56,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.header,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.sm,
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },
  pillContainer: {
    backgroundColor: COLORS.header,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pillScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillActive: {
    backgroundColor: COLORS.accent + "20",
    borderColor: COLORS.accent,
  },
  pillText: {
    color: COLORS.textMuted,
    fontWeight: "600",
    fontSize: 13,
  },
  pillTextActive: {
    color: COLORS.accent,
    fontWeight: "700",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
    gap: SPACING.lg,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  kpiCard: {
    width: "48%",
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    ...SHADOWS.subtle,
  },
  kpiAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 4,
    height: "100%",
    borderTopLeftRadius: RADIUS.lg,
    borderBottomLeftRadius: RADIUS.lg,
  },
  kpiLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontWeight: "600",
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  kpiValue: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  chartTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: SPACING.md,
  },
  chartStyle: {
    marginVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginLeft: -SPACING.md,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    gap: SPACING.md,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 16,
    fontWeight: "500",
  },
  noData: {
    color: COLORS.textMuted,
    textAlign: "center",
    padding: SPACING.xl,
    fontStyle: "italic",
  },
  predictionContainer: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  predHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  predictionTitle: {
    color: COLORS.green,
    fontSize: 15,
    fontWeight: "700",
  },
  predictionText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 22,
  },
  predDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
});
