import React, {useCallback, useState} from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { theme } from "../theme";
import { getActiveShift, clockOut } from "../storage/demoStore";
import { getCurrentUser } from "../storage/auth";

const tiles = [
  {label:"Clock In", sub:"Start your shift", icon:"⏱️", to:"ClockIn"},
  {label:"KYC Enrolment", sub:"New application", icon:"📝", to:"KYC"},
  {label:"My Clients", sub:"View & manage", icon:"👥", to:"Clients"},
  {label:"Leave", sub:"Apply for leave", icon:"🏖️", to:"Leave"},
  {label:"Salary Slips", sub:"View & download", icon:"💵", to:"Salary"},
  {label:"Reports", sub:"End of day", icon:"📊", to:"Reports"},
];

export default function Dashboard({navigation}:any){
  const [active,setActive]=useState<any>(null);
  const user = getCurrentUser();
  const displayName = user?.name || "Rajesh Kumar";
  const displayRole = user?.role ? user.role.replace("_"," ") : "Field Executive";
  const displayId = user?.employeeId || "EMP00125";
  useFocusEffect(useCallback(()=>{ getActiveShift().then(setActive); },[]));

  const doClockOut = async()=>{
    Alert.alert("Clock out?","GPS tracking will stop for this shift.",[
      { text:"Cancel", style:"cancel" },
      { text:"Clock Out", style:"destructive", onPress: async()=>{
        const done = await clockOut();
        setActive(null);
        Alert.alert("Clocked Out", done? `Shift ended at ${new Date(done.clockOutAt!).toLocaleTimeString()}.` : "Shift ended.");
      }},
    ]);
  };

  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{backgroundColor: theme.navy, borderRadius:16, padding:16, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
        <View>
          <Text style={{color:"#CBD5E1"}}>Hello,</Text>
          <Text style={{color:"#fff", fontWeight:"800", fontSize:16}}>{displayName}</Text>
          <Text style={{color:"#94A3B8", fontSize:12}}>{displayRole} • {displayId}</Text>
        </View>
        <TouchableOpacity onPress={()=>navigation.navigate("Profile")} style={{width:36,height:36, borderRadius:18, backgroundColor: theme.gold, alignItems:"center", justifyContent:"center"}}>
          <Text>👤</Text>
        </TouchableOpacity>
      </View>
      <View style={{flexDirection:"row", flexWrap:"wrap", marginTop:16, gap:12}}>
        {tiles.map(t=>(
          <TouchableOpacity key={t.label} onPress={()=> navigation.navigate(t.to)} style={{width:"47%", backgroundColor:"#fff", borderRadius:16, padding:16, alignItems:"center"}}>
            <Text style={{fontSize:22}}>{t.icon}</Text>
            <Text style={{fontWeight:"700", marginTop:8, color:theme.navy}}>{t.label}</Text>
            <Text style={{color:theme.muted, fontSize:11}}>{t.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {active ? (
        <View style={{backgroundColor:"#DEF7EC", borderRadius:12, padding:12, marginTop:16}}>
          <View style={{flexDirection:"row", alignItems:"center"}}>
            <View style={{width:10,height:10, borderRadius:5, backgroundColor:"#0E9F6E"}}/>
            <Text style={{marginLeft:8, color:"#0E9F6E", fontWeight:"700"}}>Active Duty</Text>
            <Text style={{marginLeft:8, color:theme.muted, fontSize:12}}>since {new Date(active.clockInAt).toLocaleTimeString()}</Text>
          </View>
          <TouchableOpacity onPress={doClockOut} style={{backgroundColor:"#E02424", borderRadius:10, padding:12, alignItems:"center", marginTop:10}}>
            <Text style={{color:"#fff", fontWeight:"700"}}>Clock Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={()=>navigation.navigate("ClockIn")} style={{backgroundColor:"#F1F5F9", borderRadius:12, padding:12, marginTop:16, alignItems:"center"}}>
          <Text style={{color:theme.muted}}>🕒 Off duty — tap to Clock In</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
