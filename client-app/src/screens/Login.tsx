import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, Image } from "react-native";
import { Card, PrimaryButton, Reveal, Screen } from "../components/UI";
import { theme } from "../theme";

const DEMO_PASSWORD = "demo123";

function Field({ label, children }: any) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ fontWeight: "700", color: theme.navy, fontSize: 13, marginBottom: 6 }}>{label}</Text>
      {children}
    </View>
  );
}

export default function Login({ navigation }: any) {
  const [phone, setPhone] = useState("98765 43210");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"otp" | "password">("otp");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [busy, setBusy] = useState(false);
  const input = { borderWidth: 1, borderColor: theme.line, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, backgroundColor: "#FAFBFD", color: theme.text };

  const sendOtp = async () => {
    if (phone.replace(/\D/g, "").length < 10) return Alert.alert("Invalid number", "Please enter a valid 10-digit mobile number.");
    setBusy(true);
    setTimeout(() => { setBusy(false); setStep("otp"); Alert.alert("OTP sent (demo)", "Your demo OTP is 123456"); }, 800);
  };
  const verify = async () => {
    if (otp.trim().length < 6) return Alert.alert("Enter OTP", "Please enter the 6-digit OTP (demo: 123456).");
    if (otp.trim() !== "123456") return Alert.alert("Wrong OTP", "Hint for demo: the code is 123456.");
    navigation.replace("Home");
  };
  const passwordLogin = async () => {
    if (password !== DEMO_PASSWORD) return Alert.alert("Wrong password", `Hint for demo: the password is ${DEMO_PASSWORD}.`);
    navigation.replace("Home");
  };

  return (
    <Screen bg={theme.navyDeep}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 20 }} keyboardShouldPersistTaps="handled">
        <Reveal>
          <View style={{ alignItems: "center", marginBottom: 22 }}>
            <View style={{ width: 84, height: 84, borderRadius: 24, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 10 }}>
              <Image source={require("../../assets/logo.png")} style={{ width: 64, height: 64 }} resizeMode="contain" />
            </View>
            <Text style={{ fontWeight: "800", fontSize: 24, color: "#fff", marginTop: 14 }}>Welcome to PEES Tee</Text>
            <Text style={{ color: "#8EA0BF", marginTop: 4, fontSize: 13 }}>Land · Documentation · Logistics — one app</Text>
          </View>
        </Reveal>
        <Reveal delay={120}>
          <Card>
            {mode === "otp" && step === "phone" && (
              <>
                <Text style={{ fontWeight: "800", fontSize: 17, color: theme.navy }}>Login with OTP</Text>
                <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>We'll text a 6-digit code to your mobile</Text>
                <Field label="Mobile Number">
                  <View style={{ flexDirection: "row", alignItems: "center", ...input, paddingVertical: 0 }}>
                    <Text style={{ fontWeight: "800", marginRight: 8, color: theme.navy }}>+91</Text>
                    <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={13} style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: theme.text }} />
                  </View>
                </Field>
                <View style={{ height: 16 }} />
                {busy ? <ActivityIndicator color={theme.navy} /> : <PrimaryButton title="Send OTP" onPress={sendOtp} />}
                <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 14 }}>
                  <View style={{ flex: 1, height: 1, backgroundColor: theme.line }} />
                  <Text style={{ color: theme.faint, marginHorizontal: 10, fontSize: 11 }}>OR</Text>
                  <View style={{ flex: 1, height: 1, backgroundColor: theme.line }} />
                </View>
                <TouchableOpacity onPress={() => setMode("password")} style={{ borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 13, alignItems: "center" }}>
                  <Text style={{ fontWeight: "700", color: theme.navy }}>🔑 Password Login</Text>
                </TouchableOpacity>
              </>
            )}
            {mode === "otp" && step === "otp" && (
              <>
                <Text style={{ fontWeight: "800", fontSize: 17, color: theme.navy }}>Enter OTP</Text>
                <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>Sent to +91 {phone} · demo: 123456</Text>
                <TextInput value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholder="••••••" placeholderTextColor="#CBD5E1"
                  style={{ borderWidth: 1, borderColor: theme.line, borderRadius: 12, padding: 14, marginTop: 16, letterSpacing: 10, textAlign: "center", fontSize: 22, fontWeight: "800", backgroundColor: "#FAFBFD", color: theme.text }} />
                <View style={{ height: 14 }} />
                <PrimaryButton title="Verify & Continue" onPress={verify} />
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 14 }}>
                  <TouchableOpacity onPress={() => Alert.alert("OTP resent (demo)", "Your demo OTP is 123456")}>
                    <Text style={{ color: theme.navy, fontWeight: "700", fontSize: 13 }}>Resend OTP</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { setStep("phone"); setOtp(""); }}>
                    <Text style={{ color: theme.muted, fontSize: 13 }}>Change number</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            {mode === "password" && (
              <>
                <Text style={{ fontWeight: "800", fontSize: 17, color: theme.navy }}>Password Login</Text>
                <Text style={{ color: theme.muted, fontSize: 12, marginTop: 2 }}>+91 {phone} · demo: {DEMO_PASSWORD}</Text>
                <Field label="Password">
                  <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter password" placeholderTextColor="#94A3B8" style={input} />
                </Field>
                <View style={{ height: 16 }} />
                <PrimaryButton title="Login" onPress={passwordLogin} />
                <TouchableOpacity onPress={() => setMode("otp")} style={{ alignItems: "center", marginTop: 14 }}>
                  <Text style={{ color: theme.navy, fontWeight: "700", fontSize: 13 }}>← Back to OTP login</Text>
                </TouchableOpacity>
              </>
            )}
            <Text style={{ textAlign: "center", color: theme.faint, fontSize: 11, marginTop: 16 }}>By continuing, you agree to our Terms & Privacy Policy</Text>
          </Card>
        </Reveal>
        <Reveal delay={220}>
          <Text style={{ textAlign: "center", color: "#5B6B8C", fontSize: 11, marginTop: 18 }}>📞 +91 89519 37171 · info@peesteegroup.com</Text>
        </Reveal>
      </ScrollView>
    </Screen>
  );
}
