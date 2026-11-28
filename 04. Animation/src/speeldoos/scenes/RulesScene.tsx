import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { BOX_W, crankKnob, MusicBox, Note, PunchStrip } from "../components/MusicBox";
import { SCENE_STARTS, type SpeeldoosProps, wordAt } from "../schema";

const S = SCENE_STARTS[2];
// Each field pops out of the box on the word that names it.
export const RULES_T = {
  crank: S + 2, // Buddy starts turning
  f1: wordAt("bedrag"),
  f2: wordAt("vervaldatum"),
  f3: wordAt("betaallink"),
  f4: wordAt("elke"),
  same: wordAt("hetzelfde"), // subline "Zelfde mail? Zelfde uitkomst."
};

const FLOOR = 860;
const BOX_X = (1080 - BOX_W) / 2 - 50;
const BOX_Y = FLOOR - 240;
const BUDDY = 180;

const CARD_W = 460;
const CARD_H = 170;
const SLOTS = [
  { x: 60, y: 40 },
  { x: 560, y: 40 },
  { x: 60, y: 240 },
  { x: 560, y: 240 },
];

export const RulesScene: React.FC<{ props: SpeeldoosProps["rules"] }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const turning = Math.max(0, frame - RULES_T.crank);
  const crank = -90 + turning * 12; // one turn per second
  const knob = crankKnob(crank);
  const beats = [RULES_T.f1, RULES_T.f2, RULES_T.f3, RULES_T.f4];
  const squash = 1 + 0.06 * Math.sin((crank * Math.PI) / 180);

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={S - 2} stagger={2} />
      <Stage offsetY={-20}>
        {/* field cards: each one pops up out of the box and lands in its slot */}
        {props.fields.map((f, i) => {
          const s = pop(frame, fps, beats[i], springs.pop);
          if (frame < beats[i]) return null;
          const slot = SLOTS[i];
          const fromX = BOX_X + BOX_W / 2 - CARD_W / 2;
          const fromY = BOX_Y - 80;
          const x = interpolate(s, [0, 1], [fromX, slot.x]);
          const y = interpolate(s, [0, 1], [fromY, slot.y]);
          const check = interpolate(frame, [beats[i] + 6, beats[i] + 14], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: CARD_W,
                height: CARD_H,
                borderRadius: 32,
                background: p.white,
                boxShadow: "0 18px 50px rgba(1,59,255,0.14)",
                transform: `scale(${0.4 + 0.6 * Math.min(1, s)})`,
                opacity: Math.min(1, s * 2.5),
                display: "flex",
                alignItems: "center",
                padding: "0 30px",
                boxSizing: "border-box",
                gap: 22,
                zIndex: 2,
              }}
            >
              <div style={{ width: 74, height: 74, borderRadius: "50%", background: p.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Checkmark size={40} color={p.white} progress={check} strokeWidth={16} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div style={{ fontFamily: fonts.ui, fontSize: 34, color: "#7d7b82", fontWeight: 500 }}>{f.label}</div>
                <div style={{ fontFamily: fonts.ui, fontSize: 52, color: p.ink, fontWeight: 600, whiteSpace: "nowrap" }}>{f.value}</div>
              </div>
            </div>
          );
        })}

        {/* notes float up from the box on every beat */}
        {beats.map((b, i) => {
          const t = frame - b;
          if (t < 0 || t > 40) return null;
          const u = t / 40;
          return (
            <Note
              key={i}
              size={56}
              color={i % 2 ? p.blueMid : p.yellow}
              style={{
                left: BOX_X + 120 + i * 80 + Math.sin(t / 5) * 18,
                top: BOX_Y - 120 - u * 200,
                opacity: 1 - u,
                transform: `rotate(${Math.sin(t / 6) * 15}deg)`,
              }}
            />
          );
        })}

        {/* the bill, as a punched strip, feeding into the slot */}
        <PunchStrip
          width={BOX_X + 10 + 60}
          color="#dfe6ff"
          hole={p.blue}
          offset={turning * 4}
          style={{ left: -60, top: BOX_Y + 154 }}
        />
        <div style={{ position: "absolute", left: BOX_X, top: BOX_Y }}>
          <MusicBox lid={1} crank={crank} phase={turning * 6} body={p.blue} face={p.blueSoft} inside="#0a2bb8" accent={p.yellow} />
        </div>
        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          squash={squash}
          look={{ x: -0.6, y: 0.5 }}
          style={{
            position: "absolute",
            left: BOX_X + knob.x + 20,
            top: FLOOR - BUDDY * BUDDY_RATIO,
          }}
        />
        {/* Buddy's "arm": a short line from Buddy to the crank knob */}
        <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
          <line
            x1={BOX_X + knob.x + 20 + 20}
            y1={FLOOR - BUDDY * BUDDY_RATIO * 0.5}
            x2={BOX_X + knob.x}
            y2={BOX_Y + knob.y}
            stroke={p.blueMascot}
            strokeWidth={14}
            strokeLinecap="round"
          />
        </svg>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={RULES_T.same} />
    </SceneBg>
  );
};
