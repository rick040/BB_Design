import React from "react";
import { interpolate } from "remotion";
import { clamp } from "../../lib/anim";
import { usePalette } from "../../lib/palette";
import { fonts } from "../../theme";

// An open agenda book seen from the front, with pages that turn around the
// spine (CSS 3D, no WebGL). Sizes are in stage pixels.
export const BOOK_W = 1000;
export const BOOK_H = 760;
export const PAGE_W = BOOK_W / 2 - 20;
export const PAGE_H = BOOK_H - 40;
const PAGE_Y = 20;
const SPINE_X = BOOK_W / 2;

const paper = "#ffffff";
const paperShade = "#f1f4fb";
const lineColor = "#e3e8f4";

/** Ruled lines, used on the left page and the backs of turning pages. */
const Ruled: React.FC<{ mirrored?: boolean }> = ({ mirrored }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    {Array.from({ length: 11 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: mirrored ? 30 : 46,
          right: mirrored ? 46 : 30,
          top: 110 + i * 56,
          height: 3,
          borderRadius: 2,
          background: lineColor,
        }}
      />
    ))}
  </div>
);

const pageBase = (left: boolean): React.CSSProperties => ({
  position: "absolute",
  inset: 0,
  background: `linear-gradient(${left ? "270deg" : "90deg"}, ${paperShade} 0%, ${paper} 14%)`,
  borderRadius: left ? "18px 4px 4px 18px" : "4px 18px 18px 4px",
  overflow: "hidden",
});

/** One right-hand agenda page: a day label and an entry. */
export const DayPage: React.FC<{ day: string; entry: string }> = ({ day, entry }) => {
  const p = usePalette();
  return (
    <div style={pageBase(false)}>
      <Ruled />
      <div style={{ position: "absolute", left: 56, top: 40, fontFamily: fonts.ui, fontWeight: 600, fontSize: 40, color: p.greyText }}>
        {day}
      </div>
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 30,
          top: 160,
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 56,
          letterSpacing: "-0.03em",
          color: p.ink,
        }}
      >
        {entry}
      </div>
    </div>
  );
};

/** The page with the bill on it (the one you skip). */
export const BillPage: React.FC<{
  day: string;
  title: string;
  sender: string;
  amount: string;
  due: string;
  glow?: number;
}> = ({ day, title, sender, amount, due, glow = 0 }) => {
  const p = usePalette();
  return (
    <div style={pageBase(false)}>
      <Ruled />
      <div style={{ position: "absolute", left: 56, top: 40, fontFamily: fonts.ui, fontWeight: 600, fontSize: 40, color: p.greyText }}>
        {day}
      </div>
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 26,
          top: 130,
          padding: "34px 26px 38px",
          borderRadius: 26,
          background: p.white,
          border: `4px solid ${p.blue}`,
          boxShadow: `0 0 0 ${10 * glow}px rgba(255, 206, 49, ${0.55 * glow}), 0 14px 30px rgba(1, 59, 255, 0.12)`,
        }}
      >
        <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 36, color: p.blue }}>{title}</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 36, letterSpacing: "-0.03em", color: p.ink, marginTop: 8 }}>
          {sender}
        </div>
        <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 84, letterSpacing: "-0.04em", color: p.blue, marginTop: 16 }}>
          {amount}
        </div>
        <div style={{ fontFamily: fonts.ui, fontWeight: 500, fontSize: 36, color: p.greyText, marginTop: 10 }}>vervalt {due}</div>
      </div>
    </div>
  );
};

/** The final page in the hook: the reminder letter you did get. */
export const NoticePage: React.FC<{ title: string; sender: string; amount: string }> = ({ title, sender, amount }) => {
  const p = usePalette();
  return (
    <div style={{ ...pageBase(false), background: "#fff4f6" }}>
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 34,
          top: 70,
          bottom: 70,
          borderRadius: 26,
          background: p.red,
          padding: "40px 34px",
          color: p.white,
        }}
      >
        <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 34, opacity: 0.9 }}>{sender}</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 64, letterSpacing: "-0.05em", lineHeight: 1, marginTop: 22 }}>
          {title}
        </div>
        <div style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 80, letterSpacing: "-0.04em", marginTop: 40 }}>{amount}</div>
        <div style={{ position: "absolute", left: 34, right: 34, bottom: 46 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.35)", marginTop: 16, width: `${92 - i * 22}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
};

/** The page Buddy keeps: the reminder in your agenda. */
export const ReminderPage: React.FC<{
  day: string;
  label: string;
  sender: string;
  amount: string;
  note: string;
  reveal: number;
}> = ({ day, label, sender, amount, note, reveal }) => {
  const p = usePalette();
  const r = Math.max(0, Math.min(1, reveal));
  return (
    <div style={pageBase(false)}>
      <Ruled />
      <div style={{ position: "absolute", left: 56, top: 40, fontFamily: fonts.ui, fontWeight: 600, fontSize: 40, color: p.blue }}>
        {day}
      </div>
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 26,
          top: 140,
          padding: "34px 26px 38px",
          borderRadius: 26,
          background: p.blue,
          color: p.white,
          opacity: Math.min(1, r * 1.5),
          transform: `translateY(${(1 - r) * 40}px) scale(${0.9 + 0.1 * r})`,
        }}
      >
        <div style={{ fontFamily: fonts.ui, fontWeight: 600, fontSize: 36, color: p.blueSoft }}>{label}</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 500, fontSize: 36, letterSpacing: "-0.03em", marginTop: 8 }}>{sender}</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 80, letterSpacing: "-0.04em", marginTop: 14 }}>{amount}</div>
        <div
          style={{
            display: "inline-block",
            marginTop: 20,
            padding: "10px 24px",
            borderRadius: 40,
            background: p.yellow,
            color: p.ink,
            fontFamily: fonts.ui,
            fontWeight: 600,
            fontSize: 36,
          }}
        >
          {note}
        </div>
      </div>
    </div>
  );
};

