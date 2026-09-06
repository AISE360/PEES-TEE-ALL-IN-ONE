import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Card, PrimaryButton } from "../components/UI";
import { theme } from "../theme";

const SERVICE_META: Record<string,{icon:string; color:string; desc:string; features:string[]}> = {
  "Land Documentation": {
    icon:"📜", color:"#E0E7FF",
    desc:"Complete documentation support for property registration, mutation, encumbrance certificates, and related land records.",
    features:["Property registration guidance","Mutation & encumbrance certificates","Revenue record updates & patta","Legal deed drafting & verification"],
  },
  "Premium Quotes": {
    icon:"💎", color:"#FEF3C7",
    desc:"Get accurate, transparent premium quotes for insurance, property, and financial products with full on-site KYC support.",
    features:["Accurate premium calculations","KYC-compliant enrolment with document upload","Cash / UPI / Digital payment collection","Instant PT reference & live tracking"],
  },
  "Legal Assistance": {
    icon:"⚖️", color:"#FCE7F3",
    desc:"Professional legal assistance for property disputes, documentation scrutiny, and contractual agreements.",
    features:["Document legal scrutiny by panel advocate","Title deed chain analysis","Dispute resolution guidance","Court and sub-registrar liaison"],
  },
  "Property Verification": {
    icon:"🔍", color:"#DCFCE7",
    desc:"Verify property ownership, check for encumbrances, and authenticate land records with 100% confidence.",
    features:["30-year ownership history search","Encumbrance certificate (EC) retrieval","Survey sketch and zoning verification","Comprehensive title search report"],
  },
  "Corporate KYC & Compliance": {
    icon:"🛡️", color:"#DCFCE7",
    desc:"Corporate entity verification, director KYC, MCA filings, and statutory regulatory compliance.",
    features:["Director & signatory KYC","MCA master data verification","GST & PAN linkage validation","Digital compliance dossier"],
  },
};

export default function ServiceDetail({route, navigation}:any){
  const service = route?.params?.service || {title:"Land Documentation"};
  const meta = SERVICE_META[service.title] || {
    icon: service.icon || "📄",
    color: service.color || "#E0E7FF",
    desc: service.desc || "Professional service provided by PEES Tee Group certified executives.",
    features: ["Dedicated field representative","Full documentation support","Secure digital records","Direct head-office liaison"],
  };

  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:14}}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
          <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
        </TouchableOpacity>
        <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>Service Details</Text>
      </View>

      <View style={{flexDirection:"row", alignItems:"center", marginBottom:16, backgroundColor:"#fff", padding:16, borderRadius:16, borderWidth:1, borderColor:"#E2E8F0"}}>
        <View style={{backgroundColor:meta.color, width:60, height:60, borderRadius:16, alignItems:"center", justifyContent:"center"}}>
          <Text style={{fontSize:32}}>{meta.icon}</Text>
        </View>
        <View style={{marginLeft:14, flex:1}}>
          <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>{service.title}</Text>
          <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>PEES Tee Verified Service</Text>
        </View>
      </View>

      <Text style={{color:"#374151", lineHeight:22, marginBottom:16, fontSize:14}}>{meta.desc}</Text>

      <Card style={{marginBottom:20}}>
        <Text style={{fontWeight:"700", color:theme.navy, marginBottom:12, fontSize:15}}>What's Included</Text>
        {meta.features.map((f,i)=>(
          <View key={i} style={{flexDirection:"row", alignItems:"center", marginBottom:8}}>
            <Text style={{color:"#0E9F6E", fontWeight:"bold", marginRight:8}}>✓</Text>
            <Text style={{color:"#334155", fontSize:14}}>{f}</Text>
          </View>
        ))}
      </Card>

      <PrimaryButton title="Request a Quote" onPress={()=> navigation.navigate("RequestQuote", {service})} />
    </ScrollView>
  );
}
