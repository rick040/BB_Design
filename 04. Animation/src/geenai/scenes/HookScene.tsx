import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { AiOrb } from "../components/AiOrb";
import { Chip } from "../components/Chip";
import { DOC_H, DOC_W, InvoiceDoc } from "../components/InvoiceDoc";
import { type GeenAiProps, wordAt } from "../schema";

// Absolute frames. The myth: an "AI" orb scans the whole bill.
export const HOOK_T = {
  scan: 0, // scan beam already sweeping on frame 0
  orbPulse: wordAt("AI"), // orb flares on the spoken "AI"
  chip: wordAt("rekeningen") - 4, // "Mythe?" chip
};

const DOC_X = (1080 - DOC_W) / 2;
const DOC_Y = 60;

export const HookScene: React.FC<{ props: GeenAiProps["hook"]; invoice: GeenAiProps["invoice"] }> = ({ props, invoice }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Beam sweeps top to bottom, twice per second-and-a-half.
  const beamY = ((frame * 18) % (DOC_H + 200)) - 120;
  const pulse = interpolate(frame, [HOOK_T.orbPulse, HOOK_T.orbPulse + 6, HOOK_T.orbPulse + 20], [0, 1, 0], clamp);
  const bob = Math.sin(frame / 9) * 10;
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.bouncy);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-22} stagger={2} sizeFactor={0.84} />
      <Stage offsetY={10}>
        <div style={{ position: "absolute", inset: 0, transform: "scale(1.12)", transformOrigin: "50% 0%" }}>
        <InvoiceDoc invoice={invoice} style={{ left: DOC_X, top: DOC_Y }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: beamY,
              height: 120,
              background: `linear-gradient(180deg, rgba(79,209,217,0) 0%, rgba(79,209,217,0.45) 70%, ${p.teal} 100%)`,
            }}
          />
          <div style={{ position: "absolute", inset: 0, background: `rgba(79,209,217,${0.06 + 0.12 * pulse})` }} />
        </InvoiceDoc>
        {/* scan cone from the orb onto the bill */}
        <svg width={1080} height={900} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <polygon
            points={`${870},${40 + bob} ${DOC_X + 60},${DOC_Y + DOC_H * 0.25} ${DOC_X + DOC_W - 30},${DOC_Y + DOC_H}`}
            fill={p.teal}
            opacity={0.14 + 0.16 * pulse}
          />
        </svg>
        <AiOrb size={190 * (1 + 0.12 * pulse)} label={props.orbLabel} glow={1 + pulse} style={{ left: 870 - 95 * (1 + 0.12 * pulse), top: -60 + bob - 95 * 0.12 * pulse }} />
        <Chip
          text={props.mythChip}
          bg={p.yellow}
          color={p.ink}
          style={{ left: DOC_X - 40, top: -10, transform: `rotate(-6deg) scale(${chipIn})`, transformOrigin: "0% 50%" }}
        />
        </div>
      </Stage>
    </SceneBg>
  );
};
