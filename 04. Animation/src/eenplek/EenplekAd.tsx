import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { CTA_H, CtaPill } from "../components/CtaPill";
import { SafeZones } from "../components/SafeZones";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, shake, springs } from "../lib/anim";
import { PaletteProvider, usePalette } from "../lib/palette";
import { fonts, headlineTracking } from "../theme";
import { Download, PANEL_HEAD, PANEL_W, ROW_H, Row, Slip, SLIP_H, SLIP_W, SplitHeadline } from "./components/Parts";
import { type EenplekProps, SCENE_STARTS, VOICE_END, VO_FILE, wordAt } from "./schema";

// Concept 68 · "Alles op één plek." (split screen)
// One continuous shot: a vertical divider splits the frame into
// "zonder Buddy" (light, loose slips) and "met Buddy" (blue, one overview).
// Every beat hangs on a spoken word from public/vo/eenplek/timing.json.
const [S1, S2, S3, S4] = SCENE_STARTS;

export const SPLIT_T = {
  start: S1,
  shuffle: wordAt("nergens"), // the loose slips shuffle
  rightLabel: wordAt("rechts"),
  buddy: wordAt("buddy", 1),
  forward: S2, // slips fly across the divider
  flightStagger: 4,
  flightLen: 16,
};
export const OVERVIEW_T = {
  sweep: S3, // divider sweeps to the left, overview goes full width
  sweepLen: 20,
  sort: wordAt("onder"), // rows sort by due date
  amounts: wordAt("bedrag"),
  dates: wordAt("vervaldatum"),
  export: wordAt("exporteren"),
};
export const CTA_T = {
  collapse: S4 - 4, // rows fold into one card
  collapseLen: 20,
  button: wordAt("activeer"),
  subline: wordAt("activeer") + 12,
  logo: wordAt("activeer") + 6,
  tap: VOICE_END - 2,
};
const SPOKEN = [wordAt("alles"), wordAt("op"), wordAt("één"), wordAt("plek")];

// Scattered slips on the left half (centre x, centre y, rotation).
const SCATTER = [
  { x: 190, y: 720, r: -12 },
  { x: 360, y: 880, r: 9 },
  { x: 175, y: 1040, r: 6 },
  { x: 355, y: 1205, r: -8 },
  { x: 200, y: 1365, r: 11 },
];
// Overview panel pose: in the right half (split) and full width (overview).
const POSE_SPLIT = { x: 585, y: 650, s: 0.5 };
const POSE_FULL = { x: 90, y: 540, s: 1 };
const POSE_CARD = { x: 540 - (PANEL_W * 0.75) / 2, y: 560, s: 0.75 };
const HANDLE_Y = 1262;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = Easing.inOut(Easing.cubic);

