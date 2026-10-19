import React from "react";

// The page's own icon set (the <symbol>s in /stel-je-buddy-in/), plus a few
// neutral mail-app glyphs. All stroke icons use currentColor.
type P = { size: number; style?: React.CSSProperties };

const Svg: React.FC<P & { children: React.ReactNode }> = ({ size, style, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", flex: "none", ...style }} aria-hidden>
    {children}
  </svg>
);
const stroke = { fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const InfoIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 11v6M12 7.2v.6" {...stroke} strokeWidth={2.6} />
  </Svg>
);
export const CheckIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 12.5l4.2 4.2L19 7" {...stroke} strokeWidth={3} />
  </Svg>
);
export const ArrowIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" {...stroke} strokeWidth={2.2} />
  </Svg>
);
export const CopyIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2.5" {...stroke} strokeWidth={2} />
    <path d="M16 8V6.5A2.5 2.5 0 0013.5 4h-7A2.5 2.5 0 004 6.5v7A2.5 2.5 0 006.5 16H8" {...stroke} strokeWidth={2} />
  </Svg>
);
export const MailIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" {...stroke} strokeWidth={2} />
    <path d="M4 7l8 6 8-6" {...stroke} strokeWidth={2} />
  </Svg>
);
export const CalIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" {...stroke} strokeWidth={2} />
    <path d="M3.5 10h17M8 3v4M16 3v4" {...stroke} strokeWidth={2} />
  </Svg>
);
export const ExtIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h4" {...stroke} strokeWidth={2} />
  </Svg>
);

// Mail app glyphs.
export const ChevronLeft: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M15 5l-7 7 7 7" {...stroke} strokeWidth={2.4} />
  </Svg>
);
export const ReplyIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M10 6l-6 6 6 6M4.5 12H14a6 6 0 016 6" {...stroke} strokeWidth={2} />
  </Svg>
);
export const ForwardIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M14 6l6 6-6 6M19.5 12H10a6 6 0 00-6 6" {...stroke} strokeWidth={2} />
  </Svg>
);
export const TrashIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M9.5 7V4.8h5V7M6.5 7l1 12.2h9l1-12.2M10 10.5v5.5M14 10.5v5.5" {...stroke} strokeWidth={1.9} />
  </Svg>
);
export const SendIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M12 19V6M6.5 11.5L12 6l5.5 5.5" {...stroke} strokeWidth={2.6} />
  </Svg>
);
export const PencilIcon: React.FC<P> = (p) => (
  <Svg {...p}>
    <path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4" {...stroke} strokeWidth={2} />
  </Svg>
);
