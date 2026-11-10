import React from "react";
import { Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Radio, RADIO_W } from "../components/Radio";
import { type RadioProps, VO_WORDS } from "../schema";

// Beats (scene-local frames). The hook starts at frame 0 of the video, so
// these are the frames of the spoken words in timing.json.
export const HOOK_T = {
  ruis: VO_WORDS.ruis, // "ruis": static peaks, noise chips jitter
  billPass: VO_WORDS.rekening, // "rekening": needle passes the bill, it flashes up
  notice: VO_WORDS.aanmaning, // "aanmaning": the notice slams onto the radio
  chip: VO_WORDS.aanmaning + 10, // "Kan uitlopen op €40"
  headStagger: 3,
};

// Where the noise chips float around the radio (stage coordinates).
const NOISE_POS = [
  { x: 200, y: 10, r: -6 },
  { x: 850, y: 0, r: 5 },
  { x: 190, y: 880, r: 4 },
  { x: 560, y: 960, r: -3 },
  { x: 900, y: 870, r: 7 },
];

export const HookScene: React.FC<{ props: RadioProps["hook"]; bill: RadioProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // The needle wanders over the stations, passes the hidden "Energie"
  // station exactly when the voice says "rekening", and drifts away again.
  const BILL_AT = 0.62;
  const needle = interpolate(
    frame,
    [0, 18, 32, HOOK_T.billPass - 4, HOOK_T.billPass + 4, HOOK_T.notice - 6],
    [0.08, 0.3, 0.2, BILL_AT - 0.08, BILL_AT + 0.08, 0.95],
    { ...clamp, easing: Easing.inOut(Easing.sin) },
  );

  const noticeIn = pop(frame, fps, HOOK_T.notice, { damping: 12, stiffness: 220, mass: 0.6 });
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.pop);
  const sh = shake(frame, HOOK_T.notice + 3, 14, 16);
  const noisy = interpolate(frame, [HOOK_T.ruis - 4, HOOK_T.ruis + 6], [0.6, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <Headline
        text={props.headline}
        color={p.blue}
        delay={-8 * HOOK_T.headStagger}
        stagger={HOOK_T.headStagger}
      />
      <Stage offsetY={10}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${sh.x}px, ${sh.y}px) rotate(${sh.r}deg)` }}>
          {/* Noise: generic chips that jitter and blur in and out. */}
          {props.noise.map((n, i) => {
            const pos = NOISE_POS[i];
            const t = Math.floor(frame / 3);
            const jx = (random(`nx${i}-${t}`) - 0.5) * 14 * noisy;
            const jy = (random(`ny${i}-${t}`) - 0.5) * 10 * noisy;
            const flicker = 0.45 + 0.55 * random(`nf${i}-${t}`);
            const fade = interpolate(frame, [HOOK_T.notice, HOOK_T.notice + 10], [1, 0.35], clamp);
            return (
              <div
                key={n}
                style={{
                  position: "absolute",
                  left: pos.x,
                  top: pos.y,
                  transform: `translate(-50%, 0) translate(${jx}px, ${jy}px) rotate(${pos.r}deg)`,
                  padding: "14px 26px",
                  borderRadius: 40,
                  background: p.white,
                  boxShadow: "0 8px 24px rgba(1, 30, 140, 0.12)",
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 40,
                  color: p.blue,
                  whiteSpace: "nowrap",
                  opacity: flicker * fade * 0.6,
                  filter: `blur(${(1 - flicker) * 3}px)`,
                }}
              >
                {n}
              </div>
            );
          })}

          <Radio
            frame={frame}
            needle={needle}
            clarity={0}
            knob={needle * 140 - 40}
            stations={props.stations}
            hidden={{ label: props.billStation, at: BILL_AT }}
            style={{ position: "absolute", left: (1080 - RADIO_W * 1.12) / 2, top: 90, transform: "scale(1.12)", transformOrigin: "0 0" }}
          />

          {/* The notice slams onto the radio. */}
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 560,
              width: 860,
              padding: "34px 40px",
              borderRadius: 34,
              background: p.white,
              borderLeft: `18px solid ${p.red}`,
              boxShadow: "0 30px 70px rgba(255, 60, 100, 0.28)",
              boxSizing: "border-box",
              transform: `translateY(${(1 - noticeIn) * -260}px) rotate(${-4 + (1 - noticeIn) * -8}deg) scale(${1.25 - 0.25 * noticeIn})`,
              opacity: Math.min(1, noticeIn * 3),
              fontFamily: fonts.ui,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 34, letterSpacing: "0.12em", textTransform: "uppercase", color: p.red }}>
              {props.noticeLabel}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8 }}>
              <div style={{ fontWeight: 600, fontSize: 48, color: p.ink }}>{bill.sender}</div>
              <div style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 68, color: p.ink, letterSpacing: "-0.04em" }}>
                {bill.amount}
              </div>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 770,
              display: "flex",
              justifyContent: "center",
              opacity: Math.min(1, chipIn * 2),
              transform: `scale(${0.6 + 0.4 * chipIn}) rotate(-2deg)`,
            }}
          >
            <div
              style={{
                padding: "18px 40px",
                borderRadius: 40,
                background: p.red,
                color: p.white,
                fontFamily: fonts.ui,
                fontWeight: 700,
                fontSize: 44,
                whiteSpace: "nowrap",
              }}
            >
              {props.noticeChip}
            </div>
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
