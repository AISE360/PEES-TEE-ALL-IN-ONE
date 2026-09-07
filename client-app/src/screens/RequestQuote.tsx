import React, { useState } from "react";
import { View, Text, TextInput, Alert, ScrollView, ActivityIndicator, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Card, PrimaryButton, BackHeader, Reveal, Screen, PressableScale } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme } from "../theme";
import { saveRequest, Attachment } from "../storage/demoStore";
import { apiFetch, isApiConfigured } from "../lib/api";

export default function RequestQuote({ route, navigation }: any) {
  const service = route?.params?.service || { title: "Khata, EC, Mutation, DC Conversion", desc: "" };
  const serviceType = service.title;
  const [desc, setDesc] = useState("");
  const [time, setTime] = useState("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const [busy, setBusy] = useState(false);
  const input = { borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 12, marginTop: 6, fontSize: 14, backgroundColor: "#FAFBFD", color: theme.text };

  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert("Permission needed", "Please allow photo access to attach images."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6 });
    if (!res.canceled && res.assets?.[0]) {
      const a = res.assets[0];
      setFiles(f => [...f, { name: a.fileName || `photo_${Date.now()}.jpg`, uri: a.uri, size: a.fileSize, mime: a.mimeType || "image/jpeg" }]);
    }
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert("Permission needed", "Please allow camera access to take a photo."); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!res.canceled && res.assets?.[0]) {
      const a = res.assets[0];
      setFiles(f => [...f, { name: a.fileName || `capture_${Date.now()}.jpg`, uri: a.uri, size: a.fileSize, mime: a.mimeType || "image/jpeg" }]);
    }
  };

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
      if (res.assets?.[0]) {
        const d = res.assets[0];
        setFiles(f => [...f, { name: d.name, uri: d.uri, size: d.size, mime: d.mimeType }]);
      }
    } catch (e: any) { Alert.alert("Couldn't open picker", e?.message || "Try again."); }
  };

  const chooseAttach = () => {
    Alert.alert("Attach Document", "Choose an attachment method", [
      { text: "Take Photo", onPress: takePhoto },
      { text: "Photo Library", onPress: pickImage },
      { text: "Files / Documents", onPress: pickDocument },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // API-first: POST to backend so the portal sees it live; offline falls back to device store.
  const submit = async () => {
    if (!desc.trim()) { Alert.alert("Add details", "Please describe your requirement before submitting."); return; }
    if (busy) return;
    setBusy(true);
    try {
      let reference = "";
      let synced = false;
      try {
        const r = await apiFetch("/api/client-requests", {
          method: "POST",
          body: JSON.stringify({
            serviceType, description: desc.trim(), preferredContactTime: time.trim() || "Anytime",
            attachments: files.map(f => ({ name: f.name, size: f.size })),
          }),
        });
        reference = r.data.reference;
        synced = true;
      } catch {
        const entry = await saveRequest({ serviceType, description: desc.trim(), preferredContactTime: time.trim() || "Anytime", attachments: files });
        reference = entry.reference;
      }
      Alert.alert(
        "Request submitted",
        `Reference: ${reference}\n${synced ? "Synced live — track it here and our expert will call you shortly." : "Saved on this device — our expert will call you shortly."}`,
        [{ text: "Track Request", onPress: () => navigation.replace("Track", { reference }) }],
      );
    } catch (e: any) { Alert.alert("Error", e?.message || "Save failed"); }
    finally { setBusy(false); }
  };

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="Request a Quote" sub={serviceType} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }} keyboardShouldPersistTaps="handled">
        <Reveal>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
            {(["Details", "Review", "Track"] as string[]).map((s, i) => (
              <View key={s} style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <View style={{ alignItems: "center", flex: 1 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: i === 0 ? theme.navyDeep : "#E2E8F0", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: i === 0 ? "#fff" : theme.muted, fontWeight: "800", fontSize: 12 }}>{i + 1}</Text>
                  </View>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: i === 0 ? theme.navyDeep : theme.faint, marginTop: 3 }}>{s}</Text>
                </View>
                {i < 2 && <View style={{ height: 2, flex: 1, backgroundColor: "#E2E8F0", marginBottom: 16, borderRadius: 1 }} />}
              </View>
            ))}
          </View>
        </Reveal>

        <Reveal delay={80}>
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontWeight: "700", color: theme.navyDeep, fontSize: 13 }}>SELECTED SERVICE</Text>
              {isApiConfigured()
                ? <View style={{ flexDirection: "row", alignItems: "center" }}><I name="success" size={12} color={theme.success} /><Text style={{ fontSize: 10, fontWeight: "800", color: theme.success, marginLeft: 4 }}>LIVE SYNC</Text></View>
                : <View style={{ flexDirection: "row", alignItems: "center" }}><I name="info" size={12} color={theme.muted} /><Text style={{ fontSize: 10, fontWeight: "800", color: theme.muted, marginLeft: 4 }}>OFFLINE MODE</Text></View>}
            </View>
            <View style={{ borderRadius: 12, padding: 13, marginTop: 6, backgroundColor: theme.navyDeep, flexDirection: "row", alignItems: "center" }}>
              <I name="badge" size={22} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "800", flex: 1, marginLeft: 10 }}>{serviceType}</Text>
              <I name="check" size={15} color={theme.gold} stroke={3} />
            </View>

            <Text style={{ fontWeight: "700", marginTop: 16, color: theme.navyDeep, fontSize: 13 }}>Requirement Details *</Text>
            <TextInput value={desc} onChangeText={setDesc} placeholder="Location, survey no. / address, timeline…" placeholderTextColor="#94A3B8" multiline style={[input, { minHeight: 90, textAlignVertical: "top" }]} />

            <Text style={{ fontWeight: "700", marginTop: 14, color: theme.navyDeep, fontSize: 13 }}>Preferred Contact Time</Text>
            <TextInput value={time} onChangeText={setTime} placeholder="e.g. Tomorrow 10 AM, or Anytime" placeholderTextColor="#94A3B8" style={input} />

            <Text style={{ fontWeight: "700", marginTop: 14, color: theme.navyDeep, fontSize: 13 }}>Attachments {files.length > 0 ? `(${files.length})` : "(Optional)"}</Text>
            <PressableScale onPress={chooseAttach}>
              <View style={{ borderWidth: 1.5, borderStyle: "dashed", borderColor: theme.gold, borderRadius: 14, padding: 18, alignItems: "center", marginTop: 8, backgroundColor: "#FEFDF6" }}>
                <Tile name="paperclip" bg={theme.goldSoft} box={52} size={24} radius={16} iconColor={theme.goldDark} />
                <Text style={{ fontSize: 13, fontWeight: "700", color: theme.navyDeep, marginTop: 8 }}>Tap to attach photo, camera, or file</Text>
                <Text style={{ fontSize: 11, color: theme.muted }}>Photos auto-compress under 50 KB · PDFs under 300 KB</Text>
              </View>
            </PressableScale>

            {files.map((f, i) => (
              <View key={`${f.uri}_${i}`} style={{ flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 10, marginTop: 8, backgroundColor: "#FAFBFD" }}>
                {f.mime?.startsWith("image") ? (
                  <Image source={{ uri: f.uri }} style={{ width: 42, height: 42, borderRadius: 10 }} />
                ) : <Tile name="file" bg="#EDF1F6" box={42} size={20} radius={10} iconColor={theme.muted} />}
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: "700", fontSize: 12, color: theme.navyDeep }}>{f.name}</Text>
                  <Text style={{ color: theme.muted, fontSize: 11 }}>{f.size ? `${Math.round(f.size / 1024)} KB` : "cached file"}</Text>
                </View>
                <PressableScale onPress={() => setFiles(files.filter((_, j) => j !== i))}>
                  <View style={{ padding: 8 }}><I name="x" size={16} color={theme.danger} /></View>
                </PressableScale>
              </View>
            ))}

            <View style={{ height: 20 }} />
            {busy ? <ActivityIndicator color={theme.navy} /> : <PrimaryButton title="Submit Request" onPress={submit} />}
            <Text style={{ textAlign: "center", color: theme.faint, fontSize: 11, marginTop: 10 }}>Instant PT reference · expert callback in ~30 min</Text>
          </Card>
        </Reveal>
        <View style={{ height: 16 }} />
      </ScrollView>
    </Screen>
  );
}
