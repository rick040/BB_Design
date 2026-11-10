import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { CTA_H, CtaPill } from "../components/CtaPill";
import { SafeZones } from "../components/SafeZones";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, shake, springs } from "../lib/anim";
import { PaletteProvider, usePalette } from "../lib/palette";
import { fonts } from "../theme";
import "../theme";
import { type OverzichtProps, SCENE_STARTS, VO_FILE, VOICE_END, wordAt } from "./schema";
import { Chip, ListRow, LooseNote, NOTE_H, NOTE_W, ROW_H, SplitHeadline } from "./scenes/Parts";

// Concept 68 · "Alles op één lijst." (overzicht)
// Twee schermen naast elkaar: links "zonder Buddy" (losse rekeningen overal),
// rechts "met Buddy" (één lijst). Eén doorlopende compositie op absolute
// frames; elke beat hangt aan een gesproken woord uit timing.json.
// Hoofdovergangen: divider-slide (de lijst duwt het rommelscherm weg) en
// list-fold (de lijst vouwt op tot één stapel die de CTA draagt).

const [S1, S2, S3, S4] = SCENE_STARTS;
void S1;

export const OVZ_T = {
  shakeAt: wordAt("overal"),
  badgeAt: wordAt("beetje") - 2,
  flyStart: wordAt("stuur") + 4,
  flyStagger: 7,
  flyLen: 16,
  splitFrom: S3 - 8,
  splitLen: 20,
  datesAt: wordAt("datum") - 2,
  sortAt: wordAt("datum") + 6,
  amountsAt: wordAt("bedrag"),
  exportAt: wordAt("erbij"),
  foldFrom: S4 - 6,
  foldLen: 22,
  hopAt: wordAt("lijst") + 2,
  button: wordAt("activeer"),
  logo: wordAt("activeer") + 6,
  subline: wordAt("activeer") + 12,
  tap: VOICE_END - 2,
};

// Geometry (1080 × 1920).
const PT = 640; // panel top
const PH = 840; // panel height
const NARROW_W = 465;
const LEFT_X = 60;
const RIGHT_X = 555;
const FULL_W = 960;
const BUDDY = 150;
const BUDDY_H = BUDDY * BUDDY_RATIO;
const ROW_TOP = 110;
const ROW_GAP = 150;
const STACK_TOP = 820;
const STACK_H = 236;

