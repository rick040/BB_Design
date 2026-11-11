import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { AgendaCard, Board, CallButton, FlapRow } from "../components/Parts";
import { SCENE_STARTS, type WachtkamerProps, wordAt } from "../schema";

const S = SCENE_STARTS[2];
// Headline words land on "En je bent op tijd aan de beurt"; Buddy hits the
// call button on "beurt", the board flips to the called nota, and the
// agenda card drops in on "agenda".
export const CALL_T = {
  flip: wordAt("tijd") - 4,
  press: wordAt("beurt") - 3,
  rings: wordAt("beurt"),
  agenda: wordAt("agenda") - 4,
  subline: wordAt("agenda") + 6,
};
const SPOKEN = [wordAt("je"), wordAt("bent"), wordAt("op"), wordAt("tijd"), wordAt("aan"), wordAt("de", 2), wordAt("beurt")];

const BUDDY = 170;
const BTN = { x: 860, y: 420 };

export const CallScene: React.FC<{
  props: WachtkamerProps["call"];
  notas: WachtkamerProps["notas"];
}> = ({ props, notas }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const called = notas[props.calledIndex];

  const lines = props.headline.split("\n").map((l) => l.split(/\s+/).filter(Boolean));
  let wi = 0;

  const press = interpolate(frame, [CALL_T.press - 2, CALL_T.press, CALL_T.press + 6], [0, 1, 0], clamp);
  const hop = interpolate(frame, [CALL_T.press - 10, CALL_T.press - 3, CALL_T.press], [0, -70, 0], clamp);
  const squash =
    interpolate(frame, [CALL_T.press - 12, CALL_T.press - 9], [1, 0.85], clamp) *
      interpolate(frame, [CALL_T.press - 9, CALL_T.press - 4], [1, 1.25], clamp) *
      interpolate(frame, [CALL_T.press, CALL_T.press + 3, CALL_T.press + 9], [1, 0.7, 1], clamp) /
    interpolate(frame, [CALL_T.press - 4, CALL_T.press], [1, 1.25], clamp);
  const ring = (k: number) => interpolate(frame, [CALL_T.rings + k * 5, CALL_T.rings + k * 5 + 20], [0, 1], clamp);
  const glow = interpolate(frame, [CALL_T.rings, CALL_T.rings + 4, CALL_T.rings + 30], [0, 1, 0.35], clamp);
  const agendaIn = pop(frame, fps, CALL_T.agenda, springs.bouncy);
  const bell = interpolate(frame, [CALL_T.agenda + 6, CALL_T.agenda + 36], [0, 1], clamp);

  return (
    <SceneBg color={p.light}>
      <div
        style={{
          position: "absolute",
          top: L.safeTop,
          left: L.sidePadding,
          right: L.sidePadding,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: L.headlineSize,
          lineHeight: 1.0,
          letterSpacing: headlineTracking,
          color: p.blue,
        }}
      >
        {lines.map((words, li) => (
          <div key={li}>
            {words.map((w, i) => {
              const at = SPOKEN[wi] ?? SPOKEN[SPOKEN.length - 1];
              wi++;
              const s = pop(frame, fps, at - 3, springs.pop);
              return (
                <React.Fragment key={i}>
                  <span
                    style={{
                      display: "inline-block",
                      opacity: Math.min(1, s * 1.4),
                      transform: `translateY(${(1 - s) * 0.4}em) scale(${0.85 + 0.15 * s})`,
                      filter: `blur(${Math.max(0, 1 - s) * 10}px)`,
                    }}
                  >
                    {w}
                  </span>{" "}
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>

      <Stage>
        {[0, 1, 2].map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: 430 - 300,
              top: 150 - 150,
              width: 600,
              height: 300,
              borderRadius: 60,
              border: `6px solid ${p.yellow}`,
              opacity: ring(k) > 0 && ring(k) < 1 ? (1 - ring(k)) * 0.8 : 0,
              transform: `scale(${1 + ring(k) * 0.35})`,
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 430 - 340, top: 10 }}>
          <Board width={680} label={props.boardLabel} glow={glow}>
            <FlapRow text={called.sender} prev="???" frame={frame} start={CALL_T.flip} tileW={58} tileH={88} />
            <div style={{ height: 10 }} />
            <FlapRow
              text={called.amount}
              prev=""
              frame={frame}
              start={CALL_T.flip + 6}
              tileW={42}
              tileH={64}
            />
          </Board>
        </div>

        <CallButton
          size={180}
          press={press}
          style={{ position: "absolute", left: BTN.x - 90, top: BTN.y }}
        />
        <Buddy
          size={BUDDY}
          body={p.blue}
          eye={p.white}
          blink={frame > CALL_T.rings + 6 && frame < CALL_T.rings + 30 ? 0.18 : blinkScale(frame, [S + 20])}
          squash={squash}
          look={frame < CALL_T.rings ? { x: 0, y: 0.9 } : { x: -0.9, y: -0.6 }}
          style={{
            position: "absolute",
            left: BTN.x - BUDDY / 2,
            top: BTN.y + 40 - BUDDY * BUDDY_RATIO + hop,
            transformOrigin: "50% 100%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 540 - 430,
            top: 630,
            opacity: Math.min(1, agendaIn * 2),
            transform: `translateY(${(1 - agendaIn) * 160}px) scale(${0.8 + 0.2 * agendaIn})`,
          }}
        >
          <AgendaCard
            day={props.agendaDay}
            month={props.agendaMonth}
            title={props.agendaTitle}
            note={props.agendaNote}
            bell={bell}
          />
        </div>
      </Stage>
      <Subline text={props.subline} color={p.blue} delay={CALL_T.subline} />
    </SceneBg>
  );
};
