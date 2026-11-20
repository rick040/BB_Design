import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Chip, Door, Eye, Key } from "../components/Parts";
import { type BrievenbusProps, SCENE_STARTS, wordAt } from "../schema";
import { fonts } from "../../theme";

const S = SCENE_STARTS[1];
// Absolute frames, hung on the spoken words.
export const SPLIT_T = {
  headA: S + 2, // "Een koppeling zet alles open."
  open: wordAt("open"), // left door bangs fully open, mails jump
  swap: wordAt("buddy") - 6, // headline swaps to "Buddy hoeft geen sleutel."
  buddy: wordAt("buddy"), // Buddy pops up on the right
  keyDrop: wordAt("geen"), // a key drops in on the right
  kick: wordAt("sleutel") + 6, // Buddy kicks the key out of the card
};

const CARD_W = 495;
const CARD_H = 820;
const CARD_Y = 40;
const DW = 230;
const DH = 410;
const DY = 150;
const MINI = [
  { x: 120, y: 250, r: -8 },
  { x: 370, y: 300, r: 7 },
  { x: 110, y: 470, r: 5 },
  { x: 380, y: 520, r: -6 },
  { x: 245, y: 640, r: 3 },
];
const BUDDY = 150;
const FEET = 760;

export const SplitScene: React.FC<{ props: BrievenbusProps["split"]; hook: BrievenbusProps["hook"] }> = ({
  props,
  hook,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const swapOut = interpolate(frame, [SPLIT_T.swap - 4, SPLIT_T.swap + 2], [1, 0], clamp);
  const bang = pop(frame, fps, SPLIT_T.open, springs.bouncy);
  const buddyIn = pop(frame, fps, SPLIT_T.buddy, springs.bouncy);
  const drop = interpolate(frame, [SPLIT_T.keyDrop, SPLIT_T.keyDrop + 10], [0, 1], {
    ...clamp,
    easing: (t) => t * t,
  });
  const kickU = interpolate(frame, [SPLIT_T.kick, SPLIT_T.kick + 16], [0, 1], clamp);
  const keyX = 290 + kickU * 420;
  const keyY = -120 + drop * 770 - Math.sin(Math.PI * Math.min(1, kickU * 1.3)) * 260 * (kickU > 0 ? 1 : 0);
  const keyR = drop * 20 + kickU * 540;
  const kickSq = interpolate(frame, [SPLIT_T.kick - 6, SPLIT_T.kick, SPLIT_T.kick + 8], [1, 0.8, 1], clamp);
  const entrySq = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  const squash = frame < SPLIT_T.buddy + 12 ? entrySq : kickSq;
  const lookX = frame < SPLIT_T.keyDrop ? -0.6 : frame < SPLIT_T.kick + 4 ? 0.7 : interpolate(frame, [SPLIT_T.kick + 4, SPLIT_T.kick + 14], [0.9, 0.2], clamp);
  const lookY = frame >= SPLIT_T.keyDrop && frame < SPLIT_T.kick ? interpolate(drop, [0, 1], [-0.8, 0.5]) : 0.2;

  const label = (text: string, bg: string, fg: string) => (
    <div style={{ position: "absolute", top: 30, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <Chip text={text} bg={bg} fg={fg} size={36} />
    </div>
  );

  return (
    <SceneBg color={p.blue}>
      <div style={{ opacity: swapOut }}>
        <Headline text={props.headlineA} color={p.white} delay={SPLIT_T.headA - 8} stagger={2} />
      </div>
      {frame >= SPLIT_T.swap - 2 ? (
        <Headline text={props.headlineB} color={p.white} delay={SPLIT_T.swap} stagger={3} />
      ) : null}
      <Stage>
        {/* left: linked app, everything open */}
        <div
          style={{
            position: "absolute",
            left: 30,
            top: CARD_Y,
            width: CARD_W,
            height: CARD_H,
            borderRadius: 48,
            background: p.light,
            overflow: "hidden",
          }}
        >
          {label(props.leftLabel, p.ink, p.white)}
          <Door
            width={DW}
            height={DH}
            open={0.55 + 0.4 * bang}
            leaf={p.blue}
            style={{ position: "absolute", left: (CARD_W - DW) / 2, top: DY }}
          />
          {hook.mails.map((m, i) => {
            const t = MINI[i];
            const bob = Math.sin((frame + i * 9) / 7) * 6;
            const jump = bang * Math.sin(Math.min(1, (frame - SPLIT_T.open - i * 2) / 10) * Math.PI) * -30;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: t.x - 95,
                  top: t.y + bob + (frame > SPLIT_T.open + i * 2 ? jump : 0),
                  width: 190,
                  height: 64,
                  borderRadius: 20,
                  background: p.white,
                  boxShadow: "0 10px 26px rgba(1, 30, 120, 0.18)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "0 16px",
                  boxSizing: "border-box",
                  transform: `rotate(${t.r}deg)`,
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 27,
                  color: p.ink,
                }}
              >
                <div style={{ flex: 1 }}>{m}</div>
                <Eye size={34} color={p.blue} />
              </div>
            );
          })}
        </div>

        {/* right: Buddy, door closed, only a letterbox */}
        <div
          style={{
            position: "absolute",
            left: 555,
            top: CARD_Y,
            width: CARD_W,
            height: CARD_H,
            borderRadius: 48,
            background: p.blueMid,
            overflow: "hidden",
          }}
        >
          {label(props.rightLabel, p.white, p.blue)}
          <Door
            width={DW}
            height={DH}
            open={0}
            leaf={p.blue}
            frame={p.blueSoft}
            slot
            flap={0}
            style={{ position: "absolute", left: (CARD_W - DW) / 2, top: DY }}
          />
          <Buddy
            size={BUDDY}
            body={p.white}
            eye={p.blueMascot}
            squash={squash}
            look={{ x: lookX, y: lookY }}
            blink={blinkScale(frame, [SPLIT_T.kick + 18])}
            style={{
              position: "absolute",
              left: CARD_W / 2 - BUDDY / 2 - 40,
              top: FEET - BUDDY * BUDDY_RATIO,
              opacity: Math.min(1, buddyIn * 3),
              transform: `scale(${0.4 + 0.6 * buddyIn})`,
              transformOrigin: "50% 100%",
            }}
          />
          {frame >= SPLIT_T.keyDrop ? (
            <div style={{ position: "absolute", left: keyX - 60, top: keyY - 25, transform: `rotate(${keyR}deg)` }}>
              <Key size={120} color={p.yellow} />
            </div>
          ) : null}
        </div>
      </Stage>
    </SceneBg>
  );
};
