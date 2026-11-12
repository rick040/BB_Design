import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { MailPanel, Net, Paddle, Table, TABLE } from "../components/Table";
import { SpokenHeadline } from "../components/Table";
import { SCENE_STARTS, type TafeltennisProps, wordAt } from "../schema";

const S = SCENE_STARTS[1];
// The net shoots up into a wall on "Nee", Buddy shakes no and hops back; "Van jou" lands on "jou".
export const NEE_T = {
  net: S,
  shake: S + 2,
  hop: wordAt("mailbox", 2),
  chip: wordAt("jou"),
};
const SPOKEN = [wordAt("nee"), wordAt("je", 2), wordAt("mailbox", 2), wordAt("blijft"), wordAt("van"), wordAt("jou")];

const BUDDY = 220;

export const NeeScene: React.FC<{ props: TafeltennisProps["nee"]; mailbox: TafeltennisProps["mailbox"] }> = ({
  props,
  mailbox,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const net = pop(frame, fps, NEE_T.net, springs.bouncy);
  const netH = 74 + 430 * net;
  const shakeT = frame - NEE_T.shake;
  const shaking = shakeT >= 0 && shakeT < 22;
  const lookX = shaking ? Math.sin(shakeT * 0.9) : 0.2;
  const rot = shaking ? Math.sin(shakeT * 0.9) * 7 * (1 - shakeT / 22) : 0;
  const hop = interpolate(frame, [NEE_T.hop, NEE_T.hop + 14], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const cx = 680 + 170 * hop;
  const lift = Math.sin(Math.PI * hop) * 90;
  const land = interpolate(frame, [NEE_T.hop + 14, NEE_T.hop + 17, NEE_T.hop + 22], [1, 0.82, 1], clamp);
  const chip = pop(frame, fps, NEE_T.chip, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <SpokenHeadline
        text={props.headline}
        at={SPOKEN}
        first={p.white}
        rest={p.blueSoft}
        top={L.safeTop}
        left={L.sidePadding}
        size={L.headlineSize}
      />
      <Stage offsetY={90}>
        <MailPanel title={mailbox.title} senders={mailbox.senders} />
        <div
          style={{
            position: "absolute",
            left: 295 - 140,
            top: 120,
            width: 280,
            height: 86,
            borderRadius: 43,
            background: p.yellow,
            color: p.blue,
            fontFamily: fonts.display,
            fontWeight: 600,
            fontSize: 46,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: "-0.03em",
            transform: `scale(${chip}) rotate(${-6 * chip}deg)`,
            opacity: Math.min(1, chip * 2),
          }}
        >
          {mailbox.ownChip}
        </div>
        <Table color={p.white} line={p.blueSoft} />
        <Net height={netH} width={34 + 10 * net} color={p.white} />
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          squash={land * (frame < NEE_T.shake + 4 ? 1.1 : 1)}
          look={{ x: lookX, y: 0 }}
          blink={blinkScale(frame, [NEE_T.chip + 6])}
          style={{
            position: "absolute",
            left: cx - BUDDY / 2,
            top: TABLE.top - BUDDY * BUDDY_RATIO - lift,
            transform: `rotate(${rot}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
        <Paddle
          size={104}
          rubber={p.yellow}
          handle={p.blueMascot}
          style={{ left: cx + 84, top: TABLE.top - 236 - lift, transform: `rotate(${18 + rot}deg)` }}
        />
      </Stage>
    </SceneBg>
  );
};
