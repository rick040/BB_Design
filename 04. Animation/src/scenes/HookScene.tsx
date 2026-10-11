import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../components/Stage";
import { Headline } from "../components/Text";
import { clamp, pop, pushedSlots, shake, springs } from "../lib/anim";
import { usePalette } from "../lib/palette";
import type { AdProps } from "../schema";
import { fonts } from "../theme";

// Generic senders only, no third-party logos or brand names.
const MAILS = [
  { from: "Webshop", subject: "Sale: -50% op alles", time: "08:02" },
  { from: "Zorgverzekeraar", subject: "Je nota staat klaar", time: "08:15" },
  { from: "Nieuwsbrief", subject: "Dit wil je niet missen", time: "08:31" },
  { from: "Telefoonprovider", subject: "Factuur september", time: "08:47" },
  { from: "Pakketdienst", subject: "Je pakket is onderweg", time: "09:03" },
  { from: "Gemeente", subject: "Aanslag gemeentelijke belastingen", time: "09:12" },
  { from: "Sportschool", subject: "Je lidmaatschap", time: "09:20" },
  { from: "Energieleverancier", subject: "Je factuur van oktober", time: "09:41" },
  { from: "Netwerk", subject: "5 nieuwe uitnodigingen", time: "09:58" },
  { from: "Bank", subject: "Je maandoverzicht", time: "10:06" },
  { from: "Verhuurder", subject: "Huur november", time: "10:19" },
  { from: "Webshop", subject: "Laatste kans!", time: "10:24" },
  { from: "Incassobureau", subject: "Herinnering: openstaand bedrag", time: "10:30" },
];

// Mails arrive faster and faster. The first ones are already there on
// frame 0 so the opening frame (and the Reel cover) is never empty.
const ARRIVALS = [-30, -20, 6, 13, 19, 24, 28, 32, 35, 38, 41, 43, 45];
const ROW_H = 118;
const SLAM = 58;

const avatarTint = ["#e8edf2", "#dfe6ff", "#e8edf2", "#cfdbff"];

export const HookScene: React.FC<{ props: AdProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const countFrom = ARRIVALS[2];
  const countTo = ARRIVALS[ARRIVALS.length - 1] + 4;
  const count = Math.round(
    interpolate(frame, [countFrom, countTo], [12, 99], {
      ...clamp,
      easing: Easing.in(Easing.quad),
    }),
  );
  const counting = frame >= countFrom && frame < countTo;
  const badgeBump = counting ? 1 + 0.08 * Math.abs(Math.sin(frame * 0.9)) : 1;
  const slam = pop(frame, fps, SLAM, { damping: 12, stiffness: 220, mass: 0.6 });
  const s = shake(frame, SLAM + 3, 14, 16);
  const dim = interpolate(frame, [SLAM, SLAM + 8], [0, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg)`,
        }}
      >
        <Headline text={props.headline} color={p.blue} delay={-6} stagger={3} />

        <Stage offsetY={40}>
          {/* Inbox card */}
          <div
            style={{
              position: "absolute",
              left: 130,
              top: 20,
              width: 820,
              height: 1000,
              borderRadius: 56,
              background: p.white,
              boxShadow: "0 30px 80px rgba(1, 40, 160, 0.10)",
              overflow: "hidden",
              transform: `scale(${1 - dim * 0.04})`,
              filter: `blur(${dim * 3}px)`,
              WebkitMaskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, #000 70%, transparent 100%)",
            }}
          >
            {/* Header */}
            <div
              style={{
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 44px",
                fontFamily: fonts.ui,
              }}
            >
              <span style={{ fontSize: 48, fontWeight: 600, color: p.ink, letterSpacing: "-0.01em" }}>
                {props.inboxTitle}
              </span>
              <span
                style={{
                  minWidth: 96,
                  height: 64,
                  padding: "0 20px",
                  boxSizing: "border-box",
                  borderRadius: 32,
                  background: p.red,
                  color: "#fff",
                  fontSize: 36,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${badgeBump})`,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {count >= 99 ? "99+" : count}
              </span>
            </div>

            {/* Mail rows */}
            <div style={{ position: "absolute", top: 120, left: 0, right: 0, bottom: 0, overflow: "hidden" }}>
              {MAILS.map((m, i) => {
                const arrive = ARRIVALS[i];
                if (frame < arrive - 1) return null;
                const enter = pop(frame, fps, arrive, { damping: 18, stiffness: 170 });
                const slots = pushedSlots(frame, fps, ARRIVALS, i);
                const y = slots * ROW_H - (1 - enter) * ROW_H;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      height: ROW_H,
                      transform: `translateY(${y}px)`,
                      opacity: enter,
                      display: "flex",
                      alignItems: "center",
                      gap: 26,
                      padding: "0 44px",
                      fontFamily: fonts.ui,
                      borderTop: `2px solid ${p.grey}`,
                    }}
                  >
                    <div
                      style={{
                        width: 76,
                        height: 76,
                        borderRadius: "50%",
                        background: avatarTint[i % avatarTint.length],
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 34,
                        fontWeight: 600,
                        color: p.blueMid,
                        flexShrink: 0,
                      }}
                    >
                      {m.from[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 33, fontWeight: 600, color: p.ink }}>{m.from}</span>
                        <span style={{ fontSize: 26, color: p.greyText }}>{m.time}</span>
                      </div>
                      <div
                        style={{
                          fontSize: 28,
                          color: p.greyText,
                          marginTop: 4,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {m.subject}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: p.blue,
                        flexShrink: 0,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* "Laatste aanmaning" card (02. Elements/Asset 33) slams on top */}
          {frame >= SLAM - 1 ? (
            <div
              style={{
                position: "absolute",
                left: 70,
                top: 400,
                width: 940,
                height: 210,
                borderRadius: 44,
                background: p.blue,
                display: "flex",
                alignItems: "center",
                gap: 34,
                padding: "0 48px",
                boxSizing: "border-box",
                fontFamily: fonts.ui,
                color: "#fff",
                boxShadow: "0 40px 90px rgba(1, 40, 200, 0.45)",
                opacity: Math.min(1, slam * 2),
                transform: `scale(${interpolate(slam, [0, 1], [1.6, 1])}) rotate(${interpolate(slam, [0, 1], [-9, -3])}deg)`,
              }}
            >
              <div
                style={{
                  width: 116,
                  height: 116,
                  borderRadius: "50%",
                  background: p.blueSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 72,
                  color: p.blue,
                }}
              >
                !
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 52, fontWeight: 500, letterSpacing: "0.01em" }}>
                  {props.warningTitle}
                </div>
                <div style={{ fontSize: 30, opacity: 0.85, marginTop: 6, letterSpacing: "0.02em" }}>
                  {props.warningSubtitle}
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  right: -18,
                  top: -30,
                  height: 76,
                  padding: "0 26px",
                  borderRadius: 38,
                  background: p.red,
                  color: "#fff",
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 44,
                  letterSpacing: "-0.03em",
                  display: "flex",
                  alignItems: "center",
                  boxShadow: "0 12px 30px rgba(255, 60, 100, 0.45)",
                  transform: `scale(${pop(frame, fps, SLAM + 6, springs.bouncy)}) rotate(6deg)`,
                }}
              >
                {props.warningBadge}
              </div>
            </div>
          ) : null}
        </Stage>
      </div>
    </SceneBg>
  );
};
