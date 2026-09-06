import React, {useCallback, useState} from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { theme } from "../theme";
import { getClients } from "../storage/demoStore";

export default function Clients({navigation}:any){
  const [clients,setClients]=useState<any[]>([]);
  const [refreshing,setRefreshing]=useState(false);
  const reload = async()=> setClients(await getClients());
  useFocusEffect(useCallback(()=>{ reload(); },[]));
  const onRefresh = async()=>{ setRefreshing(true); await reload(); setRefreshing(false); };

  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:4}}>
        {navigation?.canGoBack() && (
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
            <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>My Clients</Text>
      </View>
      <Text style={{color:theme.muted, fontSize:12, marginLeft: navigation?.canGoBack() ? 32 : 0}}>
        Enrolled via KYC • pull down to refresh
      </Text>

      {clients.length===0 && (
        <View style={{backgroundColor:"#fff", borderRadius:16, padding:24, alignItems:"center", marginTop:16, borderWidth:1, borderColor:"#E2E8F0"}}>
          <Text style={{fontSize:36}}>👥</Text>
          <Text style={{fontWeight:"700", color:theme.navy, marginTop:8}}>No clients yet</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>Enroll your first client via KYC enrolment</Text>
          <TouchableOpacity onPress={()=>navigation.navigate("KYC")} style={{backgroundColor:theme.gold, borderRadius:10, paddingHorizontal:16, paddingVertical:10, marginTop:14}}>
            <Text style={{fontWeight:"700", color:theme.navy}}>Start KYC Enrolment</Text>
          </TouchableOpacity>
        </View>
      )}

      {clients.map((c,i)=>(
        <TouchableOpacity key={i} onPress={()=>Alert.alert(c.name,`Contact: ${c.contact}\nReference: ${c.referenceNo}\nStatus: ${c.status}`)} style={{backgroundColor:"#fff", borderRadius:16, padding:16, marginTop:12, flexDirection:"row", alignItems:"center", borderWidth:1, borderColor:"#E2E8F0"}}>
          <View style={{width:44,height:44, borderRadius:22, backgroundColor:theme.navy, alignItems:"center", justifyContent:"center"}}>
            <Text style={{color:"#fff", fontWeight:"800", fontSize:16}}>{c.name.charAt(0)}</Text>
          </View>
          <View style={{marginLeft:12, flex:1}}>
            <Text style={{fontWeight:"700", color:theme.navy}}>{c.name}</Text>
            <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>{c.contact} • {c.referenceNo}</Text>
          </View>
          <View style={{paddingHorizontal:8, paddingVertical:4, borderRadius:6, backgroundColor: c.status==="APPROVED"?"#DEF7EC":"#FEF3C7"}}>
            <Text style={{fontSize:11, fontWeight:"700", color: c.status==="APPROVED"?"#0E9F6E":"#C27803"}}>{c.status}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
