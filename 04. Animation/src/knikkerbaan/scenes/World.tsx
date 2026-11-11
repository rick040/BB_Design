import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { blinkScale, clamp, pop, springs } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";
import { type KnikkerbaanProps, SCENE_STARTS, wordAt } from "../schema";

// The marble run. Everything here is drawn in world units (1080 wide); the
// Ad component moves a camera over it. Beats are absolute frames, tied to
// spoken words from the voice-over.
const [, S2, S3] = SCENE_STARTS;

export const WORLD_T = {
  bump: wordAt("nee"), //            Buddy bumps the AI die off the platform
  push1: S2 + 4, //                  Buddy pushes bill 1 off the platform
  gateA1: wordAt("bedrag") - 3, //   rule 1 reads the amount, trapdoor opens
  gateB1: wordAt("vervaldatum") + 4, // rule 2 reads the due date
  tray1: wordAt("netjes"), //        bill 1 lands as a neat row in the tray
  hopBack: S3 - 10, //               Buddy hops back for the next bill
  drop2: S3, //                      bill 2 drops onto the platform
  push2: S3 + 10, //                 same push
  gateA2: wordAt("precies"), //      same rule 1
  gateB2: wordAt("hetzelfde"), //    same rule 2
  tray2: wordAt("activeer") - 7, //  bill 2 lands in the tray too
};

// ---- geometry -------------------------------------------------------------
type Rail = { x0: number; y0: number; x1: number; y1: number };
const RAIL_A: Rail = { x0: 150, y0: 650, x1: 870, y1: 850 };
const RAIL_B: Rail = { x0: 940, y0: 1070, x1: 140, y1: 1270 };
const RAIL_C: Rail = { x0: 150, y0: 1490, x1: 720, y1: 1640 };
const railY = (r: Rail, x: number) => r.y0 + ((x - r.x0) * (r.y1 - r.y0)) / (r.x1 - r.x0);
const railDeg = (r: Rail) => {
  const d = (Math.atan2(r.y1 - r.y0, Math.abs(r.x1 - r.x0)) * 180) / Math.PI;
  return r.x1 > r.x0 ? d : -d;
};
const HINGE_A = 540; // trapdoor A runs from here to the end of rail A
const HINGE_B = 470; // trapdoor B runs from here to the end of rail B
const PLATFORM = { x0: 220, x1: 1000, y: 420 };
const TRAY = { x0: 470, x1: 1020, y0: 1665, y1: 1795 };
export const FLOOR_Y = 1810; // the blue floor the CTA lives on
export const WORLD_FIT = { top: 120, bottom: 1830 }; // zoomed-out framing

const BILL_W = 330;
const BILL_H = 118;
const ON = BILL_H / 2 + 4; // centre height above a rail

type Key = { f: number; x: number; y: number; r: number; ease?: "in" | "out" | "lin" };
const pathAt = (frame: number, keys: Key[]) => {
  if (frame <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1];
    const b = keys[i];
    if (frame <= b.f) {
      const e = b.ease === "in" ? Easing.in(Easing.quad) : b.ease === "out" ? Easing.out(Easing.cubic) : Easing.linear;
      const t = e((frame - a.f) / Math.max(1, b.f - a.f));
      return { f: frame, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, r: a.r + (b.r - a.r) * t };
    }
  }
  return keys[keys.length - 1];
};

