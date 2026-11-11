import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BillCard, BILL_H, BILL_W } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { AppLoader, appPct, appSpin } from "../components/AppLoader";
import { SCENE_STARTS, type WedstrijdProps, wordAt } from "../schema";

// Both race scenes (2: forward, on blue; 3: agenda, on light) draw the same
// two lanes from absolute frames, so the race runs on through the cut.
export const RACE_T = {
  forwardHeadline: SCENE_STARTS[1] - 6,
  forwardStagger: 6,
  tap: wordAt("stuurt"),
  fly: wordAt("stuurt") + 6,
  swallow: wordAt("door") - 6,
  go: wordAt("buddy"),
  finish: wordAt("staat"),
  stop: wordAt("staat") + 10,
  agendaHeadline: SCENE_STARTS[2] - 4,
  agendaStagger: 4,
  strip: SCENE_STARTS[2] + 2,
  spit: wordAt("agenda") - 12,
  land: wordAt("agenda"),
  stillLoading: wordAt("app", 2),
  subline: wordAt("app", 2) - 2,
};

const LANE_X = 40;
const LANE_W = 1000;
const A_TOP = 0;
const A_H = 190;
const B_TOP = 220;
const B_H = 380;
const FINISH_X = 860;
const BUDDY = 170;
const FEET = B_TOP + B_H - 26;
const START_X = 80;
const STOP_X = 890;

const CARD_SCALE = 0.58;
const CARD = { x: 300, y: 262 };
const BTN = { x: CARD.x + (BILL_W * CARD_SCALE) / 2, y: CARD.y + BILL_H * CARD_SCALE + 56 };

const TILE_W = 170;
const TILE_H = 200;
const GAP = 18;
const STRIP_X = (1080 - (5 * TILE_W + 4 * GAP)) / 2;
const STRIP_Y = 650;
const tileCenter = (i: number) => ({ x: STRIP_X + i * (TILE_W + GAP) + TILE_W / 2, y: STRIP_Y + TILE_H / 2 });

const Finish: React.FC<{ a: string; b: string }> = ({ a, b }) => {
  const sq = 20;
  const rows = Math.ceil((B_TOP + B_H) / sq);
  return (
    <div style={{ position: "absolute", left: FINISH_X, top: 0, width: sq * 2, height: rows * sq }}>
      {Array.from({ length: rows * 2 }).map((_, i) => {
        const r = Math.floor(i / 2);
        const c = i % 2;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: c * sq, top: r * sq, width: sq, height: sq, background: (r + c) % 2 ? a : b }}
          />
        );
      })}
    </div>
  );
};

