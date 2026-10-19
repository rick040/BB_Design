import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import "../theme";

// Design tokens of the setup page /stel-je-buddy-in/ (v2, 14 okt 2026), so the
// walkthrough looks exactly like the page people land on.
export const bb = {
  blue: "#013bff",
  blueD: "#0026a8",
  ink: "#111827",
  muted: "#5B6270",
  faint: "#9AA1AD",
  bg: "#F6F7F9",
  card: "#ffffff",
  line: "#E6E8EE",
  line2: "#EEF0F4",
  field: "#D3D8E2",
  fieldBg: "#F7F8FA",
  tint: "#E8EEFF",
  tint2: "#F3F6FF",
  tintLine: "#DCE4FF",
  ok: "#0F7B4B",
  okBg: "#E7F6EE",
  okLine: "#CDEBD9",
  okSoft: "#F6FBF8",
  warn: "#8A5A00",
  warnBg: "#FFF6E0",
  barOff: "#DDE1E8",
  // Body copy on the blue intro/outro (page: .bb-ref p).
  onBlue: "#DDE5FF",
  // Generic mail app: neutral on purpose, so it never looks like one brand.
  app: "#2F6FDE",
  appGrey: "#8A8F98",
  appLine: "#E9EAEE",
} as const;

export const wfonts = {
  // Page headings: Poppins 600, -0.02em.
  heading: "'Poppins', system-ui, sans-serif",
  // Page body uses the system UI font; Geist is the bundled stand-in.
  body: "'Geist', system-ui, sans-serif",
  mono: "'Geist Mono', ui-monospace, monospace",
} as const;

loadFont({ family: "Poppins", url: staticFile("fonts/Poppins-Medium.woff2"), weight: "500" });
loadFont({ family: "Poppins", url: staticFile("fonts/Poppins-SemiBold.woff2"), weight: "600" });
loadFont({ family: "Geist Mono", url: staticFile("fonts/GeistMono-Variable.woff2"), weight: "400 700" });
