import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Modal, Linking, RefreshControl } from "react-native";
import { Card, Reveal, Skeleton, SearchBar, TabBar, SectionTitle, PressableScale, Screen } from "../components/UI";
import { theme, shadow } from "../theme";
import { SERVICES, SUPPORT } from "../storage/demoStore";

const META: Record<string, { grad: [string, string]; tag: string }> = {
  "Land Purchase & Due Diligence": { grad: ["#0F2440", "#2A4063"], tag: "Bestseller" },
  "Land Survey & DGPS (Mojini)": { grad: ["#7C5E1E", "#C6A664"], tag: "DGPS" },
  "Layouts & Development": { grad: ["#7F1D1D", "#DC2626"], tag: "Projects" },
  "Khata, EC, Mutation, DC Conversion": { grad: ["#065F46", "#0E9F6E"], tag: "Popular" },
  "GST, MSME & Company Setup": { grad: ["#6D28D9", "#A855F7"], tag: "Business" },
  "Cargo, Warehousing & Fleet": { grad: ["#0C4A6E", "#0284C7"], tag: "24/7 GPS" },
};

export default function Home({ navigation }: any) {
  const [q, setQ] = useState("");
  const [showSupport, setShowSupport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 900); return () => clearTimeout(t); }, []);
  const onRefresh = async () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); };

  const services = SERVICES.filter(s =>
    s.title.toLowerCase().includes(q.toLowerCase()) || s.desc.toLowerCase().includes(q.toLowerCase()));

  const supportRow = (icon: string, title: string, sub: string, fn: () => void) => (
    <PressableScale key={title} onPress={fn}>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10, padding: 13, backgroundColor: "#F8FAFC", borderRadius: 14 }}>
        <Text style={{ fontSize: 22, marginRight: 12 }}>{icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", color: theme.navy }}>{title}</Text>
          <Text style={{ color: theme.muted, fontSize: 12 }} numberOfLines={1}>{sub}</Text>
        </View>
        <Text style={{ color: theme.goldDark, fontWeight: "800" }}>→</Text>
      </View>
    </PressableScale>
  );

  return (
    <Screen bg={theme.bg}>
      <Modal visible={showSupport} transparent animationType="slide" onRequestClose={() => setShowSupport(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(11,21,38,0.6)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 }}>
            <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 14 }} />
            <Text style={{ fontWeight: "800", fontSize: 19, color: theme.navy }}>Corporate Support</Text>
            <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>PEES Tee Group Pvt Ltd · {SUPPORT.phone}</Text>
            {supportRow("📞", "Call Us", SUPPORT.phone, () => Linking.openURL(`tel:${SUPPORT.phone.replace(/[^+\d]/g, "")}`))}
            {supportRow("📧", "Email Us", SUPPORT.email, () => Linking.openURL(`mailto:${SUPPORT.email}`))}
            {supportRow("📍", "Find Us", SUPPORT.address, () => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(SUPPORT.address)}`))}
            <PressableScale onPress={() => setShowSupport(false)}>
              <View style={{ backgroundColor: theme.gold, borderRadius: 14, padding: 15, alignItems: "center", marginTop: 18 }}>
                <Text style={{ fontWeight: "800", color: theme.navyDeep }}>Close</Text>
              </View>
            </PressableScale>
          </View>
        </View>
      </Modal>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.navy} />}
      >
        {/* Hero */}
        <View style={{ backgroundColor: theme.navyDeep, paddingTop: 50, paddingBottom: 24, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
          <Reveal>
            <Text style={{ color: "#8EA0BF", fontSize: 13 }}>Good Morning,</Text>
            <Text style={{ color: "#fff", fontSize: 25, fontWeight: "800" }}>Sufiyan 👋</Text>
            <Text style={{ color: theme.gold, fontSize: 12, marginTop: 3, fontWeight: "600" }}>What are we solving today?</Text>
          </Reveal>
          <Reveal delay={100}>
            <View style={{ marginTop: 16 }}>
              <SearchBar value={q} onChange={setQ} onClear={() => setQ("")} />
            </View>
          </Reveal>
          <Reveal delay={180}>
            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <PressableScale style={{ flex: 1 }} onPress={() => navigation.navigate("Track")}>
                <View style={{ backgroundColor: theme.gold, borderRadius: 16, padding: 14, marginRight: 8, flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 24 }}>📍</Text>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "800", color: theme.navyDeep }}>Track</Text>
                    <Text style={{ fontSize: 11, color: "#4A3F1F" }}>PT reference</Text>
                  </View>
                </View>
              </PressableScale>
              <PressableScale style={{ flex: 1 }} onPress={() => setShowSupport(true)}>
                <View style={{ backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 16, padding: 14, marginLeft: 8, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}>
                  <Text style={{ fontSize: 24 }}>💬</Text>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "800", color: "#fff" }}>Support</Text>
                    <Text style={{ fontSize: 11, color: "#8EA0BF" }}>Talk to us</Text>
                  </View>
                </View>
              </PressableScale>
            </View>
          </Reveal>
        </View>

        {/* Services */}
        <View style={{ padding: 16 }}>
          <SectionTitle title="Available Services" action="Track order" onAction={() => navigation.navigate("Track")} />
          {loading ? (
            <>
              <Skeleton h={86} r={20} style={{ marginBottom: 12 }} />
              <Skeleton h={86} r={20} style={{ marginBottom: 12 }} />
              <Skeleton h={86} r={20} style={{ marginBottom: 12 }} />
            </>
          ) : services.length === 0 ? (
            <Card style={{ alignItems: "center", padding: 28 }}>
              <Text style={{ fontSize: 36 }}>🔍</Text>
              <Text style={{ fontWeight: "800", color: theme.navy, marginTop: 8 }}>No services found</Text>
              <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>Try a different search term</Text>
            </Card>
          ) : (
            services.map((s, i) => {
              const m = META[s.title] || { grad: ["#0F2440", "#2A4063"] as [string, string], tag: "Verified" };
              return (
                <Reveal key={s.id} delay={Math.min(i, 5) * 70}>
                  <PressableScale onPress={() => navigation.navigate("ServiceDetail", { service: s })}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, backgroundColor: "#fff", borderRadius: 20, padding: 14, ...shadow.card }}>
                      <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: m.grad[0], alignItems: "center", justifyContent: "center" }}>
                        <Text style={{ fontSize: 26 }}>{s.icon}</Text>
                      </View>
                      <View style={{ marginLeft: 13, flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <Text style={{ fontWeight: "800", color: theme.navy, fontSize: 14, flex: 1 }} numberOfLines={1}>{s.title}</Text>
                        </View>
                        <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }} numberOfLines={2}>{s.desc}</Text>
                        <View style={{ alignSelf: "flex-start", backgroundColor: theme.goldSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, marginTop: 6 }}>
                          <Text style={{ color: theme.goldDark, fontWeight: "800", fontSize: 10 }}>★ {m.tag}</Text>
                        </View>
                      </View>
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.navyDeep, alignItems: "center", justifyContent: "center", marginLeft: 8 }}>
                        <Text style={{ color: theme.gold, fontWeight: "800", fontSize: 15 }}>→</Text>
                      </View>
                    </View>
                  </PressableScale>
                </Reveal>
              );
            })
          )}

          {/* Trust strip */}
          <Reveal delay={200}>
            <View style={{ backgroundColor: theme.navyDeep, borderRadius: 20, padding: 16, marginTop: 6, flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 28 }}>🛡️</Text>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: "#fff", fontWeight: "800" }}>30-yr EC verified titles</Text>
                <Text style={{ color: "#8EA0BF", fontSize: 12 }}>Advocate-vetted · PT-tracked · GST invoiced</Text>
              </View>
            </View>
          </Reveal>
        </View>
      </ScrollView>

      <TabBar active="Home" navigation={navigation} onSupport={() => setShowSupport(true)} />
    </Screen>
  );
}
