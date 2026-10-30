import React from "react";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// Props for the magic show: a top hat lying upside down (opening up), a wand,
// a puff of smoke, sparkles, the bill cards, the sealed prediction envelope
// and the stage drapes. All plain SVG/CSS, so the text stays editable.

const HAT_INK = "#16161c";

/**
 * Top hat upside down, opening on top. Drawn in two layers so things can come
 * out of it: render <HatBack> first, then whatever rises out of the hat
 * (clipped at RIM_Y with <HatMouth>), then <HatFront> on top.
 * `w` is the brim width; the rim centre sits at (w/2, rimY(w)).
 */
export const hatGeom = (w: number) => {
  const rimRy = w * 0.13;
  const innerRx = w * 0.36;
  const innerRy = w * 0.085;
  const crownTop = w * 0.62; // crown is a bit narrower than the brim
  const crownBottom = w * 0.54;
  const crownH = w * 0.62;
  return { w, rimY: rimRy + 4, rimRy, innerRx, innerRy, crownTop, crownBottom, crownH, h: rimRy + 4 + crownH + 6 };
};

export const HatBack: React.FC<{ w: number; style?: React.CSSProperties }> = ({ w, style }) => {
  const g = hatGeom(w);
  const cx = w / 2;
  return (
    <svg width={w} height={g.h} style={{ position: "absolute", overflow: "visible", ...style }}>
      {/* back half of the brim */}
      <ellipse cx={cx} cy={g.rimY} rx={w / 2} ry={g.rimRy} fill={HAT_INK} />
      {/* the dark opening */}
      <ellipse cx={cx} cy={g.rimY} rx={g.innerRx} ry={g.innerRy} fill="#000" />
    </svg>
  );
};

export const HatFront: React.FC<{ w: number; band: string; style?: React.CSSProperties }> = ({ w, band, style }) => {
  const g = hatGeom(w);
  const cx = w / 2;
  const top = g.rimY;
  const bottom = g.rimY + g.crownH;
  const tl = cx - g.crownTop / 2;
  const tr = cx + g.crownTop / 2;
  const bl = cx - g.crownBottom / 2;
  const br = cx + g.crownBottom / 2;
  return (
    <svg width={w} height={g.h} style={{ position: "absolute", overflow: "visible", ...style }}>
      {/* crown, hanging down from the brim */}
      <path
        d={`M ${tl} ${top} L ${tr} ${top} L ${br} ${bottom - 14} Q ${cx} ${bottom + 12} ${bl} ${bottom - 14} Z`}
        fill={HAT_INK}
      />
      {/* band close to the brim */}
      <path
        d={`M ${tl + 3} ${top + g.crownH * 0.08} L ${tr - 3} ${top + g.crownH * 0.08} L ${tr - 8} ${top + g.crownH * 0.26} L ${tl + 8} ${top + g.crownH * 0.26} Z`}
        fill={band}
      />
      {/* sheen */}
      <path
        d={`M ${tl + 22} ${top + g.crownH * 0.34} L ${tl + 34} ${bottom - 30}`}
        stroke="#ffffff"
        strokeOpacity={0.16}
        strokeWidth={10}
        strokeLinecap="round"
      />
      {/* front half of the brim, drawn as a ring so the opening stays visible */}
      <path
        d={`M ${cx - w / 2} ${top} A ${w / 2} ${g.rimRy} 0 0 0 ${cx + w / 2} ${top} L ${cx + g.innerRx} ${top} A ${g.innerRx} ${g.innerRy} 0 0 1 ${cx - g.innerRx} ${top} Z`}
        fill="#24242c"
      />
    </svg>
  );
};

/** A clip box for things rising out of the hat: everything below the rim is hidden. */
export const HatMouth: React.FC<{
  w: number;
  left: number;
  top: number;
  height: number;
  children: React.ReactNode;
}> = ({ w, left, top, height, children }) => {
  const g = hatGeom(w);
  return (
    <div
      style={{
        position: "absolute",
        left: left - 200,
        width: w + 400,
        top: top + g.rimY - height,
        height,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 200, top: height - g.rimY, width: w }}>{children}</div>
    </div>
  );
};

export const Wand: React.FC<{ length: number; style?: React.CSSProperties }> = ({ length, style }) => (
  <div
    style={{
      position: "absolute",
      width: length,
      height: 26,
      borderRadius: 13,
      background: `linear-gradient(90deg, #ffffff 0 18%, ${HAT_INK} 18% 100%)`,
      boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
      transformOrigin: "100% 50%",
      ...style,
    }}
  />
);

