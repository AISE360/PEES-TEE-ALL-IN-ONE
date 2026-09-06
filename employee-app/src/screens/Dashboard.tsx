import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { theme } from "../theme";
const tiles = [
  {label:"Clock In", sub:"Start your shift", icon:"⏰"},
  {label:"KYC Enrolment", sub:"New application", icon:"📄"},
  {label:"My Clients", sub:"View & manage", icon:"👥"},
  {label:"Leave", sub:"Apply for leave", icon:"📅"},
  {label:"Salary Slips", sub:"View & download", icon:"💰"},
  {label:"Reports", sub:"End of day", icon:"📊"},
];
export default function Dashboard({navigation}:any){
  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{backgroundColor: theme.navy, borderRadius:16, padding:16, flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
        <View><Text style={{color:"#CBD5E1"}}>Hello,</Text><Text style={{color:"#fff", fontWeight:"800", fontSize:16}}>Rajesh Kumar</Text><Text style={{color:"#94A3B8", fontSize:12}}>Field Executive</Text></View>
        <View style={{width:36,height:36, borderRadius:18, backgroundColor: theme.gold, alignItems:"center", justifyContent:"center"}}><Text>👤</Text></View>
      </View>
      <View style={{flexDirection:"row", flexWrap:"wrap", marginTop:16, gap:12}}>
        {tiles.map(t=>(
          <TouchableOpacity key={t.label} onPress={()=> {
            if(t.label==="Clock In") navigation.navigate("ClockIn");
            else if(t.label==="KYC Enrolment") navigation.navigate("KYC");
            else if(t.label==="Leave") navigation.navigate("Leave");
            else if(t.label==="Salary Slips") navigation.navigate("Salary");
          }} style={{width:"47%", backgroundColor:"#fff", borderRadius:16, padding:16, alignItems:"center"}}>
            <Text style={{fontSize:22}}>{t.icon}</Text><Text style={{fontWeight:"700", marginTop:8, color:theme.navy}}>{t.label}</Text><Text style={{color:theme.muted, fontSize:11}}>{t.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{backgroundColor:"#DEF7EC", borderRadius:12, padding:12, marginTop:16, flexDirection:"row", alignItems:"center"}}>
        <View style={{width:10,height:10, borderRadius:5, backgroundColor:"#0E9F6E"}}/><Text style={{marginLeft:8, color:"#0E9F6E", fontWeight:"700"}}>Active Duty</Text><Text style={{marginLeft:8, color:theme.muted, fontSize:12}}>GPS tracking on</Text>
      </View>
    </ScrollView>
  );
}
