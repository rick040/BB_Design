import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Notification, NOTIFICATION_W } from "../../components/Notification";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, pushedSlots, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { DEST, DEST_LABEL, distToVertex, MapCard, MapLabel, Pin, pointAtDist, polyLen, ROUTE, RouteLine, STOPS, StopDot } from "../components/MapKit";
import type { RouteProps } from "../schema";
import { BUDDY_SIZE } from "./PlanScene";

// Timeline (frames, scene-local).
export const DRIVE_T = {
  start: 8, // Buddy starts driving the route
  stop1: 28, // passes the 7-days waypoint: first notification
  stop2: 54, // passes the 2-days waypoint: second notification
  arrive: 78, // arrives at the due date: pin turns into a check
  onTime: 82, // "Op tijd" label
  agenda: 90, // "28 nov staat in je agenda"
};
const PAUSE = 6;

const MAP = { x: 60, y: 300 };
const SLOT_GAP = 170;

export const DriveScene: React.FC<{ props: RouteProps["drive"]; bill: RouteProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Distance along the route, with a short stop at each waypoint.
  const d1 = distToVertex(ROUTE, 1) + (ROUTE[1][1] - STOPS[0][1]);
  const d2 = distToVertex(ROUTE, 2) + (STOPS[1][0] - ROUTE[2][0]);
  const total = polyLen(ROUTE);
  const dist = interpolate(
    frame,
    [DRIVE_T.start, DRIVE_T.stop1, DRIVE_T.stop1 + PAUSE, DRIVE_T.stop2, DRIVE_T.stop2 + PAUSE, DRIVE_T.arrive],
    [0, d1, d1, d2, d2, total],
    { ...clamp, easing: Easing.inOut(Easing.quad) },
  );
  const pos = pointAtDist(ROUTE, dist);
  const heading = pos.angle; // 0 = right, -90 = up

  const arrived = frame >= DRIVE_T.arrive;
  const hop = interpolate(
    frame,
    [DRIVE_T.arrive, DRIVE_T.arrive + 4, DRIVE_T.arrive + 10, DRIVE_T.arrive + 16],
    [1, 0.82, 1.12, 1],
    clamp,
  );
  const blink = arrived ? (frame < DRIVE_T.arrive + 26 ? 0.18 : blinkScale(frame, [DRIVE_T.arrive + 40])) : 1;
  const look = { x: Math.cos((heading * Math.PI) / 180), y: Math.sin((heading * Math.PI) / 180) * 0.8 };

  const pinCheck = pop(frame, fps, DRIVE_T.arrive, springs.bouncy);
  const onTime = pop(frame, fps, DRIVE_T.onTime, springs.pop);
  const agenda = pop(frame, fps, DRIVE_T.agenda, springs.pop);
  const s1 = frame >= DRIVE_T.stop1 ? 1.15 : 1;
  const s2 = frame >= DRIVE_T.stop2 ? 1.15 : 1;

  const arrivals = [DRIVE_T.stop1, DRIVE_T.stop2];

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={6} stagger={3} sizeFactor={0.92} />

      <Stage offsetY={0}>
        <MapCard
          mode="light"
          style={{ left: MAP.x, top: MAP.y }}
          overlay={
            <>
              <RouteLine pts={ROUTE} progress={1} color={p.blue} opacity={0.35} />
              <RouteLine pts={ROUTE} progress={dist / total} color={p.blue} />
            </>
          }
        >
          <StopDot x={STOPS[0][0]} y={STOPS[0][1]} fill={p.white} ring={p.blue} scale={s1} />
          <StopDot x={STOPS[1][0]} y={STOPS[1][1]} fill={p.white} ring={p.blue} scale={s2} />
          <MapLabel text={props.stops[0]} x={STOPS[0][0] - 50} y={STOPS[0][1]} anchor="right" bg={p.white} color={p.blue} size={28} />
          <MapLabel text={props.stops[1]} x={STOPS[1][0]} y={STOPS[1][1] + 70} bg={p.white} color={p.blue} size={28} />

          {arrived ? (
            <Pin x={DEST[0]} y={DEST[1]} color={p.blue} icon="check" scale={0.8 + 0.2 * pinCheck} />
          ) : (
            <Pin x={DEST[0]} y={DEST[1]} color={p.blue} icon="flag" />
          )}
          <MapLabel
            text={frame >= DRIVE_T.onTime ? props.arrived : bill.destination}
            x={DEST_LABEL[0]}
            y={DEST_LABEL[1]}
            anchor="right"
            bg={frame >= DRIVE_T.onTime ? p.blue : p.white}
            color={frame >= DRIVE_T.onTime ? p.white : p.blue}
            size={frame >= DRIVE_T.onTime ? 34 : 30}
            style={{
              transform: `translate(-100%, -50%) scale(${frame >= DRIVE_T.onTime ? 0.8 + 0.2 * onTime : 1})`,
              transformOrigin: "100% 50%",
            }}
          />

          {/* Buddy drives the route */}
          <div
            style={{
              position: "absolute",
              left: pos.x - 66,
              top: pos.y - 24,
              width: 132,
              height: 48,
              borderRadius: "50%",
              background: "rgba(1, 59, 255, 0.16)",
            }}
          />
          <Buddy
            size={BUDDY_SIZE}
            body={p.blueMascot}
            eye={p.white}
            blink={blink}
            squash={hop}
            look={arrived ? { x: 0, y: 0.2 } : look}
            style={{
              position: "absolute",
              left: pos.x - BUDDY_SIZE / 2,
              top: pos.y - BUDDY_SIZE * BUDDY_RATIO + 8,
            }}
          />

          {frame >= DRIVE_T.agenda ? (
            <div
              style={{
                position: "absolute",
                left: 40,
                bottom: 36,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "16px 28px 16px 18px",
                borderRadius: 999,
                background: p.white,
                boxShadow: "0 12px 30px rgba(1, 30, 140, 0.2)",
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 34,
                color: p.ink,
                opacity: Math.min(1, agenda * 2),
                transform: `translateY(${(1 - agenda) * 30}px) scale(${0.85 + 0.15 * agenda})`,
                transformOrigin: "0% 100%",
              }}
            >
              <svg width={48} height={48} viewBox="0 0 40 40">
                <rect x="4" y="7" width="32" height="29" rx="7" fill={p.blueMid} />
                <rect x="4" y="7" width="32" height="9" rx="4" fill={p.blue} />
                <path d="M12 4v7M28 4v7" stroke={p.blue} strokeWidth={3.4} strokeLinecap="round" />
                <path d="M13 25l5 5 9-10" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {props.agendaChip}
            </div>
          ) : null}
        </MapCard>

        {/* Notifications: newest on top, the older one is pushed down */}
        {props.notifications.map((n, i) => {
          if (frame < arrivals[i]) return null;
          const t = pop(frame, fps, arrivals[i], springs.pop);
          const pushed = pushedSlots(frame, fps, arrivals, i);
          return (
            <Notification
              key={i}
              text={n.text}
              time={n.time}
              icon={i === 0 ? "warning" : "alert"}
              style={{
                position: "absolute",
                left: (1080 - NOTIFICATION_W) / 2,
                top: pushed * SLOT_GAP - (1 - t) * 30,
                opacity: Math.min(1, t * 2),
                transform: `scale(${0.85 + 0.15 * t})`,
                zIndex: 10 + i,
              }}
            />
          );
        })}
      </Stage>
    </SceneBg>
  );
};
