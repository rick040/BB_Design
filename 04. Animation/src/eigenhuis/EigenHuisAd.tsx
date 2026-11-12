import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { CTA_H, CtaPill } from "../components/CtaPill";
import { SafeZones } from "../components/SafeZones";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../lib/anim";
import { PaletteProvider, usePalette } from "../lib/palette";
import { fonts, headlineTracking } from "../theme";
import "../theme";
import { AGENDA, Bell, Envelope, MAT, Plan, PLAN_H, PLAN_W } from "./Plan";
import { CUES, type EigenHuisProps, VO_FILE, VOICE_END, wordAt } from "./schema";

// Concept 79 · "Je eigen huis. Meteen op orde." (plattegrond)
// One continuous shot: the camera never cuts, it only moves over the floor
// plan of a first home. Every beat sits on a spoken word (schema.wordAt).

const [, S2, S3, S4, S5] = CUES;

export const EH_T = {
  // S1 · hook: post drops onto the doormat
  matArrive: [-30, -18, wordAt("dan") - 4, wordAt("rekeningen")],
  pileShake: wordAt("rekeningen") + 4,
  // S2 · each bill flies to its room on its spoken word
  toRoom: [wordAt("huur"), wordAt("energie"), wordAt("internet"), wordAt("zorgverzekering")].map((f) => f - 3),
  flyLen: 14,
  // S3 · forward: Buddy pops up in the hall and swallows them
  buddyIn: S3 - 6,
  toBuddy: [S3, S3 + 8, S3 + 16, S3 + 24],
  // S4 · agenda on the kitchen wall, a row per bill, then bells
  hopToAgenda: S4 - 8,
  hopLen: 18,
  agendaIn: S4 - 8,
  rows: [wordAt("vervaldatum"), wordAt("vervaldatum") + 10, wordAt("in"), wordAt("agenda")],
  nudge: wordAt("met"),
  bells: wordAt("seintje"),
  // S5 · CTA: the doormat becomes the button, Buddy wipes his feet on it
  ctaBlue: S5 - 6,
  hopToMat: S5 - 8,
  hopToMatLen: 22,
  button: S5 + 2,
  wipe: S5 + 20,
  tapHop: VOICE_END + 8,
};

const SCREEN_CX = 540;
const SCREEN_CY = 1030;

type Cam = { x: number; y: number; s: number };
// Camera keys: [frame, focus x, focus y, scale]
const CAM: [number, number, number, number][] = [
  [0, 900, 1110, 1.45],
  [S2 - 14, 900, 1120, 1.52],
  [S2 - 2, 900, 1120, 1.52],
  [S2 + 22, 800, 700, 0.58],
  [S3 - 10, 800, 700, 0.58],
  [S3 + 8, 850, 860, 0.8],
  [S4 - 10, 850, 860, 0.8],
  [S4 + 12, 1300, 380, 1.35],
  [S5 - 8, 1300, 380, 1.42],
  [S5 + 14, 900, 1339, 1.6],
];

const camAt = (f: number): Cam => {
  if (f <= CAM[0][0]) return { x: CAM[0][1], y: CAM[0][2], s: CAM[0][3] };
  for (let i = 0; i < CAM.length - 1; i++) {
    const [f0, x0, y0, s0] = CAM[i];
    const [f1, x1, y1, s1] = CAM[i + 1];
    if (f <= f1) {
      const t = Easing.inOut(Easing.cubic)((f - f0) / (f1 - f0));
      return { x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, s: s0 + (s1 - s0) * t };
    }
  }
  const l = CAM[CAM.length - 1];
  return { x: l[1], y: l[2], s: l[3] };
};

const toScreen = (c: Cam, wx: number, wy: number) => ({
  x: SCREEN_CX + (wx - c.x) * c.s,
  y: SCREEN_CY + (wy - c.y) * c.s,
});

// Where each bill lies (world) on the mat and in its room.
const PILE = [
  { x: 870, y: 880, r: -7 },
  { x: 930, y: 1010, r: 6 },
  { x: 865, y: 1140, r: -4 },
  { x: 935, y: 1260, r: 8 },
];
const ROOM = [
  { x: 400, y: 300, r: -4 },
  { x: 1300, y: 340, r: 5 },
  { x: 470, y: 1120, r: -6 },
  { x: 1340, y: 1120, r: 4 },
];
const HALL_FEET = { x: 900, y: 1090 };
const AGENDA_FEET = { x: 1430, y: AGENDA.y };
const MAT_FEET = { x: 900, y: 1320 - (52 * 1.5) / 1.6 };

const ease = Easing.inOut(Easing.cubic);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Pose = { x: number; y: number; r: number; s: number; o: number };

