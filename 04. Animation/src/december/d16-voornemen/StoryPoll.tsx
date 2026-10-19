import React from "react";
import { Buddy, BUDDY_RATIO } from "../../components/Buddy";
import { PaletteProvider } from "../../lib/palette";
import { StaticPage } from "../StaticPage";
import { dec, decFonts } from "../theme";
import { brand } from "../../theme";
import { GoalCard, GoalRow } from "./GoalRow";
import type { VoornemenStoryProps } from "./schema";

// Story-poll (1080 × 1920): de vraag boven, de drie balken in het midden en ruimte
// (y 1180 t/m 1460) voor de poll-sticker van Instagram zelf.
export const StoryPoll: React.FC<VoornemenStoryProps> = (props) => (
  <PaletteProvider colors={props.colors}>
    <StaticPage tone="blue" chip={props.chip}>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 250,
          fontFamily: decFonts.display,
          fontSize: 96,
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
          color: dec.white,
          whiteSpace: "pre-line",
        }}
      >
        {props.question}
      </div>
      <GoalCard width={900} style={{ position: "absolute", left: 90, top: 740 }}>
        {props.goals.map((g, i) => (
          <GoalRow key={i} label={g.label} shown={g.pct} fill={g.pct} width={820} />
        ))}
      </GoalCard>
      <Buddy
        size={190}
        body={dec.white}
        eye={brand.blueMascot}
        look={{ x: -0.5, y: 0.4 }}
        style={{ position: "absolute", left: 800, top: 740 - 190 * BUDDY_RATIO + 8 }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1210,
          fontFamily: decFonts.text,
          fontWeight: 600,
          fontSize: 38,
          color: dec.softBlue,
        }}
      >
        {props.hint}
      </div>
    </StaticPage>
  </PaletteProvider>
);
