import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Knife, toolTip } from "../components/Knife";
import { SCENE_STARTS, type ZakmesProps, wordAt } from "../schema";

const S = SCENE_STARTS[1];
// Absolute frames: each tool folds out on its spoken word.
export const OPEN_T = {
  knifeIn: S - 6,
  no: wordAt("niet"), // Buddy shakes his head
  mail: wordAt("mail") - 3, // tool A folds out
  agenda: wordAt("agenda") - 3, // tool B folds out
  subline: wordAt("mail") - 6,
  blink: wordAt("al") - 4,
};

export const KNIFE_CX = 540;
export const KNIFE_CY = 570;
export const EMBLEM = 134;

const Label: React.FC<{ text: string; x: number; y: number; k: number; bg: string; fg: string }> = ({ text, x, y, k, bg, fg }) => (
  <div
    style={{
      position: "absolute",
      left: Math.max(150, Math.min(930, x)) - 200,
      width: 400,
      top: y - 46,
      display: "flex",
      justifyContent: "center",
      opacity: Math.min(1, k * 2),
      transform: `translateY(${(1 - k) * 30}px) scale(${0.6 + 0.4 * k})`,
    }}
  >
    <div
      style={{
        background: bg,
        color: fg,
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: 46,
        padding: "16px 36px",
        borderRadius: 40,
        boxShadow: "0 14px 40px rgba(0, 20, 120, 0.25)",
      }}
    >
      {text}
    </div>
  </div>
);

export const OpenScene: React.FC<{ props: ZakmesProps["open"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const knifeIn = pop(frame, fps, OPEN_T.knifeIn, springs.bouncy);
  const openA = pop(frame, fps, OPEN_T.mail, springs.bouncy);
  const openB = pop(frame, fps, OPEN_T.agenda, springs.bouncy);
  const labA = pop(frame, fps, OPEN_T.mail + 7, springs.pop);
  const labB = pop(frame, fps, OPEN_T.agenda + 7, springs.pop);

  // Buddy shakes no, then hops a little as each tool clicks open.
  const noT = frame - OPEN_T.no;
  const lookX = noT >= 0 && noT < 18 ? Math.sin(noT * 0.9) * (1 - noT / 18) : 0;
  const hop = (at: number) => {
    const t = frame - at;
    return t >= 0 && t < 10 ? Math.sin((t / 10) * Math.PI) * 22 : 0;
  };
  const sq = (at: number) => interpolate(frame - at, [-2, 0, 3, 8], [1, 0.82, 1.08, 1], clamp);
  const squash = Math.min(sq(OPEN_T.mail), sq(OPEN_T.agenda));
  const look =
    frame >= OPEN_T.agenda ? { x: 0.7, y: -0.7 } : frame >= OPEN_T.mail ? { x: -0.7, y: -0.7 } : { x: lookX, y: 0 };

  const a = toolTip(KNIFE_CX, KNIFE_CY, "A", 1.0);
  const b = toolTip(KNIFE_CX, KNIFE_CY, "B", 1.0);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={S - 2} stagger={3} sizeFactor={1.2} />
      <Stage>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${0.5 + 0.5 * knifeIn})`,
            transformOrigin: `${KNIFE_CX}px ${KNIFE_CY}px`,
            opacity: Math.min(1, knifeIn * 3),
          }}
        >
          <Knife
            cx={KNIFE_CX}
            cy={KNIFE_CY}
            handleColor={p.white}
            rivetColor={p.blueSoft}
            openA={openA}
            openB={openB}
            iconColor={p.blue}
          >
            <Buddy
              size={EMBLEM}
              body={p.blueMascot}
              eye={p.white}
              blink={blinkScale(frame, [OPEN_T.blink])}
              look={look}
              squash={squash}
              style={{
                position: "absolute",
                left: KNIFE_CX - EMBLEM / 2,
                top: KNIFE_CY + (EMBLEM * BUDDY_RATIO) / 2 - EMBLEM * BUDDY_RATIO - hop(OPEN_T.mail) - hop(OPEN_T.agenda),
              }}
            />
          </Knife>
        </div>
        <Label text={props.mailLabel} x={a.x + 30} y={a.y - 70} k={labA} bg={p.white} fg={p.blue} />
        <Label text={props.agendaLabel} x={b.x - 30} y={b.y - 70} k={labB} bg={p.white} fg={p.blue} />
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={OPEN_T.subline} />
    </SceneBg>
  );
};
