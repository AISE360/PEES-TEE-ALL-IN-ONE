import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, Image, StatusBar } from "react-native";
import { theme } from "../theme";

export default function Splash({ navigation }: any) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const op = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 12, bounciness: 8 }),
      Animated.timing(op, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(bar, { toValue: 1, duration: 1400, easing: Easing.linear, useNativeDriver: false }),
    ]).start();
    const t = setTimeout(() => navigation.replace("Login"), 1700);
    return () => clearTimeout(t);
  }, []);

  const w = bar.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  return (
    <View style={{ flex: 1, backgroundColor: theme.navyDeep, alignItems: "center", justifyContent: "center", padding: 32 }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.navyDeep} />
      <Animated.View style={{ opacity: op, transform: [{ scale }], alignItems: "center" }}>
        <View style={{ width: 120, height: 120, borderRadius: 32, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", padding: 14 }}>
          <Image source={require("../../assets/logo.png")} style={{ width: 92, height: 92 }} resizeMode="contain" />
        </View>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 24, marginTop: 18 }}>PEES Tee Group</Text>
        <Text style={{ color: theme.gold, marginTop: 4, fontWeight: "600", fontSize: 13 }}>Building Trust. Developing Land.</Text>
      </Animated.View>
      <View style={{ width: 180, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.15)", marginTop: 36, overflow: "hidden" }}>
        <Animated.View style={{ height: 4, width: w, backgroundColor: theme.gold, borderRadius: 2 }} />
      </View>
    </View>
  );
}
