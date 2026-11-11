import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CTA_H, CtaPill } from "../../components/CtaPill";
import { Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { type KnikkerbaanProps, SCENE_STARTS, VOICE_END, wordAt } from "../schema";

// Slot: the button is the last thing down the run. Buddy sleds down the final
// ramp on top of it, it stops flat, Buddy flies off and lands beside it.
const S = SCENE_STARTS[3];
export const CTA_T = {
  tagline: S + 6,
  sled: S + 6, //               button + Buddy enter on the last ramp
  stop: wordAt("buddy", 2) + 2, // button stops on the floor
  land: wordAt("buddy", 2) + 14, // Buddy lands beside it
  logo: S + 16,
  subline: S + 24,
  tap: VOICE_END + 6,
};

const FLOOR = 470; // stage y of the button's bottom edge
const RAMP = { x0: -260, y0: 160, x1: 260 }; // last ramp into the floor
const BTN_SCALE = 1.15;
const BUDDY = 130;

export const CtaScene: React.FC<{ props: KnikkerbaanProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const layerIn = interpolate(frame, [S - 4, S + 4], [0, 1], clamp);
  const u = interpolate(frame, [CTA_T.sled, CTA_T.stop], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rampDeg = (Math.atan2(FLOOR - RAMP.y0, RAMP.x1 - RAMP.x0) * 180) / Math.PI;
  // along the ramp until u=0.45, then flat to the centre
  const bx = interpolate(u, [0, 0.45, 1], [RAMP.x0, RAMP.x1, 540]);
  const by = interpolate(u, [0, 0.45, 1], [RAMP.y0, FLOOR, FLOOR]);
  const br = interpolate(u, [0, 0.4, 0.55, 1], [rampDeg, rampDeg, 0, 0]);
  const stopSq = interpolate(frame, [CTA_T.stop, CTA_T.stop + 3, CTA_T.stop + 8], [1, 0.92, 1], clamp);

  // Buddy rides on top, then flies forward and lands to the right.
  const riding = frame < CTA_T.stop;
  const fly = interpolate(frame, [CTA_T.stop, CTA_T.land], [0, 1], clamp);
  const landX = 955;
  const rideTop = by - CTA_H * BTN_SCALE; // feet on top of the button
  const flyX = interpolate(fly, [0, 1], [bx, landX]);
  const flyY = interpolate(fly, [0, 1], [rideTop, FLOOR]) - Math.sin(Math.PI * fly) * 160;
  const landSq = interpolate(frame, [CTA_T.land, CTA_T.land + 3, CTA_T.land + 9], [1, 0.78, 1], clamp);
  const tapSq = interpolate(frame, [CTA_T.tap - 4, CTA_T.tap, CTA_T.tap + 6], [1, 0.85, 1], clamp);

  const tap = interpolate(frame, [CTA_T.tap, CTA_T.tap + 3, CTA_T.tap + 9], [1, 0.94, 1], clamp);
  const ripple = interpolate(frame, [CTA_T.tap + 1, CTA_T.tap + 18], [0, 1], clamp);
  const arrowIn = pop(frame, fps, CTA_T.stop, springs.pop);
  const subIn = pop(frame, fps, CTA_T.subline, springs.smooth);
  const logoIn = pop(frame, fps, CTA_T.logo, springs.smooth);

  if (frame < S - 4) return null;
  const words = props.tagline.split(/\s+/).filter(Boolean).length;
  const lines = props.tagline.split("\n");

  return (
    <div style={{ position: "absolute", inset: 0, opacity: layerIn }}>
      <Headline text={lines[0]} color={p.white} delay={CTA_T.tagline} sizeFactor={1.1} />
      <Headline
        text={lines.slice(1).join("\n")}
        color={p.blueSoft}
        delay={CTA_T.tagline + 6}
        stagger={Math.max(2, Math.round(12 / words))}
        sizeFactor={L.tall ? 0.84 : 1}
        top={L.safeTop + L.headlineSize * 1.1 + 8}
      />
      <Stage offsetY={20}>
        {/* the last bit of the run */}
        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path
            d={`M ${RAMP.x0 - 200} ${RAMP.y0 - 200 * Math.tan((rampDeg * Math.PI) / 180)} L ${RAMP.x1} ${FLOOR} L 1180 ${FLOOR}`}
            stroke={p.blueSoft}
            strokeWidth={16}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.55}
            transform="translate(0 10)"
          />
        </svg>

        {frame >= CTA_T.sled ? (
        <div
          style={{
            position: "absolute",
            left: bx,
            top: by,
            transform: `translate(-50%, -100%) rotate(${br}deg) scale(${BTN_SCALE * tap}, ${BTN_SCALE * tap * stopSq})`,
            transformOrigin: "50% 100%",
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
        ) : null}

        {frame >= CTA_T.sled ? (
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [CTA_T.land + 12])}
          squash={riding ? 1 : Math.min(landSq, tapSq)}
          look={riding ? { x: 0.8, y: 0.3 } : fly < 1 ? { x: 0.9, y: 0.6 } : { x: -0.9, y: 0.3 }}
          style={{
            position: "absolute",
            left: (riding ? bx : flyX) - BUDDY / 2,
            top: (riding ? rideTop : flyY) - BUDDY * BUDDY_RATIO,
            transform: `rotate(${riding ? br : fly < 1 ? 20 * Math.sin(Math.PI * fly) : 0}deg)`,
            transformOrigin: riding ? `50% ${100 + (CTA_H * BTN_SCALE * 100) / (BUDDY * BUDDY_RATIO)}%` : "50% 100%",
          }}
        />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 560,
            display: "flex",
            justifyContent: "center",
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 40}px)`,
          }}
        >
          <Wordmark size={96} betaal={p.blueSoft} buddy={p.white} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 700,
            textAlign: "center",
            fontFamily: fonts.display,
            fontSize: 44,
            color: p.blueText,
            opacity: subIn,
          }}
        >
          {props.subline}
        </div>
      </Stage>
    </div>
  );
};
