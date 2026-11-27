import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Doormat, ENV_H, ENV_W, Envelope } from "../components/parts";
import { type DeurmatProps, wordAt } from "../schema";

// Absolute frames. Each envelope lands on the mat on its spoken word.
const LAND = ["huur", "energie", "internet", "zorgverzekering", "gemeente"].map((w) => wordAt(w));
export const DOOR_T = {
  rattle: wordAt("rekeningen"), // flap rattles: here they come
  fallLen: 12, // slot to mat
  land0: LAND[0],
  land4: LAND[4],
};

const SLOT_Y = 700;
const PILE = [
  { x: -40, r: -8 },
  { x: 45, r: 6 },
  { x: -55, r: -3 },
  { x: 30, r: 9 },
  { x: 0, r: -2 },
];
const MAT_Y = 1440;

export const DoorScene: React.FC<{ props: DeurmatProps["door"]; bills: DeurmatProps["bills"] }> = ({
  props,
  bills,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const landed = LAND.filter((l) => frame >= l).length;
  const lastLand = landed > 0 ? LAND[landed - 1] : -100;
  const rattleAt = Math.max(DOOR_T.rattle, ...LAND.map((l) => l - DOOR_T.fallLen).filter((s) => s <= frame));
  const flap = interpolate(frame - rattleAt, [0, 3, 8, 12], [0, 1, 0.3, 0], clamp);
  const sh = shake(frame, lastLand, 8, 6);
  const countIn = pop(frame, fps, lastLand, springs.pop);

  return (
    <SceneBg color={p.light}>
      {/* floor */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, bottom: 0, background: p.grey }} />
      {/* door */}
      <div
        style={{
          position: "absolute",
          left: 170 + sh.x * 0.3,
          top: 500,
          width: 740,
          height: 1000,
          background: p.blue,
          borderRadius: "22px 22px 0 0",
          boxShadow: `inset 0 0 0 14px ${p.blueMid}`,
        }}
      >
        <div style={{ position: "absolute", left: 70, right: 70, top: 300, height: 360, borderRadius: 16, border: `6px solid ${p.blueMid}` }} />
        <div style={{ position: "absolute", left: 70, right: 70, top: 700, height: 240, borderRadius: 16, border: `6px solid ${p.blueMid}` }} />
        {/* handle */}
        <div style={{ position: "absolute", left: 640, top: 600, width: 46, height: 46, borderRadius: 23, background: p.yellow }} />
        {/* count on the door */}
        {landed > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 300,
              height: 360,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.display,
              transform: `scale(${0.7 + 0.3 * countIn})`,
            }}
          >
            <div style={{ fontSize: 250, fontWeight: 500, lineHeight: 0.9, color: p.blueSoft, letterSpacing: "-0.06em" }}>
              {landed}
            </div>
            <div style={{ fontSize: 44, color: p.white, marginTop: 6 }}>{props.countLabel}</div>
          </div>
        ) : null}
      </div>
      {/* mail slot */}
      <div
        style={{
          position: "absolute",
          left: 340,
          top: SLOT_Y - 30,
          width: 400,
          height: 60,
          borderRadius: 12,
          background: "#0a1a66",
          border: `8px solid ${p.yellow}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 348,
          top: SLOT_Y - 22,
          width: 384,
          height: 44,
          borderRadius: 6,
          background: p.yellow,
          transformOrigin: "50% 0%",
          transform: `perspective(400px) rotateX(${-70 * flap}deg)`,
          opacity: 0.95,
        }}
      />
      {/* mat */}
      <div style={{ position: "absolute", left: 170, top: MAT_Y }}>
        <Doormat text={props.mat} w={740} h={150} color="#1a2a7a" textColor={p.blueSoft} />
      </div>
      {/* envelopes */}
      {bills.map((b, i) => {
        const land = LAND[i];
        const start = land - DOOR_T.fallLen;
        if (frame < start) return null;
        const u = interpolate(frame, [start, land], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        const restY = MAT_Y + 40 - i * 34;
        const y = interpolate(u, [0, 1], [SLOT_Y + 60, restY]);
        const r = interpolate(u, [0, 1], [0, PILE[i].r]);
        const sc = interpolate(u, [0, 0.3, 1], [0.55, 0.9, 1]);
        const sq = interpolate(frame, [land, land + 3, land + 8], [1, 0.9, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + PILE[i].x * u - ENV_W / 2,
              top: y - ENV_H / 2,
              transform: `rotate(${r}deg) scale(${sc}, ${sc * sq})`,
              transformOrigin: "50% 100%",
              zIndex: 10 + i,
            }}
          >
            <Envelope sender={b.sender} due={b.due} />
          </div>
        );
      })}
      <Headline text={props.headline} color={p.blue} delay={-14} stagger={2} />
    </SceneBg>
  );
};
