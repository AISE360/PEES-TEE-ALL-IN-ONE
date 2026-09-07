import React, { useState } from "react";
import { View, Text, TextInput, Image, Alert, ActivityIndicator, Modal, ScrollView } from "react-native";
import { Screen, Reveal, PrimaryButton, PressableScale } from "../components/UI";
import { theme } from "../theme";
import { attemptLogin, setCurrentUser } from "../storage/auth";

const DEMO_OTP = "123456";
const input = { borderWidth: 1, borderColor: theme.line, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, backgroundColor: "#FAFBFD", color: theme.text };

export default function Login({ navigation }: any) {
  const [id, setId] = useState("EMP00125");
  const [pw, setPw] = useState("password123");
  const [busy, setBusy] = useState(false);
  const [showMfa, setShowMfa] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  const doLogin = async () => {
    if (!id.trim()) { Alert.alert("Missing ID", "Please enter your Employee ID or phone number."); return; }
    if (!pw.trim()) { Alert.alert("Missing Password", "Please enter your password."); return; }
    setBusy(true);
    await new Promise(r => setTimeout(r, 700));
    const user = attemptLogin(id.trim(), pw.trim());
    setBusy(false);
    if (!user) {
      Alert.alert("Login failed", "Employee ID or password is incorrect.\n\nDemo credentials:\nID: EMP00125\nPassword: password123");
      return;
    }
    setPendingUser(user);
    setOtp("");
    setShowMfa(true);
    Alert.alert("OTP Sent (demo)", "Your demo MFA code is 123456. Check your registered mobile.");
  };

  const verifyOtp = async () => {
    if (otp.trim().length < 6) { Alert.alert("Enter OTP", "Please enter the 6-digit OTP."); return; }
    if (otp.trim() !== DEMO_OTP) { Alert.alert("Wrong OTP", "Incorrect OTP. Demo hint: the code is 123456."); return; }
    setOtpBusy(true);
    await new Promise(r => setTimeout(r, 500));
    setOtpBusy(false);
    setShowMfa(false);
    setCurrentUser(pendingUser);
    // FIX: replace (was navigate) — back button must not return to Login/MFA after entry
    navigation.replace("Directive");
  };

  const forgotPassword = () => {
    Alert.alert("Forgot Password", "Contact your HR or Admin to reset your password.\n\n📞 +91 89519 37171\n📧 admin@peesteegroup.com\n\nDemo: all accounts use password123");
  };

  return (
    <Screen bg={theme.navyDeep}>
      <Modal visible={showMfa} transparent animationType="slide" onRequestClose={() => setShowMfa(false)}>
        <View style={{ flex: 1, backgroundColor: "rgba(11,21,38,0.7)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 26, paddingBottom: 40 }}>
            <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 16 }} />
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
              <Text style={{ fontSize: 26 }}>🔐</Text>
            </View>
            <Text style={{ fontWeight: "800", fontSize: 19, textAlign: "center", marginTop: 12, color: theme.navy }}>MFA Verification</Text>
            <Text style={{ textAlign: "center", color: theme.muted, fontSize: 12, marginTop: 4 }}>6-digit OTP sent to your registered mobile</Text>
            <TextInput value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholder="••••••" placeholderTextColor="#CBD5E1"
              style={{ borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 14, marginTop: 18, letterSpacing: 10, textAlign: "center", fontSize: 22, fontWeight: "800", backgroundColor: "#FAFBFD", color: theme.text }} />
            <Text style={{ textAlign: "center", color: theme.faint, fontSize: 11, marginTop: 6 }}>Demo OTP: 123456</Text>
            <View style={{ marginTop: 14 }}>
              {otpBusy ? <ActivityIndicator color={theme.navy} /> : <PrimaryButton title="Verify & Continue" onPress={verifyOtp} />}
            </View>
            <PressableScale onPress={() => Alert.alert("OTP Resent (demo)", "Your demo OTP is 123456.")}>
              <Text style={{ color: theme.navy, fontSize: 13, textAlign: "center", marginTop: 12, fontWeight: "700" }}>Resend OTP</Text>
            </PressableScale>
            <PressableScale onPress={() => setShowMfa(false)}>
              <Text style={{ color: theme.muted, fontSize: 12, textAlign: "center", marginTop: 8 }}>✕ Cancel</Text>
            </PressableScale>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }} keyboardShouldPersistTaps="handled">
        <Reveal>
          <View style={{ alignItems: "center", marginBottom: 22 }}>
            <View style={{ width: 84, height: 84, borderRadius: 24, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 10 }}>
              <Image source={require("../../assets/logo.png")} style={{ width: 64, height: 64 }} resizeMode="contain" />
            </View>
            <Text style={{ fontWeight: "800", fontSize: 24, color: "#fff", marginTop: 14 }}>Welcome Back</Text>
            <Text style={{ color: "#8EA0BF", fontSize: 13 }}>PEES Tee Employee App · MFA secured</Text>
          </View>
        </Reveal>
        <Reveal delay={120}>
          <View style={{ backgroundColor: "#fff", borderRadius: 24, padding: 20 }}>
            <Text style={{ fontWeight: "800", fontSize: 17, color: theme.navy }}>Staff Sign In</Text>
            <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>Admin-provisioned accounts only</Text>
            <Text style={{ fontWeight: "700", marginTop: 16, color: theme.navy, fontSize: 13 }}>Employee ID / Phone</Text>
            <TextInput value={id} onChangeText={setId} style={[input, { marginTop: 6 }]} placeholder="EMP00125 or phone" placeholderTextColor="#94A3B8" autoCapitalize="none" />
            <Text style={{ fontWeight: "700", marginTop: 14, color: theme.navy, fontSize: 13 }}>Password</Text>
            <TextInput value={pw} onChangeText={setPw} secureTextEntry style={[input, { marginTop: 6 }]} placeholder="••••••••" placeholderTextColor="#94A3B8" />
            <View style={{ marginTop: 18 }}>
              {busy ? (
                <View style={{ backgroundColor: theme.gold, padding: 15, borderRadius: 14, alignItems: "center" }}>
                  <ActivityIndicator color={theme.navyDeep} />
                </View>
              ) : <PrimaryButton title="Login  →" onPress={doLogin} />}
            </View>
            <PressableScale onPress={forgotPassword}>
              <Text style={{ color: theme.muted, textAlign: "center", marginTop: 14, fontSize: 13 }}>Forgot Password?</Text>
            </PressableScale>
            <View style={{ backgroundColor: "#F8FAFC", borderRadius: 12, padding: 11, marginTop: 14 }}>
              <Text style={{ fontSize: 11, color: theme.muted, textAlign: "center" }}>🔐 MFA via OTP after login · No self-registration</Text>
            </View>
          </View>
        </Reveal>
        <Reveal delay={220}>
          <Text style={{ textAlign: "center", color: "#5B6B8C", fontSize: 11, marginTop: 18 }}>Demo: EMP00125 / password123 · OTP 123456</Text>
        </Reveal>
      </ScrollView>
    </Screen>
  );
}
