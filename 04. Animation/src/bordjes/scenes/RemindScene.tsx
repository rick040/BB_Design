import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { PlateOnStick } from "../components/Plate";
import type { BordjesProps } from "../schema";
import { FLOOR, PLATE_RX, PLATE_TIPS, PLATE_XS, SPIN } from "./HookScene";

// Timeline (frames, scene-local).
export const REMIND_T = {
  wobble: 10, // the same plate starts to wobble again
  event: 30, // reminder pops up in the agenda
  bump: 46, // Buddy bumps the stick: steady again
  steady: 58, // wobble has died out
  subline: 62,
};

const BUDDY = 145;
const AGENDA = { x: 50, y: 660, w: 980, h: 210 };

export const RemindScene: React.FC<{
  props: BordjesProps["remind"];
  plates: BordjesProps["plates"];
  fallingIndex: number;
}> = ({ props, plates, fallingIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const grow = interpolate(frame, [REMIND_T.wobble, REMIND_T.event + 6], [0, 16], clamp);
  const calm = interpolate(frame, [REMIND_T.bump, REMIND_T.steady], [1, 0], clamp);
  const wobbleAmp = grow * calm;

  // Buddy stands right of the wobbling stick and hops into it.
  const stickX = PLATE_XS[fallingIndex];
  const side = fallingIndex === 3 ? -1 : 1;
  const homeX = stickX + side * 135;
  const hopT = interpolate(frame, [REMIND_T.bump - 8, REMIND_T.bump + 8], [0, 1], clamp);
  const hopY = -90 * 4 * hopT * (1 - hopT);
  const hopX = interpolate(frame, [REMIND_T.bump - 8, REMIND_T.bump, REMIND_T.bump + 10], [0, -side * 80, 0], clamp);
  const squash = interpolate(
    frame,
    [REMIND_T.bump - 11, REMIND_T.bump - 8, REMIND_T.bump - 4, REMIND_T.bump, REMIND_T.bump + 3, REMIND_T.bump + 9, REMIND_T.bump + 12, REMIND_T.bump + 17],
    [1, 0.82, 1.12, 0.86, 1.06, 1.04, 0.86, 1],
    clamp,
  );
  const look =
    frame < REMIND_T.event
      ? { x: -side * 0.6, y: -1 }
      : frame < REMIND_T.bump - 8
        ? { x: 0, y: 0.9 }
        : { x: -side * 0.8, y: -0.9 };
  const blink = blinkScale(frame, [REMIND_T.steady + 6, REMIND_T.steady + 40]);
  const happy = frame > REMIND_T.steady ? 0.35 : 1;
  const buddyIn = pop(frame, fps, -8, springs.bouncy);

  const event = pop(frame, fps, REMIND_T.event, springs.bouncy);
  const bell = frame >= REMIND_T.event ? Math.sin((frame - REMIND_T.event) * 0.9) * 18 * Math.exp(-(frame - REMIND_T.event) / 14) : 0;
  const sparkle = interpolate(frame, [REMIND_T.bump, REMIND_T.bump + 14], [0, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={6} stagger={3} />

      <Stage offsetY={20}>
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: FLOOR,
            height: 6,
            borderRadius: 3,
            background: "#dfe5f0",
          }}
        />
        {plates.map((label, i) => {
          const idle = Math.sin(frame / 9 + i * 1.7) * 2.2;
          const target = i === fallingIndex;
          const wobble = target ? wobbleAmp * Math.sin((frame - REMIND_T.wobble) * 0.5) + idle : idle;
          const bumpSway = target ? interpolate(frame, [REMIND_T.bump, REMIND_T.bump + 3, REMIND_T.bump + 9], [0, side * 4, 0], clamp) : 0;
          return (
            <PlateOnStick
              key={i}
              x={PLATE_XS[i]}
              tipY={PLATE_TIPS[i]}
              floorY={FLOOR}
              rx={PLATE_RX}
              label={label}
              phase={frame * SPIN * (target ? 1 - 0.5 * (grow / 16) * calm : 1) + i * 0.27}
              wobble={wobble}
              stickSway={idle * 0.2 + bumpSway + (target ? wobble * 0.12 : 0)}
            />
          );
        })}

        {/* little spin marks once the plate runs smooth again */}
        {[0, 1].map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: stickX + (k === 0 ? -PLATE_RX - 50 : PLATE_RX + 18),
              top: PLATE_TIPS[fallingIndex] - 40,
              width: 34,
              height: 80,
              borderLeft: k === 1 ? `7px solid ${p.blue}` : undefined,
              borderRight: k === 0 ? `7px solid ${p.blue}` : undefined,
              borderRadius: "50%",
              opacity: sparkle > 0 && sparkle < 1 ? Math.sin(sparkle * Math.PI) : 0,
              transform: `scale(${0.6 + sparkle * 0.6})`,
            }}
          />
        ))}

        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          blink={Math.min(blink, happy)}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: homeX - BUDDY / 2 + hopX,
            top: FLOOR - BUDDY * BUDDY_RATIO + hopY,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />

        {/* reminder in the agenda */}
        <div
          style={{
            position: "absolute",
            left: AGENDA.x,
            top: AGENDA.y,
            width: AGENDA.w,
            height: AGENDA.h,
            borderRadius: 36,
            background: p.white,
            boxShadow: "0 18px 50px rgba(1,59,255,0.16)",
            display: "flex",
            alignItems: "center",
            gap: 32,
            padding: "0 30px",
            boxSizing: "border-box",
            fontFamily: fonts.ui,
            opacity: frame >= REMIND_T.event ? Math.min(1, event * 2) : 0,
            transform: `translateY(${(1 - event) * 80}px) scale(${0.8 + 0.2 * event})`,
          }}
        >
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: 28,
              background: p.blue,
              color: p.white,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: "0.08em", color: p.blueSoft }}>{props.eventDay}</div>
            <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1 }}>{props.eventDate}</div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 44, fontWeight: 700, color: p.ink, whiteSpace: "nowrap" }}>{props.eventTitle}</div>
            <div style={{ fontSize: 38, color: "#6b6f7a", marginTop: 8 }}>{props.eventLine}</div>
          </div>
          <svg
            width={60}
            height={60}
            viewBox="0 0 24 24"
            style={{ flexShrink: 0, transform: `rotate(${bell}deg)`, transformOrigin: "50% 10%" }}
          >
            <path
              d="M12 2.5a6 6 0 0 0-6 6v4.2l-1.8 3.1h15.6L18 12.7V8.5a6 6 0 0 0-6-6Zm-2.4 15.2a2.4 2.4 0 0 0 4.8 0"
              fill={p.blue}
              stroke={p.blue}
              strokeWidth={1}
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={REMIND_T.subline} />
    </SceneBg>
  );
};
