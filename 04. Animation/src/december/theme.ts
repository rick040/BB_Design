import type { PaletteColors } from "../lib/palette";
// Laadt Space Grotesk en Geist (de BetaalBuddy-huisstijlfonts, gebundeld in public/fonts).
import { fonts, headlineTracking } from "../theme";

// "Buddy houdt het lijstje bij": decembercampagne in de BetaalBuddy-huisstijl.
// Koppen: Space Grotesk Medium (500), tracking -0.06em, regelhoogte ~1.0.
// Lopende tekst: Space Grotesk Regular. UI (meldingen, kaarten, bonnen): Geist 400 tot 600.
// Woordmerk: Space Grotesk Bold. Geen rood, geen gradients, geen foto's.
export const dec = {
  blue: "#013bff",
  deep: "#0026a8",
  ink: "#111827",
  ice: "#e8eeff",
  white: "#ffffff",
  softBlue: "#b6c7ff",
  bodyOnBlue: "#99b1ff",
  grey: "#e8edf2",
  greyText: "#6b7280",
  yellow: "#ffce31",
} as const;

export const decFonts = {
  display: fonts.display,
  text: fonts.display,
  ui: fonts.ui,
} as const;

export const decTracking = headlineTracking;

/** Past in PaletteProvider: geen rood, `alert` is het diepe blauw. */
export const decPalette: PaletteColors = {
  blue: dec.blue,
  light: dec.ice,
  softBlue: dec.softBlue,
  bodyOnBlue: dec.bodyOnBlue,
  alert: dec.deep,
};
