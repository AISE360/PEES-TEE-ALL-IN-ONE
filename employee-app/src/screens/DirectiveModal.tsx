import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Screen, Reveal, PrimaryButton } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme, shadow } from "../theme";
import { getDirective } from "../storage/demoStore";

export default function Directive({ navigation }: any) {
  const [directive, setDirective] = useState<any>(null);

  useEffect(() => { getDirective().then(setDirective); }, []);

  const lines = directive?.message ? directive.message.split("\n").filter(Boolean) : [
    "Visit assigned sites as per schedule.",
    "Ensure complete KYC capture.",
    "Maintain professionalism with clients.",
    "Submit end-of-day report.",
    "Stay within assigned geofence areas.",
  ];

  return (
    <Screen bg={theme.navyDeep}>
      <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
        <Reveal>
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 24, ...shadow.pop }}>
            <Tile name="list" bg={theme.goldSoft} box={56} size={26} radius={18} iconColor={theme.goldDark} />
            <Text style={{ fontWeight: "800", fontSize: 19, marginTop: 14, color: theme.navyDeep }}>Today's Shift Instructions</Text>
            <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>
              {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </Text>
            {!directive ? (
              <ActivityIndicator color={theme.navy} style={{ marginTop: 16 }} />
            ) : (
              <View style={{ marginTop: 14 }}>
                {lines.map((line: string, i: number) => (
                  <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "#EFF6FA", alignItems: "center", justifyContent: "center", marginRight: 9, marginTop: 1 }}>
                      <I name="check" size={12} color={theme.navy} stroke={3} />
                    </View>
                    <Text style={{ color: theme.body, flex: 1, fontSize: 13, lineHeight: 20 }}>{line.replace(/^[•\-\*]\s*/, "")}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={{ height: 20 }} />
            <PrimaryButton title="Got it — Start Shift" onPress={() => navigation.replace("Dashboard")} />
          </View>
        </Reveal>
      </View>
    </Screen>
  );
}
