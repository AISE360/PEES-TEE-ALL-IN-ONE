import React from "react";
import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./src/screens/Splash";
import Login from "./src/screens/Login";
import Home from "./src/screens/Home";
import ServiceDetail from "./src/screens/ServiceDetail";
import RequestQuote from "./src/screens/RequestQuote";
import Track from "./src/screens/Track";
import Profile from "./src/screens/Profile";

const Stack = createNativeStackNavigator();

const NavTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#F4F6FA" },
};

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="#0B1526" />
      <NavigationContainer theme={NavTheme}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 280,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        >
          <Stack.Screen name="Splash" component={Splash} options={{ animation: "fade", gestureEnabled: false }} />
          <Stack.Screen name="Login" component={Login} options={{ animation: "fade", gestureEnabled: false }} />
          <Stack.Screen name="Home" component={Home} options={{ gestureEnabled: false }} />
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
