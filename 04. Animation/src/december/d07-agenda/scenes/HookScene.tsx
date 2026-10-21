import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BUDDY_RATIO } from "../../../components/Buddy";
import { SceneBg, Stage } from "../../../components/Stage";
import { clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline } from "../../text";
import { flight, FLIGHT_LEN } from "../flight";
import type { AgendaProps } from "../schema";
import { Block, BLOCK_H, BLOCK_W, colLeft, slotTop, WeekCard } from "../WeekCard";

// Beats (frames, scene-lokaal).
export const HOOK_T = {
  events: -44, // eerste gebeurtenis (op frame 0 is de week al voor de helft vol)
  eventStagger: 4,
  premium: -10, // het kleine zorgpremie-blokje zit er al tussen
  // "Diner schoonfamilie" valt 14 frames voor de duw van boven in de agenda; de duw (impact)
  // valt 10 frames voor het einde van de overgang: impact = hook − overgang − 10.
  pusherLead: 14,
};

export const HookScene: React.FC<{ props: AgendaProps["hook"]; week: AgendaProps["week"]; impact: number }> = ({
  props,
  week,
  impact,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const fl = flight(week.premium, BUDDY_RATIO);

  const eventOn = (i: number) => pop(frame, fps, HOOK_T.events + i * HOOK_T.eventStagger, springs.pop);
  const premiumIn = pop(frame, fps, HOOK_T.premium, springs.bouncy);

  // Het wegduwende blok valt van boven op de plek van het zorgpremie-blokje.
  const pusherTop = slotTop(week.premium.slot);
  const drop = interpolate(frame, [impact - HOOK_T.pusherLead, impact], [-340, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const land = interpolate(frame, [impact, impact + 3, impact + 8], [1, 1.07, 1], clamp);

  const pushed = frame >= impact;
  const t = Math.max(0, frame - impact);
  const f = fl.pos(Math.min(t, FLIGHT_LEN + 12));

  return (
    <SceneBg color={p.light}>
      <Stage offsetY={20}>
        <WeekCard week={week} eventOn={eventOn} showPusher={false} />

        {/* Zorgpremie: klein, al in de agenda gepropt, tot het wordt weggeduwd */}
        <Block
          label={week.premium.label}
          tone={4}
          style={{
            position: "absolute",
            left: pushed ? f.x - BLOCK_W / 2 : colLeft(week.premium.day),
            top: pushed ? f.y - BLOCK_H / 2 : slotTop(week.premium.slot),
            transform: `rotate(${pushed ? f.r : 0}deg) scale(${(pushed ? 1 : 0.85 + 0.15 * premiumIn) * (pushed ? 1.05 : 1)})`,
            opacity: Math.min(1, premiumIn * 2),
            zIndex: pushed ? 9 : 5,
          }}
        />

        {frame >= impact - HOOK_T.pusherLead ? (
          <Block
            label={week.pusher.label}
            tone={week.pusher.tone}
            h={2 * 96 - 6}
            style={{
              position: "absolute",
              left: colLeft(week.premium.day),
              top: pusherTop + drop,
              transform: `scale(${land})`,
              zIndex: 7,
            }}
          />
        ) : null}
      </Stage>
      <DHeadline text={props.headline} color={p.blue} delay={-16} stagger={3} />
    </SceneBg>
  );
};
