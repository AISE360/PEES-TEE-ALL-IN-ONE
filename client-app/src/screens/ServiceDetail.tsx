import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Card, PrimaryButton, BackHeader, Reveal, Screen } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme, shadow } from "../theme";

// Catalogue matches the live service list.
const SERVICE_META: Record<string, { icon: string; color: string; desc: string; features: string[]; docs: string; time: string }> = {
  "Land Purchase & Due Diligence": {
    icon: "handshake", color: "#073A54",
    desc: "Verified acquisition with 30-year EC audit, senior-advocate title opinion and escrow-safe closure. We catch what brokers miss — before you pay.",
    features: ["30-year EC verification & legal opinion", "Adjacent owner consent & boundary check", "Corporate survey + escrow support", "Clean-deed guarantee letter"],
    docs: "Aadhaar · PAN · Title deeds · EC", time: "7–21 days",
  },
  "Land Survey & DGPS (Mojini)": {
    icon: "ruler", color: "#8A4E2E",
    desc: "Licensed surveyors, DGPS mapping with Mojini integration, GPS coordinates and AutoCAD handover — plus fencing and levelling.",
    features: ["DGPS boundary survey + Mojini filing", "11E sketch, Phodi & Durasti", "Fencing, levelling & site prep", "AutoCAD plot file handover"],
    docs: "RTC · Survey no. · Owner ID", time: "2–5 days",
  },
  "Layouts & Development": {
    icon: "hardhat", color: "#5B2E1E",
    desc: "Approved residential, commercial and industrial layouts — roads, drainage and corner-stone development, end to end.",
    features: ["BDA / BMRDA layout approval", "Roads, drainage & utilities", "Corner-stone development", "RERA guidance"],
    docs: "Conversion order · Drawings · KYC", time: "45–120 days",
  },
  "Khata, EC, Mutation, DC Conversion": {
    icon: "filebadge", color: "#0B6E99",
    desc: "E-Khata / A / B-Khata, B-to-A conversion, mutation, 15–30 yr EC, DC conversion (Sec 95) and Kaveri registration — without a single office revisit.",
    features: ["E-Khata / new khata & transfers", "B-Khata to A-Khata conversion", "DC conversion + RTC regularization", "Kaveri registration + tax clearance"],
    docs: "Sale deed · Tax receipts · KYC", time: "3–30 days",
  },
  "GST, MSME & Company Setup": {
    icon: "landmark", color: "#3E6B7E",
    desc: "Aadhaar / PAN, ration, caste & income certificates, GST registration & returns, MSME/Udyam, IEC and Pvt Ltd / LLP incorporation.",
    features: ["GST registration in 3–7 days", "MSME / Udyam / IEC / shop licence", "Ration, caste & income certificates", "Company / LLP incorporation"],
    docs: "PAN · Aadhaar · Address proof", time: "2–14 days",
  },
  "Cargo, Warehousing & Fleet": {
    icon: "truck", color: "#0A2E40",
    desc: "Interstate & intra-city freight, heavy cargo with crane loading, container haulage and warehousing — 24/7 GPS-tracked and insured.",
    features: ["Same-day pickup, interstate lanes", "Heavy lift + container haulage", "Warehousing & e-way bill support", "Live GPS dispatch updates"],
    docs: "Invoice · Packing list · KYC", time: "Same-day pickup",
  },
};

export default function ServiceDetail({ route, navigation }: any) {
  const service = route?.params?.service || { title: "Khata, EC, Mutation, DC Conversion" };
  const meta = SERVICE_META[service.title] || {
    icon: "badge", color: theme.navyDeep,
    desc: service.desc || "Professional service by PEES Tee certified executives.",
    features: ["Dedicated field representative", "Full documentation support", "Secure digital records", "Direct head-office liaison"],
    docs: "Aadhaar · PAN", time: "Ask us",
  };

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="Service Details" sub="PEES Tee Verified" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }}>
        <Reveal>
          <View style={{ backgroundColor: meta.color, borderRadius: 24, padding: 20, flexDirection: "row", alignItems: "center", ...shadow.pop }}>
            <Tile name={meta.icon} bg="rgba(255,255,255,0.22)" box={68} size={34} radius={20} />
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={{ fontWeight: "800", fontSize: 19, color: "#fff" }}>{service.title}</Text>
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <View style={{ backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, marginRight: 6, flexDirection: "row", alignItems: "center" }}>
                  <I name="clock" size={10} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 10, marginLeft: 4 }}>{meta.time.toUpperCase()}</Text>
                </View>
                <View style={{ backgroundColor: "#fff", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, flexDirection: "row", alignItems: "center" }}>
                  <I name="success" size={10} color={theme.navy} />
                  <Text style={{ color: theme.navyDeep, fontWeight: "800", fontSize: 10, marginLeft: 4 }}>PT-TRACKED</Text>
                </View>
              </View>
            </View>
          </View>
        </Reveal>

        <Reveal delay={100}>
          <Text style={{ color: theme.body, lineHeight: 22, marginVertical: 16, fontSize: 14 }}>{meta.desc}</Text>
        </Reveal>

        <Reveal delay={160}>
          <Card style={{ marginBottom: 14 }}>
            <Text style={{ fontWeight: "800", color: theme.navyDeep, marginBottom: 12, fontSize: 15 }}>What's Included</Text>
            {meta.features.map((f, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 9, backgroundColor: "#F8FAFC", borderRadius: 12, padding: 10 }}>
                <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: theme.successBg, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                  <I name="check" size={14} color={theme.success} stroke={3} />
                </View>
                <Text style={{ color: theme.body, fontSize: 13, flex: 1 }}>{f}</Text>
              </View>
            ))}
          </Card>
        </Reveal>

        <Reveal delay={220}>
          <Card style={{ marginBottom: 18, backgroundColor: theme.navyDeep }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <I name="file" size={15} color={theme.gold} />
              <Text style={{ fontWeight: "800", color: theme.gold, fontSize: 13, marginLeft: 7 }}>CARRY THESE DOCUMENTS</Text>
            </View>
            <Text style={{ color: "#fff", marginTop: 8, fontSize: 13 }}>{meta.docs}</Text>
            <Text style={{ color: "#8EA0BF", marginTop: 4, fontSize: 11 }}>Originals + one photocopy set · Aadhaar-linked mobile helps</Text>
          </Card>
        </Reveal>

        <Reveal delay={260}>
          <PrimaryButton title="Request a Quote" onPress={() => navigation.navigate("RequestQuote", { service })} />
          <View style={{ height: 16 }} />
        </Reveal>
      </ScrollView>
    </Screen>
  );
}
