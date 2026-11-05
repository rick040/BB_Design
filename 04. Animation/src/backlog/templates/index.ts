import type React from "react";
import type { z } from "zod";
import { CountdownTpl, countdownTplSchema, countdownTplTotal, type CountdownTplProps } from "./Countdown";
import { Explainer, explainerSchema, explainerTotal, type ExplainerProps } from "./Explainer";
import { List, listSchema, listTotal, type ListProps } from "./List";
import { MythFact, mythSchema, mythTotal, type MythProps } from "./MythFact";
import { NumberReveal, numberSchema, numberTotal, type NumberProps } from "./NumberReveal";
import { Pov, povSchema, povTotal, type PovProps } from "./Pov";
import { Skit, skitSchema, skitTotal, type SkitProps } from "./Skit";
import { Split, splitSchema, splitTotal, type SplitProps } from "./Split";

// The eight backlog templates, one per format. A video = a template + props.
type Tpl<P> = {
  label: string;
  component: React.FC<P>;
  schema: z.ZodType<P>;
  total: (p: P) => number;
};

export const TEMPLATES = {
  pov: { label: "POV", component: Pov, schema: povSchema, total: povTotal } as Tpl<PovProps>,
  list: { label: "Dingen die niemand je vertelt", component: List, schema: listSchema, total: listTotal } as Tpl<ListProps>,
  split: { label: "Voor/na", component: Split, schema: splitSchema, total: splitTotal } as Tpl<SplitProps>,
  countdown: { label: "Countdown", component: CountdownTpl, schema: countdownTplSchema, total: countdownTplTotal } as Tpl<CountdownTplProps>,
  myth: { label: "Mythe vs feit", component: MythFact, schema: mythSchema, total: mythTotal } as Tpl<MythProps>,
  explainer: { label: "Mini-explainer", component: Explainer, schema: explainerSchema, total: explainerTotal } as Tpl<ExplainerProps>,
  skit: { label: "Skit", component: Skit, schema: skitSchema, total: skitTotal } as Tpl<SkitProps>,
  number: { label: "Getallen-reveal", component: NumberReveal, schema: numberSchema, total: numberTotal } as Tpl<NumberProps>,
};

export type TemplateKey = keyof typeof TEMPLATES;

export type PropsOf = {
  pov: PovProps;
  list: ListProps;
  split: SplitProps;
  countdown: CountdownTplProps;
  myth: MythProps;
  explainer: ExplainerProps;
  skit: SkitProps;
  number: NumberProps;
};
