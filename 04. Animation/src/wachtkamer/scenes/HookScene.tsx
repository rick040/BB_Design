import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { pop, shake, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { Board, Chair, NOTA_H, NOTA_W, NotaCard } from "../components/Parts";
import { type WachtkamerProps, wordAt } from "../schema";

// Absolute frames; each nota drops on its spoken word, they crowd on "tegelijk".
export const HOOK_T = {
  nota1: 0,
  nota2: wordAt("fysio") - 4,
  nota3: wordAt("risico") - 6,
  crowd: wordAt("tegelijk") - 2,
  chip: wordAt("tegelijk") + 8,
};

const SEATS = [220, 540, 860];
const CROWD = [470, 540, 610];
const CROWD_ROT = [-9, 3, 11];
const CARD_TOP = 250;

export const HookScene: React.FC<{
  props: WachtkamerProps["hook"];
  notas: WachtkamerProps["notas"];
}> = ({ props, notas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const drops = [HOOK_T.nota1 - 6, HOOK_T.nota2, HOOK_T.nota3];
  const crowd = pop(frame, fps, HOOK_T.crowd, springs.pop);
  const sh = shake(frame, HOOK_T.crowd + 6, 16, 16);
  const chipIn = pop(frame, fps, HOOK_T.chip, springs.bouncy);
  const blink = Math.floor(frame / 8) % 2 === 0;

  return (
    <SceneBg color={p.light}>
      <Headline text={props.headline} color={p.blue} delay={-14} stagger={2} sizeFactor={0.92} />
      <Stage offsetY={70}>
        <div style={{ position: "absolute", left: 540 - 260, top: 0 }}>
          <Board width={520} label={props.boardLabel}>
            <div
              style={{
                textAlign: "center",
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize: 84,
                lineHeight: 1,
                color: p.red,
                opacity: blink ? 1 : 0.25,
              }}
            >
              ? ? ?
            </div>
          </Board>
        </div>

        {SEATS.map((x, i) => (
          <Chair
            key={i}
            width={250}
            color={p.blueSoft}
            style={{ position: "absolute", left: x - 125, top: CARD_TOP + NOTA_H - 20 }}
          />
        ))}

        {notas.map((n, i) => {
          const d = pop(frame, fps, drops[i], springs.bouncy);
          const y = interpolate(d, [0, 1], [-900, 0]);
          const x = SEATS[i] + (CROWD[i] - SEATS[i]) * crowd;
          const rot = (1 - d) * (i - 1) * 14 + CROWD_ROT[i] * crowd;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - NOTA_W / 2 + sh.x * (i - 1),
                top: CARD_TOP + y + sh.y - 30 * crowd,
                transform: `rotate(${rot + sh.r * 4}deg) scale(${0.92 + 0.04 * crowd})`,
                opacity: frame < drops[i] ? 0 : 1,
                zIndex: i === 1 ? 3 : 2,
              }}
            >
              <NotaCard
                sender={n.sender}
                subject={n.subject}
                amount={n.amount}
                due={props.unknownDue}
                urgent={frame >= HOOK_T.crowd + 4}
              />
            </div>
          );
        })}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 790,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, chipIn * 2),
            transform: `scale(${0.5 + 0.5 * chipIn})`,
          }}
        >
          <div
            style={{
              background: p.red,
              color: "#fff",
              fontFamily: fonts.ui,
              fontWeight: 600,
              fontSize: 44,
              padding: "18px 40px",
              borderRadius: 50,
              boxShadow: "0 20px 50px rgba(255, 90, 121, 0.35)",
            }}
          >
            {props.chip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
