import React, {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { theme } from "../theme";
import { submitPremium } from "../storage/demoStore";
export default function KYC({navigation}:any){
  const [step,setStep]=useState(1);
  const [name,setName]=useState("Amit Verma");
  const [contact,setContact]=useState("9876543210");
  const [busy,setBusy]=useState(false);
  const doSubmit=async()=>{
    if(busy) return;
    setBusy(true);
    try {
      // Offline demo: gated on SUCCESSFUL payment, saved to local storage
      const app = await submitPremium({ clientName: name, contact, paymentMode: "UPI", paymentStatus: "SUCCESSFUL" });
      navigation.navigate("PaymentSuccess", {referenceNo: app.referenceNo});
    } catch(e:any){ Alert.alert("Blocked", e?.message || "Submit failed"); }
    finally { setBusy(false); }
  };
  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <Text style={{fontWeight:"800", color:theme.navy, textAlign:"center"}}>KYC Enrolment</Text>
      <View style={{flexDirection:"row", justifyContent:"space-between", marginTop:12}}>
        {[1,2,3,4].map(n=>(
          <View key={n} style={{flex:1, alignItems:"center"}}>
            <View style={{width:28,height:28, borderRadius:14, backgroundColor: n<=step? theme.gold : "#E2E8F0", alignItems:"center", justifyContent:"center"}}><Text style={{fontWeight:"700", fontSize:12}}>{n}</Text></View>
            <Text style={{fontSize:10, color:theme.muted, marginTop:4}}>{["Personal","Documents","Payment","Review"][n-1]}</Text>
          </View>
        ))}
      </View>
      {step===1 && (
        <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, marginTop:16}}>
          <Text style={{fontWeight:"700"}}>Personal Details</Text>
          <TextInput placeholder="Full Name" value={name} onChangeText={setName} style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:12}}/>
          <TextInput placeholder="DOB (YYYY-MM-DD)" style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:12}}/>
          <TextInput placeholder="Address" multiline style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:12}}/>
          <TextInput placeholder="Contact" value={contact} onChangeText={setContact} keyboardType="phone-pad" style={{borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:12}}/>
          <TouchableOpacity onPress={()=> setStep(2)} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:16}}><Text style={{fontWeight:"700"}}>Next</Text></TouchableOpacity>
        </View>
      )}
      {step===2 && (
        <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, marginTop:16}}>
          <Text style={{fontWeight:"700"}}>Upload Documents</Text><Text style={{color:theme.muted, fontSize:12}}>Images auto-convert to PDF &lt;300KB; pre-compressed client-side (expo-image-manipulator + sharp)</Text>
          {["Aadhaar Card (Front)","Aadhaar Card (Back)","PAN Card","Voter ID (Optional)","Additional Documents"].map(l=>(
            <View key={l} style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:10}}>
              <Text style={{fontSize:12}}>{l}</Text><Text>📷 Upload or capture</Text>
            </View>
          ))}
          <TouchableOpacity onPress={()=> setStep(3)} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:16}}><Text style={{fontWeight:"700"}}>Next</Text></TouchableOpacity>
        </View>
      )}
      {step===3 && (
        <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, marginTop:16}}>
          <Text style={{fontWeight:"700"}}>Payment Details — Total ₹5,000</Text>
          {["Cash","UPI","Digital Payment Link"].map(m=>(
            <View key={m} style={{flexDirection:"row", alignItems:"center", borderWidth:1, borderColor:"#E2E8F0", borderRadius:10, padding:12, marginTop:10}}>
              <View style={{width:16,height:16, borderRadius:8, borderWidth:1, borderColor:theme.navy}}/><Text style={{marginLeft:8}}>{m}</Text>
            </View>
          ))}
          <View style={{backgroundColor:"#DEF7EC", borderRadius:10, padding:10, marginTop:12}}><Text style={{color:"#0E9F6E", fontWeight:"700"}}>✔ Payment Successful</Text><Text style={{fontSize:11, color:theme.muted}}>Submit will be enabled after successful payment.</Text></View>
          <TouchableOpacity disabled={busy} onPress={doSubmit} style={{backgroundColor: theme.gold, padding:14, borderRadius:12, alignItems:"center", marginTop:16, opacity: busy?0.6:1}}><Text style={{fontWeight:"700"}}>{busy?"Submitting...":"Submit Application"}</Text></TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
