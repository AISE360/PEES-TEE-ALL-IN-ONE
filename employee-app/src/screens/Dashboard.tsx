import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, Alert, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, Reveal, Skeleton, DutyBadge, PressableScale } from "../components/UI";
import { theme, shadow } from "../theme";
import { getActiveShift, clockOut } from "../storage/demoStore";
import { getCurrentUser } from "../storage/auth";

const tiles = [
  { label: "Clock In", sub: "Geofence + selfie", icon: "⏱️", to: "ClockIn", tint: "#E1EFFE" },
  { label: "KYC Enrolment", sub: "New application", icon: "📝", to: "KYC", tint: "#FEF3C7" },
  { label: "My Clients", sub: "View & manage", icon: "👥", to: "Clients", tint: "#DCFCE7" },
  { label: "Leave", sub: "Apply for leave", icon: "🏖️", to: "Leave", tint: "#FCE7F3" },
  { label: "Salary Slips", sub: "View & download", icon: "💵", to: "Salary", tint: "#E0E7FF" },
  { label: "Reports", sub: "End of day", icon: "📊", to: "Reports", tint: "#FEE2E2" },
];

export default function Dashboard({ navigation }: any) {
  const [active, setActive] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = getCurrentUser();
  const displayName = user?.name || "Rajesh Kumar";
  const displayRole = user?.role ? user.role.replace("_", " ") : "Field Executive";
  const displayId = user?.employeeId || "EMP00125";
  const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  const load = useCallback(async () => {
    const s = await getActiveShift();
    setActive(s);
    setLoading(false);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false); };

  const doClockOut = async () => {
    Alert.alert("Clock out?", "GPS tracking will stop for this shift.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clock Out", style: "destructive", onPress: async () => {
          const done = await clockOut();
          setActive(null);
          Alert.alert("Clocked Out", done ? `Shift ended at ${new Date(done.clockOutAt!).toLocaleTimeString()}.` : "Shift ended.");
        }
      },
    ]);
  };

  return (
    <Screen bg={theme.bg}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.navy} />}>
        {/* Hero */}
        <View style={{ backgroundColor: theme.navyDeep, paddingTop: 50, paddingBottom: 22, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
          <Reveal>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#8EA0BF", fontSize: 13 }}>Namaste,</Text>
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 22 }}>{displayName} 👋</Text>
                <View style={{ flexDirection: "row", marginTop: 6 }}>
                  <View style={{ backgroundColor: "rgba(198,166,100,0.2)", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, marginRight: 6 }}>
                    <Text style={{ color: theme.gold, fontWeight: "800", fontSize: 10 }}>{displayRole.toUpperCase()}</Text>
                  </View>
                  <View style={{ backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 }}>
                    <Text style={{ color: "#CBD5E1", fontWeight: "700", fontSize: 10 }}>{displayId}</Text>
                  </View>
                </View>
              </View>
              <PressableScale onPress={() => navigation.navigate("Profile")}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: theme.gold, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "rgba(255,255,255,0.3)" }}>
                  <Text style={{ color: theme.navyDeep, fontWeight: "800", fontSize: 16 }}>{initials}</Text>
                </View>
              </PressableScale>
            </View>
          </Reveal>
          <Reveal delay={110}>
            <View style={{ marginTop: 16 }}>
              <DutyBadge active={!!active} since={active ? new Date(active.clockInAt).toLocaleTimeString() : ""} />
            </View>
          </Reveal>
        </View>

        {/* Tiles */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontWeight: "800", color: theme.navy, fontSize: 17, marginBottom: 12 }}>Quick Actions</Text>
          {loading ? (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
              {[0, 1, 2, 3].map(i => <Skeleton key={i} w="47%" h={118} r={20} style={{ marginBottom: 12 }} />)}
            </View>
          ) : (
            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
              {tiles.map((t, i) => (
                <Reveal key={t.label} delay={Math.min(i, 5) * 60} style={{ width: "47%" }}>
                  <PressableScale onPress={() => navigation.navigate(t.to)}>
                    <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 16, alignItems: "flex-start", marginBottom: 12, minHeight: 122, ...shadow.card }}>
                      <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: t.tint, alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 22 }}>{t.icon}</Text>
                      </View>
                      <Text style={{ fontWeight: "800", marginTop: 10, color: theme.navy, fontSize: 14 }}>{t.label}</Text>
                      <Text style={{ color: theme.muted, fontSize: 11 }}>{t.sub}</Text>
                    </View>
                  </PressableScale>
                </Reveal>
              ))}
            </View>
          )}

          {/* Duty CTA */}
          <Reveal delay={180}>
            {active ? (
              <PressableScale onPress={doClockOut}>
                <View style={{ backgroundColor: theme.danger, borderRadius: 16, padding: 16, alignItems: "center", marginTop: 4 }}>
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Clock Out — End Shift</Text>
                </View>
              </PressableScale>
            ) : (
              <PressableScale onPress={() => navigation.navigate("ClockIn")}>
                <View style={{ backgroundColor: theme.navyDeep, borderRadius: 16, padding: 16, alignItems: "center", marginTop: 4, flexDirection: "row", justifyContent: "center" }}>
                  <Text style={{ fontSize: 18 }}>🕒</Text>
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15, marginLeft: 8 }}>Off duty — tap to Clock In</Text>
                </View>
              </PressableScale>
            )}
          </Reveal>

          <Reveal delay={240}>
            <View style={{ backgroundColor: theme.goldSoft, borderRadius: 16, padding: 14, marginTop: 12, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 24 }}>📍</Text>
              <Text style={{ color: theme.body, fontSize: 12, marginLeft: 10, flex: 1 }}>HBR Layout HO geofence · front-camera selfie · live portal map while on shift</Text>
            </View>
          </Reveal>
        </View>
      </ScrollView>
    </Screen>
  );
}
