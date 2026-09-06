import React from "react";
import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/Login";
import Directive from "./src/screens/DirectiveModal";
import Dashboard from "./src/screens/Dashboard";
import ClockIn from "./src/screens/ClockIn";
import KYC from "./src/screens/KYC";
import PaymentSuccess from "./src/screens/PaymentSuccess";
import SelfService from "./src/screens/SelfService";

const Stack = createNativeStackNavigator();
function App(){
  return (
    <GestureHandlerRootView style={{flex:1}}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Directive" component={Directive} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="ClockIn" component={ClockIn} />
          <Stack.Screen name="KYC" component={KYC} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
          <Stack.Screen name="Profile" component={SelfService} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
export default registerRootComponent(App);
