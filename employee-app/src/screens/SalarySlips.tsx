import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, ActivityIndicator } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Screen, BackHeader, Reveal, PressableScale } from "../components/UI";
import { I, Tile } from "../components/icons";
import { theme, shadow } from "../theme";
import { getSalarySlips } from "../storage/demoStore";
import { getCurrentUser } from "../storage/auth";

export default function SalarySlips({ navigation }: any) {
  const [slips, setSlips] = useState<any[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const user = getCurrentUser();
  const displayName = user?.name || "Rajesh Kumar";
  const displayId = user?.employeeId || "EMP00125";
  const displayRole = user?.role ? user.role.replace("_", " ") : "Field Executive";

  useEffect(() => { getSalarySlips().then(setSlips); }, []);

  const slipHtml = (month: string) => `
    <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;padding:32px;color:#073A54">
      <h2>PEES Tee Group Pvt Ltd</h2>
      <p style="color:#5C7B8D;font-size:13px">HBR Layout, Bengaluru, Karnataka - 560043</p>
      <hr style="border:none;border-top:1px solid #DDE8EE;margin:16px 0;"/>
      <h3 style="color:#073A54">Salary Slip — ${month}</h3>
      <p style="font-size:14px;line-height:1.6">
        <b>Employee:</b> ${displayName} (${displayId})<br/>
        <b>Designation:</b> ${displayRole}<br/>
        <b>Payment Date:</b> Last working day of ${month}
      </p>
      <table border="1" cellpadding="10" cellspacing="0" width="100%" style="border-collapse:collapse;border-color:#DDE8EE;font-size:14px;margin-top:16px">
        <tr style="background-color:#F2F6F9"><th align="left">Earnings Component</th><th align="right">Amount (₹)</th></tr>
        <tr><td>Basic Pay</td><td align="right">18,000</td></tr>
        <tr><td>HRA</td><td align="right">7,200</td></tr>
        <tr><td>Conveyance Allowance</td><td align="right">2,800</td></tr>
        <tr style="background-color:#EFF4F8"><td><b>Total Net Pay</b></td><td align="right"><b>₹28,000</b></td></tr>
      </table>
      <p style="color:#93A9B5;font-size:12px;margin-top:24px">Generated officially by PEES Tee Employee Portal.</p>
    </body></html>`;

  const view = async (month: string) => {
    setBusyId(month + "view");
    try {
      const { uri } = await Print.printToFileAsync({ html: slipHtml(month) });
      const can = await Sharing.isAvailableAsync();
      if (can) await Sharing.shareAsync(uri, { dialogTitle: `Salary Slip ${month}` });
      else Alert.alert("PDF ready", `Saved to:\n${uri}`);
    } catch (e: any) { Alert.alert("Failed", e?.message || "Could not generate PDF"); }
    finally { setBusyId(null); }
  };

  const download = async (month: string) => {
    setBusyId(month + "dl");
    try {
      const { uri } = await Print.printToFileAsync({ html: slipHtml(month) });
      Alert.alert("Downloaded", `Salary slip PDF generated successfully:\n${uri}`);
    } catch (e: any) { Alert.alert("Failed", e?.message || "Could not generate PDF"); }
    finally { setBusyId(null); }
  };

  return (
    <Screen bg={theme.bg}>
      <BackHeader title="Salary Slips" sub={`${displayName} · ${displayId}`} onBack={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Dashboard"))} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: 20 }}>
        {slips.map((s, i) => (
          <Reveal key={s.id} delay={Math.min(i, 4) * 60}>
            <View style={{ backgroundColor: "#fff", borderRadius: 18, padding: 15, marginTop: 10, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: theme.line, ...shadow.card }}>
              <Tile name="banknote" bg={theme.goldSoft} box={46} size={22} radius={14} iconColor={theme.goldDark} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ fontWeight: "700", color: theme.navyDeep, fontSize: 14 }}>{s.month}</Text>
                <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>PDF · Net ₹28,000</Text>
              </View>
              {busyId === s.id + "view" || busyId === s.id + "dl" ? <ActivityIndicator color={theme.navy} /> : (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <PressableScale onPress={() => view(s.month)}>
                    <View style={{ borderWidth: 1.5, borderColor: theme.navy, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 9, marginRight: 8, flexDirection: "row", alignItems: "center" }}>
                      <I name="file" size={13} color={theme.navyDeep} />
                      <Text style={{ fontSize: 12, fontWeight: "800", color: theme.navyDeep, marginLeft: 5 }}>View</Text>
                    </View>
                  </PressableScale>
                  <PressableScale onPress={() => download(s.month)}>
                    <View style={{ backgroundColor: theme.navy, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 9, flexDirection: "row", alignItems: "center" }}>
                      <I name="download" size={13} color="#fff" />
                      <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff", marginLeft: 5 }}>PDF</Text>
                    </View>
                  </PressableScale>
                </View>
              )}
            </View>
          </Reveal>
        ))}
        {slips.length === 0 && <Text style={{ color: theme.muted, marginTop: 12 }}>No salary slips yet.</Text>}
      </ScrollView>
    </Screen>
  );
}
