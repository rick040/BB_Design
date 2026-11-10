import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BOWL_DEPTH, RIM_CX, RIM_CY, SieveBack, SieveFront } from "../components/Sieve";
import { Chip } from "../components/Slip";
import type { ZeefProps } from "../schema";

// Timeline (frames, scene-local).
export const SIFT_T = {
  tap: 16, // tap on "Doorsturen"
  drop: 30, // the mail lands in the sieve
  hop1: 40, // Buddy hops under the handle: the sieve shakes, text falls through
  hop2: 54,
  hop3: 68,
  keepAmount: 80, // what stays behind: the amount ...
  keepDue: 86, // ... and the due date
  subline: 90,
};
const HOPS = [SIFT_T.hop1, SIFT_T.hop2, SIFT_T.hop3];
const HOP_LEN = 12;

const MAIL = { x: 130, y: 0, w: 820, h: 196 };
const SIEVE = { x: 110, y: 290 };
const BUDDY = 170;
const BUDDY_X = 820;
const BUDDY_FEET = 570;

// Text crumbs that fall through the mesh on each hop (sieve-local x, width).
const CRUMBS = [
  [210, 70], [300, 110], [430, 60], [520, 90],
  [250, 90], [360, 60], [470, 120], [560, 50],
  [200, 60], [330, 100], [450, 80], [540, 70],
];

const ForwardMail: React.FC<{ sender: string; subject: string; button: string; press: number }> = ({
  sender,
  subject,
  button,
  press,
}) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: MAIL.w,
        height: MAIL.h,
        borderRadius: 40,
        background: p.white,
        boxShadow: "0 24px 70px rgba(0, 20, 120, 0.3)",
        padding: "30px 36px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        position: "relative",
      }}
    >
      <div style={{ fontSize: 34, fontWeight: 600, color: p.ink }}>{sender}</div>
      <div style={{ fontSize: 28, color: p.greyText, marginTop: 4 }}>{subject}</div>
      <div style={{ display: "flex", gap: 14, marginTop: 22 }}>
        <div style={{ width: 200, height: 14, borderRadius: 7, background: p.grey }} />
        <div style={{ width: 120, height: 14, borderRadius: 7, background: p.grey }} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 32,
          bottom: 32,
          height: 70,
          padding: "0 30px",
          borderRadius: 35,
          background: p.blueMid,
          color: p.white,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 30,
          fontWeight: 600,
          transform: `scale(${1 - press * 0.1})`,
          boxShadow: press > 0 ? `0 0 0 ${press * 14}px ${p.blueSoft}88` : undefined,
        }}
      >
        <svg width={28} height={28} viewBox="0 0 32 32">
          <path d="M18 7l9 8-9 8M27 15H13a8 8 0 0 0-8 8v2" fill="none" stroke="#fff" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {button}
      </div>
    </div>
  );
};

