import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, shake } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { BillRow, ROW_H, ROW_W } from "../components/BillRow";
import { LabelTape, Marker, MARKER_H, MARKER_W, MarkerCap } from "../components/Labels";
import type { NaambordProps } from "../schema";

// Timeline (frames, scene-local).
export const FWD_T = {
  rows: 8, // the three bills slide up into a column
  rowStagger: 4,
  fwd: 24, // blue "doorgestuurd" label slaps onto each bill
  fwdStagger: 7,
  buddyIn: 42, // Buddy hops in with his marker
  read: 54, // yellow marker circle around each due date, Buddy looks up
  readStagger: 7,
  subline: 58,
  cap: 78, // Buddy pops the cap off his marker
  blink: 68,
};

const ROW_X = (1080 - ROW_W) / 2;
const ROW_Y = [0, ROW_H + 40, (ROW_H + 40) * 2];
const BUDDY = 170;
const BUDDY_X = 800; // centre
const FEET = 820;

export const ForwardScene: React.FC<{
  props: NaambordProps["forward"];
  bills: NaambordProps["bills"];
  ownLabel: string;
}> = ({ props, bills, ownLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Buddy hops in from the right in a low arc.
  const hop = pop(frame, fps, FWD_T.buddyIn, { damping: 15, stiffness: 120 });
  const bx = interpolate(hop, [0, 1], [1240, BUDDY_X]);
  const arc = -Math.sin(Math.min(1, hop) * Math.PI) * 120;
  const land = frame - FWD_T.buddyIn;
  let squash = interpolate(land, [0, 6, 14, 20, 26], [0.8, 1.12, 0.86, 1.04, 1], clamp);
  // Cap pops: Buddy pushes down, then springs up.
  const capT = frame - FWD_T.cap;
  if (capT >= -4) {
    squash = interpolate(capT, [-4, 0, 5, 11], [1, 0.84, 1.1, 1], clamp);
  }
  const readIdx = Math.max(0, Math.min(2, Math.floor((frame - FWD_T.read) / FWD_T.readStagger)));
  const looking = frame >= FWD_T.read - 4 && frame < FWD_T.cap - 4;
  const look = looking
    ? { x: interpolate(readIdx, [0, 2], [-0.3, 0.1]), y: -1 }
    : { x: -0.5, y: -0.2 };
  const blink = blinkScale(frame, [FWD_T.blink]);
  const idle = frame > FWD_T.buddyIn + 26 ? Math.sin((frame - FWD_T.buddyIn - 26) / 7) * 3 : 0;

  // Cap flies off along the marker, spinning.
  const capFly = interpolate(capT, [0, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={2} stagger={3} />

      <Stage offsetY={40}>
        {bills.map((b, i) => {
          const t = pop(frame, fps, FWD_T.rows + i * FWD_T.rowStagger, { damping: 16, stiffness: 140 });
          const fwdAt = FWD_T.fwd + i * FWD_T.fwdStagger;
          const fwd = pop(frame, fps, fwdAt, { damping: 11, stiffness: 260, mass: 0.6 });
          const hit = shake(frame, fwdAt + 2, 8, 7);
          const readAt = FWD_T.read + i * FWD_T.readStagger;
          const circle = interpolate(frame, [readAt, readAt + 9], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
          return (
            <BillRow
              key={i}
              bill={b}
              dueLabel={props.dueLabel}
              circle={circle}
              style={{
                left: ROW_X,
                top: ROW_Y[i],
                transform: `translate(${hit.x}px, ${(1 - t) * 340 + hit.y}px) scale(${0.9 + 0.1 * t})`,
                opacity: Math.min(1, t * 2.5),
              }}
            >
              <div style={{ position: "absolute", left: -14, top: -20, transform: "rotate(-5deg)" }}>
                <LabelTape text={ownLabel} tape={p.yellow} ink={p.ink} fontSize={19} padX={0.55} />
              </div>
              {frame >= fwdAt ? (
                <div
                  style={{
                    position: "absolute",
                    left: 300,
                    top: -22,
                    transform: `rotate(${3 + (1 - fwd) * 8}deg) scale(${1.5 - 0.5 * fwd})`,
                    transformOrigin: "0% 0%",
                    opacity: Math.min(1, fwd * 3),
                  }}
                >
                  <LabelTape text={props.forwardedLabel} tape={p.blueMid} ink={p.white} fontSize={22} padX={0.6} arrow />
                </div>
              ) : null}
            </BillRow>
          );
        })}

        {/* Buddy with his marker (tip up, leaning against him) */}
        <div
          style={{
            position: "absolute",
            left: bx - BUDDY / 2,
            top: FEET - BUDDY * BUDDY_RATIO + arc + idle,
            width: BUDDY,
            height: BUDDY * BUDDY_RATIO,
            opacity: frame < FWD_T.buddyIn ? 0 : 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -MARKER_W - 14,
              top: BUDDY * BUDDY_RATIO - MARKER_H / 2 - 4,
              transformOrigin: `${MARKER_W}px ${MARKER_H / 2}px`,
              transform: `rotate(${74 + (capT >= -4 && capT < 6 ? interpolate(capT, [-4, 0, 6], [0, 8, 0], clamp) : 0)}deg)`,
            }}
          >
            <Marker body={p.yellow} ink={p.ink} capOn={frame < FWD_T.cap} />
            {frame >= FWD_T.cap ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  transformOrigin: "23px 23px",
                  transform: `translate(${-capFly * 420}px, ${-capFly * 120}px) rotate(${capFly * -540}deg)`,
                  opacity: 1 - interpolate(capFly, [0.6, 1], [0, 1], clamp),
                }}
              >
                <MarkerCap ink={p.ink} />
              </div>
            ) : null}
          </div>
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            blink={blink}
            squash={squash}
            look={look}
            style={{ position: "absolute", left: 0, top: 0 }}
          />
        </div>
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={FWD_T.subline} />
    </SceneBg>
  );
};
