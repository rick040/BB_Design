import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../../components/Stage";
import { clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline, DSubline } from "../../text";
import { AddressChip, AgendaCard, MailRow } from "../components/Cards";
import type { AdventProps } from "../schema";

// Timeline (frames, scene-local).
export const FWD_T = {
  mail: -6, // de mail staat er al bij het begin
  tap: 20, // "Doorsturen" wordt ingedrukt
  fly: 26, // de mail vliegt naar het Buddy-adres
  flyLen: 14, // duur van de vlucht
  chip: 36, // het adres veert op
  agenda: 50, // het agenda-item verschijnt
  tickFar: 70, // vinkje bij "7 dagen vooraf"
  tickNear: 82, // vinkje bij "2 dagen vooraf"
  tickLen: 10, // duur van het tekenen
  sub: 40,
};

export const ForwardScene: React.FC<{ props: AdventProps["forward"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const mailIn = pop(frame, fps, FWD_T.mail, springs.pop);
  const press = interpolate(frame, [FWD_T.tap, FWD_T.tap + 3, FWD_T.tap + 8], [0, 1, 0.6], clamp);
  const fly = interpolate(frame, [FWD_T.fly, FWD_T.fly + FWD_T.flyLen], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const chipIn = pop(frame, fps, FWD_T.chip - 8, springs.pop);
  const chipPulse = interpolate(frame, [FWD_T.chip, FWD_T.chip + 5, FWD_T.chip + 14], [0, 1, 0], clamp);
  const agendaIn = pop(frame, fps, FWD_T.agenda, springs.pop);
  const tickFar = interpolate(frame, [FWD_T.tickFar, FWD_T.tickFar + FWD_T.tickLen], [0, 1], clamp);
  const tickNear = interpolate(frame, [FWD_T.tickNear, FWD_T.tickNear + FWD_T.tickLen], [0, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <DHeadline text={props.headline} color={p.blue} delay={-4} stagger={3} />
      <Stage offsetY={0}>
        {/* De rekening in je inbox, vliegt naar het adres */}
        <MailRow
          from={props.mailFrom}
          subject={props.mailSubject}
          amount={props.mailAmount}
          forwardLabel={props.forwardLabel}
          press={press}
          style={{
            position: "absolute",
            left: 90,
            top: 20,
            opacity: Math.min(1, mailIn * 2) * (1 - interpolate(fly, [0.7, 1], [0, 1], clamp)),
            transform: `translateY(${fly * 230}px) scale(${(0.9 + 0.1 * mailIn) * (1 - fly * 0.55)}) rotate(${fly * -4}deg)`,
            transformOrigin: "50% 50%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 262,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `translateY(${(1 - chipIn) * 24}px)`,
          }}
        >
          <AddressChip text={props.addressChip} pulse={chipPulse} />
        </div>

        <AgendaCardWrap agendaIn={agendaIn}>
          <AgendaCard
            day={props.agendaDay}
            month={props.agendaMonth}
            title={props.agendaTitle}
            sub={props.agendaSub}
            chipFar={props.chipFar}
            chipNear={props.chipNear}
            tickFar={tickFar}
            tickNear={tickNear}
          />
        </AgendaCardWrap>
      </Stage>
      <DSubline text={props.subline} color={p.blue} delay={FWD_T.sub} />
    </SceneBg>
  );
};

const AgendaCardWrap: React.FC<{ agendaIn: number; children: React.ReactNode }> = ({ agendaIn, children }) => (
  <div
    style={{
      position: "absolute",
      left: 90,
      top: 420,
      opacity: Math.min(1, agendaIn * 2),
      transform: `translateY(${(1 - agendaIn) * 60}px) scale(${0.92 + 0.08 * agendaIn})`,
    }}
  >
    {children}
  </div>
);