const billPose = (i: number, f: number): Pose | null => {
  const arrive = EH_T.matArrive[i];
  const room = EH_T.toRoom[i];
  const fwd = EH_T.toBuddy[i];
  const L = EH_T.flyLen;
  const pile = PILE[i];
  const rm = ROOM[i];
  if (f < arrive) return null;
  if (f < arrive + 12) {
    const t = Easing.out(Easing.cubic)((f - arrive) / 12);
    return { x: pile.x, y: lerp(1480, pile.y, t), r: pile.r * t, s: 0.85, o: Math.min(1, t * 3) };
  }
  if (f < room) {
    const sh = f >= EH_T.pileShake && f < EH_T.pileShake + 12 ? Math.sin((f - EH_T.pileShake) * 1.6) * 6 * (1 - (f - EH_T.pileShake) / 12) : 0;
    return { x: pile.x, y: pile.y, r: pile.r + sh, s: 0.85, o: 1 };
  }
  if (f < room + L) {
    const t = ease((f - room) / L);
    return {
      x: lerp(pile.x, rm.x, t),
      y: lerp(pile.y, rm.y, t) - Math.sin(t * Math.PI) * 140,
      r: lerp(pile.r, rm.r, t) + Math.sin(t * Math.PI) * 18,
      s: lerp(0.85, 1.45, t),
      o: 1,
    };
  }
  if (f < fwd) return { x: rm.x, y: rm.y, r: rm.r, s: 1.45, o: 1 };
  if (f < fwd + L) {
    const t = Easing.in(Easing.cubic)((f - fwd) / L);
    const mouth = { x: HALL_FEET.x, y: HALL_FEET.y - 90 };
    return {
      x: lerp(rm.x, mouth.x, t),
      y: lerp(rm.y, mouth.y, t) - Math.sin(t * Math.PI) * 120,
      r: lerp(rm.r, 0, t),
      s: lerp(1.45, 0.15, t),
      o: t > 0.85 ? (1 - t) / 0.15 : 1,
    };
  }
  return null;
};

const hop = (f: number, start: number, len: number, a: { x: number; y: number }, b: { x: number; y: number }, h: number) => {
  const t = ease(Math.min(1, Math.max(0, (f - start) / len)));
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) - Math.sin(t * Math.PI) * h };
};

const SwapHeadline: React.FC<{
  text: string;
  at: number;
  until: number;
  color: string;
  color2?: string;
  size: number;
  top: number;
}> = ({ text, at, until, color, color2, size, top }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at - 4 || frame >= until) return null;
  const out = interpolate(frame, [until - 6, until], [1, 0], clamp);
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.0,
        letterSpacing: headlineTracking,
        opacity: out,
        transform: `translateY(${(1 - out) * -30}px)`,
      }}
    >
      {text.split("\n").map((line, li) => (
        <div key={li} style={{ whiteSpace: "nowrap" }}>
          {line
            .split(/\s+/)
            .filter(Boolean)
            .map((w, i) => {
              const s = pop(frame, fps, at - 2 + 3 * wi++, springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      color: li > 0 && color2 ? color2 : color,
                      opacity: Math.min(1, s * 1.5),
                      transform: `translateY(${(1 - s) * 0.35}em) scale(${0.85 + 0.15 * s})`,
                    }}
                  >
                    {w}
                  </span>{" "}
                </React.Fragment>
              );
            })}
        </div>
      ))}
    </div>
  );
};

