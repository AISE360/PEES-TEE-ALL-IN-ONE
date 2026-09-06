import React, {useEffect} from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { theme } from "../theme";
export default function Splash({navigation}:any){
  useEffect(()=>{ const t=setTimeout(()=> navigation.replace("Login"), 1500); return()=>clearTimeout(t)},[]);
  return (
    <View style={{flex:1, backgroundColor:"#FFFFFF", alignItems:"center", justifyContent:"center", padding:24}}>
      <Image source={require("../../assets/logo.png")} style={{width:260, height:192}} resizeMode="contain" />
      <Text style={{color:theme.navy, marginTop:12, fontWeight:"600"}}>Trusted Services. Brighter Tomorrows.</Text>
      <ActivityIndicator color={theme.navy} style={{marginTop:24}} />
    </View>
  );
}
