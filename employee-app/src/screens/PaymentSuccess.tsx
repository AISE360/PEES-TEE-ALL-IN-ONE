import React from "react";
import { View, Text, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Screen, Reveal, PrimaryButton, PressableScale } from "../components/UI";
import { I } from "../components/icons";
import { theme, shadow } from "../theme";

export default function PaymentSuccess({ navigation, route }: any) {
  const ref = route?.params?.referenceNo || "PT48213";
  const copy = async () => {
    await Clipboard.setStringAsync(ref);
    Alert.alert("Copied", `Reference ${ref} copied to clipboard.`);
  };

  return (
    <Screen bg={theme.bg}>
      <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
        <Reveal>
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 26, alignItems: "center", ...shadow.pop }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: theme.success, alignItems: "center", justifyContent: "center" }}>
              <I name="check" size={34} color="#fff" stroke={3} />
            </View>
            <Text style={{ fontWeight: "800", fontSize: 22, color: theme.navyDeep, marginTop: 14 }}>Success</Text>
            <Text style={{ color: theme.muted, textAlign: "center", marginTop: 4, fontSize: 13 }}>Application submitted and saved successfully.</Text>
            <Text style={{ color: theme.muted, fontSize: 11, marginTop: 20, fontWeight: "700" }}>REFERENCE NUMBER</Text>
            <PressableScale onPress={copy}>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, backgroundColor: "#EFF4F8", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 }}>
                <Text style={{ fontWeight: "900", fontSize: 22, color: theme.navyDeep, letterSpacing: 1 }}>{ref}</Text>
                <I name="copy" size={17} color={theme.navy} />
              </View>
            </PressableScale>
            <Text style={{ color: theme.faint, fontSize: 11, textAlign: "center", marginTop: 8 }}>Tap reference to copy to clipboard.</Text>
            <View style={{ alignSelf: "stretch", marginTop: 20 }}>
              <PressableScale onPress={() => navigation.navigate("KYC")}>
                <View style={{ borderWidth: 1.5, borderColor: theme.navy, padding: 13, borderRadius: 14, alignItems: "center", flexDirection: "row", justifyContent: "center" }}>
                  <I name="next" size={15} color={theme.navyDeep} />
                  <Text style={{ fontWeight: "800", color: theme.navyDeep, marginLeft: 7 }}>New Application</Text>
                </View>
              </PressableScale>
            </View>
            <View style={{ alignSelf: "stretch", marginTop: 10 }}>
              <PrimaryButton title="Back to Dashboard" onPress={() => navigation.navigate("Dashboard")} />
            </View>
          </View>
        </Reveal>
      </View>
    </Screen>
  );
}