/**
 * Open book. `pages` are the right-hand pages in order; `flips[i]` is the
 * frame at which page i starts to turn over to reveal page i + 1.
 */
export const OpenBook: React.FC<{
  frame: number;
  pages: React.ReactNode[];
  flips: number[];
  flipLen: number;
  cover: string;
  style?: React.CSSProperties;
  /** Drawn on top of the left page (e.g. a note). */
  leftContent?: React.ReactNode;
}> = ({ frame, pages, flips, flipLen, cover, style, leftContent }) => {
  const started = flips.filter((f) => frame >= f).length;
  const base = Math.min(started, pages.length - 1);
  const turning = flips
    .map((f, i) => ({ i, t: interpolate(frame, [f, f + flipLen], [0, 1], clamp) }))
    .filter(({ t }) => t > 0 && t < 1);

  return (
    <div style={{ position: "absolute", width: BOOK_W, height: BOOK_H, ...style }}>
      {/* Cover behind the pages */}
      <div
        style={{
          position: "absolute",
          left: -14,
          right: -14,
          top: 0,
          bottom: -14,
          borderRadius: 30,
          background: cover,
          boxShadow: "0 30px 60px rgba(1, 30, 120, 0.25)",
        }}
      />
      {/* Page block edges */}
      <div style={{ position: "absolute", left: 4, right: 4, top: PAGE_Y + 8, bottom: 2, borderRadius: 20, background: "#dfe5f3" }} />

      {/* Left page */}
      <div style={{ position: "absolute", left: 20, top: PAGE_Y, width: PAGE_W, height: PAGE_H }}>
        <div style={pageBase(true)}>
          <Ruled mirrored />
          {leftContent}
        </div>
      </div>

      {/* Right page underneath */}
      <div style={{ position: "absolute", left: SPINE_X, top: PAGE_Y, width: PAGE_W, height: PAGE_H }}>{pages[base]}</div>

      {/* Turning pages */}
      <div style={{ position: "absolute", inset: 0, perspective: 2600, perspectiveOrigin: "50% 40%" }}>
        {turning.map(({ i, t }) => {
          const deg = -180 * t;
          const shade = Math.sin(Math.PI * t);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: SPINE_X,
                top: PAGE_Y,
                width: PAGE_W,
                height: PAGE_H,
                transformOrigin: "0% 50%",
                transformStyle: "preserve-3d",
                transform: `rotateY(${deg}deg)`,
              }}
            >
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>
                {pages[Math.min(i, pages.length - 1)]}
                <div style={{ position: "absolute", inset: 0, background: "#0b1a4a", opacity: shade * 0.22, borderRadius: "4px 18px 18px 4px" }} />
              </div>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <div style={pageBase(true)}>
                  <Ruled mirrored />
                </div>
                <div style={{ position: "absolute", inset: 0, background: "#0b1a4a", opacity: shade * 0.12, borderRadius: "18px 4px 4px 18px" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Spine shadow */}
      <div
        style={{
          position: "absolute",
          left: SPINE_X - 22,
          width: 44,
          top: PAGE_Y,
          height: PAGE_H,
          background: "linear-gradient(90deg, rgba(11,26,74,0) 0%, rgba(11,26,74,0.16) 50%, rgba(11,26,74,0) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

/** A closed book standing up, seen from the front. Children render behind it (e.g. Buddy as the bookmark). */
export const CLOSED_W = 420;
export const CLOSED_H = 540;
export const ClosedBook: React.FC<{
  title: string;
  cover: string;
  titleColor: string;
  style?: React.CSSProperties;
  behind?: React.ReactNode;
  ribbon?: string;
  ribbonIn?: number;
}> = ({ title, cover, titleColor, style, behind, ribbon, ribbonIn = 0 }) => (
  <div style={{ position: "absolute", width: CLOSED_W, height: CLOSED_H, ...style }}>
    {behind}
    {/* Page block peeking out on top and right */}
    <div style={{ position: "absolute", left: 22, right: 0, top: 0, bottom: 14, borderRadius: "10px 18px 18px 10px", background: "#eef2fb" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", right: 4, top: 30 + i * 100, width: 4, height: 70, background: "#d7deef", borderRadius: 2 }} />
      ))}
    </div>
    {/* Cover */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 14,
        top: 12,
        bottom: 0,
        borderRadius: "14px 22px 22px 14px",
        background: cover,
        boxShadow: "0 26px 50px rgba(1, 20, 90, 0.3)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 40, background: "rgba(0,0,0,0.08)" }} />
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 0,
          top: 150,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 500,
          fontSize: 62,
          letterSpacing: "-0.05em",
          color: titleColor,
        }}
      >
        {title}
      </div>
      <div style={{ position: "absolute", left: 120, right: 80, top: 250, height: 6, borderRadius: 3, background: titleColor, opacity: 0.35 }} />
    </div>
    {/* Ribbon tail under the book */}
    {ribbon ? (
      <div
        style={{
          position: "absolute",
          left: CLOSED_W / 2 - 20,
          top: CLOSED_H - 4,
          width: 40,
          height: 90 * ribbonIn,
          background: ribbon,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%)",
        }}
      />
    ) : null}
  </div>
);
