import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { theme } from "../theme";
import { submitPremium } from "../storage/demoStore";

const DOCS = ["Aadhaar Card (Front)","Aadhaar Card (Back)","PAN Card","Voter ID (Optional)","Additional Documents"];
const MODES = ["Cash","UPI","Digital Payment Link"];

type Doc = { label: string; uri?: string; name?: string };

export default function KYC({navigation}:any){
  const [step,setStep]=useState(1);
  const [name,setName]=useState("Amit Verma");
  const [dob,setDob]=useState("1990-05-12");
  const [address,setAddress]=useState("MG Road, Bengaluru");
  const [contact,setContact]=useState("9876543210");
  const [docs,setDocs]=useState<Doc[]>(DOCS.map(l=>({label:l})));
  const [mode,setMode]=useState("UPI");
  const [paid,setPaid]=useState(false);
  const [busy,setBusy]=useState(false);

  const setDoc = (i:number, patch:Partial<Doc>)=> setDocs(docs.map((d,j)=> j===i? {...d, ...patch}: d));

  const captureDoc = async(i:number)=>{
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if(!perm.granted){ Alert.alert("Permission needed","Please allow camera access."); return; }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if(!res.canceled && res.assets?.[0]){
      const a = res.assets[0];
      setDoc(i,{uri:a.uri, name:a.fileName || `${docs[i].label.replace(/[^A-Za-z]/g,"")}.jpg`});
      Alert.alert("Captured",`${docs[i].label} captured successfully.`);
    }
  };

  const uploadDoc = (i:number)=>{
    Alert.alert(docs[i].label, "Choose a source", [
      { text:"🖼️ Photo Library", onPress: async()=>{
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(!perm.granted){ Alert.alert("Permission needed","Please allow photo access."); return; }
        const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.5 });
        if(!res.canceled && res.assets?.[0]){
          const a = res.assets[0];
          setDoc(i,{uri:a.uri, name:a.fileName || `${docs[i].label.replace(/[^A-Za-z]/g,"")}.jpg`});
        }
      }},
      { text:"📁 Files / Documents", onPress: async()=>{
        try {
          const res = await DocumentPicker.getDocumentAsync({ type:"*/*", copyToCacheDirectory:true });
          if(res.assets?.[0]) setDoc(i,{uri:res.assets[0].uri, name:res.assets[0].name});
        } catch(e:any){ Alert.alert("Couldn't open picker", e?.message || "Try again."); }
      }},
      { text:"Cancel", style:"cancel" },
    ]);
  };

  const canNextDocs = ()=> docs[0].uri && docs[1].uri && docs[2].uri;

  const doSubmit=async()=>{
    if(busy) return;
    if(!paid){ Alert.alert("Payment pending","Please confirm payment first — Submit stays gated until payment is successful."); return; }
    setBusy(true);
    try {
      const app = await submitPremium({ clientName: name.trim()||"Walk-in Client", contact: contact.trim(), paymentMode: mode.toUpperCase().replace(" ","_"), paymentStatus: "SUCCESSFUL" });
      navigation.navigate("PaymentSuccess", {referenceNo: app.referenceNo});
    } catch(e:any){ Alert.alert("Blocked", e?.message || "Submit failed"); }
    finally { setBusy(false); }
  };

  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:12}}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
          <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
        </TouchableOpacity>
        <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>KYC Enrolment</Text>
      </View>

      <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:4}}>
        {[1,2,3].map(n=>(
          <View key={n} style={{flex:1, alignItems:"center"}}>
            <View style={{width:28,height:28, borderRadius:14, backgroundColor: n<=step? theme.gold : "#E2E8F0", alignItems:"center", justifyContent:"center"}}>
              <Text style={{fontWeight:"700", fontSize:12, color:theme.navy}}>{n}</Text>
            </View>
            <Text style={{fontSize:11, color:theme.muted, marginTop:4}}>{["Personal","Documents","Payment"][n-1]}</Text>
          </View>
        ))}
      </View>

      {step===1 && (
        <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, marginTop:16}}>
          <Text style={{fontWeight:"700", color:theme.navy, fontSize:15}}>Personal Details</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:4}}>Client identifying information</Text>

          <Text style={{fontSize:12, fontWeight:"600", color:theme.navy, marginTop:12}}>Full Name *</Text>
          <TextInput placeholder="Enter full name" value={name} onChangeText={setName} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6}}/>

          <Text style={{fontSize:12, fontWeight:"600", color:theme.navy, marginTop:10}}>Date of Birth (YYYY-MM-DD)</Text>
          <TextInput placeholder="1990-05-12" value={dob} onChangeText={setDob} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6}}/>

          <Text style={{fontSize:12, fontWeight:"600", color:theme.navy, marginTop:10}}>Address</Text>
          <TextInput placeholder="Enter client address" value={address} onChangeText={setAddress} multiline style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6}}/>

          <Text style={{fontSize:12, fontWeight:"600", color:theme.navy, marginTop:10}}>Contact Phone *</Text>
          <TextInput placeholder="10-digit mobile number" value={contact} onChangeText={setContact} keyboardType="phone-pad" maxLength={10} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:6}}/>

          <TouchableOpacity onPress={()=>{
            if(!name.trim()) return Alert.alert("Missing name","Please enter the client's full name.");
            if(contact.replace(/\D/g,"").length<10) return Alert.alert("Invalid contact","Please enter a 10-digit contact number.");
            setStep(2);
          }} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:20}}>
            <Text style={{fontWeight:"700", color:theme.navy}}>Next: Upload Documents →</Text>
          </TouchableOpacity>
        </View>
      )}

      {step===2 && (
        <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, marginTop:16}}>
          <Text style={{fontWeight:"700", color:theme.navy, fontSize:15}}>Upload Documents</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>First 3 are required. Supports Camera capture and File picker.</Text>

          {docs.map((d,i)=>(
            <View key={d.label} style={{borderWidth:1, borderColor: d.uri? "#0E9F6E":"#E2E8F0", borderRadius:10, padding:12, marginTop:10}}>
              <View style={{flexDirection:"row", alignItems:"center"}}>
                {d.uri ? <Image source={{uri:d.uri}} style={{width:44,height:44, borderRadius:8}}/> : <Text style={{fontSize:28}}>📄</Text>}
                <View style={{marginLeft:10, flex:1}}>
                  <Text style={{fontSize:12, fontWeight:"700", color:theme.navy}}>{d.label} {i<3?"*":""}</Text>
                  <Text style={{fontSize:11, color: d.uri? "#0E9F6E": theme.muted}} numberOfLines={1}>{d.uri? `✅ ${d.name}` : "Not attached"}</Text>
                </View>
                {d.uri && (
                  <TouchableOpacity onPress={()=>setDoc(i,{uri:undefined, name:undefined})} style={{padding:6}}>
                    <Text style={{color:"#E02424", fontWeight:"bold"}}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={{flexDirection:"row", marginTop:8}}>
                <TouchableOpacity onPress={()=>captureDoc(i)} style={{flex:1, borderWidth:1, borderColor:theme.gold, borderRadius:8, padding:8, alignItems:"center", marginRight:6}}>
                  <Text style={{fontSize:12, fontWeight:"600", color:theme.navy}}>📷 Capture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>uploadDoc(i)} style={{flex:1, borderWidth:1, borderColor:"#CBD5E1", borderRadius:8, padding:8, alignItems:"center", marginLeft:6}}>
                  <Text style={{fontSize:12, fontWeight:"600", color:theme.navy}}>📁 Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={{flexDirection:"row", marginTop:16}}>
            <TouchableOpacity onPress={()=>setStep(1)} style={{flex:1, borderWidth:1, borderColor:"#CBD5E1", padding:14, borderRadius:12, alignItems:"center", marginRight:6}}>
              <Text style={{fontWeight:"600", color:theme.navy}}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
              if(!canNextDocs()) return Alert.alert("Documents missing","Aadhaar Front, Aadhaar Back and PAN are required.");
              setStep(3);
            }} style={{flex:2, backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginLeft:6}}>
              <Text style={{fontWeight:"700", color:theme.navy}}>Next: Payment →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {step===3 && (
        <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, marginTop:16}}>
          <Text style={{fontWeight:"700", color:theme.navy, fontSize:15}}>Payment Details — Total ₹15,000</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>Select mode and confirm payment receipt</Text>

          {MODES.map(m=>(
            <TouchableOpacity key={m} onPress={()=>{setMode(m); setPaid(false);}} style={{flexDirection:"row", alignItems:"center", borderWidth:1, borderColor: mode===m? theme.navy : "#E2E8F0", backgroundColor: mode===m? "#F1F5F9":"#fff", borderRadius:10, padding:12, marginTop:10}}>
              <View style={{width:16,height:16, borderRadius:8, borderWidth:2, borderColor:theme.navy, backgroundColor: mode===m? theme.navy : "transparent"}}/>
              <Text style={{marginLeft:8, fontWeight: mode===m? "700":"400", color:theme.navy}}>{m}</Text>
            </TouchableOpacity>
          ))}

          {!paid ? (
            <TouchableOpacity onPress={()=>{setPaid(true); Alert.alert("Payment confirmed","₹15,000 received via "+mode+". Submit is now enabled.");}} style={{backgroundColor:"#0F2440", borderRadius:10, padding:12, alignItems:"center", marginTop:14}}>
              <Text style={{color:"#fff", fontWeight:"700"}}>Confirm Payment Received</Text>
            </TouchableOpacity>
          ) : (
            <View style={{backgroundColor:"#DEF7EC", borderRadius:10, padding:10, marginTop:12}}>
              <Text style={{color:"#0E9F6E", fontWeight:"700"}}>✅ Payment Successful ({mode})</Text>
              <Text style={{fontSize:11, color:theme.muted}}>Submit is now enabled.</Text>
            </View>
          )}

          {busy ? <ActivityIndicator style={{marginTop:16}} color={theme.navy}/> : (
            <TouchableOpacity disabled={!paid} onPress={doSubmit} style={{backgroundColor: paid? theme.gold : "#D1D5DB", padding:14, borderRadius:12, alignItems:"center", marginTop:16}}>
              <Text style={{fontWeight:"700", color:theme.navy}}>Submit Application</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={()=>setStep(2)} style={{alignItems:"center", marginTop:14}}>
            <Text style={{color:theme.muted, fontSize:13}}>← Back to documents</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
