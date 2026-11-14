import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { CtaPill } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Wordmark } from "../../components/Wordmark";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { SyncHeadline } from "../components/SyncLine";
import { MARKERS, type PrikbordProps, VOICE_END, wordAt } from "../schema";

const S = MARKERS[4];
// Absolute frames; Buddy reels the button in on its red string on "Activeer".
export const CTA_T = {
  tagline: S - 8,
  taglineStagger: 3,
  buddyIn: S - 4,
  pull: wordAt("activeer") - 2,
  pullLen: 22,
  subline: wordAt("buddy", 2) + 2,
  logo: wordAt("buddy", 2) - 4,
  drop: VOICE_END - 2,
};

const BUDDY = 180;
const FEET = { x: 870, y: 330 };
const HAND = { x: 800, y: 250 };
const BTN_Y = 470;
const BTN_HALF = 300;

export const CtaScene: React.FC<{ props: PrikbordProps["cta"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = CTA_T;

  const buddyIn = pop(frame, fps, T.buddyIn, springs.bouncy);
  const pullP = spring({ frame: frame - T.pull, fps, config: { damping: 14, stiffness: 90 } });
  const offX = interpolate(pullP, [0, 1], [-1250, 0]);
  const tilt = interpolate(pullP, [0, 0.8, 1], [0, -6, 0]);
  const pulling = frame >= T.pull - 4 && frame < T.pull + T.pullLen;
  const lean = pulling ? interpolate(frame, [T.pull - 4, T.pull, T.pull + T.pullLen], [0, 14, 4], clamp) : frame < T.pull ? 0 : 4;
  const squash = frame < T.buddyIn + 12 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : pulling ? 0.9 : 1;
  const drop = interpolate(frame, [T.drop, T.drop + 14], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });

  const end = { x: 540 + BTN_HALF + offX, y: BTN_Y };
  const sag = 20 + 260 * drop;
  const d = `M${HAND.x},${HAND.y} Q${(HAND.x + end.x) / 2},${(HAND.y + end.y) / 2 + sag} ${end.x},${end.y}`;

  const subIn = pop(frame, fps, T.subline, springs.smooth);
  const logoIn = pop(frame, fps, T.logo, springs.smooth);
  const words = props.tagline.split(/\s+/).filter(Boolean).length;

  return (
    <SceneBg color={p.blue}>
      <SyncHeadline
        text={props.tagline}
        at={Array.from({ length: words }, (_, i) => T.tagline + i * T.taglineStagger)}
        color={p.white}
        accent={p.blueSoft}
        sizeFactor={1.1}
      />
      <Stage offsetY={40}>
        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path d={d} fill="none" stroke={p.red} strokeWidth={7} strokeLinecap="round" opacity={(1 - drop) * Math.min(1, buddyIn * 2)} />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BTN_Y - 68,
            display: "flex",
            justifyContent: "center",
            transform: `translateX(${offX}px) rotate(${tilt}deg) scale(1.3)`,
          }}
        >
          <CtaPill text={props.button} arrowIn={interpolate(pullP, [0.6, 1], [0, 1], clamp)} />
        </div>
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={squash}
          look={{ x: -0.9, y: 0.6 }}
          blink={frame >= T.drop + 8 ? 0.2 : blinkScale(frame, [T.pull + T.pullLen + 4])}
          style={{
            position: "absolute",
            left: FEET.x - BUDDY / 2,
            top: FEET.y - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `rotate(${lean}deg) scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 620,
            textAlign: "center",
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
            top: 740,
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
