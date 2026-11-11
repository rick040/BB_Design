import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, interpolateColors, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../components/Buddy";
import { CTA_H, CtaPill } from "../components/CtaPill";
import { SafeZones } from "../components/SafeZones";
import { Stage } from "../components/Stage";
import { Headline, Subline } from "../components/Text";
import { Wordmark } from "../components/Wordmark";
import { blinkScale, clamp, pop, shake, springs } from "../lib/anim";
import { useLayout } from "../lib/layout";
import { PaletteProvider, usePalette } from "../lib/palette";
import { fonts, headlineTracking } from "../theme";
import "../theme";
import { AgendaStrip, tileCenter } from "./components/AgendaStrip";
import { DIAL, dialAngle, LEVER, SLOT, Smoke, TOASTER, ToasterBody } from "./components/Toaster";
import { type BroodroosterProps, SCENE_STARTS, VO_FILE, VOICE_END, wordAt } from "./schema";

// Concept 73 · "Jij kiest het moment." (broodrooster)
// One continuous shot: no scene cuts. The camera pushes in on the dial and
// the background breathes light/blue on each spoken scene start.
// All beats are absolute frames hung on spoken words (timing.json).
const [, S2, S3, S4] = SCENE_STARTS;

export const HOOK_T = {
  burn: 6, // bill starts to toast
  pop: wordAt("brandt"), // bill shoots up, charred
  stamp: wordAt("aan"), // AANMANING
  chip: wordAt("aan") + 8, // "Kan uitlopen op €40"
};
export const DIAL_T = {
  out: S2, // burnt bill leaves
  slideIn: S2 + 8, // fresh forwarded bill flies to the slot
  inSlot: wordAt("door") + 4, // lever goes down
  buddy: wordAt("buddy"), // Buddy pops up on the toaster
  zoom: wordAt("draait") - 10, // camera pushes in on the dial
  turn: wordAt("draait"), // tap, dial turns from due day to chosen day
  chosen: wordAt("knop"), // chosen day lights up, subline
  zoomOut: S3 - 12,
};
export const AGENDA_T = {
  strip: S3 - 2, // agenda week slides down
  pop: wordAt("springt"), // toaster pops, bill flies into the agenda
  land: wordAt("springt") + 18, // bill lands on the due day
  reminder: wordAt("op") + 2, // reminder lights up on the chosen day
  happy: wordAt("agenda"),
};
export const CTA_T = {
  hop: S4 - 4, // Buddy jumps up on the toaster
  press: S4 + 6, // and stomps it: the lever goes down
  launch: S4 + 12, // the button pops out of the slot
  logo: S4 + 18,
  tap: VOICE_END + 4,
};