/** Four-point sparkle. */
export const Sparkle: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({
  size,
  color,
  style,
}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ position: "absolute", overflow: "visible", ...style }}>
    <path d="M0 -50 Q 7 -7 50 0 Q 7 7 0 50 Q -7 7 -50 0 Q -7 -7 0 -50 Z" fill={color} />
  </svg>
);

/** Puff of smoke: a ring of soft circles that grows and fades. t 0..1. */
export const Puff: React.FC<{ t: number; size: number; color: string; style?: React.CSSProperties }> = ({
  t,
  size,
  color,
  style,
}) => {
  if (t <= 0 || t >= 1) return null;
  const blobs = [0, 1, 2, 3, 4, 5, 6, 7];
  const spread = size * 0.32 * (0.4 + t);
  return (
    <div style={{ position: "absolute", width: size, height: size, ...style }}>
      {blobs.map((i) => {
        const a = (i / blobs.length) * Math.PI * 2 + 0.3;
        const r = size * (0.2 + (i % 3) * 0.04) * (0.5 + t * 0.8);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: size / 2 + Math.cos(a) * spread - r,
              top: size / 2 + Math.sin(a) * spread * 0.8 - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background: color,
              opacity: (1 - t) * 0.95,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: size / 2 - size * 0.3 * (0.6 + t),
          top: size / 2 - size * 0.3 * (0.6 + t),
          width: size * 0.6 * (0.6 + t),
          height: size * 0.6 * (0.6 + t),
          borderRadius: "50%",
          background: color,
          opacity: (1 - t) * 0.95,
        }}
      />
    </div>
  );
};

export const SMALL_BILL_W = 600;
export const SMALL_BILL_H = 250;

/** The bill on the magic table (hook). */
export const SmallBill: React.FC<{
  sender: string;
  subject: string;
  amount: string;
  style?: React.CSSProperties;
}> = ({ sender, subject, amount, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: SMALL_BILL_W,
        height: SMALL_BILL_H,
        borderRadius: 34,
        background: p.white,
        boxShadow: "0 24px 60px rgba(1,59,255,0.16)",
        padding: "34px 40px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: p.grey, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={34} height={34} viewBox="0 0 24 24">
            <path d="M13 2 4 14h7l-1 8 9-12h-7z" fill={p.blue} />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 36, fontWeight: 600, color: p.ink }}>{sender}</div>
          <div style={{ fontSize: 30, color: p.greyText, marginTop: 2 }}>{subject}</div>
        </div>
      </div>
      <div
        style={{
          marginTop: 30,
          fontFamily: fonts.display,
          fontSize: 66,
          fontWeight: 500,
          letterSpacing: "-0.04em",
          color: p.blue,
        }}
      >
        {amount}
      </div>
    </div>
  );
};

export const REMINDER_W = 640;
export const REMINDER_H = 250;

/** The bill coming back out of the hat as a reminder letter. */
export const ReminderCard: React.FC<{
  label: string;
  sender: string;
  style?: React.CSSProperties;
}> = ({ label, sender, style }) => {
  const p = usePalette();
  return (
    <div
      style={{
        position: "absolute",
        width: REMINDER_W,
        height: REMINDER_H,
        borderRadius: 34,
        background: HAT_INK,
        boxShadow: "0 30px 70px rgba(0,0,0,0.28)",
        padding: "36px 42px",
        boxSizing: "border-box",
        fontFamily: fonts.ui,
        ...style,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "10px 24px",
          borderRadius: 999,
          background: p.red,
          color: p.white,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: 26, fontFamily: fonts.display, fontSize: 52, fontWeight: 500, letterSpacing: "-0.04em", color: p.white }}>
        {sender}
      </div>
      {/* skeleton lines: the rest of the letter */}
      <div style={{ marginTop: 18, display: "flex", gap: 14 }}>
        <div style={{ width: 240, height: 16, borderRadius: 8, background: "#3a3a44" }} />
        <div style={{ width: 150, height: 16, borderRadius: 8, background: "#3a3a44" }} />
      </div>
    </div>
  );
};