/** The route a bill takes, starting at push frame p, gates at gA/gB, tray at tr. */
const route = (p: number, gA: number, gB: number, tr: number, fast: boolean): Key[] => {
  const k = fast ? 0.55 : 1;
  const plat = PLATFORM.y - ON;
  const aEnd = 700;
  const bEnd = 300;
  const cEnd = 620;
  return [
    { f: p, x: 330, y: plat, r: 0 },
    { f: p + 8 * k, x: 215, y: plat, r: 0, ease: "out" },
    { f: p + 14 * k, x: 220, y: railY(RAIL_A, 220) - ON, r: railDeg(RAIL_A), ease: "in" },
    { f: gA - 10, x: aEnd, y: railY(RAIL_A, aEnd) - ON, r: railDeg(RAIL_A), ease: "in" },
    { f: gA + 2, x: aEnd, y: railY(RAIL_A, aEnd) - ON, r: railDeg(RAIL_A) },
    { f: gA + 9, x: aEnd - 10, y: railY(RAIL_B, aEnd - 10) - ON, r: railDeg(RAIL_B), ease: "in" },
    { f: gB - 4, x: bEnd, y: railY(RAIL_B, bEnd) - ON, r: railDeg(RAIL_B), ease: "in" },
    { f: gB + 6, x: bEnd, y: railY(RAIL_B, bEnd) - ON, r: railDeg(RAIL_B) },
    { f: gB + 13, x: bEnd + 10, y: railY(RAIL_C, bEnd + 10) - ON, r: railDeg(RAIL_C), ease: "in" },
    { f: tr - 9, x: cEnd, y: railY(RAIL_C, cEnd) - ON, r: railDeg(RAIL_C), ease: "in" },
    { f: tr, x: 760, y: TRAY.y0 + 40, r: 4, ease: "in" },
  ];
};

const ROUTE_1 = route(WORLD_T.push1, WORLD_T.gateA1, WORLD_T.gateB1, WORLD_T.tray1, false);
const ROUTE_2 = route(WORLD_T.push2, WORLD_T.gateA2, WORLD_T.gateB2, WORLD_T.tray2, true);

// ---- small parts ------------------------------------------------------------
const MiniBill: React.FC<{ bill: KnikkerbaanProps["bills"][number] }> = ({ bill }) => {
  const p = usePalette();
  return (
    <div
      style={{
        width: BILL_W,
        height: BILL_H,
        borderRadius: 30,
        background: p.white,
        boxShadow: "0 18px 40px rgba(1, 40, 160, 0.18)",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "0 24px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: p.grey,
          color: p.blueMid,
          fontWeight: 600,
          fontSize: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {bill.initial}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 24, color: p.greyText, whiteSpace: "nowrap" }}>{bill.sender}</div>
        <div style={{ fontSize: 40, fontWeight: 600, color: p.ink, lineHeight: 1.1 }}>{bill.amount}</div>
      </div>
    </div>
  );
};

