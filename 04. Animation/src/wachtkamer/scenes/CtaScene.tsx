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
import { Dispenser } from "../components/Parts";
import { SCENE_STARTS, VOICE_END, type WachtkamerProps, wordAt } from "../schema";

const S = SCENE_STARTS[3];
export const CTA_T = {
  props: S - 4, // automaat en Buddy staan er
  press: wordAt("volgende") + 8, // Buddy drukt op de automaat
  ticketLen: 12, // kaartje rolt eruit
  button: wordAt("activeer"), // kaartje wordt de knop
  logo: wordAt("activeer") + 6,
  subline: wordAt("activeer") + 12,
  tap: VOICE_END - 2,
};
// Tagline words land on the spoken words.
const SPOKEN = [wordAt("wie"), wordAt("is"), wordAt("de", 3), wordAt("volgende")];

const DISP = { x: 330, y: 40, w: 220, h: 260 };
const SLOT = { x: DISP.x + DISP.w / 2, y: DISP.y + DISP.h * 0.7 + 8 };
const BUDDY = 170;
const BUDDY_X = 680;
const FEET = DISP.y + DISP.h;
const BTN_Y = 420;

export const CtaScene: React.FC<{ props: WachtkamerProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const lines = props.tagline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const propsIn = pop(frame, fps, CTA_T.props, springs.bouncy);
  const press = interpolate(frame, [CTA_T.press - 6, CTA_T.press, CTA_T.press + 6], [0, 1, 0], clamp);
  const lean = interpolate(frame, [CTA_T.press - 8, CTA_T.press, CTA_T.press + 10], [0, 1, 0], clamp);
  const ticketOut = interpolate(frame, [CTA_T.press + 2, CTA_T.press + 2 + CTA_T.ticketLen], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const morph = interpolate(frame, [CTA_T.button - 4, CTA_T.button + 6], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const btnIn = pop(frame, fps, CTA_T.button, springs.bouncy);
  const arrowIn = pop(frame, fps, CTA_T.button + 6, springs.pop);
  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.93, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  const TICKET_W = 150;
  const ticketH = 150 * ticketOut;
  const tX = interpolate(morph, [0, 1], [SLOT.x, 540]);
  const tY = interpolate(morph, [0, 1], [SLOT.y, BTN_Y + CTA_H / 2 - 75]);

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
          fontSize: L.headlineSize * 1.2,
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

      <Stage offsetY={60}>
        <div style={{ opacity: Math.min(1, propsIn * 2), transform: `translateY(${(1 - propsIn) * 60}px)` }}>
          {/* ticket (behind the machine while it rolls out of the slot) */}
          {ticketOut > 0 && morph < 1 ? (
            <div
              style={{
                position: "absolute",
                left: tX - TICKET_W / 2,
                top: tY,
                width: TICKET_W,
                height: ticketH,
                overflow: "hidden",
                borderRadius: "0 0 12px 12px",
                background: p.white,
                boxShadow: "0 10px 24px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                opacity: 1 - morph,
                transform: `rotate(${(1 - ticketOut) * 4 + morph * -6}deg) scale(${1 + morph * 0.4})`,
                zIndex: 3,
              }}
            >
              <div
                style={{
                  paddingBottom: 22,
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 42,
                  letterSpacing: "-0.03em",
                  color: p.blue,
                  whiteSpace: "nowrap",
                }}
              >
                {props.ticket}
              </div>
            </div>
          ) : null}
          <Dispenser width={DISP.w} height={DISP.h} press={press} style={{ position: "absolute", left: DISP.x, top: DISP.y, zIndex: 2 }} />
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={blinkScale(frame, [CTA_T.button + 16])}
            squash={1 - 0.14 * press}
            look={frame > CTA_T.press + 4 ? { x: -0.6, y: 0.8 } : { x: -0.8, y: -0.2 }}
            style={{
              position: "absolute",
              left: BUDDY_X - BUDDY / 2,
              top: FEET - BUDDY * BUDDY_RATIO,
              transform: `rotate(${-14 * lean}deg) translateX(${-30 * lean}px)`,
              transformOrigin: "50% 100%",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BTN_Y,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${1.3 * btnIn * tap})`,
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
            top: 710,
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