const NOTE_POS = [
  { x: 28, y: 112, r: -6 },
  { x: 140, y: 296, r: 6 },
  { x: 24, y: 480, r: -5 },
  { x: 136, y: 652, r: 7 },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = Easing.inOut(Easing.cubic);

export const OverzichtAd: React.FC<OverzichtProps> = (props) => (
  <PaletteProvider colors={props.colors}>
    <Inner {...props} />
  </PaletteProvider>
);

const Inner: React.FC<OverzichtProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = OVZ_T;

  // Divider slide (split → full list) and fold (list → stack).
  const d = interpolate(frame, [T.splitFrom, T.splitFrom + T.splitLen], [0, 1], { ...clamp, easing: ease });
  const f = interpolate(frame, [T.foldFrom, T.foldFrom + T.foldLen], [0, 1], { ...clamp, easing: ease });

  const leftX = LEFT_X - 620 * d;
  const rightX = lerp(RIGHT_X, LEFT_X, d);
  const rightW = lerp(NARROW_W, FULL_W, d);
  const panelTop = lerp(PT, STACK_TOP, f);
  const panelH = lerp(PH, STACK_H, f);
  const panelX = lerp(rightX, 130, f);
  const panelW = lerp(rightW, 820, f);
  const rowW = panelW - 40;

  // Flights: each loose bill arcs over Buddy into the list.
  const flyAt = (i: number) => T.flyStart + i * T.flyStagger;
  const land = (i: number) => flyAt(i) + T.flyLen;

  // Row slot: arrival order first, sorted by due date after "datum".
  const sorted = [...props.bills.map((b, i) => ({ i, o: b.dueOrder }))].sort((a, b) => a.o - b.o).map((x) => x.i);
  const slotOf = (i: number) => {
    const target = sorted.indexOf(i);
    const s = spring({ frame: frame - T.sortAt - target * 2, fps, config: { damping: 16, stiffness: 140 } });
    return lerp(i, target, s);
  };
  const rowY = (i: number) => {
    const open = panelTop + ROW_TOP + slotOf(i) * ROW_GAP;
    const stacked = STACK_TOP + 40 + (3 - sorted.indexOf(i)) * 14;
    return lerp(open, stacked, f);
  };
  const rowCenter = (i: number) => ({ x: RIGHT_X + 20 + (NARROW_W - 40) / 2, y: PT + ROW_TOP + i * ROW_GAP + ROW_H / 2 });

  // Buddy: on the divider during S1/S2, rides to the top-right of the list in S3, hops onto the stack in S4.
  const hop = interpolate(frame, [T.hopAt, T.hopAt + 14], [0, 1], { ...clamp, easing: ease });
  const bx0 = 540;
  const bx1 = lerp(540, 880, d);
  const bx = frame < T.hopAt ? (d > 0 ? bx1 : bx0) : lerp(880, 540, hop);
  const feetY =
    frame < T.hopAt ? lerp(PT, panelTop, 1) : lerp(panelTop, STACK_TOP, hop) - Math.sin(hop * Math.PI) * 170;
  let squash = 1;
  let look = { x: -0.5, y: 0.4 };
  props.bills.forEach((_, i) => {
    const mid = flyAt(i) + T.flyLen / 2;
    squash = Math.min(squash, interpolate(frame, [mid - 3, mid, mid + 6], [1, 0.84, 1], clamp));
    if (frame >= flyAt(i) - 4 && frame < land(i)) look = { x: frame < mid ? -0.8 : 0.8, y: frame < mid ? -0.2 : 0.5 };
  });
  if (frame >= T.splitFrom) look = { x: -0.4, y: 0.7 };
  if (frame >= T.hopAt) look = { x: 0, y: 0.8 };
  squash = Math.min(squash, interpolate(frame, [T.hopAt - 4, T.hopAt, T.hopAt + 4], [1, 0.82, 1], clamp));
  squash = Math.min(squash, interpolate(frame, [T.hopAt + 14, T.hopAt + 17, T.hopAt + 23], [1, 0.8, 1], clamp));
  squash = Math.min(squash, interpolate(frame, [T.tap - 3, T.tap, T.tap + 6], [1, 0.85, 1], clamp));
  const happy = frame > T.tap + 2 ? 0.18 : blinkScale(frame, [40, 150, T.hopAt + 30]);

  // Headlines.
  const sceneOut = (end: number) => interpolate(frame, [end - 10, end - 3], [1, 0], clamp);
  const headIn = (start: number) => (i: number) => (start === 0 ? 1 : pop(frame, fps, start - 4 + i * 3, springs.pop));
  const taglineAt = [wordAt("alles"), wordAt("op", 2), wordAt("één", 2), wordAt("lijst")];

  const subline = (text: string, from: number, to: number) => {
    const o = Math.min(pop(frame, fps, from, springs.smooth), interpolate(frame, [to - 6, to], [1, 0], clamp));
    return (
      <div
        style={{
          position: "absolute",
          top: PT + PH + 26,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: 46,
          color: p.blueText,
          opacity: o,
          transform: `translateY(${(1 - o) * 20}px)`,
        }}
      >
        {text}
      </div>
    );
  };

  const btnIn = pop(frame, fps, T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, T.button + 6, springs.pop);
  const tapS = interpolate(frame, [T.tap, T.tap + 3, T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [T.tap + 1, T.tap + 18], [0, 1], clamp);
  const logoIn = pop(frame, fps, T.logo, springs.smooth);
  const subIn = pop(frame, fps, T.subline, springs.smooth);
  const stackLabelIn = interpolate(f, [0.25, 0.55], [0, 1], clamp);
  const exportIn = Math.min(pop(frame, fps, T.exportAt, springs.pop), 1 - interpolate(f, [0, 0.4], [0, 1], clamp));

  const chipsIn = 1 - interpolate(frame, [T.splitFrom, T.splitFrom + 8], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: p.blue, overflow: "hidden" }}>
      {/* Headlines */}
      {frame < S2 + 2 ? (
        <div style={{ opacity: sceneOut(S2) }}>
          <SplitHeadline text={props.hook.headline} top={250} size={100} wordIn={headIn(0)} />
        </div>
      ) : null}
      {frame >= S2 - 6 && frame < S3 + 2 ? (
        <div style={{ opacity: sceneOut(S3) }}>
          <SplitHeadline text={props.forward.headline} top={250} size={100} wordIn={headIn(S2)} />
        </div>
      ) : null}
      {frame >= S3 - 6 && frame < S4 + 2 ? (
        <div style={{ opacity: sceneOut(S4) }}>
          <SplitHeadline text={props.list.headline} top={250} size={100} wordIn={headIn(S3)} />
        </div>
      ) : null}
      {frame >= S4 - 6 ? (
        <SplitHeadline
          text={props.cta.tagline}
          top={240}
          size={118}
          secondLine={p.blueSoft}
          wordIn={(i) => pop(frame, fps, (taglineAt[i] ?? taglineAt[3]) - 3, springs.pop)}
        />
      ) : null}

      {/* Left panel: zonder Buddy */}
      {d < 1 ? (
        <div
          style={{
            position: "absolute",
            left: leftX,
            top: PT,
            width: NARROW_W,
            height: PH,
            borderRadius: 40,
            background: p.light,
            overflow: "visible",
          }}
        >
          <Chip
            text={props.labels.without}
            bg={p.grey}
            color={p.ink}
            style={{ position: "absolute", left: 24, top: 26, opacity: chipsIn }}
          />
          {props.bills.map((b, i) => {
            if (frame >= flyAt(i)) return null;
            const n = NOTE_POS[i];
            const sh = shake(frame, T.shakeAt + i * 2, 16, 12);
            const wobble = Math.sin((frame + i * 17) / 11) * 1.5;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: n.x + sh.x,
                  top: n.y + sh.y,
                  transform: `rotate(${n.r + wobble + sh.r * 4}deg)`,
                }}
              >
                <LooseNote bill={b} badge={props.hook.question} badgeIn={pop(frame, fps, T.badgeAt + i * 3, springs.pop)} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Right panel: met Buddy (list, later the stack) */}
      <div
        style={{
          position: "absolute",
          left: panelX,
          top: panelTop,
          width: panelW,
          height: panelH,
          borderRadius: 40,
          background: p.blueMid,
        }}
      >
        <Chip
          text={props.labels.with}
          bg={p.blue}
          color={p.white}
          style={{ position: "absolute", left: 24, top: 26, opacity: chipsIn }}
        />
        {/* Empty skeleton slots before the bills arrive */}
        {[0, 1, 2, 3].map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: 20,
              top: ROW_TOP + k * ROW_GAP,
              width: rowW,
              height: ROW_H,
              borderRadius: 26,
              border: `3px dashed ${p.blueSoft}`,
              opacity: 0.5 * (1 - pop(frame, fps, land(k), springs.smooth)) * (1 - f),
              boxSizing: "border-box",
            }}
          />
        ))}
      </div>

      {/* Rows */}
      {props.bills
        .map((b, i) => ({ b, i }))
        .sort((a, b) => sorted.indexOf(b.i) - sorted.indexOf(a.i))
        .map(({ b, i }) => {
          if (frame < land(i) - 2) return null;
          const inS = pop(frame, fps, land(i) - 2, springs.pop);
          const flash = interpolate(
            frame,
            [T.amountsAt + sorted.indexOf(i) * 3, T.amountsAt + sorted.indexOf(i) * 3 + 6, T.amountsAt + 30],
            [0, 1, 0],
            clamp,
          );
          const top = sorted.indexOf(i) === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: panelX + 20,
                top: rowY(i),
                transform: `scale(${0.8 + 0.2 * inS})`,
                opacity: Math.min(1, inS * 2),
              }}
            >
              <ListRow
                bill={b}
                width={rowW}
                dateIn={interpolate(frame, [T.datesAt, T.datesAt + 10], [0, 1], { ...clamp, easing: ease })}
                amountFlash={flash}
              />
              {top ? (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 26,
                    background: p.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fonts.ui,
                    fontSize: 38,
                    fontWeight: 600,
                    color: p.blue,
                    opacity: stackLabelIn,
                  }}
                >
                  {props.cta.stackLabel}
                </div>
              ) : null}
            </div>
          );
        })}

      {/* Export chip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: PT + ROW_TOP + 4 * ROW_GAP + 24,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${exportIn})`,
          opacity: Math.min(1, exportIn * 2),
        }}
      >
        <Chip text={props.list.export} bg={p.white} color={p.blue} style={{ fontSize: 32, padding: "14px 30px" }} />
      </div>

      {/* Flying bills */}
      {props.bills.map((b, i) => {
        const u = interpolate(frame, [flyAt(i), land(i)], [0, 1], clamp);
        if (frame < flyAt(i) || frame >= land(i)) return null;
        const n = NOTE_POS[i];
        const P0 = { x: LEFT_X + n.x + NOTE_W / 2, y: PT + n.y + NOTE_H / 2 };
        const P2 = rowCenter(i);
        const P1 = { x: 540, y: PT - 300 };
        const e = Easing.inOut(Easing.quad)(u);
        const x = (1 - e) ** 2 * P0.x + 2 * (1 - e) * e * P1.x + e ** 2 * P2.x;
        const y = (1 - e) ** 2 * P0.y + 2 * (1 - e) * e * P1.y + e ** 2 * P2.y;
        const sc = 1 - 0.35 * Math.sin(u * Math.PI);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - NOTE_W / 2,
              top: y - NOTE_H / 2,
              transform: `rotate(${n.r * (1 - e)}deg) scale(${sc})`,
            }}
          >
            <LooseNote bill={b} badge={props.hook.question} badgeIn={1 - u} />
          </div>
        );
      })}

      {/* Buddy */}
      <Buddy
        size={BUDDY}
        body={p.white}
        eye={p.blueMascot}
        blink={happy}
        squash={squash}
        look={look}
        style={{
          position: "absolute",
          left: bx - BUDDY / 2,
          top: feetY - BUDDY_H,
          transformOrigin: "50% 100%",
        }}
      />

      {/* CTA */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: STACK_TOP + STACK_H + 60,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${1.25 * btnIn * tapS})`,
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
          top: STACK_TOP + STACK_H + 220,
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
          top: STACK_TOP + STACK_H + 310,
          display: "flex",
          justifyContent: "center",
          opacity: logoIn,
          transform: `translateY(${(1 - logoIn) * 40}px)`,
        }}
      >
        <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
      </div>

      {subline(props.hook.subline, T.shakeAt, S2)}
      {subline(props.list.subline, wordAt("op", 1) - 2, T.foldFrom)}

      {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
      {props.showSafeZones ? <SafeZones /> : null}
    </AbsoluteFill>
  );
};