const Chip: React.FC<{ text: string; s: number; x: number; y: number; dark?: boolean }> = ({ text, s, x, y, dark }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s})`,
        opacity: Math.min(1, s * 2),
        background: dark ? p.blue : p.yellow,
        color: dark ? p.white : p.ink,
        fontFamily: fonts.ui,
        fontWeight: 600,
        fontSize: 42,
        padding: "12px 28px",
        borderRadius: 40,
        whiteSpace: "nowrap",
        boxShadow: "0 12px 30px rgba(1, 40, 160, 0.18)",
      }}
    >
      {text}
    </div>
  );
};

const Die: React.FC<{ label: string; size: number }> = ({ label, size }) => {
  const p = usePalette();
  const pip = (cx: number, cy: number) => <circle cx={cx} cy={cy} r={7} fill={p.blue} />;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <rect x={3} y={3} width={94} height={94} rx={20} fill={p.white} stroke={p.blue} strokeWidth={5} />
      {pip(22, 22)}
      {pip(78, 78)}
      {pip(78, 22)}
      {pip(22, 78)}
      <text
        x={50}
        y={62}
        textAnchor="middle"
        fontFamily={fonts.display}
        fontWeight={700}
        fontSize={32}
        fill={p.blue}
      >
        {label}
      </text>
    </svg>
  );
};

// ---- the world ----------------------------------------------------------------
export const World: React.FC<{ props: KnikkerbaanProps }> = ({ props }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = usePalette();
  const T = WORLD_T;
  const rail = p.blueMid;

  // Trapdoors: open for 12 frames at each gate.
  const door = (g: number) =>
    interpolate(frame, [g, g + 4, g + 12, g + 18], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const doorA = Math.max(door(T.gateA1), door(T.gateA2)) * 62;
  const doorB = Math.max(door(T.gateB1), door(T.gateB2)) * -62;

  // Chips at the gates: first bill, then the second one with the same rules.
  const second = frame >= T.drop2 + 16;
  const chipA = second
    ? pop(frame, fps, T.gateA2 - 4, springs.pop)
    : pop(frame, fps, T.gateA1 - 2, springs.pop) * interpolate(frame, [T.drop2, T.drop2 + 12], [1, 0], clamp);
  const chipB = second
    ? pop(frame, fps, T.gateB2 - 4, springs.pop)
    : pop(frame, fps, T.gateB1 - 2, springs.pop) * interpolate(frame, [T.drop2, T.drop2 + 12], [1, 0], clamp);
  const bill = second ? props.bills[1] : props.bills[0];

  // Rule labels appear when the run starts.
  const rulesIn = pop(frame, fps, SCENE_STARTS[1] + 12, springs.smooth);

  // ---- AI die (hook) ----
  const dieFly = Math.max(0, frame - T.bump);
  const dieX = 850 + dieFly * 30;
  const dieY = PLATFORM.y - 170 - Math.abs(Math.sin(frame * 0.32)) * 26 - (dieFly > 0 ? dieFly * 18 - dieFly * dieFly * 0.6 : 0);
  const dieR = Math.sin(frame * 0.32) * 14 + dieFly * 24;
  const qBob = Math.sin(frame * 0.2) * 8;
  const neeIn = pop(frame, fps, T.bump, springs.pop) * interpolate(frame, [S2 + 6, S2 + 16], [1, 0], clamp);

  // ---- Buddy on the platform ----
  const BUDDY = 150;
  const bx = interpolate(
    frame,
    [0, T.bump - 6, T.bump, T.bump + 14, T.push1, T.push1 + 8, T.hopBack, T.hopBack + 10, T.push2, T.push2 + 6],
    [580, 580, 720, 580, 580, 450, 450, 580, 580, 450],
    { ...clamp, easing: Easing.inOut(Easing.quad) },
  );
  const hop = Math.sin(Math.PI * interpolate(frame, [T.hopBack, T.hopBack + 10], [0, 1], clamp)) * 70;
  const bumpSq = interpolate(frame, [T.bump - 10, T.bump - 5, T.bump, T.bump + 5], [1, 0.8, 1.12, 1], clamp);
  const pushSq = (f0: number) => interpolate(frame, [f0 - 3, f0, f0 + 8, f0 + 12], [1, 0.9, 0.9, 1], clamp);
  const landSq = interpolate(frame, [T.hopBack + 10, T.hopBack + 13, T.hopBack + 18], [1, 0.82, 1], clamp);
  const squash = Math.min(bumpSq, pushSq(T.push1), pushSq(T.push2), landSq);
  const followBill = frame >= T.push1 + 8 && frame < T.hopBack;
  const look =
    frame < T.bump + 14
      ? { x: 0.9, y: -0.1 }
      : frame < T.push1 - 2
        ? { x: 0.3, y: 0.2 }
        : followBill
          ? { x: interpolate(frame, [T.push1 + 8, T.gateA1, T.gateB1], [-0.8, 0.9, -0.6], clamp), y: 0.9 }
          : { x: -0.6, y: 0.4 };

  // ---- bills ----
  const b1 = pathAt(frame, ROUTE_1);
  const b2 = pathAt(frame, ROUTE_2);
  const b2DropY = interpolate(frame, [T.drop2, T.drop2 + 8], [-260, PLATFORM.y - ON], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const b2Land = interpolate(frame, [T.drop2 + 8, T.drop2 + 11, T.drop2 + 16], [1, 0.9, 1], clamp);
  const bill1Gone = interpolate(frame, [T.tray1, T.tray1 + 5], [1, 0], clamp);
  const bill2Gone = interpolate(frame, [T.tray2, T.tray2 + 5], [1, 0], clamp);

  // Ghost route of bill 1, shown while bill 2 takes the same path.
  const ghostIn = interpolate(frame, [T.drop2 + 4, T.drop2 + 16], [0, 1], clamp);
  const ghost: { x: number; y: number }[] = [];
  for (let f = ROUTE_1[1].f; f <= ROUTE_1[ROUTE_1.length - 1].f; f += 1.2) ghost.push(pathAt(f, ROUTE_1));

  const row1 = pop(frame, fps, T.tray1 + 2, springs.pop);
  const row2 = pop(frame, fps, T.tray2 + 2, springs.pop);

  const railLine = (x0: number, y0: number, x1: number, y1: number) => (
    <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={rail} strokeWidth={22} strokeLinecap="round" />
  );

  const Row: React.FC<{ b: KnikkerbaanProps["bills"][number]; s: number; y: number }> = ({ b, s, y }) => (
    <div
      style={{
        position: "absolute",
        left: TRAY.x0 + 24,
        right: 1080 - TRAY.x1 + 24,
        top: y,
        height: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: p.white,
        borderRadius: 25,
        padding: "0 22px",
        fontFamily: fonts.ui,
        fontSize: 28,
        color: p.ink,
        transform: `scale(${s})`,
        opacity: Math.min(1, s * 2),
        boxShadow: "0 8px 20px rgba(1, 40, 160, 0.12)",
      }}
    >
      <span style={{ fontWeight: 600 }}>{b.amount}</span>
      <span style={{ color: p.blueMid }}>vervalt {b.due}</span>
    </div>
  );

  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 2000 }}>
      {/* the blue floor that becomes the CTA */}
      <div
        style={{
          position: "absolute",
          left: -3000,
          width: 7080,
          top: FLOOR_Y,
          height: 4000,
          background: p.blue,
          borderRadius: 0,
        }}
      />

      <svg width={1080} height={2000} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
        {/* platform */}
        <rect x={PLATFORM.x0} y={PLATFORM.y} width={PLATFORM.x1 - PLATFORM.x0} height={24} rx={12} fill={rail} />
        {/* rail A + trapdoor A */}
        {railLine(RAIL_A.x0, RAIL_A.y0, HINGE_A, railY(RAIL_A, HINGE_A))}
        <g transform={`rotate(${doorA} ${HINGE_A} ${railY(RAIL_A, HINGE_A)})`}>
          {railLine(HINGE_A, railY(RAIL_A, HINGE_A), RAIL_A.x1, RAIL_A.y1)}
        </g>
        <circle cx={HINGE_A} cy={railY(RAIL_A, HINGE_A)} r={16} fill={p.white} stroke={rail} strokeWidth={6} />
        {/* rail B + trapdoor B */}
        {railLine(RAIL_B.x0, RAIL_B.y0, HINGE_B, railY(RAIL_B, HINGE_B))}
        <g transform={`rotate(${doorB} ${HINGE_B} ${railY(RAIL_B, HINGE_B)})`}>
          {railLine(HINGE_B, railY(RAIL_B, HINGE_B), RAIL_B.x1, RAIL_B.y1)}
        </g>
        <circle cx={HINGE_B} cy={railY(RAIL_B, HINGE_B)} r={16} fill={p.white} stroke={rail} strokeWidth={6} />
        {/* rail C */}
        {railLine(RAIL_C.x0, RAIL_C.y0, RAIL_C.x1, RAIL_C.y1)}
        {/* stopper pins = the fixed rules */}
        <rect x={RAIL_A.x1 + 8} y={RAIL_A.y1 - 150} width={26} height={160} rx={13} fill={p.yellow} />
        <rect x={RAIL_B.x1 - 34} y={RAIL_B.y1 - 150} width={26} height={160} rx={13} fill={p.yellow} />
        {/* tray */}
        <path
          d={`M ${TRAY.x0} ${TRAY.y0} L ${TRAY.x0} ${TRAY.y1} L ${TRAY.x1} ${TRAY.y1} L ${TRAY.x1} ${TRAY.y0}`}
          fill={p.grey}
          stroke={rail}
          strokeWidth={14}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* ghost route */}
        {ghostIn > 0
          ? ghost.map((g, i) => (
              <circle key={i} cx={g.x} cy={g.y} r={9} fill={p.yellow} opacity={ghostIn * 0.9} />
            ))
          : null}
      </svg>

      {/* rule labels */}
      {[
        { t: props.run.rule1, x: 690, y: 930 },
        { t: props.run.rule2, x: 330, y: 1350 },
      ].map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: l.x,
            top: l.y,
            transform: "translate(-50%, -50%)",
            fontFamily: fonts.ui,
            fontSize: 34,
            fontWeight: 500,
            color: p.blueMid,
            opacity: rulesIn,
            whiteSpace: "nowrap",
          }}
        >
          {l.t}
        </div>
      ))}

      <Row b={props.bills[0]} s={row1} y={TRAY.y0 + 10} />
      <Row b={props.bills[1]} s={row2} y={TRAY.y0 + 68} />

      {/* the AI die and its question mark */}
      {dieX < 1500 ? (
        <div style={{ position: "absolute", left: dieX - 85, top: dieY, transform: `rotate(${dieR}deg)` }}>
          <Die label={props.hook.dieLabel} size={170} />
        </div>
      ) : null}
      {frame < T.bump ? (
        <div
          style={{
            position: "absolute",
            left: 850 - 40,
            top: PLATFORM.y - 330 + qBob,
            width: 80,
            textAlign: "center",
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 110,
            color: p.blue,
            lineHeight: 1,
          }}
        >
          ?
        </div>
      ) : null}
      <Chip text={props.hook.nee} s={neeIn} x={760} y={PLATFORM.y - 300} dark />

      {/* Buddy */}
      <Buddy
        size={BUDDY}
        body={p.blue}
        eye={p.white}
        blink={blinkScale(frame, [30, T.tray1 + 4, T.tray2 + 6])}
        squash={squash}
        look={look}
        style={{ position: "absolute", left: bx - BUDDY / 2, top: PLATFORM.y - BUDDY * BUDDY_RATIO - hop }}
      />

      {/* bill 1 */}
      {bill1Gone > 0 ? (
        <div
          style={{
            position: "absolute",
            left: b1.x - BILL_W / 2,
            top: b1.y - BILL_H / 2,
            transform: `rotate(${b1.r}deg) scale(${0.6 + 0.4 * bill1Gone})`,
            opacity: bill1Gone,
          }}
        >
          <MiniBill bill={props.bills[0]} />
        </div>
      ) : null}
      {/* bill 2 */}
      {frame >= T.drop2 && bill2Gone > 0 ? (
        <div
          style={{
            position: "absolute",
            left: b2.x - BILL_W / 2,
            top: (frame < T.push2 ? b2DropY : b2.y) - BILL_H / 2,
            transform: `rotate(${b2.r}deg) scale(${(0.6 + 0.4 * bill2Gone)}, ${(0.6 + 0.4 * bill2Gone) * b2Land})`,
            transformOrigin: "50% 100%",
            opacity: bill2Gone,
          }}
        >
          <MiniBill bill={props.bills[1]} />
        </div>
      ) : null}

      {/* what the rules read */}
      <Chip text={bill.amount} s={chipA} x={820} y={600} />
      <Chip text={bill.due} s={chipB} x={250} y={1035} />
    </div>
  );
};
