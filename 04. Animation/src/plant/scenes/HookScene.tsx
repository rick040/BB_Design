import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { HousePlant, PLANT_H, POT_BOTTOM } from "../components/HousePlant";
import type { PlantProps } from "../schema";

// Timeline (frames, scene-local).
export const HOOK_T = {
  wiltEnd: 44, // middle plant fully wilted (it is already drooping on frame 0)
  leaf: 30, // a leaf lets go
  leafLen: 22,
  flip: 54, // pot label flips to "Aanmaning"
  flipLen: 8,
  chip: 62, // "Kan uitlopen op €40"
  subline: 70,
};

const SILL_Y = 800;
const XS = [40, 390, 740];
const PLANT_SCALE = 1.12;

export const HookScene: React.FC<{ props: PlantProps["hook"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const wilt = interpolate(frame, [0, HOOK_T.wiltEnd], [0.3, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });
  const leafFall = frame >= HOOK_T.leaf ? Math.min(1, (frame - HOOK_T.leaf) / HOOK_T.leafLen) : -1;
  const flip = interpolate(frame, [HOOK_T.flip, HOOK_T.flip + HOOK_T.flipLen], [0, 1], clamp);
  const s = shake(frame, HOOK_T.flip + 4, 14, 10);
  const chip = pop(frame, fps, HOOK_T.chip, springs.bouncy);
  const breathe = frame > HOOK_T.chip + 14 ? 1 + Math.max(0, Math.sin((frame - HOOK_T.chip - 14) / 5)) * 0.04 : 1;
  const idle = (i: number) => Math.sin(frame / 14 + i * 1.7) * 1.6;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-14} stagger={3} />

      <Stage offsetY={20}>
        {/* Window sill */}
        <div
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            top: SILL_Y,
            height: 34,
            borderRadius: 12,
            background: p.grey,
            boxShadow: "0 14px 0 rgba(1, 30, 140, 0.06)",
          }}
        />

        {props.pots.map((label, i) => {
          const mid = i === 1;
          return (
            <HousePlant
              key={i}
              wilt={mid ? wilt : 0}
              sway={mid ? 0 : idle(i)}
              leafFall={mid ? leafFall : -1}
              leafColor={p.blueMid}
              leafDry={p.greyText}
              stemColor={mid ? (wilt > 0.6 ? p.greyText : p.blueMid) : p.blueMid}
              potColor={p.blue}
              potShade={p.blueMascot}
              label={label}
              labelColor={p.blue}
              labelBg={p.white}
              labelFlip={mid ? flip : 0}
              altLabel={props.alertLabel}
              altColor={p.white}
              altBg={p.red}
              style={{
                left: XS[i],
                top: SILL_Y - PLANT_H + 2 + (PLANT_H - POT_BOTTOM),
                transform: `${mid ? `translate(${s.x}px, ${s.y}px) rotate(${s.r}deg) ` : ""}scale(${PLANT_SCALE})`,
                transformOrigin: "50% 100%",
              }}
            />
          );
        })}

        {/* Cost chip above the wilted plant */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: SILL_Y - PLANT_H * PLANT_SCALE - 30,
            display: "flex",
            justifyContent: "center",
            opacity: frame >= HOOK_T.chip ? Math.min(1, chip * 2) : 0,
            transform: `scale(${(0.5 + 0.5 * chip) * breathe})`,
          }}
        >
          <div
            style={{
              padding: "18px 34px",
              borderRadius: 999,
              background: p.red,
              color: p.white,
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 44,
              letterSpacing: "-0.01em",
              boxShadow: "0 16px 40px rgba(255, 90, 121, 0.35)",
              whiteSpace: "nowrap",
            }}
          >
            {props.costChip}
          </div>
        </div>
      </Stage>

      <Subline text={props.subline} color={p.blue} delay={HOOK_T.subline} />
    </SceneBg>
  );
};
