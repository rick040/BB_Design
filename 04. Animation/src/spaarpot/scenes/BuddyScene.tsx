import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { RollingNumber } from "../../components/RollingNumber";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Coin, Piggy, PIGGY_H, PIGGY_W, SLOT } from "../components/Piggy";
import { SCENE_STARTS, type SpaarpotProps, wordAt } from "../schema";

// "Buddy zet een herinnering in je agenda. Wanneer jij wilt."
// Buddy jumps onto the piggy and sits on the slot: nothing leaks any more.
const S = SCENE_STARTS[2];
export const BUDDY_T = {
  jump: S,
  land: S + 16,
  tile: wordAt("herinnering"),
  agenda: wordAt("agenda"),
  when: wordAt("wanneer"),
  wilt: wordAt("wilt"),
};

const PX = 120;
const PY = 470;
const BUDDY = 170;
const SEAT = { x: PX + SLOT.x, y: PY + SLOT.y + 14 };

export const BuddyScene: React.FC<{ props: SpaarpotProps["buddy"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const u = interpolate(frame, [BUDDY_T.jump, BUDDY_T.land], [0, 1], clamp);
  const bx = interpolate(u, [0, 1], [-150, SEAT.x]);
  const by = interpolate(u, [0, 1], [SEAT.y + 200, SEAT.y]) - Math.sin(Math.PI * u) * 360;
  const landSq = interpolate(frame, [BUDDY_T.land, BUDDY_T.land + 3, BUDDY_T.land + 12], [1, 0.72, 1], clamp);
  const flightSq = frame < BUDDY_T.land ? 1.12 : landSq;
  const pigSq = interpolate(frame, [BUDDY_T.land, BUDDY_T.land + 3, BUDDY_T.land + 12], [1, 0.94, 1], clamp);

  const tileIn = pop(frame, fps, BUDDY_T.tile, springs.bouncy);
  const chipIn = pop(frame, fps, BUDDY_T.agenda, springs.pop);
  const timeRoll = interpolate(frame, [BUDDY_T.when, BUDDY_T.wilt + 4], [0, 1], clamp);
  const lookTile = frame >= BUDDY_T.tile - 4;
  const happy = frame >= BUDDY_T.wilt + 6 ? 0.2 : blinkScale(frame, [BUDDY_T.land + 18]);

  // A coin bounces off Buddy instead of falling out.
  const ct = frame - (BUDDY_T.land + 4);
  const coinY = SEAT.y - 380 + Math.min(ct, 12) * 28 - Math.max(0, ct - 12) * 14 + Math.max(0, ct - 12) ** 2 * 0.9;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={S - 4} stagger={2} sizeFactor={0.85} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: PX,
            top: PY,
            width: PIGGY_W,
            height: PIGGY_H,
            transform: `scale(${1 / Math.sqrt(pigSq)}, ${pigSq})`,
            transformOrigin: "50% 100%",
          }}
        >
          <Piggy body={p.white} shade={p.blueSoft} slot={p.blue} />
        </div>
        {ct > 0 && ct < 40 ? (
          <div style={{ position: "absolute", left: SEAT.x - 40 + Math.max(0, ct - 12) * 9, top: coinY - 40 }}>
            <Coin size={80} color={p.yellow} edge="#e0a800" spin={ct / 3} />
          </div>
        ) : null}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={happy}
          squash={flightSq}
          look={lookTile ? { x: 0.9, y: -0.1 } : { x: 0.4, y: -0.6 }}
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: by - BUDDY * BUDDY_RATIO,
            transformOrigin: "50% 100%",
          }}
        />
        {/* agenda tile */}
        <div
          style={{
            position: "absolute",
            left: 620,
            top: 250,
            width: 340,
            transform: `scale(${tileIn}) rotate(${(1 - tileIn) * 12}deg)`,
            transformOrigin: "50% 100%",
          }}
        >
          <div
            style={{
              width: 340,
              borderRadius: 44,
              background: p.white,
              overflow: "hidden",
              boxShadow: "0 30px 80px rgba(0,10,80,0.35)",
              fontFamily: fonts.display,
            }}
          >
            <div style={{ background: p.blueMid, color: p.white, fontSize: 48, textAlign: "center", padding: "14px 0" }}>
              {props.weekday}
            </div>
            <div style={{ color: p.blue, fontSize: 150, fontWeight: 500, textAlign: "center", lineHeight: 1.05, letterSpacing: "-0.06em" }}>
              {props.date}
            </div>
          </div>
          <div
            style={{
              marginTop: 22,
              height: 84,
              borderRadius: 42,
              background: p.yellow,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 34,
              color: p.ink,
              opacity: chipIn,
              transform: `translateY(${(1 - chipIn) * 30}px)`,
            }}
          >
            <span>{props.reminder}</span>
            <RollingNumber
              values={props.times}
              progress={timeRoll}
              size={40}
              color={p.ink}
              style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 34, letterSpacing: 0, width: 100 }}
            />
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
