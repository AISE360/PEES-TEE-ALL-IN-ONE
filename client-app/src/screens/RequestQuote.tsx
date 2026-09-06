import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Card, PrimaryButton } from "../components/UI";
import { theme } from "../theme";
import { saveRequest } from "../storage/demoStore";
export default function RequestQuote({route, navigation}:any){
  const [desc,setDesc]=useState("");
  const [time,setTime]=useState("");
  const [busy,setBusy]=useState(false);
  const submit=async()=>{
    if(busy) return;
    setBusy(true);
    try {
      // Offline demo: persist to local storage (no backend needed)
      const entry = await saveRequest({ serviceType: "Land Documentation", description: desc || "General enquiry", preferredContactTime: time || "Anytime" });
      Alert.alert("Confirmation (demo, offline)", `Saved locally! Reference: ${entry.reference}`);
      navigation.navigate("Track", {reference: entry.reference});
    } catch(e:any){ Alert.alert("Error", e?.message || "Save failed"); }
    finally { setBusy(false); }
  };
  return (
    <ScrollView style={{flex:1, backgroundColor:theme.bg}} contentContainerStyle={{padding:16}}>
      <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>Request a Quote</Text><Text style={{color:theme.muted}}>Land Documentation</Text>
      <Card style={{marginTop:16}}>
        <Text style={{fontWeight:"600"}}>Service Type</Text><View style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:8}}><Text>Land Documentation</Text></View>
        <Text style={{fontWeight:"600", marginTop:12}}>Description</Text><TextInput value={desc} onChangeText={setDesc} placeholder="Tell us about your requirement..." multiline style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:8, minHeight:80}}/>
        <Text style={{fontWeight:"600", marginTop:12}}>Preferred Contact Time</Text><TextInput value={time} onChangeText={setTime} placeholder="Select date & time" style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:8}}/>
        <Text style={{fontWeight:"600", marginTop:12}}>Attach Documents (Optional)</Text><TouchableOpacity style={{borderWidth:1, borderStyle:"dashed", borderColor:"#CBD5E1", borderRadius:10, padding:14, alignItems:"center", marginTop:8}}><Text>📎 Upload photos or documents (auto PDF &lt;300KB, photo &lt;50KB)</Text></TouchableOpacity>
        <View style={{height:16}}/><PrimaryButton title={busy?"Saving...":"Submit Request"} onPress={submit}/>
      </Card>
    </ScrollView>
  );
}
