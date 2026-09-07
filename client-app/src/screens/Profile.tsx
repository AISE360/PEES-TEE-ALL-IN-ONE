import React, { useState } from "react";
import { View, Text, Switch, ScrollView, Linking, Alert, Modal } from "react-native";
import { Card, BackHeader, Reveal, Screen, TabBar, PressableScale } from "../components/UI";
import { theme, shadow } from "../theme";
import { SUPPORT } from "../storage/demoStore";

export default function Profile({ navigation }: any) {
  const [about, setAbout] = useState(false);

  const call = () => Linking.openURL(`tel:${SUPPORT.phone.replace(/[^+\d]/g, "")}`).catch(() => Alert.alert("Can't place call", "Dialer unavailable on this device."));
  const mail = () => Linking.openURL(`mailto:${SUPPORT.email}`).catch(() => Alert.alert("Can't open mail", "No mail app on this device."));
  const maps = () => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(SUPPORT.address)}`).catch(() => Alert.alert("Can't open maps", "Browser unavailable."));
  const web = () => Linking.openURL(`https://${SUPPORT.website}`).catch(() => Alert.alert("Can't open browser", "Browser unavailable."));

  const logout = () => {
    Alert.alert("Logout?", "You will be signed out of the demo session.", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => navigation.replace("Login") },
    ]);
  };

  const rows: { icon: string; label: string; hint: string; fn: () => void }[] = [
    { icon: "📋", label: "My Requests", hint: "Track", fn: () => navigation.navigate("Track") },
    { icon: "📞", label: "Support Helpline", hint: SUPPORT.phone, fn: call },
    { icon: "📧", label: "Email Support", hint: SUPPORT.email, fn: mail },
    { icon: "ℹ️", label: "About PEES Tee", hint: "v1.0.0", fn: () => setAbout(true) },
  ];

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="Profile" sub="Client account" onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home"))} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 12 }}>
        <Reveal>
          <View style={{ backgroundColor: theme.navyDeep, borderRadius: 24, padding: 20, flexDirection: "row", alignItems: "center", ...shadow.pop }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: theme.gold, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: theme.navyDeep, fontWeight: "800", fontSize: 20 }}>SS</Text>
            </View>
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={{ fontWeight: "800", color: "#fff", fontSize: 18 }}>Sufiyan Sajan</Text>
              <Text style={{ color: "#8EA0BF", fontSize: 12, marginTop: 2 }}>+91 98765 43210</Text>
              <View style={{ backgroundColor: "rgba(198,166,100,0.2)", alignSelf: "flex-start", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, marginTop: 7 }}>
                <Text style={{ color: theme.gold, fontWeight: "800", fontSize: 10 }}>★ VERIFIED CLIENT</Text>
              </View>
            </View>
          </View>
        </Reveal>

        <Reveal delay={100}>
          <Card style={{ marginTop: 14, padding: 8 }}>
            {rows.map((r, i) => (
              <PressableScale key={r.label} onPress={r.fn}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 13, paddingHorizontal: 10, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderColor: "#F1F5F9" }}>
                  <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "#F4F6FA", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                    <Text style={{ fontSize: 18 }}>{r.icon}</Text>
                  </View>
                  <Text style={{ fontWeight: "700", color: theme.navy, flex: 1 }}>{r.label}</Text>
                  <Text style={{ color: theme.faint, fontSize: 11, marginRight: 4 }} numberOfLines={1}>{r.hint}</Text>
                  <Text style={{ color: theme.goldDark, fontWeight: "800" }}>→</Text>
                </View>
              </PressableScale>
            ))}
          </Card>
        </Reveal>

        <Reveal delay={160}>
          <Card style={{ marginTop: 14 }}>
            <Text style={{ fontWeight: "800", color: theme.navy, fontSize: 15, marginBottom: 4 }}>Corporate Support</Text>
            {[
              { i: "📞", t: SUPPORT.phone, fn: call },
              { i: "📧", t: SUPPORT.email, fn: mail },
              { i: "📍", t: SUPPORT.address, fn: maps },
              { i: "🌐", t: SUPPORT.website, fn: web },
            ].map((r, i) => (
              <PressableScale key={i} onPress={r.fn}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 9 }}>
                  <Text style={{ marginRight: 10, fontSize: 16 }}>{r.i}</Text>
                  <Text style={{ color: theme.body, fontSize: 13, flex: 1 }} numberOfLines={2}>{r.t}</Text>
                </View>
              </PressableScale>
            ))}
          </Card>
        </Reveal>

        <Reveal delay={200}>
          <PressableScale onPress={logout}>
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginTop: 14, alignItems: "center", borderWidth: 1, borderColor: "#FCA5A5" }}>
              <Text style={{ color: theme.danger, fontWeight: "800" }}>Logout</Text>
            </View>
          </PressableScale>
        </Reveal>
      </ScrollView>

      <Modal visible={about} transparent animationType="fade" onRequestClose={() => setAbout(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(11,21,38,0.6)", justifyContent: "center", padding: 24 }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 24 }}>
            <Text style={{ fontWeight: "800", fontSize: 19, color: theme.navy }}>About PEES Tee</Text>
            <Text style={{ color: theme.body, marginTop: 12, lineHeight: 21, fontSize: 13 }}>
              PEES Tee Group Pvt Ltd — land purchase & due diligence, DGPS surveys, approved layouts, khata/EC/mutation/DC conversion, GST & company setup, and GPS-tracked cargo & warehousing.{"\n\n"}Building Trust. Developing Land.
            </Text>
            <PressableScale onPress={() => setAbout(false)}>
              <View style={{ backgroundColor: theme.gold, borderRadius: 14, padding: 15, alignItems: "center", marginTop: 20 }}>
                <Text style={{ fontWeight: "800", color: theme.navyDeep }}>Close</Text>
              </View>
            </PressableScale>
          </View>
        </View>
      </Modal>

      <TabBar active="Profile" navigation={navigation} onSupport={() => navigation.navigate("Home")} />
    </Screen>
  );
}
