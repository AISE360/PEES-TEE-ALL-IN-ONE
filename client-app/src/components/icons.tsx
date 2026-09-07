// Professional aligned icon system — Lucide (consistent 24px grid, uniform stroke).
// Usage: <I name="pin" size={20} color="#fff" /> or <Tile name="pin" bg={...} />
import React from "react";
import { View } from "react-native";
import {
  House, MapPin, MapPinned, MessageCircle, Headset, User, Users, Phone, PhoneCall,
  Mail, Search, X, Check, Clock, Timer, FileText, FileCheck, FileBadge, FileClock,
  Receipt, Wallet, Banknote, ChartColumn, Lock, KeyRound, Camera, Image as ImageIcon,
  Paperclip, Bell, Info, ArrowLeft, ArrowRight, ChevronRight, LogOut, Copy,
  RefreshCw, ShieldCheck, Landmark, Scale, Ruler, Compass, HardHat, Truck,
  Handshake, CalendarDays, CircleCheck, Building2, Navigation, Crosshair, Star,
  BadgeCheck, ClipboardList, Package, Briefcase, Download, Send, Globe, Umbrella,
  TentTree, Container, Forklift, Warehouse, ScanFace, LocateFixed, ScrollText,
  ListChecks, NotebookPen,
} from "lucide-react-native";
import { theme } from "../theme";

const MAP: Record<string, React.ComponentType<any>> = {
  home: House, pin: MapPin, mappinned: MapPinned, chat: MessageCircle, headset: Headset,
  user: User, users: Users, phone: Phone, phonecall: PhoneCall, mail: Mail, search: Search,
  x: X, check: Check, clock: Clock, timer: Timer, file: FileText, filecheck: FileCheck,
  filebadge: FileBadge, fileclock: FileClock, receipt: Receipt, wallet: Wallet,
  banknote: Banknote, chart: ChartColumn, lock: Lock, key: KeyRound, camera: Camera,
  image: ImageIcon, paperclip: Paperclip, bell: Bell, info: Info, back: ArrowLeft,
  next: ArrowRight, chevR: ChevronRight, logout: LogOut, copy: Copy, refresh: RefreshCw,
  shield: ShieldCheck, landmark: Landmark, scale: Scale, ruler: Ruler, compass: Compass,
  hardhat: HardHat, truck: Truck, handshake: Handshake, calendar: CalendarDays,
  success: CircleCheck, building: Building2, nav: Navigation, cross: Crosshair, star: Star,
  badge: BadgeCheck, list: ClipboardList, package: Package, briefcase: Briefcase,
  download: Download, send: Send, globe: Globe, umbrella: Umbrella, tent: TentTree,
  container: Container, forklift: Forklift, warehouse: Warehouse, scan: ScanFace,
  locate: LocateFixed, history: ScrollText, clipcheck: ListChecks, note: NotebookPen,
};

export function I({ name, size = 20, color = theme.navyDeep, stroke = 2 }: {
  name: string; size?: number; color?: string; stroke?: number;
}) {
  const C = MAP[name];
  if (!C) return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, opacity: 0.3 }} />;
  return <C width={size} height={size} color={color} strokeWidth={stroke} />;
}

/** Perfectly centered icon in a tinted rounded tile. */
export function Tile({ name, bg, size = 26, box = 56, radius = 18, iconColor = "#fff" }: {
  name: string; bg: string; size?: number; box?: number; radius?: number; iconColor?: string;
}) {
  return (
    <View style={{ width: box, height: box, borderRadius: radius, backgroundColor: bg, alignItems: "center", justifyContent: "center" }}>
      <I name={name} size={size} color={iconColor} />
    </View>
  );
}
