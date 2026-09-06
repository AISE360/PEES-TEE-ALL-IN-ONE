import React, {useEffect, useState} from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { theme } from "../theme";
import { getEODs, submitEOD, EOD } from "../storage/demoStore";

export default function Reports({navigation}:any){
  const [activities,setActivities]=useState("");
  const [collections,setCollections]=useState("");
  const [notes,setNotes]=useState("");
  const [list,setList]=useState<EOD[]>([]);
  const [busy,setBusy]=useState(false);

  const reload = async()=> setList(await getEODs());
  useEffect(()=>{ reload(); },[]);

  const submit = async()=>{
    if(!activities.trim()){ Alert.alert("Add activities","Please log today's field activities."); return; }
    setBusy(true);
    try {
      await submitEOD({ activities: activities.trim(), collections: collections.trim() || "Nil", notes: notes.trim() || "—" });
      setActivities(""); setCollections(""); setNotes("");
      await reload();
      Alert.alert("Report submitted","End-of-day report saved. HR can review it on the portal.");
    } catch(e:any){ Alert.alert("Failed", e?.message || "Try again"); }
    finally { setBusy(false); }
  };

  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:12}}>
        {navigation?.canGoBack() && (
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
            <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>End-of-Day Report</Text>
      </View>

      <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, marginTop:6}}>
        <Text style={{fontWeight:"600", color:theme.navy}}>Activity Log *</Text>
        <TextInput value={activities} onChangeText={setActivities} placeholder="Sites visited, KYCs done, client meetings..." multiline style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6, minHeight:80}}/>

        <Text style={{fontWeight:"600", marginTop:12, color:theme.navy}}>Collections Summary</Text>
        <TextInput value={collections} onChangeText={setCollections} placeholder="e.g. ₹15,000 via UPI (1 KYC client)" multiline style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6}}/>

        <Text style={{fontWeight:"600", marginTop:12, color:theme.navy}}>Progress Notes</Text>
        <TextInput value={notes} onChangeText={setNotes} placeholder="Follow-ups, obstacles, client feedback..." multiline style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6}}/>

        {busy ? <ActivityIndicator style={{marginTop:16}} color={theme.navy}/> :
          <TouchableOpacity onPress={submit} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:16}}>
            <Text style={{fontWeight:"700", color:theme.navy}}>Submit Report</Text>
          </TouchableOpacity>}
      </View>

      <Text style={{fontWeight:"800", color:theme.navy, marginTop:20, fontSize:16}}>Submitted Reports ({list.length})</Text>
      {list.length===0 && <Text style={{color:theme.muted, marginTop:8}}>No reports submitted yet.</Text>}
      {list.map(r=>(
        <View key={r.id} style={{backgroundColor:"#fff", borderRadius:12, padding:14, marginTop:10, borderWidth:1, borderColor:"#E2E8F0"}}>
          <Text style={{fontWeight:"700", color:theme.navy}}>{r.date}</Text>
          <Text style={{color:"#334155", fontSize:13, marginTop:6}}>📝 Activities: {r.activities}</Text>
          <Text style={{color:"#334155", fontSize:13, marginTop:2}}>💵 Collections: {r.collections}</Text>
          <Text style={{color:"#64748B", fontSize:12, marginTop:2}}>📌 Notes: {r.notes}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
