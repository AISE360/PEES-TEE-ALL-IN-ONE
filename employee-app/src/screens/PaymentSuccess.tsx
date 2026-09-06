import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { theme } from "../theme";
export default function PaymentSuccess({navigation, route}:any){
  const ref = route?.params?.referenceNo || "PT48213";
  return (
    <View style={{flex:1, backgroundColor: theme.bg, padding:20, justifyContent:"center", alignItems:"center"}}>
      <View style={{backgroundColor:"#fff", borderRadius:16, padding:24, alignItems:"center", width:"100%"}}>
        <View style={{width:64,height:64, borderRadius:32, backgroundColor:"#0E9F6E", alignItems:"center", justifyContent:"center"}}><Text style={{color:"#fff", fontSize:32}}>✓</Text></View>
        <Text style={{fontWeight:"800", fontSize:18, color:theme.navy, marginTop:12}}>Success!</Text><Text style={{color:theme.muted, textAlign:"center"}}>Your application has been submitted (saved offline).</Text>
        <Text style={{color:theme.muted, fontSize:12, marginTop:16}}>Reference Number</Text><View style={{flexDirection:"row", alignItems:"center", marginTop:4}}><Text style={{fontWeight:"900", fontSize:20, color:theme.navy}}>{ref}</Text><Text style={{marginLeft:8}}>📋</Text></View>
        <Text style={{color:theme.muted, fontSize:11, textAlign:"center", marginTop:12}}>Demo mode: stored in local storage on this device. No SMS sent.</Text>
        <TouchableOpacity onPress={()=> navigation.navigate("Dashboard")} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:20, alignSelf:"stretch"}}><Text style={{fontWeight:"700"}}>Back to Dashboard</Text></TouchableOpacity>
      </View>
    </View>
  );
}
