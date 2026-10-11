import React, { createContext, useContext } from "react";
import { brand } from "../theme";

export type Palette = { [K in keyof typeof brand]: string };

/** The colour props every concept schema exposes (all zColor() strings). */
export type PaletteColors = {
  blue: string;
  light: string;
  softBlue: string;
  bodyOnBlue: string;
  alert: string;
};

const PaletteContext = createContext<Palette>(brand);

export const PaletteProvider: React.FC<{
  colors: PaletteColors;
  children: React.ReactNode;
}> = ({ colors, children }) => {
  const value: Palette = {
    ...brand,
    blue: colors.blue,
    light: colors.light,
    blueSoft: colors.softBlue,
    blueText: colors.bodyOnBlue,
    red: colors.alert,
  };
  return (
    <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
  );
};

export const usePalette = () => useContext(PaletteContext);
