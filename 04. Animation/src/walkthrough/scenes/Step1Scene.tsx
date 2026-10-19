import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../../lib/anim";
import { ArrowIcon, MailIcon } from "../components/Icons";
import { Phone } from "../components/Phone";
import { StepPanel } from "../components/StepPanel";
import { pressed, Tap } from "../components/Tap";
import type { WalkthroughProps } from "../schema";
import { Compose, Sheet, Token } from "../screens/mail";
import { Btn, CopyField, Eyebrow, H2, Label, Lead, Nav, Note, PageScreen, Tiny } from "../screens/page";
import { bb } from "../tokens";

// Timeline (frames, scene-local).
export const STEP1_T = {
  item1: 14, // "Tik op Open mijn mail" lights up
  tapOpen: 46, // tap on "Open mijn mail"
  sheet: 52, // the prepared mail slides up
  sheetLen: 16,
  item1Done: 62,
  item2: 74, // "Druk op Verstuur" lights up
  note: 92, // note "Belangrijk", the "Van" row gets marked
  tapSend: 158, // tap on send
  sheetDown: 164,
  item2Done: 172,
  scroll: 192, // page scrolls down to the next-step button
  scrollLen: 22,
  tapNext: 236, // tap "Verstuurd, volgende stap"
};

export const Step1Scene: React.FC<{ props: WalkthroughProps["step1"]; example: WalkthroughProps["example"] }> = ({
  props,
  example,
}) => {
  const frame = useCurrentFrame();
  const T = STEP1_T;
  const ease = (x: number) => 1 - Math.pow(1 - x, 3);

  const sheet =
    interpolate(frame, [T.sheet, T.sheet + T.sheetLen], [0, 1], { ...clamp, easing: ease }) -
    interpolate(frame, [T.sheetDown, T.sheetDown + T.sheetLen], [0, 1], { ...clamp, easing: ease });
  const mark = interpolate(frame, [T.note, T.note + 10, T.tapSend - 6, T.tapSend], [0, 1, 1, 0], clamp);
  const scroll = interpolate(frame, [T.scroll, T.scroll + T.scrollLen], [0, 236], {
    ...clamp,
    easing: (x) => x * x * (3 - 2 * x),
  });
  const nextDone = frame >= T.tapNext + 4;

  return (
    <AbsoluteFill style={{ background: bb.bg }}>
      <StepPanel
        step={1}
        title={props.title}
        items={[
          { text: props.items[0], at: T.item1, done: T.item1Done },
          { text: props.items[1], at: T.item2, done: T.item2Done },
        ]}
        note={{ label: props.noteLabel, text: props.note, at: T.note }}
      />

      <Phone>
        <PageScreen step={1} done={nextDone ? 1 : 0} scroll={scroll}>
          <Eyebrow>Stap 1</Eyebrow>
          <H2>Vraag je eigen adres aan</H2>
          <Lead>Stuur één mailtje naar ons. Je krijgt dan je eigen Betaalbuddy-adres terug.</Lead>
          <div style={{ marginTop: 18 }}>
            <Btn tap="open" press={pressed(frame, T.tapOpen)}>
              <MailIcon size={21} /> Open mijn mail
            </Btn>
            <Tiny style={{ marginTop: 9, textAlign: "center" }}>
              Er staat al een mail klaar. Je hoeft alleen op <b style={{ color: bb.ink }}>Verstuur</b> te drukken.
            </Tiny>
          </div>
          <Note style={{ marginTop: 18 }}>
            <b>Belangrijk:</b> stuur hem vanaf het mailadres waar je je herinneringen wilt krijgen. Dat adres wordt je account.
          </Note>
          <div style={{ marginTop: 18 }}>
            <Label>Gebeurt er niets? Kopieer het adres en mail het zelf</Label>
            <CopyField value="start@in.betaalbuddy.nl" />
            <Tiny style={{ marginTop: 7 }}>Onderwerp en tekst maken niet uit. Een lege mail is ook goed.</Tiny>
          </div>
          <Nav back={false}>
            <Btn kind="ink" tap="next" press={pressed(frame, T.tapNext)}>
              Verstuurd, volgende stap <ArrowIcon size={18} />
            </Btn>
          </Nav>
        </PageScreen>

        <Sheet p={sheet}>
          <Compose
            to={<Token>start@in.betaalbuddy.nl</Token>}
            from={example.yourMail}
            subject="Start mijn Betaalbuddy"
            sendPress={pressed(frame, T.tapSend)}
            markFrom={mark}
          />
        </Sheet>

        <Tap target="open" at={T.tapOpen} />
        <Tap target="send" at={T.tapSend} />
        <Tap target="next" at={T.tapNext} />
      </Phone>
    </AbsoluteFill>
  );
};
