import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BILL_H, BILL_W, BillCard } from "../../components/BillCard";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { Checkmark } from "../../components/Checkmark";
import { Stage } from "../../components/Stage";
import { Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { FIELD_H, FIELD_W, FieldCard, Peg, Pole, Rope, ropeY } from "../components/Laundry";
import { SpokenHeadline } from "../components/SpokenHeadline";
import { SCENE_STARTS, type WaslijnProps, wordAt } from "../schema";

// Absolute frames, allemaal uit de stem.
export const LINE_T = {
  buddyIn: wordAt("buddy") - 4, // Buddy hopt binnen op "Buddy"
  billIn: wordAt("zie"), // de doorgestuurde rekening verschijnt boven hem
  // Elk veld hangt aan de lijn op het gesproken woord.
  pinBedrag: wordAt("bedrag"),
  pinVervaldatum: wordAt("vervaldatum"),
  pinBetaallink: wordAt("betaallink"),
  pinKenmerk: wordAt("kenmerk"),
  billOut: wordAt("kenmerk") + 10,
  subline: wordAt("betaallink") - 10,
  // Scène 3: veertien dagen tellen, dan haalt Buddy alles van de lijn.
  swap: SCENE_STARTS[2] - 4,
  counter: wordAt("veertien"),
  countEnd: wordAt("vervaldatum", 2) + 12,
  unpin: wordAt("haalt"), // eerste knijper eraf, daarna om de 6 frames
  unpinStagger: 6,
  gone: wordAt("weg"),
  goneSub: wordAt("vervaldatum", 2) + 4,
};

const PIN_AT = [LINE_T.pinBedrag, LINE_T.pinVervaldatum, LINE_T.pinBetaallink, LINE_T.pinKenmerk];
const FLY = 9; // frames van rekening naar lijn
const ROPE = { x0: 30, x1: 1050, y: 110, sag: 50 };
const CARD_X = [165, 405, 645, 885];
const GROUND = 870;
const BUDDY = 170;
const BILL_C = { x: 540, y: 500 };
const BILL_S = 0.62;

export const LinePanel: React.FC<{
  line: WaslijnProps["line"];
  gone: WaslijnProps["gone"];
  bill: WaslijnProps["bill"];
}> = ({ line, gone, bill }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  // Buddy: hop in, sprongetje op elk veld en op "haalt".
  const inS = pop(frame, fps, LINE_T.buddyIn, springs.bouncy);
  const hops = [...PIN_AT.map((t) => t - 4), LINE_T.unpin - 4, LINE_T.gone - 2];
  let hopY = 0;
  let sq = 1;
  for (const h of hops) {
    const t = frame - h;
    if (t >= -4 && t < 0) sq = Math.min(sq, interpolate(t, [-4, 0], [1, 0.82]));
    if (t >= 0 && t <= 12) {
      hopY = Math.max(hopY, 70 * Math.sin((Math.PI * t) / 12));
      sq = Math.min(sq, interpolate(t, [0, 3, 12], [1.12, 1.05, 1]));
    }
    if (t > 12 && t <= 18) sq = Math.min(sq, interpolate(t, [12, 14, 18], [1, 0.86, 1]));
  }
  const pinIdx = PIN_AT.filter((t) => frame >= t - 6).length - 1;
  const lookX = frame < LINE_T.billIn ? 0 : frame < LINE_T.swap ? (pinIdx >= 0 ? (CARD_X[pinIdx] - 540) / 400 : 0) : 0.2;
  const lookY = frame < LINE_T.billIn ? 0 : -0.8;

  // Rekening boven Buddy.
  const billIn = pop(frame, fps, LINE_T.billIn, springs.pop);
  const billOut = interpolate(frame, [LINE_T.billOut, LINE_T.billOut + 10], [1, 0], clamp);
  const billScale = BILL_S * billIn * billOut;

  // Teller: +0 tot +14 dagen.
  const cIn = pop(frame, fps, LINE_T.counter - 2, springs.pop);
  const days = Math.round(
    interpolate(frame, [LINE_T.counter + 6, LINE_T.countEnd], [0, 14], {
      ...clamp,
      easing: Easing.inOut(Easing.quad),
    }),
  );
  const goneIn = pop(frame, fps, LINE_T.gone, springs.bouncy);
  const s2Out = frame >= LINE_T.swap;

  return (
    <>
      {frame < LINE_T.swap + 8 ? (
        <SpokenHeadline
          text={line.headline}
          at={[wordAt("zie"), wordAt("zie"), wordAt("precies"), wordAt("wat", 2), wordAt("er"), wordAt("hangt")]}
          colors={[p.white, p.blueSoft]}
          out={LINE_T.swap}
        />
      ) : null}
      {frame >= LINE_T.swap ? (
        <SpokenHeadline
          text={gone.headline}
          at={[
            wordAt("veertien"),
            wordAt("dagen"),
            wordAt("na"),
            wordAt("de"),
            wordAt("vervaldatum", 2),
            wordAt("weg"),
          ]}
          colors={[p.white, p.blueSoft]}
          sizeFactor={0.92}
        />
      ) : null}

      <Stage offsetY={30}>
        <Pole x={ROPE.x0} top={ROPE.y - 30} groundY={GROUND + 20} color={p.blueSoft} />
        <Pole x={ROPE.x1} top={ROPE.y - 30} groundY={GROUND + 20} color={p.blueSoft} />
        <Rope {...ROPE} color={p.white} />

        {/* Rekening die zich over de lijn verdeelt. */}
        <div
          style={{
            position: "absolute",
            left: BILL_C.x - BILL_W / 2,
            top: BILL_C.y - BILL_H / 2,
            width: BILL_W,
            height: BILL_H,
            transform: `scale(${billScale}) rotate(${-2 + 2 * billIn}deg)`,
            opacity: billScale > 0.01 ? billOut : 0,
          }}
        >
          <BillCard sender={bill.sender} subject={bill.subject} amount={bill.amount} dueLabel={bill.due} />
        </div>

        {/* Veertien-dagen-teller op de plek van de rekening. */}
        <div
          style={{
            position: "absolute",
            left: BILL_C.x - 230,
            top: BILL_C.y - 120,
            width: 460,
            height: 240,
            borderRadius: 40,
            background: p.white,
            boxShadow: "0 24px 60px rgba(0, 12, 80, 0.3)",
            transform: `scale(${cIn})`,
            opacity: frame >= LINE_T.counter - 2 ? 1 : 0,
            textAlign: "center",
            fontFamily: fonts.display,
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          <div style={{ fontFamily: fonts.ui, fontSize: 30, color: "#6b6b78", marginTop: 26 }}>{bill.due}</div>
          <div
            style={{
              fontSize: 110,
              fontWeight: 600,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
              color: p.blue,
              opacity: 1 - goneIn,
            }}
          >
            +{days} <span style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.02em" }}>{gone.plusLabel}</span>
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 92,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 18,
              opacity: goneIn,
              transform: `scale(${0.7 + 0.3 * goneIn})`,
            }}
          >
            <Checkmark size={78} color={p.blue} progress={goneIn} strokeWidth={10} />
            <span style={{ fontSize: 66, fontWeight: 600, letterSpacing: "-0.04em", color: p.blue }}>
              {gone.goneLabel}
            </span>
          </div>
        </div>

        {/* Velden aan de lijn. */}
        {line.fields.map((f, i) => {
          const land = PIN_AT[i];
          const start = land - FLY;
          if (frame < start) return null;
          const u = interpolate(frame, [start, land], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
          const rx = CARD_X[i];
          const ry = ropeY(rx, ROPE.x0, ROPE.x1, ROPE.y, ROPE.sag);
          // Vlucht vanuit de rekening, in een boogje naar de knijper.
          const fx = interpolate(u, [0, 1], [BILL_C.x, rx]);
          const fy = interpolate(u, [0, 1], [BILL_C.y - FIELD_H / 2, ry + 18]) - 120 * Math.sin(Math.PI * u);
          const sc = interpolate(u, [0, 1], [0.4, 1]);
          const since = frame - land;
          let swing = since >= 0 ? 12 * Math.sin(since * 0.45) * Math.exp(-since / 12) : -20 * (1 - u);
          const pegIn = pop(frame, fps, land, springs.pop);

          // Eraf halen: knijper springt weg, kaart valt.
          const drop = LINE_T.unpin + i * LINE_T.unpinStagger;
          const td = frame - drop;
          let dy = 0;
          let fade = 1;
          let pegUp = 0;
          if (td >= 0) {
            dy = 2.2 * td * td;
            swing += td * (i % 2 === 0 ? 4 : -4);
            fade = interpolate(td, [6, 16], [1, 0], clamp);
            pegUp = pop(frame, fps, drop, springs.smooth);
          }

          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  left: fx - FIELD_W / 2,
                  top: fy + dy,
                  width: FIELD_W,
                  height: FIELD_H,
                  transform: `rotate(${swing}deg) scale(${sc})`,
                  transformOrigin: "50% 0%",
                  opacity: fade,
                }}
              >
                <FieldCard label={f.label} value={f.value} link={i === 2} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: rx - 17,
                  top: ry - 20 - pegUp * 160,
                  transform: `scale(${pegIn}) rotate(${pegUp * 160}deg)`,
                  opacity: 1 - pegUp,
                }}
              >
                <Peg color={p.yellow} />
              </div>
            </React.Fragment>
          );
        })}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [LINE_T.billIn + 14, LINE_T.gone + 6]) * (frame > LINE_T.gone + 12 ? 0.25 : 1)}
          squash={frame < LINE_T.buddyIn + 14 ? interpolate(inS, [0, 0.6, 1], [0.6, 1.1, 1]) : sq}
          look={{ x: lookX, y: lookY }}
          style={{
            position: "absolute",
            left: 540 - BUDDY / 2,
            top: GROUND - BUDDY * BUDDY_RATIO - hopY,
            opacity: Math.min(1, inS * 3),
            transform: `scale(${0.4 + 0.6 * Math.min(1, inS)})`,
            transformOrigin: "50% 100%",
          }}
        />
      </Stage>

      <div style={{ opacity: s2Out ? interpolate(frame, [LINE_T.swap, LINE_T.swap + 6], [1, 0], clamp) : 1 }}>
        <Subline text={line.subline} color={p.blueText} delay={LINE_T.subline} />
      </div>
      {frame >= LINE_T.swap ? <Subline text={gone.subline} color={p.blueText} delay={LINE_T.goneSub} /> : null}
    </>
  );
};
