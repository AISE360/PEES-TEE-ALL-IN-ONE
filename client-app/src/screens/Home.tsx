import React from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Card } from "../components/UI";
import { theme } from "../theme";

const services = [
  {id:"1", title:"Land Documentation", desc:"Get expert assistance", icon:"🏛️", color:"#E0E7FF"},
  {id:"2", title:"Premium Quotes", desc:"Accurate & transparent", icon:"📥", color:"#FEF3C7"},
  {id:"3", title:"Legal Assistance", desc:"Professional support", icon:"👤", color:"#FCE7F3"},
  {id:"4", title:"Property Verification", desc:"Verify with confidence", icon:"🏠", color:"#DCFCE7"},
];

export default function Home({navigation}:any){
  return (
    <View style={{flex:1, backgroundColor: theme.bg}}>
      <View style={{backgroundColor: theme.navy, paddingTop:48, paddingBottom:24, paddingHorizontal:20, borderBottomLeftRadius:24, borderBottomRightRadius:24}}>
        <Text style={{color:"#CBD5E1"}}>Good Morning,</Text><Text style={{color:"#fff", fontSize:20, fontWeight:"800"}}>Sufiyan</Text>
        <Text style={{color:"#94A3B8", fontSize:12, marginTop:4}}>Get the services you need, made simple.</Text>
        <View style={{backgroundColor:"#fff", borderRadius:12, paddingHorizontal:12, paddingVertical:10, flexDirection:"row", alignItems:"center", marginTop:16}}><Text>🔍</Text><TextInput placeholder="Search for services..." style={{marginLeft:8, flex:1}} /></View>
      </View>
      <ScrollView contentContainerStyle={{padding:16}}>
        {services.map(s=>(
          <TouchableOpacity key={s.id} onPress={()=> navigation.navigate("ServiceDetail", {service:s})}>
            <Card style={{flexDirection:"row", alignItems:"center", marginBottom:12}}>
              <View style={{width:48,height:48, borderRadius:12, backgroundColor:s.color, alignItems:"center", justifyContent:"center"}}><Text style={{fontSize:22}}>{s.icon}</Text></View>
              <View style={{marginLeft:12, flex:1}}><Text style={{fontWeight:"700", color:theme.navy}}>{s.title}</Text><Text style={{color:theme.muted, fontSize:12}}>{s.desc}</Text></View>
              <Text style={{color:theme.goldDark, fontWeight:"700"}}>›</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{flexDirection:"row", justifyContent:"space-around", paddingVertical:12, backgroundColor:"#fff", borderTopWidth:1, borderColor:"#E2E8F0"}}>
        <Text style={{color:theme.navy, fontWeight:"700"}}>Home</Text><Text>My Requests</Text><Text>Support</Text><Text>Profile</Text>
      </View>
    </View>
  );
}
