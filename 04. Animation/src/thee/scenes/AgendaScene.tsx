import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { AgendaDay, Bell } from "../components/Agenda";
import { Mug, TeaBag } from "../components/Mug";
import type { TheeProps } from "../schema";

// Timeline (frames, scene-local). Rides on "dan zet Buddy hem op tijd in
// je agenda." The tea is still light: he takes the bag out in time.
export const AGENDA_T = {
  headline: 6,
  hop: 14, // Buddy hops and pulls the bag out on its string ("zet Buddy")
  hopLen: 14,
  agenda: 28, // agenda tile pops in ("op tijd")
  event: 38, // bill lands on do 17 ("in je")
  reminder: 48, // bell chip "Herinnering · ma 14 dec" ("agenda")
  subline: 40,
  happy: 50, // Buddy's eyes close happily
};

const BUDDY = 170;
const FEET = 640;
const BX = 500; // Buddy centre x

export const AgendaScene: React.FC<{
  props: TheeProps["agenda"];
  bill: TheeProps["bill"];
  tea: TheeProps["tea"];
}> = ({ props, bill, tea }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const h = interpolate(frame, [AGENDA_T.hop, AGENDA_T.hop + AGENDA_T.hopLen], [0, 1], clamp);
  const arc = Math.sin(h * Math.PI) * 120;
  const squash =
    frame < AGENDA_T.hop
      ? interpolate(frame, [AGENDA_T.hop - 6, AGENDA_T.hop], [1, 0.82], clamp)
      : frame < AGENDA_T.hop + AGENDA_T.hopLen
        ? 1.08
        : interpolate(frame, [AGENDA_T.hop + AGENDA_T.hopLen, AGENDA_T.hop + AGENDA_T.hopLen + 4, AGENDA_T.hop + AGENDA_T.hopLen + 10], [0.85, 1.04, 1], clamp);
  const buddyTop = FEET - BUDDY * BUDDY_RATIO - arc;
  const happy = frame >= AGENDA_T.happy ? 0.18 : blinkScale(frame, [3]);

  // Bag: from inside the mug up and out, then dangles and drips.
  const lift = interpolate(frame, [AGENDA_T.hop, AGENDA_T.hop + AGENDA_T.hopLen + 4], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const swing = frame > AGENDA_T.hop + AGENDA_T.hopLen ? Math.sin((frame - AGENDA_T.hop) / 5) * 6 * Math.exp(-(frame - AGENDA_T.hop - AGENDA_T.hopLen) / 30) : 0;
  const bagX = 205 + swing;
  const bagY = interpolate(lift, [0, 1], [380, 150]);
  const drip = (frame - AGENDA_T.hop - AGENDA_T.hopLen) % 14;

  const agendaIn = pop(frame, fps, AGENDA_T.agenda, springs.bouncy);
  const eventIn = pop(frame, fps, AGENDA_T.event, springs.pop);
  const rem = pop(frame, fps, AGENDA_T.reminder, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={AGENDA_T.headline} stagger={3} />
      <Stage offsetY={10}>
        <div style={{ position: "absolute", inset: 0, transform: "scale(1.08)", transformOrigin: "50% 45%" }}>
        <Mug
          steep={0.12}
          fresh={tea.fresh}
          bitter={tea.bitter}
          cup="#ffffff"
          outline={p.blue}
          bag={lift < 0.2}
          steam={0.8}
          steamPhase={frame}
          scale={0.72}
          style={{ left: 30, top: 300 }}
        />
        {/* string from Buddy's head to the bag */}
        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <path
            d={`M ${BX - 10} ${buddyTop + 14} Q ${(BX + bagX) / 2} ${Math.min(buddyTop, bagY) - 60} ${bagX + 48} ${bagY}`}
            fill="none"
            stroke="#b8a586"
            strokeWidth={5}
          />
          {lift > 0.95 && drip >= 0 ? (
            <ellipse cx={bagX + 48} cy={bagY + 130 + drip * 9} rx={8} ry={12} fill={tea.fresh} opacity={1 - drip / 14} />
          ) : null}
        </svg>
        {lift >= 0.2 ? <TeaBag color="#f4ead8" wet={tea.fresh} style={{ position: "absolute", left: bagX, top: bagY, transform: `rotate(${swing}deg)` }} /> : null}

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          squash={squash}
          blink={happy}
          look={{ x: frame < AGENDA_T.agenda ? -0.7 : 0.8, y: -0.2 }}
          style={{ position: "absolute", left: BX - BUDDY / 2, top: buddyTop }}
        />

        <AgendaDay
          month={bill.dueMonth}
          weekday={bill.dueWeekday}
          day={bill.dueDay}
          event={`${bill.sender.slice(0, 7)} ${bill.amount}`}
          eventIn={eventIn}
          blue={p.blue}
          soft={p.blueSoft}
          style={{
            left: 610,
            top: 200,
            opacity: Math.min(1, agendaIn * 2),
            transform: `scale(${0.6 + 0.4 * agendaIn}) rotate(${(1 - agendaIn) * 8}deg)`,
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 540,
            top: 640,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "16px 26px",
            borderRadius: 999,
            background: p.white,
            boxShadow: "0 14px 34px rgba(1,40,160,0.18)",
            color: p.blue,
            fontFamily: fonts.ui,
            fontSize: 32,
            fontWeight: 600,
            opacity: Math.min(1, rem * 2),
            transform: `scale(${0.6 + 0.4 * rem})`,
            transformOrigin: "50% 0%",
          }}
        >
          <Bell size={40} color={p.yellow} ring={frame > AGENDA_T.reminder ? (frame - AGENDA_T.reminder) * 0.9 : 0} />
          {props.reminder}
        </div>
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
