import React from "react";
import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./src/screens/Splash";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import ServiceDetail from "./src/screens/ServiceDetail";
import RequestQuote from "./src/screens/RequestQuote";
import Track from "./src/screens/Track";
import Profile from "./src/screens/Profile";

const Stack = createNativeStackNavigator();
function App(){
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ServiceDetail" component={ServiceDetail} />
          <Stack.Screen name="RequestQuote" component={RequestQuote} />
          <Stack.Screen name="Track" component={Track} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
export default registerRootComponent(App);
