import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline } from "../../components/Text";
import { blinkScale, clamp, pop, shake, springs } from "../../lib/anim";
import { useLayout } from "../../lib/layout";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { AppTile, type Glyph, OPEN, OpenSuitcase, slot, TILE } from "../components/Suitcase";
import { type KofferProps, SCENE_STARTS, wordAt } from "../schema";

const INK = "#111827";

// Beats (frames), read from the voice-over.
export const SUITCASE_T = {
  extraDrop: wordAt("app") - 8,
  extraLand: wordAt("app") + 6,
  chip: wordAt("nodig") + 2,
  flip: SCENE_STARTS[1] - 6,
  flipLen: 12,
  factHeadline: SCENE_STARTS[1] + 2,
  factStagger: 4,
  buddyIn: SCENE_STARTS[1] + 4,
  kick: SCENE_STARTS[1] + 18,
  kickLen: 22,
  mail: wordAt("mail"),
  agenda: wordAt("agenda"),
  tag: wordAt("telefoon"),
  factChip: wordAt("telefoon") + 4,
};

const TILES: { glyph: Glyph; color: string }[] = [
  { glyph: "circle", color: "#4fd1d9" },
  { glyph: "mail", color: "#2459fd" },
  { glyph: "triangle", color: "#ffce31" },
  { glyph: "wave", color: "#99b1ff" },
  { glyph: "play", color: "#4fd1d9" },
  { glyph: "star", color: "#ffce31" },
  { glyph: "agenda", color: "#2459fd" },
  { glyph: "square", color: "#b1afb2" },
];
const MAIL = 1;
const AGENDA = 6;

const Pill: React.FC<{ text: string; bg: string; fg: string; style?: React.CSSProperties }> = ({ text, bg, fg, style }) => (
  <div
    style={{
      display: "inline-block",
      padding: "10px 26px",
      borderRadius: 999,
      background: bg,
      color: fg,
      fontFamily: fonts.ui,
      fontWeight: 700,
      fontSize: 34,
      letterSpacing: "0.12em",
      ...style,
    }}
  >
    {text}
  </div>
);

