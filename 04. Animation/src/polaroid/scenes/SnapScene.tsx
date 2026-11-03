import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BillPhoto } from "../components/BillPhoto";
import { Camera, CAMERA_H, CAMERA_W } from "../components/Camera";
import { Polaroid, polaroidSize } from "../components/Polaroid";
import type { PolaroidProps } from "../schema";

// Timeline (frames, scene-local).
export const SNAP_T = {
  buddyIn: 8, // Buddy pops up behind his camera
  mail: 16, // forwarded bill slides in
  aim: 30, // camera up, Buddy squints
  flash: 42, // flash! the mail turns into a photo
  eject: 46, // photo slides out of the camera
  develop: 52, // photo develops from dark to sharp
  developLen: 30,
  subline: 72,
  blink: 90, // happy blink
};

const BUDDY = 280;
const BUDDY_FEET = 330;
const CAM_W = 320;
const CAM_K = CAM_W / CAMERA_W;
const CAM_Y = 190; // camera top (stage coords) at rest
const PHOTO_W = 440;
const PHOTO = polaroidSize(PHOTO_W);

export const SnapScene: React.FC<{
  props: PolaroidProps["snap"];
  bill: PolaroidProps["bill"];
}> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const buddyIn = pop(frame, fps, SNAP_T.buddyIn, springs.bouncy);
  const aim = pop(frame, fps, SNAP_T.aim, springs.smooth);
  const flashT = frame - SNAP_T.flash;
  const flash = flashT >= 0 ? interpolate(flashT, [0, 2, 12], [0, 1, 0], clamp) : 0;
  const recoil = flashT >= 0 ? interpolate(flashT, [0, 2, 8], [0, 1, 0], clamp) : 0;

  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  squash -= recoil * 0.08;
  const squint = frame >= SNAP_T.aim && frame < SNAP_T.flash + 4 ? 1 - 0.55 * aim : 1;
  const blink = Math.min(squint, blinkScale(frame, [SNAP_T.blink]));

  const camY = CAM_Y - aim * 26 + recoil * 8;

  // Forwarded mail slides up, then vanishes in the flash.
  const mailIn = pop(frame, fps, SNAP_T.mail, springs.pop);
  const mailGone = interpolate(frame, [SNAP_T.flash, SNAP_T.flash + 4], [1, 0], clamp);

  // Photo ejects from the slot and drops into place.
  const eject = interpolate(frame, [SNAP_T.eject, SNAP_T.eject + 16], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const develop = interpolate(frame, [SNAP_T.develop, SNAP_T.develop + SNAP_T.developLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const slotY = camY + CAMERA_H * CAM_K - 30;
  const photoTop = interpolate(eject, [0, 1], [slotY - PHOTO.height * 0.7, 380]);
  const photoRot = interpolate(eject, [0, 1], [0, 5]);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={4} stagger={3} sizeFactor={0.9} />

      <Stage offsetY={10}>
        {/* Forwarded mail, in front of the lens */}
        <div
          style={{
            position: "absolute",
            left: 540 - 340,
            top: interpolate(mailIn, [0, 1], [900, 500]),
            width: 680,
            padding: "26px 34px",
            boxSizing: "border-box",
            background: p.white,
            borderRadius: 28,
            boxShadow: "0 24px 60px rgba(0, 10, 80, 0.3)",
            fontFamily: fonts.ui,
            opacity: frame >= SNAP_T.mail ? mailGone : 0,
            transform: `scale(${1 + (1 - mailGone) * 0.08})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 20,
              background: "#e6ecff",
              color: p.blue,
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            {props.forwardedChip}
          </div>
          <div style={{ fontSize: 38, fontWeight: 600, color: p.ink, marginTop: 14 }}>
            <span style={{ color: "#7a7f8f", fontWeight: 400 }}>{props.fromLabel}: </span>
            {bill.sender}
          </div>
          <div style={{ fontSize: 32, color: "#555a6a", marginTop: 6 }}>{bill.subject}</div>
        </div>

        {/* Buddy */}
        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: 0, y: frame < SNAP_T.flash ? 0.6 : 0.9 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />

        {/* Photo comes out of the slot (drawn under the camera) */}
        {frame >= SNAP_T.eject ? (
          <Polaroid
            width={PHOTO_W}
            caption={props.caption}
            develop={develop}
            style={{
              left: 540 - PHOTO_W / 2,
              top: photoTop,
              transform: `rotate(${photoRot}deg)`,
              transformOrigin: "50% 0%",
            }}
          >
            <BillPhoto size={PHOTO.photo} bill={bill} />
          </Polaroid>
        ) : null}

        {/* Camera */}
        <Camera
          width={CAM_W}
          flash={flash}
          style={{
            left: 540 - CAM_W / 2,
            top: camY,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.5 + 0.5 * buddyIn}) rotate(${-3 * aim}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>

      {/* The flash lights up the whole frame for a moment */}
      <AbsoluteFill style={{ background: "#ffffff", opacity: flash * 0.75, pointerEvents: "none" }} />

      <Subline text={props.subline} color={p.blueText} delay={SNAP_T.subline} />
    </SceneBg>
  );
};
