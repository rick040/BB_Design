import React from "react";
import { interpolate } from "remotion";
import { Checkmark } from "../components/Checkmark";
import { clamp } from "../lib/anim";
import { usePalette } from "../lib/palette";
import { fonts, headlineTracking } from "../theme";

// Building blocks for concept 83 (rolmaat). World coordinates are 1080 px
// wide at zoom 1; the camera in RolmaatAd moves and scales the whole world.

export const TAPE_Y = 1262; // top edge of the tape
export const TAPE_H = 46;
export const DAY = 70; // px per day on the ruler
export const ZERO_X = 540; // world x of "vandaag"
export const HOUSING = { x: 330, y: 1172, w: 196, h: 176 };
export const CARD_W = 640;
export const CARD_TOP = 590;

/** The rolmaat housing the tape comes out of. */
export const Housing: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: HOUSING.x,
        top: HOUSING.y,
        width: HOUSING.w,
        height: HOUSING.h,
        borderRadius: 46,
        background: p.blueMid,
        boxShadow: "0 24px 50px rgba(1, 40, 160, 0.22)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 34,
          top: 30,
          width: 116,
          height: 116,
          borderRadius: "50%",
          border: `14px solid ${p.blueSoft}`,
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -8,
          top: TAPE_Y - HOUSING.y - 8,
          width: 26,
          height: TAPE_H + 16,
          borderRadius: 8,
          background: p.blueMascot,
        }}
      />
    </div>
  );
};

/** Yellow tape from the housing mouth to the tip, with the metal hook. */
export const Tape: React.FC<{ tipX: number }> = ({ tipX }) => {
  const p = usePalette();
  const from = HOUSING.x + HOUSING.w + 10;
  const w = Math.max(0, tipX - from);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: from,
          top: TAPE_Y,
          width: w,
          height: TAPE_H,
          background: `repeating-linear-gradient(90deg, rgba(17,17,20,0.55) 0 3px, transparent 3px ${DAY / 2}px), ${p.yellow}`,
          backgroundPosition: `${tipX - from}px 0`,
          backgroundSize: `${DAY / 2}px 18px, 100% 100%`,
          backgroundRepeat: "repeat-x, no-repeat",
          boxShadow: "0 8px 18px rgba(120, 90, 0, 0.18)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: tipX - 6,
          top: TAPE_Y - 16,
          width: 14,
          height: TAPE_H + 22,
          borderRadius: 4,
          background: "#6b6b78",
        }}
      />
    </>
  );
};

/** Day ruler printed on the floor under the tape. */
export const Ruler: React.FC<{
  days: number;
  todayDate: number;
  today: string;
  dueDays: number;
  dueLabel: string;
  endDays: number;
  endLabel: string;
  dueGlow: number;
  endGlow: number;
}> = ({ days, todayDate, today, dueDays, dueLabel, endDays, endLabel, dueGlow, endGlow }) => {
  const p = usePalette();
  const y = TAPE_Y + TAPE_H + 14;
  const ticks = [];
  for (let d = 0; d <= days; d++) {
    const x = ZERO_X + d * DAY;
    const key = d === 0 || d === dueDays || d === endDays;
    ticks.push(
      <React.Fragment key={d}>
        <div
          style={{
            position: "absolute",
            left: x - 2,
            top: y,
            width: 4,
            height: key ? 40 : 22,
            borderRadius: 2,
            background: key ? p.blue : p.greyText,
          }}
        />
        {!key ? (
          <div
            style={{
              position: "absolute",
              left: x - 30,
              width: 60,
              top: y + 28,
              textAlign: "center",
              fontFamily: fonts.ui,
              fontSize: 26,
              color: p.greyText,
            }}
          >
            {((todayDate + d - 1) % 31) + 1}
          </div>
        ) : null}
      </React.Fragment>,
    );
  }
  const Label: React.FC<{ d: number; text: string; glow: number; color: string }> = ({ d, text, glow, color }) => (
    <div
      style={{
        position: "absolute",
        left: ZERO_X + d * DAY - 200,
        width: 400,
        top: y + 50,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          padding: "8px 22px 10px",
          borderRadius: 30,
          background: glow > 0 ? color : "transparent",
          color: glow > 0.5 ? "#fff" : p.blue,
          fontFamily: fonts.ui,
          fontWeight: 600,
          fontSize: 32,
          whiteSpace: "nowrap",
          transform: `scale(${1 + glow * 0.12})`,
          opacity: 0.75 + glow * 0.25,
        }}
      >
        {text}
      </div>
    </div>
  );
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: ZERO_X - 40,
          top: y - 6,
          width: days * DAY + 80,
          height: 6,
          borderRadius: 3,
          background: p.grey,
        }}
      />
      {ticks}
      <Label d={0} text={today} glow={0} color={p.blue} />
      <Label d={dueDays} text={dueLabel} glow={dueGlow} color={p.blue} />
      <Label d={endDays} text={endLabel} glow={endGlow} color={p.ink} />
    </>
  );
};