export const SuitcaseScene: React.FC<{ myth: KofferProps["myth"]; fact: KofferProps["fact"] }> = ({ myth, fact }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const L = useLayout();
  const T = SUITCASE_T;

  // Label flip MYTHE → FEIT (rotateX through 90°).
  const flipT = interpolate(frame, [T.flip, T.flip + T.flipLen], [0, 1], clamp);
  const showFact = flipT >= 0.5;
  const flipScale = Math.abs(Math.cos(flipT * Math.PI));
  const mythOut = interpolate(frame, [T.flip - 2, T.flip + 6], [1, 0], clamp);

  // The extra app drops in, wedges on the full case, and is kicked away by Buddy.
  const perch = { x: 540 - TILE / 2, y: OPEN.bodyY - TILE + 30 };
  const drop = pop(frame, fps, T.extraDrop, springs.bouncy);
  const kickU = interpolate(frame, [T.kick, T.kick + T.kickLen], [0, 1], clamp);
  const kicked = frame >= T.kick;
  const ex = kicked ? perch.x + kickU * 900 : perch.x;
  const ey = kicked ? perch.y - Math.sin(kickU * Math.PI) * 160 + kickU * 60 : interpolate(drop, [0, 1], [-700, perch.y]);
  const er = kicked ? 14 + kickU * 540 : interpolate(drop, [0, 1], [-30, 14]);
  const jam = shake(frame, T.extraLand, 16, 10);
  const chipIn = pop(frame, fps, T.chip, springs.pop);
  const chipOut = interpolate(frame, [T.kick - 4, T.kick + 4], [1, 0], clamp);

  // Buddy hops in from the right onto the lid, then kicks.
  const BUDDY = 170;
  const bIn = interpolate(frame, [T.buddyIn, T.buddyIn + 12], [0, 1], clamp);
  const bx = interpolate(bIn, [0, 1], [1180, 760]);
  const hop = Math.sin(bIn * Math.PI) * 200;
  const kickHop = interpolate(frame, [T.kick - 8, T.kick], [0, 1], clamp);
  const bxK = interpolate(kickHop, [0, 1], [760, 640]);
  const bodyX = frame < T.kick - 8 ? bx : bxK;
  const feet = OPEN.lidY + OPEN.lidH - 20;
  const bHop = frame < T.kick - 8 ? hop : Math.sin(kickHop * Math.PI) * 90;
  const landSq = interpolate(frame, [T.buddyIn + 12, T.buddyIn + 15, T.buddyIn + 22], [1, 0.8, 1], clamp);
  const kickSq = interpolate(frame, [T.kick, T.kick + 3, T.kick + 10], [1, 1.15, 1], clamp);
  const look =
    frame < T.kick
      ? { x: -0.9, y: 0.6 }
      : frame < T.mail - 2
        ? { x: 1, y: -0.6 }
        : frame < T.agenda - 2
          ? { x: -0.7, y: 1 }
          : { x: 0.3, y: 1 };

  const tileGlow = (i: number) => {
    const at = i === MAIL ? T.mail : i === AGENDA ? T.agenda : -1;
    if (at < 0) return { lift: 0, ring: 0, check: 0 };
    const s = pop(frame, fps, at, springs.pop);
    return { lift: s, ring: s, check: interpolate(frame, [at + 4, at + 14], [0, 1], clamp) };
  };
  const otherDim = interpolate(frame, [T.mail - 2, T.mail + 10], [1, 0.45], clamp);
  const tagSwing = Math.sin(Math.max(0, frame - T.tag) * 0.35) * 14 * Math.exp(-Math.max(0, frame - T.tag) / 18);
  const factChip = pop(frame, fps, T.factChip, springs.pop);

  const labelTop = L.safeTop - 4;

  return (
    <SceneBg color={p.light}>
      {/* label pill flips from MYTHE to FEIT */}
      <div style={{ position: "absolute", top: labelTop, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ display: "inline-block", transform: `scaleY(${flipScale})` }}>
          {showFact ? (
            <Pill text={fact.label} bg={p.blue} fg={p.white} />
          ) : (
            <Pill text={myth.label} bg={INK} fg={p.white} />
          )}
        </div>
      </div>
      <div style={{ opacity: mythOut, filter: `blur(${(1 - mythOut) * 8}px)` }}>
        <Headline text={myth.headline} color={INK} delay={-24} stagger={3} sizeFactor={0.92} top={labelTop + 84} />
      </div>
      {frame >= T.factHeadline - 1 ? (
        <Headline text={fact.headline} color={p.blue} delay={T.factHeadline} stagger={T.factStagger} sizeFactor={0.92} top={labelTop + 84} />
      ) : null}

      <Stage offsetY={70}>
        <div style={{ position: "absolute", inset: 0, transform: `translate(${jam.x}px, ${jam.y}px)` }}>
          <OpenSuitcase tag={myth.luggageTag} tagSwing={tagSwing}>
            {TILES.map((t, i) => {
              const s = slot(i);
              const g = tileGlow(i);
              const isKey = i === MAIL || i === AGENDA;
              return (
                <React.Fragment key={i}>
                  <AppTile
                    glyph={t.glyph}
                    color={t.color}
                    label={isKey ? (i === MAIL ? fact.mailLabel : fact.agendaLabel) : undefined}
                    labelColor={p.blue}
                    style={{
                      left: s.x,
                      top: s.y - g.lift * 16,
                      transform: `scale(${1 + g.lift * 0.08})`,
                      opacity: isKey ? 1 : otherDim,
                      outline: g.ring > 0.05 ? `${6 * g.ring}px solid ${p.yellow}` : "none",
                      outlineOffset: 4,
                      borderRadius: TILE * 0.3,
                    }}
                  />
                  {isKey ? (
                    <div
                      style={{
                        position: "absolute",
                        left: s.x + TILE - 38,
                        top: s.y - g.lift * 16 - 24,
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        background: p.blue,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `scale(${g.check > 0 ? 1 : 0})`,
                      }}
                    >
                      <Checkmark size={40} color={p.white} progress={g.check} />
                    </div>
                  ) : null}
                </React.Fragment>
              );
            })}
          </OpenSuitcase>
        </div>

        {/* the extra app that doesn't fit */}
        {frame >= T.extraDrop && ex < 1300 ? (
          <AppTile
            glyph="question"
            color={p.white}
            bg={INK}
            label={kicked ? undefined : myth.extraApp}
            labelColor={INK}
            style={{ left: ex, top: ey, transform: `rotate(${er}deg)` }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            left: 640,
            top: OPEN.bodyY - 230,
            transform: `scale(${chipIn * chipOut})`,
            transformOrigin: "0% 100%",
          }}
        >
          <div style={{ padding: "14px 26px", borderRadius: 26, background: INK, color: p.white, fontFamily: fonts.ui, fontWeight: 600, fontSize: 34, whiteSpace: "nowrap" }}>
            {myth.chip}
          </div>
        </div>

        {frame >= T.buddyIn ? (
          <Buddy
            size={BUDDY}
            body={p.blueMascot}
            eye={p.white}
            blink={blinkScale(frame, [T.agenda + 20])}
            look={look}
            squash={Math.min(landSq, 1) * kickSq}
            style={{
              position: "absolute",
              left: bodyX - BUDDY / 2,
              top: feet - BUDDY * BUDDY_RATIO - bHop,
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: OPEN.lidY - 90,
            textAlign: "center",
            transform: `scale(${factChip})`,
          }}
        >
          <div style={{ display: "inline-block", padding: "14px 30px", borderRadius: 26, background: p.blue, color: p.white, fontFamily: fonts.ui, fontWeight: 600, fontSize: 36 }}>
            {fact.chip}
          </div>
        </div>
      </Stage>
    </SceneBg>
  );
};
