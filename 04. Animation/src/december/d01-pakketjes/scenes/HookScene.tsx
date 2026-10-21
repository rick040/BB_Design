import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../../components/Stage";
import { clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline } from "../../text";
import { decFonts, decTracking } from "../../theme";
import { PARCEL_COLORS } from "../CalendarCard";
import { Parcel } from "../Parcel";
import type { PakketjesProps } from "../schema";

// Beats (frames, scene-lokaal).
export const HOOK_T = {
  rowTwo: 3, // 2e laag pakketjes valt (eerste laag ligt er op frame 0 al)
  rowTwoStagger: 3,
  rowThree: 14, // bovenste laag valt
  rowThreeStagger: 4,
  tip: 62, // de stapel begint te kantelen en valt uiteen
  tipLen: 26,
};

const TILE = { x: 250, y: 470, w: 580, h: 400 };
const PW = 190;
const PH = 136;

type Item = { x: number; y: number; r: number; arrive: number; c: number; row: number };
const base = TILE.y;
const PILE: Item[] = [
  // onderste laag: ligt er op frame 0 al
  { x: 247, y: base - PH / 2, r: -2, arrive: -26, c: 0, row: 0 },
  { x: 443, y: base - PH / 2, r: 1.5, arrive: -23, c: 2, row: 0 },
  { x: 637, y: base - PH / 2, r: -1, arrive: -20, c: 3, row: 0 },
  { x: 833, y: base - PH / 2, r: 2, arrive: -17, c: 1, row: 0 },
  // middelste laag
  { x: 345, y: base - PH * 1.5, r: 2, arrive: HOOK_T.rowTwo, c: 1, row: 1 },
  { x: 540, y: base - PH * 1.5, r: -2, arrive: HOOK_T.rowTwo + HOOK_T.rowTwoStagger, c: 4, row: 1 },
  { x: 735, y: base - PH * 1.5, r: 1, arrive: HOOK_T.rowTwo + HOOK_T.rowTwoStagger * 2, c: 0, row: 1 },
  // bovenste laag
  { x: 443, y: base - PH * 2.5, r: -3, arrive: HOOK_T.rowThree, c: 3, row: 2 },
  { x: 637, y: base - PH * 2.5, r: 3, arrive: HOOK_T.rowThree + HOOK_T.rowThreeStagger, c: 2, row: 2 },
];

export const HookScene: React.FC<{ props: PakketjesProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const tile = pop(frame, fps, -10, springs.smooth);
  const tip = interpolate(frame, [HOOK_T.tip, HOOK_T.tip + HOOK_T.tipLen], [0, 1], clamp);
  const tipEase = tip * tip;
  const pileRot = Math.sin(Math.max(0, frame - HOOK_T.tip) / 3) * 1.4 * tip + tipEase * 5;

  return (
    <SceneBg color={p.light}>
      <Stage offsetY={30}>
        {/* Kalendertegel: vrijdag 27 november */}
        <div
          style={{
            position: "absolute",
            left: TILE.x,
            top: TILE.y,
            width: TILE.w,
            height: TILE.h,
            borderRadius: 40,
            background: p.white,
            boxShadow: "0 30px 80px rgba(1, 30, 140, 0.2)",
            overflow: "hidden",
            fontFamily: decFonts.ui,
            transform: `scale(${0.96 + 0.04 * tile})`,
            transformOrigin: "50% 100%",
          }}
        >
          <div
            style={{
              height: 96,
              background: p.blue,
              color: p.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              fontSize: 46,
              letterSpacing: "0.02em",
            }}
          >
            {props.month}
          </div>
          <div
            style={{
              textAlign: "center",
              fontFamily: decFonts.display,
              fontWeight: 500,
              fontSize: 200,
              lineHeight: 1,
              color: p.blue,
              marginTop: 18,
              letterSpacing: decTracking,
            }}
          >
            {props.day}
          </div>
          <div style={{ textAlign: "center", fontWeight: 600, fontSize: 44, color: "#6b7280", marginTop: 4 }}>
            {props.weekday}
          </div>
        </div>

        {/* De stapel pakketjes */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1080,
            height: 900,
            transform: `rotate(${pileRot}deg)`,
            transformOrigin: `540px ${base}px`,
          }}
        >
          {PILE.map((it, i) => {
            const s = pop(frame, fps, it.arrive, springs.pop);
            const col = PARCEL_COLORS[it.c % PARCEL_COLORS.length];
            const slide = it.row === 2 ? tipEase * (i % 2 === 0 ? -150 : 160) : it.row === 1 ? tipEase * (i % 2 === 0 ? -40 : 50) : 0;
            const sink = it.row === 2 ? tipEase * 90 : it.row === 1 ? tipEase * 24 : 0;
            const spin = it.row === 2 ? tipEase * (i % 2 === 0 ? -34 : 38) : it.row === 1 ? tipEase * 10 : 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: it.x - PW / 2 + slide,
                  top: it.y - PH / 2 - (1 - s) * 230 + sink,
                  transform: `rotate(${it.r + spin}deg) scale(${1 + (1 - s) * 0.04})`,
                  opacity: interpolate(frame, [it.arrive - 2, it.arrive + 4], [0, 1], clamp),
                }}
              >
                <Parcel w={PW} h={PH} color={col.body} tape={col.tape} />
              </div>
            );
          })}
        </div>
      </Stage>

      <DHeadline text={props.headline} color={p.blue} delay={-20} stagger={3} />
    </SceneBg>
  );
};
