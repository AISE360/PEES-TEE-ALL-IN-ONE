import React, {useEffect, useState} from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { theme } from "../theme";
import { getLeaves, applyLeave, leaveBalance, Leave as L } from "../storage/demoStore";

export default function LeaveScreen({navigation}:any){
  const [from,setFrom]=useState("2026-09-10");
  const [to,setTo]=useState("2026-09-12");
  const [reason,setReason]=useState("");
  const [list,setList]=useState<L[]>([]);
  const [busy,setBusy]=useState(false);

  const reload = async()=> setList(await getLeaves());
  useEffect(()=>{ reload(); },[]);

  const submit = async()=>{
    if(!reason.trim()){ Alert.alert("Add reason","Please enter a reason for leave."); return; }
    if(!from || !to){ Alert.alert("Missing dates","Please enter from and to dates (YYYY-MM-DD)."); return; }
    setBusy(true);
    try {
      const e = await applyLeave({ from, to, reason: reason.trim() });
      setReason("");
      await reload();
      Alert.alert("Leave applied",`Request ${e.id} submitted for approval. Status: PENDING.`);
    } catch(err:any){ Alert.alert("Failed", err?.message || "Try again"); }
    finally { setBusy(false); }
  };

  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginBottom:12}}>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          {navigation?.canGoBack() && (
            <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
              <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
            </TouchableOpacity>
          )}
          <Text style={{fontWeight:"800", color:theme.navy, fontSize:18}}>Leave Application</Text>
        </View>
        <View style={{backgroundColor:"#DEF7EC", borderRadius:999, paddingHorizontal:12, paddingVertical:6}}>
          <Text style={{color:"#0E9F6E", fontWeight:"700", fontSize:12}}>Balance: {leaveBalance()} Days</Text>
        </View>
      </View>

      <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, marginTop:6}}>
        <Text style={{fontWeight:"600", color:theme.navy}}>From (YYYY-MM-DD)</Text>
        <TextInput value={from} onChangeText={setFrom} placeholder="2026-09-10" style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6}}/>

        <Text style={{fontWeight:"600", marginTop:12, color:theme.navy}}>To (YYYY-MM-DD)</Text>
        <TextInput value={to} onChangeText={setTo} placeholder="2026-09-12" style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6}}/>

        <Text style={{fontWeight:"600", marginTop:12, color:theme.navy}}>Reason</Text>
        <TextInput value={reason} onChangeText={setReason} placeholder="e.g. Family function" multiline style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6, minHeight:70}}/>

        {busy ? <ActivityIndicator style={{marginTop:16}} color={theme.navy}/> :
          <TouchableOpacity onPress={submit} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:16}}>
            <Text style={{fontWeight:"700", color:theme.navy}}>Apply for Leave</Text>
          </TouchableOpacity>}
      </View>

      <Text style={{fontWeight:"800", color:theme.navy, marginTop:20, fontSize:16}}>Past Requests ({list.length})</Text>
      {list.length===0 && <Text style={{color:theme.muted, marginTop:8}}>No leave requests yet.</Text>}
      {list.map(l=>(
        <View key={l.id} style={{backgroundColor:"#fff", borderRadius:12, padding:14, marginTop:10, borderWidth:1, borderColor:"#E2E8F0", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
          <View style={{flex:1, marginRight:8}}>
            <Text style={{fontWeight:"700", color:theme.navy}}>{l.from} → {l.to}</Text>
            <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>{l.reason}</Text>
          </View>
          <View style={{paddingHorizontal:10, paddingVertical:4, borderRadius:8, backgroundColor: l.status==="APPROVED"?"#DEF7EC": l.status==="REJECTED"?"#FDE8E8":"#FEF3C7"}}>
            <Text style={{fontWeight:"700", fontSize:12, color: l.status==="APPROVED"?"#0E9F6E": l.status==="REJECTED"?"#E02424":"#C27803"}}>{l.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
