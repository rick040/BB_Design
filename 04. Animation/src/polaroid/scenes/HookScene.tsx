import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, shake } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BillPhoto } from "../components/BillPhoto";
import { Polaroid, polaroidSize } from "../components/Polaroid";
import type { PolaroidProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  fade: 10, // the photo starts to wash out
  fadeLen: 38,
  notice: 54, // "Aanmaning" note slaps onto the photo, photo shakes
  noticeText: 62, // "Kan uitlopen op €40"
};

const PHOTO_W = 680;
const PHOTO = polaroidSize(PHOTO_W);

export const HookScene: React.FC<{
  props: PolaroidProps["hook"];
  bill: PolaroidProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const fade = interpolate(frame, [HOOK_T.fade, HOOK_T.fade + HOOK_T.fadeLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const s = shake(frame, HOOK_T.notice, 16, 14);
  const notice = pop(frame, fps, HOOK_T.notice, { damping: 12, stiffness: 220 });
  const noticeText = interpolate(frame, [HOOK_T.noticeText, HOOK_T.noticeText + 8], [0, 1], clamp);
  // Slow drift, as if the photo hangs on a string.
  const sway = Math.sin(frame / 18) * 1.2;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-12} stagger={3} />

      <Stage offsetY={50}>
        <Polaroid
          width={PHOTO_W}
          caption={props.caption}
          fade={fade}
          style={{
            left: 540 - PHOTO_W / 2,
            top: 20,
            transform: `translate(${s.x}px, ${s.y}px) rotate(${-4 + sway + s.r}deg)`,
          }}
        >
          <BillPhoto size={PHOTO.photo} bill={bill} />
        </Polaroid>

        {/* Reminder notice slapped on the corner of the photo */}
        <div
          style={{
            position: "absolute",
            left: 450,
            top: 650,
            width: 540,
            padding: "28px 34px 30px 44px",
            boxSizing: "border-box",
            background: p.white,
            borderRadius: 26,
            boxShadow: "0 24px 60px rgba(10, 20, 80, 0.25)",
            borderLeft: `14px solid ${p.red}`,
            fontFamily: fonts.ui,
            opacity: frame >= HOOK_T.notice ? Math.min(1, notice * 2) : 0,
            transform: `rotate(${6 - 2 * notice}deg) scale(${1.5 - 0.5 * notice})`,
            transformOrigin: "50% 50%",
          }}
        >
          <div style={{ fontSize: 60, fontWeight: 700, color: p.red, letterSpacing: "-0.02em" }}>{props.noticeTitle}</div>
          <div style={{ fontSize: 40, fontWeight: 500, color: p.ink, marginTop: 6, opacity: noticeText }}>
            {props.noticeText}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
