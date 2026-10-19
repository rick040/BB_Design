import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { Wordmark } from "../components/Wordmark";
import { dec, decFonts } from "./theme";

export type PageTone = "ice" | "blue" | "deep" | "ink" | "white";

const TONES: Record<PageTone, { bg: string; fg: string; accent: string; chipBg: string; chipFg: string }> = {
  ice: { bg: dec.ice, fg: dec.blue, accent: dec.blue, chipBg: dec.blue, chipFg: dec.white },
  white: { bg: dec.white, fg: dec.blue, accent: dec.blue, chipBg: dec.blue, chipFg: dec.white },
  blue: { bg: dec.blue, fg: dec.white, accent: dec.softBlue, chipBg: dec.white, chipFg: dec.blue },
  deep: { bg: dec.deep, fg: dec.white, accent: dec.softBlue, chipBg: dec.white, chipFg: dec.deep },
  ink: { bg: dec.ink, fg: dec.white, accent: dec.softBlue, chipBg: dec.white, chipFg: dec.ink },
};
export const tone = (t: PageTone) => TONES[t];

/**
 * Achtergrond plus voetregel voor statics, carrouselslides en Stories.
 * Voetregel: woordmerk links, chip rechts (het productmoment: doorsturen
 * en seintje 7 en 2 dagen vooraf). Op 4:5 blijft y < 1180 vrij voor de inhoud,
 * op 9:16 blijft de onderste ~330 px vrij voor Instagram zelf.
 */
export const StaticPage: React.FC<{
  tone: PageTone;
  /** Tekst in de chip. Leeg = geen chip. */
  chip?: string;
  /** Woordmerk tonen. */
  wordmark?: boolean;
  children: React.ReactNode;
}> = ({ tone: t, chip, wordmark = true, children }) => {
  const { height } = useVideoConfig();
  const tall = height > 1500;
  const c = TONES[t];
  const bottom = tall ? 300 : 64;
  return (
    <AbsoluteFill style={{ background: c.bg, overflow: "hidden", fontFamily: decFonts.text }}>
      {children}
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          bottom,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        {wordmark ? (
          <Wordmark size={46} betaal={t === "ice" || t === "white" ? dec.softBlue : dec.softBlue} buddy={t === "ice" || t === "white" ? dec.blue : dec.white} />
        ) : (
          <span />
        )}
        {chip ? (
          <div
            style={{
              background: c.chipBg,
              color: c.chipFg,
              borderRadius: 999,
              padding: "14px 28px",
              fontFamily: decFonts.text,
              fontWeight: 600,
              fontSize: 25,
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {chip}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
