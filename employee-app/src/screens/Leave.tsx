import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Screen, BackHeader, Reveal, Card, PrimaryButton, PressableScale } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme } from "../theme";
import { getLeaves, applyLeave, leaveBalance, Leave as L } from "../storage/demoStore";
import { getCurrentUser } from "../storage/auth";
import { apiFetch, isApiConfigured } from "../lib/api";

const input = { borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 12, marginTop: 6, fontSize: 14, backgroundColor: "#FAFBFD", color: theme.text };

export default function LeaveScreen({ navigation }: any) {
  const [from, setFrom] = useState("2026-09-10");
  const [to, setTo] = useState("2026-09-12");
  const [reason, setReason] = useState("");
  const [list, setList] = useState<L[]>([]);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState(false);

  const reload = async () => {
    try {
      const user = getCurrentUser();
      const r = await apiFetch(`/api/leaves${user ? `?employeeId=${user.id}` : ""}`);
      setList(r.data || []);
      setLive(true);
    } catch {
      setList(await getLeaves());
      setLive(false);
    }
  };
  useEffect(() => { reload(); }, []);

  const submit = async () => {
    if (!reason.trim()) { Alert.alert("Add reason", "Please enter a reason for leave."); return; }
    if (!from || !to) { Alert.alert("Missing dates", "Please enter from and to dates (YYYY-MM-DD)."); return; }
    setBusy(true);
    try {
      try {
        await apiFetch("/api/leaves", {
          method: "POST",
          body: JSON.stringify({ employeeId: getCurrentUser()?.id || "u_hr", from, to, reason: reason.trim() }),
        });
      } catch {
        await applyLeave({ from, to, reason: reason.trim() });
      }
      setReason("");
      await reload();
      Alert.alert("Leave applied", `Request submitted for approval. Status: PENDING.${live ? "" : " (saved on device)"}`);
    } catch (err: any) { Alert.alert("Failed", err?.message || "Try again"); }
    finally { setBusy(false); }
  };

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="Leave Application" sub={live ? "Synced with HR" : "Device records"} onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Dashboard"))}
        right={
          <View style={{ backgroundColor: theme.successBg, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7, flexDirection: "row", alignItems: "center" }}>
            <I name="calendar" size={13} color={theme.success} />
            <Text style={{ color: theme.success, fontWeight: "800", fontSize: 12, marginLeft: 5 }}>Balance: {leaveBalance()} Days</Text>
          </View>
        } />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
        <Reveal>
          <Card>
            <Text style={{ fontWeight: "700", color: theme.navyDeep, fontSize: 13 }}>From (YYYY-MM-DD)</Text>
            <TextInput value={from} onChangeText={setFrom} placeholder="2026-09-10" placeholderTextColor="#94A3B8" style={input} />
            <Text style={{ fontWeight: "700", marginTop: 12, color: theme.navyDeep, fontSize: 13 }}>To (YYYY-MM-DD)</Text>
            <TextInput value={to} onChangeText={setTo} placeholder="2026-09-12" placeholderTextColor="#94A3B8" style={input} />
            <Text style={{ fontWeight: "700", marginTop: 12, color: theme.navyDeep, fontSize: 13 }}>Reason</Text>
            <TextInput value={reason} onChangeText={setReason} placeholder="e.g. Family function" multiline placeholderTextColor="#94A3B8" style={[input, { minHeight: 70, textAlignVertical: "top" }]} />
            <View style={{ height: 16 }} />
            {busy ? <ActivityIndicator color={theme.navy} /> : <PrimaryButton title="Apply for Leave" onPress={submit} />}
            {!isApiConfigured() && <Text style={{ textAlign: "center", color: theme.faint, fontSize: 11, marginTop: 8 }}>Backend not configured — requests stay on this device.</Text>}
          </Card>
        </Reveal>

        <Text style={{ fontWeight: "800", color: theme.navyDeep, marginTop: 20, fontSize: 16 }}>Past Requests ({list.length})</Text>
        {list.length === 0 && <Text style={{ color: theme.muted, marginTop: 8 }}>No leave requests yet.</Text>}
        {list.map((l, i) => (
          <Reveal key={l.id} delay={Math.min(i, 4) * 60}>
            <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 14, marginTop: 10, borderWidth: 1, borderColor: theme.line, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginRight: 8 }}>
                <Tile name="calendar" bg="#EFF4F8" box={40} size={19} radius={12} iconColor={theme.navy} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={{ fontWeight: "700", color: theme.navyDeep }}>{l.from} → {l.to}</Text>
                  <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>{l.reason}</Text>
                </View>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: l.status === "APPROVED" ? "#DEF7EC" : l.status === "REJECTED" ? "#FDE8E8" : "#FEF3C7" }}>
                <Text style={{ fontWeight: "800", fontSize: 11, color: l.status === "APPROVED" ? "#0E9F6E" : l.status === "REJECTED" ? "#E02424" : "#C27803" }}>{l.status}</Text>
              </View>
            </View>
          </Reveal>
        ))}
      </ScrollView>
    </Screen>
  );
}
