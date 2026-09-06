import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Card, PrimaryButton } from "../components/UI";
import { theme } from "../theme";

export default function Login({navigation}:any){
  const [phone,setPhone]=useState("98765 43210");
  const [otp,setOtp]=useState("");
  const [step,setStep]=useState<"phone"|"otp">("phone");
  const sendOtp = async()=>{
    // call /api/auth/send-otp (mock)
    setStep("otp");
  };
  const verify = async()=>{
    if(otp.length<6) return Alert.alert("Enter 6-digit OTP (mock 123456)");
    navigation.replace("Home");
  };
  return (
    <View style={{flex:1, backgroundColor: theme.bg, padding:20, justifyContent:"center"}}>
      <View style={{alignItems:"center", marginBottom:24}}><Text style={{fontWeight:"800", fontSize:20, color:theme.navy}}>Welcome</Text><Text style={{color:theme.muted}}>Enter your phone number to continue</Text></View>
      {step==="phone" ? (
        <Card>
          <Text style={{fontWeight:"600", color:theme.navy, marginBottom:8}}>Phone Number</Text>
          <View style={{flexDirection:"row", alignItems:"center", borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, paddingHorizontal:12}}>
            <Text style={{fontWeight:"700", marginRight:8}}>+91</Text><TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{flex:1, paddingVertical:14}} />
          </View>
          <View style={{height:14}}/><PrimaryButton title="Send OTP" onPress={sendOtp} />
          <Text style={{textAlign:"center", color:theme.muted, marginVertical:12}}>Or continue with</Text>
          <TouchableOpacity style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:12, alignItems:"center"}}><Text>🔒  Password Login</Text></TouchableOpacity>
          <Text style={{textAlign:"center", color:"#94A3B8", fontSize:12, marginTop:12}}>By continuing, you agree to our Terms & Privacy Policy</Text>
        </Card>
      ): (
        <Card>
          <Text style={{fontWeight:"700", fontSize:16, color:theme.navy}}>Enter OTP</Text><Text style={{color:theme.muted}}>Sent to +91 {phone} (mock 123456)</Text>
          <TextInput value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholder="6-digit code" style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:12, padding:14, marginTop:16, letterSpacing:8, textAlign:"center", fontSize:18}} />
          <View style={{height:14}}/><PrimaryButton title="Verify & Continue" onPress={verify} />
          <TouchableOpacity onPress={()=>setStep("phone")} style={{alignItems:"center", marginTop:12}}><Text style={{color:theme.navy}}>Resend OTP</Text></TouchableOpacity>
        </Card>
      )}
    </View>
  );
}
