import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StatusBar, Easing, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, shadow } from "../theme";

export function PressableScale({ children, onPress, style, disabled }: any) {
  const s = useRef(new Animated.Value(1)).current;
  const down = () => Animated.spring(s, { toValue: 0.96, useNativeDriver: true, speed: 60, bounciness: 4 }).start();
  const up = () => Animated.spring(s, { toValue: 1, useNativeDriver: true, speed: 60, bounciness: 6 }).start();
  return (
    <Pressable disabled={disabled} onPress={onPress} onPressIn={down} onPressOut={up}
      style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }, style]}>
      <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
    </Pressable>
  );
}

export function Reveal({ children, delay = 0, y = 18, style }: any) {
  const op = useRef(new Animated.Value(0)).current;
  const ty = useRef(new Animated.Value(y)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(op, { toValue: 1, duration: 420, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(ty, { toValue: 0, duration: 420, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);
  return <Animated.View style={[{ opacity: op, transform: [{ translateY: ty }] }, style]}>{children}</Animated.View>;
}

export function Skeleton({ w = "100%", h = 14, r = 8, style }: any) {
  const x = useRef(new Animated.Value(-1)).current;
  useEffect(() => {
    Animated.loop(Animated.timing(x, { toValue: 1, duration: 1100, easing: Easing.linear, useNativeDriver: true })).start();
  }, []);
  const tx = x.interpolate({ inputRange: [-1, 1], outputRange: [-160, 320] });
  return (
    <View style={[{ width: w as any, height: h, borderRadius: r, backgroundColor: "#E8EDF3", overflow: "hidden" }, style]}>
      <Animated.View style={{ width: 120, height: h, backgroundColor: "#F7F9FC", opacity: 0.9, transform: [{ translateX: tx }] }} />
    </View>
  );
}

export function Screen({ children, bg = theme.bg }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.navyDeep} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View style={{ flex: 1 }}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

export function BackHeader({ title, sub, onBack, right }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
      <PressableScale onPress={onBack}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", ...shadow.card }}>
          <Text style={{ color: theme.navy, fontWeight: "800", fontSize: 18 }}>←</Text>
        </View>
      </PressableScale>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "800", fontSize: 18, color: theme.navy }}>{title}</Text>
        {!!sub && <Text style={{ color: theme.muted, fontSize: 12 }}>{sub}</Text>}
      </View>
      {right}
    </View>
  );
}

export const Card = ({ children, style }: any) => (
  <View style={[{ backgroundColor: theme.card, borderRadius: theme.radius, padding: 16, ...shadow.card }, style]}>{children}</View>
);

export function PrimaryButton({ title, onPress, disabled, busy }: any) {
  return (
    <PressableScale onPress={onPress} disabled={disabled || busy}>
      <View style={{ backgroundColor: disabled ? "#CBD5E1" : theme.gold, paddingVertical: 15, borderRadius: 14, alignItems: "center", opacity: disabled ? 0.7 : 1 }}>
        <Text style={{ color: theme.navyDeep, fontWeight: "800", fontSize: 16 }}>{busy ? "Please wait…" : title}</Text>
      </View>
    </PressableScale>
  );
}

export function DutyBadge({ active, since }: any) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!active) return;
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.35, duration: 800, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
    ])).start();
  }, [active]);
  return (
    <View style={{ backgroundColor: active ? theme.successBg : "#F1F5F9", borderRadius: 14, padding: 13, flexDirection: "row", alignItems: "center" }}>
      <Animated.View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: active ? theme.success : "#94A3B8", transform: [{ scale: pulse }] }} />
      <Text style={{ marginLeft: 9, color: active ? theme.success : theme.muted, fontWeight: "800", fontSize: 13 }}>
        {active ? "● Active Duty" : "○ Off Duty"}
      </Text>
      {!!since && <Text style={{ marginLeft: 8, color: theme.muted, fontSize: 11 }}>since {since}</Text>}
    </View>
  );
}