const BILL_SCALE = 0.5;
// The world (toaster, bills, Buddy) is drawn 1.3× around this point.
const WORLD = { scale: 1.3, ox: 540, oy: 450 };
/** Stage point (outside the world) to world coordinates. */
const toWorld = (x: number, y: number) => ({
  x: (x - WORLD.ox) / WORLD.scale + WORLD.ox,
  y: (y - WORLD.oy) / WORLD.scale + WORLD.oy,
});
const BILL_REST_TOP = TOASTER.y - 100; // sticks out 100 px
const BUDDY = 140;
const BUDDY_HOME = { x: 795, feet: TOASTER.y + 2 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const Shot: React.FC<BroodroosterProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const { bill, hook, dial, agenda, cta } = props;

  // Background breathes: light (problem/result), blue (Buddy at work).
  const bg = interpolateColors(
    frame,
    [S2 - 2, S2 + 8, S3 - 2, S3 + 8, S4 - 4, S4 + 6],
    [p.light, p.blue, p.blue, p.light, p.light, p.blue],
  );
  const blueness = interpolate(
    frame,
    [S2 - 2, S2 + 8, S3 - 2, S3 + 8, S4 - 4, S4 + 6],
    [0, 1, 1, 0, 0, 1],
    clamp,
  );
  const buddyBody = interpolateColors(blueness, [0, 1], [p.blue, p.white]);
  const buddyEye = interpolateColors(blueness, [0, 1], [p.white, p.blueMascot]);

  // Camera: push in on the dial while you turn it.
  const zoom = interpolate(
    frame,
    [DIAL_T.zoom, DIAL_T.turn + 6, DIAL_T.zoomOut, S3 + 6],
    [1, 1.32, 1.32, 1],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );

  const zoomK = (zoom - 1) / 0.32;
  // In 9:16 the toaster sits lower until the CTA, where the camera tilts up.
  const worldY = L.tall ? interpolate(frame, [S4 - 12, S4 + 6], [100, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) }) : 0;

  // Lever: down while toasting, up when it pops.
  let leverY: number = LEVER.bottom;
  if (frame >= HOOK_T.pop) leverY = interpolate(frame, [HOOK_T.pop, HOOK_T.pop + 4], [LEVER.bottom, LEVER.top], clamp);
  if (frame >= DIAL_T.inSlot) leverY = interpolate(frame, [DIAL_T.inSlot, DIAL_T.inSlot + 5], [LEVER.top, LEVER.bottom], clamp);
  if (frame >= AGENDA_T.pop) leverY = interpolate(frame, [AGENDA_T.pop, AGENDA_T.pop + 4], [LEVER.bottom, LEVER.top], clamp);
  if (frame >= CTA_T.press) leverY = interpolate(frame, [CTA_T.press, CTA_T.press + 6], [LEVER.top, LEVER.bottom], clamp);
  if (frame >= CTA_T.launch) leverY = interpolate(frame, [CTA_T.launch, CTA_T.launch + 4], [LEVER.bottom, LEVER.top], clamp);

  // Dial pointer: on the due day, turned to the chosen day.
  const turn = interpolate(frame, [DIAL_T.turn, DIAL_T.chosen - 2], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.back(1.4)),
  });
  const pointer = lerp(dialAngle(dial.dueIndex), dialAngle(dial.chosenIndex), turn);
  const chosenIn = interpolate(frame, [DIAL_T.chosen - 2, DIAL_T.chosen + 6], [0, 1], clamp);
  const ripple = interpolate(frame, [DIAL_T.turn - 4, DIAL_T.turn + 14], [0, 1], clamp);
  const heat = interpolate(frame, [0, HOOK_T.burn + 20, HOOK_T.pop - 2, HOOK_T.pop + 2], [0.6, 1, 1, 0], clamp);

  // ---- Bill 1: burns, pops, gets the AANMANING stamp, then leaves.
  const burn = interpolate(frame, [HOOK_T.burn, HOOK_T.pop], [0, 1], clamp);
  const popUp = pop(frame, fps, HOOK_T.pop, springs.pop);
  const sh = shake(frame, HOOK_T.stamp, 14, 18);
  const out1 = interpolate(frame, [DIAL_T.out - 2, DIAL_T.out + 10], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const b1Scale = lerp(BILL_SCALE, 0.78, popUp);
  const b1Top = lerp(BILL_REST_TOP, 95, popUp) + Math.sin(frame / 3) * (frame < HOOK_T.pop ? 1.5 : 0);
  const b1X = lerp(SLOT.cx, 540, popUp) - 900 * out1;
  const stampIn = pop(frame, fps, HOOK_T.stamp, springs.pop);
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.bouncy);

  // ---- Bill 2: forwarded, flies into the slot, later pops into the agenda.
  const inT = interpolate(frame, [DIAL_T.slideIn, DIAL_T.inSlot], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fly = interpolate(frame, [AGENDA_T.pop, AGENDA_T.land], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const dueStage = tileCenter(dial.dueIndex);
  const due = toWorld(dueStage.x, dueStage.y - worldY);
  let b2 = { x: lerp(-300, SLOT.cx, inT), top: lerp(60, BILL_REST_TOP, inT), scale: BILL_SCALE, rot: lerp(-25, 0, inT), op: 1 };
  if (frame >= AGENDA_T.pop) {
    const cx = lerp(SLOT.cx, due.x, fly);
    const cy = lerp(BILL_REST_TOP + (BILL_H * BILL_SCALE) / 2, due.y, fly) - 120 * Math.sin(Math.PI * fly);
    const sc = lerp(BILL_SCALE, 0.12, fly);
    b2 = { x: cx, top: cy - (BILL_H * sc) / 2, scale: sc, rot: 20 * fly, op: fly > 0.92 ? 0 : 1 };
  }

  // ---- Agenda strip.
  const stripIn = pop(frame, fps, AGENDA_T.strip, springs.smooth);
  const stripOut = interpolate(frame, [S4 - 6, S4 + 6], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const dueIn = interpolate(frame, [AGENDA_T.land - 2, AGENDA_T.land + 6], [0, 1], clamp);
  const remIn = interpolate(frame, [AGENDA_T.reminder, AGENDA_T.reminder + 8], [0, 1], clamp);

  // ---- Buddy.
  const buddyIn = pop(frame, fps, DIAL_T.buddy - 3, springs.bouncy);
  const hopU = interpolate(frame, [CTA_T.hop, CTA_T.press], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const bx = BUDDY_HOME.x;
  let feet = BUDDY_HOME.feet;
  if (frame >= CTA_T.hop) feet -= 110 * Math.sin(Math.PI * hopU);
  const jump = frame >= AGENDA_T.pop && frame < AGENDA_T.pop + 16 ? Math.sin((Math.PI * (frame - AGENDA_T.pop)) / 16) : 0;
  feet -= 30 * jump;
  const squash =
    1 +
    0.2 * Math.sin(Math.PI * interpolate(frame, [AGENDA_T.pop - 3, AGENDA_T.pop + 3], [0, 1], clamp)) * -1 +
    0.15 * jump +
    -0.22 * Math.sin(Math.PI * interpolate(frame, [CTA_T.press, CTA_T.press + 8], [0, 1], clamp));
  const lookAtDial = interpolate(frame, [DIAL_T.zoom, DIAL_T.zoom + 8, DIAL_T.zoomOut, S3], [0, 1, 1, 0], clamp);
  const lookUp = interpolate(frame, [AGENDA_T.pop, AGENDA_T.pop + 6, S4 - 16, S4 - 10], [0, 1, 1, 0], clamp);
  const lookBtn = interpolate(frame, [CTA_T.launch, CTA_T.launch + 6], [0, 1], clamp);
  const look = {
    x: -0.6 * lookAtDial + 0.6 * lookUp + 0.6 * lookBtn,
    y: 0.7 * lookAtDial - 0.9 * lookUp - 0.8 * lookBtn,
  };
  const happy = interpolate(frame, [AGENDA_T.happy, AGENDA_T.happy + 4, AGENDA_T.happy + 22, AGENDA_T.happy + 28], [1, 0.18, 0.18, 1], clamp);
  const blink = Math.min(happy, blinkScale(frame, [DIAL_T.buddy + 18, CTA_T.tap + 6]));

  // ---- CTA button out of the slot.
  const launch = pop(frame, fps, CTA_T.launch, springs.bouncy);
  const btnTop = lerp(TOASTER.y + 20, 170, launch);
  const tapK = frame >= CTA_T.tap ? Math.sin(Math.PI * interpolate(frame, [CTA_T.tap, CTA_T.tap + 8], [0, 1], clamp)) : 0;
  const ripple2 = interpolate(frame, [CTA_T.tap, CTA_T.tap + 16], [0, 1], clamp);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  // ---- Headlines: each holds until the next spoken scene start.
  const hold = (from: number, to: number | null) =>
    to === null
      ? interpolate(frame, [from - 1, from], [0, 1], clamp)
      : interpolate(frame, [from - 1, from, to - 4, to + 2], [0, 1, 1, 0], clamp);

  const taglineLines = cta.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden", fontFamily: fonts.display }}>
      <AbsoluteFill style={{ opacity: hold(-30, S2) }}>
        <Headline text={hook.headline} color={p.blue} delay={-26} stagger={2} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: hold(S2, S3) }}>
        <Headline text={dial.headline} color={p.white} delay={S2 + 2} stagger={3} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: hold(S3, S4) }}>
        <Headline text={agenda.headline} color={p.blue} delay={S3 + 2} stagger={3} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: hold(S4, null) }}>
        <div
          style={{
            position: "absolute",
            top: L.safeTop,
            left: L.sidePadding,
            right: L.sidePadding,
            textAlign: "center",
            fontFamily: fonts.display,
            fontWeight: 500,
            fontSize: L.headlineSize,
            lineHeight: 1.0,
            letterSpacing: headlineTracking,
          }}
        >
          {taglineLines.map((words, li) => (
            <div key={li}>
              {words.map((w, i) => {
                const s = pop(frame, fps, S4 + 2 + 3 * wi++, springs.pop);
                return (
                  <React.Fragment key={i}>
                    <span
                      style={{
                        display: "inline-block",
                        color: li === 0 ? p.white : p.blueSoft,
                        opacity: Math.min(1, s * 1.4),
                        transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
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
      </AbsoluteFill>

      <Stage offsetY={30}>
          {/* agenda week (top of the stage) */}
          {frame >= AGENDA_T.strip - 2 && stripOut < 1 ? (
            <AgendaStrip
              days={dial.days}
              dueIndex={dial.dueIndex}
              reminderIndex={dial.chosenIndex}
              dueIn={dueIn}
              reminderIn={remIn}
              amount={bill.amount}
              reminderLabel={agenda.reminderLabel}
              dueLabel={agenda.dueLabel}
              style={{
                opacity: Math.min(1, stripIn * 1.5) * (1 - stripOut),
                transform: `translateY(${(1 - stripIn) * -80 - stripOut * 120}px)`,
              }}
            />
          ) : null}

      </Stage>
      <Stage offsetY={30}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translateY(${worldY - 190 * zoomK}px) scale(${WORLD.scale})`,
            transformOrigin: `${WORLD.ox}px ${WORLD.oy}px`,
          }}
        >
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${zoom})`,
            transformOrigin: `${DIAL.cx}px ${DIAL.cy}px`,
          }}
        >
          <Smoke frame={frame} start={HOOK_T.burn + 8} end={HOOK_T.pop + 10} color="#8c8f9c" />

          {/* bill 1 (burns) */}
          {out1 < 1 ? (
            <div
              style={{
                position: "absolute",
                left: b1X + sh.x * (frame >= HOOK_T.stamp ? 1 : 0) - BILL_W / 2,
                top: b1Top,
                width: BILL_W,
                height: BILL_H,
                transform: `scale(${b1Scale}) rotate(${(frame >= HOOK_T.stamp ? sh.r : 0) - 25 * out1}deg)`,
                transformOrigin: "50% 0%",
                opacity: 1 - out1,
              }}
            >
              <BillCard
                sender={bill.sender}
                subject={bill.subject}
                amount={bill.amount}
                dueLabel={frame >= HOOK_T.stamp ? hook.lateLabel : bill.due}
                urgent={frame >= HOOK_T.stamp}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 48,
                  background:
                    "radial-gradient(ellipse at 50% 45%, rgba(150,90,30,0.10) 35%, rgba(110,55,15,0.55) 75%, rgba(40,20,5,0.92) 100%)",
                  opacity: burn,
                }}
              />
              {frame >= HOOK_T.stamp ? (
                <div
                  style={{
                    position: "absolute",
                    right: 50,
                    top: 44,
                    padding: "10px 30px 14px",
                    border: `7px solid ${p.red}`,
                    borderRadius: 26,
                    color: p.red,
                    background: "rgba(255,255,255,0.95)",
                    fontFamily: fonts.display,
                    fontWeight: 700,
                    fontSize: 62,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    opacity: interpolate(stampIn, [0, 0.3], [0, 1], clamp),
                    transform: `rotate(-9deg) scale(${interpolate(stampIn, [0, 1], [2.2, 1])})`,
                  }}
                >
                  {hook.stamp}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* bill 2 (forwarded) */}
          {frame >= DIAL_T.slideIn && b2.op > 0 ? (
            <div
              style={{
                position: "absolute",
                left: b2.x - BILL_W / 2,
                top: b2.top,
                width: BILL_W,
                height: BILL_H,
                transform: `scale(${b2.scale}) rotate(${b2.rot}deg)`,
                transformOrigin: "50% 0%",
              }}
            >
              <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
            </div>
          ) : null}

          {/* CTA button rising out of the slot (behind the body until it clears) */}
          {frame >= CTA_T.launch ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                width: 1080,
                top: btnTop,
                display: "flex",
                justifyContent: "center",
                transform: `scale(${1.2 * (1 - 0.06 * tapK)})`,
              }}
            >
              <div style={{ position: "relative" }}>
                <CtaPill text={cta.button} arrowIn={interpolate(frame, [CTA_T.launch + 6, CTA_T.launch + 16], [0, 1], clamp)} />
                <div
                  style={{
                    position: "absolute",
                    left: CTA_H / 2 - 90,
                    top: CTA_H / 2 - 90,
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    border: `5px solid ${p.white}`,
                    opacity: ripple2 > 0 && ripple2 < 1 ? (1 - ripple2) * 0.9 : 0,
                    transform: `scale(${0.3 + ripple2 * 1.2})`,
                  }}
                />
              </div>
            </div>
          ) : null}

          <ToasterBody
            leverY={leverY}
            pointer={pointer}
            labels={dial.days.map((d) => d.day)}
            dueIndex={dial.dueIndex}
            chosen={dial.chosenIndex}
            chosenIn={chosenIn}
            ripple={ripple}
            heat={heat}
          />

          {/* cost chip */}
          {frame >= HOOK_T.chip && out1 < 1 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 330,
                display: "flex",
                justifyContent: "center",
                opacity: Math.min(1, chipIn * 2) * (1 - out1),
                transform: `scale(${0.5 + 0.5 * chipIn})`,
              }}
            >
              <div
                style={{
                  background: p.red,
                  color: "#fff",
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 46,
                  padding: "20px 40px",
                  borderRadius: 50,
                  boxShadow: "0 20px 50px rgba(255, 90, 121, 0.35)",
                }}
              >
                {hook.costChip}
              </div>
            </div>
          ) : null}

          {/* Buddy */}
          {frame >= DIAL_T.buddy - 3 ? (
            <Buddy
              size={BUDDY}
              body={buddyBody}
              eye={buddyEye}
              blink={blink}
              look={look}
              squash={squash}
              style={{
                position: "absolute",
                left: bx - BUDDY / 2,
                top: feet - BUDDY * BUDDY_RATIO,
                opacity: Math.min(1, buddyIn * 3),
                transform: `scale(${0.3 + 0.7 * Math.min(1.1, buddyIn)})`,
                transformOrigin: "50% 100%",
              }}
            />
          ) : null}

          {/* wordmark under the toaster */}
          {frame >= CTA_T.logo ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: TOASTER.y + TOASTER.h + 24,
                display: "flex",
                justifyContent: "center",
                opacity: logoIn,
                transform: `translateY(${(1 - logoIn) * 30}px)`,
              }}
            >
              <Wordmark size={80} betaal={p.blueSoft} buddy={p.white} />
            </div>
          ) : null}
        </div>
        </div>
      </Stage>

      {frame >= DIAL_T.chosen - 2 && frame < S3 + 2 ? (
        <AbsoluteFill style={{ opacity: interpolate(frame, [S3 - 4, S3 + 2], [1, 0], clamp) }}>
          <Subline text={dial.subline} color={p.white} delay={DIAL_T.chosen - 2} />
        </AbsoluteFill>
      ) : null}
          </AbsoluteFill>
  );
};

export const BroodroosterAd: React.FC<BroodroosterProps> = (props) => (
  <PaletteProvider colors={props.colors}>
    <Shot {...props} />
    {props.withVoice ? <Audio src={staticFile(VO_FILE)} volume={props.voiceVolume} /> : null}
    {props.showSafeZones ? <SafeZones /> : null}
  </PaletteProvider>
);
