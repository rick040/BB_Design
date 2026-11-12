import React from "react";
import { usePalette } from "../lib/palette";
import { fonts } from "../theme";
import type { EigenHuisProps } from "./schema";

// Top-down floor plan of a small first home, in world units (1600 × 1400).
// The camera in EigenHuisAd moves over this one plan for the whole ad.
export const PLAN_W = 1600;
export const PLAN_H = 1400;

/** Doormat centre (world), just inside the front door. */
export const MAT = { x: 900, y: 1320, w: 250, h: 100 };
/** Agenda board on the kitchen wall (world). */
export const AGENDA = { x: 1060, y: 100, w: 480, h: 560 };

const WALL = 24;

export const Plan: React.FC<{
  rooms: EigenHuisProps["rooms"];
  matOpacity: number;
}> = ({ rooms, matOpacity }) => {
  const p = usePalette();
  const wall = p.blue;
  const line = p.blueSoft;
  const floor = "#eef2ff";
  const label = (x: number, y: number, t: string) => (
    <text
      x={x}
      y={y}
      fill="#7d98ff"
      style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 34, letterSpacing: "0.08em" }}
    >
      {t}
    </text>
  );
  // Walls as line segments [x1, y1, x2, y2]; gaps are doorways.
  const walls: [number, number, number, number][] = [
    [0, 0, PLAN_W, 0],
    [0, 0, 0, PLAN_H],
    [PLAN_W, 0, PLAN_W, PLAN_H],
    [0, PLAN_H, 800, PLAN_H],
    [1000, PLAN_H, PLAN_W, PLAN_H],
    [1000, 0, 1000, 440],
    [0, 700, 760, 700],
    [940, 700, PLAN_W, 700],
    [700, 700, 700, 820],
    [700, 960, 700, PLAN_H],
    [1100, 700, 1100, 820],
    [1100, 960, 1100, PLAN_H],
  ];

  return (
    <svg width={PLAN_W} height={PLAN_H} viewBox={`0 0 ${PLAN_W} ${PLAN_H}`} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <rect x={0} y={0} width={PLAN_W} height={PLAN_H} fill={floor} />
      <rect x={700} y={700} width={400} height={700} fill="#e6ecff" />
      {/* furniture, thin soft lines */}
      <g fill="none" stroke={line} strokeWidth={8} strokeLinejoin="round">
        <rect x={110} y={470} width={420} height={150} rx={40} />
        <rect x={140} y={500} width={360} height={60} rx={24} />
        <circle cx={760} cy={300} r={90} />
        <rect x={1030} y={30} width={540} height={110} rx={14} />
        <circle cx={1150} cy={85} r={30} />
        <circle cx={1250} cy={85} r={30} />
        <rect x={60} y={940} width={330} height={420} rx={26} />
        <rect x={90} y={970} width={120} height={80} rx={20} />
        <rect x={240} y={970} width={120} height={80} rx={20} />
        <rect x={1360} y={940} width={210} height={420} rx={90} />
        <circle cx={1200} cy={1300} r={46} />
        {/* front door swing */}
        <path d="M 800 1400 L 800 1220 A 180 180 0 0 1 980 1400" strokeDasharray="14 12" />
      </g>
      {walls.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={wall} strokeWidth={WALL} strokeLinecap="square" />
      ))}
      {label(40, 70, rooms.living)}
      {label(1040, 200, rooms.kitchen)}
      {label(40, 770, rooms.bedroom)}
      {label(1140, 770, rooms.bath)}
      {label(730, 770, rooms.hall)}
      {/* doormat */}
      <g opacity={matOpacity}>
        <rect x={MAT.x - MAT.w / 2} y={MAT.y - MAT.h / 2} width={MAT.w} height={MAT.h} rx={14} fill={p.yellow} />
        <rect x={MAT.x - MAT.w / 2 + 10} y={MAT.y - MAT.h / 2 + 10} width={MAT.w - 20} height={MAT.h - 20} rx={8} fill="none" stroke="#e0a800" strokeWidth={4} strokeDasharray="10 8" />
        <text x={MAT.x} y={MAT.y + 13} textAnchor="middle" fill="#9a6f00" style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 36, letterSpacing: "0.12em" }}>
          {rooms.mat}
        </text>
      </g>
    </svg>
  );
};

export const Envelope: React.FC<{
  label: string;
  sender: string;
  chip: string;
  style?: React.CSSProperties;
}> = ({ label, sender, chip, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: 300,
        height: 190,
        borderRadius: 20,
        background: p.white,
        boxShadow: "0 14px 34px rgba(1, 30, 140, 0.18)",
        fontFamily: fonts.ui,
        boxSizing: "border-box",
        padding: "20px 22px",
        ...style,
      }}
    >
      <svg width={46} height={34} viewBox="0 0 46 34" style={{ position: "absolute", right: 20, top: 20 }}>
        <rect x={2} y={2} width={42} height={30} rx={5} fill="none" stroke={p.blueSoft} strokeWidth={4} />
        <path d="M 4 5 L 23 19 L 42 5" fill="none" stroke={p.blueSoft} strokeWidth={4} strokeLinejoin="round" />
      </svg>
      <div style={{ fontSize: 22, color: p.greyText, fontWeight: 500 }}>{sender}</div>
      <div
        style={{
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: label.length > 10 ? 38 : 50,
          letterSpacing: "-0.04em",
          color: p.blue,
          marginTop: label.length > 10 ? 12 : 4,
          lineHeight: 1.1,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div
        style={{
          position: "absolute",
          left: 22,
          bottom: 18,
          background: p.red,
          color: p.white,
          fontSize: 22,
          fontWeight: 600,
          borderRadius: 14,
          padding: "4px 14px",
        }}
      >
        {chip}
      </div>
    </div>
  );
};

export const Bell: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zm-2.5 15a2.5 2.5 0 0 0 5 0z"
      fill={color}
    />
  </svg>
);
