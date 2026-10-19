import React, { useLayoutEffect, useRef, useState } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../../lib/anim";
import { SCREEN_W } from "../layout";

type Pt = { x: number; y: number };

/**
 * Centre of the element marked data-tap="<target>" on the same phone screen
 * as `anchor`, in screen px. Measured every frame, so it follows scrolling
 * and sheets. (The anchor's own DOM node is used to find the screen, since a
 * parent's ref is not attached yet when a child's first layout effect runs.)
 */
export const useTarget = (target: string, anchor: React.RefObject<HTMLElement | null>): Pt | null => {
  const [pt, setPt] = useState<Pt | null>(null);
  useLayoutEffect(() => {
    const screen = anchor.current?.closest("[data-screen]");
    const el = screen?.querySelector(`[data-tap="${target}"]`);
    if (!screen || !el) return;
    const s = screen.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const k = s.width / SCREEN_W;
    const next = { x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k };
    if (!pt || Math.abs(pt.x - next.x) > 0.25 || Math.abs(pt.y - next.y) > 0.25) setPt(next);
  });
  return pt;
};

/** 0..1..0 bump around a tap, for the tapped element to press in. */
export const pressed = (frame: number, at: number, hold = 0) =>
  interpolate(frame, [at - 3, at, at + hold + 2, at + hold + 7], [0, 1, 1, 0], clamp);

/**
 * A fingertip: glides in, presses (optionally holds for a long press) and
 * leaves a ripple. `at` is the frame of the press.
 */
export const Tap: React.FC<{
  target: string;
  at: number;
  hold?: number;
  /** Offset from the element centre in screen px. */
  dx?: number;
  dy?: number;
}> = ({ target, at, hold = 0, dx = 0, dy = 0 }) => {
  const frame = useCurrentFrame();
  const anchor = useRef<HTMLDivElement | null>(null);
  const pt = useTarget(target, anchor);
  const t = frame - at;
  const visible = pt && t >= -12 && t <= hold + 14;
  return (
    <div ref={anchor} style={{ position: "absolute", left: 0, top: 0, zIndex: 40, pointerEvents: "none" }}>
      {visible ? <Finger pt={pt} t={t} hold={hold} press={pressed(frame, at, hold)} dx={dx} dy={dy} /> : null}
    </div>
  );
};

const Finger: React.FC<{ pt: Pt; t: number; hold: number; press: number; dx: number; dy: number }> = ({
  pt,
  t,
  hold,
  press,
  dx,
  dy,
}) => {
  const approach = interpolate(t, [-12, -2], [1, 0], { ...clamp, easing: (x) => 1 - Math.pow(1 - x, 3) });
  const opacity = interpolate(t, [-12, -7, hold + 6, hold + 12], [0, 1, 1, 0], clamp);
  const ripple = interpolate(t, [0, 14], [0, 1], clamp);
  const x = pt.x + dx + approach * 26;
  const y = pt.y + dy + approach * 40;

  return (
    <>
      {t >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: pt.x + dx - 34,
            top: pt.y + dy - 34,
            width: 68,
            height: 68,
            borderRadius: "50%",
            border: "3px solid rgba(1,59,255,.55)",
            transform: `scale(${0.4 + ripple * 0.9})`,
            opacity: (1 - ripple) * 0.9,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: x - 21,
          top: y - 21,
          width: 42,
          height: 42,
          borderRadius: "50%",
          background: "rgba(17,24,39,.28)",
          border: "2.5px solid rgba(255,255,255,.95)",
          boxShadow: "0 6px 16px rgba(17,24,39,.25)",
          transform: `scale(${1 - press * 0.2})`,
          opacity,
        }}
      />
    </>
  );
};
