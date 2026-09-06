import React, {useState} from "react";
import { View, Text, TouchableOpacity, Alert, Image } from "react-native";
import { theme } from "../theme";
export default function ClockIn({navigation}:any){
  const [ok,setOk]=useState(true);
  return (
    <View style={{flex:1, backgroundColor: theme.bg, padding:16}}>
      <Text style={{fontWeight:"800", fontSize:18, color:theme.navy, textAlign:"center"}}>Clock In</Text>
      <View style={{height:180, backgroundColor:"#E0E7FF", borderRadius:16, marginTop:16, alignItems:"center", justifyContent:"center"}}><Text style={{fontSize:40}}>🗺️</Text><Text style={{color:theme.muted, marginTop:8}}>Map - assigned geofence 500m</Text></View>
      <View style={{backgroundColor: ok?"#DEF7EC":"#FEE2E2", borderRadius:12, padding:12, flexDirection:"row", alignItems:"center", marginTop:12}}>
        <Text>{ok?"✅":"⚠️"}</Text><Text style={{marginLeft:8, color: ok?"#0E9F6E":"#E02424", fontWeight:"700"}}>{ok?"You are within the assigned location (Office - Koramangala)":"Outside geofence - move closer"}</Text>
      </View>
      <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, alignItems:"center", marginTop:16}}>
        <Text style={{fontWeight:"700", color:theme.navy}}>Capture Selfie</Text><Text style={{color:theme.muted, fontSize:12}}>Front camera only - no gallery for this step</Text>
        <View style={{width:100,height:100, borderRadius:50, backgroundColor:"#E2E8F0", marginTop:12, alignItems:"center", justifyContent:"center"}}><Text style={{fontSize:40}}>🧑</Text></View>
        <TouchableOpacity style={{borderWidth:1, borderColor:theme.gold, borderRadius:10, paddingHorizontal:16, paddingVertical:8, marginTop:12}}><Text>📷 Capture</Text></TouchableOpacity>
      </View>
      <TouchableOpacity disabled={!ok} onPress={()=> {Alert.alert("Clocked In","GPS tracking started. Active Duty badge active."); navigation.goBack();}} style={{backgroundColor: ok? theme.gold : "#D1D5DB", padding:14, borderRadius:12, alignItems:"center", marginTop:20}}><Text style={{fontWeight:"700"}}>Clock In</Text></TouchableOpacity>
      <Text style={{fontSize:11, color:theme.muted, textAlign:"center", marginTop:8}}>Continuous GPS tracking + portal live map while on shift. Restricted to HR/Supervisor/Manager.</Text>
    </View>
  );
}
