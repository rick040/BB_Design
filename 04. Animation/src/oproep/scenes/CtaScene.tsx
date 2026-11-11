import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Ticket, TicketMachine } from "../components/Parts";
import { SCENE_STARTS, VOICE_END, type OproepProps, wordAt } from "../schema";

const S = SCENE_STARTS[3];
// Buddy tears a ticket off the machine on "Activeer"; the ticket flies down
// and turns into the button. Tap at the end of the voice.
export const CTA_T = {
  tagline: S - 6,
  taglineStagger: 3,
  ticketOut: S - 6,
  tear: wordAt("activeer") + 4,
  morphLen: 10,
  button: wordAt("activeer") + 12,
  logo: wordAt("buddy", 2),
  subline: wordAt("buddy", 2) + 6,
  tap: VOICE_END - 2,
};

const MACHINE = { x: 560, top: 0, w: 230 };
const SLOT_Y = MACHINE.top + MACHINE.w * 1.15 - MACHINE.w * 0.12;
const BUDDY = 170;
const BTN_TOP = 430;

export const CtaScene: React.FC<{ props: OproepProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const out = interpolate(frame, [CTA_T.ticketOut, CTA_T.tear], [0, 1], clamp);
  const m = interpolate(frame, [CTA_T.tear, CTA_T.tear + CTA_T.morphLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const torn = frame >= CTA_T.tear;
  const ticketY = SLOT_Y - 6 + (torn ? m * (BTN_TOP - SLOT_Y) : -150 + out * 150);
  const tug = interpolate(frame, [CTA_T.tear - 6, CTA_T.tear, CTA_T.tear + 6], [0, 1, 0], clamp);
  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 4, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);
  const buddyX = MACHINE.x - MACHINE.w / 2 - 110 + tug * 30;
  const squash = interpolate(frame, [CTA_T.tear - 6, CTA_T.tear, CTA_T.tear + 8], [1, 0.82, 1], clamp);

  return (
    <SceneBg color={p.blue}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop - 10,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize * 1.15,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const s = pop(frame, fps, CTA_T.tagline + wi++ * CTA_T.taglineStagger, springs.pop);
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

      <Stage offsetY={40}>
        {/* Ticket comes out of the slot, then flies down and becomes the button. */}
        {frame < CTA_T.button + 2 ? (
          <div
            style={{
              position: "absolute",
              left: MACHINE.x - 90,
              top: ticketY,
              transform: `rotate(${torn ? -8 * Math.sin(Math.PI * m) : 0}deg) scale(${1 - 0.2 * m})`,
              opacity: 1 - interpolate(frame, [CTA_T.button - 2, CTA_T.button + 2], [0, 1], clamp),
            }}
          >
            <Ticket width={180} height={150} top="nummer" big="1" />
          </div>
        ) : null}
        <TicketMachine width={MACHINE.w} style={{ position: "absolute", left: MACHINE.x - MACHINE.w / 2, top: MACHINE.top }} />
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [CTA_T.button + 16])}
          squash={squash}
          look={torn ? { x: 0.5, y: 0.8 } : { x: 0.9, y: 0.4 }}
          style={{
            position: "absolute",
            left: buddyX - BUDDY / 2,
            top: SLOT_Y + 10 - BUDDY * BUDDY_RATIO,
            transformOrigin: "50% 100%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BTN_TOP,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.25 * btnIn * tap})`,
            opacity: Math.min(1, btnIn * 2),
          }}
        >
          <div style={{ position: "relative" }}>
            <CtaPill text={props.button} arrowIn={arrowIn} />
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
            top: 600,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            color: p.blueText,
            opacity: subIn,
          }}
        >
          {props.subline}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 720,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
        </div>
      </Stage>
    </SceneBg>
  );
};
