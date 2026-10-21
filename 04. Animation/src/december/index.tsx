import React from "react";
import { Folder } from "remotion";
import { Dec01PakketjesCompositions } from "./d01-pakketjes/compositions";
import { Dec02AdventCompositions } from "./d02-advent/compositions";
import { Dec03SintCompositions } from "./d03-sint/compositions";
import { Dec04RijmCompositions } from "./d04-rijm/compositions";
import { Dec05LijstjesCompositions } from "./d05-lijstjes/compositions";
import { Dec06BriefCompositions } from "./d06-brief/compositions";
import { Dec07AgendaCompositions } from "./d07-agenda/compositions";
import { Dec08AftellenCompositions } from "./d08-aftellen/compositions";
import { Dec09RustCompositions } from "./d09-rust/compositions";
import { Dec10BingoCompositions } from "./d10-bingo/compositions";
import { Dec11KerstkaartCompositions } from "./d11-kerstkaart/compositions";
import { Dec12VriendCompositions } from "./d12-vriend/compositions";
import { Dec13JanuariCompositions } from "./d13-januari/compositions";
import { Dec14RareWeekCompositions } from "./d14-rare-week/compositions";
import { Dec15Aftellen2027Compositions } from "./d15-2027/compositions";
import { Dec16VoornemenCompositions } from "./d16-voornemen/compositions";

// Decembercampagne "Buddy houdt het lijstje bij": 16 ideeën, elk in een eigen map.
export const DecemberCompositions: React.FC = () => (
  <Folder name="December-Lijstje">
    <Dec01PakketjesCompositions />
    <Dec02AdventCompositions />
    <Dec03SintCompositions />
    <Dec04RijmCompositions />
    <Dec05LijstjesCompositions />
    <Dec06BriefCompositions />
    <Dec07AgendaCompositions />
    <Dec08AftellenCompositions />
    <Dec09RustCompositions />
    <Dec10BingoCompositions />
    <Dec11KerstkaartCompositions />
    <Dec12VriendCompositions />
    <Dec13JanuariCompositions />
    <Dec14RareWeekCompositions />
    <Dec15Aftellen2027Compositions />
    <Dec16VoornemenCompositions />
  </Folder>
);
