import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { theme } from "../theme";
export default function Directive({navigation}:any){
  return (
    <View style={{flex:1, backgroundColor:"rgba(15,36,64,0.85)", justifyContent:"center", padding:20}}>
      <View style={{backgroundColor:"#fff", borderRadius:16, padding:20}}>
        <View style={{width:48,height:48, borderRadius:24, backgroundColor:"#FEF3C7", alignItems:"center", justifyContent:"center", alignSelf:"center"}}><Text style={{fontSize:22}}>📢</Text></View>
        <Text style={{fontWeight:"800", fontSize:16, textAlign:"center", marginTop:12, color:theme.navy}}>Today's Shift Instructions</Text><Text style={{textAlign:"center", color:theme.muted, fontSize:12}}>5 Sep 2026</Text>
        <View style={{marginTop:16}}>
          <Text style={{color:theme.navy}}>• Visit assigned sites as per schedule.</Text>
          <Text>• Ensure complete KYC capture.</Text>
          <Text>• Maintain professionalism with clients.</Text>
          <Text>• Submit end-of-day report.</Text>
          <Text>• Stay within assigned geofence areas.</Text>
        </View>
        <TouchableOpacity onPress={()=> navigation.replace("Dashboard")} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:20}}><Text style={{fontWeight:"700"}}>Got it</Text></TouchableOpacity>
      </View>
    </View>
  );
}
