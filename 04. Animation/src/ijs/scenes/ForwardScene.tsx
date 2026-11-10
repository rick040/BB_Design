import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Arrow } from "../../components/CtaPill";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { IceSpray, SkaterBuddy } from "../components/SkaterBuddy";
import type { IjsProps } from "../schema";
import { wordAt } from "../vo";

// Beats, scene-local: global word frame minus the scene start.
export const forwardBeats = (start: number) => ({
  headline: wordAt("stuur") - start - 2, // "STUUR hem door"
  skateIn: wordAt("stuur") - start, // Buddy skates in from the left
  tap: wordAt("door") - start, // "hem DOOR": tap on Doorsturen
  fly: wordAt("door") - start + 4, // mail flies to Buddy
  stop: wordAt("buddy") - start, // "naar BUDDY": hockey stop + catch
});

const FEET = 820;
const BUDDY = 300;

export const ForwardScene: React.FC<{ props: IjsProps["forward"]; bill: IjsProps["bill"]; start: number }> = ({
  props,
  bill,
  start,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const B = forwardBeats(start);

  const cardIn = pop(frame, fps, -6, { damping: 16, stiffness: 160 });
  const tap = interpolate(frame, [B.tap, B.tap + 3, B.tap + 8], [1, 0.9, 1], clamp);
  const fly = interpolate(frame, [B.fly, B.stop + 2], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });

  const skate = interpolate(frame, [B.skateIn, B.stop], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bx = interpolate(skate, [0, 1], [-220, 540]);
  const stroke = Math.sin((frame - B.skateIn) / 3) * 6 * (1 - skate);
  const lean =
    frame < B.stop
      ? 10 + stroke
      : interpolate(frame, [B.stop, B.stop + 4, B.stop + 12], [10, -16, 0], clamp);
  const catchSq = interpolate(frame, [B.stop + 2, B.stop + 5, B.stop + 10], [1, 0.86, 1], clamp);
  const spray = interpolate(frame, [B.stop, B.stop + 16], [0, 1], clamp);

  // mail: from the card position to Buddy's hands (above his head)
  const cx = interpolate(fly, [0, 1], [540, bx + 10]);
  const cy = interpolate(fly, [0, 1], [170, FEET - BUDDY * 1.25 - 60]) - Math.sin(fly * Math.PI) * 120;
  const cs = interpolate(fly, [0, 1], [1, 0.42]);

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={B.headline} stagger={3} />
      <Stage offsetY={60}>
        {/* ice lane */}
        <div style={{ position: "absolute", left: -40, right: -40, top: FEET - 6, height: 60, borderRadius: 30, background: "rgba(255,255,255,0.16)" }} />
        <div style={{ position: "absolute", left: 120, width: 260, top: FEET + 12, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.35)" }} />
        <div style={{ position: "absolute", left: 640, width: 180, top: FEET + 26, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.3)" }} />

        <SkaterBuddy
          size={BUDDY}
          x={bx}
          feetY={FEET}
          body={p.white}
          eye={p.blueMascot}
          beanie={p.blueSoft}
          blade={p.white}
          lean={lean}
          squash={catchSq}
          blink={blinkScale(frame, [B.stop + 14])}
          look={{ x: frame < B.stop ? 0.6 : 0, y: -0.6 }}
        />
        <IceSpray x={bx + 80} y={FEET} progress={spray} color={p.white} dir={-1} />

        {/* the forwarded mail */}
        <div
          style={{
            position: "absolute",
            left: cx - 430,
            top: cy - 110,
            width: 860,
            height: 220,
            borderRadius: 34,
            background: p.card,
            boxSizing: "border-box",
            padding: "30px 40px",
            fontFamily: fonts.ui,
            transform: `scale(${cs * (0.9 + 0.1 * cardIn) * (fly > 0 ? 1 : tap)}) rotate(${fly * -8}deg)`,
            opacity: Math.min(1, cardIn * 2),
            boxShadow: "0 24px 50px rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 600, color: p.ink }}>{bill.sender}</div>
          <div style={{ fontSize: 28, color: p.greyText, marginTop: 6 }}>{bill.subject}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26 }}>
            <div style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: 600, color: p.blue, letterSpacing: "-0.04em" }}>
              {bill.amount}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: p.blue,
                color: p.white,
                fontSize: 30,
                fontWeight: 600,
                padding: "12px 22px 12px 28px",
                borderRadius: 999,
                opacity: interpolate(fly, [0, 0.3], [1, 0], clamp),
                boxShadow: frame >= B.tap && frame < B.tap + 10 ? `0 0 0 ${interpolate(frame, [B.tap, B.tap + 10], [0, 22], clamp)}px rgba(1,59,255,${interpolate(frame, [B.tap, B.tap + 10], [0.35, 0], clamp)})` : undefined,
              }}
            >
              {props.forwardButton}
              <Arrow size={34} />
            </div>
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
