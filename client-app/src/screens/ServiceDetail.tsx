import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { Card, PrimaryButton } from "../components/UI";
import { theme } from "../theme";
export default function ServiceDetail({route, navigation}:any){
  const {service} = route.params || {service:{title:"Land Documentation"}};
  return (
    <ScrollView style={{flex:1, backgroundColor: theme.bg}} contentContainerStyle={{padding:16}}>
      <View style={{height:160, backgroundColor:"#E2E8F0", borderRadius:16, alignItems:"center", justifyContent:"center"}}><Text style={{fontSize:48}}>🏡</Text></View>
      <Text style={{fontWeight:"800", fontSize:18, color:theme.navy, marginTop:16}}>{service.title}</Text>
      <Text style={{color:theme.muted, marginTop:6}}>Complete documentation support for property registration, mutation, and related services.</Text>
      <Card style={{marginTop:16}}>
        <Text>✔ Expert guidance</Text><Text>✔ End-to-end support</Text><Text>✔ Transparent pricing</Text><Text>✔ Timely updates</Text>
      </Card>
      <View style={{height:16}}/>
      <PrimaryButton title="Request a Quote" onPress={()=> navigation.navigate("RequestQuote", {service})} />
    </ScrollView>
  );
}