export const RaceScene: React.FC<{
  variant: "forward" | "agenda";
  props: WedstrijdProps["race"];
  bill: WedstrijdProps["bill"];
}> = ({ variant, props, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const onBlue = variant === "forward";

  const bg = onBlue ? p.blue : p.light;
  const lane = onBlue ? "rgba(255,255,255,0.09)" : p.white;
  const label = onBlue ? p.blueText : p.blue;
  const buddyBody = onBlue ? p.white : p.blue;
  const buddyEye = onBlue ? p.blueMascot : p.white;

  // ── Lane A: the app that is still loading ──
  const pct = appPct(frame);
  const lag = shake(frame, RACE_T.stillLoading, 16, 8);

  // ── Lane B: forward, swallow, sprint ──
  const tap = interpolate(frame, [RACE_T.tap, RACE_T.tap + 3, RACE_T.tap + 9], [1, 0.9, 1], clamp);
  const fly = interpolate(frame, [RACE_T.fly, RACE_T.swallow], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const run = interpolate(frame, [RACE_T.go, RACE_T.finish, RACE_T.stop], [0, 0.88, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const buddyX = START_X + (STOP_X - START_X) * run;
  const running = frame >= RACE_T.go && frame < RACE_T.stop;
  const hop = running ? Math.abs(Math.sin(((frame - RACE_T.go) / 5) * Math.PI)) * 34 : 0;
  const swallowSq = interpolate(frame, [RACE_T.swallow, RACE_T.swallow + 3, RACE_T.swallow + 9], [1, 0.8, 1], clamp);
  const goSq = interpolate(frame, [RACE_T.go - 6, RACE_T.go, RACE_T.go + 4], [1, 0.82, 1.12], clamp);
  const stopSq = interpolate(frame, [RACE_T.stop - 2, RACE_T.stop + 2, RACE_T.stop + 8], [1, 0.84, 1], clamp);
  const spitSq = interpolate(frame, [RACE_T.spit - 4, RACE_T.spit, RACE_T.spit + 5], [1, 1.12, 1], clamp);
  const squash = running ? 1 + Math.sin(((frame - RACE_T.go) / 5) * Math.PI * 2) * 0.06 : Math.min(swallowSq, goSq, stopSq) * spitSq;
  const lean = running ? interpolate(frame, [RACE_T.go, RACE_T.go + 6, RACE_T.finish, RACE_T.stop], [0, 10, 10, -6], clamp) : 0;
  const look =
    frame < RACE_T.fly
      ? { x: 0.8, y: 0.2 }
      : frame < RACE_T.swallow
        ? { x: 0.8 * (1 - fly), y: 0.2 }
        : frame < RACE_T.stop + 4
          ? { x: 1, y: 0 }
          : { x: -0.5, y: 0.9 };
  const buddyTop = FEET - BUDDY * BUDDY_RATIO - hop;
  const mouth = { x: buddyX + BUDDY * 0.4, y: buddyTop + BUDDY * BUDDY_RATIO * 0.55 };

  // Card travels from its slot into Buddy.
  const cardCx = interpolate(fly, [0, 1], [CARD.x + (BILL_W * CARD_SCALE) / 2, START_X + BUDDY * 0.45]);
  const cardCy = interpolate(fly, [0, 1], [CARD.y + (BILL_H * CARD_SCALE) / 2, FEET - BUDDY * BUDDY_RATIO * 0.5]) - Math.sin(fly * Math.PI) * 120;
  const cardScale = CARD_SCALE * interpolate(fly, [0, 0.7, 1], [1, 0.45, 0.05]);
  const cardVisible = frame < RACE_T.swallow + 1;
  const btnOut = interpolate(frame, [RACE_T.fly, RACE_T.fly + 8], [1, 0], clamp);

  // Speed lines while sprinting.
  const lines = running ? interpolate(frame, [RACE_T.go, RACE_T.go + 6, RACE_T.stop - 4, RACE_T.stop], [0, 1, 1, 0], clamp) : 0;

  // ── Agenda strip (scene 3) ──
  const stripIn = (i: number) => pop(frame, fps, RACE_T.strip + i * 2, springs.pop);
  const target = tileCenter(props.dueIndex);
  const arc = interpolate(frame, [RACE_T.spit, RACE_T.land], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const pillX = interpolate(arc, [0, 1], [mouth.x, target.x]);
  const pillY = interpolate(arc, [0, 1], [mouth.y, target.y + 40]) - Math.sin(arc * Math.PI) * 220;
  const landed = pop(frame, fps, RACE_T.land, springs.bouncy);
  const check = interpolate(frame, [RACE_T.land + 4, RACE_T.land + 14], [0, 1], clamp);

  return (
    <SceneBg color={bg}>
      {onBlue ? (
        <Headline text={props.forwardHeadline} color={p.white} delay={RACE_T.forwardHeadline} stagger={RACE_T.forwardStagger} />
      ) : (
        <Headline text={props.agendaHeadline} color={p.blue} delay={RACE_T.agendaHeadline} stagger={RACE_T.agendaStagger} />
      )}
      <Stage offsetY={interpolate(frame, [SCENE_STARTS[2] - 6, SCENE_STARTS[2] + 14], [200, 60], { ...clamp, easing: Easing.inOut(Easing.cubic) })}>
        {/* Lanes */}
        {[
          { top: A_TOP, h: A_H, text: props.appLane },
          { top: B_TOP, h: B_H, text: props.buddyLane },
        ].map((l, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: LANE_X,
              top: l.top,
              width: LANE_W,
              height: l.h,
              borderRadius: 44,
              background: lane,
              boxShadow: onBlue ? "none" : "0 24px 60px rgba(1, 40, 160, 0.10)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 36,
                top: 22,
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 40,
                letterSpacing: "-0.02em",
                color: label,
              }}
            >
              {l.text}
            </div>
          </div>
        ))}
        <Finish a={onBlue ? "rgba(255,255,255,0.85)" : p.blue} b="transparent" />

        {/* Lane A runner: the app, still loading */}
        <div
          style={{
            position: "absolute",
            left: 80 + pct * 3 + lag.x,
            top: 70 + lag.y,
            display: "flex",
            alignItems: "center",
            gap: 22,
          }}
        >
          <AppLoader
            size={100}
            pct={pct}
            spin={appSpin(frame)}
            ring={onBlue ? p.blueSoft : p.greyText}
            track={onBlue ? "rgba(255,255,255,0.18)" : p.grey}
          />
          <div style={{ fontFamily: fonts.ui, fontSize: 38, color: onBlue ? p.blueText : p.greyText, whiteSpace: "nowrap" }}>
            {props.loading}
            {".".repeat(1 + (Math.floor(frame / 8) % 3))} {Math.floor(pct)}%
          </div>
        </div>

        {/* Lane B: the bill and its forward button */}
        {cardVisible ? (
          <div
            style={{
              position: "absolute",
              left: cardCx - BILL_W / 2,
              top: cardCy - BILL_H / 2,
              width: BILL_W,
              height: BILL_H,
              transform: `scale(${cardScale}) rotate(${fly * -25}deg)`,
              opacity: interpolate(fly, [0.85, 1], [1, 0], clamp),
            }}
          >
            <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
          </div>
        ) : null}
        {btnOut > 0 ? (
          <div
            style={{
              position: "absolute",
              left: BTN.x - 150,
              top: BTN.y - 40,
              width: 300,
              height: 80,
              borderRadius: 40,
              background: p.white,
              color: p.blue,
              fontFamily: fonts.display,
              fontWeight: 500,
              fontSize: 38,
              letterSpacing: headlineTracking,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
              transform: `scale(${tap * btnOut})`,
              opacity: btnOut,
              boxShadow: "0 16px 40px rgba(0, 20, 120, 0.25)",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 40 40">
              <path d="M24 8l10 10-10 10M34 18H16c-6 0-10 4-10 10v4" fill="none" stroke={p.blue} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {props.forwardButton}
          </div>
        ) : null}

        {/* Speed lines */}
        {lines > 0
          ? [0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: buddyX - 150 - i * 30,
                  top: buddyTop + 50 + i * 42,
                  width: 120 - i * 20,
                  height: 10,
                  borderRadius: 5,
                  background: onBlue ? p.blueSoft : p.blueSoft,
                  opacity: lines * 0.9,
                }}
              />
            ))
          : null}

        <Buddy
          size={BUDDY}
          body={buddyBody}
          eye={buddyEye}
          blink={frame > RACE_T.land + 6 ? Math.min(blinkScale(frame, [RACE_T.go - 20]), 0.2 + 0.8 * (1 - check)) : blinkScale(frame, [RACE_T.go - 20, RACE_T.finish + 30])}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: buddyX,
            top: buddyTop,
            transform: `rotate(${lean}deg)`,
            transformOrigin: "50% 100%",
          }}
        />

        {/* Agenda strip appears once Buddy is over the line */}
        {frame >= RACE_T.strip
          ? props.days.map((d, i) => {
              const s = stripIn(i);
              const c = tileCenter(i);
              const isDue = i === props.dueIndex && frame >= RACE_T.land;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: c.x - TILE_W / 2,
                    top: STRIP_Y,
                    width: TILE_W,
                    height: TILE_H,
                    borderRadius: 32,
                    background: isDue ? p.blue : p.white,
                    border: isDue ? "none" : `3px solid ${p.grey}`,
                    boxSizing: "border-box",
                    boxShadow: "0 20px 50px rgba(1, 40, 160, 0.10)",
                    transform: `translateY(${(1 - s) * 60}px) scale(${isDue ? 1 + (landed < 1 ? Math.sin(landed * Math.PI) * 0.08 : 0) : 1})`,
                    opacity: Math.min(1, s * 1.5),
                    fontFamily: fonts.display,
                    textAlign: "center",
                    color: isDue ? p.white : p.blue,
                  }}
                >
                  <div style={{ fontSize: 30, marginTop: 20, opacity: 0.75 }}>{d.day}</div>
                  <div style={{ fontSize: 66, fontWeight: 500, letterSpacing: headlineTracking, lineHeight: 1.05 }}>{d.date}</div>
                  {isDue ? (
                    <div style={{ fontFamily: fonts.ui, fontSize: 26, fontWeight: 600, marginTop: 4, color: p.blueSoft }}>
                      {bill.amount}
                    </div>
                  ) : null}
                </div>
              );
            })
          : null}
        {frame >= RACE_T.spit && frame < RACE_T.land ? (
          <div
            style={{
              position: "absolute",
              left: pillX - 70,
              top: pillY - 30,
              width: 140,
              height: 60,
              borderRadius: 30,
              background: p.yellow,
              color: p.ink,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `rotate(${arc * 360}deg) scale(${0.6 + 0.4 * Math.sin(Math.min(1, arc * 1.2) * Math.PI / 2)})`,
            }}
          >
            {bill.amount}
          </div>
        ) : null}
        {frame >= RACE_T.land ? (
          <div
            style={{
              position: "absolute",
              left: target.x + TILE_W / 2 - 34,
              top: STRIP_Y - 30,
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: p.yellow,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${landed})`,
            }}
          >
            <Checkmark size={36} color={p.ink} progress={check} strokeWidth={16} />
          </div>
        ) : null}
      </Stage>
      {!onBlue ? <Subline text={props.agendaSubline} color={p.blue} delay={RACE_T.subline} /> : null}
    </SceneBg>
  );
};
