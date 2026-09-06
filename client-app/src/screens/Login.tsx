import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { Card, PrimaryButton } from "../components/UI";
import { theme } from "../theme";

const DEMO_PASSWORD = "demo123";

export default function Login({navigation}:any){
  const [phone,setPhone]=useState("98765 43210");
  const [otp,setOtp]=useState("");
  const [password,setPassword]=useState("");
  const [mode,setMode]=useState<"otp"|"password">("otp");
  const [step,setStep]=useState<"phone"|"otp">("phone");
  const [busy,setBusy]=useState(false);

  const sendOtp = async()=>{
    if(phone.replace(/\D/g,"").length < 10) return Alert.alert("Invalid number","Please enter a valid 10-digit mobile number.");
    setBusy(true);
    setTimeout(()=>{ setBusy(false); setStep("otp"); Alert.alert("OTP sent (demo)","Your demo OTP is 123456"); }, 800);
  };
  const verify = async()=>{
    if(otp.trim().length<6) return Alert.alert("Enter OTP","Please enter the 6-digit OTP (demo: 123456).");
    if(otp.trim()!=="123456") return Alert.alert("Wrong OTP","Hint for demo: the code is 123456.");
    navigation.replace("Home");
  };
  const passwordLogin = async()=>{
    if(password!==DEMO_PASSWORD) return Alert.alert("Wrong password",`Hint for demo: the password is ${DEMO_PASSWORD}.`);
    navigation.replace("Home");
  };

  return (
    <View style={{flex:1, backgroundColor: theme.bg, padding:20, justifyContent:"center"}}>
      <View style={{alignItems:"center", marginBottom:24}}>
        <Text style={{fontWeight:"800", fontSize:22, color:theme.navy}}>Welcome to PEES Tee</Text>
        <Text style={{color:theme.muted, marginTop:4}}>Enter your phone number to continue</Text>
      </View>
      {mode==="otp" && step==="phone" && (
        <Card>
          <Text style={{fontWeight:"600", color:theme.navy, marginBottom:8}}>Mobile Number</Text>
          <View style={{flexDirection:"row", alignItems:"center", borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, paddingHorizontal:12}}>
            <Text style={{fontWeight:"700", marginRight:8, color:theme.navy}}>+91</Text>
            <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" maxLength={13} style={{flex:1, paddingVertical:14, fontSize:15}} />
          </View>
          <View style={{height:14}}/>
          {busy ? <ActivityIndicator color={theme.navy}/> : <PrimaryButton title="Send OTP" onPress={sendOtp} />}
          <Text style={{textAlign:"center", color:theme.muted, marginVertical:14, fontSize:12}}>Or continue with</Text>
          <TouchableOpacity onPress={()=>setMode("password")} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12, alignItems:"center"}}>
            <Text style={{fontWeight:"600", color:theme.navy}}>🔑 Password Login</Text>
          </TouchableOpacity>
          <Text style={{textAlign:"center", color:"#94A3B8", fontSize:11, marginTop:14}}>By continuing, you agree to our Terms & Privacy Policy</Text>
        </Card>
      )}
      {mode==="otp" && step==="otp" && (
        <Card>
          <Text style={{fontWeight:"700", fontSize:16, color:theme.navy}}>Enter OTP</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>Sent to +91 {phone} (demo OTP: 123456)</Text>
          <TextInput value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholder="••••••" style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:14, marginTop:16, letterSpacing:8, textAlign:"center", fontSize:20}} />
          <View style={{height:14}}/>
          <PrimaryButton title="Verify & Continue" onPress={verify} />
          <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:14}}>
            <TouchableOpacity onPress={()=>{Alert.alert("OTP resent (demo)","Your demo OTP is 123456");}}>
              <Text style={{color:theme.navy, fontWeight:"600", fontSize:13}}>Resend OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{setStep("phone"); setOtp("");}}>
              <Text style={{color:theme.muted, fontSize:13}}>Change number</Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}
      {mode==="password" && (
        <Card>
          <Text style={{fontWeight:"700", fontSize:16, color:theme.navy}}>Password Login</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>+91 {phone} (demo password: {DEMO_PASSWORD})</Text>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter password" style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:14, marginTop:16, fontSize:15}} />
          <View style={{height:14}}/>
          <PrimaryButton title="Login" onPress={passwordLogin} />
          <TouchableOpacity onPress={()=>setMode("otp")} style={{alignItems:"center", marginTop:14}}>
            <Text style={{color:theme.navy, fontWeight:"600", fontSize:13}}>← Back to OTP login</Text>
          </TouchableOpacity>
        </Card>
      )}
    </View>
  );
}
