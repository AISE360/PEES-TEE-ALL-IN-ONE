import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { theme } from "../theme";

export default function PaymentSuccess({navigation, route}:any){
  const ref = route?.params?.referenceNo || "PT48213";
  const copy = async()=>{
    await Clipboard.setStringAsync(ref);
    Alert.alert("Copied", `Reference ${ref} copied to clipboard.`);
  };
  return (
    <View style={{flex:1, backgroundColor: theme.bg, padding:20, justifyContent:"center", alignItems:"center"}}>
      <View style={{backgroundColor:"#fff", borderRadius:16, padding:24, alignItems:"center", width:"100%", borderWidth:1, borderColor:"#E2E8F0"}}>
        <View style={{width:64,height:64, borderRadius:32, backgroundColor:"#0E9F6E", alignItems:"center", justifyContent:"center"}}>
          <Text style={{color:"#fff", fontSize:32}}>✓</Text>
        </View>
        <Text style={{fontWeight:"800", fontSize:20, color:theme.navy, marginTop:14}}>Success!</Text>
        <Text style={{color:theme.muted, textAlign:"center", marginTop:4}}>Application submitted and saved successfully.</Text>

        <Text style={{color:theme.muted, fontSize:12, marginTop:18}}>Reference Number</Text>
        <TouchableOpacity onPress={copy} style={{flexDirection:"row", alignItems:"center", marginTop:6, backgroundColor:"#F1F5F9", paddingHorizontal:18, paddingVertical:10, borderRadius:12}}>
          <Text style={{fontWeight:"900", fontSize:20, color:theme.navy, letterSpacing:1}}>{ref}</Text>
          <Text style={{marginLeft:8, fontSize:16}}>📋</Text>
        </TouchableOpacity>
        <Text style={{color:theme.muted, fontSize:11, textAlign:"center", marginTop:10}}>Tap reference to copy to clipboard.</Text>

        <TouchableOpacity onPress={()=> navigation.navigate("KYC")} style={{borderWidth:1, borderColor:theme.gold, padding:12, borderRadius:10, alignItems:"center", marginTop:20, alignSelf:"stretch"}}>
          <Text style={{fontWeight:"700", color:theme.navy}}>+ New Application</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> navigation.navigate("Dashboard")} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:10, alignSelf:"stretch"}}>
          <Text style={{fontWeight:"700", color:theme.navy}}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
