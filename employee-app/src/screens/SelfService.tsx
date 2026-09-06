import React, {useCallback, useState} from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { theme } from "../theme";
import { getLeaves, getSalarySlips, getShifts, clockOut, leaveBalance } from "../storage/demoStore";
import { getCurrentUser, clearSession } from "../storage/auth";

export default function SelfService({navigation}:any){
  const [counts,setCounts]=useState({leaves:0, slips:0, shifts:0});
  const user = getCurrentUser();
  const initials = user?.name ? user.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2) : "RK";
  const displayName = user?.name || "Rajesh Kumar";
  const displayRole = user?.role ? user.role.replace("_"," ") : "Field Executive";
  const displayId = user?.employeeId || "EMP00125";

  useFocusEffect(useCallback(()=>{
    (async()=>{
      const [l,s,sh]=await Promise.all([getLeaves(), getSalarySlips(), getShifts()]);
      setCounts({leaves:l.length, slips:s.length, shifts:sh.length});
    })();
  },[]));

  const rows: {label:string; hint:string; fn:()=>void}[] = [
    {label:"My Profile", hint:displayName, fn:()=>Alert.alert("My Profile",`${displayName}\n${displayRole} • ${displayId}\n+91 ${user?.phone||"8888888888"}\nHBR Layout HO site`)},
    {label:"Leave Application", hint:`${counts.leaves} request(s)`, fn:()=>navigation.navigate("Leave")},
    {label:"Leave Balance", hint:`${leaveBalance()} Days`, fn:()=>navigation.navigate("Leave")},
    {label:"Salary Slips", hint:`${counts.slips} slip(s)`, fn:()=>navigation.navigate("Salary")},
    {label:"Shift History", hint:`${counts.shifts} shift(s)`, fn:()=>navigation.navigate("ClockIn")},
    {label:"My Clients", hint:"View", fn:()=>navigation.navigate("Clients")},
    {label:"End-of-Day Reports", hint:"Submit", fn:()=>navigation.navigate("Reports")},
  ];

  const logout = ()=>{
    Alert.alert("Secure logout?","This terminates the GPS/telemetry session and ends your auth session.",[
      { text:"Cancel", style:"cancel" },
      { text:"Logout", style:"destructive", onPress: async()=>{
        await clockOut();
        clearSession();
        Alert.alert("Logged out","Telemetry terminated + auth ended.");
        navigation.replace("Login");
      }},
    ]);
  };

  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:12}}>
        {navigation?.canGoBack() && (
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
            <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>Self Service & Profile</Text>
      </View>

      <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, flexDirection:"row", alignItems:"center", borderWidth:1, borderColor:"#E2E8F0", marginTop:4}}>
        <View style={{width:52,height:52, borderRadius:26, backgroundColor:theme.navy, alignItems:"center", justifyContent:"center"}}>
          <Text style={{color:"#fff", fontWeight:"800", fontSize:18}}>{initials}</Text>
        </View>
        <View style={{marginLeft:14}}>
          <Text style={{fontWeight:"800", color:theme.navy, fontSize:16}}>{displayName}</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>{displayRole} • {displayId}</Text>
        </View>
      </View>

      <View style={{marginTop:16}}>
        {rows.map(r=>(
          <TouchableOpacity key={r.label} onPress={r.fn} style={{backgroundColor:"#fff", borderRadius:12, padding:16, flexDirection:"row", justifyContent:"space-between", marginTop:10, alignItems:"center", borderWidth:1, borderColor:"#E2E8F0"}}>
            <Text style={{fontWeight:"600", color:theme.navy}}>{r.label}</Text>
            <Text style={{color:theme.muted, fontSize:13}}>{r.hint} →</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={logout} style={{backgroundColor:"#fff", borderRadius:12, padding:16, marginTop:16, flexDirection:"row", alignItems:"center", justifyContent:"center", borderWidth:1, borderColor:"#FCA5A5"}}>
        <Text style={{color:"#E02424", fontWeight:"700"}}>Logout — terminates telemetry session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
