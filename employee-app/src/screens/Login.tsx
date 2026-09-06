import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, Modal } from "react-native";
import { theme } from "../theme";
import { attemptLogin, setCurrentUser } from "../storage/auth";

const DEMO_OTP = "123456";

export default function Login({navigation}:any){
  const [id,setId]=useState("EMP00125");
  const [pw,setPw]=useState("password123");
  const [busy,setBusy]=useState(false);
  const [showMfa,setShowMfa]=useState(false);
  const [otp,setOtp]=useState("");
  const [otpBusy,setOtpBusy]=useState(false);
  const [pendingUser,setPendingUser]=useState<any>(null);

  const doLogin = async()=>{
    if(!id.trim()){ Alert.alert("Missing ID","Please enter your Employee ID or phone number."); return; }
    if(!pw.trim()){ Alert.alert("Missing Password","Please enter your password."); return; }
    setBusy(true);
    // Simulate network delay
    await new Promise(r=>setTimeout(r,700));
    const user = attemptLogin(id.trim(), pw.trim());
    setBusy(false);
    if(!user){
      Alert.alert("Login failed","Employee ID or password is incorrect.\n\nDemo credentials:\nID: EMP00125\nPassword: password123");
      return;
    }
    setPendingUser(user);
    setOtp("");
    setShowMfa(true);
    Alert.alert("OTP Sent (demo)","Your demo MFA code is 123456. Check your registered mobile.");
  };

  const verifyOtp = async()=>{
    if(otp.trim().length < 6){ Alert.alert("Enter OTP","Please enter the 6-digit OTP."); return; }
    if(otp.trim() !== DEMO_OTP){
      Alert.alert("Wrong OTP","Incorrect OTP. Demo hint: the code is 123456.");
      return;
    }
    setOtpBusy(true);
    await new Promise(r=>setTimeout(r,500));
    setOtpBusy(false);
    setShowMfa(false);
    setCurrentUser(pendingUser);
    navigation.navigate("Directive");
  };

  const forgotPassword = ()=>{
    Alert.alert(
      "Forgot Password",
      "Contact your HR or Admin to reset your password.\n\n📞 +91 (080) 41289652\n📧 admin@peesteegroup.com\n\nDemo: all accounts use password123"
    );
  };

  return (
    <View style={{flex:1, backgroundColor: theme.bg, padding:20, justifyContent:"center"}}>
      {/* MFA Modal */}
      <Modal visible={showMfa} transparent animationType="fade" onRequestClose={()=>setShowMfa(false)}>
        <View style={{flex:1, backgroundColor:"rgba(15,36,64,0.85)", justifyContent:"center", padding:24}}>
          <View style={{backgroundColor:"#fff", borderRadius:16, padding:24}}>
            <View style={{width:48,height:48, borderRadius:24, backgroundColor:"#FEF3C7", alignItems:"center", justifyContent:"center", alignSelf:"center"}}>
              <Text style={{fontSize:22}}>🔐</Text>
            </View>
            <Text style={{fontWeight:"800", fontSize:16, textAlign:"center", marginTop:12, color:theme.navy}}>MFA Verification</Text>
            <Text style={{textAlign:"center", color:theme.muted, fontSize:12, marginTop:4}}>Enter the 6-digit OTP sent to your registered mobile</Text>
            <TextInput
              value={otp} onChangeText={setOtp}
              keyboardType="number-pad" maxLength={6}
              placeholder="••••••"
              style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:14, marginTop:16, letterSpacing:8, textAlign:"center", fontSize:20}}
            />
            <Text style={{textAlign:"center", color:"#94A3B8", fontSize:11, marginTop:6}}>Demo OTP: 123456</Text>
            {otpBusy ? <ActivityIndicator style={{marginTop:16}} color={theme.navy}/> : (
              <TouchableOpacity onPress={verifyOtp} style={{backgroundColor:theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:12}}>
                <Text style={{fontWeight:"800", color:theme.navy}}>Verify & Continue</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={()=>Alert.alert("OTP Resent (demo)","Your demo OTP is 123456.")} style={{alignItems:"center", marginTop:10}}>
              <Text style={{color:theme.navy, fontSize:13}}>Resend OTP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setShowMfa(false)} style={{alignItems:"center", marginTop:6}}>
              <Text style={{color:theme.muted, fontSize:12}}>✕ Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{alignItems:"center", marginBottom:20}}>
        <Image source={require("../../assets/logo.png")} style={{width:180, height:133}} resizeMode="contain" />
        <Text style={{fontWeight:"800", fontSize:20, color:theme.navy, marginTop:8}}>Welcome Back</Text>
        <Text style={{color:theme.muted}}>PEES Tee Employee App</Text>
      </View>
      <View style={{backgroundColor:"#fff", borderRadius:16, padding:16}}>
        <Text style={{fontWeight:"600"}}>Employee ID / Phone</Text>
        <TextInput value={id} onChangeText={setId} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:8}} placeholder="Enter employee ID or phone"/>
        <Text style={{fontWeight:"600", marginTop:12}}>Password</Text>
        <TextInput value={pw} onChangeText={setPw} secureTextEntry style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:8}}/>
        {busy ? (
          <View style={{backgroundColor:theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:16}}>
            <ActivityIndicator color={theme.navy}/>
          </View>
        ) : (
          <TouchableOpacity onPress={doLogin} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:16}}>
            <Text style={{fontWeight:"700", color:theme.navy}}>Login</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={forgotPassword} style={{alignItems:"center", marginTop:12}}>
          <Text style={{color:theme.muted}}>Forgot Password?</Text>
        </TouchableOpacity>
        <Text style={{fontSize:11, color:"#94A3B8", textAlign:"center", marginTop:12}}>MFA via OTP will be required after login. Admin provisioned only — no self-registration.</Text>
      </View>
    </View>
  );
}
