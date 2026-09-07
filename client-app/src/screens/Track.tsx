import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, RefreshControl, Alert, Animated, Easing } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Card, BackHeader, Reveal, Screen, TabBar, PressableScale, EmptyState, Pill } from "../components/UI";
import { theme, shadow } from "../theme";
import { loadRequests } from "../storage/demoStore";

const STAGES = ["APPLIED", "CONNECTED", "IN_PROCESSING", "COMPLETED"];
const LABELS: Record<string, string> = {
  APPLIED: "Applied",
  CONNECTED: "Connected with Customer Care",
  IN_PROCESSING: "In Processing",
  COMPLETED: "Completed",
};
const SUBS: Record<string, string> = {
  APPLIED: "Request received · PT reference issued",
  CONNECTED: "Expert verified scope & documents",
  IN_PROCESSING: "Survey / filing / dispatch underway",
  COMPLETED: "Documents handed over · invoiced",
};

export default function Track({ route, navigation }: any) {
  const initialRef = route?.params?.reference || "PT24153";
  const [reqs, setReqs] = useState<any[]>([]);
  const [ref, setRef] = useState(initialRef);
  const [refreshing, setRefreshing] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;

  const reload = useCallback(async () => {
    const all = await loadRequests();
    setReqs(all);
    if (!all.find(r => r.reference === ref) && all[0]) setRef(all[0].reference);
  }, [ref]);

  useEffect(() => { reload(); }, []);
  useEffect(() => { if (route?.params?.reference) setRef(route.params.reference); }, [route?.params?.reference]);

  const current = reqs.find(r => r.reference === ref) || reqs[0];
  const currentIdx = STAGES.indexOf(current?.stage || "APPLIED");

  useEffect(() => {
    Animated.timing(progress, {
      toValue: currentIdx / (STAGES.length - 1),
      duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false,
    }).start();
  }, [currentIdx, ref]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  const onRefresh = async () => { setRefreshing(true); await reload(); setRefreshing(false); };
  const copyRef = async () => {
    await Clipboard.setStringAsync(ref);
    Alert.alert("Copied", `Reference ${ref} copied to clipboard.`);
  };

  const doneMap: Record<string, string> = {};
  (current?.stageHistory || []).forEach((h: any) => { doneMap[h.stage] = h.at; });

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="Track Request" sub={ref ? `#${ref}` : "Live status"} onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home"))}
        right={
          <PressableScale onPress={copyRef}>
            <View style={{ borderRadius: 12, paddingHorizontal: 13, paddingVertical: 9, backgroundColor: theme.navyDeep }}>
              <Text style={{ fontWeight: "800", color: theme.gold, fontSize: 12 }}>📋 Copy</Text>
            </View>
          </PressableScale>
        } />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.navy} />}>
        {reqs.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
            {reqs.map(r => {
              const on = r.reference === ref;
              return (
                <PressableScale key={r.id} onPress={() => setRef(r.reference)}>
                  <View style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999, backgroundColor: on ? theme.navyDeep : "#fff", marginRight: 8, borderWidth: 1, borderColor: on ? theme.navyDeep : theme.line }}>
                    <Text style={{ color: on ? theme.gold : theme.navy, fontWeight: "800", fontSize: 12 }}>{r.reference}</Text>
                  </View>
                </PressableScale>
              );
            })}
          </ScrollView>
        )}

        {!current ? (
          <EmptyState icon="📭" title="No requests yet" sub="Raise your first quote from Home — it takes a minute." />
        ) : (
          <>
            <Reveal>
              <View style={{ backgroundColor: theme.navyDeep, borderRadius: 22, padding: 18, ...shadow.pop }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "800", fontSize: 17, color: "#fff" }} numberOfLines={1}>{current.serviceType}</Text>
                    <Text style={{ color: "#8EA0BF", fontSize: 12, marginTop: 2 }} numberOfLines={2}>{current.description}</Text>
                  </View>
                  <View style={{ backgroundColor: theme.gold, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, marginLeft: 10 }}>
                    <Text style={{ color: theme.navyDeep, fontWeight: "800", fontSize: 10 }}>{current.stage.replace("_", " ")}</Text>
                  </View>
                </View>
                {/* Animated overall progress */}
                <View style={{ height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.15)", marginTop: 14, overflow: "hidden" }}>
                  <Animated.View style={{ height: 8, width, backgroundColor: theme.gold, borderRadius: 4 }} />
                </View>
                <Text style={{ color: "#8EA0BF", fontSize: 11, marginTop: 6 }}>Step {currentIdx + 1} of 4 · {Math.round((currentIdx / 3) * 100)}% complete</Text>
              </View>
            </Reveal>

            <Reveal delay={120}>
              <Card style={{ marginTop: 14 }}>
                {STAGES.map((st, i) => {
                  const done = i <= currentIdx;
                  const active = i === currentIdx;
                  const at = doneMap[st] || (done ? current?.updatedAt : null);
                  return (
                    <View key={st} style={{ flexDirection: "row" }}>
                      <View style={{ alignItems: "center", width: 30 }}>
                        <View style={{
                          width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center",
                          backgroundColor: done ? (st === "COMPLETED" && active ? theme.success : active ? theme.gold : theme.success) : "#EDF1F6",
                          borderWidth: active ? 2 : 0, borderColor: theme.navyDeep,
                        }}>
                          <Text style={{ color: done ? "#fff" : theme.faint, fontSize: 13, fontWeight: "800" }}>{done ? "✓" : "•"}</Text>
                        </View>
                        {i < STAGES.length - 1 && (
                          <View style={{ width: 3, flex: 1, minHeight: 26, marginVertical: 3, borderRadius: 2, backgroundColor: i < currentIdx ? theme.success : "#EDF1F6" }} />
                        )}
                      </View>
                      <View style={{ marginLeft: 12, flex: 1, paddingBottom: 18 }}>
                        <Text style={{ fontWeight: active ? "800" : "700", fontSize: 14, color: active ? theme.navyDeep : theme.navy }}>{LABELS[st]}</Text>
                        <Text style={{ color: theme.muted, fontSize: 11, marginTop: 1 }}>{SUBS[st]}</Text>
                        <Text style={{ color: active ? theme.goldDark : theme.faint, fontSize: 11, marginTop: 2, fontWeight: active ? "700" : "400" }}>
                          {at ? new Date(at).toLocaleString() : "Pending"}
                        </Text>
                      </View>
                    </View>
                  );
                })}

                {current?.attachments?.length > 0 && (
                  <View style={{ marginTop: 4, paddingTop: 12, borderTopWidth: 1, borderColor: theme.line }}>
                    <Text style={{ fontWeight: "800", fontSize: 12, color: theme.navy, marginBottom: 6 }}>Attachments ({current.attachments.length})</Text>
                    {current.attachments.map((a: any, i: number) => (
                      <Text key={i} style={{ color: theme.muted, fontSize: 12, marginBottom: 2 }}>📎 {a.name}</Text>
                    ))}
                  </View>
                )}

                <View style={{ backgroundColor: "#F0FDF6", borderRadius: 14, padding: 13, marginTop: 12, flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 22 }}>🔔</Text>
                  <View style={{ marginLeft: 10, flex: 1 }}>
                    <Text style={{ fontWeight: "800", color: theme.navy, fontSize: 13 }}>Live updates on</Text>
                    <Text style={{ color: theme.muted, fontSize: 12 }}>Pull down to refresh · SMS + email on every stage change.</Text>
                  </View>
                </View>
              </Card>
            </Reveal>
          </>
        )}
      </ScrollView>

      <TabBar active="Track" navigation={navigation} onSupport={() => navigation.navigate("Home")} />
    </Screen>
  );
}
