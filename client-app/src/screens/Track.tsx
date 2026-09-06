import React, {useEffect, useState} from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Card } from "../components/UI";
import { theme } from "../theme";
import { loadRequests } from "../storage/demoStore";

const STAGES = ["APPLIED","CONNECTED","IN_PROCESSING","COMPLETED"];
const LABELS: Record<string,string> = { APPLIED:"Applied", CONNECTED:"Connected with Customer Care", IN_PROCESSING:"In Processing", COMPLETED:"Completed" };

export default function Track({route}:any){
  const initialRef = route?.params?.reference || "PT24153";
  const [reqs,setReqs]=useState<any[]>([]);
  const [ref,setRef]=useState(initialRef);

  useEffect(()=>{ loadRequests().then(setReqs); },[]);
  useEffect(()=>{ if(route?.params?.reference) setRef(route.params.reference); },[route?.params?.reference]);

  const current = reqs.find(r=>r.reference===ref) || reqs[0];
  const doneMap: Record<string,string> = {};
  (current?.stageHistory||[]).forEach((h:any)=>{ doneMap[h.stage]=h.at; });
  const currentIdx = STAGES.indexOf(current?.stage || "APPLIED");

  return (
    <ScrollView style={{flex:1, backgroundColor:theme.bg}} contentContainerStyle={{padding:16}}>
      <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>Track Request</Text><Text style={{color:theme.muted}}>#{ref} (offline demo)</Text>
      {reqs.length>1 && (
        <ScrollView horizontal style={{marginTop:8}}>
          {reqs.map(r=>(
            <TouchableOpacity key={r.id} onPress={()=>setRef(r.reference)} style={{paddingHorizontal:12, paddingVertical:6, borderRadius:999, backgroundColor: r.reference===ref? theme.navy : "#E2E8F0", marginRight:8}}>
              <Text style={{color: r.reference===ref? "#fff": theme.navy, fontWeight:"700", fontSize:12}}>{r.reference}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      <Card style={{marginTop:16}}>
        {STAGES.map((st,i)=>{
          const done = i<=currentIdx;
          const active = i===currentIdx;
          const at = doneMap[st] || (done? current?.updatedAt : "Pending");
          return (
            <View key={st} style={{flexDirection:"row", marginBottom:16}}>
              <View style={{alignItems:"center", width:28}}>
                <View style={{width:22,height:22, borderRadius:11, backgroundColor: done? (active? theme.gold : theme.success) : "#E2E8F0", alignItems:"center", justifyContent:"center"}}><Text style={{color:"#fff", fontSize:12}}>{done?"✓":"•"}</Text></View>
                {i<STAGES.length-1 && <View style={{width:2, flex:1, backgroundColor:"#E2E8F0", marginTop:4}}/>}
              </View>
              <View style={{marginLeft:12}}><Text style={{fontWeight: active?"800":"600", color: active? theme.warning : theme.navy}}>{LABELS[st]}</Text><Text style={{color:theme.muted, fontSize:12}}>{at? new Date(at).toLocaleString() : "Pending"}</Text></View>
            </View>
          );
        })}
        <View style={{backgroundColor:"#F8FAFC", borderRadius:12, padding:12, marginTop:8}}>
          <Text style={{fontWeight:"700"}}>We're working on your request</Text><Text style={{color:theme.muted, fontSize:12}}>Our team is processing your documents. We'll keep you updated.</Text>
        </View>
      </Card>
    </ScrollView>
  );
}
