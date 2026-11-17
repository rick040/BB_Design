import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { SceneBg, Stage } from "../../components/Stage";
import { Headline, Subline } from "../../components/Text";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { MailRow, PaperPlane } from "../components/Paper";
import { SCENE_STARTS, type VliegtuigProps, wordAt } from "../schema";
import { CARD, rowTop } from "./HookScene";

const S = SCENE_STARTS[1];
export const FORWARD_T = {
  dim: S + 4, // the other mails fade back
  button: wordAt("alleen"), // Doorsturen appears on the bill row
  tap: wordAt("door"), // tap: the row folds into a paper plane
  foldLen: 8,
  catch: wordAt("buddy"), // Buddy catches the plane
  closed: wordAt("niks"), // the rest of the mailbox blurs shut
};

const BUDDY = 190;
const BX = 885;
const FEET = 700;
const HEAD = FEET - BUDDY * BUDDY_RATIO;

export const ForwardScene: React.FC<{ props: VliegtuigProps["forward"]; bill: VliegtuigProps["bill"]; mails: string[] }> = ({
  props,
  bill,
  mails,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();

  const dim = interpolate(frame, [FORWARD_T.dim, FORWARD_T.dim + 10], [1, 0.35], clamp);
  const closed = interpolate(frame, [FORWARD_T.closed, FORWARD_T.closed + 14], [0, 1], clamp);
  const btnIn = pop(frame, fps, FORWARD_T.button, springs.bouncy);
  const press = interpolate(frame, [FORWARD_T.tap - 3, FORWARD_T.tap, FORWARD_T.tap + 4], [1, 0.88, 1], clamp);
  const fold = interpolate(frame, [FORWARD_T.tap + 2, FORWARD_T.tap + 2 + FORWARD_T.foldLen], [0, 1], clamp);
  const flyStart = FORWARD_T.tap + 2 + FORWARD_T.foldLen;
  const u = interpolate(frame, [flyStart - 4, FORWARD_T.catch], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.quad),
  });

  const billRowY = rowTop(4) + CARD.rowH / 2;
  const start = { x: CARD.x + CARD.w / 2, y: billRowY };
  const end = { x: BX + 10, y: HEAD - 18 };
  const px = start.x + (end.x - start.x) * u;
  const py = start.y + (end.y - start.y) * u - 260 * Math.sin(Math.PI * u);
  const tilt = frame < FORWARD_T.catch ? -28 + 40 * u : 0;
  const caught = frame >= FORWARD_T.catch;

  const buddyIn = pop(frame, fps, S + 6, springs.bouncy);
  const catchSq = interpolate(frame, [FORWARD_T.catch, FORWARD_T.catch + 3, FORWARD_T.catch + 10], [1, 0.8, 1], clamp);
  const squash = frame < S + 18 ? interpolate(buddyIn, [0, 0.6, 1], [0.6, 1.1, 1]) : catchSq;
  const look = caught ? { x: -0.5, y: 0.3 } : fold > 0 ? { x: (px - BX) / 500, y: Math.max(-1, (py - HEAD) / 300) } : { x: -0.8, y: 0.4 };
  const ink = p.red;

  return (
    <SceneBg color={p.blue}>
      <Headline text={props.headline} color={p.white} delay={S - 4} stagger={3} />
      <Stage offsetY={40}>
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.pad * 2 + 5 * CARD.rowH + 4 * CARD.gap,
            borderRadius: 40,
            background: p.white,
          }}
        />
        {mails.map((name, i) => (
          <div
            key={name}
            style={{
              position: "absolute",
              left: CARD.x + CARD.pad,
              top: rowTop(i),
              opacity: dim,
              filter: `blur(${closed * 9}px)`,
            }}
          >
            <MailRow name={name} width={CARD.w - CARD.pad * 2} bg={p.white} ink={p.ink} avatar={p.blueSoft} bar={p.grey} />
          </div>
        ))}
        {/* bill row: folds into the plane */}
        <div
          style={{
            position: "absolute",
            left: CARD.x + CARD.pad,
            top: rowTop(4),
            opacity: 1 - fold,
            transform: `scale(${1 - 0.6 * fold}, ${1 - 0.9 * fold})`,
            transformOrigin: "50% 50%",
          }}
        >
          <MailRow
            name={bill.sender}
            width={CARD.w - CARD.pad * 2}
            bg="#eef2ff"
            ink={p.ink}
            avatar={p.blue}
            bar={p.blueSoft}
            right={
              <div
                style={{
                  background: p.blue,
                  color: p.white,
                  fontFamily: fonts.ui,
                  fontWeight: 600,
                  fontSize: 27,
                  padding: "14px 22px",
                  borderRadius: 40,
                  opacity: Math.min(1, btnIn * 2),
                  transform: `scale(${(0.5 + 0.5 * btnIn) * press})`,
                }}
              >
                {props.button}
              </div>
            }
          />
        </div>
        {/* tap ripple */}
        {frame >= FORWARD_T.tap ? (
          <div
            style={{
              position: "absolute",
              left: CARD.x + CARD.w - CARD.pad - 100 - 60,
              top: billRowY - 60,
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `5px solid ${p.blue}`,
              opacity: interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 14], [0.9, 0], clamp),
              transform: `scale(${interpolate(frame, [FORWARD_T.tap, FORWARD_T.tap + 14], [0.3, 1.4], clamp)})`,
            }}
          />
        ) : null}

        <Buddy
          size={BUDDY}
          body={p.white}
          eye={p.blueMascot}
          blink={blinkScale(frame, [FORWARD_T.catch + 16])}
          squash={squash}
          look={look}
          style={{
            position: "absolute",
            left: BX - BUDDY / 2,
            top: HEAD,
            opacity: Math.min(1, buddyIn * 3),
            transform: `scale(${0.4 + 0.6 * buddyIn})`,
            transformOrigin: "50% 100%",
          }}
        />
        {/* the plane */}
        {fold > 0 ? (
          <div
            style={{
              position: "absolute",
              left: px - 75,
              top: py - 44 + (caught ? (1 - catchSq) * 60 : 0),
              transform: `rotate(${tilt}deg) scale(${0.4 + 0.6 * Math.min(1, fold * 1.4)})`,
              opacity: Math.min(1, fold * 2),
            }}
          >
            <PaperPlane size={150} fill={p.white} line={ink} />
          </div>
        ) : null}
      </Stage>
      <Subline text={props.subline} color={p.blueText} delay={FORWARD_T.closed} />
    </SceneBg>
  );
};
