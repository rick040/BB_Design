import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../../components/Buddy";
import { SceneBg, Stage } from "../../../components/Stage";
import { blinkScale, clamp, pop, springs } from "../../../lib/anim";
import { usePalette } from "../../../lib/palette";
import { DHeadline, DSubline } from "../../text";
import { useLayout } from "../../../lib/layout";
import { dec, decFonts } from "../../theme";
import { GoalCard, goalCardHeight, GoalRow } from "../GoalRow";
import type { VoornemenProps } from "../schema";

// Beats (frames, scene-lokaal).
export const HOOK_T = {
  card: -8, // kaart met de drie voornemens staat er al op frame 0
  buddy: 10, // Buddy komt erbij zitten
  fill: 14, // balken lopen naar 3 %, 1 % en 0 %
  fillStagger: 6,
  fillLen: 26,
  sigh: 62, // Buddy zucht
  sighLen: 16,
  sub: 48, // "Herkenbaar, toch?"
};

const CARD_W = 900;
const BUDDY = 230;
const K = 1.4;

export const HookScene: React.FC<{ props: VoornemenProps["hook"]; goals: VoornemenProps["goals"] }> = ({ props, goals }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();

  const cardIn = pop(frame, fps, HOOK_T.card, springs.smooth);
  const buddyIn = pop(frame, fps, HOOK_T.buddy, springs.bouncy);
  const sigh = interpolate(
    frame,
    [HOOK_T.sigh, HOOK_T.sigh + 6, HOOK_T.sigh + HOOK_T.sighLen],
    [1, 0.88, 1],
    clamp,
  );
  const sad = interpolate(frame, [HOOK_T.sigh, HOOK_T.sigh + 8], [1, 0.5], clamp);
  const blink = frame > HOOK_T.sigh ? sad : blinkScale(frame, [40]);

  return (
    <SceneBg color={p.light}>
      <DHeadline text={props.headline} color={p.blue} delay={-14} stagger={3} sizeFactor={L.tall ? 1 : 1.15} />
      <Stage offsetY={10}>
        <GoalCard
          width={CARD_W}
          k={K}
          style={{
            position: "absolute",
            left: 90,
            top: 20,
            opacity: Math.min(1, cardIn * 2),
            transform: `translateY(${(1 - cardIn) * 40}px)`,
          }}
        >
          {goals.map((g, i) => {
            const t = interpolate(frame, [HOOK_T.fill + i * HOOK_T.fillStagger, HOOK_T.fill + i * HOOK_T.fillStagger + HOOK_T.fillLen], [0, 1], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            });
            return <GoalRow key={i} k={K} label={g.label} shown={g.pct * t} fill={g.pct * t} width={CARD_W - 80 * K} />;
          })}
        </GoalCard>
        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          blink={blink}
          squash={sigh * (0.6 + 0.4 * Math.min(1, buddyIn))}
          look={{ x: -0.5, y: 0.4 }}
          style={{
            position: "absolute",
            left: 740,
            top: 20 + goalCardHeight(goals.length, K) + 40 + 190 - BUDDY * BUDDY_RATIO + 30,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
        {/* De datum van het hele verhaal: 4 januari. */}
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 20 + goalCardHeight(goals.length, K) + 40,
            width: 230,
            borderRadius: 36,
            overflow: "hidden",
            background: p.white,
            boxShadow: "0 20px 50px rgba(1, 40, 160, 0.16)",
            textAlign: "center",
            opacity: Math.min(1, cardIn * 2),
          }}
        >
          <div style={{ background: dec.deep, color: dec.white, fontFamily: decFonts.display, fontSize: 38, padding: "10px 0" }}>jan</div>
          <div style={{ color: p.blue, fontFamily: decFonts.display, fontSize: 130, lineHeight: 1.1, paddingBottom: 6 }}>4</div>
        </div>
      </Stage>
      <DSubline text={props.subline} color={p.blue} delay={HOOK_T.sub} />
    </SceneBg>
  );
};
