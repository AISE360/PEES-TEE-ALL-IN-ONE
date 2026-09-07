import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, RefreshControl, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Screen, BackHeader, Reveal, PrimaryButton, PressableScale } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme, shadow } from "../theme";
import { getClients } from "../storage/demoStore";

export default function Clients({ navigation }: any) {
  const [clients, setClients] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const reload = async () => setClients(await getClients());
  useFocusEffect(useCallback(() => { reload(); }, []));
  const onRefresh = async () => { setRefreshing(true); await reload(); setRefreshing(false); };

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="My Clients" sub="Enrolled via KYC · pull down to refresh" onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Dashboard"))} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.navy} />}>
        {clients.length === 0 && (
          <Reveal>
            <View style={{ backgroundColor: "#fff", borderRadius: 20, padding: 28, alignItems: "center", ...shadow.card }}>
              <Tile name="users" bg="#EDF1F6" box={64} size={30} radius={20} iconColor={theme.muted} />
              <Text style={{ fontWeight: "800", color: theme.navyDeep, marginTop: 10, fontSize: 16 }}>No clients yet</Text>
              <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>Enroll your first client via KYC enrolment</Text>
              <View style={{ alignSelf: "stretch", marginTop: 16 }}>
                <PrimaryButton title="Start KYC Enrolment" onPress={() => navigation.navigate("KYC")} />
              </View>
            </View>
          </Reveal>
        )}
        {clients.map((c, i) => (
          <Reveal key={i} delay={Math.min(i, 4) * 60}>
            <PressableScale onPress={() => Alert.alert(c.name, `Contact: ${c.contact}\nReference: ${c.referenceNo}\nStatus: ${c.status}`)}>
              <View style={{ backgroundColor: "#fff", borderRadius: 18, padding: 15, marginTop: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: theme.line }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: theme.navy, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 17 }}>{c.name.charAt(0)}</Text>
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={{ fontWeight: "700", color: theme.navyDeep }}>{c.name}</Text>
                  <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>{c.contact} · {c.referenceNo}</Text>
                </View>
                <View style={{ paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, backgroundColor: c.status === "APPROVED" ? "#DEF7EC" : "#FEF3C7" }}>
                  <Text style={{ fontSize: 11, fontWeight: "800", color: c.status === "APPROVED" ? "#0E9F6E" : "#C27803" }}>{c.status}</Text>
                </View>
              </View>
            </PressableScale>
          </Reveal>
        ))}
      </ScrollView>
    </Screen>
  );
}
