import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SleepMask } from "../../components/SleepMask";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fieldCenterY, ForwardedMail, FWD_W, SCAN_FROM, SCAN_TO } from "../components/ForwardedMail";
import type { PrivacyProps } from "../schema";

// Timeline (frames, scene-local).
export const READ_T = {
  maskUp: 20, // Buddy pushes his mask up: this one he may see
  maskLen: 8,
  scan: 34, // reading line starts at the top of the body text
  scanEnd: 74, // ... and leaves the bottom of the mail
  subline: 82,
};

/** Scene-local frame at which field i gets its highlighter mark (for the voice-over cue sheet). */
export const fieldFrame = (i: number) =>
  Math.round(READ_T.scan + ((fieldCenterY(i) - SCAN_FROM) / (SCAN_TO - SCAN_FROM)) * (READ_T.scanEnd - READ_T.scan));

const CARD = { x: 60, y: 20 };
const BUDDY = 210;
const BUDDY_X = 905; // centre
const BUDDY_FEET = 880;

export const ReadScene: React.FC<{
  props: PrivacyProps["read"];
  bill: PrivacyProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const p = usePalette();

  const scan = interpolate(frame, [READ_T.scan, READ_T.scanEnd], [0, 1], clamp);
  const float = Math.sin(frame / 22) * 4;

  // Buddy: mask up with a little hop, then reads along with the line.
  const lift = interpolate(frame, [READ_T.maskUp, READ_T.maskUp + READ_T.maskLen], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.6)),
  });
  const hopT = interpolate(frame, [READ_T.maskUp - 2, READ_T.maskUp + 12], [0, 1], clamp);
  const hop = -46 * 4 * hopT * (1 - hopT);
  const squash = interpolate(
    frame,
    [READ_T.maskUp - 4, READ_T.maskUp - 1, READ_T.maskUp + 4, READ_T.maskUp + 12, READ_T.maskUp + 16, READ_T.maskUp + 22],
    [1, 0.84, 1.14, 1.04, 0.92, 1],
    clamp,
  );
  const nod = interpolate(frame, [READ_T.scanEnd + 2, READ_T.scanEnd + 6, READ_T.scanEnd + 12], [1, 0.9, 1], clamp);
  const lookY = interpolate(frame, [READ_T.scan, READ_T.scanEnd], [-1, -0.1], clamp);
  const look = { x: -0.85, y: frame < READ_T.maskUp + 4 ? -0.6 : lookY };
  const blink = blinkScale(frame, [READ_T.scanEnd + 14]);
  const idle = frame > READ_T.scanEnd + 14 ? Math.sin((frame - READ_T.scanEnd - 14) / 8) * 4 : 0;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={6} stagger={3} />

      <Stage>
        <ForwardedMail
          chip={props.forwardedChip}
          fromLabel={props.fromLabel}
          sender={bill.sender}
          subjectLabel={props.subjectLabel}
          subject={bill.subject}
          greeting={props.greeting}
          signOff={props.signOff}
          fields={props.fields}
          scan={scan}
          style={{ left: CARD.x, top: CARD.y + float, width: FWD_W }}
        />

        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          blink={blink}
          squash={squash * nod}
          look={look}
          accessory={<SleepMask lift={lift} color={p.blueSoft} lineColor={p.blue} />}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + hop + idle,
          }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={READ_T.subline} />
    </SceneBg>
  );
};
