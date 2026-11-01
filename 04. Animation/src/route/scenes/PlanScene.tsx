import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { ForwardedBill, FWD_H, FWD_W } from "../components/ForwardedBill";
import { DEST, DEST_LABEL, MapCard, MapLabel, Pin, ROUTE, RouteLine, STOPS, StopDot } from "../components/MapKit";
import type { RouteProps } from "../schema";

// Timeline (frames, scene-local).
export const PLAN_T = {
  mail: 10, // the forwarded bill drops onto the map
  buddy: 22, // Buddy pops up as the position marker
  blink: 34,
  fly: 42, // the bill shrinks and flies to the destination
  flyLen: 14,
  pin: 54, // destination pin "28 nov · Betalen"
  route: 58, // Buddy's route draws itself
  routeLen: 22,
  stop1: 68, // waypoint 7 days before
  stop2: 76, // waypoint 2 days before
  subline: 62,
};

const MAP = { x: 60, y: 90 };
export const BUDDY_SIZE = 116;

export const PlanScene: React.FC<{ props: RouteProps["plan"]; bill: RouteProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const mailIn = pop(frame, fps, PLAN_T.mail, springs.pop);
  const fly = interpolate(frame, [PLAN_T.fly, PLAN_T.fly + PLAN_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  // Card centre: from mid-map to the destination pin.
  const cx = interpolate(fly, [0, 1], [MAP.x + 480, MAP.x + DEST[0]]);
  const cy = interpolate(fly, [0, 1], [MAP.y + 250, MAP.y + DEST[1] - 50]);
  const cardScale = (0.85 + 0.15 * mailIn) * (1 - 0.9 * fly);

  const pinIn = pop(frame, fps, PLAN_T.pin, springs.bouncy);
  const route = interpolate(frame, [PLAN_T.route, PLAN_T.route + PLAN_T.routeLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const s1 = pop(frame, fps, PLAN_T.stop1, springs.bouncy);
  const s2 = pop(frame, fps, PLAN_T.stop2, springs.bouncy);

  const buddyIn = pop(frame, fps, PLAN_T.buddy, springs.bouncy);
  const squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.12, 1]);
  const blink = blinkScale(frame, [PLAN_T.blink]);
  // Looks at the bill, then follows it to the destination.
  const lookX = interpolate(frame, [PLAN_T.buddy, PLAN_T.fly, PLAN_T.fly + PLAN_T.flyLen], [0.3, 0.5, 1], clamp);
  const lookY = interpolate(frame, [PLAN_T.buddy, PLAN_T.fly + PLAN_T.flyLen], [-0.6, -1], clamp);
  const [bx, by] = ROUTE[0];

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={6} stagger={3} sizeFactor={0.88} />

      <Stage offsetY={0}>
        <MapCard
          mode="blue"
          style={{ left: MAP.x, top: MAP.y }}
          overlay={<RouteLine pts={ROUTE} progress={route} color={p.white} />}
        >
          {frame >= PLAN_T.stop1 ? <StopDot x={STOPS[0][0]} y={STOPS[0][1]} fill={p.blue} ring={p.white} scale={s1} /> : null}
          {frame >= PLAN_T.stop2 ? <StopDot x={STOPS[1][0]} y={STOPS[1][1]} fill={p.blue} ring={p.white} scale={s2} /> : null}
          {frame >= PLAN_T.pin ? <Pin x={DEST[0]} y={DEST[1]} color={p.white} iconColor={p.blue} icon="flag" scale={pinIn} /> : null}
          {frame >= PLAN_T.pin ? (
            <MapLabel
              text={bill.destination}
              x={DEST_LABEL[0]}
              y={DEST_LABEL[1]}
              anchor="right"
              bg={p.white}
              color={p.blue}
              style={{ opacity: Math.min(1, pinIn * 2) }}
            />
          ) : null}

          {/* Buddy is the position marker */}
          <div
            style={{
              position: "absolute",
              left: bx - 70,
              top: by - 26,
              width: 140,
              height: 52,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.22)",
              transform: `scale(${buddyIn})`,
            }}
          />
          <Buddy
            size={BUDDY_SIZE}
            body={p.white}
            eye={p.blueMascot}
            blink={blink}
            squash={squash}
            look={{ x: lookX, y: lookY }}
            style={{
              position: "absolute",
              left: bx - BUDDY_SIZE / 2,
              top: by - BUDDY_SIZE * BUDDY_RATIO + 8,
              opacity: Math.min(1, buddyIn * 3),
              transform: `scale(${0.3 + 0.7 * buddyIn})`,
              transformOrigin: "50% 100%",
            }}
          />
        </MapCard>

        {frame >= PLAN_T.mail && fly < 1 ? (
          <ForwardedBill
            chip={props.forwardedChip}
            sender={bill.sender}
            subject={bill.subject}
            amount={bill.amount}
            due={bill.dueLabel}
            style={{
              left: cx - FWD_W / 2,
              top: cy - FWD_H / 2,
              opacity: Math.min(1, mailIn * 2) * (1 - fly * 0.6),
              transform: `scale(${cardScale}) rotate(${(1 - mailIn) * -6}deg)`,
            }}
          />
        ) : null}
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={PLAN_T.subline} />
    </SceneBg>
  );
};
