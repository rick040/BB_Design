import React from "react";
import { lin, sp } from "./Card";
import {
  BillVisual,
  CalendarVisual,
  FieldsVisual,
  ForwardVisual,
  InboxVisual,
  LinesVisual,
  MailVisual,
  NotificationsVisual,
  OverviewVisual,
  RulesVisual,
  RuleVisual,
} from "./CardVisuals";
import { BigVisual, BuddyVisual, ChipsVisual, ClockVisual } from "./FigureVisuals";
import type { Visual } from "./schema";

export { visualSchema, type Visual, type VisualOf } from "./schema";

/**
 * Renders one visual from the library inside a <Stage>. `t` = frames since the
 * visual appeared (negative = not yet). `enter` = whether it pops in or is
 * already there (frame-0 hooks).
 */
export const VisualView: React.FC<{ v: Visual; t: number; onBlue: boolean; enter?: boolean; exitAt?: number }> = ({
  v,
  t,
  onBlue,
  enter = true,
  exitAt,
}) => {
  if (t < 0) return null;
  const s = enter ? sp(t, 0, 15, 160) : 1;
  const out = exitAt !== undefined ? lin(t, exitAt, exitAt + 8) : 0;
  const props = { t, onBlue };
  let node: React.ReactNode = null;
  switch (v.kind) {
    case "bill": node = <BillVisual v={v} {...props} />; break;
    case "inbox": node = <InboxVisual v={v} {...props} />; break;
    case "notifications": node = <NotificationsVisual v={v} {...props} />; break;
    case "calendar": node = <CalendarVisual v={v} {...props} />; break;
    case "forward": node = <ForwardVisual v={v} {...props} />; break;
    case "chips": node = <ChipsVisual v={v} {...props} />; break;
    case "rule": node = <RuleVisual v={v} {...props} />; break;
    case "fields": node = <FieldsVisual v={v} {...props} />; break;
    case "clock": node = <ClockVisual v={v} {...props} />; break;
    case "buddy": node = <BuddyVisual v={v} {...props} />; break;
    case "big": node = <BigVisual v={v} {...props} />; break;
    case "mail": node = <MailVisual v={v} {...props} />; break;
    case "overview": node = <OverviewVisual v={v} {...props} />; break;
    case "rules": node = <RulesVisual v={v} {...props} />; break;
    case "lines": node = <LinesVisual v={v} {...props} />; break;
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: Math.min(1, s * 1.6) * (1 - out),
        transform: `translateY(${(1 - s) * 60 + out * -40}px) scale(${0.94 + 0.06 * s})`,
      }}
    >
      {node}
    </div>
  );
};
