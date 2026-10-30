import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import React from "react";
import { AbsoluteFill, Easing, interpolate } from "remotion";

// Two CSS-only transitions for the "handleiding" concept (concept 30).
// Like focusPull they use transforms and clip paths only, so they render the
// same in a headless browser as in Studio.

const ease = Easing.inOut(Easing.cubic);

// ── unfold ─────────────────────────────────────────────────────────────────
// The new scene unfolds like a folded instruction sheet: two halves hinge
// open from the horizontal centre line. The old scene dims a little behind it.
type UnfoldProps = { perspective: number };

const UnfoldPresentation: React.FC<TransitionPresentationComponentProps<UnfoldProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  const p = ease(presentationProgress);
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ transform: `scale(${1 - 0.05 * p})`, filter: `brightness(${1 - 0.25 * p})` }}>
        {children}
      </AbsoluteFill>
    );
  }
  const angle = (1 - p) * 92;
  // Fold crease shading: the halves are darker while they are still edge-on.
  const shade = (1 - p) * 0.45;
  const half = (top: boolean): React.CSSProperties => ({
    clipPath: top ? "inset(0 0 50% 0)" : "inset(50% 0 0 0)",
    transform: `perspective(${passedProps.perspective}px) rotateX(${top ? angle : -angle}deg)`,
    transformOrigin: "50% 50%",
    backfaceVisibility: "hidden",
  });
  return (
    <AbsoluteFill>
      {[true, false].map((top) => (
        <AbsoluteFill key={String(top)} style={half(top)}>
          {children}
          <AbsoluteFill style={{ background: "#000", opacity: shade, pointerEvents: "none" }} />
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

export const unfold = (props?: Partial<UnfoldProps>): TransitionPresentation<UnfoldProps> => ({
  component: UnfoldPresentation,
  props: { perspective: 2200, ...props },
});

// ── assemble ───────────────────────────────────────────────────────────────
// The new scene arrives as four quarters that slide in from the corners and
// click together in the middle, like parts of a flat-pack. A small overshoot
// at the end sells the "klik".
type AssembleProps = { distance: number };

const QUARTERS = [
  { clip: "inset(0 50% 50% 0)", dx: -1, dy: -1 },
  { clip: "inset(0 0 50% 50%)", dx: 1, dy: -1 },
  { clip: "inset(50% 50% 0 0)", dx: -1, dy: 1 },
  { clip: "inset(50% 0 0 50%)", dx: 1, dy: 1 },
];

const AssemblePresentation: React.FC<TransitionPresentationComponentProps<AssembleProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
  passedProps,
}) => {
  if (presentationDirection === "exiting") {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }
  const t = presentationProgress;
  // Quarters travel in over the first 85%, then a short squeeze = the click.
  const travel = Easing.out(Easing.cubic)(Math.min(1, t / 0.85));
  const click = interpolate(t, [0.85, 0.92, 1], [1, 0.985, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ transform: `scale(${click})` }}>
      {QUARTERS.map((q, i) => (
        <AbsoluteFill
          key={i}
          style={{
            clipPath: q.clip,
            transform: `translate(${q.dx * (1 - travel) * passedProps.distance}%, ${
              q.dy * (1 - travel) * passedProps.distance
            }%) rotate(${q.dx * q.dy * (1 - travel) * 6}deg)`,
          }}
        >
          {children}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

export const assemble = (props?: Partial<AssembleProps>): TransitionPresentation<AssembleProps> => ({
  component: AssemblePresentation,
  props: { distance: 60, ...props },
});
