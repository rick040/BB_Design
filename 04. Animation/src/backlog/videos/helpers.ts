import { type BaseProps, baseDefaults, type EndCardProps } from "../common";
import type { PropsOf, TemplateKey } from "../templates";
import type { Visual, VisualOf } from "../visuals";

export const PILLARS = {
  P1: "Herkenning",
  P2: "Zo werkt het",
  P3: "Privacy",
  P4: "Geld en gevolgen",
  P5: "Mythes en bezwaren",
  P6: "Humor",
} as const;
export type PillarKey = keyof typeof PILLARS;

/** One video in the backlog: a template + its props, plus catalogue info. */
export type Entry = {
  [K in TemplateKey]: {
    id: string; // BB-P1-01 (the Reel composition gets -Reel, the feed version -Feed)
    num: number; // topic number from the approved list
    pillar: PillarKey;
    title: string;
    template: K;
    props: PropsOf[K];
    feed: boolean;
    /** Frame used for the cover PNG. */
    cover: number;
  };
}[TemplateKey];

export const base = (end: Partial<EndCardProps> = {}): BaseProps => baseDefaults(end);

// Short constructors for the visual library, with sensible defaults.
export const bill = (v: Partial<VisualOf<"bill">> & Pick<VisualOf<"bill">, "sender" | "subject" | "amount" | "dueLabel">): Visual => ({
  kind: "bill",
  urgent: false,
  stamp: "",
  stampAt: 0,
  button: "",
  tapAt: -1,
  ...v,
});
export const lines = (title: string, items: [string, VisualOf<"lines">["items"][number]["tone"]][], gap = 0.3): Visual => ({
  kind: "lines",
  title,
  items: items.map(([text, tone]) => ({ text, tone })),
  gap,
});
export const fields = (title: string, rows: [string, string, boolean][], gap = 0.3): Visual => ({
  kind: "fields",
  title,
  rows: rows.map(([label, value, kept]) => ({ label, value, kept })),
  gap,
});
export const notes = (items: [string, VisualOf<"notifications">["items"][number]["icon"], string][], gap = 0.8, title = "BetaalBuddy"): Visual => ({
  kind: "notifications",
  items: items.map(([text, icon, time]) => ({ title, text, icon, time })),
  gap,
});
export const calendar = (
  month: string,
  firstWeekday: number,
  days: number,
  marks: [number, string][],
  gap = 0.5,
): Visual => ({
  kind: "calendar",
  month,
  calendarName: "Facturen",
  firstWeekday,
  days,
  marks: marks.map(([day, label]) => ({ day, label, tone: "blue" as const })),
  gap,
});
export const big = (text: string, sub = "", check = false): Visual => ({ kind: "big", text, sub, check });
export const buddy = (text = "", mood: "idle" | "happy" = "happy"): Visual => ({ kind: "buddy", text, mood });
export const chips = (items: string[], withBuddy = true): Visual => ({ kind: "chips", items, buddy: withBuddy });

// Calendar months used in the backlog (0 = the 1st is a Monday).
export const NOV_2026 = { month: "November", first: 6, days: 30 };
export const DEC_2026 = { month: "December", first: 1, days: 31 };
