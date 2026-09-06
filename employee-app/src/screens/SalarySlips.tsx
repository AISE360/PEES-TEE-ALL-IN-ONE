import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { theme } from "../theme";
import { getSalarySlips } from "../storage/demoStore";
import { getCurrentUser } from "../storage/auth";

export default function SalarySlips({navigation}:any){
  const [slips,setSlips]=useState<any[]>([]);
  const [busyId,setBusyId]=useState<string|null>(null);
  const user = getCurrentUser();
  const displayName = user?.name || "Rajesh Kumar";
  const displayId = user?.employeeId || "EMP00125";
  const displayRole = user?.role ? user.role.replace("_"," ") : "Field Executive";

  useEffect(()=>{ getSalarySlips().then(setSlips); },[]);

  const slipHtml = (month:string)=>`
    <!DOCTYPE html><html><body style="font-family:Arial,sans-serif;padding:32px;color:#0F2440">
      <h2>PEES Tee Group Pvt Ltd</h2>
      <p style="color:#64748B;font-size:13px">HBR Layout, Bengaluru, Karnataka - 560043</p>
      <hr style="border:none;border-top:1px solid #E2E8F0;margin:16px 0;"/>
      <h3 style="color:#0F2440">Salary Slip — ${month}</h3>
      <p style="font-size:14px;line-height:1.6">
        <b>Employee:</b> ${displayName} (${displayId})<br/>
        <b>Designation:</b> ${displayRole}<br/>
        <b>Payment Date:</b> Last working day of ${month}
      </p>
      <table border="1" cellpadding="10" cellspacing="0" width="100%" style="border-collapse:collapse;border-color:#E2E8F0;font-size:14px;margin-top:16px">
        <tr style="background-color:#F8FAFC"><th align="left">Earnings Component</th><th align="right">Amount (₹)</th></tr>
        <tr><td>Basic Pay</td><td align="right">18,000</td></tr>
        <tr><td>HRA</td><td align="right">7,200</td></tr>
        <tr><td>Conveyance Allowance</td><td align="right">2,800</td></tr>
        <tr style="background-color:#F1F5F9"><td><b>Total Net Pay</b></td><td align="right"><b>₹28,000</b></td></tr>
      </table>
      <p style="color:#94A3B8;font-size:12px;margin-top:24px">Generated officially by PEES Tee Employee Portal.</p>
    </body></html>`;

  const view = async(month:string)=>{
    setBusyId(month+"view");
    try {
      const { uri } = await Print.printToFileAsync({ html: slipHtml(month) });
      const can = await Sharing.isAvailableAsync();
      if(can) await Sharing.shareAsync(uri, { dialogTitle: `Salary Slip ${month}` });
      else Alert.alert("PDF ready", `Saved to:\n${uri}`);
    } catch(e:any){ Alert.alert("Failed", e?.message || "Could not generate PDF"); }
    finally { setBusyId(null); }
  };

  const download = async(month:string)=>{
    setBusyId(month+"dl");
    try {
      const { uri } = await Print.printToFileAsync({ html: slipHtml(month) });
      Alert.alert("Downloaded",`Salary slip PDF generated successfully:\n${uri}`);
    } catch(e:any){ Alert.alert("Failed", e?.message || "Could not generate PDF"); }
    finally { setBusyId(null); }
  };

  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:4}}>
        {navigation?.canGoBack() && (
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
            <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>Salary Slips</Text>
      </View>
      <Text style={{color:theme.muted, fontSize:12, marginLeft: navigation?.canGoBack() ? 32 : 0}}>
        {displayName} • {displayId}
      </Text>

      <View style={{marginTop:12}}>
        {slips.map(s=>(
          <View key={s.id} style={{backgroundColor:"#fff", borderRadius:16, padding:16, marginTop:10, flexDirection:"row", alignItems:"center", borderWidth:1, borderColor:"#E2E8F0"}}>
            <View style={{width:44,height:44, borderRadius:12, backgroundColor:"#FEF3C7", alignItems:"center", justifyContent:"center"}}>
              <Text style={{fontSize:22}}>💵</Text>
            </View>
            <View style={{marginLeft:12, flex:1}}>
              <Text style={{fontWeight:"700", color:theme.navy, fontSize:14}}>{s.month}</Text>
              <Text style={{color:theme.muted, fontSize:12, marginTop:2}}>PDF • Net ₹28,000</Text>
            </View>
            {busyId===s.id+"view"||busyId===s.id+"dl" ? <ActivityIndicator color={theme.navy}/> : (
              <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={()=>view(s.month)} style={{borderWidth:1, borderColor:theme.gold, borderRadius:8, paddingHorizontal:12, paddingVertical:8, marginRight:8}}>
                  <Text style={{fontSize:12, fontWeight:"700", color:theme.navy}}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>download(s.month)} style={{backgroundColor:theme.gold, borderRadius:8, paddingHorizontal:12, paddingVertical:8}}>
                  <Text style={{fontSize:12, fontWeight:"700", color:theme.navy}}>PDF</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        {slips.length===0 && <Text style={{color:theme.muted, marginTop:12}}>No salary slips yet.</Text>}
      </View>
    </ScrollView>
  );
}
