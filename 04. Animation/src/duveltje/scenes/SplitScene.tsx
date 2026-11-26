import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { blinkScale, clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { JackBox } from "../components/JackBox";
import { type DuveltjeProps, SCENE_STARTS, wordAt } from "../schema";

// Two screens side by side. Left: the box goes off on its own, as a reminder
// you did not ask for. Right: Buddy turns the crank, the box opens on your day.
export const SPLIT_T = {
  start: SCENE_STARTS[1],
  burst: wordAt("aanmaning"), // left lid bursts: the bill as a reminder
  stamp: wordAt("aanmaning") + 5,
  leftChip: wordAt("aanmaning") + 12,
  focus: SCENE_STARTS[2], // divider slides left, right screen takes over
  hop: SCENE_STARTS[2] + 4, // Buddy hops off the lid to the crank
  chip: wordAt("kies"), // "Jij kiest: wo 16 dec"
  crank: SCENE_STARTS[2] + 18, // Buddy starts turning
  open: wordAt("agenda") - 2, // right lid opens: agenda tile on the spring
  happy: wordAt("agenda") + 12,
  focusLen: 16,
};

const PANEL_W = 540;
const BOX_BOTTOM = 1250;
const BOX_W = 290;

const Chip: React.FC<{ text: string; bg: string; fg: string; s: number; y: number }> = ({ text, bg, fg, s, y }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y,
      display: "flex",
      justifyContent: "center",
      opacity: Math.min(1, s * 2),
      transform: `scale(${0.5 + 0.5 * s})`,
    }}
  >
    <div
      style={{
        background: bg,
        color: fg,
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: 34,
        padding: "16px 28px",
        borderRadius: 40,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  </div>
);

/** One half of the split, designed on a 540-wide panel and scaled to its slot. */
const Panel: React.FC<{
  x: number;
  w: number;
  bg: string;
  title: string;
  titleColor: string;
  dim: number;
  children: React.ReactNode;
}> = ({ x, w, bg, title, titleColor, dim, children }) => {
  const s = Math.min(1.3, w / PANEL_W);
  return (
    <div style={{ position: "absolute", left: x, top: 0, width: w, height: 1920, background: bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 270,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 70 * Math.min(1.15, Math.max(0.75, s)),
          letterSpacing: headlineTracking,
          color: titleColor,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          left: w / 2 - PANEL_W / 2,
          top: 0,
          width: PANEL_W,
          height: 1920,
          transform: `scale(${s})`,
          transformOrigin: "50% 1050px",
        }}
      >
        {children}
      </div>
      <div style={{ position: "absolute", inset: 0, background: bg, opacity: dim, pointerEvents: "none" }} />
    </div>
  );
};

export const SplitScene: React.FC<{ props: DuveltjeProps["split"]; bill: DuveltjeProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = SPLIT_T;

  const D = interpolate(frame, [T.focus - 2, T.focus - 2 + T.focusLen], [540, 330], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const dimLeft = interpolate(frame, [T.focus - 2, T.focus + T.focusLen], [0, 0.45], clamp);

  // Left: crank spins on its own, faster and faster, then bursts.
  const leftCrank = (frame - T.start) * interpolate(frame, [T.start, T.burst], [8, 22], clamp);
  const burst = pop(frame, fps, T.burst, springs.bouncy);
  const leftLid = frame >= T.burst ? Math.min(1, burst * 1.4) : 0.03 * Math.abs(Math.sin(frame * 1.1));
  const leftSpring = frame >= T.burst ? 330 * burst : 0;
  const sh = shake(frame, T.burst, 14, 14);
  const tense = frame < T.burst ? Math.sin(frame * 2.3) * interpolate(frame, [T.start, T.burst], [1, 3], clamp) : sh.r;
  const stampIn = pop(frame, fps, T.stamp, springs.pop);
  const leftChip = pop(frame, fps, T.leftChip, springs.bouncy);

  // Right: Buddy sits on the lid, hops to the crank, turns it calmly.
  const hop = interpolate(frame, [T.hop, T.hop + 14], [0, 1], clamp);
  const BUD = 118;
  const sitX = 220;
  const sitY = BOX_BOTTOM - BOX_W * 0.78 - BOX_W * 0.07;
  const crankX = 475;
  const crankY = BOX_BOTTOM + 8;
  const bx = interpolate(hop, [0, 1], [sitX, crankX]);
  const by = interpolate(hop, [0, 1], [sitY, crankY]) - Math.sin(Math.PI * hop) * 120;
  const turning = frame >= T.crank;
  const rightCrank = turning ? (frame - T.crank) * 6 : 0;
  const open = pop(frame, fps, T.open, springs.bouncy);
  const rightLid = frame >= T.open ? Math.min(1, open * 1.3) : 0;
  const rightSpring = frame >= T.open ? 300 * open : 0;
  const landSq = interpolate(frame, [T.hop + 14, T.hop + 17, T.hop + 23], [1, 0.8, 1], clamp);
  const turnSq = turning ? 1 + 0.06 * Math.sin(((frame - T.crank) * 6 * Math.PI) / 180) : 1;
  const burstLook = interpolate(frame, [T.burst - 2, T.burst + 4, T.focus, T.focus + 6], [0, -1, -1, 0.4], clamp);
  const chipIn = pop(frame, fps, T.chip, springs.bouncy);
  const check = interpolate(frame, [T.happy - 4, T.happy + 10], [0, 1], clamp);
  const blink = frame > T.happy ? 0.2 : blinkScale(frame, [T.start + 20, T.chip + 10]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Panel x={0} w={D} bg={p.light} title={props.leftTitle} titleColor={p.blue} dim={dimLeft}>
        <JackBox
          cx={250}
          bottom={BOX_BOTTOM}
          w={BOX_W}
          body={p.blue}
          trim={p.white}
          label="rekening"
          crank={leftCrank}
          lid={leftLid}
          spring={leftSpring}
          crankColor={p.blueMid}
          springColor={p.blueMid}
          dx={sh.x}
          rot={tense}
        >
          <div style={{ width: BILL_W * 0.5, height: BILL_H * 0.5, transform: `rotate(${-6 * (1 - burst)}deg)` }}>
            <div style={{ transform: "scale(0.5)", transformOrigin: "0 0" }}>
              <BillCard
                sender={bill.sender}
                subject={bill.subject}
                amount={bill.amount}
                dueLabel={props.lateLabel}
                urgent
                stamp={props.stamp}
                stampIn={stampIn}
              />
            </div>
          </div>
        </JackBox>
        <Chip text={props.leftChip} bg={p.red} fg="#fff" s={leftChip} y={BOX_BOTTOM + 60} />
      </Panel>

      <Panel x={D} w={1080 - D} bg={p.blue} title={props.rightTitle} titleColor={p.white} dim={0}>
        <JackBox
          cx={220}
          bottom={BOX_BOTTOM}
          w={BOX_W}
          body={p.blueSoft}
          trim={p.blue}
          label={props.rightBoxLabel}
          crank={rightCrank + 200}
          lid={rightLid}
          spring={rightSpring}
          crankColor={p.white}
          springColor={p.white}
        >
          <div
            style={{
              width: 300,
              borderRadius: 26,
              overflow: "hidden",
              background: p.white,
              boxShadow: "0 18px 40px rgba(0,0,40,0.3)",
              fontFamily: fonts.ui,
            }}
          >
            <div style={{ background: p.blueMid, color: p.white, fontWeight: 600, fontSize: 30, padding: "12px 20px" }}>
              {props.agendaDay}
            </div>
            <div style={{ padding: "14px 20px 18px", position: "relative" }}>
              <div style={{ fontSize: 40, fontWeight: 700, color: p.blue }}>{props.agendaTime}</div>
              <div style={{ fontSize: 26, color: p.ink, whiteSpace: "pre-line", lineHeight: 1.2 }}>{props.agendaText}</div>
              <div style={{ position: "absolute", right: 14, top: 14 }}>
                <Checkmark size={46} color={p.blue} progress={check} />
              </div>
            </div>
          </div>
        </JackBox>
        <Buddy
          size={BUD}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={Math.min(landSq, turnSq)}
          look={hop > 0.9 ? { x: -0.6, y: -0.6 } : { x: burstLook, y: 0.2 }}
          style={{ position: "absolute", left: bx - BUD / 2, top: by - BUD * BUDDY_RATIO }}
        />
        <Chip text={props.rightChip} bg={p.white} fg={p.blue} s={chipIn} y={BOX_BOTTOM + 60} />
      </Panel>
    </div>
  );
};
