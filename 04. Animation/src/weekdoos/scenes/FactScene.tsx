import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { NOTA_H, NOTA_W, NotaCard } from "../components/NotaCard";
import { SCENE_STARTS, type WeekdoosProps, wordAt } from "../schema";

// Each slip drops on its spoken sender; the date chips flash on "andere datum".
export const FACT_T = {
  drops: [wordAt("tandarts"), wordAt("fysio"), wordAt("apotheek")].map((f) => f - 4),
  flash: wordAt("andere"),
  flashStagger: 4,
};

const POS = [
  { x: 210, y: 440, r: -5 },
  { x: 540, y: 400, r: 3 },
  { x: 870, y: 450, r: -2 },
];

export const FactScene: React.FC<{ props: WeekdoosProps["fact"]; notas: WeekdoosProps["notas"] }> = ({
  props,
  notas,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={SCENE_STARTS[1] - 4} stagger={3} />
      <Stage>
        {notas.map((n, i) => {
          const d = pop(frame, fps, FACT_T.drops[i], springs.bouncy);
          const fl = interpolate(
            frame,
            [FACT_T.flash + i * FACT_T.flashStagger, FACT_T.flash + i * FACT_T.flashStagger + 10],
            [0, 1],
            clamp,
          );
          const P = POS[i];
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: P.x - NOTA_W / 2,
                top: P.y - NOTA_H / 2 - (1 - d) * 900,
                transform: `rotate(${P.r + (1 - d) * 20}deg) scale(0.98)`,
                opacity: frame < FACT_T.drops[i] ? 0 : 1,
              }}
            >
              <NotaCard sender={n.sender} amount={n.amount} due={n.due} flash={fl} />
            </div>
          );
        })}
      </Stage>
    </SceneBg>
  );
};
