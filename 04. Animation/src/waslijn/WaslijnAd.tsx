import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, interpolateColors, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { SafeZones } from "../components/SafeZones";
import { clamp } from "../lib/anim";
import { PaletteProvider } from "../lib/palette";
import "../theme";
import { Peg } from "./components/Laundry";
import { SCENE_STARTS, VO_FILE, type WaslijnProps } from "./schema";
import { CtaScene } from "./scenes/CtaScene";
import { HookPanel } from "./scenes/HookPanel";
import { LinePanel } from "./scenes/LinePanel";

// Concept 99 · "Alles in het zicht." (waslijn)
// Eén doorlopend shot: de camera pant van de dichte doos (licht) naar de
// waslijn (blauw), met de achtergrond die meekleurt. Scène 3 speelt op
// dezelfde lijn. Een waslaken waait de CTA in beeld.
export const PAN = { from: SCENE_STARTS[1] - 8, to: SCENE_STARTS[1] + 12 };
export const SHEET = { from: SCENE_STARTS[3] - 12, to: SCENE_STARTS[3] + 12 };
const SHEET_W = 760;

export const WaslijnAd: React.FC<WaslijnProps> = (props) => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  const c = props.colors;

  const pan = interpolate(frame, [PAN.from, PAN.to], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const camX = pan * width;
  const bg = interpolateColors(pan, [0, 1], [c.light, c.blue]);

  // Laken: linkerrand s loopt van -SHEET_W tot width; links ervan staat de CTA.
  const w = interpolate(frame, [SHEET.from, SHEET.to], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const s = -SHEET_W + w * (width + SHEET_W);
  const wiping = frame >= SHEET.from && frame < SHEET.to;
  const showLine = frame < SHEET.to;
  const showCta = frame >= SHEET.from;

  return (
    <PaletteProvider colors={c}>
      <AbsoluteFill style={{ background: bg }}>
        {frame < PAN.to + 2 ? (
          <AbsoluteFill style={{ transform: `translateX(${-camX}px)` }}>
            <HookPanel props={props.hook} bill={props.bill} dark={c.alert} />
          </AbsoluteFill>
        ) : null}
        {frame >= PAN.from && showLine ? (
          <AbsoluteFill
            style={{
              transform: `translateX(${width - camX}px)`,
              clipPath: wiping ? `inset(0 0 0 ${Math.max(0, s + SHEET_W - 40)}px)` : undefined,
            }}
          >
            <LinePanel line={props.line} gone={props.gone} bill={props.bill} />
          </AbsoluteFill>
        ) : null}
        {showCta ? (
          <AbsoluteFill style={{ clipPath: wiping ? `inset(0 ${Math.max(0, width - s - 40)}px 0 0)` : undefined }}>
            <CtaScene props={props.cta} />
          </AbsoluteFill>
        ) : null}
        {wiping ? <Sheet left={s} color={c.light} edge={c.softBlue} /> : null}
        {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
        {props.showSafeZones ? <SafeZones /> : null}
      </AbsoluteFill>
    </PaletteProvider>
  );
};

/** Waslaken dat door het beeld waait: plooien, golvende randen, knijpers bovenaan. */
const Sheet: React.FC<{ left: number; color: string; edge: string }> = ({ left, color, edge }) => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const wave = (k: number) => 22 * Math.sin(frame * 0.5 + k);
  const pts: string[] = [];
  const steps = 12;
  for (let i = 0; i <= steps; i++) pts.push(`${40 + wave(i * 0.9)},${(height * i) / steps}`);
  const right: string[] = [];
  for (let i = steps; i >= 0; i--) right.push(`${SHEET_W - 40 + wave(i * 0.9 + 2)},${(height * i) / steps}`);
  return (
    <div style={{ position: "absolute", left, top: 0, width: SHEET_W, height, transform: "skewX(-4deg)" }}>
      <svg width={SHEET_W} height={height} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          <linearGradient id="sheetFolds" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={color} />
            <stop offset="0.2" stopColor={edge} stopOpacity={0.55} />
            <stop offset="0.38" stopColor={color} />
            <stop offset="0.62" stopColor={edge} stopOpacity={0.45} />
            <stop offset="0.8" stopColor={color} />
            <stop offset="1" stopColor={edge} stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <polygon points={[...pts, ...right].join(" ")} fill={color} />
        <polygon points={[...pts, ...right].join(" ")} fill="url(#sheetFolds)" opacity={0.6} />
      </svg>
      {[0.2, 0.5, 0.8].map((k) => (
        <div key={k} style={{ position: "absolute", left: SHEET_W * k - 17, top: 120 }}>
          <Peg color="#ffce31" size={1.2} />
        </div>
      ))}
    </div>
  );
};
