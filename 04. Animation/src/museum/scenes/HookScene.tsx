import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { ExhibitBill, MuseumFrame, Plaque, ropePoint, SpotCone, VelvetRope } from "../components/Museum";
import { fonts } from "../../theme";
import type { MuseumProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  spot: 34, // lights dim, the spotlight snaps onto the aanmaning
  badge: 42, // "+ kosten" badge slams on, frame shakes
  plaque: 50, // "Kan uitlopen op €40" lights up red on the plaque
  sign: 62, // "Niet aanraken" sign starts to swing
};

const FRAMES = [
  { x: 40, y: 110, w: 250, h: 320, scale: 0.62 },
  { x: 335, y: 40, w: 410, h: 470, scale: 0.92 },
  { x: 790, y: 110, w: 250, h: 320, scale: 0.62 },
];
const PLAQUES = [
  { x: 45, y: 452, w: 240 },
  { x: 355, y: 532, w: 370 },
  { x: 795, y: 452, w: 240 },
];
export const ROPE = { x1: 140, x2: 940, top: 700, postH: 150, sag: 30 };

export const HookScene: React.FC<{ props: MuseumProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const spot = pop(frame, fps, HOOK_T.spot, { damping: 20, stiffness: 260 });
  const badge = pop(frame, fps, HOOK_T.badge, springs.bouncy);
  const s = shake(frame, HOOK_T.badge, 14, 9);
  const plaque = pop(frame, fps, HOOK_T.plaque, springs.pop);
  const swing = frame > HOOK_T.sign ? Math.sin((frame - HOOK_T.sign) / 5) * 7 * Math.exp(-(frame - HOOK_T.sign) / 40) : 0;
  // Slow drift on the whole wall so frame 0 never feels frozen.
  const drift = interpolate(frame, [0, 100], [1.0, 1.03], clamp);

  const side = interpolate(spot, [0, 1], [0.6, 0.18]);
  const centre = interpolate(spot, [0, 1], [0.6, 1.5]);
  const dim = interpolate(spot, [0, 1], [0, 0.22]);
  const sign = ropePoint(ROPE.x1, ROPE.x2, ROPE.top, ROPE.sag, 0.5);

  return (
    <SceneBg color={p.light}>
      <Stage offsetY={40}>
        {/* floor */}
        <div style={{ position: "absolute", left: -400, right: -400, top: 660, height: 1400, background: "#eceff7" }} />
      </Stage>

      {/* the room dims around the spotlight (under the headline) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 46% 34% at 50% 52%, rgba(17,17,20,0) 0%, rgba(17,17,20,1) 100%)",
          opacity: dim,
        }}
      />

      <Stage offsetY={40}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${drift})`, transformOrigin: "50% 40%" }}>
          <SpotCone x={165} y={-10} h={470} spread={150} intensity={side} />
          <SpotCone x={540} y={-10} h={560} spread={250} intensity={centre} />
          <SpotCone x={915} y={-10} h={470} spread={150} intensity={side} />

          {props.exhibits.map((e, i) => {
            const f = FRAMES[i];
            const pl = PLAQUES[i];
            const isCentre = i === 1;
            return (
              <React.Fragment key={i}>
                <MuseumFrame
                  w={f.w}
                  h={f.h}
                  border={isCentre ? 18 : 14}
                  mat={isCentre ? 30 : 22}
                  style={{
                    left: f.x,
                    top: f.y,
                    transform: isCentre ? `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)` : `rotate(${i === 0 ? -1.5 : 1.2}deg)`,
                  }}
                >
                  <ExhibitBill
                    sender={e.sender}
                    title={e.title}
                    urgent={isCentre}
                    scale={f.scale}
                    badge={isCentre && frame >= HOOK_T.badge ? props.centreBadge : undefined}
                  />
                </MuseumFrame>
                {isCentre && frame >= HOOK_T.badge ? (
                  <div
                    style={{
                      position: "absolute",
                      left: f.x + f.w - 70,
                      top: f.y - 30,
                      width: 92,
                      height: 92,
                      borderRadius: "50%",
                      background: p.red,
                      color: p.white,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: fonts.ui,
                      fontWeight: 700,
                      fontSize: 60,
                      transform: `scale(${badge}) rotate(${(1 - badge) * -40}deg)`,
                    }}
                  >
                    !
                  </div>
                ) : null}
                <Plaque
                  text={e.plaque}
                  width={pl.w}
                  size={isCentre ? 26 : 20}
                  accent={isCentre && frame >= HOOK_T.plaque ? p.red : undefined}
                  style={{
                    left: pl.x,
                    top: pl.y,
                    transform: isCentre ? `scale(${1 + 0.06 * plaque * (frame < HOOK_T.plaque + 20 ? 1 : 0)})` : undefined,
                  }}
                />
              </React.Fragment>
            );
          })}

          <VelvetRope {...ROPE} />
          <div
            style={{
              position: "absolute",
              left: sign.x - 130,
              top: sign.y - 6,
              width: 260,
              transform: `rotate(${swing}deg)`,
              transformOrigin: "50% 0%",
            }}
          >
            <div style={{ margin: "0 auto", width: 4, height: 22, background: p.ink }} />
            <div
              style={{
                background: p.ink,
                color: p.white,
                borderRadius: 10,
                padding: "10px 0",
                textAlign: "center",
                fontFamily: fonts.ui,
                fontWeight: 600,
                fontSize: 28,
              }}
            >
              {props.sign}
            </div>
          </div>
        </div>
      </Stage>

      <Headline text={props.headline} color={p.blue} delay={-24} stagger={3} sizeFactor={0.8} />
    </SceneBg>
  );
};
