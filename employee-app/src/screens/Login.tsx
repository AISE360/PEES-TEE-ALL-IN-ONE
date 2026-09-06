import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { theme } from "../theme";
export default function Login({navigation}:any){
  const [id,setId]=useState("EMP00125"); const [pw,setPw]=useState("password123");
  return (
    <View style={{flex:1, backgroundColor: theme.bg, padding:20, justifyContent:"center"}}>
      <View style={{alignItems:"center", marginBottom:20}}>
        <Image source={require("../../assets/logo.png")} style={{width:180, height:133}} resizeMode="contain" />
        <Text style={{fontWeight:"800", fontSize:20, color:theme.navy, marginTop:8}}>Welcome Back</Text><Text style={{color:theme.muted}}>PEES Tee Employee App</Text>
      </View>
      <View style={{backgroundColor:"#fff", borderRadius:16, padding:16}}>
        <Text style={{fontWeight:"600"}}>Employee ID / Phone</Text><TextInput value={id} onChangeText={setId} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:8}} placeholder="Enter employee ID or phone"/>
        <Text style={{fontWeight:"600", marginTop:12}}>Password</Text><TextInput value={pw} onChangeText={setPw} secureTextEntry style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:8}}/>
        <TouchableOpacity onPress={()=> navigation.navigate("Directive")} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:16}}><Text style={{fontWeight:"700", color:theme.navy}}>Login</Text></TouchableOpacity>
        <TouchableOpacity style={{alignItems:"center", marginTop:12}}><Text style={{color:theme.muted}}>Forgot Password?</Text></TouchableOpacity>
        <Text style={{fontSize:11, color:"#94A3B8", textAlign:"center", marginTop:12}}>MFA via OTP (123456) or fingerprint will be requested next. No self-registration — admin provisioned only.</Text>
      </View>
    </View>
  );
}
