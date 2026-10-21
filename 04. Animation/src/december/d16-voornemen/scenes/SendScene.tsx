import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { AppIcon } from "../../../components/AppIcon";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { SceneBg, Stage } from "../../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { MailRow } from "../../d04-rijm/parts";
import { DHeadline, DSubline } from "../../text";
import { dec, decFonts, decTracking } from "../../theme";
import { useLayout } from "../../../lib/layout";
import { goalCardHeight, GoalCard, GoalRow } from "../GoalRow";
import type { VoornemenProps } from "../schema";

// Beats (frames, scene-lokaal).
export const SEND_T = {
  card: 12, // kaart met vier balken schuift in, onderste rij is "Rekeningen op tijd"
  mail: 32, // de mail verschijnt met het label "Doorsturen"
  fly: 52, // de mail vliegt naar Buddy
  flyLen: 14,
  swallow: 66, // Buddy neemt hem in
  bar: 70, // balk springt naar 100 %
  barLen: 22,
  check: 90, // het vinkje tekent zich
  agenda: 96, // agenda-item met seintjes
  sub: 102,
};

const CARD_W = 900;
const BUDDY = 220;
const CARD_TOP = 0;
const K = 1.15;
const FLOW_Y = 650;

export const SendScene: React.FC<{ props: VoornemenProps["send"]; goals: VoornemenProps["goals"] }> = ({ props, goals }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const cardIn = pop(frame, fps, SEND_T.card, springs.smooth);
  const mailIn = pop(frame, fps, SEND_T.mail, springs.pop);
  const fly = interpolate(frame, [SEND_T.fly, SEND_T.fly + SEND_T.flyLen], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const swallow = interpolate(
    frame,
    [SEND_T.swallow, SEND_T.swallow + 5, SEND_T.swallow + 10, SEND_T.swallow + 16],
    [1, 0.84, 1.08, 1],
    clamp,
  );
  const bar = interpolate(frame, [SEND_T.bar, SEND_T.bar + SEND_T.barLen], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.back(1.4)),
  });
  const barClamped = Math.min(1, bar);
  const check = interpolate(frame, [SEND_T.check, SEND_T.check + 12], [0, 1], clamp);
  const agendaIn = pop(frame, fps, SEND_T.agenda, springs.pop);
  const buddyIn = pop(frame, fps, 10, springs.bouncy);
  const happy = frame >= SEND_T.swallow ? 0.2 : blinkScale(frame, [36]);

  // De mail gaat van links naar Buddy en krimpt onderweg.
  const mailX = interpolate(fly, [0, 1], [90, 720]);
  const mailY = interpolate(fly, [0, 1], [FLOW_Y, FLOW_Y + 40]) - Math.sin(fly * Math.PI) * 60;
  const mailScale = interpolate(fly, [0, 1], [1, 0.25]);
  const mailVisible = frame >= SEND_T.mail && frame < SEND_T.fly + SEND_T.flyLen;

  const rows = [...goals.map((g) => ({ label: g.label, pct: g.pct })), { label: props.goalLabel, pct: 100 }];

  return (
    <SceneBg color={p.blue}>
      <DHeadline text={props.headline} color={p.white} delay={6} stagger={4} sizeFactor={L.tall ? 1 : 1.2} />
      <Stage offsetY={20}>
        <GoalCard
          width={CARD_W}
          k={K}
          style={{
            position: "absolute",
            left: 90,
            top: CARD_TOP,
            opacity: Math.min(1, cardIn * 2),
            transform: `translateY(${(1 - cardIn) * 50}px)`,
          }}
        >
          {rows.map((r, i) => {
            const last = i === rows.length - 1;
            return (
              <GoalRow
                key={i}
                label={r.label}
                shown={last ? 100 * barClamped : r.pct}
                fill={last ? 100 * bar : r.pct}
                width={CARD_W - 80 * K}
                k={K}
                highlight={last}
                check={last ? check : 0}
                opacity={last ? 1 : 0.6}
              />
            );
          })}
        </GoalCard>

        {mailVisible ? (
          <div
            style={{
              position: "absolute",
              left: mailX,
              top: mailY,
              transform: `scale(${mailScale * (0.6 + 0.4 * Math.min(1, mailIn))})`,
              transformOrigin: "0 50%",
              opacity: Math.min(1, mailIn * 2),
            }}
          >
            <MailRow sender={props.sender} subject={props.subject} tag={props.due} width={620} highlight />
            <div
              style={{
                position: "absolute",
                left: 30,
                top: -62,
                background: p.white,
                color: p.blue,
                borderRadius: 999,
                padding: "10px 24px",
                fontFamily: decFonts.display,
                fontWeight: 500,
                letterSpacing: decTracking,
                fontSize: 36,
                opacity: 1 - fly,
              }}
            >
              {props.forwardLabel}
            </div>
          </div>
        ) : null}

        {frame >= SEND_T.agenda ? (
          <div
            style={{
              position: "absolute",
              left: 90,
              top: FLOW_Y - 20,
              width: 680,
              borderRadius: 40,
              background: p.white,
              boxShadow: "0 20px 50px rgba(0, 20, 120, 0.25)",
              padding: "26px 34px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              gap: 24,
              transform: `scale(${0.8 + 0.2 * agendaIn})`,
              transformOrigin: "0 50%",
              opacity: Math.min(1, agendaIn * 2),
            }}
          >
            <AppIcon size={104} circle={false} />
            <div>
              <div style={{ fontFamily: decFonts.ui, fontWeight: 600, fontSize: 42, color: dec.blue }}>{props.agendaTitle}</div>
              <div style={{ fontFamily: decFonts.ui, fontWeight: 400, fontSize: 30, color: dec.greyText, marginTop: 4 }}>
                {props.sender} · {props.due}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: decFonts.ui, fontWeight: 600, fontSize: 30, color: dec.deep, marginTop: 8 }}>
                <svg width={26} height={30} viewBox="0 0 26 30">
                  <path d="M5 2v26" stroke={dec.blue} strokeWidth={4} strokeLinecap="round" />
                  <path d="M5 4h18l-5 6 5 6H5z" fill={dec.blue} />
                </svg>
                {props.agendaSub}
              </div>
            </div>
          </div>
        ) : null}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={happy}
          squash={swallow * (0.6 + 0.4 * Math.min(1, buddyIn))}
          look={{ x: -0.5, y: 0.2 }}
          style={{
            position: "absolute",
            left: 790,
            top: CARD_TOP + goalCardHeight(4, K) + 20 + 220 - BUDDY * BUDDY_RATIO,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
      </Stage>
      <DSubline text={props.subline} color={p.blueText} delay={SEND_T.sub} />
    </SceneBg>
  );
};
