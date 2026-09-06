import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, Alert, Image, ScrollView, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import MapView, { Marker, Circle } from "react-native-maps";
import { theme } from "../theme";
import { clockIn, clockOut, getActiveShift } from "../storage/demoStore";

// Assigned site (demo: HBR Layout, Bengaluru HO)
const SITE = { lat: 13.0358, lng: 77.6200, radiusM: 500, name: "Office - HBR Layout" };

function distM(a:{lat:number;lng:number}, b:{lat:number;lng:number}){
  const R = 6371000;
  const dLat = (b.lat-a.lat)*Math.PI/180, dLon = (b.lng-a.lng)*Math.PI/180;
  const s = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s));
}

export default function ClockIn({navigation}:any){
  const [loc,setLoc]=useState<{lat:number;lng:number}|null>(null);
  const [locBusy,setLocBusy]=useState(false);
  const [selfie,setSelfie]=useState<string|null>(null);
  const [active,setActive]=useState<any>(null);
  const [busy,setBusy]=useState(false);

  useEffect(()=>{ getActiveShift().then(setActive); },[]);

  const fetchLocation = async()=>{
    setLocBusy(true);
    try {
      const perm = await Location.requestForegroundPermissionsAsync();
      if(!perm.granted){ Alert.alert("Permission needed","Please allow location access for geofenced clock-in."); return; }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch(e:any){ Alert.alert("Location failed", e?.message || "Could not read GPS. You can still use demo check-in."); }
    finally { setLocBusy(false); }
  };

  const distance = loc? Math.round(distM(loc, SITE)) : null;
  const inside = distance!==null && distance<=SITE.radiusM;

  const takeSelfie = async()=>{
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if(!perm.granted){ Alert.alert("Permission needed","Please allow camera access for the live selfie."); return; }
    const res = await ImagePicker.launchCameraAsync({ cameraType: "front" as any, quality: 0.5, allowsEditing: true, aspect:[1,1] });
    if(!res.canceled && res.assets?.[0]){ setSelfie(res.assets[0].uri); Alert.alert("Selfie captured","Live selfie attached to this shift."); }
  };

  const doClockIn = async(demo:boolean)=>{
    if(!selfie){ Alert.alert("Selfie required","Please capture a live selfie before clocking in."); return; }
    if(busy) return;
    setBusy(true);
    try {
      const entry = await clockIn({ lat: loc?.lat, lng: loc?.lng, selfieUri: selfie });
      setActive(entry);
      Alert.alert(demo?"Checked in (demo override)":"Clocked In", demo?`Outside geofence (${distance??"?"}m away) — demo override used. GPS tracking started.`:"GPS tracking started. Active Duty badge is now live on the portal map.");
      navigation.navigate("Dashboard");
    } catch(e:any){ Alert.alert("Failed", e?.message || "Clock-in failed"); }
    finally { setBusy(false); }
  };

  const doClockOut = async()=>{
    const done = await clockOut();
    if(done){ setActive(null); Alert.alert("Clocked Out",`Shift ended at ${new Date(done.clockOutAt!).toLocaleTimeString()}. Tracking stopped.`); navigation.navigate("Dashboard"); }
    else Alert.alert("No active shift","You are not clocked in.");
  };

  if(active){
    return (
      <View style={{flex:1, backgroundColor: theme.bg, padding:16, justifyContent:"center"}}>
        <View style={{backgroundColor:"#fff", borderRadius:16, padding:20, alignItems:"center"}}>
          <View style={{flexDirection:"row", alignItems:"center"}}>
            <View style={{width:10,height:10, borderRadius:5, backgroundColor:"#0E9F6E"}}/>
            <Text style={{marginLeft:8, color:"#0E9F6E", fontWeight:"800"}}>Currently on Active Duty</Text>
          </View>
          <Text style={{color:theme.muted, marginTop:8}}>Clocked in at {new Date(active.clockInAt).toLocaleString()}</Text>
          {active.selfieUri && <Image source={{uri:active.selfieUri}} style={{width:90,height:90, borderRadius:45, marginTop:12}}/>}
          <TouchableOpacity onPress={doClockOut} style={{backgroundColor:"#E02424", padding:14, borderRadius:12, alignItems:"center", marginTop:16, alignSelf:"stretch"}}>
            <Text style={{color:"#fff", fontWeight:"700"}}>Clock Out (stop tracking)</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginTop:16, padding:8}}>
            <Text style={{color:theme.navy, fontWeight:"600"}}>← Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:8}}>
        <TouchableOpacity onPress={()=>navigation.goBack()} style={{marginRight:12, padding:4}}>
          <Text style={{color:theme.navy, fontWeight:"800", fontSize:20}}>←</Text>
        </TouchableOpacity>
        <Text style={{fontWeight:"800", fontSize:18, color:theme.navy}}>Clock In</Text>
      </View>
      <View style={{height:200, borderRadius:16, overflow:"hidden", marginTop:16, backgroundColor:"#E0E7FF"}}>
        {loc ? (
          <MapView style={{flex:1}} initialRegion={{ latitude: loc.lat, longitude: loc.lng, latitudeDelta: 0.01, longitudeDelta: 0.01 }} showsUserLocation>
            <Marker coordinate={{latitude: SITE.lat, longitude: SITE.lng}} title={SITE.name} pinColor={theme.navy} />
            <Circle center={{latitude: SITE.lat, longitude: SITE.lng}} radius={SITE.radiusM} fillColor="rgba(198,166,100,0.25)" strokeColor={theme.gold} />
            <Marker coordinate={{latitude: loc.lat, longitude: loc.lng}} title="You" pinColor="#0E9F6E" />
          </MapView>
        ) : (
          <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text style={{fontSize:40}}>📍</Text>
            <Text style={{color:theme.muted, marginTop:8}}>Tap below to fetch your GPS location</Text>
          </View>
        )}
      </View>
      <TouchableOpacity onPress={fetchLocation} disabled={locBusy} style={{backgroundColor:"#0F2440", borderRadius:10, padding:12, alignItems:"center", marginTop:10}}>
        {locBusy ? <ActivityIndicator color="#fff"/> : <Text style={{color:"#fff", fontWeight:"700"}}>{loc?"🔄 Refresh Location":"📍 Get My Location"}</Text>}
      </TouchableOpacity>
      {loc && (
        <View style={{backgroundColor: inside?"#DEF7EC":"#FEE2E2", borderRadius:12, padding:12, flexDirection:"row", alignItems:"center", marginTop:12}}>
          <Text>{inside?"✅":"⚠️"}</Text>
          <Text style={{marginLeft:8, color: inside?"#0E9F6E":"#E02424", fontWeight:"700", flex:1}}>
            {inside?`Within ${SITE.name} (${distance}m)`:`${distance}m from site — outside ${SITE.radiusM}m geofence`}
          </Text>
        </View>
      )}
      <View style={{backgroundColor:"#fff", borderRadius:16, padding:16, alignItems:"center", marginTop:16}}>
        <Text style={{fontWeight:"700", color:theme.navy}}>Capture Selfie *</Text>
        <Text style={{color:theme.muted, fontSize:12}}>Front camera only — no gallery for this step</Text>
        {selfie ? <Image source={{uri:selfie}} style={{width:100,height:100, borderRadius:50, marginTop:12}}/> :
          <View style={{width:100,height:100, borderRadius:50, backgroundColor:"#E2E8F0", marginTop:12, alignItems:"center", justifyContent:"center"}}>
            <Text style={{fontSize:40}}>🤳</Text>
          </View>}
        <TouchableOpacity onPress={takeSelfie} style={{borderWidth:1, borderColor:theme.gold, borderRadius:10, paddingHorizontal:16, paddingVertical:8, marginTop:12}}>
          <Text style={{fontWeight:"600", color:theme.navy}}>{selfie?"🔄 Retake":"📷 Capture Selfie"}</Text>
        </TouchableOpacity>
      </View>
      {busy ? <ActivityIndicator style={{marginTop:20}} color={theme.navy}/> : (
        <>
          <TouchableOpacity disabled={!inside} onPress={()=>doClockIn(false)} style={{backgroundColor: inside? theme.gold : "#D1D5DB", padding:14, borderRadius:12, alignItems:"center", marginTop:20}}>
            <Text style={{fontWeight:"700", color:theme.navy}}>Clock In{!loc?" (get location first)":""}</Text>
          </TouchableOpacity>
          {loc && !inside && (
            <TouchableOpacity onPress={()=>doClockIn(true)} style={{borderWidth:1, borderColor:theme.navy, padding:12, borderRadius:12, alignItems:"center", marginTop:10}}>
              <Text style={{fontWeight:"600", color:theme.navy}}>Demo check-in (override geofence)</Text>
            </TouchableOpacity>
          )}
        </>
      )}
      <Text style={{fontSize:11, color:theme.muted, textAlign:"center", marginTop:8}}>Continuous GPS tracking + portal live map while on shift. Restricted to HR/Supervisor/Manager.</Text>
    </ScrollView>
  );
}
