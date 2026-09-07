import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, BackHeader, Reveal, Card, PressableScale } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme, shadow } from "../theme";
import { getLeaves, getSalarySlips, getShifts, clockOut, leaveBalance } from "../storage/demoStore";
import { getCurrentUser, clearSession } from "../storage/auth";

export default function SelfService({ navigation }: any) {
  const [counts, setCounts] = useState({ leaves: 0, slips: 0, shifts: 0 });
  const user = getCurrentUser();
  const initials = user?.name ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) : "RK";
  const displayName = user?.name || "Rajesh Kumar";
  const displayRole = user?.role ? user.role.replace("_", " ") : "Field Executive";
  const displayId = user?.employeeId || "EMP00125";

  useFocusEffect(useCallback(() => {
    (async () => {
      const [l, s, sh] = await Promise.all([getLeaves(), getSalarySlips(), getShifts()]);
      setCounts({ leaves: l.length, slips: s.length, shifts: sh.length });
    })();
  }, []));

  const rows: { icon: string; label: string; hint: string; fn: () => void }[] = [
    { icon: "user", label: "My Profile", hint: displayName, fn: () => Alert.alert("My Profile", `${displayName}\n${displayRole} • ${displayId}\n+91 ${user?.phone || "8888888888"}\nHBR Layout HO site`) },
    { icon: "umbrella", label: "Leave Application", hint: `${counts.leaves} request(s)`, fn: () => navigation.navigate("Leave") },
    { icon: "calendar", label: "Leave Balance", hint: `${leaveBalance()} Days`, fn: () => navigation.navigate("Leave") },
    { icon: "banknote", label: "Salary Slips", hint: `${counts.slips} slip(s)`, fn: () => navigation.navigate("Salary") },
    { icon: "timer", label: "Shift History", hint: `${counts.shifts} shift(s)`, fn: () => navigation.navigate("ClockIn") },
    { icon: "users", label: "My Clients", hint: "View", fn: () => navigation.navigate("Clients") },
    { icon: "chart", label: "End-of-Day Reports", hint: "Submit", fn: () => navigation.navigate("Reports") },
  ];

  const logout = () => {
    Alert.alert("Secure logout?", "This terminates the GPS/telemetry session and ends your auth session.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout", style: "destructive", onPress: async () => {
          await clockOut();
          clearSession();
          navigation.replace("Login");
        }
      },
    ]);
  };

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="Self Service" sub="Profile & HR" onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Dashboard"))} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 20 }}>
        <Reveal>
          <View style={{ backgroundColor: theme.navyDeep, borderRadius: 24, padding: 20, flexDirection: "row", alignItems: "center", ...shadow.pop }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: theme.gold, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: theme.navyDeep, fontWeight: "800", fontSize: 20 }}>{initials}</Text>
            </View>
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={{ fontWeight: "800", color: "#fff", fontSize: 18 }}>{displayName}</Text>
              <Text style={{ color: "#8EA0BF", fontSize: 12, marginTop: 2 }}>{displayRole} • {displayId}</Text>
            </View>
          </View>
        </Reveal>

        <Reveal delay={100}>
          <Card style={{ marginTop: 14, padding: 8 }}>
            {rows.map((r, i) => (
              <PressableScale key={r.label} onPress={r.fn}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderColor: "#F1F5F9" }}>
                  <Tile name={r.icon} bg="#EFF4F8" box={38} size={18} radius={12} iconColor={theme.navy} />
                  <Text style={{ fontWeight: "700", color: theme.navyDeep, flex: 1, marginLeft: 12 }}>{r.label}</Text>
                  <Text style={{ color: theme.faint, fontSize: 11, marginRight: 4 }} numberOfLines={1}>{r.hint}</Text>
                  <I name="chevR" size={16} color={theme.gold} />
                </View>
              </PressableScale>
            ))}
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <PressableScale onPress={logout}>
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginTop: 14, alignItems: "center", borderWidth: 1, borderColor: "#FCA5A5", flexDirection: "row", justifyContent: "center" }}>
              <I name="logout" size={17} color={theme.danger} />
              <Text style={{ color: theme.danger, fontWeight: "800", marginLeft: 8 }}>Logout — terminates telemetry session</Text>
            </View>
          </PressableScale>
        </Reveal>
      </ScrollView>
    </Screen>
  );
}
