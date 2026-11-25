import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Chip, Keyring } from "../components/Keyring";
import { type SleutelbosProps, wordAt } from "../schema";

// Beats are absolute frames on the voice-over.
export const HOOK_T = {
  lockIn: 4, // the dark "Koppeling" lock is already there
  chip: wordAt("sleutelbos"), // "Alle sleutels?"
  handOver: wordAt("afgeven"), // the whole key ring flies into the lock
  handOverLen: 22,
};

const LOCK = { x: 850, y: 680, size: 250 };
const RING = 1.35; // key ring scale in the hook

export const HookScene: React.FC<{ props: SleutelbosProps["hook"]; keys: string[] }> = ({ props, keys }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const u = interpolate(frame, [HOOK_T.handOver, HOOK_T.handOver + HOOK_T.handOverLen], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  // Ring centre travels from (400, 110) to the keyhole.
  const ringX = interpolate(u, [0, 1], [420, LOCK.x]);
  const ringY = interpolate(u, [0, 1], [40, LOCK.y]) - Math.sin(u * Math.PI) * 160;
  const swing = 7 * Math.sin(frame / 8) + interpolate(u, [0, 0.5, 1], [0, -25, 0]);
  const lockPulse = interpolate(
    frame,
    [HOOK_T.handOver + HOOK_T.handOverLen - 2, HOOK_T.handOver + HOOK_T.handOverLen + 3, HOOK_T.handOver + HOOK_T.handOverLen + 10],
    [1, 1.12, 1],
    clamp,
  );
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.pop);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-8} stagger={2} />
      <Stage offsetY={60}>
        {/* the lock: a dark tile with a keyhole */}
        <div
          style={{
            position: "absolute",
            left: LOCK.x - LOCK.size / 2,
            top: LOCK.y - LOCK.size / 2,
            width: LOCK.size,
            height: LOCK.size,
            borderRadius: 52,
            background: p.red,
            transform: `scale(${lockPulse})`,
            boxShadow: "0 24px 60px rgba(17, 24, 39, 0.25)",
          }}
        >
          <svg viewBox="0 0 100 100" width={LOCK.size} height={LOCK.size}>
            <circle cx={50} cy={40} r={13} fill="#ffffff" />
            <path d="M44 48 L56 48 L61 74 L39 74 Z" fill="#ffffff" />
          </svg>
          <div
            style={{
              position: "absolute",
              top: LOCK.size + 16,
              left: -40,
              right: -40,
              textAlign: "center",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 36,
              color: p.red,
            }}
          >
            {props.lock}
          </div>
        </div>
        <Keyring
          tags={keys}
          swing={swing}
          tagsIn={1 - u * 0.8}
          style={{
            left: ringX - 300,
            top: ringY - 70,
            transform: `scale(${RING * (1 - 0.8 * u)}) rotate(${-30 * u}deg)`,
            transformOrigin: "300px 70px",
            opacity: u < 0.95 ? 1 : interpolate(u, [0.95, 1], [1, 0], clamp),
          }}
        />
        <Chip
          text={props.chip}
          style={{
            left: 90,
            top: 860,
            transform: `scale(${chipIn}) rotate(${-4 * chipIn}deg)`,
            transformOrigin: "50% 50%",
            opacity: Math.min(1, chipIn * 2),
          }}
        />
      </Stage>
    </SceneBg>
  );
};
