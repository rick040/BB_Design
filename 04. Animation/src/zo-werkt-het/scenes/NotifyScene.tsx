import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Phone } from "../../components/Phone";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { CalendarIcon } from "../components/CalendarIcon";
import { PHONE, PHONE_SCALE, type ZoWerktProps } from "../schema";

// Timeline (frames, scene-local).
export const NOTIFY_T = {
  slide: 12, // the agenda notification slides in on the lock screen
  buzz: 24, // phone buzzes
  buzzLen: 12,
  subline: 34, // "Jij kiest wanneer."
};

export const NotifyScene: React.FC<{ props: ZoWerktProps["notify"]; bill: ZoWerktProps["bill"] }> = ({
  props,
  bill,
}) => {
  const frame = useCurrentFrame();
  const p = usePalette();
  const slide = interpolate(frame, [NOTIFY_T.slide, NOTIFY_T.slide + 12], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.3)) });
  const tb = frame - NOTIFY_T.buzz;
  const buzz = tb >= 0 && tb <= NOTIFY_T.buzzLen ? Math.sin(tb * 2.6) * 6 * (1 - tb / NOTIFY_T.buzzLen) : 0;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={2} stagger={3} />
      <Stage offsetY={40}>
        <div
          style={{
            position: "absolute",
            left: PHONE.x,
            top: PHONE.y,
            transform: `translateX(${buzz}px) rotate(${buzz * 0.2}deg) scale(${PHONE_SCALE.notify})`,
            transformOrigin: "50% 0%",
          }}
        >
        <Phone width={PHONE.w} height={PHONE.h} screen={p.blueMascot}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontFamily: fonts.ui, color: p.white }}>
            <div style={{ fontSize: 26, opacity: 0.85 }}>{props.date}</div>
            <div style={{ fontSize: 120, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05 }}>{props.clock}</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              top: 330,
              borderRadius: 34,
              background: "rgba(255,255,255,0.96)",
              padding: "18px 18px",
              display: "flex",
              gap: 14,
              alignItems: "center",
              fontFamily: fonts.ui,
              boxShadow: "0 18px 40px rgba(0, 10, 60, 0.3)",
              opacity: Math.min(1, slide * 2),
              transform: `translateY(${(1 - slide) * -300}px)`,
            }}
          >
            <CalendarIcon size={64} day={String(bill.dueDay)} band={p.blue} ink={p.ink} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 24, fontWeight: 600, color: p.ink }}>{props.appName}</span>
                <span style={{ fontSize: 20, color: p.greyText }}>{props.time}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 650, color: p.ink, marginTop: 4, lineHeight: 1.2 }}>{props.line1}</div>
              <div style={{ fontSize: 22, color: "#4a4a55", marginTop: 2 }}>{props.line2}</div>
            </div>
          </div>
        </Phone>
        </div>
      </Stage>
      <Subline text={props.subline} color={p.white} delay={NOTIFY_T.subline} />
    </SceneBg>
  );
};
