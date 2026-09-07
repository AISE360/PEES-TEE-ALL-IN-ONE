import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, ScrollView, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker, Circle } from "react-native-maps";
import { Screen, BackHeader, Reveal, PrimaryButton, PressableScale } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme, shadow } from "../theme";
import { clockIn, clockOut, getActiveShift } from "../storage/demoStore";
import { getCurrentUser } from "../storage/auth";
import { apiFetch, isApiConfigured } from "../lib/api";

const SITE = { lat: 13.0358, lng: 77.6200, radiusM: 500, name: "Office - HBR Layout" };

function distM(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180, dLon = (b.lng - a.lng) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export default function ClockIn({ navigation }: any) {
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locBusy, setLocBusy] = useState(false);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [active, setActive] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { getActiveShift().then(setActive); }, []);

  const fetchLocation = async () => {
    setLocBusy(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) { Alert.alert("Permission needed", "Please allow location access for geofenced clock-in."); return; }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (e: any) { Alert.alert("Location failed", e?.message || "Could not read GPS. You can still use demo check-in."); }
    finally { setLocBusy(false); }
  };

  const distance = loc ? Math.round(distM(loc, SITE)) : null;
  const inside = distance !== null && distance <= SITE.radiusM;

  const takeSelfie = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) { Alert.alert("Permission needed", "Please allow camera access for the live selfie."); return; }
    const res = await ImagePicker.launchCameraAsync({ cameraType: "front" as any, quality: 0.5, allowsEditing: true, aspect: [1, 1] });
    if (!res.canceled && res.assets?.[0]) { setSelfie(res.assets[0].uri); Alert.alert("Selfie captured", "Live selfie attached to this shift."); }
  };

  // API-first: shift appears on the portal live map; offline falls back to device store.
  const postClockIn = async (): Promise<boolean> => {
    try {
      const user = getCurrentUser();
      const r = await apiFetch("/api/shifts/clock-in", {
        method: "POST",
        body: JSON.stringify({
          employeeId: user?.id || "u_hr",
          lat: loc?.lat ?? null, lng: loc?.lng ?? null, selfie: selfie ? "captured" : "",
        }),
      });
      setActive({ ...r.data, clockInAt: r.data.clockInAt, selfieUri: selfie });
      Alert.alert("Clocked In", "Shift is live on the head-office portal map. GPS tracking started.");
      navigation.navigate("Dashboard");
      return true;
    } catch { return false; }
  };

  const doClockIn = async (demo: boolean) => {
    if (!selfie) { Alert.alert("Selfie required", "Please capture a live selfie before clocking in."); return; }
    if (busy) return;
    setBusy(true);
    try {
      if (isApiConfigured() && !demo && (await postClockIn())) return;
      const entry = await clockIn({ lat: loc?.lat, lng: loc?.lng, selfieUri: selfie });
      setActive(entry);
      Alert.alert(demo ? "Checked in (demo override)" : "Clocked In", demo ? `Outside geofence (${distance ?? "?"}m away) — demo override used. GPS tracking started.` : "GPS tracking started. Active Duty badge is now live on the portal map.");
      navigation.navigate("Dashboard");
    } catch (e: any) { Alert.alert("Failed", e?.message || "Clock-in failed"); }
    finally { setBusy(false); }
  };

  const doClockOut = async () => {
    try {
      const user = getCurrentUser();
      await apiFetch("/api/shifts/clock-out", {
        method: "POST",
        body: JSON.stringify({ employeeId: user?.id || "u_hr", lat: loc?.lat ?? null, lng: loc?.lng ?? null }),
      });
    } catch {}
    const done = await clockOut();
    if (done) { setActive(null); Alert.alert("Clocked Out", `Shift ended at ${new Date(done.clockOutAt!).toLocaleTimeString()}. Tracking stopped.`); navigation.navigate("Dashboard"); }
    else Alert.alert("No active shift", "You are not clocked in.");
  };

  if (active) {
    return (
      <Screen bg={theme.bg}>
        <BackHeader title="On Shift" sub="GPS tracking live" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
          <Reveal>
            <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 24, alignItems: "center", ...shadow.pop }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: theme.success }} />
                <Text style={{ marginLeft: 8, color: theme.success, fontWeight: "800", fontSize: 15 }}>Currently on Active Duty</Text>
              </View>
              <Text style={{ color: theme.muted, marginTop: 8, fontSize: 12 }}>Clocked in at {new Date(active.clockInAt).toLocaleString()}</Text>
              {active.selfieUri && <Image source={{ uri: active.selfieUri }} style={{ width: 96, height: 96, borderRadius: 48, marginTop: 14, borderWidth: 3, borderColor: theme.successBg }} />}
              <PressableScale style={{ alignSelf: "stretch" }} onPress={doClockOut}>
                <View style={{ backgroundColor: theme.danger, padding: 15, borderRadius: 14, alignItems: "center", marginTop: 18 }}>
                  <Text style={{ color: "#fff", fontWeight: "800" }}>Clock Out (stop tracking)</Text>
                </View>
              </PressableScale>
            </View>
          </Reveal>
        </View>
      </Screen>
    );
  }

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="Clock In" sub={SITE.name} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }}>
        {/* Steps */}
        <Reveal>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
            {["Location", "Selfie", "Clock In"].map((s, i) => {
              const on = (i === 0 && !!loc) || (i === 1 && !!selfie) || (i === 2 && !!loc && !!selfie);
              return (
                <View key={s} style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                  <View style={{ alignItems: "center", flex: 1 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: on ? theme.success : i === 0 ? theme.navyDeep : "#E2E8F0", alignItems: "center", justifyContent: "center" }}>
                      {on ? <I name="check" size={14} color="#fff" stroke={3} /> : <Text style={{ color: i === 0 ? "#fff" : theme.muted, fontWeight: "800", fontSize: 12 }}>{i + 1}</Text>}
                    </View>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: on ? theme.success : theme.faint, marginTop: 3 }}>{s}</Text>
                  </View>
                  {i < 2 && <View style={{ height: 2, flex: 1, backgroundColor: "#E2E8F0", marginBottom: 16, borderRadius: 1 }} />}
                </View>
              );
            })}
          </View>
        </Reveal>

        <Reveal delay={80}>
          <View style={{ height: 210, borderRadius: 22, overflow: "hidden", backgroundColor: "#E0E7FF", ...shadow.card }}>
            {loc ? (
              <MapView style={{ flex: 1 }} initialRegion={{ latitude: loc.lat, longitude: loc.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }} showsUserLocation>
                <Marker coordinate={{ latitude: SITE.lat, longitude: SITE.lng }} title={SITE.name} pinColor={theme.navy} />
                <Circle center={{ latitude: SITE.lat, longitude: SITE.lng }} radius={SITE.radiusM} fillColor="rgba(198,166,100,0.25)" strokeColor={theme.gold} />
                <Marker coordinate={{ latitude: loc.lat, longitude: loc.lng }} title="You" pinColor={theme.success} />
              </MapView>
            ) : (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.navyDeep }}>
              <Tile name="pin" bg="rgba(255,255,255,0.15)" box={72} size={34} radius={22} />
              <Text style={{ color: "#8EA0BF", marginTop: 10, fontSize: 13 }}>Tap below to fetch your GPS location</Text>
            </View>
            )}
          </View>
        </Reveal>

        <Reveal delay={140}>
          <PressableScale onPress={fetchLocation} disabled={locBusy}>
            <View style={{ backgroundColor: theme.navyDeep, borderRadius: 14, padding: 14, alignItems: "center", marginTop: 12, flexDirection: "row", justifyContent: "center" }}>
              {locBusy ? <ActivityIndicator color="#fff" /> : (
                <>
                  <I name={loc ? "refresh" : "locate"} size={17} color="#fff" />
                  <Text style={{ color: "#fff", fontWeight: "800", marginLeft: 8 }}>{loc ? "Refresh Location" : "Get My Location"}</Text>
                </>
              )}
            </View>
          </PressableScale>
        </Reveal>

        {loc && (
          <Reveal delay={180}>
            <View style={{ backgroundColor: inside ? theme.successBg : theme.dangerBg, borderRadius: 14, padding: 13, flexDirection: "row", alignItems: "center", marginTop: 12 }}>
              <I name={inside ? "success" : "info"} size={20} color={inside ? theme.success : theme.danger} />
              <Text style={{ marginLeft: 9, color: inside ? theme.success : theme.danger, fontWeight: "800", flex: 1, fontSize: 13 }}>
                {inside ? `Within ${SITE.name} (${distance}m)` : `${distance}m away — outside ${SITE.radiusM}m geofence`}
              </Text>
            </View>
          </Reveal>
        )}

        <Reveal delay={220}>
          <View style={{ backgroundColor: "#fff", borderRadius: 22, padding: 18, alignItems: "center", marginTop: 14, ...shadow.card }}>
            <Text style={{ fontWeight: "800", color: theme.navy, fontSize: 15 }}>Capture Selfie *</Text>
            <Text style={{ color: theme.muted, fontSize: 12 }}>Front camera only — no gallery for this step</Text>
            {selfie ? <Image source={{ uri: selfie }} style={{ width: 104, height: 104, borderRadius: 52, marginTop: 12, borderWidth: 3, borderColor: theme.gold }} /> :
              <View style={{ width: 104, height: 104, borderRadius: 52, backgroundColor: "#EDF1F6", marginTop: 12, alignItems: "center", justifyContent: "center" }}>
                <I name="camera" size={40} color={theme.muted} />
              </View>}
            <PressableScale onPress={takeSelfie}>
              <View style={{ borderWidth: 1.5, borderColor: theme.gold, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10, marginTop: 12, flexDirection: "row", alignItems: "center" }}>
                <I name="camera" size={16} color={theme.navyDeep} />
                <Text style={{ fontWeight: "800", color: theme.navyDeep, marginLeft: 7 }}>{selfie ? "Retake" : "Capture Selfie"}</Text>
              </View>
            </PressableScale>
          </View>
        </Reveal>

        <View style={{ marginTop: 18 }}>
          {busy ? <ActivityIndicator color={theme.navy} /> : (
            <>
              <PrimaryButton title={loc ? "Clock In  →" : "Clock In (get location first)"} onPress={() => doClockIn(false)} disabled={!inside && !!loc} />
              {loc && !inside && (
                <PressableScale onPress={() => doClockIn(true)}>
                  <View style={{ borderWidth: 1.5, borderColor: theme.navy, padding: 13, borderRadius: 14, alignItems: "center", marginTop: 10 }}>
                    <Text style={{ fontWeight: "700", color: theme.navy }}>Demo check-in (override geofence)</Text>
                  </View>
                </PressableScale>
              )}
            </>
          )}
        </View>
        <Text style={{ fontSize: 11, color: theme.muted, textAlign: "center", marginTop: 10, marginBottom: 16 }}>Continuous GPS + portal live map while on shift · HR / Supervisor / Manager only</Text>
      </ScrollView>
    </Screen>
  );
}
