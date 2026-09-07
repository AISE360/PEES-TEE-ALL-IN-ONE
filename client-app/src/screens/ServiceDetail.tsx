import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Card, PrimaryButton, BackHeader, Reveal, Screen, Pill } from "../components/UI";
import { theme, shadow } from "../theme";

// FIX: catalogue now matches the live service list (was stale: Land Documentation / Premium Quotes / …)
const SERVICE_META: Record<string, { icon: string; color: string; desc: string; features: string[]; docs: string; time: string }> = {
  "Land Purchase & Due Diligence": {
    icon: "🤝", color: "#0F2440",
    desc: "Verified acquisition with 30-year EC audit, senior-advocate title opinion and escrow-safe closure. We catch what brokers miss — before you pay.",
    features: ["30-year EC verification & legal opinion", "Adjacent owner consent & boundary check", "Corporate survey + escrow support", "Clean-deed guarantee letter"],
    docs: "Aadhaar · PAN · Title deeds · EC", time: "7–21 days",
  },
  "Land Survey & DGPS (Mojini)": {
    icon: "📐", color: "#A88A4A",
    desc: "Licensed surveyors, DGPS mapping with Mojini integration, GPS coordinates and AutoCAD handover — plus fencing and levelling.",
    features: ["DGPS boundary survey + Mojini filing", "11E sketch, Phodi & Durasti", "Fencing, levelling & site prep", "AutoCAD plot file handover"],
    docs: "RTC · Survey no. · Owner ID", time: "2–5 days",
  },
  "Layouts & Development": {
    icon: "🏗️", color: "#DC2626",
    desc: "Approved residential, commercial and industrial layouts — roads, drainage and corner-stone development, end to end.",
    features: ["BDA / BMRDA layout approval", "Roads, drainage & utilities", "Corner-stone development", "RERA guidance"],
    docs: "Conversion order · Drawings · KYC", time: "45–120 days",
  },
  "Khata, EC, Mutation, DC Conversion": {
    icon: "📜", color: "#0E9F6E",
    desc: "E-Khata / A / B-Khata, B→A conversion, mutation, 15–30 yr EC, DC conversion (Sec 95) and Kaveri registration — without a single office revisit.",
    features: ["E-Khata / new khata & transfers", "B-Khata → A-Khata conversion", "DC conversion + RTC regularization", "Kaveri registration + tax clearance"],
    docs: "Sale deed · Tax receipts · KYC", time: "3–30 days",
  },
  "GST, MSME & Company Setup": {
    icon: "🏛️", color: "#7C3AED",
    desc: "Aadhaar / PAN, ration, caste & income certificates, GST registration & returns, MSME/Udyam, IEC and Pvt Ltd / LLP incorporation.",
    features: ["GST registration in 3–7 days", "MSME / Udyam / IEC / shop licence", "Ration, caste & income certificates", "Company / LLP incorporation"],
    docs: "PAN · Aadhaar · Address proof", time: "2–14 days",
  },
  "Cargo, Warehousing & Fleet": {
    icon: "🚚", color: "#0284C7",
    desc: "Interstate & intra-city freight, heavy cargo with crane loading, container haulage and warehousing — 24/7 GPS-tracked and insured.",
    features: ["Same-day pickup, interstate lanes", "Heavy lift + container haulage", "Warehousing & e-way bill support", "Live GPS dispatch updates"],
    docs: "Invoice · Packing list · KYC", time: "Same-day pickup",
  },
};

export default function ServiceDetail({ route, navigation }: any) {
  const service = route?.params?.service || { title: "Khata, EC, Mutation, DC Conversion" };
  const meta = SERVICE_META[service.title] || {
    icon: service.icon || "📄", color: theme.navy,
    desc: service.desc || "Professional service by PEES Tee certified executives.",
    features: ["Dedicated field representative", "Full documentation support", "Secure digital records", "Direct head-office liaison"],
    docs: "Aadhaar · PAN", time: "Ask us",
  };

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="Service Details" sub="PEES Tee Verified ✓" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }}>
        <Reveal>
          <View style={{ backgroundColor: meta.color, borderRadius: 24, padding: 20, flexDirection: "row", alignItems: "center", ...shadow.pop }}>
            <View style={{ width: 68, height: 68, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 36 }}>{meta.icon}</Text>
            </View>
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={{ fontWeight: "800", fontSize: 19, color: "#fff" }}>{service.title}</Text>
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <View style={{ backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, marginRight: 6 }}>
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 10 }}>⏱ {meta.time}</Text>
                </View>
                <View style={{ backgroundColor: theme.gold, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 }}>
                  <Text style={{ color: theme.navyDeep, fontWeight: "800", fontSize: 10 }}>PT-tracked</Text>
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
            <Text style={{ fontWeight: "800", color: theme.navy, marginBottom: 12, fontSize: 15 }}>What's Included</Text>
            {meta.features.map((f, i) => (
              <View key={i} style={{ flexDirection: "row", alignItems: "center", marginBottom: 9, backgroundColor: "#F8FAFC", borderRadius: 12, padding: 10 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: theme.successBg, alignItems: "center", justifyContent: "center", marginRight: 10 }}>
                  <Text style={{ color: theme.success, fontWeight: "800", fontSize: 12 }}>✓</Text>
                </View>
                <Text style={{ color: theme.body, fontSize: 13, flex: 1 }}>{f}</Text>
              </View>
            ))}
          </Card>
        </Reveal>

        <Reveal delay={220}>
          <Card style={{ marginBottom: 18, backgroundColor: theme.navyDeep }}>
            <Text style={{ fontWeight: "800", color: theme.gold, fontSize: 13 }}>📄 CARRY THESE DOCUMENTS</Text>
            <Text style={{ color: "#fff", marginTop: 6, fontSize: 13 }}>{meta.docs}</Text>
            <Text style={{ color: "#8EA0BF", marginTop: 4, fontSize: 11 }}>Originals + one photocopy set · Aadhaar-linked mobile helps</Text>
          </Card>
        </Reveal>

        <Reveal delay={260}>
          <PrimaryButton title="Request a Quote  →" onPress={() => navigation.navigate("RequestQuote", { service })} />
          <View style={{ height: 16 }} />
        </Reveal>
      </ScrollView>
    </Screen>
  );
}
