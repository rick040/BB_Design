import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Notification, NOTIFICATION_H } from "../../components/Notification";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, pushedSlots, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { AGENDA_ITEM2, AgendaCard } from "../components/AgendaCard";
import { PartyBuddy, tootCurve, tootSquash } from "../components/PartyBuddy";
import type { VerjaardagProps } from "../schema";

// Timeline (frames, scene-local).
export const AGENDA_T = {
  tap: 14, // "Doorsturen" gets tapped
  fly: 22, // the bill flies up into the agenda
  flyLen: 16,
  item: 38, // the bill lands next to Tante Ria on the 18th; Buddy toots
  rem1: 64, // mail "Nog 7 dagen"; Buddy toots
  rem2: 88, // mail "Nog 2 dagen"; Buddy toots
  subline: 98,
};

const AGENDA = { x: 110, y: 0 };
const MINI = 0.62;
const MINI_POS = { x: 120, y: 480 };
const NOTE_W = 760;
const NOTE = { x: 50, y: 470, gap: 26 };
const BUDDY = { x: 935, feet: 900, size: 170 };

export const AgendaScene: React.FC<{
  props: VerjaardagProps["agenda"];
  bill: VerjaardagProps["bill"];
  toot: string;
}> = ({ props, bill, toot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Mini bill + forward tap, then it flies into the agenda.
  const miniIn = pop(frame, fps, 0, springs.smooth);
  const tap = interpolate(frame, [AGENDA_T.tap, AGENDA_T.tap + 3, AGENDA_T.tap + 8], [1, 0.9, 1], clamp);
  const ripple = interpolate(frame, [AGENDA_T.tap + 1, AGENDA_T.tap + 16], [0, 1], clamp);
  const fly = interpolate(frame, [AGENDA_T.fly, AGENDA_T.fly + AGENDA_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const target = { x: AGENDA.x + AGENDA_ITEM2.x, y: AGENDA.y + AGENDA_ITEM2.y };
  const miniX = interpolate(fly, [0, 1], [MINI_POS.x, target.x]);
  const miniY = interpolate(fly, [0, 1], [MINI_POS.y, target.y]) - Math.sin(fly * Math.PI) * 120;
  const miniScale = interpolate(fly, [0, 1], [MINI, 0.3]);
  const miniOpacity = interpolate(fly, [0.75, 1], [1, 0], clamp);
  const billIn = frame >= AGENDA_T.item ? pop(frame, fps, AGENDA_T.item, springs.pop) : 0;

  // Reminders, newest on top.
  const arrivals = [AGENDA_T.rem1, AGENDA_T.rem2];
  const icons = ["warning", "alert"] as const;

  // Buddy toots at every moment.
  const toots = [AGENDA_T.item, AGENDA_T.rem1, AGENDA_T.rem2];
  let unroll = 0;
  let squash = 1;
  for (const t of toots) {
    unroll = Math.max(unroll, tootCurve(frame, t - 2, 18));
    squash *= tootSquash(frame, t - 2, 18);
  }
  const buddyIn = pop(frame, fps, 6, springs.bouncy);
  squash *= interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]);
  const angle = frame < AGENDA_T.rem1 - 6 ? -132 : -168;
  const blink = blinkScale(frame, [52, 112]);
  const idle = Math.sin(frame / 8) * 3;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={6} stagger={3} />

      <Stage offsetY={20}>
        <AgendaCard
          label={props.month}
          dayLabel={props.dayLabel}
          birthdayItem={props.birthdayItem}
          birthdayMeta={props.birthdayMeta}
          billItem={props.billItem}
          billMeta={props.billMeta}
          billIn={billIn}
          style={{ left: AGENDA.x, top: AGENDA.y }}
        />

        {arrivals.map((a, i) => {
          if (frame < a - 2) return null;
          const s = pop(frame, fps, a, springs.pop);
          const slots = pushedSlots(frame, fps, arrivals, i);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: NOTE.x,
                top: NOTE.y + slots * ((NOTIFICATION_H * NOTE_W) / 900 + NOTE.gap) - (1 - s) * 40,
                opacity: Math.min(1, s * 2),
                transform: `scale(${0.85 + 0.15 * s})`,
                zIndex: i + 1,
              }}
            >
              <Notification
                text={props.reminders[i].text}
                time={props.reminders[i].time}
                icon={icons[i]}
                width={NOTE_W}
              />
            </div>
          );
        })}

        {miniOpacity > 0 ? (
          <div
            style={{
              position: "absolute",
              left: miniX,
              top: miniY,
              width: BILL_W,
              height: BILL_H,
              transform: `scale(${miniScale * (0.9 + 0.1 * miniIn)})`,
              transformOrigin: "0 0",
              opacity: miniOpacity * miniIn,
              zIndex: 5,
            }}
          >
            <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
            {/* "Doorsturen" button on the bill */}
            <div
              style={{
                position: "absolute",
                right: 40,
                top: 40,
                height: 84,
                padding: "0 34px",
                borderRadius: 42,
                background: p.blue,
                color: p.white,
                display: "flex",
                alignItems: "center",
                fontFamily: fonts.display,
                fontWeight: 500,
                fontSize: 40,
                transform: `scale(${tap})`,
                opacity: interpolate(fly, [0, 0.2], [1, 0], clamp),
              }}
            >
              {props.forward} →
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 160,
                  height: 160,
                  marginLeft: -80,
                  marginTop: -80,
                  borderRadius: "50%",
                  border: `6px solid ${p.blueMid}`,
                  opacity: ripple > 0 && ripple < 1 ? (1 - ripple) * 0.9 : 0,
                  transform: `scale(${0.3 + ripple * 1.3})`,
                }}
              />
            </div>
          </div>
        ) : null}

        <PartyBuddy
          x={BUDDY.x}
          feetY={BUDDY.feet + idle}
          size={BUDDY.size}
          body={p.blue}
          eye={p.white}
          blink={blink}
          squash={squash}
          look={{ x: -0.8, y: angle < -150 ? 0 : -0.6 }}
          hornAngle={angle}
          hornLength={150}
          hornUnroll={unroll}
          toot={toot}
          style={{ opacity: Math.min(1, buddyIn * 3), zIndex: 6 }}
        />
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={AGENDA_T.subline} />
    </SceneBg>
  );
};
