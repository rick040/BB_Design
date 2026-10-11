import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Notification, NOTIFICATION_H, NOTIFICATION_W } from "../components/Notification";
import { SceneBg, Stage } from "../components/Stage";
import { Headline, Subline } from "../components/Text";
import { clamp, pop, pushedSlots, springs } from "../lib/anim";
import { usePalette } from "../lib/palette";
import type { AdProps } from "../schema";
import { fonts } from "../theme";

const ARRIVALS = [20, 40, 60];
const GAP = 22;
const STACK_TOP = 300;
const TILE = 180;

export const RemindScene: React.FC<{ props: AdProps["remind"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const items = props.notifications;
  const arrivals = ARRIVALS.slice(0, items.length);

  const tileIn = pop(frame, fps, 6, springs.bouncy);
  // Calendar tile "ticks" each time a reminder lands.
  const tick = arrivals.reduce((acc, a) => {
    const t = frame - a;
    return acc + (t >= 0 && t < 10 ? Math.sin((t / 10) * Math.PI) * 0.08 : 0);
  }, 0);
  const plus = pop(frame, fps, 14, springs.bouncy);

  // The most urgent (last) reminder gets a little wiggle.
  const last = arrivals[arrivals.length - 1] ?? 0;
  const wiggle =
    frame > last + 8 && frame < last + 26 ? Math.sin((frame - last - 8) * 1.4) * 2.2 * (1 - (frame - last - 8) / 18) : 0;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={2} stagger={3} />

      <Stage>
        {/* Calendar tile (02. Elements/datevector.svg) */}
        <div
          style={{
            position: "absolute",
            left: 540 - TILE / 2,
            top: 40,
            width: TILE,
            height: TILE,
            transform: `scale(${tileIn * (1 + tick)}) rotate(${(1 - tileIn) * -20}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 26,
              background: p.blueMid,
              boxShadow: "0 24px 60px rgba(36, 89, 253, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontSize: 96,
              letterSpacing: "-0.04em",
              color: "#fff",
              paddingBottom: 6,
              boxSizing: "border-box",
            }}
          >
            {props.calendarDay}
          </div>
          <div
            style={{
              position: "absolute",
              right: -30,
              top: -30,
              width: 70,
              height: 70,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 8px 20px rgba(0, 30, 140, 0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 52,
              color: p.blueMid,
              transform: `scale(${plus})`,
            }}
          >
            +
          </div>
        </div>

        {/* Notification stack, newest on top */}
        {items.map((n, i) => {
          const a = arrivals[i];
          if (frame < a - 1) return null;
          const enter = pop(frame, fps, a, { damping: 16, stiffness: 160 });
          const slots = pushedSlots(frame, fps, arrivals, i);
          const y = STACK_TOP + slots * (NOTIFICATION_H + GAP) - (1 - enter) * 120;
          const isLast = i === items.length - 1;
          return (
            <Notification
              key={i}
              text={n.text}
              time={n.time}
              icon={n.icon}
              style={{
                position: "absolute",
                left: (1080 - NOTIFICATION_W) / 2,
                top: y,
                opacity: enter,
                transform: `scale(${(0.9 + 0.1 * enter) * (1 - slots * 0.03)}) rotate(${isLast ? wiggle : 0}deg)`,
                zIndex: 10 + i,
                filter: `saturate(${1 - Math.min(slots, 2) * 0.15})`,
              }}
            />
          );
        })}

        {/* Soft fade of older cards at the bottom */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 840,
            height: 120,
            background: `linear-gradient(to bottom, transparent, ${p.light})`,
            zIndex: 30,
            opacity: interpolate(frame, [arrivals[0] ?? 0, (arrivals[0] ?? 0) + 10], [0, 1], clamp),
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={66} />
    </SceneBg>
  );
};
