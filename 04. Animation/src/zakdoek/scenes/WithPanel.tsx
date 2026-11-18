import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Arrow } from "../../components/CtaPill";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Bell, Chip } from "../components/Hanky";
import { stripLayout, WeekStrip } from "../components/WeekStrip";
import { SCENE_STARTS, SPLIT_Y, wordAt, type ZakdoekProps } from "../schema";

// Bottom screen "Met Buddy": forward the bill (scene 2), then the agenda (scene 3).
const S2 = SCENE_STARTS[1];
const S3 = SCENE_STARTS[2];
export const WITH_T = {
  headline: S2 - 2,
  billIn: S2 - 6,
  tap: wordAt("door"),
  flyFrom: wordAt("door") + 4,
  swallow: wordAt("buddy") + 12,
  agendaHeadline: S3 - 4,
  strip: S3 - 2,
  throwFrom: S3 + 4,
  land: wordAt("agenda"),
  hopFrom: wordAt("agenda") + 2,
  hopTo: wordAt("agenda") + 14,
  choose: wordAt("jij"),
  bell: wordAt("kiest"),
};

const BUDDY = 170;
const HOME = { x: 905, feet: 1595 };
const BILL_SCALE = 0.6;
const BILL_C = { x: 430, y: 1240 };
const TILE_W = 150;
const TILE_GAP = 16;
const STRIP_Y = 1235;

