import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Bell } from "../../components/Bell";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Phone } from "../../components/Phone";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { PHONE, PHONE_SCALE, type ZoWerktProps } from "../schema";

// Timeline (frames, scene-local).
export const AGENDA_T = {
  week: 4, // week strip, due day circled
  event: 18, // the payment drops onto the due date
  bell: 32, // reminder bell rings on the event
  buddy: 10, // Buddy peeks in next to the phone
};

const BUDDY = 130;

export const AgendaScene: React.FC<{ props: ZoWerktProps["agenda"]; bill: ZoWerktProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const week = pop(frame, fps, AGENDA_T.week, springs.smooth);
  const drop = interpolate(frame, [AGENDA_T.event, AGENDA_T.event + 10], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
  const bell = pop(frame, fps, AGENDA_T.bell, springs.bouncy);
  const t = frame - AGENDA_T.bell;
  const ring = t > 0 ? Math.sin(t / 1.6) * 18 * Math.max(0, 1 - t / 26) : 0;
  const buddy = pop(frame, fps, AGENDA_T.buddy, springs.bouncy);
  const dueIdx = bill.dueDay - props.weekStart;
  const cellW = (PHONE.w - 32 - 40) / 7;
  const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={2} stagger={3} />
      <Stage>
        <div
          style={{
            position: "absolute",
            left: PHONE.x,
            top: PHONE.y + 60,
            transform: `scale(${PHONE_SCALE.agenda})`,
            transformOrigin: "50% 0%",
          }}
        >
        <Phone width={PHONE.w} height={PHONE.h}>
          <div style={{ position: "absolute", inset: 0, fontFamily: fonts.ui, padding: "66px 20px 0" }}>
            <div style={{ fontSize: 34, fontWeight: 650, color: p.ink, paddingLeft: 8 }}>{props.month}</div>
            <div style={{ display: "flex", marginTop: 20, opacity: week }}>
              {props.weekdays.map((d, i) => {
                const isDue = i === dueIdx;
                return (
                  <div key={i} style={{ width: cellW, textAlign: "center" }}>
                    <div style={{ fontSize: 20, color: p.greyText }}>{d}</div>
                    <div
                      style={{
                        margin: "8px auto 0",
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: isDue ? p.blue : "transparent",
                        color: isDue ? p.white : p.ink,
                        fontSize: 22,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {props.weekStart + i}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 18, borderTop: `2px solid ${p.grey}` }} />
            <div style={{ fontSize: 24, fontWeight: 600, color: p.blue, margin: "16px 8px 0" }}>{bill.dueShort}</div>
            <div style={{ position: "relative", marginTop: 10 }}>
              {hours.map((h, i) => (
                <div key={h} style={{ display: "flex", alignItems: "center", height: 76, gap: 12 }}>
                  <div style={{ width: 70, fontSize: 18, color: p.greyText, textAlign: "right" }}>{h}</div>
                  <div style={{ flex: 1, height: 2, background: p.grey }} />
                </div>
              ))}
              {/* The payment event */}
              <div
                style={{
                  position: "absolute",
                  left: 84,
                  right: 8,
                  top: 76 * 1 + 38,
                  height: 150,
                  borderRadius: 22,
                  background: p.blue,
                  color: p.white,
                  padding: "16px 20px",
                  boxSizing: "border-box",
                  opacity: Math.min(1, drop * 2),
                  transform: `translateY(${(1 - drop) * -260}px) scale(${0.9 + 0.1 * drop})`,
                  boxShadow: "0 14px 30px rgba(1, 40, 160, 0.3)",
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 650 }}>{props.eventTitle}</div>
                <div style={{ fontSize: 34, fontWeight: 650, marginTop: 6 }}>{bill.amount}</div>
                <div
                  style={{
                    position: "absolute",
                    left: 20,
                    bottom: -26,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: p.red,
                    color: p.ink,
                    padding: "8px 18px 8px 12px",
                    borderRadius: 26,
                    fontSize: 22,
                    fontWeight: 650,
                    transform: `scale(${frame >= AGENDA_T.bell ? bell : 0})`,
                    transformOrigin: "0% 50%",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 15%" }}>
                    <Bell size={28} color={p.ink} />
                  </div>
                  {props.reminder}
                </div>
              </div>
            </div>
          </div>
        </Phone>
        </div>

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [AGENDA_T.bell + 14])}
          look={{ x: -0.9, y: frame < AGENDA_T.event ? -0.2 : 0.3 }}
          squash={0.8 + 0.2 * buddy}
          style={{
            position: "absolute",
            left: 540 + (PHONE.w / 2) * PHONE_SCALE.agenda + 20,
            top: 620 - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddy * 3),
            transform: `translateX(${(1 - buddy) * 80}px)`,
          }}
        />
      </Stage>
    </SceneBg>
  );
};
