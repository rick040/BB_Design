import { z } from "zod";

// The shared visual library. A template scene holds one `visual`; its `kind`
// picks the component in ./index.tsx. Times inside a visual are in seconds,
// counted from the moment the visual appears.

const icon = z.enum(["new", "warning", "alert"]);

export const billVisual = z.object({
  kind: z.literal("bill"),
  sender: z.string(),
  subject: z.string(),
  amount: z.string(),
  dueLabel: z.string(),
  urgent: z.boolean(),
  /** Stamp text, empty = none. */
  stamp: z.string(),
  stampAt: z.number(),
  /** Pill button under the card ("Al betaald"), empty = none. */
  button: z.string(),
  /** Second at which the button is tapped, -1 = never. */
  tapAt: z.number(),
});

export const inboxVisual = z.object({
  kind: z.literal("inbox"),
  title: z.string(),
  rows: z.array(z.object({ from: z.string(), subject: z.string() })).max(6),
  badgeFrom: z.number(),
  badgeTo: z.number(),
  /** Seconds the unread counter needs to count up. */
  countLen: z.number(),
  /** Row to flag (-1 = none), its label and when. */
  highlight: z.number(),
  highlightLabel: z.string(),
  highlightAt: z.number(),
});

export const notificationsVisual = z.object({
  kind: z.literal("notifications"),
  items: z
    .array(z.object({ title: z.string(), text: z.string(), time: z.string(), icon }))
    .max(3),
  /** Seconds between two notifications. */
  gap: z.number(),
});

export const calendarVisual = z.object({
  kind: z.literal("calendar"),
  month: z.string(),
  calendarName: z.string(),
  /** 0 = the 1st is a Monday … 6 = Sunday. */
  firstWeekday: z.number().min(0).max(6),
  days: z.number().min(28).max(31),
  marks: z
    .array(z.object({ day: z.number(), label: z.string(), tone: z.enum(["blue", "red"]) }))
    .max(3),
  gap: z.number(),
});

export const forwardVisual = z.object({
  kind: z.literal("forward"),
  from: z.string(),
  subject: z.string(),
  to: z.string(),
  /** tap = the forward button gets tapped · address = the address is typed · sent = it flies off. */
  phase: z.enum(["tap", "address", "sent"]),
  button: z.string(),
  /** true = a forwarded mail ("Fwd: …"), false = a new mail ("Onderwerp: …"). */
  fwd: z.boolean(),
});

export const chipsVisual = z.object({
  kind: z.literal("chips"),
  items: z.array(z.string()).max(4),
  buddy: z.boolean(),
});

export const ruleVisual = z.object({
  kind: z.literal("rule"),
  title: z.string(),
  when: z.string(),
  then: z.string(),
});

export const fieldsVisual = z.object({
  kind: z.literal("fields"),
  title: z.string(),
  rows: z
    .array(z.object({ label: z.string(), value: z.string(), kept: z.boolean() }))
    .max(5),
  gap: z.number(),
});

export const clockVisual = z.object({
  kind: z.literal("clock"),
  time: z.string(),
  caption: z.string(),
});

export const buddyVisual = z.object({
  kind: z.literal("buddy"),
  text: z.string(),
  mood: z.enum(["idle", "happy"]),
});

export const bigVisual = z.object({
  kind: z.literal("big"),
  text: z.string(),
  sub: z.string(),
  check: z.boolean(),
});

export const mailVisual = z.object({
  kind: z.literal("mail"),
  from: z.string(),
  subject: z.string(),
  /** The tiny grey line at the bottom (the due date nobody finds). */
  tinyLine: z.string(),
  findAt: z.number(),
});

export const overviewVisual = z.object({
  kind: z.literal("overview"),
  title: z.string(),
  rows: z
    .array(z.object({ label: z.string(), amount: z.string(), due: z.string() }))
    .max(4),
  footer: z.string(),
});

export const rulesVisual = z.object({
  kind: z.literal("rules"),
  /** Invoice lines; the ones that match an item get highlighted. */
  lines: z.array(z.object({ label: z.string(), value: z.string() })).max(6),
  items: z.array(z.object({ label: z.string(), rule: z.string() })).max(3),
  /** Highlight items 0..upTo (the last one animates in). */
  upTo: z.number(),
});

export const linesVisual = z.object({
  kind: z.literal("lines"),
  title: z.string(),
  items: z
    .array(
      z.object({
        text: z.string(),
        tone: z.enum(["plain", "strike", "good", "bad", "muted"]),
      }),
    )
    .max(6),
  gap: z.number(),
});

export const visualSchema = z.discriminatedUnion("kind", [
  billVisual,
  inboxVisual,
  notificationsVisual,
  calendarVisual,
  forwardVisual,
  chipsVisual,
  ruleVisual,
  fieldsVisual,
  clockVisual,
  buddyVisual,
  bigVisual,
  mailVisual,
  overviewVisual,
  rulesVisual,
  linesVisual,
]);

export type Visual = z.infer<typeof visualSchema>;
export type VisualOf<K extends Visual["kind"]> = Extract<Visual, { kind: K }>;
