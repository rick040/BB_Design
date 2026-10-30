import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import {
  Chip,
  DRAPE,
  Drapes,
  HatBack,
  HatFront,
  HatMouth,
  hatGeom,
  Puff,
  REMINDER_W,
  ReminderCard,
  SMALL_BILL_H,
  SMALL_BILL_W,
  SmallBill,
  Sparkle,
  Wand,
} from "../components/Magic";
import type { GoochelProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  tap: 10, // the wand taps the bill
  poof: 18, // puff of smoke, the bill is gone
  poofLen: 16,
  gone: 22, // "Poef. Weg." appears where the bill was
  rumble: 38, // the hat starts to shake
  rumbleLen: 14,
  back: 50, // the bill shoots back out of the hat as a reminder letter
  cost: 62, // chip "Kan uitlopen op €40"
  subline: 70,
};

const HAT_W = 330;
const HAT = { x: 540 - HAT_W / 2, y: 760 - hatGeom(HAT_W).h };
const BILL = { x: 540 - SMALL_BILL_W / 2, y: 150 };
const REMINDER_TOP = 140; // where the reminder ends up (stage y)

export const HookScene: React.FC<{ props: GoochelProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const g = hatGeom(HAT_W);

  // Wand: resting, then a quick double tap on the bill.
  const tapRot = interpolate(frame, [HOOK_T.tap - 4, HOOK_T.tap, HOOK_T.tap + 3, HOOK_T.tap + 6, HOOK_T.tap + 9], [0, 10, -4, 8, 0], clamp);
  const wandOut = interpolate(frame, [HOOK_T.back - 6, HOOK_T.back + 4], [0, 1], clamp);

  // The bill vanishes in the puff.
  const vanish = interpolate(frame, [HOOK_T.poof, HOOK_T.poof + 6], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const puff = interpolate(frame, [HOOK_T.poof, HOOK_T.poof + HOOK_T.poofLen], [0, 1], clamp);
  const bob = Math.sin(frame / 7) * 6;

  const goneIn = pop(frame, fps, HOOK_T.gone, springs.pop);
  const goneOut = interpolate(frame, [HOOK_T.back - 8, HOOK_T.back], [1, 0], clamp);

  const rumble = shake(frame, HOOK_T.rumble, HOOK_T.rumbleLen + 10, 9);
  const back = pop(frame, fps, HOOK_T.back, { damping: 12, stiffness: 140, mass: 0.8 });
  const reminderY = interpolate(back, [0, 1], [g.rimY + 20, REMINDER_TOP - HAT.y]);
  const landShake = shake(frame, HOOK_T.back + 8, 12, 10);

  const cost = pop(frame, fps, HOOK_T.cost, springs.bouncy);

  // Sparkles around the hat while it rumbles.
  const sparkleT = interpolate(frame, [HOOK_T.rumble, HOOK_T.back + 10], [0, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <Drapes close={0} edge={46} color={DRAPE.color} dark={DRAPE.dark} />
      <Headline text={props.headline} color={p.blue} delay={-22} stagger={3} />

      <Stage offsetY={-10}>
        <div style={{ position: "absolute", inset: 0, transform: "scale(1.16)", transformOrigin: "50% 20%" }}>
        {/* spotlight on the floor */}
        <div
          style={{
            position: "absolute",
            left: 140,
            width: 800,
            top: 700,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(closest-side, rgba(182,199,255,0.65), rgba(182,199,255,0))",
          }}
        />
        {/* magic table */}
        <div style={{ position: "absolute", left: 250, width: 580, top: 756, height: 26, borderRadius: 13, background: p.blue }} />
        <div
          style={{
            position: "absolute",
            left: 290,
            width: 500,
            top: 780,
            height: 56,
            background: `repeating-linear-gradient(90deg, ${p.blueSoft} 0 40px, #a3b8ff 40px 52px)`,
            clipPath: "polygon(0 0, 100% 0, 92% 100%, 8% 100%)",
          }}
        />

        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 900, transform: `translate(${rumble.x}px, ${rumble.y * 0.4}px)` }}>
          <HatBack w={HAT_W} style={{ left: HAT.x, top: HAT.y }} />
          <HatMouth w={HAT_W} left={HAT.x} top={HAT.y} height={760}>
            {frame >= HOOK_T.back ? (
              <div
                style={{
                  position: "absolute",
                  left: (HAT_W - REMINDER_W) / 2,
                  top: reminderY,
                  transform: `translate(${landShake.x}px, ${landShake.y}px) rotate(${-3 * back + landShake.r}deg)`,
                }}
              >
                <ReminderCard label={props.reminderLabel} sender={props.reminderSender} style={{ left: 0, top: 0 }} />
              </div>
            ) : null}
          </HatMouth>
          <HatFront w={HAT_W} band={p.blue} style={{ left: HAT.x, top: HAT.y }} />
        </div>

        {/* sparkles while the hat rumbles */}
        {sparkleT > 0 && sparkleT < 1
          ? [
              { x: 330, y: 560, s: 54 },
              { x: 720, y: 520, s: 42 },
              { x: 400, y: 470, s: 34 },
              { x: 680, y: 640, s: 30 },
            ].map((s, i) => {
              const t = (sparkleT * 3 + i * 0.3) % 1;
              return (
                <Sparkle
                  key={i}
                  size={s.s}
                  color={p.yellow}
                  style={{ left: s.x - s.s / 2, top: s.y - s.s / 2 - t * 40, opacity: Math.sin(t * Math.PI), transform: `scale(${0.5 + t})` }}
                />
              );
            })
          : null}

        {/* the bill on stage, until the puff */}
        {vanish < 1 ? (
          <SmallBill
            sender={props.billSender}
            subject={props.billSubject}
            amount={props.billAmount}
            style={{
              left: BILL.x,
              top: BILL.y + bob,
              transform: `scale(${1 - 0.4 * vanish}) rotate(${-2 + 6 * vanish}deg)`,
              opacity: 1 - vanish,
            }}
          />
        ) : null}
        <Puff t={puff} size={560} color="#dfe6ff" style={{ left: 540 - 280, top: BILL.y + SMALL_BILL_H / 2 - 280 }} />

        {/* "Poef. Weg." */}
        {frame >= HOOK_T.gone ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: BILL.y + 70,
              textAlign: "center",
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 92,
              letterSpacing: headlineTracking,
              color: p.blue,
              opacity: Math.min(1, goneIn * 1.4) * goneOut,
              transform: `scale(${0.7 + 0.3 * goneIn}) rotate(-4deg)`,
            }}
          >
            {props.poof}
          </div>
        ) : null}

        {/* the wand, held from the right */}
        <Wand
          length={400}
          style={{
            left: 640 + wandOut * 500,
            top: 420,
            transform: `rotate(${-28 + tapRot}deg)`,
            opacity: 1 - wandOut,
          }}
        />

        {/* cost chip */}
        {frame >= HOOK_T.cost ? (
          <Chip
            text={props.costChip}
            bg={p.red}
            color={p.white}
            size={38}
            style={{
              left: 440,
              top: REMINDER_TOP + 210,
              transform: `scale(${cost}) rotate(-4deg)`,
              transformOrigin: "30% 50%",
            }}
          />
        ) : null}
        </div>
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={HOOK_T.subline} />
    </SceneBg>
  );
};
