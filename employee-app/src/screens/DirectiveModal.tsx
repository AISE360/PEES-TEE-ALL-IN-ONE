import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { theme } from "../theme";
import { getDirective } from "../storage/demoStore";

export default function Directive({navigation}:any){
  const [directive,setDirective]=useState<any>(null);

  useEffect(()=>{ getDirective().then(setDirective); },[]);

  const lines = directive?.message ? directive.message.split("\n").filter(Boolean) : [
    "Visit assigned sites as per schedule.",
    "Ensure complete KYC capture.",
    "Maintain professionalism with clients.",
    "Submit end-of-day report.",
    "Stay within assigned geofence areas.",
  ];

  return (
    <View style={{flex:1, backgroundColor:"rgba(15,36,64,0.85)", justifyContent:"center", padding:20}}>
      <View style={{backgroundColor:"#fff", borderRadius:16, padding:20}}>
        <View style={{width:48,height:48, borderRadius:24, backgroundColor:"#FEF3C7", alignItems:"center", justifyContent:"center", alignSelf:"center"}}>
          <Text style={{fontSize:22}}>📋</Text>
        </View>
        <Text style={{fontWeight:"800", fontSize:16, textAlign:"center", marginTop:12, color:theme.navy}}>Today's Shift Instructions</Text>
        <Text style={{textAlign:"center", color:theme.muted, fontSize:12}}>
          {new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
        </Text>
        {!directive ? (
          <ActivityIndicator color={theme.navy} style={{marginTop:16}}/>
        ) : (
          <View style={{marginTop:16}}>
            {lines.map((line:string, i:number)=>(
              <Text key={i} style={{color: i===0 ? theme.navy : "#374151", marginBottom:6}}>
                • {line.replace(/^[•\-\*]\s*/,"")}
              </Text>
            ))}
          </View>
        )}
        <TouchableOpacity onPress={()=> navigation.replace("Dashboard")} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:20}}>
          <Text style={{fontWeight:"700", color:theme.navy}}>Got it — Start Shift</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
