import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Modal, Linking, RefreshControl, Image } from "react-native";
import { Card, Reveal, Skeleton, SearchBar, TabBar, SectionTitle, PressableScale, Screen } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme, shadow } from "../theme";
import { SERVICES, SUPPORT } from "../storage/demoStore";

const META: Record<string, { icon: string; grad: [string, string]; tag: string }> = {
  "Land Purchase & Due Diligence": { icon: "handshake", grad: ["#073A54", "#0E6E97"], tag: "Bestseller" },
  "Land Survey & DGPS (Mojini)": { icon: "ruler", grad: ["#8A4E2E", "#C98A54"], tag: "DGPS" },
  "Layouts & Development": { icon: "hardhat", grad: ["#5B2E1E", "#A6603C"], tag: "Projects" },
  "Khata, EC, Mutation, DC Conversion": { icon: "filebadge", grad: ["#0B6E99", "#0082B6"], tag: "Popular" },
  "GST, MSME & Company Setup": { icon: "landmark", grad: ["#3E6B7E", "#7BA7BC"], tag: "Business" },
  "Cargo, Warehousing & Fleet": { icon: "truck", grad: ["#0A2E40", "#15678A"], tag: "24/7 GPS" },
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
        <Tile name={icon} bg={theme.navy} box={42} size={21} radius={13} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontWeight: "700", color: theme.navyDeep }}>{title}</Text>
          <Text style={{ color: theme.muted, fontSize: 12 }} numberOfLines={1}>{sub}</Text>
        </View>
        <I name="chevR" size={17} color={theme.gold} />
      </View>
    </PressableScale>
  );

  return (
    <Screen bg={theme.bg}>
      <Modal visible={showSupport} transparent animationType="slide" onRequestClose={() => setShowSupport(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(7,58,84,0.6)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 }}>
            <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 14 }} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={require("../../assets/logo.png")} style={{ width: 44, height: 44 }} resizeMode="contain" />
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontWeight: "800", fontSize: 19, color: theme.navyDeep }}>Corporate Support</Text>
                <Text style={{ color: theme.muted, fontSize: 12 }}>PEES Tee Group Pvt Ltd</Text>
              </View>
            </View>
            {supportRow("phone", "Call Us", SUPPORT.phone, () => Linking.openURL(`tel:${SUPPORT.phone.replace(/[^+\d]/g, "")}`))}
            {supportRow("mail", "Email Us", SUPPORT.email, () => Linking.openURL(`mailto:${SUPPORT.email}`))}
            {supportRow("pin", "Find Us", SUPPORT.address, () => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(SUPPORT.address)}`))}
            <PressableScale onPress={() => setShowSupport(false)}>
              <View style={{ backgroundColor: theme.navy, borderRadius: 14, padding: 15, alignItems: "center", marginTop: 18 }}>
                <Text style={{ fontWeight: "800", color: "#fff" }}>Close</Text>
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 6 }}>
                <Image source={require("../../assets/logo.png")} style={{ width: 40, height: 40 }} resizeMode="contain" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: "#8EA0BF", fontSize: 13 }}>Good Morning,</Text>
                <Text style={{ color: "#fff", fontSize: 23, fontWeight: "800" }}>Sufiyan</Text>
              </View>
            </View>
            <Text style={{ color: theme.goldSoft, fontSize: 12, marginTop: 10, fontWeight: "600" }}>What are we solving today?</Text>
          </Reveal>
          <Reveal delay={100}>
            <View style={{ marginTop: 14 }}>
              <SearchBar value={q} onChange={setQ} onClear={() => setQ("")} />
            </View>
          </Reveal>
          <Reveal delay={180}>
            <View style={{ flexDirection: "row", marginTop: 14 }}>
              <PressableScale style={{ flex: 1 }} onPress={() => navigation.navigate("Track")}>
                <View style={{ backgroundColor: theme.navy, borderRadius: 16, padding: 14, marginRight: 8, flexDirection: "row", alignItems: "center" }}>
                  <Tile name="pin" bg="rgba(255,255,255,0.18)" box={44} size={22} radius={14} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "800", color: "#fff" }}>Track</Text>
                    <Text style={{ fontSize: 11, color: "#BCD6E4" }}>PT reference</Text>
                  </View>
                </View>
              </PressableScale>
              <PressableScale style={{ flex: 1 }} onPress={() => setShowSupport(true)}>
                <View style={{ backgroundColor: "rgba(255,255,255,0.10)", borderRadius: 16, padding: 14, marginLeft: 8, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}>
                  <Tile name="headset" bg={theme.gold} box={44} size={22} radius={14} />
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
              <Tile name="search" bg="#EDF1F6" box={64} size={30} radius={20} iconColor={theme.muted} />
              <Text style={{ fontWeight: "800", color: theme.navyDeep, marginTop: 10, fontSize: 16 }}>No services found</Text>
              <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>Try a different search term</Text>
            </Card>
          ) : (
            services.map((s, i) => {
              const m = META[s.title] || { icon: "badge", grad: ["#073A54", "#0E6E97"] as [string, string], tag: "Verified" };
              return (
                <Reveal key={s.id} delay={Math.min(i, 5) * 70}>
                  <PressableScale onPress={() => navigation.navigate("ServiceDetail", { service: s })}>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, backgroundColor: "#fff", borderRadius: 20, padding: 14, ...shadow.card }}>
                      <Tile name={m.icon} bg={m.grad[0]} box={56} size={27} radius={18} />
                      <View style={{ marginLeft: 13, flex: 1 }}>
                        <Text style={{ fontWeight: "800", color: theme.navyDeep, fontSize: 14 }} numberOfLines={1}>{s.title}</Text>
                        <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }} numberOfLines={2}>{s.desc}</Text>
                        <View style={{ alignSelf: "flex-start", backgroundColor: theme.goldSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, marginTop: 6, flexDirection: "row", alignItems: "center" }}>
                          <I name="star" size={10} color={theme.gold} />
                          <Text style={{ color: theme.goldDark, fontWeight: "800", fontSize: 10, marginLeft: 3 }}>{m.tag.toUpperCase()}</Text>
                        </View>
                      </View>
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.navyDeep, alignItems: "center", justifyContent: "center", marginLeft: 8 }}>
                        <I name="next" size={15} color="#fff" />
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
              <Tile name="shield" bg={theme.gold} box={48} size={24} radius={15} />
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
