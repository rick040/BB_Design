import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { DateTile, MONSTER_H, MONSTER_W, MonsterShadow, mix, TILE_W } from "../components/Spook";
import type { SpookProps } from "../schema";

// Timeline (frames, scene-local).
export const LIGHT_T = {
  shrink: 4, // in the light, the monster shadow shrinks to nothing
  shrinkLen: 20,
  amount: 24, // chip "€86,40"
  due: 32, // chip "Vervalt 24 nov"
  tiles: 46, // calendar tiles pop in
  tileStagger: 10,
  buddyIn: 72, // Buddy pops up under the tiles
  happy: 86,
  subline: 80,
};

const CARD = { w: 880, h: 300, x: 100, y: 20 };
const TILES_Y = 390;
const TILE_GAP = 40;
const BUDDY = 150;
const BUDDY_FEET = 880;

const Chip: React.FC<{ text: string; strong: boolean; t: number }> = ({ text, strong, t }) => {
  const p = usePalette();
  return (
    <div
      style={{
        padding: "14px 30px",
        borderRadius: 40,
        background: strong ? p.blue : p.grey,
        color: strong ? p.white : p.ink,
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: strong ? 72 : 52,
        letterSpacing: "-0.03em",
        opacity: Math.min(1, t * 2),
        transform: `scale(${0.6 + 0.4 * t})`,
      }}
    >
      {text}
    </div>
  );
};

export const LightScene: React.FC<{ props: SpookProps["light"]; mail: SpookProps["mail"] }> = ({ props, mail }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const shrink = interpolate(frame, [LIGHT_T.shrink, LIGHT_T.shrink + LIGHT_T.shrinkLen], [0.9, 0], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const amount = pop(frame, fps, LIGHT_T.amount, springs.pop);
  const due = pop(frame, fps, LIGHT_T.due, springs.pop);
  const buddyIn = pop(frame, fps, LIGHT_T.buddyIn, springs.bouncy);
  const happy = frame >= LIGHT_T.happy && frame < LIGHT_T.happy + 14;
  const blink = happy ? 0.18 : blinkScale(frame, [LIGHT_T.happy + 22]);
  const idle = frame > LIGHT_T.buddyIn + 20 ? Math.sin((frame - LIGHT_T.buddyIn) / 7) * 4 : 0;
  const tilesW = 3 * TILE_W + 2 * TILE_GAP;

  return (
    <SceneBg color={p.light}>
      <Stage offsetY={10}>
        {shrink > 0.01 ? (
          <MonsterShadow
            color={mix(p.blue, p.light, 0.86)}
            teeth={p.light}
            eyes={0}
            eyeColor={p.red}
            style={{
              left: 540 - MONSTER_W / 2,
              top: CARD.y + CARD.h - MONSTER_H,
              transform: `scale(${shrink})`,
              transformOrigin: "50% 100%",
            }}
          />
        ) : null}

        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 44,
            background: p.white,
            boxShadow: "0 24px 60px rgba(1,59,255,0.12)",
            fontFamily: fonts.ui,
          }}
        >
          <div style={{ position: "absolute", left: 44, top: 34, fontSize: 46, fontWeight: 700, color: p.ink }}>{mail.sender}</div>
          <div style={{ position: "absolute", left: 44, top: 94, fontSize: 38, color: p.greyText }}>{mail.subject}</div>
          <div style={{ position: "absolute", left: 44, right: 44, top: 166, display: "flex", gap: 22, alignItems: "center" }}>
            <Chip text={props.amount} strong t={amount} />
            <Chip text={props.due} strong={false} t={due} />
          </div>
        </div>

        {props.tiles.map((tile, i) => {
          const t = pop(frame, fps, LIGHT_T.tiles + i * LIGHT_T.tileStagger, springs.pop);
          return (
            <DateTile
              key={i}
              day={tile.day}
              month={tile.month}
              label={tile.label}
              strong={i === props.tiles.length - 1}
              style={{
                left: (1080 - tilesW) / 2 + i * (TILE_W + TILE_GAP),
                top: TILES_Y + (1 - t) * -40,
                opacity: Math.min(1, t * 2),
                transform: `scale(${0.7 + 0.3 * t}) rotate(${(i - 1) * 3 * t}deg)`,
              }}
            />
          );
        })}

        <Buddy
          size={BUDDY}
          body={p.blueMascot}
          eye={p.white}
          blink={blink}
          squash={interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.12, 1])}
          look={{ x: 0, y: -0.8 }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: BUDDY_FEET - BUDDY * BUDDY_RATIO + idle,
            opacity: Math.min(1, buddyIn * 3),
          }}
        />
        {/* a tiny, harmless shadow under Buddy: all that is left of the monster */}
        <div
          style={{
            position: "absolute",
            left: 540 - 70,
            top: BUDDY_FEET - 6,
            width: 140,
            height: 16,
            borderRadius: "50%",
            background: mix(p.blue, p.light, 0.86),
            opacity: Math.min(1, buddyIn),
          }}
        />
      </Stage>

      <Headline text={props.headline} color={p.blue} delay={6} stagger={3} />
      <Subline text={props.subline} color={p.blue} delay={LIGHT_T.subline} />
    </SceneBg>
  );
};
