import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  interpolateColors,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { CTA_H, CtaPill } from "../components/CtaPill";
import { SafeZones } from "../components/SafeZones";
import { Headline } from "../components/Text";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../lib/anim";
import { PaletteProvider, usePalette } from "../lib/palette";
import { fonts } from "../theme";
import { BOX_W, BoxBack, BoxFront, DownloadIcon, INK, Lid, Slip } from "./Parts";
import { type DoosProps, SCENE_STARTS, TOTAL_FRAMES, VO_FILE, VOICE_END, wordAt } from "./schema";

// Concept 119 · "Eén lijst. Geen doos."
// One continuous shot, no cuts: the background, headline and objects change
// on the spoken words. All beats are absolute frames from timing.json.
const S = SCENE_STARTS;
export const DOOS_T = {
  openstaat: wordAt("openstaat"), // chip "Wat staat er nog open?"
  toBlue: S[1] - 6, // background light -> blue
  buddyUp: S[1] + 2, // Buddy jumps out of the box
  fly: wordAt("door"), // slips fly into Buddy one by one
  flyStagger: 5,
  flyLen: 12,
  card: S[2], // overview card grows, Buddy hops onto its corner
  rows: wordAt("zet"), // rows land
  rowStagger: 4,
  exportAt: wordAt("exporteren"), // CSV / JSON chips
  cta: S[3], // headline "Eén lijst. Geen doos."
  lidShut: wordAt("geen", 1) + 2, // lid closes
  boxDrop: wordAt("doos"), // box drops out of frame
  button: wordAt("activeer") - 4,
  tap: VOICE_END - 2,
};

const SLIPS = [
  { dx: -160, top: 880, rot: -14 },
  { dx: -50, top: 845, rot: 7 },
  { dx: 70, top: 865, rot: -4 },
  { dx: 175, top: 890, rot: 13 },
  { dx: -115, top: 915, rot: -22 },
  { dx: 120, top: 908, rot: 19 },
];
const BOX_LEFT = 540 - BOX_W / 2;
const BOX_TOP = 1030;
const BUDDY = 200;
const BH = BUDDY * BUDDY_RATIO;
const CARD = { x: 110, y: 700, w: 860, header: 116, row: 88 };
const CARD_H = CARD.header + 6 * CARD.row + 24;

export const DoosAd: React.FC<DoosProps> = (props) => (
  <PaletteProvider colors={props.colors}>
    <Shot {...props} />
  </PaletteProvider>
);

