import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import type { PaletteColors } from "../lib/palette";

// "Buddy houdt het lijstje bij": decembercampagne. Spelregels uit het
// campagnebestand: Archivo Black en Poppins, kleuren #013bff, #0026a8,
// #111827 en #E8EEFF, geen rood, geen gradients, geen foto's.
//
// Wil je terug naar de Space Grotesk-huisstijl van de andere concepten
// (open beslissing in het campagnebestand)? Pas dan alleen `decFonts` hieronder aan.
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
  display: "'Archivo Black', 'Space Grotesk', system-ui, sans-serif",
  text: "'Poppins', 'Geist', system-ui, sans-serif",
} as const;

/** Past in PaletteProvider: geen rood, `alert` is het diepe blauw. */
export const decPalette: PaletteColors = {
  blue: dec.blue,
  light: dec.ice,
  softBlue: dec.softBlue,
  bodyOnBlue: dec.bodyOnBlue,
  alert: dec.deep,
};

loadFont({
  family: "Archivo Black",
  url: staticFile("fonts/ArchivoBlack-Regular.woff2"),
  weight: "400",
});
for (const w of ["400", "500", "600", "700"]) {
  loadFont({
    family: "Poppins",
    url: staticFile(`fonts/Poppins-${w}.woff2`),
    weight: w,
  });
}
loadFont({
  family: "Poppins",
  url: staticFile("fonts/Poppins-400-italic.woff2"),
  weight: "400",
  style: "italic",
});
// Het woordmerk en de UI-onderdelen uit de huisstijl blijven Space Grotesk en Geist.
import "../theme";
