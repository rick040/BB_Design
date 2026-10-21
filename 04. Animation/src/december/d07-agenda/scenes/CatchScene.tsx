import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { SceneBg, Stage } from "../../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline, DSubline } from "../../text";
import { BUDDY_FEET, BUDDY_SIZE, flight, IMPACT_BEFORE_CUT } from "../flight";
import type { AgendaProps } from "../schema";
import { AllDayItem, Block, BLOCK_H, BLOCK_W, CARD, allDayTop, colLeft, WeekCard } from "../WeekCard";

// Beats (frames, scene-lokaal). De duw in scène 1 valt IMPACT_BEFORE_CUT frames vóór het begin van deze scène.
export const CATCH_T = {
  buddy: 0, // Buddy springt omhoog onder de agenda
  catch: 14, // het blokje landt op zijn kop (= FLIGHT_LEN − IMPACT_BEFORE_CUT)
  throw: 32, // Buddy gooit het blokje naar boven
  throwLen: 18,
  flags: 56, // eerste vlaggetje (7 dagen vooraf)
  flagStagger: 7, // tweede vlaggetje (2 dagen vooraf)
  subline: 66,
  blink: 80,
};

const ITEM_H = CARD.allDayH - 22;

export const CatchScene: React.FC<{
  props: AgendaProps["catch"];
  week: AgendaProps["week"];
}> = ({ props, week }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const fl = flight(week.premium, BUDDY_RATIO);

  // Tijd sinds de duw, in frames.
  const t = frame + IMPACT_BEFORE_CUT;
  const caught = frame >= CATCH_T.catch;

  const buddyIn = pop(frame, fps, CATCH_T.buddy, springs.bouncy);
  const buddyX = fl.x0;
  const jumpT = interpolate(frame, [CATCH_T.throw - 6, CATCH_T.throw + 6, CATCH_T.throw + 16], [0, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });
  let squash = interpolate(buddyIn, [0, 0.6, 1], [0.7, 1.1, 1]);
  squash *= interpolate(frame, [CATCH_T.catch - 1, CATCH_T.catch + 2, CATCH_T.catch + 8], [1, 0.8, 1], clamp);
  squash *= 1 + jumpT * 0.18;
  const lift = jumpT * 46;
  const blink = blinkScale(frame, [CATCH_T.blink]);

  // Blokje: eerst vrije val, dan op Buddy's kop, dan omhoog naar de hele-dag-rij.
  const headY = BUDDY_FEET - BUDDY_SIZE * BUDDY_RATIO - BLOCK_H / 2 + 8;
  const landed = frame >= CATCH_T.throw + CATCH_T.throwLen;
  const throwU = interpolate(frame, [CATCH_T.throw, CATCH_T.throw + CATCH_T.throwLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const targetX = colLeft(week.premium.day) + BLOCK_W / 2;
  const targetY = allDayTop + ITEM_H / 2;
  let bx: number;
  let by: number;
  let rot: number;
  let bh = BLOCK_H;
  if (!caught && frame < CATCH_T.throw) {
    const f = fl.pos(Math.max(0, t));
    bx = f.x;
    by = f.y;
    rot = f.r;
  } else if (frame < CATCH_T.throw) {
    bx = fl.x0;
    by = headY - lift;
    rot = interpolate(frame, [CATCH_T.catch, CATCH_T.catch + 8], [38, 0], clamp);
  } else {
    bx = interpolate(throwU, [0, 1], [fl.x0, targetX]);
    by = interpolate(throwU, [0, 1], [headY - lift, targetY]) - Math.sin(throwU * Math.PI) * 120;
    rot = Math.sin(throwU * Math.PI) * -14;
    bh = interpolate(throwU, [0, 1], [BLOCK_H, ITEM_H]);
  }

  const flag7 = frame < CATCH_T.flags ? 0 : pop(frame, fps, CATCH_T.flags, springs.bouncy);
  const flag2 = frame < CATCH_T.flags + CATCH_T.flagStagger ? 0 : pop(frame, fps, CATCH_T.flags + CATCH_T.flagStagger, springs.bouncy);

  return (
    <SceneBg color={p.blue}>
      <Stage offsetY={20}>
        <WeekCard week={week} eventOn={() => 1} showPusher />

        {landed ? <AllDayItem week={week} flag7={flag7} flag2={flag2} /> : null}

        {!landed ? (
          <Block
            label={week.premium.label}
            tone={4}
            h={bh}
            style={{
              position: "absolute",
              left: bx - BLOCK_W / 2,
              top: by - bh / 2,
              transform: `rotate(${rot}deg)`,
              zIndex: 9,
            }}
          />
        ) : null}

        <Buddy
          size={BUDDY_SIZE}
          body={p.white}
          eye={p.blueMascot}
          blink={blink}
          squash={squash}
          look={{ x: 0, y: -0.8 }}
          style={{
            position: "absolute",
            left: buddyX - BUDDY_SIZE / 2,
            top: BUDDY_FEET - BUDDY_SIZE * BUDDY_RATIO - lift + (1 - buddyIn) * 160,
            opacity: Math.min(1, buddyIn * 3),
            transformOrigin: "50% 100%",
            zIndex: 8,
          }}
        />
      </Stage>
      <DHeadline text={props.headline} color={p.white} delay={2} stagger={3} />
      <DSubline text={props.subline} color={p.blueSoft} delay={CATCH_T.subline} />
    </SceneBg>
  );
};
