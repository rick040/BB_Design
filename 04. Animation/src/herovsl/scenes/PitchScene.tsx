import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { Notification } from "../../components/Notification";
import { SceneBg } from "../../components/Stage";
import { blinkScale, clamp, pop, pushedSlots, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { MailCard, SignalArcs, Tap } from "../components/ui";
import { PopWords, useHeroLayout, VisualBox } from "../layout";
import type { HeroVslProps } from "../schema";

// The 5-second pitch: one continuous shot, three lines that stack up.
// Frame 0 already shows line 1, the bill and Buddy (it is also the poster).
export const PITCH_T = {
  line1: -14, // on screen from frame 0
  tap: 12, // finger taps "Doorsturen"
  fly: 16, // the bill flies to Buddy
  flyLen: 20,
  catch: 36, // Buddy catches it (squash)
  line2: 46, // "Buddy seint je op tijd."
  remind7: 54, // first reminder drops in
  remind2: 72, // second reminder on top
  stackOut: 94, // reminders slide away
  line3: 100, // "Jij betaalt op tijd."
  paid: 104, // "Betaald" card
  jump: 104, // Buddy jumps for joy
  jumpLen: 18,
  check: 110, // checkmark draws
  cross1: 118, // "Aanmaning" chip
  cross2: 124, // "Extra kosten" chip
  strike1: 128, // red line through chip 1
  strike2: 134, // red line through chip 2
};

const LINE_STARTS = [PITCH_T.line1, PITCH_T.line2, PITCH_T.line3];

const BUDDY = 210;
const BUDDY_H = BUDDY * BUDDY_RATIO;
const FEET = 760;
const BUDDY_TOP = FEET - BUDDY_H;
const CARD = { left: 90, top: 64, w: 820, h: 300 };
const NOTIF_W = 820;

export const PitchScene: React.FC<{
  props: HeroVslProps["pitch"];
  bill: HeroVslProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useHeroLayout("pitch");

  // ── Text column ────────────────────────────────────────────────────────
  const lineSize = 74;
  const badge = L.wide ? 70 : 66;
  const gap = L.wide ? 44 : 26;
  const overSize = L.wide ? 38 : 36;
  const blockH = overSize + (L.wide ? 44 : 30) + 3 * Math.max(lineSize, badge) + 2 * gap;
  const blockTop = L.wide ? (L.height - blockH) / 2 - 10 : 66;

  // ── The bill flying into Buddy ─────────────────────────────────────────
  const fly = interpolate(frame, [PITCH_T.fly, PITCH_T.fly + PITCH_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const press = interpolate(frame, [PITCH_T.tap - 2, PITCH_T.tap, PITCH_T.tap + 5], [0, 1, 0], clamp);
  const cardCx = CARD.left + CARD.w / 2;
  const cardCy = CARD.top + CARD.h / 2;
  const mouthY = BUDDY_TOP + BUDDY_H * 0.42;
  const cardX = cardCx + Math.sin(fly * Math.PI) * 130 - cardCx;
  const cardY = interpolate(fly, [0, 1], [cardCy, mouthY]) - Math.sin(fly * Math.PI) * 70 - cardCy;
  const cardScale = interpolate(fly, [0, 1], [1, 0.08]);
  const cardOpacity = interpolate(fly, [0.75, 1], [1, 0], clamp);

  // ── Buddy ──────────────────────────────────────────────────────────────
  const catchSquash = interpolate(
    frame,
    [PITCH_T.catch - 1, PITCH_T.catch + 3, PITCH_T.catch + 9, PITCH_T.catch + 15],
    [1, 0.8, 1.07, 1],
    clamp,
  );
  const pulse = (at: number) => interpolate(frame, [at - 2, at + 2, at + 8], [1, 0.9, 1], clamp);
  const jumpT = interpolate(frame, [PITCH_T.jump, PITCH_T.jump + PITCH_T.jumpLen], [0, 1], clamp);
  const jumpY = -Math.sin(jumpT * Math.PI) * 100;
  const land = PITCH_T.jump + PITCH_T.jumpLen;
  let squash = catchSquash * pulse(PITCH_T.remind7 - 2) * pulse(PITCH_T.remind2 - 2);
  if (frame >= PITCH_T.jump - 5) {
    squash = interpolate(
      frame,
      [PITCH_T.jump - 5, PITCH_T.jump, PITCH_T.jump + 4, land - 2, land + 2, land + 8, land + 13],
      [1, 0.84, 1.1, 1.04, 0.82, 1.06, 1],
      clamp,
    );
  }
  const idle = Math.sin(frame / 9) * 3 * (frame < PITCH_T.jump - 5 || frame > land + 13 ? 1 : 0);
  // Where Buddy looks: at the bill, follows it down, then up at the reminders.
  const lookY = interpolate(
    frame,
    [0, PITCH_T.fly + 4, PITCH_T.catch, PITCH_T.catch + 8, PITCH_T.line2 + 4, PITCH_T.stackOut, PITCH_T.paid + 6],
    [-0.9, -0.9, 0.2, 0.1, -0.85, -0.85, 0.1],
    clamp,
  );
  const lookX = interpolate(frame, [0, PITCH_T.fly, PITCH_T.fly + 10, PITCH_T.catch], [0.45, 0.45, 0.6, 0], clamp);
  const happy = frame >= land ? 0.2 : 1;
  const blink = Math.min(happy, blinkScale(frame, [PITCH_T.catch + 8, 84]));

  // ── Reminders ──────────────────────────────────────────────────────────
  const arrivals = [PITCH_T.remind7, PITCH_T.remind2];
  const reminders = [
    { ...props.remind7, icon: "warning" as const },
    { ...props.remind2, icon: "alert" as const },
  ];
  const out = interpolate(frame, [PITCH_T.stackOut, PITCH_T.stackOut + 12], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });

  // ── Payoff ─────────────────────────────────────────────────────────────
  const paidIn = pop(frame, fps, PITCH_T.paid, springs.pop);
  const check = interpolate(frame, [PITCH_T.check, PITCH_T.check + 12], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const crossIn = [pop(frame, fps, PITCH_T.cross1, springs.pop), pop(frame, fps, PITCH_T.cross2, springs.pop)];
  const strike = [
    interpolate(frame, [PITCH_T.strike1, PITCH_T.strike1 + 8], [0, 1], clamp),
    interpolate(frame, [PITCH_T.strike2, PITCH_T.strike2 + 8], [0, 1], clamp),
  ];

  return (
    <SceneBg color={p.light}>
      {/* soft depth behind the visual */}
      <div
        style={{
          position: "absolute",
          left: L.box.left + 500 * L.box.scale - 520 * L.box.scale,
          top: L.box.top + 420 * L.box.scale - 520 * L.box.scale,
          width: 1040 * L.box.scale,
          height: 1040 * L.box.scale,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${p.blueSoft}55 0%, ${p.blueSoft}00 68%)`,
        }}
      />

      {/* Text column: overline + three numbered lines */}
      <div
        style={{
          position: "absolute",
          left: L.pad,
          right: L.width - L.textRight,
          top: blockTop,
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: overSize,
            letterSpacing: "0.01em",
            color: p.blueMid,
            marginBottom: L.wide ? 44 : 30,
          }}
        >
          {props.overline}
        </div>
        {props.lines.map((line, i) => {
          const start = LINE_STARTS[i];
          const next = LINE_STARTS[i + 1] ?? 100000;
          const done = frame >= next;
          const s = pop(frame, fps, start, springs.pop);
          const doneT = interpolate(frame, [next, next + 8], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: L.wide ? 26 : 20,
                height: Math.max(lineSize, badge),
                marginTop: i === 0 ? 0 : gap,
              }}
            >
              <div
                style={{
                  width: badge,
                  height: badge,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: p.blue,
                  color: p.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.display,
                  fontWeight: 600,
                  fontSize: badge * 0.48,
                  opacity: Math.min(1, s * 1.5),
                  transform: `scale(${0.5 + 0.5 * s})`,
                }}
              >
                {done ? <Checkmark size={badge * 0.5} color={p.white} progress={doneT} strokeWidth={15} /> : i + 1}
              </div>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 500,
                  fontSize: lineSize,
                  letterSpacing: headlineTracking,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                <PopWords text={line} delay={start} stagger={3} color={done ? p.ink : p.blue} />
              </div>
            </div>
          );
        })}
      </div>

      <VisualBox mode="pitch">
        {/* Reminders (step 2) */}
        {reminders.map((r, i) => {
          const s = pop(frame, fps, arrivals[i], springs.pop);
          if (s <= 0.001) return null;
          const slots = pushedSlots(frame, fps, arrivals, i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: (1000 - NOTIF_W) / 2,
                top: 92 + slots * 162 - (1 - s) * 50 - out * 120,
                opacity: Math.min(1, s * 1.6) * (1 - out),
                transform: `scale(${0.88 + 0.12 * s})`,
                zIndex: 10 + i,
              }}
            >
              <Notification text={r.text} time={r.time} icon={r.icon} width={NOTIF_W} />
            </div>
          );
        })}

        {/* Payoff (step 3): paid card + crossed-out chips */}
        {paidIn > 0.001 ? (
          <div
            style={{
              position: "absolute",
              left: CARD.left,
              top: 92,
              width: CARD.w,
              height: 196,
              borderRadius: 46,
              background: p.white,
              boxShadow: "0 30px 80px rgba(1, 40, 160, 0.16)",
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "0 44px 0 38px",
              boxSizing: "border-box",
              opacity: Math.min(1, paidIn * 1.6),
              transform: `scale(${0.85 + 0.15 * paidIn})`,
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: p.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Checkmark size={68} color={p.white} progress={check} strokeWidth={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 500,
                  fontSize: 66,
                  letterSpacing: headlineTracking,
                  lineHeight: 1,
                  color: p.ink,
                }}
              >
                {props.paidTitle}
              </div>
              <div style={{ fontFamily: fonts.ui, fontSize: 28, color: p.greyText, marginTop: 10, whiteSpace: "nowrap" }}>
                {props.paidText}
              </div>
            </div>
            <div
              style={{
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 54,
                letterSpacing: headlineTracking,
                color: p.ink,
              }}
            >
              {bill.amount}
            </div>
          </div>
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 336,
            display: "flex",
            justifyContent: "center",
            gap: 26,
          }}
        >
          {props.crossedOut.map((label, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                height: 76,
                padding: "0 34px",
                borderRadius: 38,
                background: p.white,
                border: `3px solid ${p.grey}`,
                boxShadow: "0 12px 30px rgba(1, 40, 160, 0.10)",
                color: "#6b6b78",
                display: "flex",
                alignItems: "center",
                fontFamily: fonts.ui,
                fontSize: 33,
                fontWeight: 500,
                whiteSpace: "nowrap",
                opacity: Math.min(1, crossIn[i] * 1.6),
                transform: `scale(${0.6 + 0.4 * crossIn[i]})`,
              }}
            >
              {label}
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  top: 37,
                  height: 6,
                  borderRadius: 3,
                  width: `calc(${strike[i] * 100}% - ${36 * strike[i]}px)`,
                  background: p.red,
                  transform: "rotate(-4deg)",
                  transformOrigin: "0 50%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Signals when Buddy sends a reminder */}
        {[PITCH_T.remind7 - 4, PITCH_T.remind2 - 4].map((at, i) => (
          <div key={i} style={{ position: "absolute", left: 500 - 80, top: BUDDY_TOP - 104 + idle }}>
            <SignalArcs progress={interpolate(frame, [at, at + 20], [0, 1], clamp)} color={p.blueMid} size={160} />
          </div>
        ))}

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          squash={squash}
          look={{ x: lookX, y: lookY }}
          style={{
            position: "absolute",
            left: 500 - BUDDY / 2,
            top: BUDDY_TOP + idle + jumpY,
          }}
        />

        {/* The bill (step 1), on top so it flies into Buddy */}
        {fly < 1 ? (
          <div
            style={{
              position: "absolute",
              left: CARD.left,
              top: CARD.top,
              transform: `translate(${cardX}px, ${cardY}px) rotate(${-9 * Math.sin(fly * Math.PI)}deg) scale(${cardScale})`,
              transformOrigin: "50% 50%",
              opacity: cardOpacity,
              zIndex: 20,
            }}
          >
            <MailCard
              sender={bill.sender}
              subject={bill.subject}
              amount={bill.amount}
              dueLabel={bill.dueLabel}
              forwardLabel={props.forwardButton}
              press={press}
            />
          </div>
        ) : null}
        <div style={{ position: "absolute", inset: 0, zIndex: 30 }}>
          <Tap frame={frame} at={PITCH_T.tap} x={CARD.left + 668} y={CARD.top + 233} />
        </div>
      </VisualBox>
    </SceneBg>
  );
};