const Shot: React.FC<DoosProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = DOOS_T;

  const bg = interpolateColors(frame, [T.toBlue, T.toBlue + 14], [p.light, p.blue]);

  // ---- box: still in S1/S2, slides down in S3, lid shuts and drops in S4
  const down = pop(frame, fps, T.card, springs.smooth);
  const drop = interpolate(frame, [T.boxDrop, T.boxDrop + 16], [0, 900], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const boxY = 580 * down + drop;
  const boxS = 1 - 0.2 * down;
  const lidClose = interpolate(frame, [T.lidShut, T.lidShut + 8], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const boxWrap = (z: number, child: React.ReactNode): React.ReactNode => (
    <div
      style={{
        position: "absolute",
        left: BOX_LEFT,
        top: BOX_TOP,
        width: BOX_W,
        zIndex: z,
        transform: `translateY(${boxY}px) scale(${boxS}) rotate(${drop * 0.02}deg)`,
        transformOrigin: "50% 0%",
      }}
    >
      {child}
    </div>
  );

  // ---- Buddy
  const up = pop(frame, fps, T.buddyUp, springs.bouncy);
  const hop = interpolate(frame, [T.card, T.card + 18], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const shrink = pop(frame, fps, T.cta, springs.smooth);
  const s2Feet = 1270 - 470 * up;
  const cardFeetX = 540 + (840 - 540) * (1 - 0.28 * shrink);
  const bx = interpolate(hop, [0, 1], [540, cardFeetX]);
  const by = interpolate(hop, [0, 1], [s2Feet, CARD.y + 6]) - Math.sin(Math.PI * hop) * 140;
  let squash = frame < T.buddyUp + 14 ? interpolate(up, [0, 0.7, 1], [1.15, 0.92, 1]) : 1;
  SLIPS.forEach((_, i) => {
    const arrive = T.fly + i * T.flyStagger + T.flyLen;
    squash = Math.min(squash, interpolate(frame, [arrive - 1, arrive + 2, arrive + 7], [1, 0.88, 1], clamp));
  });
  const land = T.card + 18;
  squash = Math.min(squash, interpolate(frame, [land, land + 3, land + 9], [1, 0.84, 1], clamp));
  const look =
    frame < T.card
      ? { x: 0, y: 0.7 }
      : frame < T.button
        ? { x: -0.7, y: 0.6 }
        : { x: -0.4, y: 1 };
  const happy = frame > T.tap + 6 ? 0.2 : 1;
  const buddyZ = frame < T.card + 6 ? 3 : 20;

  // ---- headlines (one shot: old one lifts away, new one pops in)
  const heads = [
    { text: props.hook.headline, start: -15, color: p.blue },
    { text: props.forward.headline, start: S[1], color: p.white },
    { text: props.overview.headline, start: S[2], color: p.white },
    { text: props.cta.headline, start: S[3], color: p.white },
  ];

  const chipIn = pop(frame, fps, T.openstaat, springs.bouncy);
  const chipOut = interpolate(frame, [S[1] - 4, S[1] + 4], [1, 0], clamp);

  const cardIn = pop(frame, fps, T.card, springs.pop);
  const exportIn = (i: number) => pop(frame, fps, T.exportAt + i * 5, springs.bouncy);
  const exportOut = interpolate(frame, [T.cta - 4, T.cta + 6], [1, 0], clamp);

  const btnIn = pop(frame, fps, T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, T.button + 6, springs.pop);
  const tap = interpolate(frame, [T.tap, T.tap + 3, T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [T.tap + 1, T.tap + 18], [0, 1], clamp);
  const logoIn = pop(frame, fps, T.button + 8, springs.smooth);
  const subIn = pop(frame, fps, T.button + 14, springs.smooth);

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {boxWrap(1, <BoxBack />)}

      {/* slips: jiggle in the box, then fly into Buddy */}
      {SLIPS.map((s, i) => {
        const start = T.fly + i * T.flyStagger;
        const u = interpolate(frame, [start, start + T.flyLen], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        if (u >= 1) return null;
        const jig = Math.sin((frame + i * 7) / 5) * (frame < T.openstaat ? 1.5 : 3);
        const x0 = 540 + s.dx;
        const y0 = s.top + 90;
        const tx = 540;
        const ty = 1270 - 470 - BH * 0.55;
        const x = interpolate(u, [0, 1], [x0, tx]);
        const y = interpolate(u, [0, 1], [y0, ty]) - Math.sin(Math.PI * u) * 160;
        const r = s.rot + jig + u * 200;
        const sc = 1 - 0.85 * u;
        const row = props.overview.rows[i];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - 150,
              top: y - 90,
              zIndex: u > 0 ? 6 : 2,
              opacity: u > 0.75 ? (1 - u) * 4 : 1,
              transform: `rotate(${r}deg) scale(${sc})`,
            }}
          >
            <Slip sender={row.sender} amount="€ ?" />
          </div>
        );
      })}

      {/* Buddy */}
      <div style={{ position: "absolute", left: 0, top: 0, zIndex: buddyZ, opacity: frame < S[1] ? 0 : 1 }}>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          look={look}
          blink={Math.min(happy, blinkScale(frame, [T.card + 30, T.button + 12]))}
          style={{ position: "absolute", left: bx - BUDDY / 2, top: by - BH }}
        />
      </div>

      {boxWrap(
        4,
        <>
          <BoxFront label={props.hook.boxLabel} />
          <Lid close={lidClose} />
        </>,
      )}

      {/* "Wat staat er nog open?" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1430,
          zIndex: 8,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, chipIn * 2) * chipOut,
          transform: `scale(${0.5 + 0.5 * chipIn})`,
        }}
      >
        <div
          style={{
            background: INK,
            color: "#fff",
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 44,
            padding: "18px 38px",
            borderRadius: 50,
          }}
        >
          {props.hook.chip}
        </div>
      </div>

      {/* overview card */}
      {frame >= T.card ? (
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD_H,
            zIndex: 10,
            background: p.white,
            borderRadius: 36,
            boxShadow: "0 40px 80px rgba(0, 20, 120, 0.35)",
            transform: `translateY(${(1 - cardIn) * 260}px) scale(${(0.3 + 0.7 * cardIn) * (1 - 0.28 * shrink)})`,
            transformOrigin: "50% 0%",
            opacity: Math.min(1, cardIn * 3),
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: CARD.header,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 44px",
              borderBottom: "2px solid #e8edf2",
            }}
          >
            <div style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 46, color: INK, letterSpacing: "-0.04em" }}>
              {props.overview.title}
            </div>
            <div
              style={{
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 30,
                color: p.blue,
                background: "#e6ecff",
                padding: "8px 22px",
                borderRadius: 30,
              }}
            >
              {props.overview.count}
            </div>
          </div>
          {props.overview.rows.map((r, i) => {
            const s = pop(frame, fps, T.rows + i * T.rowStagger, springs.pop);
            return (
              <div
                key={i}
                style={{
                  height: CARD.row,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 44px",
                  fontFamily: fonts.ui,
                  borderBottom: i < 5 ? "2px solid #f0f3f7" : "none",
                  opacity: Math.min(1, s * 2),
                  transform: `translateY(${(1 - s) * 60}px)`,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    background: i === 0 ? p.yellow : p.blueSoft,
                    marginRight: 22,
                  }}
                />
                <div style={{ flex: 1, fontSize: 34, fontWeight: 600, color: INK }}>{r.sender}</div>
                <div style={{ width: 190, fontSize: 30, color: "#6b7280" }}>{r.due}</div>
                <div style={{ width: 160, textAlign: "right", fontSize: 34, fontWeight: 600, color: INK }}>
                  {r.amount}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* export chips */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CARD.y + CARD_H + 40,
          zIndex: 11,
          display: "flex",
          justifyContent: "center",
          gap: 40,
          opacity: exportOut,
        }}
      >
        {props.overview.exports.map((e, i) => {
          const s = exportIn(i);
          return (
            <div
              key={e}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: p.white,
                color: p.blue,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 40,
                padding: "18px 36px",
                borderRadius: 50,
                opacity: Math.min(1, s * 2),
                transform: `translateY(${(1 - s) * -80}px) scale(${0.4 + 0.6 * s})`,
              }}
            >
              <DownloadIcon size={40} color={p.blue} />
              {e}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1235,
          zIndex: 25,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${1.2 * btnIn * tap})`,
          opacity: Math.min(1, btnIn * 2),
        }}
      >
        <div style={{ position: "relative" }}>
          <CtaPill text={props.cta.button} arrowIn={arrowIn} />
          <div
            style={{
              position: "absolute",
              left: CTA_H / 2 - 90,
              top: CTA_H / 2 - 90,
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: `5px solid ${p.white}`,
              opacity: ripple > 0 ? (1 - ripple) * 0.9 : 0,
              transform: `scale(${0.3 + ripple * 1.2})`,
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1385,
          zIndex: 25,
          display: "flex",
          justifyContent: "center",
          opacity: logoIn,
          transform: `translateY(${(1 - logoIn) * 40}px)`,
        }}
      >
        <Wordmark size={84} betaal={p.blueSoft} buddy={p.white} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 1490,
          zIndex: 25,
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: 42,
          color: p.blueText,
          opacity: subIn,
        }}
      >
        {props.cta.subline}
      </div>

      {/* headlines */}
      {heads.map((h, i) => {
        const next = heads[i + 1]?.start ?? Infinity;
        if (frame >= next + 4) return null;
        if (i > 0 && frame < h.start) return null;
        const out = next === Infinity ? 0 : interpolate(frame, [next - 6, next + 2], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 30,
              opacity: 1 - out,
              transform: `translateY(${-50 * out}px)`,
            }}
          >
            <Headline text={h.text} color={h.color} delay={i === 0 ? h.start : h.start + 2} stagger={i === 0 ? 2 : 3} />
          </div>
        );
      })}

      {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
      {props.showSafeZones ? <SafeZones /> : null}
    </AbsoluteFill>
  );
};

export const DOOS_TOTAL = TOTAL_FRAMES;