export const WithPanel: React.FC<{ split: ZakdoekProps["split"]; bill: ZakdoekProps["bill"] }> = ({ split, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = stripLayout(TILE_W, TILE_GAP, STRIP_Y);
  const due = { x: L.center(split.dueIndex), y: STRIP_Y };

  // Headlines swap between scene 2 and 3.
  const h1 = pop(frame, fps, WITH_T.headline, springs.pop);
  const h2 = pop(frame, fps, WITH_T.agendaHeadline, springs.pop);
  const swap = interpolate(frame, [WITH_T.agendaHeadline - 6, WITH_T.agendaHeadline], [1, 0], clamp);

  // Scene 2: bill + Doorsturen, then the bill flies into Buddy.
  const billIn = pop(frame, fps, WITH_T.billIn, springs.pop);
  const press = interpolate(frame, [WITH_T.tap, WITH_T.tap + 3, WITH_T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [WITH_T.tap, WITH_T.tap + 14], [0, 1], clamp);
  const fly = interpolate(frame, [WITH_T.flyFrom, WITH_T.swallow], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const mouth = { x: HOME.x, y: HOME.feet - BUDDY * BUDDY_RATIO * 0.6 };
  const billPos = {
    x: BILL_C.x + (mouth.x - BILL_C.x) * fly,
    y: BILL_C.y + (mouth.y - BILL_C.y) * fly - 220 * Math.sin(Math.PI * fly),
  };
  const billScale = BILL_SCALE * (1 - 0.85 * fly);
  const btnFade = interpolate(frame, [WITH_T.flyFrom, WITH_T.flyFrom + 8], [1, 0], clamp);
  const gulp = interpolate(frame, [WITH_T.swallow - 2, WITH_T.swallow + 2, WITH_T.swallow + 9], [1, 1.18, 1], clamp);

  // Scene 3: Buddy spits out the date chip onto the due tile and hops after it.
  const stripIn = pop(frame, fps, WITH_T.strip, springs.smooth);
  const chipU = interpolate(frame, [WITH_T.throwFrom, WITH_T.land], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.sin),
  });
  const chipPos = {
    x: mouth.x + (due.x - mouth.x) * chipU,
    y: mouth.y + (due.y + 120 - mouth.y) * chipU - 260 * Math.sin(Math.PI * chipU),
  };
  const landed = frame >= WITH_T.land;
  const landPop = pop(frame, fps, WITH_T.land, springs.pop);
  const hop = interpolate(frame, [WITH_T.hopFrom, WITH_T.hopTo], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const buddySize = interpolate(hop, [0, 1], [BUDDY, 110]);
  const feetX = HOME.x + (due.x - HOME.x) * hop;
  const feetY = HOME.feet + (STRIP_Y - HOME.feet) * hop - 200 * Math.sin(Math.PI * hop);
  const landSq = interpolate(frame, [WITH_T.hopTo, WITH_T.hopTo + 3, WITH_T.hopTo + 9], [1, 0.8, 1], clamp);
  const takeoff = interpolate(frame, [WITH_T.hopFrom - 4, WITH_T.hopFrom, WITH_T.hopFrom + 4], [1, 0.82, 1.08], clamp);
  const buddyIn = pop(frame, fps, S2 - 4, springs.bouncy);
  const squash = frame < S2 + 10 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : Math.min(landSq, takeoff) * gulp;

  const bellIn = pop(frame, fps, WITH_T.bell, springs.bouncy);
  const ring = frame >= WITH_T.bell ? Math.sin((frame - WITH_T.bell) / 1.6) * 18 * Math.max(0, 1 - (frame - WITH_T.bell) / 30) : 0;
  const chooseIn = pop(frame, fps, WITH_T.choose, springs.smooth);

  const look =
    frame < WITH_T.flyFrom
      ? { x: -0.8, y: 0.2 }
      : frame < S3
        ? { x: -0.4 * (1 - fly), y: -0.3 }
        : frame < WITH_T.bell
          ? { x: -0.7, y: 0.5 }
          : { x: -1, y: 0.4 };

  return (
    <>
      <div style={{ position: "absolute", top: SPLIT_Y + 26, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Chip text={split.with} bg={p.white} fg={p.blue} size={30} />
      </div>
      {[split.forwardHeadline, split.agendaHeadline].map((t, i) => {
        const s = i === 0 ? h1 * swap : h2;
        if (i === 1 && frame < WITH_T.agendaHeadline - 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: SPLIT_Y + 92,
              left: 60,
              right: 60,
              textAlign: "center",
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 84,
              lineHeight: 1,
              letterSpacing: headlineTracking,
              color: p.white,
              opacity: Math.min(1, s * 1.4),
              transform: `translateY(${(1 - s) * 30}px)`,
            }}
          >
            {t}
          </div>
        );
      })}

      {frame < WITH_T.swallow ? (
        <div
          style={{
            position: "absolute",
            left: billPos.x - BILL_W / 2,
            top: billPos.y - BILL_H / 2,
            width: BILL_W,
            height: BILL_H,
            transform: `scale(${billScale * billIn}) rotate(${-200 * fly}deg)`,
          }}
        >
          <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: BILL_C.x,
          top: BILL_C.y + 120,
          transform: `translateX(-50%) scale(${press * billIn})`,
          opacity: btnFade,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: p.white,
            color: p.blue,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 40,
            padding: "18px 36px",
            borderRadius: 50,
            boxShadow: "0 20px 60px rgba(0, 20, 120, 0.3)",
          }}
        >
          {split.button}
          <Arrow size={34} color={p.blue} />
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 180,
            height: 180,
            marginLeft: -90,
            marginTop: -90,
            borderRadius: "50%",
            border: `6px solid ${p.white}`,
            opacity: ripple > 0 && ripple < 1 ? 1 - ripple : 0,
            transform: `scale(${0.3 + ripple * 1.3})`,
          }}
        />
      </div>

      {frame >= WITH_T.strip - 2 ? (
        <WeekStrip
          days={split.days}
          tileW={TILE_W}
          tileH={170}
          gap={TILE_GAP}
          y={STRIP_Y}
          bg="rgba(255,255,255,0.14)"
          fg={p.white}
          dayFg={p.blueText}
          opacity={stripIn}
          highlight={landed ? { index: split.dueIndex, bg: p.white, fg: p.blue, amount: landPop } : null}
          extra={(i) =>
            i === split.reminderIndex && bellIn > 0.01 ? (
              <div
                style={{
                  position: "absolute",
                  top: -34,
                  right: -18,
                  width: 68,
                  height: 68,
                  borderRadius: "50%",
                  background: p.yellow,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${bellIn}) rotate(${ring}deg)`,
                }}
              >
                <Bell size={40} color="#111827" />
              </div>
            ) : null
          }
        />
      ) : null}
      {frame >= WITH_T.throwFrom && !landed ? (
        <div style={{ position: "absolute", left: chipPos.x, top: chipPos.y, transform: "translate(-50%, -50%)" }}>
          <Chip text={bill.amount} bg={p.white} fg={p.blue} size={30} />
        </div>
      ) : null}
      {landed ? (
        <div
          style={{
            position: "absolute",
            left: due.x,
            top: STRIP_Y + 186,
            transform: `translateX(-50%) scale(${landPop})`,
          }}
        >
          <Chip text={bill.amount} bg={p.white} fg={p.blue} size={30} />
        </div>
      ) : null}
      <div
        style={{
          position: "absolute",
          left: L.center(split.reminderIndex) - TILE_W / 2,
          top: STRIP_Y + 186,
          transform: `scale(${bellIn})`,
          transformOrigin: "0% 0%",
        }}
      >
        <Chip text={split.reminderLabel} bg={p.yellow} fg="#111827" size={30} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1505,
          left: 60,
          right: 60,
          textAlign: "center",
          fontFamily: fonts.display,
          fontSize: 50,
          color: p.blueText,
          opacity: chooseIn,
          transform: `translateY(${(1 - chooseIn) * 20}px)`,
        }}
      >
        {split.chooseLine}
      </div>

      <Buddy
        size={buddySize}
        body={p.white}
        eye={p.blueMascot}
        blink={blinkScale(frame, [WITH_T.tap - 8, WITH_T.bell + 12])}
        look={look}
        squash={squash}
        style={{
          position: "absolute",
          left: feetX - buddySize / 2,
          top: feetY - buddySize * BUDDY_RATIO,
          opacity: Math.min(1, buddyIn * 3),
          transformOrigin: "50% 100%",
        }}
      />
    </>
  );
};