const Agenda: React.FC<{ props: EigenHuisProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const inS = pop(frame, fps, EH_T.agendaIn, springs.pop);
  if (frame < EH_T.agendaIn) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: AGENDA.x,
        top: AGENDA.y,
        width: AGENDA.w,
        height: AGENDA.h,
        borderRadius: 30,
        background: p.white,
        boxShadow: "0 24px 60px rgba(1, 30, 140, 0.22)",
        overflow: "hidden",
        transform: `scale(${0.6 + 0.4 * inS})`,
        opacity: Math.min(1, inS * 2),
        transformOrigin: "50% 100%",
        fontFamily: fonts.ui,
      }}
    >
      <div
        style={{
          height: 84,
          background: p.blue,
          color: p.white,
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          fontFamily: fonts.display,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: "-0.03em",
          gap: 16,
        }}
      >
        <svg width={38} height={38} viewBox="0 0 24 24">
          <rect x={3} y={5} width={18} height={16} rx={3} fill="none" stroke={p.white} strokeWidth={2.4} />
          <path d="M3 10h18M8 3v4M16 3v4" stroke={p.white} strokeWidth={2.4} strokeLinecap="round" />
        </svg>
        {props.agenda.month}
      </div>
      {props.bills.map((b, i) => {
        const r = pop(frame, fps, EH_T.rows[i], springs.pop);
        const bell = pop(frame, fps, EH_T.bells + i * 3, springs.bouncy);
        const ring = frame >= EH_T.bells + i * 3 ? Math.sin((frame - EH_T.bells - i * 3) * 0.9) * 18 * Math.max(0, 1 - (frame - EH_T.bells - i * 3) / 24) : 0;
        const [day, date] = b.date.split(" ");
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              top: 108 + i * 110,
              height: 94,
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: Math.min(1, r * 2),
              transform: `translateX(${(1 - r) * -60}px)`,
            }}
          >
            <div
              style={{
                width: 80,
                height: 84,
                borderRadius: 16,
                background: "#e6ecff",
                color: p.blue,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 500 }}>{day}</div>
              <div style={{ fontSize: 38, fontWeight: 700, fontFamily: fonts.display }}>{date}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: b.label.length > 10 ? 28 : 32, fontWeight: 600, color: p.ink, whiteSpace: "nowrap" }}>{b.label}</div>
              <div style={{ fontSize: 26, fontWeight: 500, color: p.blue }}>{b.amount}</div>
            </div>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                background: p.yellow,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${bell}) rotate(${ring}deg)`,
                flexShrink: 0,
              }}
            >
              <Bell size={34} color={p.ink} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Scene: React.FC<{ props: EigenHuisProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const cam = camAt(frame);

  const blue = interpolate(frame, [EH_T.ctaBlue, EH_T.ctaBlue + 16], [0, 1], { ...clamp, easing: ease });
  const btnIn = pop(frame, fps, EH_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, EH_T.button + 8, springs.pop);
  const subIn = pop(frame, fps, EH_T.button + 12, springs.smooth);
  const logoIn = pop(frame, fps, EH_T.button + 8, springs.smooth);
  const tapAt = EH_T.tapHop + 12;
  const tap = interpolate(frame, [tapAt, tapAt + 3, tapAt + 10], [1, 0.92, 1], clamp);
  const ripple = interpolate(frame, [tapAt + 1, tapAt + 20], [0, 1], clamp);

  // ---- Buddy (screen space, so his size stays readable while the camera zooms)
  let feet = HALL_FEET;
  if (frame >= EH_T.hopToAgenda) feet = hop(frame, EH_T.hopToAgenda, EH_T.hopLen, HALL_FEET, AGENDA_FEET, 180);
  if (frame >= EH_T.hopToMat) feet = hop(frame, EH_T.hopToMat, EH_T.hopToMatLen, AGENDA_FEET, MAT_FEET, 160);
  const fs = toScreen(cam, feet.x, feet.y);
  const buddySize = interpolate(frame, [0, EH_T.hopToAgenda, EH_T.hopToAgenda + EH_T.hopLen, EH_T.hopToMat, EH_T.hopToMat + EH_T.hopToMatLen], [130, 130, 150, 150, 210], clamp);
  const bIn = pop(frame, fps, EH_T.buddyIn, springs.bouncy);
  const gulps = EH_T.toBuddy.map((f) => f + EH_T.flyLen);
  const gulpSq = Math.min(...gulps.map((g) => interpolate(frame, [g - 2, g + 2, g + 9], [1, 0.8, 1], clamp)));
  const rowSq = Math.min(...EH_T.rows.map((g) => interpolate(frame, [g - 4, g, g + 7], [1, 0.84, 1], clamp)));
  const landA = EH_T.hopToAgenda + EH_T.hopLen;
  const landM = EH_T.hopToMat + EH_T.hopToMatLen;
  const landSq = Math.min(
    interpolate(frame, [landA, landA + 3, landA + 10], [1, 0.8, 1], clamp),
    interpolate(frame, [landM, landM + 3, landM + 10], [1, 0.8, 1], clamp),
    interpolate(frame, [tapAt, tapAt + 3, tapAt + 10], [1, 0.82, 1], clamp),
  );
  const inSq = frame < EH_T.buddyIn + 14 ? interpolate(bIn, [0, 0.6, 1], [0.6, 1.12, 1]) : 1;
  const wiping = frame >= EH_T.wipe && frame < EH_T.wipe + 24;
  const wipeX = wiping ? Math.sin((frame - EH_T.wipe) * 0.8) * 14 : 0;
  const wipeSq = wiping ? 1 - Math.abs(Math.sin((frame - EH_T.wipe) * 0.8)) * 0.05 : 1;
  const tapLift = frame >= EH_T.tapHop && frame < tapAt ? Math.sin(((frame - EH_T.tapHop) / 12) * Math.PI) * 70 : 0;
  const squash = Math.min(gulpSq, rowSq, landSq, inSq, wipeSq);
  let look = { x: 0, y: 0.2 };
  if (frame >= EH_T.toBuddy[0] - 6 && frame < EH_T.hopToAgenda) {
    const next = EH_T.toBuddy.findIndex((f) => frame < f + EH_T.flyLen);
    const r = ROOM[Math.max(0, next)];
    const dx = r.x - HALL_FEET.x;
    const dy = r.y - HALL_FEET.y;
    const d = Math.hypot(dx, dy);
    look = { x: dx / d, y: dy / d };
  } else if (frame >= landA && frame < EH_T.hopToMat) look = { x: -0.7, y: 0.8 };
  else if (frame >= landM) look = { x: wiping ? 0 : 0.2, y: wiping ? 1 : 0.3 };
  const onBlue = frame >= EH_T.ctaBlue + 8;

  // ---- button sits exactly where the doormat is
  const matS = toScreen(cam, MAT.x, MAT.y);
  const btnScale = 1.5;

  const headTop = 250;
  const H = props.headlines;

  return (
    <AbsoluteFill style={{ background: p.light, overflow: "hidden" }}>
      {/* world: floor plan, agenda and bills all move with one camera */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: PLAN_W,
          height: PLAN_H,
          transformOrigin: "0 0",
          transform: `translate(${SCREEN_CX - cam.x * cam.s}px, ${SCREEN_CY - cam.y * cam.s}px) scale(${cam.s})`,
        }}
      >
        <Plan rooms={props.rooms} matOpacity={1 - btnIn} />
        <Agenda props={props} />
        {props.bills.map((b, i) => {
          const pose = billPose(i, frame);
          if (!pose) return null;
          return (
            <Envelope
              key={i}
              label={b.label}
              sender={b.sender}
              chip={props.unknownDue}
              style={{
                left: pose.x - 150,
                top: pose.y - 95,
                opacity: pose.o,
                transform: `rotate(${pose.r}deg) scale(${pose.s})`,
                zIndex: 10 + i,
              }}
            />
          );
        })}
      </div>

      {/* CTA: the room goes blue, the plan stays faintly visible */}
      <AbsoluteFill style={{ background: p.blue, opacity: blue * 0.93 }} />

      {/* header band keeps the headline clean while the plan moves under it */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 560,
          background: `linear-gradient(${p.light} 0px, ${p.light} 490px, ${p.light}00 560px)`,
          opacity: 1 - blue,
        }}
      />

      {/* doormat → button */}
      {frame >= EH_T.button ? (
        <div
          style={{
            position: "absolute",
            left: matS.x,
            top: matS.y,
            transform: `translate(-50%, -50%) scale(${btnScale * btnIn * tap})`,
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
      ) : null}

      {frame >= EH_T.buddyIn ? (
        <Buddy
          size={buddySize}
          body={onBlue ? p.white : p.blueMascot}
          eye={onBlue ? p.blueMascot : p.white}
          blink={blinkScale(frame, [EH_T.rows[3] + 14, EH_T.wipe + 30, VOICE_END - 30])}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: fs.x - buddySize / 2 + wipeX,
            top: fs.y - buddySize * BUDDY_RATIO - tapLift,
            opacity: Math.min(1, bIn * 3),
            transform: `scale(${0.4 + 0.6 * Math.min(1, bIn)})`,
            transformOrigin: "50% 100%",
          }}
        />
      ) : null}

      {/* headlines follow the voice */}
      <SwapHeadline text={H.hook} at={-20} until={S2} color={p.blue} size={112} top={headTop} />
      <SwapHeadline text={H.rooms} at={S2} until={S3} color={p.blue} size={104} top={headTop} />
      <SwapHeadline text={H.forward} at={S3} until={S4} color={p.blue} size={104} top={headTop} />
      <SwapHeadline text={H.agenda} at={S4} until={EH_T.nudge} color={p.blue} size={100} top={headTop} />
      <SwapHeadline text={H.nudge} at={EH_T.nudge} until={S5 - 4} color={p.blue} size={100} top={headTop} />
      <SwapHeadline text={props.cta.tagline} at={S5} until={100000} color={p.white} color2={p.blueSoft} size={108} top={headTop - 10} />

      {/* CTA subline + wordmark */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: matS.y + 120,
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: 42,
          color: p.blueText,
          opacity: frame >= EH_T.button ? subIn : 0,
        }}
      >
        {props.cta.subline}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: matS.y + 210,
          display: "flex",
          justifyContent: "center",
          opacity: frame >= EH_T.button ? logoIn : 0,
          transform: `translateY(${(1 - logoIn) * 40}px)`,
        }}
      >
        <Wordmark size={92} betaal={p.blueSoft} buddy={p.white} />
      </div>
    </AbsoluteFill>
  );
};

export const EigenHuisAd: React.FC<EigenHuisProps> = (props) => (
  <PaletteProvider colors={props.colors}>
    <Scene props={props} />
    {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
    {props.showSafeZones ? <SafeZones /> : null}
  </PaletteProvider>
);
