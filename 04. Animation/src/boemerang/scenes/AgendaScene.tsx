import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Bell, Trail } from "../components/Flight";
import { type BoemerangProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
export const AGENDA_T = {
  headline: S - 6,
  arrive: S - 8,
  catch: wordAt("vangt"),
  throw: wordAt("vangt") + 16,
  land: wordAt("agenda"),
  bell: wordAt("agenda") + 10,
  subline: wordAt("agenda") + 12,
};

const BUDDY = 250;
const FEET = 470;
const TILE_W = 170;
const TILE_H = 200;
const GAP = 18;
const STRIP_X = (1080 - (5 * TILE_W + 4 * GAP)) / 2;
const STRIP_Y = 600;
const CARD_SCALE = 0.45;

const tileCenter = (i: number) => ({ x: STRIP_X + i * (TILE_W + GAP) + TILE_W / 2, y: STRIP_Y + TILE_H / 2 });

export const AgendaScene: React.FC<{ props: BoemerangProps["agenda"]; bill: BoemerangProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Buddy jumps to meet the returning bill.
  const jump = interpolate(frame, [AGENDA_T.catch - 8, AGENDA_T.catch, AGENDA_T.catch + 8], [0, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  const landSquash = interpolate(
    frame,
    [AGENDA_T.catch + 8, AGENDA_T.catch + 11, AGENDA_T.catch + 16],
    [1, 0.82, 1],
    clamp,
  );
  const throwSquash = interpolate(frame, [AGENDA_T.throw - 4, AGENDA_T.throw, AGENDA_T.throw + 5], [1, 0.85, 1.08], clamp);
  const buddyTop = FEET - BUDDY * BUDDY_RATIO - jump * 70;
  const hand = { x: 540, y: buddyTop - 95 };

  // Bill: spins in from the top left, sits on Buddy's head, then flies to the due date.
  const inU = interpolate(frame, [AGENDA_T.arrive, AGENDA_T.catch], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const inPath = (u: number) => ({ x: -260 + (540 + 260) * u, y: -420 + (FEET - BUDDY * BUDDY_RATIO - 205 + 420) * u });
  const target = tileCenter(props.dueIndex);
  const outU = interpolate(frame, [AGENDA_T.throw, AGENDA_T.land], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const outPath = (u: number) => ({
    x: 540 + (target.x - 540) * u,
    y: hand.y + (target.y - hand.y) * u - 260 * Math.sin(Math.PI * u),
  });
  let pos = inPath(inU);
  let rot = -540 * (1 - inU);
  let sc = CARD_SCALE;
  if (frame >= AGENDA_T.catch) {
    pos = { x: hand.x, y: hand.y };
    rot = 0;
  }
  if (frame >= AGENDA_T.throw) {
    pos = outPath(outU);
    rot = 360 * outU;
    sc = CARD_SCALE * (1 - 0.6 * outU);
  }
  const landed = frame >= AGENDA_T.land;
  const tileIn = pop(frame, fps, AGENDA_T.land, springs.pop);
  const bellIn = pop(frame, fps, AGENDA_T.bell, springs.bouncy);
  const stripIn = pop(frame, fps, S - 6, springs.smooth);
  const ring = frame > AGENDA_T.bell ? Math.sin((frame - AGENDA_T.bell) / 1.6) * 14 * Math.max(0, 1 - (frame - AGENDA_T.bell) / 24) : 0;
  const lookY = frame < AGENDA_T.catch ? -0.8 : frame < AGENDA_T.throw ? -0.9 : 0.6;
  const lookX = frame < AGENDA_T.catch ? -0.5 : frame < AGENDA_T.throw ? 0 : 0.6;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={AGENDA_T.headline} stagger={2} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: STRIP_X,
            top: STRIP_Y - 66,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 38,
            color: p.blue,
            opacity: stripIn,
          }}
        >
          {props.month}
        </div>
        {props.days.map((d, i) => {
          const isDue = i === props.dueIndex;
          const isRem = i === props.reminderIndex;
          const fill = isDue && landed ? tileIn : 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: STRIP_X + i * (TILE_W + GAP),
                top: STRIP_Y + (1 - stripIn) * 60,
                width: TILE_W,
                height: TILE_H,
                borderRadius: 34,
                background: fill > 0 ? p.blue : p.white,
                boxShadow: "0 16px 40px rgba(1, 40, 160, 0.12)",
                fontFamily: fonts.ui,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 22,
                boxSizing: "border-box",
                opacity: stripIn,
                transform: `scale(${isDue && landed ? 1 + 0.12 * Math.sin(Math.PI * Math.min(1, tileIn)) : 1})`,
                border: isRem && bellIn > 0.05 ? `5px solid ${p.yellow}` : "5px solid transparent",
              }}
            >
              <div style={{ fontSize: 32, color: fill > 0 ? p.blueSoft : p.greyText, fontWeight: 500 }}>{d.day}</div>
              <div style={{ fontSize: 72, fontWeight: 600, color: fill > 0 ? p.white : p.ink, lineHeight: 1.05 }}>{d.date}</div>
              {isDue && landed ? (
                <div style={{ fontSize: 28, fontWeight: 600, color: p.white, opacity: tileIn, marginTop: 4 }}>{bill.amount}</div>
              ) : null}
            </div>
          );
        })}
        {bellIn > 0.01 ? (
          <div
            style={{
              position: "absolute",
              left: tileCenter(props.reminderIndex).x - 40,
              top: STRIP_Y + TILE_H + 26,
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: p.yellow,
              color: p.ink,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 34,
              padding: "14px 26px 14px 18px",
              borderRadius: 40,
              transform: `scale(${bellIn})`,
              transformOrigin: "20% 0%",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ transform: `rotate(${ring}deg)` }}>
              <Bell size={38} color={p.ink} />
            </div>
            {props.reminderLabel}
          </div>
        ) : null}

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blinkScale(frame, [AGENDA_T.land + 4])}
          look={{ x: lookX, y: lookY }}
          squash={Math.min(landSquash, throwSquash) === 1 ? throwSquash : Math.min(landSquash, throwSquash)}
          style={{ position: "absolute", left: 540 - BUDDY / 2, top: buddyTop }}
        />

        {frame < AGENDA_T.throw ? <Trail at={inPath} u={inU} length={0.3} color={p.blueSoft} dot={22} /> : null}
        {frame >= AGENDA_T.throw ? <Trail at={outPath} u={outU} length={0.3} color={p.blueSoft} dot={22} /> : null}
        {!landed ? (
          <div
            style={{
              position: "absolute",
              left: pos.x - BILL_W / 2,
              top: pos.y - BILL_H / 2,
              width: BILL_W,
              height: BILL_H,
              transform: `rotate(${rot}deg) scale(${sc})`,
            }}
          >
            <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
          </div>
        ) : null}
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
