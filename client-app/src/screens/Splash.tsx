import React, {useEffect} from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { theme } from "../theme";
export default function Splash({navigation}:any){
  useEffect(()=>{ const t=setTimeout(()=> navigation.replace("Login"), 1200); return()=>clearTimeout(t)},[]);
  return (
    <View style={{flex:1, backgroundColor: theme.navy, alignItems:"center", justifyContent:"center", padding:24}}>
      <View style={{width:84,height:84, borderRadius:18, backgroundColor: theme.gold, alignItems:"center", justifyContent:"center"}}><Text style={{fontSize:42, color:theme.navy, fontWeight:"900"}}>P</Text></View>
      <Text style={{color:"#fff", fontSize:22, fontWeight:"800", marginTop:16}}>PEES Tee</Text>
      <Text style={{color:"#CBD5E1", marginTop:6}}>Trusted Services. Brighter Tomorrows.</Text>
      <Text style={{color:"#94A3B8", marginTop:32, textAlign:"center"}}>Your Trusted Partner{"\n"}for a Better Tomorrow</Text>
      <ActivityIndicator color={theme.gold} style={{marginTop:24}} />
    </View>
  );
}
