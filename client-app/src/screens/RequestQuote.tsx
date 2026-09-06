import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Card, PrimaryButton } from "../components/UI";
import { theme } from "../theme";
import { saveRequest, Attachment } from "../storage/demoStore";

export default function RequestQuote({route, navigation}:any){
  const service = route?.params?.service || {title:"Land Documentation", desc:"Get expert assistance"};
  const serviceType = service.title;
  const [desc,setDesc]=useState("");
  const [time,setTime]=useState("");
  const [files,setFiles]=useState<Attachment[]>([]);
  const [busy,setBusy]=useState(false);

  const pickImage = async()=>{
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!perm.granted){ Alert.alert("Permission needed","Please allow photo access to attach images."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.6 });
    if(!res.canceled && res.assets?.[0]){
      const a = res.assets[0];
      setFiles(f=>[...f, { name: a.fileName || `photo_${Date.now()}.jpg`, uri: a.uri, size: a.fileSize, mime: a.mimeType || "image/jpeg" }]);
    }
  };

  const takePhoto = async()=>{
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if(!perm.granted){ Alert.alert("Permission needed","Please allow camera access to take a photo."); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if(!res.canceled && res.assets?.[0]){
      const a = res.assets[0];
      setFiles(f=>[...f, { name: a.fileName || `capture_${Date.now()}.jpg`, uri: a.uri, size: a.fileSize, mime: a.mimeType || "image/jpeg" }]);
    }
  };

  const pickDocument = async()=>{
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
      if(res.assets?.[0]){
        const d = res.assets[0];
        setFiles(f=>[...f, { name: d.name, uri: d.uri, size: d.size, mime: d.mimeType }]);
      }
    } catch(e:any){ Alert.alert("Couldn't open picker", e?.message || "Try again."); }
  };

  const chooseAttach = ()=>{
    Alert.alert("Attach Document", "Choose an attachment method", [
      { text: "📷 Take Photo", onPress: takePhoto },
      { text: "🖼️ Photo Library", onPress: pickImage },
      { text: "📁 Files / Documents", onPress: pickDocument },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const submit=async()=>{
    if(!desc.trim()){ Alert.alert("Add details","Please describe your requirement before submitting."); return; }
    if(busy) return;
    setBusy(true);
    try {
      const entry = await saveRequest({ serviceType, description: desc.trim(), preferredContactTime: time.trim() || "Anytime", attachments: files });
      Alert.alert("Request submitted", `Reference: ${entry.reference}\n${files.length} attachment(s) saved locally.`, [
        { text: "Track Request", onPress: ()=> navigation.navigate("Track", {reference: entry.reference}) },
      ]);
      navigation.navigate("Track", {reference: entry.reference});
    } catch(e:any){ Alert.alert("Error", e?.message || "Save failed"); }
    finally { setBusy(false); }
  };

  return (
    <ScrollView style={{flex:1, backgroundColor:theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:12}}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
          <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>Request a Quote</Text>
          <Text style={{color:theme.muted, fontSize:12}}>{serviceType}</Text>
        </View>
      </View>

      <Card style={{marginTop:4}}>
        <Text style={{fontWeight:"600", color:theme.navy}}>Selected Service</Text>
        <View style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6, backgroundColor:"#F8FAFC"}}>
          <Text style={{color:theme.navy, fontWeight:"700"}}>{serviceType}</Text>
        </View>

        <Text style={{fontWeight:"600", marginTop:14, color:theme.navy}}>Requirement Details *</Text>
        <TextInput value={desc} onChangeText={setDesc} placeholder="Tell us about your requirement, location, timeline..." multiline style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6, minHeight:80}}/>

        <Text style={{fontWeight:"600", marginTop:14, color:theme.navy}}>Preferred Contact Time</Text>
        <TextInput value={time} onChangeText={setTime} placeholder="e.g. Tomorrow 10 AM, or Any time" style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6}}/>

        <Text style={{fontWeight:"600", marginTop:14, color:theme.navy}}>Attachments {files.length>0?`(${files.length})`:"(Optional)"}</Text>
        <TouchableOpacity onPress={chooseAttach} style={{borderWidth:1.5, borderStyle:"dashed", borderColor:theme.gold, borderRadius:12, padding:16, alignItems:"center", marginTop:8, backgroundColor:"#FEFDF8"}}>
          <Text style={{fontSize:14, fontWeight:"600", color:theme.navy}}>📎 Tap to attach photo, camera, or file</Text>
        </TouchableOpacity>

        {files.map((f,i)=>(
          <View key={`${f.uri}_${i}`} style={{flexDirection:"row", alignItems:"center", borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:10, marginTop:8, backgroundColor:"#FAFAFA"}}>
            {f.mime?.startsWith("image") ? (
              <Image source={{uri:f.uri}} style={{width:40,height:40, borderRadius:8}} />
            ) : <Text style={{fontSize:24}}>📄</Text>}
            <View style={{marginLeft:10, flex:1}}>
              <Text numberOfLines={1} style={{fontWeight:"600", fontSize:12, color:theme.navy}}>{f.name}</Text>
              <Text style={{color:theme.muted, fontSize:11}}>{f.size?`${Math.round(f.size/1024)} KB`:"cached file"}</Text>
            </View>
            <TouchableOpacity onPress={()=> setFiles(files.filter((_,j)=>j!==i))} style={{padding:6}}>
              <Text style={{color:"#E02424", fontWeight:"bold"}}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={{height:20}}/>
        {busy ? <ActivityIndicator color={theme.navy}/> : <PrimaryButton title="Submit Request" onPress={submit}/>}
      </Card>
    </ScrollView>
  );
}
