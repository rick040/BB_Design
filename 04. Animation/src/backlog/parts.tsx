import React from "react";
import { Headline, Subline } from "../components/Text";
import { usePalette } from "../lib/palette";
import type { Bg } from "./common";

/** Colours for a scene on a light or blue background. */
export const useBg = (bg: Bg) => {
  const p = usePalette();
  const onBlue = bg === "blue";
  return {
    onBlue,
    bg: onBlue ? p.blue : p.light,
    fg: onBlue ? p.white : p.blue,
    sub: onBlue ? p.blueText : p.blueDim,
    opposite: (onBlue ? "light" : "blue") as Bg,
  };
};

const STAGGER = 3;
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

/**
 * Scene headline. `hook` = fully on screen at frame 0 (the cover frame);
 * otherwise the words pop in from `delay`.
 */
export const Head: React.FC<{ text: string; color: string; hook?: boolean; delay?: number; sizeFactor?: number }> = ({
  text,
  color,
  hook = false,
  delay = 4,
  sizeFactor = 1,
}) =>
  text ? (
    <Headline
      text={text}
      color={color}
      stagger={STAGGER}
      sizeFactor={sizeFactor}
      delay={hook ? -(words(text) * STAGGER) - 14 : delay}
    />
  ) : null;

export const Sub: React.FC<{ text: string; color: string; delay?: number }> = ({ text, color, delay = 16 }) =>
  text ? <Subline text={text} color={color} delay={delay} /> : null;
