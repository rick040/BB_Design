import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Brand tokens, sampled from the assets in 01. Logo / 02. Elements / 03. Mockups.
export const brand = {
  blue: "#013bff", // primary background + headline blue
  blueMid: "#2459fd", // CTA arrow circle, app icon middle layer
  blueMascot: "#0046e2", // mascot body (blue version)
  blueSoft: "#b6c7ff", // "betaal" in the wordmark, app icon top layer
  blueText: "#99b1ff", // body copy on blue
  blueDim: "#4d76ff", // small print on blue
  light: "#fafbff", // light background
  white: "#ffffff",
  card: "#fffdff", // notification card
  grey: "#e8edf2", // icon circle, skeleton bars
  greyText: "#b1afb2", // notification subtitle / time
  ink: "#111114", // notification title
  yellow: "#ffce31",
  red: "#ff5a79",
  teal: "#4fd1d9",
} as const;

export const fonts = {
  display: "'Space Grotesk', system-ui, sans-serif",
  ui: "'Geist', system-ui, sans-serif",
} as const;

// Headlines in the mockups use Space Grotesk Medium with -0.06em tracking.
export const headlineTracking = "-0.06em";

// Fonts are bundled in public/fonts so renders never depend on a network
// font service. loadFont() blocks rendering until the files are ready.
loadFont({
  family: "Space Grotesk",
  url: staticFile("fonts/SpaceGrotesk-Variable.woff2"),
  weight: "300 700",
});
loadFont({
  family: "Geist",
  url: staticFile("fonts/Geist-Variable.woff2"),
  weight: "100 900",
});
