import React, { useEffect, useRef } from "react";
import {
  View, Text, TouchableOpacity, TextInput, Animated,
  StatusBar, Easing, Pressable, GestureResponderEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme, shadow } from "../theme";
import { I, Tile } from "./icons";

/* ── Pressable with Uber-like scale feedback ── */
export function PressableScale({ children, onPress, style, disabled }: any) {
  const s = useRef(new Animated.Value(1)).current;
  const down = () => Animated.spring(s, { toValue: 0.96, useNativeDriver: true, speed: 60, bounciness: 4 }).start();
  const up = () => Animated.spring(s, { toValue: 1, useNativeDriver: true, speed: 60, bounciness: 6 }).start();
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      onPressIn={down}
      onPressOut={up}
      style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }, style]}
    >
      <Animated.View style={{ transform: [{ scale: s }] }}>{children}</Animated.View>
    </Pressable>
  );
}

/* ── Fade+slide entrance wrapper (stagger via delay) ── */
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

/* ── Shimmer skeleton ── */
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

/* ── Screen shell: dark status bar + safe area ── */
export function Screen({ children, bg = theme.bg, pad = 0, scroll = false }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle="light-content" backgroundColor={theme.navyDeep} />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <View style={{ flex: 1, padding: pad }}>{children}</View>
      </SafeAreaView>
    </View>
  );
}

/* ── Dark hero header (Uber-style) ── */
export function HeroHeader({ title, sub, right, children }: any) {
  return (
    <View style={{ backgroundColor: theme.navyDeep, paddingTop: 14, paddingBottom: 22, paddingHorizontal: 20, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#8EA0BF", fontSize: 12 }}>{sub}</Text>
          <Text style={{ color: "#fff", fontSize: 23, fontWeight: "800", marginTop: 2 }}>{title}</Text>
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

/* ── Back header for inner screens ── */
export function BackHeader({ title, sub, onBack, right }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12 }}>
      <PressableScale onPress={onBack}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", ...shadow.card }}>
          <I name="back" size={19} color={theme.navyDeep} />
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

/* ── Floating bottom tab bar ── */
export function TabBar({ active, navigation, onSupport }: { active: string; navigation: any; onSupport?: () => void }) {
  const tabs = [
    { key: "Home", icon: "home", to: "Home" },
    { key: "Track", icon: "pin", to: "Track" },
    { key: "Support", icon: "headset", to: "" },
    { key: "Profile", icon: "user", to: "Profile" },
  ];
  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 14, paddingTop: 6, backgroundColor: "transparent" }}>
      <View style={{ flexDirection: "row", backgroundColor: theme.navyDeep, borderRadius: 24, paddingVertical: 8, paddingHorizontal: 6, ...shadow.pop }}>
        {tabs.map(t => {
          const on = active === t.key;
          const go = () => {
            if (t.key === "Support") { onSupport ? onSupport() : null; return; }
            if (t.key !== active) navigation.navigate(t.to);
          };
          return (
            <PressableScale key={t.key} onPress={go} style={{ flex: 1 }}>
              <View style={{ alignItems: "center", paddingVertical: 8, borderRadius: 18, backgroundColor: on ? theme.gold : "transparent" }}>
                <I name={t.icon} size={20} color={on ? "#FFFFFF" : "#8EA0BF"} />
                <Text style={{ fontSize: 10, marginTop: 3, fontWeight: "700", color: on ? "#FFFFFF" : "#8EA0BF" }}>{t.key}</Text>
              </View>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

/* ── Search ── */
export function SearchBar({ value, onChange, onClear, placeholder = "Search for services…" }: any) {
  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4, flexDirection: "row", alignItems: "center", ...shadow.card }}>
      <I name="search" size={17} color={theme.muted} />
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#94A3B8" style={{ marginLeft: 10, flex: 1, fontSize: 14, paddingVertical: 12, color: theme.text }} />
      {value?.length > 0 && (
        <TouchableOpacity onPress={onClear} style={{ padding: 6 }}>
          <I name="x" size={16} color={theme.muted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export const Card = ({ children, style }: any) => (
  <View style={[{ backgroundColor: theme.card, borderRadius: theme.radius, padding: 16, ...shadow.card }, style]}>{children}</View>
);

export function PrimaryButton({ title, onPress, disabled, busy }: any) {
  return (
    <PressableScale onPress={onPress} disabled={disabled || busy}>
      <View style={{ backgroundColor: disabled ? "#CBD5E1" : theme.navy, paddingVertical: 15, borderRadius: 14, alignItems: "center", opacity: disabled ? 0.7 : 1 }}>
        <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 16 }}>{busy ? "Please wait…" : title}</Text>
      </View>
    </PressableScale>
  );
}

export const Pill = ({ label, stage }: { label: string; stage: string }) => {
  const m: any = { APPLIED: "#64748B", CONNECTED: "#1C64F2", IN_PROCESSING: "#C27803", COMPLETED: "#0E9F6E" };
  const bgm: any = { APPLIED: "#F1F5F9", CONNECTED: "#E1EFFE", IN_PROCESSING: "#FDF6B2", COMPLETED: "#DEF7EC" };
  return (
    <View style={{ alignSelf: "flex-start", backgroundColor: bgm[stage] || "#F1F5F9", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 }}>
      <Text style={{ color: m[stage] || "#64748B", fontWeight: "800", fontSize: 11 }}>{label}</Text>
    </View>
  );
};

export function SectionTitle({ title, action, onAction }: any) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <Text style={{ fontWeight: "800", color: theme.navy, fontSize: 17 }}>{title}</Text>
      {!!action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ color: theme.goldDark, fontWeight: "700", fontSize: 13 }}>{action} →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function EmptyState({ icon = "search", title, sub }: any) {
  return (
    <Card style={{ alignItems: "center", padding: 28 }}>
      <Tile name={icon} bg="#EDF1F6" box={64} size={30} radius={20} iconColor={theme.muted} />
      <Text style={{ fontWeight: "800", color: theme.navyDeep, marginTop: 10, fontSize: 16 }}>{title}</Text>
      {!!sub && <Text style={{ color: theme.muted, fontSize: 12, marginTop: 4, textAlign: "center" }}>{sub}</Text>}
    </Card>
  );
}

export function onTabPress(nav: any, key: string, routeName: string, support?: () => void) {
  if (key === "Support" && support) { support(); return; }
  if (routeName !== key) nav.navigate(key);
}
