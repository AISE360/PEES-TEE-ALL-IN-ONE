import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { theme } from "../theme";
export const Card = ({children, style}:any)=> <View style={[{backgroundColor:theme.card, borderRadius:16, padding:16, shadowColor:"#000", shadowOpacity:0.06, shadowRadius:12, elevation:2}, style]}>{children}</View>;
export const PrimaryButton = ({title, onPress, disabled}:any)=> (
  <TouchableOpacity onPress={onPress} disabled={disabled} style={{backgroundColor: disabled? "#D1D5DB" : theme.gold, paddingVertical:14, borderRadius:12, alignItems:"center", opacity: disabled?0.6:1}}>
    <Text style={{color: theme.navy, fontWeight:"700", fontSize:16}}>{title}</Text>
  </TouchableOpacity>
);
export const Pill = ({label, stage}:{label:string, stage:string})=> {
  const m:any = {APPLIED:"#64748B", CONNECTED:"#1C64F2", IN_PROCESSING:"#C27803", COMPLETED:"#0E9F6E"};
  return <View style={{alignSelf:"flex-start", backgroundColor:"#F1F5F9", paddingHorizontal:10, paddingVertical:4, borderRadius:999}}><Text style={{color:m[stage]||"#64748B", fontWeight:"700", fontSize:12}}>{label}</Text></View>
};
