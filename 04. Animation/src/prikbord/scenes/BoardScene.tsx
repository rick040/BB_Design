import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { BillNote, NOTE_H, NOTE_W, Tag } from "../components/Board";
import { SyncHeadline } from "../components/SyncLine";
import { MARKERS, type PrikbordProps, wordAt } from "../schema";

// Absolute frames. S1 (myth) and S2 ("Hoeft niet.") share this board.
export const BOARD_T = {
  stringsFrom: -24, // strings already half drawn on frame 0 (cover)
  stringStagger: 9,
  sag: wordAt("alles"), // strings tighten into a knot
  swing: wordAt("bijhouden"), // Sportschool note loses a pin and swings
  strike: MARKERS[1] - 6, // MYTHE gets crossed out
  fact: MARKERS[1], // "Hoeft niet." headline, tag flips to FEIT
  buddyUp: MARKERS[1] - 2,
  snap: wordAt("niet"), // Buddy yanks: strings snap loose
  tidyLen: 12,
};

const POS = [
  { x: 300, y: 210, r: -6 },
  { x: 770, y: 200, r: 5 },
  { x: 540, y: 460, r: -3 },
  { x: 290, y: 700, r: 4 },
  { x: 790, y: 690, r: -5 },
];
const LINKS: [number, number][] = [
  [0, 2],
  [1, 3],
  [2, 4],
  [0, 4],
  [1, 2],
  [2, 3],
  [0, 1],
  [3, 4],
];

const pinOf = (i: number) => {
  const { x, y, r } = POS[i];
  const a = (r * Math.PI) / 180;
  const dy = -NOTE_H / 2 + 5;
  return { x: x - dy * Math.sin(a), y: y + dy * Math.cos(a) };
};

export const BoardScene: React.FC<{ props: PrikbordProps["board"]; bills: PrikbordProps["bills"] }> = ({
  props,
  bills,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = BOARD_T;

  const snap = interpolate(frame, [T.snap, T.snap + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tidy = interpolate(frame, [T.snap, T.snap + T.tidyLen], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const tight = interpolate(frame, [T.sag, T.sag + 8], [0, 1], clamp);
  const boardShake = shake(frame, T.swing, 14, 10);
  const snapShake = shake(frame, T.snap, 12, 14);
  const sh = { x: boardShake.x + snapShake.x, y: boardShake.y + snapShake.y };

  const swing = frame < T.swing ? 0 : interpolate(frame - T.swing, [0, 30], [0, 1], clamp);
  const swingAngle = swing === 0 ? 0 : 38 * (1 - Math.exp(-swing * 5)) + 9 * Math.sin((frame - T.swing) * 0.45) * Math.exp(-swing * 2.5);

  const strike = interpolate(frame, [T.strike, T.strike + 5], [0, 1], clamp);
  const flip = interpolate(frame, [T.fact - 3, T.fact + 5], [0, 1], clamp);
  const tagScaleX = Math.abs(Math.cos(flip * Math.PI));
  const showFact = flip >= 0.5;

  const buddyIn = pop(frame, fps, T.buddyUp, springs.bouncy);
  const yank = interpolate(frame, [T.snap - 4, T.snap, T.snap + 8], [1, 0.8, 1.12], clamp);
  const BUDDY = 210;

  return (
    <SceneBg color={p.light}>
      <SyncHeadline text={props.headline} at={[-12, -10, -8, -6, -4]} color={p.blue} hideFrom={T.fact - 1} />
      {frame >= T.fact - 1 ? <Headline text={props.factHeadline} color={p.blue} delay={T.fact - 3} stagger={3} /> : null}
      <Stage offsetY={20}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${sh.x}px, ${sh.y}px)` }}>
          {/* board */}
          <div
            style={{
              position: "absolute",
              left: 50,
              top: 40,
              width: 980,
              height: 880,
              borderRadius: 36,
              background: p.grey,
              boxShadow: "inset 0 0 0 10px #dfe5ec",
            }}
          />
          {/* notes */}
          {POS.map((pos, i) => {
            const b = bills[i];
            const swingThis = i === 4 && frame >= T.swing;
            const rot = swingThis ? pos.r + swingAngle * (1 - tidy) : pos.r * (1 - tidy);
            const origin = swingThis ? "8% 4%" : "50% 50%";
            const lift = 1 + 0.05 * tidy;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: pos.x - NOTE_W / 2,
                  top: pos.y - NOTE_H / 2,
                  transform: `rotate(${rot}deg) scale(${lift})`,
                  transformOrigin: origin,
                }}
              >
                <BillNote sender={b.sender} amount={b.amount} due={props.unknownDue} />
              </div>
            );
          })}
          {/* red strings */}
          <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            {LINKS.map(([a, b], k) => {
              const A = pinOf(a);
              const B = pinOf(b);
              const draw = interpolate(frame, [T.stringsFrom + k * T.stringStagger, T.stringsFrom + k * T.stringStagger + 16], [0, 1], clamp);
              const sag = 70 * (1 - tight) + 10 + 380 * snap;
              const mx = (A.x + B.x) / 2 + (k % 2 ? 30 : -30) * tight;
              const my = (A.y + B.y) / 2 + sag;
              const d = `M${A.x},${A.y} Q${mx},${my} ${B.x},${B.y}`;
              return (
                <path
                  key={k}
                  d={d}
                  pathLength={1}
                  fill="none"
                  stroke={p.red}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={`${draw} 1`}
                  opacity={1 - snap}
                />
              );
            })}
          </svg>
          {/* MYTHE / FEIT tag */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              display: "flex",
              justifyContent: "center",
              transform: `rotate(-4deg) scaleX(${tagScaleX})`,
            }}
          >
            <div style={{ position: "relative" }}>
              <Tag
                text={showFact ? props.factTag : props.mythTag}
                bg={showFact ? p.blue : p.yellow}
                color={showFact ? p.white : p.ink}
                size={44}
              />
              {!showFact ? (
                <div
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    height: 8,
                    borderRadius: 4,
                    width: `calc(${strike * 100}% - 28px)`,
                    background: p.red,
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
        {/* Buddy pops up from below the board and yanks the strings */}
        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          squash={frame < T.snap - 4 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.12, 1]) : yank}
          blink={blinkScale(frame, [T.snap + 10])}
          look={{ x: 0, y: frame < T.snap ? -0.8 : 0.2 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: 1010 - BUDDY * BUDDY_RATIO - 140 * buddyIn,
            opacity: frame < T.buddyUp ? 0 : 1,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>
    </SceneBg>
  );
};
