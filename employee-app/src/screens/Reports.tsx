import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Screen, BackHeader, Reveal, Card, PrimaryButton } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme } from "../theme";
import { getEODs, submitEOD, EOD } from "../storage/demoStore";

const input = { borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 12, marginTop: 6, fontSize: 14, backgroundColor: "#FAFBFD", color: theme.text };

export default function Reports({ navigation }: any) {
  const [activities, setActivities] = useState("");
  const [collections, setCollections] = useState("");
  const [notes, setNotes] = useState("");
  const [list, setList] = useState<EOD[]>([]);
  const [busy, setBusy] = useState(false);

  const reload = async () => setList(await getEODs());
  useEffect(() => { reload(); }, []);

  const submit = async () => {
    if (!activities.trim()) { Alert.alert("Add activities", "Please log today's field activities."); return; }
    setBusy(true);
    try {
      await submitEOD({ activities: activities.trim(), collections: collections.trim() || "Nil", notes: notes.trim() || "—" });
      setActivities(""); setCollections(""); setNotes("");
      await reload();
      Alert.alert("Report submitted", "End-of-day report saved. HR can review it on the portal.");
    } catch (e: any) { Alert.alert("Failed", e?.message || "Try again"); }
    finally { setBusy(false); }
  };

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="End-of-Day Report" sub="Daily field summary" onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Dashboard"))} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
        <Reveal>
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Tile name="chart" bg={theme.navy} box={42} size={21} radius={13} />
              <Text style={{ fontWeight: "800", color: theme.navyDeep, fontSize: 15, marginLeft: 12 }}>Today's Summary</Text>
            </View>
            <Text style={{ fontWeight: "700", marginTop: 14, color: theme.navyDeep, fontSize: 13 }}>Activity Log *</Text>
            <TextInput value={activities} onChangeText={setActivities} placeholder="Sites visited, KYCs done, client meetings..." multiline placeholderTextColor="#94A3B8" style={[input, { minHeight: 80, textAlignVertical: "top" }]} />
            <Text style={{ fontWeight: "700", marginTop: 12, color: theme.navyDeep, fontSize: 13 }}>Collections Summary</Text>
            <TextInput value={collections} onChangeText={setCollections} placeholder="e.g. ₹15,000 via UPI (1 KYC client)" multiline placeholderTextColor="#94A3B8" style={input} />
            <Text style={{ fontWeight: "700", marginTop: 12, color: theme.navyDeep, fontSize: 13 }}>Progress Notes</Text>
            <TextInput value={notes} onChangeText={setNotes} placeholder="Follow-ups, obstacles, client feedback..." multiline placeholderTextColor="#94A3B8" style={input} />
            <View style={{ height: 16 }} />
            {busy ? <ActivityIndicator color={theme.navy} /> : <PrimaryButton title="Submit Report" onPress={submit} />}
          </Card>
        </Reveal>

        <Text style={{ fontWeight: "800", color: theme.navyDeep, marginTop: 20, fontSize: 16 }}>Submitted Reports ({list.length})</Text>
        {list.length === 0 && <Text style={{ color: theme.muted, marginTop: 8 }}>No reports submitted yet.</Text>}
        {list.map((r, i) => (
          <Reveal key={r.id} delay={Math.min(i, 4) * 60}>
            <View style={{ backgroundColor: "#fff", borderRadius: 14, padding: 14, marginTop: 10, borderWidth: 1, borderColor: theme.line }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <I name="calendar" size={14} color={theme.navy} />
                <Text style={{ fontWeight: "800", color: theme.navyDeep, marginLeft: 7 }}>{r.date}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 8 }}>
                <I name="list" size={13} color={theme.muted} />
                <Text style={{ color: theme.body, fontSize: 13, marginLeft: 7, flex: 1 }}>Activities: {r.activities}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 3 }}>
                <I name="wallet" size={13} color={theme.muted} />
                <Text style={{ color: theme.body, fontSize: 13, marginLeft: 7, flex: 1 }}>Collections: {r.collections}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 3 }}>
                <I name="note" size={13} color={theme.muted} />
                <Text style={{ color: theme.muted, fontSize: 12, marginLeft: 7, flex: 1 }}>Notes: {r.notes}</Text>
              </View>
            </View>
          </Reveal>
        ))}
      </ScrollView>
    </Screen>
  );
}