/** Pill chip, used for the cost chip, the forwarded label and the scarf chips. */
export const Chip: React.FC<{
  text: string;
  bg: string;
  color: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ text, bg, color, size = 36, style }) => (
  <div
    style={{
      position: "absolute",
      whiteSpace: "nowrap",
      padding: `${size * 0.42}px ${size * 0.8}px`,
      borderRadius: 999,
      background: bg,
      color,
      fontFamily: fonts.ui,
      fontWeight: 600,
      fontSize: size,
      boxShadow: "0 14px 34px rgba(0,0,0,0.16)",
      ...style,
    }}
  >
    {text}
  </div>
);

export const ENVELOPE_W = 640;
export const ENVELOPE_H = 400;

/**
 * Sealed prediction envelope. `open` 0..1 folds the flap up; the card inside
 * is passed as children and drawn between the back and the front pocket.
 */
export const Envelope: React.FC<{
  label: string;
  open: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ label, open, children, style }) => {
  const p = usePalette();
  const W = ENVELOPE_W;
  const H = ENVELOPE_H;
  const flapH = H * 0.56;
  // Flap: pointing down when closed, folded up behind the card when open.
  const flapScale = Math.cos(open * Math.PI);
  const flapBehind = open > 0.5;
  const flap = (
    <svg
      width={W}
      height={flapH}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        overflow: "visible",
        transform: `scaleY(${flapScale})`,
        transformOrigin: "50% 0%",
      }}
    >
      <path d={`M 0 0 L ${W} 0 L ${W / 2} ${flapH} Z`} fill={flapBehind ? "#d5def8" : "#eef2ff"} stroke={p.blueSoft} strokeWidth={3} />
      {!flapBehind ? (
        <g>
          {/* wax seal with a little star */}
          <circle cx={W / 2} cy={flapH - 40} r={40} fill={p.blue} />
          <path
            transform={`translate(${W / 2} ${flapH - 40}) scale(0.34)`}
            d="M0 -50 Q 7 -7 50 0 Q 7 7 0 50 Q -7 7 -50 0 Q -7 -7 0 -50 Z"
            fill={p.white}
          />
        </g>
      ) : null}
    </svg>
  );
  return (
    <div style={{ position: "absolute", width: W, height: H, ...style }}>
      {/* back of the envelope */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "#d5def8" }} />
      {flapBehind ? flap : null}
      {children}
      {/* front pocket */}
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <path
          d={`M 0 ${H * 0.18} L ${W / 2} ${H * 0.62} L ${W} ${H * 0.18} L ${W} ${H - 18} Q ${W} ${H} ${W - 18} ${H} L 18 ${H} Q 0 ${H} 0 ${H - 18} Z`}
          fill="#eef2ff"
          stroke={p.blueSoft}
          strokeWidth={3}
        />
        <text
          x={W / 2}
          y={H - 54}
          textAnchor="middle"
          fontFamily={fonts.display}
          fontSize={40}
          fontWeight={500}
          letterSpacing="0.12em"
          fill={p.blue}
        >
          {label.toUpperCase()}
        </text>
      </svg>
      {!flapBehind ? flap : null}
    </div>
  );
};

/**
 * Theatre drapes at the sides of the frame, `close` 0 = fully open (only the
 * edges show), 1 = shut. Velvet folds via a repeating gradient.
 */
export const Drapes: React.FC<{
  close: number;
  edge?: number;
  color: string;
  dark: string;
  valance?: boolean;
}> = ({ close, edge = 70, color, dark, valance = false }) => {
  const w = edge + (540 - edge) * close;
  const folds = `repeating-linear-gradient(90deg, ${color} 0px, ${color} 34px, ${dark} 60px, ${color} 86px)`;
  const panel = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    [side]: 0,
    width: `${(w / 1080) * 100}%`,
    background: folds,
    boxShadow: side === "left" ? "18px 0 40px rgba(0,0,0,0.25)" : "-18px 0 40px rgba(0,0,0,0.25)",
    // a soft swag: the inner bottom corner is pulled back a little
    borderBottomRightRadius: side === "left" ? `${(1 - close) * 60}% 30%` : 0,
    borderBottomLeftRadius: side === "right" ? `${(1 - close) * 60}% 30%` : 0,
  });
  return (
    <>
      <div style={panel("left")} />
      <div style={panel("right")} />
      {valance ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 70,
            background: `repeating-radial-gradient(circle at 50% -20px, ${color} 0 50px, ${dark} 50px 64px)`,
            backgroundSize: "120px 70px",
          }}
        />
      ) : null}
    </>
  );
};

export const DRAPE = { color: "#0a2bb8", dark: "#061d85" };
