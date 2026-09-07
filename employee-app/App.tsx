import React from "react";
import "react-native-gesture-handler";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/screens/Login";
import Directive from "./src/screens/DirectiveModal";
import Dashboard from "./src/screens/Dashboard";
import ClockIn from "./src/screens/ClockIn";
import KYC from "./src/screens/KYC";
import PaymentSuccess from "./src/screens/PaymentSuccess";
import SelfService from "./src/screens/SelfService";
import LeaveScreen from "./src/screens/Leave";
import SalarySlips from "./src/screens/SalarySlips";
import Clients from "./src/screens/Clients";
import Reports from "./src/screens/Reports";

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
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            animationDuration: 280,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        >
          {/* FIX: auth gate — Login/Directive can't be reached via back button after entry */}
          <Stack.Screen name="Login" component={Login} options={{ animation: "fade", gestureEnabled: false }} />
          <Stack.Screen name="Directive" component={Directive} options={{ animation: "fade", gestureEnabled: false }} />
          <Stack.Screen name="Dashboard" component={Dashboard} options={{ gestureEnabled: false }} />
          <Stack.Screen name="ClockIn" component={ClockIn} />
          <Stack.Screen name="KYC" component={KYC} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} options={{ gestureEnabled: false }} />
          <Stack.Screen name="Leave" component={LeaveScreen} />
          <Stack.Screen name="Salary" component={SalarySlips} />
          <Stack.Screen name="Clients" component={Clients} />
          <Stack.Screen name="Reports" component={Reports} />
          <Stack.Screen name="Profile" component={SelfService} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
export default registerRootComponent(App);
