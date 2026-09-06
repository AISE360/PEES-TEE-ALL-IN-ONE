import React, {useCallback, useEffect, useState} from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Card } from "../components/UI";
import { theme } from "../theme";
import { loadRequests } from "../storage/demoStore";

const STAGES = ["APPLIED","CONNECTED","IN_PROCESSING","COMPLETED"];
const LABELS: Record<string,string> = {
  APPLIED:"Applied",
  CONNECTED:"Connected with Customer Care",
  IN_PROCESSING:"In Processing",
  COMPLETED:"Completed"
};

export default function Track({route, navigation}:any){
  const initialRef = route?.params?.reference || "PT24153";
  const [reqs,setReqs]=useState<any[]>([]);
  const [ref,setRef]=useState(initialRef);
  const [refreshing,setRefreshing]=useState(false);

  const reload = useCallback(async()=>{
    const all = await loadRequests();
    setReqs(all);
    if(!all.find(r=>r.reference===ref) && all[0]) setRef(all[0].reference);
  },[ref]);

  useEffect(()=>{ reload(); },[]);
  useEffect(()=>{ if(route?.params?.reference) setRef(route.params.reference); },[route?.params?.reference]);

  const onRefresh = async()=>{ setRefreshing(true); await reload(); setRefreshing(false); };

  const copyRef = async()=>{
    await Clipboard.setStringAsync(ref);
    Alert.alert("Copied", `Reference ${ref} copied to clipboard.`);
  };

  const current = reqs.find(r=>r.reference===ref) || reqs[0];
  const doneMap: Record<string,string> = {};
  (current?.stageHistory||[]).forEach((h:any)=>{ doneMap[h.stage]=h.at; });
  const currentIdx = STAGES.indexOf(current?.stage || "APPLIED");

  return (
    <ScrollView style={{flex:1, backgroundColor:theme.bg}} contentContainerStyle={{padding:16}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:12}}>
        {navigation?.canGoBack() && (
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
            <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
          </TouchableOpacity>
        )}
        <View style={{flex:1}}>
          <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>Track Request</Text>
          <Text style={{color:theme.muted, fontSize:12}}>#{ref}</Text>
        </View>
        <TouchableOpacity onPress={copyRef} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, paddingHorizontal:12, paddingVertical:8, backgroundColor:"#fff"}}>
          <Text style={{fontWeight:"600", color:theme.navy, fontSize:12}}>📋 Copy Ref</Text>
        </TouchableOpacity>
      </View>

      {reqs.length>1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:12}}>
          {reqs.map(r=>(
            <TouchableOpacity key={r.id} onPress={()=>setRef(r.reference)} style={{paddingHorizontal:14, paddingVertical:6, borderRadius:999, backgroundColor: r.reference===ref? theme.navy : "#E2E8F0", marginRight:8}}>
              <Text style={{color: r.reference===ref? "#fff": theme.navy, fontWeight:"700", fontSize:12}}>{r.reference}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Card style={{marginTop:4}}>
        <View style={{borderBottomWidth:1, borderColor:"#E2E8F0", paddingBottom:12, marginBottom:16}}>
          <Text style={{fontWeight:"700", fontSize:16, color:theme.navy}}>{current?.serviceType || "Service Request"}</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>{current?.description || "Request submitted"}</Text>
        </View>

        {STAGES.map((st,i)=>{
          const done = i<=currentIdx;
          const active = i===currentIdx;
          const at = doneMap[st] || (done? current?.updatedAt : null);
          return (
            <View key={st} style={{flexDirection:"row", marginBottom:16}}>
              <View style={{alignItems:"center", width:28}}>
                <View style={{width:24,height:24, borderRadius:12, backgroundColor: done? (active? theme.gold : theme.success) : "#E2E8F0", alignItems:"center", justifyContent:"center"}}>
                  <Text style={{color:"#fff", fontSize:12, fontWeight:"bold"}}>{done?"✓":"•"}</Text>
                </View>
                {i<STAGES.length-1 && <View style={{width:2, flex:1, backgroundColor: done && i<currentIdx ? theme.success : "#E2E8F0", minHeight:20, marginTop:4}}/>}
              </View>
              <View style={{marginLeft:12, flex:1}}>
                <Text style={{fontWeight: active?"800":"600", color: active? theme.goldDark : theme.navy}}>{LABELS[st]}</Text>
                <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>{at? new Date(at).toLocaleString() : "Pending"}</Text>
              </View>
            </View>
          );
        })}

        {current?.attachments?.length>0 && (
          <View style={{marginTop:8, paddingTop:12, borderTopWidth:1, borderColor:"#E2E8F0"}}>
            <Text style={{fontWeight:"700", fontSize:12, color:theme.navy, marginBottom:6}}>Attachments ({current.attachments.length})</Text>
            {current.attachments.map((a:any,i:number)=>(
              <Text key={i} style={{color:theme.muted, fontSize:12, marginBottom:2}}>📎 {a.name}</Text>
            ))}
          </View>
        )}

        <View style={{backgroundColor:"#F8FAFC", borderRadius:12, padding:12, marginTop:12}}>
          <Text style={{fontWeight:"700", color:theme.navy}}>We're actively processing your request</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>Pull down to refresh. Stage updates reflect in real-time.</Text>
        </View>
      </Card>
    </ScrollView>
  );
}