export const SiftScene: React.FC<{ props: ZeefProps["sift"]; bill: ZeefProps["bill"] }> = ({ props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const press = interpolate(frame, [SIFT_T.tap, SIFT_T.tap + 3, SIFT_T.tap + 8], [0, 1, 0], clamp);
  const fly = interpolate(frame, [SIFT_T.tap + 4, SIFT_T.drop], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const mailIn = pop(frame, fps, -6, springs.smooth);
  const rimX = SIEVE.x + RIM_CX;
  const rimY = SIEVE.y + RIM_CY;
  const mailX = interpolate(fly, [0, 1], [MAIL.x, rimX - MAIL.w / 2]);
  const mailY = interpolate(fly, [0, 1], [MAIL.y, rimY - MAIL.h / 2 + 20]);
  const mailScale = interpolate(fly, [0, 1], [1, 0.4]);

  // Buddy hops; each landing gives the sieve a shake.
  let hopY = 0;
  let squash = 1;
  let jolt = 0;
  for (const h of HOPS) {
    const t = frame - h;
    if (t >= 0 && t <= HOP_LEN) {
      hopY = -Math.sin((t / HOP_LEN) * Math.PI) * 70;
      squash = interpolate(t, [0, 2, 6, HOP_LEN], [0.85, 1.12, 1.05, 1], clamp);
    }
    if (t > HOP_LEN && t < HOP_LEN + 6) squash = interpolate(t, [HOP_LEN, HOP_LEN + 2, HOP_LEN + 6], [1, 0.82, 1], clamp);
    const jt = t - HOP_LEN * 0.5;
    if (jt >= 0 && jt < 14) jolt += Math.sin(jt * 2.4) * (1 - jt / 14);
  }
  const buddyIn = pop(frame, fps, 2, springs.bouncy);
  const blink = blinkScale(frame, [SIFT_T.keepDue + 6]);
  const look = frame < SIFT_T.hop1 ? { x: -0.5, y: -0.3 } : frame < SIFT_T.keepAmount ? { x: -0.7, y: 0.2 } : { x: -0.4, y: -0.6 };

  // Contents in the bowl: grey text bars that thin out with every hop.
  const hopsDone = HOPS.filter((h) => frame >= h + 4).length;
  const contentIn = interpolate(frame, [SIFT_T.drop - 2, SIFT_T.drop + 4], [0, 1], clamp);

  const keepA = pop(frame, fps, SIFT_T.keepAmount, springs.bouncy);
  const keepB = pop(frame, fps, SIFT_T.keepDue, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={2} stagger={3} />

      <Stage offsetY={30}>
        {/* Crumbs falling out under the sieve */}
        {CRUMBS.map(([cx, w], i) => {
          const start = HOPS[Math.floor(i / 4)] + 4 + (i % 4) * 2;
          const t = frame - start;
          if (t < 0 || t > 30) return null;
          const y = SIEVE.y + RIM_CY + BOWL_DEPTH * 0.55 + 0.9 * t * t;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: SIEVE.x + cx + (i % 2 ? 1 : -1) * t * 1.2,
                top: y,
                width: w,
                height: 14,
                borderRadius: 7,
                background: p.white,
                opacity: interpolate(t, [0, 4, 22, 30], [0, 0.85, 0.6, 0], clamp),
                transform: `rotate(${(i % 3 - 1) * t * 2}deg)`,
              }}
            />
          );
        })}

        <div
          style={{
            position: "absolute",
            left: SIEVE.x,
            top: SIEVE.y,
            transform: `translateX(${jolt * 12}px) rotate(${jolt * 2.5}deg)`,
            transformOrigin: "50% 20%",
          }}
        >
          <SieveBack inner="#0a2fc4" />
          {/* Text bars of the mail lying in the bowl */}
          {[0, 1, 2, 3].map((i) =>
            i >= 4 - hopsDone || frame >= SIFT_T.keepAmount || frame < SIFT_T.drop - 2 ? null : (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: RIM_CX - 150 + (i % 2) * 70,
                  top: RIM_CY - 30 + i * 14,
                  width: 230 - (i % 2) * 60,
                  height: 14,
                  borderRadius: 7,
                  background: p.white,
                  opacity: contentIn * 0.85,
                  transform: `translateX(${jolt * 10}px)`,
                }}
              />
            ),
          )}
          <SieveFront mesh={p.blueSoft} rim={p.white} />
        </div>

        {/* The forwarded mail flies into the sieve */}
        {frame < SIFT_T.drop + 2 ? (
          <div
            style={{
              position: "absolute",
              left: mailX,
              top: mailY,
              transform: `scale(${mailScale * (0.92 + 0.08 * mailIn)})`,
              opacity: interpolate(fly, [0.8, 1], [1, 0], clamp) * Math.min(1, mailIn * 2),
            }}
          >
            <ForwardMail sender={bill.sender} subject={bill.subject} button={props.forwardButton} press={press} />
          </div>
        ) : null}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash * (0.6 + 0.4 * buddyIn)}
          look={look}
          style={{
            position: "absolute",
            left: BUDDY_X - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + hopY,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />

        {/* What stays behind */}
        {frame >= SIFT_T.keepAmount ? (
          <Chip
            text={bill.amount}
            bg={p.white}
            fg={p.blue}
            size={46}
            style={{
              left: 190,
              top: rimY - 150 - keepA * 40,
              transform: `scale(${keepA}) rotate(-4deg)`,
              opacity: Math.min(1, keepA * 2),
            }}
          />
        ) : null}
        {frame >= SIFT_T.keepDue ? (
          <Chip
            text={props.keepDue}
            bg={p.white}
            fg={p.blue}
            size={46}
            style={{
              left: 450,
              top: rimY - 140 - keepB * 40,
              transform: `scale(${keepB}) rotate(3deg)`,
              opacity: Math.min(1, keepB * 2),
            }}
          />
        ) : null}
      </Stage>

      <Subline text={props.subline} color={p.blueText} delay={SIFT_T.subline} />
    </SceneBg>
  );
};
