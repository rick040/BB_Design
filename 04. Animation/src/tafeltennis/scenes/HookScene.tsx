import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { MailPanel, Net, Paddle, Table, TABLE } from "../components/Table";
import { type TafeltennisProps, wordAt } from "../schema";

// Absolute frames; Buddy leans over the net on "mee" and stares at "mailbox".
export const HOOK_T = {
  peek: wordAt("mee"),
  stare: wordAt("mailbox"),
  blink: wordAt("mailbox") + 14,
};

const BUDDY = 220;

export const HookScene: React.FC<{ props: TafeltennisProps["hook"]; mailbox: TafeltennisProps["mailbox"] }> = ({
  props,
  mailbox,
}) => {
  const frame = useCurrentFrame();
  const p = usePalette();

  const lean = interpolate(frame, [HOOK_T.peek - 6, HOOK_T.stare], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const cx = 840 - 170 * lean;
  const squash = 1 + 0.16 * lean;
  const idle = Math.sin(frame / 6) * 4 * (1 - lean);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-32} stagger={3} />
      <Stage offsetY={90}>
        <MailPanel title={mailbox.title} senders={mailbox.senders} />
        <Table color={p.blue} line={p.blueMid} />
        <Net height={74} color={p.blue} />
        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          squash={squash}
          look={{ x: -1, y: 0.25 * lean }}
          blink={blinkScale(frame, [HOOK_T.blink])}
          style={{
            position: "absolute",
            left: cx - BUDDY / 2,
            top: TABLE.top - BUDDY * BUDDY_RATIO + idle,
            transform: `rotate(${-9 * lean}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
        <Paddle
          size={104}
          rubber={p.yellow}
          handle={p.blueMascot}
          style={{ left: cx + 84, top: TABLE.top - 236 + idle, transform: `rotate(${18 - 10 * lean}deg)` }}
        />
      </Stage>
    </SceneBg>
  );
};
