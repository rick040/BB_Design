import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts, headlineTracking } from "../../theme";
import { Cookie } from "../components/Cookie";
import { Slip } from "../components/Slip";
import { SpokenLine } from "../components/SpokenLine";
import { type GelukskoekjeProps, SCENE_STARTS, wordAt } from "../schema";

const S = SCENE_STARTS[2];
// Each guess is struck through and replaced on its spoken word.
export const OUTCOME_T = {
  strike0: wordAt("echte"),
  exact0: wordAt("bedrag"),
  strike1: wordAt("echte", 2),
  exact1: wordAt("datum"),
  happy: wordAt("datum") + 12,
};
const STRIKES = [OUTCOME_T.strike0, OUTCOME_T.strike1];
const EXACTS = [OUTCOME_T.exact0, OUTCOME_T.exact1];

const BUDDY = 220;

export const OutcomeScene: React.FC<{
  props: GelukskoekjeProps["outcome"];
  guess: GelukskoekjeProps["hook"]["guess"];
}> = ({ props, guess }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const slipOpen = interpolate(frame, [S - 2, S + 12], [0.35, 1], clamp);
  const landT = frame >= EXACTS[1] ? EXACTS[1] : EXACTS[0];
  const squash = interpolate(frame, [landT - 6, landT, landT + 4, landT + 10], [1, 1.15, 0.84, 1], clamp);
  const hop = Math.sin(Math.PI * interpolate(frame, [landT - 6, landT], [0, 1], clamp)) * 40;
  const happy = interpolate(frame, [OUTCOME_T.happy, OUTCOME_T.happy + 5], [1, 0.18], clamp);

  return (
    <SceneBg color={p.light}>
      <SpokenLine
        text={props.headline}
        at={[wordAt("het"), wordAt("echte"), wordAt("bedrag"), wordAt("de"), wordAt("echte", 2), wordAt("datum")]}
        first={p.blue}
        rest={p.blue}
      />
      <Stage offsetY={20}>
        <Slip width={900} height={420} open={slipOpen} style={{ left: 90, top: 50, transform: "rotate(-1.5deg)" }}>
          {props.exact.map((ex, i) => {
            // The guess line i of the hook, shown in the same order.
            const g = guess[guess.length - 1 - i] ?? "";
            const strike = interpolate(frame, [STRIKES[i], STRIKES[i] + 7], [0, 1], clamp);
            const exIn = pop(frame, fps, EXACTS[i], springs.pop);
            return (
              <div key={i} style={{ position: "relative", height: 160, width: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div
                  style={{
                    position: "absolute",
                    fontSize: 60,
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                    letterSpacing: "-0.03em",
                    color: "#6b6b78",
                    opacity: 1 - interpolate(exIn, [0, 0.6], [0, 1], clamp),
                    transform: `translateY(${-exIn * 30}px)`,
                  }}
                >
                  {g}
                  <div
                    style={{
                      position: "absolute",
                      left: -10,
                      top: "52%",
                      height: 7,
                      borderRadius: 4,
                      background: p.blue,
                      width: `calc(${strike * 100}% + ${strike * 20}px)`,
                    }}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    fontFamily: fonts.display,
                    fontWeight: 500,
                    fontSize: i === 0 ? 120 : 80,
                    whiteSpace: "nowrap",
                    letterSpacing: headlineTracking,
                    color: p.blue,
                    opacity: Math.min(1, exIn * 1.5),
                    transform: `scale(${1.4 - 0.4 * exIn}) rotate(${(1 - exIn) * -4}deg)`,
                  }}
                >
                  {ex}
                </div>
              </div>
            );
          })}
        </Slip>

        <div style={{ position: "absolute", left: 580, top: 620, opacity: 0.95 }}>
          <Cookie width={380} crack={1} />
        </div>

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={happy}
          squash={squash}
          look={{ x: 0.5, y: -0.7 }}
          style={{ position: "absolute", left: 270 - BUDDY / 2, top: 860 - hop - BUDDY * BUDDY_RATIO }}
        />
      </Stage>
    </SceneBg>
  );
};