/** The bill as a tag hanging from the tape tip. */
export const BillTag: React.FC<{
  sender: string;
  subject: string;
  fields: { label: string; value: string }[];
  /** Per field 0..1: 1 = present, 0 = dissolved. */
  present: number[];
  /** 0..1: switches the header to the inzage title and adds the kept row. */
  inzage: number;
  inzageTitle: string;
  keptLabel: string;
  keptValue: string;
  /** Per field 0..1 highlight sweep. */
  highlight: number[];
  goneLabel: string;
}> = ({ sender, subject, fields, present, inzage, inzageTitle, keptLabel, keptValue, highlight, goneLabel }) => {
  const p = usePalette();
  const allGone = Math.max(...present) < 0.02;
  const solid = interpolate(Math.max(...present), [0, 0.6], [0, 1], clamp);
  const rowH = 64;
  return (
    <div
      style={{
        width: CARD_W,
        borderRadius: 44,
        background: `rgba(255,255,255,${solid})`,
        border: `4px dashed rgba(177,175,178,${1 - solid})`,
        boxShadow: `0 30px 80px rgba(1, 40, 160, ${0.14 * solid})`,
        padding: "30px 40px 28px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22, height: 84, opacity: solid }}>
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: "50%",
            background: inzage > 0.5 ? p.blue : p.grey,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 600,
            color: inzage > 0.5 ? "#fff" : p.blueMid,
            flexShrink: 0,
          }}
        >
          {inzage > 0.5 ? "@" : sender[0]}
        </div>
        <div style={{ flex: 1, minWidth: 0, position: "relative", height: 84 }}>
          <div style={{ position: "absolute", top: 4, opacity: 1 - inzage }}>
            <div style={{ fontSize: 34, fontWeight: 600, color: p.ink }}>{sender}</div>
            <div style={{ fontSize: 28, color: p.greyText }}>{subject}</div>
          </div>
          <div
            style={{
              position: "absolute",
              top: 20,
              opacity: inzage,
              fontSize: 36,
              fontWeight: 600,
              color: p.blue,
              whiteSpace: "nowrap",
            }}
          >
            {inzageTitle}
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14 }}>
        {fields.map((f, i) => {
          const s = present[i];
          return (
            <div
              key={i}
              style={{
                height: rowH,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: `2px solid rgba(232,237,242,${s})`,
                opacity: s,
                filter: `blur(${(1 - s) * 10}px)`,
                transform: `translateY(${(1 - s) * -26}px)`,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -14,
                  top: 8,
                  bottom: 8,
                  width: `calc(${highlight[i] * 100}% + 28px)`,
                  maxWidth: CARD_W - 52,
                  borderRadius: 14,
                  background: "rgba(255, 206, 49, 0.42)",
                  opacity: highlight[i] > 0 ? 1 : 0,
                }}
              />
              <span style={{ fontSize: 32, color: "#6b6b78", position: "relative" }}>{f.label}</span>
              <span
                style={{
                  fontSize: 34,
                  fontWeight: 600,
                  color: p.ink,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {f.value === "✓" ? <Checkmark size={40} color={p.blue} progress={1} /> : f.value}
              </span>
            </div>
          );
        })}
        <div
          style={{
            height: rowH * inzage,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid rgba(232,237,242,${inzage})`,
            opacity: inzage,
          }}
        >
          <span style={{ fontSize: 32, color: "#6b6b78" }}>{keptLabel}</span>
          <span
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: "#fff",
              background: p.ink,
              borderRadius: 24,
              padding: "4px 18px 6px",
            }}
          >
            {keptValue}
          </span>
        </div>
      </div>
      {allGone ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: 96,
            letterSpacing: headlineTracking,
            color: p.greyText,
          }}
        >
          {goneLabel}
        </div>
      ) : null}
    </div>
  );
};

/** Mail pill with an envelope icon. */
export const MailPill: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 16,
        height: 84,
        padding: "0 34px 0 24px",
        borderRadius: 42,
        background: p.blue,
        color: "#fff",
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: 38,
        boxShadow: "0 18px 40px rgba(1, 40, 160, 0.3)",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      <svg width={44} height={44} viewBox="0 0 40 40">
        <rect x="4" y="9" width="32" height="23" rx="5" fill="none" stroke="#fff" strokeWidth="3" />
        <path d="M6 12l14 10 14-10" fill="none" stroke="#fff" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      {text}
    </div>
  );
};