const Scene: React.FC<{ props: EenplekProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const bills = props.bills;

  // ── Divider ────────────────────────────────────────────────
  const sweep = interpolate(frame, [OVERVIEW_T.sweep, OVERVIEW_T.sweep + OVERVIEW_T.sweepLen], [0, 1], { ...clamp, easing: ease });
  const D = 540 * (1 - sweep) - 12 * sweep;
  const collapse = interpolate(frame, [CTA_T.collapse, CTA_T.collapse + CTA_T.collapseLen], [0, 1], { ...clamp, easing: ease });

  // ── Panel pose ─────────────────────────────────────────────
  const poseA = { x: lerp(POSE_SPLIT.x, POSE_FULL.x, sweep), y: lerp(POSE_SPLIT.y, POSE_FULL.y, sweep), s: lerp(POSE_SPLIT.s, POSE_FULL.s, sweep) };
  const pose = { x: lerp(poseA.x, POSE_CARD.x, collapse), y: lerp(poseA.y, POSE_CARD.y, collapse), s: lerp(poseA.s, POSE_CARD.s, collapse) };

  // ── Rows: arrival order → sorted by due date ───────────────
  const flightStart = (b: number) => SPLIT_T.forward + 2 + b * SPLIT_T.flightStagger;
  const arrive = (b: number) => flightStart(b) + SPLIT_T.flightLen;
  const rank = bills.map((b, i) => bills.filter((o, j) => o.dueDay < b.dueDay || (o.dueDay === b.dueDay && j < i)).length);
  const sortP = pop(frame, fps, OVERVIEW_T.sort, springs.smooth);
  const rowSlot = (b: number) => lerp(b, rank[b], sortP);
  const panelOpen = pop(frame, fps, -20, springs.smooth);

  // ── Highlights + export ────────────────────────────────────
  const amountsHi = interpolate(frame, [OVERVIEW_T.amounts - 2, OVERVIEW_T.amounts + 12], [0, 1], { ...clamp, easing: ease });
  const datesHi = interpolate(frame, [OVERVIEW_T.dates - 2, OVERVIEW_T.dates + 12], [0, 1], { ...clamp, easing: ease });
  const hiFade = 1 - collapse;
  const chip0 = pop(frame, fps, OVERVIEW_T.export, springs.bouncy);
  const chip1 = pop(frame, fps, OVERVIEW_T.export + 6, springs.bouncy);

  // ── Headlines ──────────────────────────────────────────────
  const hOut = (at: number) => interpolate(frame, [at - 4, at + 2], [1, 0], clamp);

  // ── Buddy ──────────────────────────────────────────────────
  const buddyIn = pop(frame, fps, SPLIT_T.buddy - 3, springs.bouncy);
  const arrivals = bills.map((_, b) => arrive(b));
  const hit = Math.min(...arrivals.map((a) => interpolate(frame, [a - 1, a + 2, a + 8], [1, 0.84, 1], clamp)));
  const restA = { x: 810, feet: 1265, size: 170 };
  const push = { x: D + 120, feet: 1345, size: 150 };
  const restB = { x: 900, feet: 1345, size: 150 };
  const restC = { x: POSE_CARD.x + PANEL_W * POSE_CARD.s + 82, feet: 810, size: 140 };
  const hop = interpolate(frame, [OVERVIEW_T.sweep + OVERVIEW_T.sweepLen, OVERVIEW_T.sweep + OVERVIEW_T.sweepLen + 14], [0, 1], { ...clamp, easing: ease });
  const toPush = interpolate(frame, [OVERVIEW_T.sweep - 6, OVERVIEW_T.sweep + 2], [0, 1], { ...clamp, easing: ease });
  let bx: number, bf: number, bs: number;
  if (frame < OVERVIEW_T.sweep + OVERVIEW_T.sweepLen) {
    bx = lerp(restA.x, push.x, toPush);
    bf = lerp(restA.feet, push.feet, toPush);
    bs = lerp(restA.size, push.size, toPush);
  } else if (frame < CTA_T.collapse) {
    bx = lerp(push.x, restB.x, hop);
    bf = lerp(push.feet, restB.feet, hop) - 20 * Math.abs(Math.sin(3 * Math.PI * hop));
    bs = lerp(push.size, restB.size, hop);
  } else {
    bx = lerp(restB.x, restC.x, collapse);
    bf = lerp(restB.feet, restC.feet, collapse) - 120 * Math.sin(Math.PI * collapse);
    bs = lerp(restB.size, restC.size, collapse);
  }
  const lean = interpolate(frame, [CTA_T.collapse + CTA_T.collapseLen, CTA_T.collapse + CTA_T.collapseLen + 10], [0, -9], clamp);
  const pushSquash = frame >= OVERVIEW_T.sweep && frame < OVERVIEW_T.sweep + OVERVIEW_T.sweepLen ? 0.9 : 1;
  const landSq = interpolate(frame, [OVERVIEW_T.sweep + OVERVIEW_T.sweepLen + 14, OVERVIEW_T.sweep + OVERVIEW_T.sweepLen + 17, OVERVIEW_T.sweep + OVERVIEW_T.sweepLen + 23], [1, 0.82, 1], clamp);
  const cardSq = interpolate(frame, [CTA_T.collapse + CTA_T.collapseLen, CTA_T.collapse + CTA_T.collapseLen + 3, CTA_T.collapse + CTA_T.collapseLen + 9], [1, 0.84, 1], clamp);
  const squash = frame < SPLIT_T.buddy + 12 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : Math.min(hit, pushSquash, landSq, cardSq);
  let look = { x: -0.6, y: 0.2 };
  if (frame >= SPLIT_T.forward && frame < arrive(4) + 4) look = { x: -0.9, y: -0.4 };
  else if (frame >= OVERVIEW_T.sweep && frame < OVERVIEW_T.sweep + OVERVIEW_T.sweepLen) look = { x: -1, y: 0 };
  else if (frame >= OVERVIEW_T.sweep + OVERVIEW_T.sweepLen && frame < OVERVIEW_T.export) look = { x: -0.7, y: -0.8 };
  else if (frame >= OVERVIEW_T.export && frame < CTA_T.collapse) look = { x: -0.9, y: 0.4 };
  else if (frame >= CTA_T.collapse) look = { x: -0.5, y: 0.2 };
  const happy = frame >= CTA_T.tap + 6 ? 0.18 : blinkScale(frame, [SPLIT_T.buddy + 20, OVERVIEW_T.dates + 18, CTA_T.button + 20]);

  // ── CTA ────────────────────────────────────────────────────
  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const labelSwap = interpolate(frame, [CTA_T.collapse + 8, CTA_T.collapse + 18], [0, 1], clamp);

  const sh = shake(frame, SPLIT_T.shuffle, 18, 16);
  const labelsOut = hOut(OVERVIEW_T.sweep);

  return (
    <AbsoluteFill style={{ background: p.blue, overflow: "hidden" }}>
      {/* Left half: light, loose slips */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: Math.max(0, D), overflow: "hidden", background: p.light }}>
        {/* Sticky note */}
        <div
          style={{
            position: "absolute",
            left: 300 + sh.x,
            top: 1440,
            width: 210,
            height: 120,
            background: p.yellow,
            transform: `rotate(${-7 + Math.sin(frame / 14) * 1.5}deg)`,
            boxShadow: "0 12px 26px rgba(120, 90, 0, 0.2)",
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 30,
            color: p.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {props.split.note}
        </div>
      </div>

      {/* Divider + slider handle */}
      {D > -10 ? (
        <>
          <div style={{ position: "absolute", left: D - 4, top: 0, width: 8, height: 1920, background: p.white, boxShadow: "0 0 30px rgba(0,20,120,0.3)" }} />
          <div
            style={{
              position: "absolute",
              left: D - 48,
              top: HANDLE_Y - 48,
              width: 96,
              height: 96,
              borderRadius: 48,
              background: p.white,
              boxShadow: "0 12px 30px rgba(0,20,120,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: p.blue,
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 44,
            }}
          >
            <svg width={56} height={30} viewBox="0 0 56 30">
              <path d="M18 4 L6 15 L18 26 M38 4 L50 15 L38 26" fill="none" stroke={p.blue} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </>
      ) : null}

      {/* Side labels */}
      <div style={{ position: "absolute", left: 0, width: Math.max(0, D), top: 500, display: "flex", justifyContent: "center", opacity: labelsOut, overflow: "hidden" }}>
        <Label text={props.split.leftLabel} bg={p.grey} color={p.ink} />
      </div>
      <div
        style={{
          position: "absolute",
          left: Math.max(0, D),
          right: 0,
          top: 500,
          display: "flex",
          justifyContent: "center",
          opacity: labelsOut * Math.min(1, pop(frame, fps, SPLIT_T.rightLabel, springs.pop) * 1.5),
        }}
      >
        <Label text={props.split.rightLabel} bg="rgba(255,255,255,0.16)" color={p.white} />
      </div>

      {/* Overview panel */}
      <div
        style={{
          position: "absolute",
          left: pose.x,
          top: pose.y,
          width: PANEL_W,
          height: lerp(PANEL_HEAD + 5 * ROW_H + 10, PANEL_HEAD + ROW_H + 4 * 14 + 10, collapse),
          transform: `scale(${pose.s * (0.9 + 0.1 * panelOpen)})`,
          transformOrigin: "0 0",
          background: p.white,
          borderRadius: 38,
          boxShadow: "0 30px 80px rgba(0, 10, 90, 0.35)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", left: 40, top: 26, fontFamily: fonts.display, fontWeight: 500, fontSize: 50, color: p.blue, letterSpacing: "-0.04em" }}>
          {props.overview.title}
        </div>
        <div style={{ position: "absolute", right: 40, top: 40, fontFamily: fonts.ui, fontSize: 30, color: p.greyText, opacity: 1 - labelSwap }}>
          {props.overview.month}
        </div>
        <div style={{ position: "absolute", right: 40, top: 38, fontFamily: fonts.ui, fontWeight: 600, fontSize: 32, color: p.blueMascot, opacity: labelSwap }}>
          {props.cta.cardLabel}
        </div>
        {/* Column highlights */}
        <div
          style={{
            position: "absolute",
            left: 515,
            top: PANEL_HEAD + 8,
            width: 140,
            height: (5 * ROW_H - 16) * datesHi,
            borderRadius: 24,
            background: "rgba(182, 199, 255, 0.55)",
            opacity: hiFade,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 22,
            top: PANEL_HEAD + 8,
            width: 200,
            height: (5 * ROW_H - 16) * amountsHi,
            borderRadius: 24,
            background: "rgba(255, 206, 49, 0.5)",
            opacity: hiFade,
          }}
        />
        {bills
          .map((bill, b) => ({ bill, b }))
          .sort((a, c) => rowSlot(c.b) - rowSlot(a.b))
          .map(({ bill, b }) => {
            const slot = rowSlot(b);
            const sorted = rank[b];
            const fill = interpolate(frame, [arrive(b) - 2, arrive(b) + 4], [0, 1], clamp) * (sorted === 0 ? 1 : 1 - collapse);
            const flash = interpolate(frame, [arrive(b) - 1, arrive(b) + 3, arrive(b) + 16], [0, 1, 0], clamp);
            const yFull = PANEL_HEAD + slot * ROW_H;
            const yCard = PANEL_HEAD + sorted * 14;
            const y = lerp(yFull, yCard, collapse);
            const sc = lerp(1, 1 - sorted * 0.035, collapse);
            return <Row key={b} bill={bill} y={y} fill={fill} flash={flash} scale={sc} shadow={collapse * (sorted === 0 ? 0 : 1)} />;
          })
}
      </div>

      {/* Export chips */}
      <div style={{ position: "absolute", left: 90, top: 1225, display: "flex", gap: 22, opacity: 1 - collapse }}>
        {props.overview.exportChips.map((c, i) => {
          const s = i === 0 ? chip0 : chip1;
          return (
            <div
              key={c}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "16px 30px",
                borderRadius: 40,
                border: `3px solid ${p.white}`,
                color: p.white,
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 36,
                opacity: Math.min(1, s * 2),
                transform: `translateY(${(1 - s) * 30}px) scale(${0.6 + 0.4 * s})`,
              }}
            >
              <Download size={34} color={p.white} />
              {c}
            </div>
          );
        })}
      </div>

      {/* Loose slips (above everything while they fly) */}
      {bills.map((bill, b) => {
        const sc = SCATTER[b];
        const u = interpolate(frame, [flightStart(b), arrive(b)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
        if (u >= 1) return null;
        const drift = Math.sin(frame / 18 + b * 1.7) * 6;
        const jitter = shake(frame, SPLIT_T.shuffle + b * 2, 16, 20);
        const tx = POSE_SPLIT.x + POSE_SPLIT.s * (PANEL_W / 2);
        const ty = POSE_SPLIT.y + POSE_SPLIT.s * (PANEL_HEAD + b * ROW_H + ROW_H / 2);
        const x = lerp(sc.x + jitter.x, tx, u);
        const y = lerp(sc.y + drift + jitter.y, ty, u) - 240 * Math.sin(Math.PI * u);
        const rot = lerp(sc.r + jitter.r * 6, 0, u);
        const scale = lerp(1, 0.45, u);
        return (
          <Slip
            key={b}
            bill={bill}
            style={{
              left: x - SLIP_W / 2,
              top: y - SLIP_H / 2,
              transform: `rotate(${rot}deg) scale(${scale})`,
              opacity: interpolate(u, [0.8, 1], [1, 0], clamp),
            }}
          />
        );
      })}

      {/* Buddy */}
      <Buddy
        size={bs}
        body={p.white}
        eye={p.blueMascot}
        blink={happy}
        squash={squash}
        look={look}
        style={{
          position: "absolute",
          left: bx - bs / 2,
          top: bf - bs * BUDDY_RATIO,
          opacity: Math.min(1, buddyIn * 3),
          transform: `scale(${0.4 + 0.6 * Math.min(1, buddyIn)}) rotate(${lean}deg)`,
          transformOrigin: "50% 100%",
        }}
      />

      {/* Headlines */}
      {frame < S2 + 2 ? <SplitHeadline text={props.split.headline} divider={D} delay={-15} stagger={2} sizeFactor={0.88} opacity={hOut(S2)} /> : null}
      {frame >= S2 - 4 && frame < S3 + 2 ? <SplitHeadline text={props.forward.headline} divider={D} delay={S2 - 2} stagger={3} opacity={hOut(S3)} /> : null}
      {frame >= S3 - 4 && frame < S4 + 2 ? <SplitHeadline text={props.overview.headline} divider={D} delay={S3 - 2} stagger={3} opacity={hOut(S4)} /> : null}
      {frame >= S4 - 4 ? <Tagline text={props.cta.tagline} /> : null}

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 880,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${1.3 * btnIn * tap})`,
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
          left: 60,
          right: 60,
          top: 1070,
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: 44,
          color: p.blueText,
          opacity: subIn,
        }}
      >
        {props.cta.subline}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1180,
          display: "flex",
          justifyContent: "center",
          opacity: logoIn,
          transform: `translateY(${(1 - logoIn) * 40}px)`,
        }}
      >
        <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
      </div>
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text: string; bg: string; color: string }> = ({ text, bg, color }) => (
  <div style={{ padding: "12px 30px", borderRadius: 40, background: bg, color, fontFamily: fonts.ui, fontWeight: 600, fontSize: 34, whiteSpace: "nowrap" }}>
    {text}
  </div>
);

const Tagline: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const lines = text.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        top: 240,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 500,
        fontSize: 125,
        lineHeight: 1.0,
        letterSpacing: headlineTracking,
      }}
    >
      {lines.map((words, li) => (
        <div key={li}>
          {words.map((w, i) => {
            const at = SPOKEN[wi] ?? SPOKEN[SPOKEN.length - 1];
            wi++;
            const s = pop(frame, fps, at - 3, springs.pop);
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: "inline-block",
                    color: li === 0 ? p.white : p.blueSoft,
                    opacity: Math.min(1, s * 1.4),
                    transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                    filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
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

export const EenplekAd: React.FC<EenplekProps> = (props) => (
  <PaletteProvider colors={props.colors}>
    <Scene props={props} />
    {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
    {props.showSafeZones ? <SafeZones /> : null}
  </PaletteProvider>
);
