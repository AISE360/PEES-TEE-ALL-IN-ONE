import React, {useState} from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Linking, Alert } from "react-native";
import { Card } from "../components/UI";
import { theme } from "../theme";
import { SERVICES, SUPPORT } from "../storage/demoStore";

const SERVICE_META: Record<string, { icon: string; color: string }> = {
  "Land Documentation": { icon: "📜", color: "#E0E7FF" },
  "Property Registration": { icon: "🏢", color: "#FEF3C7" },
  "Tax & Regulatory Filing": { icon: "📊", color: "#FCE7F3" },
  "Corporate KYC & Compliance": { icon: "🛡️", color: "#DCFCE7" },
  "Title Deed Verification": { icon: "🔍", color: "#E0F2FE" },
  "Building Approval & NOC": { icon: "🏗️", color: "#FEE2E2" },
};

const DEFAULT_META = [
  { icon: "📜", color: "#E0E7FF" },
  { icon: "🏢", color: "#FEF3C7" },
  { icon: "📊", color: "#FCE7F3" },
  { icon: "🛡️", color: "#DCFCE7" },
];

export default function Home({navigation}:any){
  const [q,setQ]=useState("");
  const [showSupport,setShowSupport]=useState(false);

  const services = SERVICES.map((s,i)=>{
    const meta = SERVICE_META[s.title] || DEFAULT_META[i % DEFAULT_META.length];
    return { ...s, icon: meta.icon, color: meta.color };
  }).filter(s=> s.title.toLowerCase().includes(q.toLowerCase()) || s.desc.toLowerCase().includes(q.toLowerCase()));

  const tabs = [
    {label:"Home", icon:"🏠", to:"Home", active:true},
    {label:"My Requests", icon:"📋", to:"Track", active:false},
    {label:"Support", icon:"💬", to:null, active:false},
    {label:"Profile", icon:"👤", to:"Profile", active:false},
  ];

  return (
    <View style={{flex:1, backgroundColor: theme.bg}}>
      {/* Support Modal */}
      <Modal visible={showSupport} transparent animationType="fade" onRequestClose={()=>setShowSupport(false)}>
        <View style={{flex:1, backgroundColor:"rgba(0,0,0,0.5)", justifyContent:"center", padding:24}}>
          <View style={{backgroundColor:"#fff", borderRadius:20, padding:24, borderWidth:1, borderColor:"#E2E8F0"}}>
            <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>Corporate Support</Text>
            <Text style={{color:theme.muted, fontSize:12, marginTop:4}}>PEES Tee Group Pvt Ltd</Text>

            <TouchableOpacity onPress={()=>Linking.openURL(`tel:${SUPPORT.phone.replace(/[^+\d]/g,"")}`)} style={{flexDirection:"row", alignItems:"center", marginTop:20, padding:12, backgroundColor:"#F8FAFC", borderRadius:12}}>
              <Text style={{fontSize:22, marginRight:12}}>📞</Text>
              <View>
                <Text style={{fontWeight:"700", color:theme.navy}}>Call Us</Text>
                <Text style={{color:theme.muted, fontSize:12}}>{SUPPORT.phone}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>Linking.openURL(`mailto:${SUPPORT.email}`)} style={{flexDirection:"row", alignItems:"center", marginTop:10, padding:12, backgroundColor:"#F8FAFC", borderRadius:12}}>
              <Text style={{fontSize:22, marginRight:12}}>📧</Text>
              <View>
                <Text style={{fontWeight:"700", color:theme.navy}}>Email Us</Text>
                <Text style={{color:theme.muted, fontSize:12}}>{SUPPORT.email}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(SUPPORT.address)}`)} style={{flexDirection:"row", alignItems:"center", marginTop:10, padding:12, backgroundColor:"#F8FAFC", borderRadius:12}}>
              <Text style={{fontSize:22, marginRight:12}}>📍</Text>
              <View style={{flex:1}}>
                <Text style={{fontWeight:"700", color:theme.navy}}>Find Us</Text>
                <Text style={{color:theme.muted, fontSize:12}}>{SUPPORT.address}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>setShowSupport(false)} style={{backgroundColor:theme.gold, borderRadius:12, padding:14, alignItems:"center", marginTop:20}}>
              <Text style={{fontWeight:"700", color:theme.navy}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{backgroundColor: theme.navy, paddingTop:48, paddingBottom:24, paddingHorizontal:20, borderBottomLeftRadius:24, borderBottomRightRadius:24}}>
        <Text style={{color:"#CBD5E1"}}>Good Morning,</Text>
        <Text style={{color:"#fff", fontSize:22, fontWeight:"800"}}>Sufiyan</Text>
        <Text style={{color:"#94A3B8", fontSize:12, marginTop:4}}>Get the services you need, made simple.</Text>
        <View style={{backgroundColor:"#fff", borderRadius:12, paddingHorizontal:14, paddingVertical:10, flexDirection:"row", alignItems:"center", marginTop:16}}>
          <Text style={{fontSize:16}}>🔍</Text>
          <TextInput value={q} onChangeText={setQ} placeholder="Search for services..." style={{marginLeft:10, flex:1, fontSize:14}} />
          {q.length>0 && (
            <TouchableOpacity onPress={()=>setQ("")} style={{padding:4}}>
              <Text style={{color:theme.muted, fontWeight:"bold"}}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{padding:16}}>
        <Text style={{fontWeight:"800", color:theme.navy, fontSize:16, marginBottom:12}}>Available Services</Text>
        {services.length===0 && (
          <Card style={{alignItems:"center", padding:24}}>
            <Text style={{fontSize:32}}>🔍</Text>
            <Text style={{fontWeight:"700", color:theme.navy, marginTop:8}}>No services found</Text>
            <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>Try a different search term</Text>
          </Card>
        )}
        {services.map(s=>(
          <TouchableOpacity key={s.id} onPress={()=> navigation.navigate("ServiceDetail", {service:s})}>
            <Card style={{flexDirection:"row", alignItems:"center", marginBottom:12}}>
              <View style={{width:48,height:48, borderRadius:12, backgroundColor:s.color, alignItems:"center", justifyContent:"center"}}>
                <Text style={{fontSize:22}}>{s.icon}</Text>
              </View>
              <View style={{marginLeft:12, flex:1}}>
                <Text style={{fontWeight:"700", color:theme.navy}}>{s.title}</Text>
                <Text style={{color:theme.muted, fontSize:12, marginTop:2}} numberOfLines={2}>{s.desc}</Text>
              </View>
              <Text style={{color:theme.goldDark, fontWeight:"800", fontSize:18}}>→</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={{flexDirection:"row", justifyContent:"space-around", paddingVertical:10, backgroundColor:"#fff", borderTopWidth:1, borderColor:"#E2E8F0"}}>
        {tabs.map(t=>(
          <TouchableOpacity key={t.label} onPress={()=>t.to ? (t.to!=="Home" && navigation.navigate(t.to)) : setShowSupport(true)} style={{alignItems:"center", paddingVertical:4, paddingHorizontal:12}}>
            <Text style={{fontSize:18}}>{t.icon}</Text>
            <Text style={[{fontSize:11, marginTop:2}, t.active?{color:theme.navy, fontWeight:"700"}:{color:theme.muted}]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
