import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { theme } from "../theme";
export default function SelfService(){
  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center"}}>
        <View style={{width:48,height:48, borderRadius:24, backgroundColor:"#E2E8F0", alignItems:"center", justifyContent:"center"}}><Text>👤</Text></View>
        <View style={{marginLeft:12}}><Text style={{fontWeight:"800", color:theme.navy}}>Rajesh Kumar</Text><Text style={{color:theme.muted, fontSize:12}}>Field Executive • EMP00125</Text></View>
      </View>
      {[
        ["My Profile","›"],
        ["Leave Application","›"],
        ["Leave Balance","12 Days"],
        ["Salary Slips","›"],
        ["Shift History","›"],
        ["Settings","›"],
      ].map(([a,b])=>(<View key={a} style={{backgroundColor:"#fff", borderRadius:12, padding:16, flexDirection:"row", justifyContent:"space-between", marginTop:10}}><Text>{a}</Text><Text style={{color:theme.muted}}>{b}</Text></View>))}
      <TouchableOpacity onPress={()=> Alert.alert("Logged out","Telemetry terminated + auth ended")} style={{backgroundColor:"#fff", borderRadius:12, padding:16, marginTop:12, flexDirection:"row", alignItems:"center"}}><Text style={{color:"#E02424"}}>Logout — terminates GPS/telemetry session</Text></TouchableOpacity>
      <View style={{backgroundColor:"#fff", borderRadius:12, padding:16, marginTop:12}}>
        <Text style={{fontWeight:"700"}}>End-of-Day Shift Submission</Text><Text style={{color:theme.muted, fontSize:12}}>Activity logs, collections summary, progress notes</Text>
        <TouchableOpacity style={{backgroundColor: theme.gold, padding:12, borderRadius:10, alignItems:"center", marginTop:12}}><Text style={{fontWeight:"700"}}>Submit Report</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );
}
