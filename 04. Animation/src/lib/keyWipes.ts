import type React from "react";

// CSS-only transitions for concept 72 (sleutel). No WebGL.

const KEYHOLE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="38" r="22" fill="#000"/><polygon points="40,50 60,50 70,96 30,96" fill="#000"/></svg>',
  );

const c01 = (p: number) => Math.max(0, Math.min(1, p));

/** Keyhole: the new scene opens through a growing keyhole in the centre. */
export const keyholeOpen = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  const size = 9000 * Math.pow(p, 2.4);
  const m = {
    WebkitMaskImage: `url("${KEYHOLE}")`,
    maskImage: `url("${KEYHOLE}")`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "50% 50%",
    maskPosition: "50% 50%",
    WebkitMaskSize: `${size}px ${size}px`,
    maskSize: `${size}px ${size}px`,
  };
  return m as React.CSSProperties;
};

/** Deadbolt: the new scene slides in from the right and locks with a small kick. */
export const boltSlide = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  // ease-out-back
  const c1 = 1.4;
  const e = 1 + (c1 + 1) * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
  return { transform: `translateX(${(1 - e) * 100}%)` };
};

/** Letterbox: the new scene opens from a thin horizontal slit, like a letterbox flap. */
export const slotOpen = (progress: number): React.CSSProperties => {
  const p = c01(progress);
  const e = 1 - Math.pow(1 - p, 3);
  const inset = (1 - e) * 48.5;
  return { clipPath: `inset(${inset}% 0 ${inset}% 0 round 40px)` };
};
