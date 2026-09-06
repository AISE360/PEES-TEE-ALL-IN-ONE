import React from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, Linking } from "react-native";
import { Card } from "../components/UI";
import { theme } from "../theme";
export default function Profile(){
  const support = {name:"PEES Tee Group Pvt Ltd", address:"HBR Layout, Bengaluru - 560043", email:"info@peesteegroup.com", phone:"+91 (080) 41289652", website:"www.peesteegroup.com"};
  return (
    <ScrollView style={{flex:1, backgroundColor:theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center"}}>
        <View style={{width:48,height:48, borderRadius:24, backgroundColor:theme.navy, alignItems:"center", justifyContent:"center"}}><Text style={{color:"#fff", fontWeight:"800"}}>SS</Text></View>
        <View style={{marginLeft:12}}><Text style={{fontWeight:"800", color:theme.navy}}>Sufiyan Sajan</Text><Text style={{color:theme.muted}}>+91 98765 43210</Text></View>
      </View>
      <Card style={{marginTop:16}}>
        {[
          ["My Requests","›"],
          ["Support","›"],
          ["Contact Us","›"],
          ["About PEES Tee","›"],
          ["Settings","›"],
        ].map(([a,b]:any)=>(<View key={a} style={{flexDirection:"row", justifyContent:"space-between", paddingVertical:12, borderBottomWidth:1, borderColor:"#F1F5F9"}}><Text>{a}</Text><Text>{b}</Text></View>))}
        <View style={{flexDirection:"row", justifyContent:"space-between", paddingVertical:12}}><Text>Dark Mode</Text><Switch value={false}/></View>
        <TouchableOpacity style={{paddingVertical:12}}><Text style={{color:theme.warning}}>Logout</Text></TouchableOpacity>
      </Card>
      <Card style={{marginTop:16}}>
        <Text style={{fontWeight:"800", color:theme.navy}}>Corporate Support</Text>
        <TouchableOpacity onPress={()=>Linking.openURL(`tel:${support.phone}`)}><Text style={{color:theme.muted, marginTop:8}}>📞 {support.phone}</Text></TouchableOpacity>
        <TouchableOpacity onPress={()=>Linking.openURL(`mailto:${support.email}`)}><Text style={{color:theme.muted}}>✉️ {support.email}</Text></TouchableOpacity>
        <Text style={{color:theme.muted}}>📍 {support.address}</Text>
        <Text style={{color:theme.muted}}>🌐 {support.website}</Text>
      </Card>
    </ScrollView>
  );
}
