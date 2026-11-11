import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { Door, Key } from "../components/Props";
import { type SleutelProps, wordAt } from "../schema";

// Absolute frames. The key floats from your mailbox door to Buddy;
// Buddy startles on the spoken word "mailbox".
export const HOOK_T = {
  float: 6, // key leaves the lock
  arrive: 44, // key hovers in front of Buddy
  startle: wordAt("mailbox"), // Buddy leans back
};

const DOOR = { x: 100, y: 150, w: 330, h: 650 };
const BUDDY = 230;
const FEET = 810;
const BX = 770;

export const HookScene: React.FC<{ props: SleutelProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const p = usePalette();

  const u = interpolate(frame, [HOOK_T.float, HOOK_T.arrive], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const start = { x: DOOR.x + DOOR.w * 0.72, y: DOOR.y + DOOR.h * 0.5 - 40 };
  const end = { x: BX - 20, y: 470 };
  const bob = Math.sin(frame / 6) * 10;
  const kx = start.x + (end.x - start.x) * u;
  const ky = start.y + (end.y - start.y) * u - Math.sin(Math.PI * u) * 160 + bob * u;
  const krot = -30 + 30 * u + Math.sin(frame / 9) * 6;

  const startle = interpolate(
    frame,
    [HOOK_T.startle - 4, HOOK_T.startle, HOOK_T.startle + 6, HOOK_T.startle + 14],
    [1, 0.9, 1.12, 1],
    clamp,
  );
  const lookX = interpolate(u, [0, 1], [-1, -0.3]);
  const lookY = interpolate(u, [0, 1], [0, -0.6]);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-16} stagger={2} />
      <Stage offsetY={130}>
        <Door
          {...DOOR}
          label={props.mailboxLabel}
          icon="mail"
          door={p.blue}
          ink={p.white}
          lockColor={p.yellow}
          locked={0}
        />
        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          squash={startle}
          blink={blinkScale(frame, [26])}
          look={{ x: lookX, y: lookY }}
          style={{ position: "absolute", left: BX - BUDDY / 2, top: FEET - BUDDY * BUDDY_RATIO }}
        />
        <div
          style={{
            position: "absolute",
            left: kx - 50,
            top: ky - 50,
            transform: `rotate(${krot}deg)`,
            transformOrigin: "50px 50px",
            filter: "drop-shadow(0 18px 24px rgba(0,20,120,0.18))",
          }}
        >
          <Key size={240} color={p.yellow} />
        </div>
      </Stage>
    </SceneBg>
  );
};
