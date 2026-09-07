import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Screen, BackHeader, Reveal, Card, PrimaryButton, PressableScale } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme, shadow } from "../theme";
import { submitPremium } from "../storage/demoStore";
import { getCurrentUser } from "../storage/auth";
import { apiFetch, isApiConfigured } from "../lib/api";

const DOCS = ["Aadhaar Card (Front)", "Aadhaar Card (Back)", "PAN Card", "Voter ID (Optional)", "Additional Documents"];
const MODES = ["Cash", "UPI", "Digital Payment Link"];

type Doc = { label: string; uri?: string; name?: string };
const input = { borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 12, marginTop: 6, fontSize: 14, backgroundColor: "#FAFBFD", color: theme.text };

export default function KYC({ navigation }: any) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Amit Verma");
  const [dob, setDob] = useState("1990-05-12");
  const [address, setAddress] = useState("MG Road, Bengaluru");
  const [contact, setContact] = useState("9876543210");
  const [docs, setDocs] = useState<Doc[]>(DOCS.map(l => ({ label: l })));
  const [mode, setMode] = useState("UPI");
  const [paid, setPaid] = useState(false);
  const [busy, setBusy] = useState(false);

  const setDoc = (i: number, patch: Partial<Doc>) => setDocs(docs.map((d, j) => j === i ? { ...d, ...patch } : d));

  const captureDoc = async (i: number) => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert("Permission needed", "Please allow camera access."); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!res.canceled && res.assets?.[0]) {
      const a = res.assets[0];
      setDoc(i, { uri: a.uri, name: a.fileName || `${docs[i].label.replace(/[^A-Za-z]/g, "")}.jpg` });
    }
  };

  const uploadDoc = (i: number) => {
    Alert.alert(docs[i].label, "Choose a source", [
      {
        text: "Photo Library", onPress: async () => {
          const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!perm.granted) { Alert.alert("Permission needed", "Please allow photo access."); return; }
          const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
          if (!res.canceled && res.assets?.[0]) {
            const a = res.assets[0];
            setDoc(i, { uri: a.uri, name: a.fileName || `${docs[i].label.replace(/[^A-Za-z]/g, "")}.jpg` });
          }
        }
      },
      {
        text: "Files / Documents", onPress: async () => {
          try {
            const res = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
            if (res.assets?.[0]) setDoc(i, { uri: res.assets[0].uri, name: res.assets[0].name });
          } catch (e: any) { Alert.alert("Couldn't open picker", e?.message || "Try again."); }
        }
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const canNextDocs = () => docs[0].uri && docs[1].uri && docs[2].uri;

  // API-first: application lands in the portal queue; offline falls back to device store.
  const doSubmit = async () => {
    if (busy) return;
    if (!paid) { Alert.alert("Payment pending", "Please confirm payment first — Submit stays gated until payment is successful."); return; }
    setBusy(true);
    try {
      const payload = {
        employeeId: getCurrentUser()?.id || "u_hr",
        clientName: name.trim() || "Walk-in Client", dob, address, contact: contact.trim(),
        kycDocs: docs.filter(d => d.uri).map(d => ({ label: d.label, name: d.name })),
        paymentMode: mode.toUpperCase().replace(" ", "_"), paymentStatus: "SUCCESSFUL",
      };
      let referenceNo = "";
      try {
        const r = await apiFetch("/api/premium-applications", { method: "POST", body: JSON.stringify(payload) });
        referenceNo = r.data.referenceNo;
      } catch {
        const app = await submitPremium({ clientName: payload.clientName, contact: payload.contact, paymentMode: payload.paymentMode, paymentStatus: "SUCCESSFUL" });
        referenceNo = app.referenceNo;
      }
      navigation.navigate("PaymentSuccess", { referenceNo });
    } catch (e: any) { Alert.alert("Blocked", e?.message || "Submit failed"); }
    finally { setBusy(false); }
  };

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="KYC Enrolment" sub={isApiConfigured() ? "Live sync on" : "Offline mode"} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }} keyboardShouldPersistTaps="handled">
        <Reveal>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
            {(["Personal", "Documents", "Payment"] as string[]).map((s, i) => {
              const n = i + 1;
              const on = n <= step;
              return (
                <View key={s} style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                  <View style={{ alignItems: "center", flex: 1 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: on ? theme.navyDeep : "#E2E8F0", alignItems: "center", justifyContent: "center" }}>
                      {on && n < step
                        ? <I name="check" size={14} color="#fff" stroke={3} />
                        : <Text style={{ color: on ? "#fff" : theme.muted, fontWeight: "800", fontSize: 12 }}>{n}</Text>}
                    </View>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: on ? theme.navyDeep : theme.faint, marginTop: 3 }}>{s}</Text>
                  </View>
                  {i < 2 && <View style={{ height: 2, flex: 1, backgroundColor: "#E2E8F0", marginBottom: 16, borderRadius: 1 }} />}
                </View>
              );
            })}
          </View>
        </Reveal>

        {step === 1 && (
          <Reveal delay={60}>
            <Card>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Tile name="user" bg={theme.navy} box={42} size={21} radius={13} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontWeight: "800", color: theme.navyDeep, fontSize: 15 }}>Personal Details</Text>
                  <Text style={{ color: theme.muted, fontSize: 12 }}>Client identifying information</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, fontWeight: "700", color: theme.navyDeep, marginTop: 14 }}>Full Name *</Text>
              <TextInput placeholder="Enter full name" value={name} onChangeText={setName} placeholderTextColor="#94A3B8" style={input} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: theme.navyDeep, marginTop: 12 }}>Date of Birth (YYYY-MM-DD)</Text>
              <TextInput placeholder="1990-05-12" value={dob} onChangeText={setDob} placeholderTextColor="#94A3B8" style={input} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: theme.navyDeep, marginTop: 12 }}>Address</Text>
              <TextInput placeholder="Enter client address" value={address} onChangeText={setAddress} multiline placeholderTextColor="#94A3B8" style={input} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: theme.navyDeep, marginTop: 12 }}>Contact Phone *</Text>
              <TextInput placeholder="10-digit mobile number" value={contact} onChangeText={setContact} keyboardType="phone-pad" maxLength={10} placeholderTextColor="#94A3B8" style={input} />
              <View style={{ height: 18 }} />
              <PrimaryButton title="Next: Upload Documents" onPress={() => {
                if (!name.trim()) return Alert.alert("Missing name", "Please enter the client's full name.");
                if (contact.replace(/\D/g, "").length < 10) return Alert.alert("Invalid contact", "Please enter a 10-digit contact number.");
                setStep(2);
              }} />
            </Card>
          </Reveal>
        )}

        {step === 2 && (
          <Reveal delay={60}>
            <Card>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Tile name="file" bg={theme.gold} box={42} size={21} radius={13} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontWeight: "800", color: theme.navyDeep, fontSize: 15 }}>Upload Documents</Text>
                  <Text style={{ color: theme.muted, fontSize: 12 }}>First 3 are required</Text>
                </View>
              </View>
              {docs.map((d, i) => (
                <View key={d.label} style={{ borderWidth: 1, borderColor: d.uri ? theme.success : theme.line, borderRadius: 12, padding: 12, marginTop: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {d.uri
                      ? <Image source={{ uri: d.uri }} style={{ width: 44, height: 44, borderRadius: 8 }} />
                      : <Tile name="file" bg="#EDF1F6" box={44} size={20} radius={10} iconColor={theme.muted} />}
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: theme.navyDeep }}>{d.label} {i < 3 ? "*" : ""}</Text>
                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                        {d.uri && <I name="check" size={11} color={theme.success} stroke={3} />}
                        <Text style={{ fontSize: 11, color: d.uri ? theme.success : theme.muted, marginLeft: d.uri ? 3 : 0 }} numberOfLines={1}>{d.uri ? d.name : "Not attached"}</Text>
                      </View>
                    </View>
                    {d.uri && (
                      <PressableScale onPress={() => setDoc(i, { uri: undefined, name: undefined })}>
                        <View style={{ padding: 6 }}><I name="x" size={15} color={theme.danger} /></View>
                      </PressableScale>
                    )}
                  </View>
                  <View style={{ flexDirection: "row", marginTop: 8 }}>
                    <PressableScale style={{ flex: 1, marginRight: 6 }} onPress={() => captureDoc(i)}>
                      <View style={{ borderWidth: 1.5, borderColor: theme.navy, borderRadius: 10, padding: 9, alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
                        <I name="camera" size={14} color={theme.navyDeep} />
                        <Text style={{ fontSize: 12, fontWeight: "700", color: theme.navyDeep, marginLeft: 6 }}>Capture</Text>
                      </View>
                    </PressableScale>
                    <PressableScale style={{ flex: 1, marginLeft: 6 }} onPress={() => uploadDoc(i)}>
                      <View style={{ borderWidth: 1, borderColor: theme.line, borderRadius: 10, padding: 9, alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
                        <I name="paperclip" size={14} color={theme.navyDeep} />
                        <Text style={{ fontSize: 12, fontWeight: "700", color: theme.navyDeep, marginLeft: 6 }}>Upload</Text>
                      </View>
                    </PressableScale>
                  </View>
                </View>
              ))}
              <View style={{ flexDirection: "row", marginTop: 16 }}>
                <PressableScale style={{ flex: 1, marginRight: 6 }} onPress={() => setStep(1)}>
                  <View style={{ borderWidth: 1, borderColor: theme.line, padding: 14, borderRadius: 14, alignItems: "center" }}>
                    <Text style={{ fontWeight: "700", color: theme.navyDeep }}>Back</Text>
                  </View>
                </PressableScale>
                <View style={{ flex: 2, marginLeft: 6 }}>
                  <PrimaryButton title="Next: Payment" onPress={() => {
                    if (!canNextDocs()) return Alert.alert("Documents missing", "Aadhaar Front, Aadhaar Back and PAN are required.");
                    setStep(3);
                  }} />
                </View>
              </View>
            </Card>
          </Reveal>
        )}

        {step === 3 && (
          <Reveal delay={60}>
            <Card>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Tile name="wallet" bg={theme.success} box={42} size={21} radius={13} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontWeight: "800", color: theme.navyDeep, fontSize: 15 }}>Payment — Total ₹15,000</Text>
                  <Text style={{ color: theme.muted, fontSize: 12 }}>Select mode and confirm receipt</Text>
                </View>
              </View>
              {MODES.map(m => (
                <PressableScale key={m} onPress={() => { setMode(m); setPaid(false); }}>
                  <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: mode === m ? theme.navy : theme.line, backgroundColor: mode === m ? "#EFF6FA" : "#fff", borderRadius: 12, padding: 12, marginTop: 10 }}>
                    <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: theme.navy, backgroundColor: mode === m ? theme.navy : "transparent", alignItems: "center", justifyContent: "center" }}>
                      {mode === m && <I name="check" size={10} color="#fff" stroke={4} />}
                    </View>
                    <Text style={{ marginLeft: 9, fontWeight: mode === m ? "800" : "400", color: theme.navyDeep }}>{m}</Text>
                  </View>
                </PressableScale>
              ))}
              {!paid ? (
                <PressableScale onPress={() => { setPaid(true); Alert.alert("Payment confirmed", "₹15,000 received via " + mode + ". Submit is now enabled."); }}>
                  <View style={{ backgroundColor: theme.navyDeep, borderRadius: 12, padding: 13, alignItems: "center", marginTop: 14, flexDirection: "row", justifyContent: "center" }}>
                    <I name="receipt" size={16} color="#fff" />
                    <Text style={{ color: "#fff", fontWeight: "800", marginLeft: 8 }}>Confirm Payment Received</Text>
                  </View>
                </PressableScale>
              ) : (
                <View style={{ backgroundColor: theme.successBg, borderRadius: 12, padding: 11, marginTop: 12, flexDirection: "row", alignItems: "center" }}>
                  <I name="success" size={18} color={theme.success} />
                  <View style={{ marginLeft: 9 }}>
                    <Text style={{ color: theme.success, fontWeight: "800" }}>Payment Successful ({mode})</Text>
                    <Text style={{ fontSize: 11, color: theme.muted }}>Submit is now enabled.</Text>
                  </View>
                </View>
              )}
              <View style={{ height: 16 }} />
              {busy ? <ActivityIndicator color={theme.navy} /> : (
                <PrimaryButton title="Submit Application" onPress={doSubmit} disabled={!paid} />
              )}
              <PressableScale onPress={() => setStep(2)}>
                <View style={{ alignItems: "center", marginTop: 14, flexDirection: "row", justifyContent: "center" }}>
                  <I name="back" size={14} color={theme.muted} />
                  <Text style={{ color: theme.muted, fontSize: 13, marginLeft: 5 }}>Back to documents</Text>
                </View>
              </PressableScale>
            </Card>
          </Reveal>
        )}
        <View style={{ height: 16 }} />
      </ScrollView>
    </Screen>
  );
}
