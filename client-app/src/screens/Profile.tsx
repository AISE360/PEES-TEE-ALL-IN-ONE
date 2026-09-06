import React, {useState} from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, Linking, Alert, Modal } from "react-native";
import { Card } from "../components/UI";
import { theme } from "../theme";
import { SUPPORT } from "../storage/demoStore";

export default function Profile({navigation}:any){
  const [dark,setDark]=useState(false);
  const [about,setAbout]=useState(false);

  const call = ()=> Linking.openURL(`tel:${SUPPORT.phone.replace(/[^+\d]/g,"")}`).catch(()=> Alert.alert("Can't place call","Dialer unavailable on this device."));
  const mail = ()=> Linking.openURL(`mailto:${SUPPORT.email}`).catch(()=> Alert.alert("Can't open mail","No mail app on this device."));
  const maps = ()=> Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(SUPPORT.address)}`).catch(()=> Alert.alert("Can't open maps","Browser unavailable."));
  const web = ()=> Linking.openURL(`https://${SUPPORT.website}`).catch(()=> Alert.alert("Can't open browser","Browser unavailable."));

  const logout = ()=>{
    Alert.alert("Logout?","You will be signed out of the demo session.",[
      { text:"Cancel", style:"cancel" },
      { text:"Logout", style:"destructive", onPress: ()=> navigation.replace("Login") },
    ]);
  };

  const rows: {label:string; hint:string; fn:()=>void}[] = [
    {label:"My Requests", hint:"→", fn:()=>navigation.navigate("Track")},
    {label:"Support Helpline", hint:"→", fn:call},
    {label:"Email Support", hint:"→", fn:mail},
    {label:"About PEES Tee", hint:"→", fn:()=>setAbout(true)},
    {label:"App Version", hint:"1.0.0 (demo)", fn:()=>Alert.alert("PEES Tee Client","Demo build 1.0.0 (offline/demo-first).")},
  ];

  return (
    <ScrollView style={{flex:1, backgroundColor:theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:14}}>
        {navigation?.canGoBack() && (
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
            <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>Client Profile</Text>
      </View>

      <View style={{flexDirection:"row", alignItems:"center", backgroundColor:"#fff", padding:16, borderRadius:16, borderWidth:1, borderColor:"#E2E8F0"}}>
        <View style={{width:52,height:52, borderRadius:26, backgroundColor:theme.navy, alignItems:"center", justifyContent:"center"}}>
          <Text style={{color:"#fff", fontWeight:"800", fontSize:18}}>SS</Text>
        </View>
        <View style={{marginLeft:14}}>
          <Text style={{fontWeight:"800", color:theme.navy, fontSize:16}}>Sufiyan Sajan</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>+91 98765 43210</Text>
        </View>
      </View>

      <Card style={{marginTop:16}}>
        {rows.map(r=>(
          <TouchableOpacity key={r.label} onPress={r.fn} style={{flexDirection:"row", justifyContent:"space-between", paddingVertical:14, borderBottomWidth:1, borderColor:"#F1F5F9"}}>
            <Text style={{fontWeight:"600", color:theme.navy}}>{r.label}</Text>
            <Text style={{color:theme.muted}}>{r.hint}</Text>
          </TouchableOpacity>
        ))}
        <View style={{flexDirection:"row", justifyContent:"space-between", paddingVertical:12, alignItems:"center"}}>
          <View>
            <Text style={{fontWeight:"600", color:theme.navy}}>Dark Mode</Text>
            <Text style={{fontSize:11, color:theme.muted}}>{dark?"On (demo preview)":"Off"}</Text>
          </View>
          <Switch value={dark} onValueChange={(v)=>{setDark(v); Alert.alert("Theme", v?"Dark mode preview enabled.":"Light mode restored.");}}/>
        </View>
        <TouchableOpacity onPress={logout} style={{paddingVertical:12, marginTop:4}}>
          <Text style={{color:"#E02424", fontWeight:"700"}}>Logout</Text>
        </TouchableOpacity>
      </Card>

      <Card style={{marginTop:16}}>
        <Text style={{fontWeight:"800", color:theme.navy, fontSize:15, marginBottom:10}}>Corporate Support</Text>
        <TouchableOpacity onPress={call} style={{flexDirection:"row", alignItems:"center", marginBottom:10}}>
          <Text style={{marginRight:8}}>📞</Text>
          <Text style={{color:"#334155", fontSize:13}}>{SUPPORT.phone}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={mail} style={{flexDirection:"row", alignItems:"center", marginBottom:10}}>
          <Text style={{marginRight:8}}>📧</Text>
          <Text style={{color:"#334155", fontSize:13}}>{SUPPORT.email}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={maps} style={{flexDirection:"row", alignItems:"center", marginBottom:10}}>
          <Text style={{marginRight:8}}>📍</Text>
          <Text style={{color:"#334155", fontSize:13}}>{SUPPORT.address}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={web} style={{flexDirection:"row", alignItems:"center"}}>
          <Text style={{marginRight:8}}>🌐</Text>
          <Text style={{color:"#334155", fontSize:13}}>{SUPPORT.website}</Text>
        </TouchableOpacity>
      </Card>

      <Modal visible={about} transparent animationType="fade" onRequestClose={()=>setAbout(false)}>
        <View style={{flex:1, backgroundColor:"rgba(0,0,0,0.5)", justifyContent:"center", padding:24}}>
          <View style={{backgroundColor:"#fff", borderRadius:20, padding:24}}>
            <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>About PEES Tee</Text>
            <Text style={{color:"#475569", marginTop:12, lineHeight:20, fontSize:13}}>
              PEES Tee Group Pvt Ltd — trusted services for land documentation, premium quotes, legal assistance and property verification.
              {"\n\n"}
              Trusted Services. Brighter Tomorrows.
            </Text>
            <TouchableOpacity onPress={()=>setAbout(false)} style={{backgroundColor:theme.gold, borderRadius:12, padding:14, alignItems:"center", marginTop:20}}>
              <Text style={{fontWeight:"700", color:theme.navy}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
