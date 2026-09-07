import React, { useState } from "react";
import { View, Text, ScrollView, Linking, Alert, Modal, Image } from "react-native";
import { Card, BackHeader, Reveal, Screen, TabBar, PressableScale } from "../components/UI";
import { I, Tile } from "../components/icons";
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
    { icon: "list", label: "My Requests", hint: "Track", fn: () => navigation.navigate("Track") },
    { icon: "phone", label: "Support Helpline", hint: SUPPORT.phone, fn: call },
    { icon: "mail", label: "Email Support", hint: SUPPORT.email, fn: mail },
    { icon: "info", label: "About PEES Tee", hint: "v1.1.0", fn: () => setAbout(true) },
  ];

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="Profile" sub="Client account" onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home"))} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 12 }}>
        <Reveal>
          <View style={{ backgroundColor: theme.navyDeep, borderRadius: 24, padding: 20, flexDirection: "row", alignItems: "center", ...shadow.pop }}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: theme.navyDeep, fontWeight: "800", fontSize: 20 }}>SS</Text>
            </View>
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={{ fontWeight: "800", color: "#fff", fontSize: 18 }}>Sufiyan Sajan</Text>
              <Text style={{ color: "#8EA0BF", fontSize: 12, marginTop: 2 }}>+91 98765 43210</Text>
              <View style={{ backgroundColor: "rgba(255,255,255,0.15)", alignSelf: "flex-start", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, marginTop: 7, flexDirection: "row", alignItems: "center" }}>
                <I name="badge" size={10} color="#fff" />
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 10, marginLeft: 4 }}>VERIFIED CLIENT</Text>
              </View>
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
          <Card style={{ marginTop: 14 }}>
            <Text style={{ fontWeight: "800", color: theme.navyDeep, fontSize: 15, marginBottom: 4 }}>Corporate Support</Text>
            {[
              { i: "phone", t: SUPPORT.phone, fn: call },
              { i: "mail", t: SUPPORT.email, fn: mail },
              { i: "pin", t: SUPPORT.address, fn: maps },
              { i: "globe", t: SUPPORT.website, fn: web },
            ].map((r, i) => (
              <PressableScale key={i} onPress={r.fn}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 9 }}>
                  <Tile name={r.i} bg="#EFF4F8" box={34} size={16} radius={11} iconColor={theme.navy} />
                  <Text style={{ color: theme.body, fontSize: 13, flex: 1, marginLeft: 10 }} numberOfLines={2}>{r.t}</Text>
                </View>
              </PressableScale>
            ))}
          </Card>
        </Reveal>

        <Reveal delay={200}>
          <PressableScale onPress={logout}>
            <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, marginTop: 14, alignItems: "center", borderWidth: 1, borderColor: "#FCA5A5", flexDirection: "row", justifyContent: "center" }}>
              <I name="logout" size={17} color={theme.danger} />
              <Text style={{ color: theme.danger, fontWeight: "800", marginLeft: 8 }}>Logout</Text>
            </View>
          </PressableScale>
        </Reveal>
      </ScrollView>

      <Modal visible={about} transparent animationType="fade" onRequestClose={() => setAbout(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(7,58,84,0.6)", justifyContent: "center", padding: 24 }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 24, alignItems: "center" }}>
            <Image source={require("../../assets/logo.png")} style={{ width: 120, height: 90 }} resizeMode="contain" />
            <Text style={{ fontWeight: "800", fontSize: 19, color: theme.navyDeep, marginTop: 8 }}>About PEES Tee</Text>
            <Text style={{ color: theme.body, marginTop: 12, lineHeight: 21, fontSize: 13, textAlign: "center" }}>
              PEES Tee Group Pvt Ltd — land purchase & due diligence, DGPS surveys, approved layouts, khata/EC/mutation/DC conversion, GST & company setup, and GPS-tracked cargo & warehousing.{"\n\n"}Building Trust. Developing Land.
            </Text>
            <PressableScale style={{ alignSelf: "stretch" }} onPress={() => setAbout(false)}>
              <View style={{ backgroundColor: theme.navy, borderRadius: 14, padding: 15, alignItems: "center", marginTop: 20 }}>
                <Text style={{ fontWeight: "800", color: "#fff" }}>Close</Text>
              </View>
            </PressableScale>
          </View>
        </View>
      </Modal>

      <TabBar active="Profile" navigation={navigation} onSupport={() => navigation.navigate("Home")} />
    </Screen>
  );
}
