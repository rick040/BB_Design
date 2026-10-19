import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { clamp, pop, springs } from "../../lib/anim";
import { ArrowIcon } from "../components/Icons";
import { Phone } from "../components/Phone";
import { StepPanel } from "../components/StepPanel";
import { pressed, Tap } from "../components/Tap";
import type { WalkthroughProps } from "../schema";
import { AgendaList, SubscribeAlert } from "../screens/calendar";
import { appIn, appOut } from "../screens/mail";
import { Btn, CalBtn, Eyebrow, H2, Label, Lead, PageScreen } from "../screens/page";
import { bb } from "../tokens";

// Timeline (frames, scene-local).
export const STEP4_T = {
  item1: 14, // "Kies je agenda"
  tapApple: 50,
  alert: 56, // the calendar asks to subscribe
  alertLen: 10,
  item1Done: 60,
  item2: 72, // "Tik op Abonneer"
  tapSubscribe: 104,
  item2Done: 110,
  switchApp: 112, // the calendar opens
  switchLen: 16,
  item3: 124, // "Je vervaldatums komen er vanzelf in"
  event: 140, // the due dates pop in, one by one
  eventStagger: 10,
  item3Done: 176,
  note: 196,
};

export const Step4Scene: React.FC<{ props: WalkthroughProps["step4"]; example: WalkthroughProps["example"] }> = ({
  props,
  example,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const T = STEP4_T;
  const ease = { ...clamp, easing: (x: number) => 1 - Math.pow(1 - x, 3) };

  const alert =
    interpolate(frame, [T.alert, T.alert + T.alertLen], [0, 1], ease) *
    interpolate(frame, [T.tapSubscribe + 4, T.tapSubscribe + 10], [1, 0], clamp);
  const sw = interpolate(frame, [T.switchApp, T.switchApp + T.switchLen], [0, 1], ease);
  const events = [0, 1, 2].map((i) => pop(frame, fps, T.event + i * T.eventStagger, springs.pop));

  return (
    <AbsoluteFill style={{ background: bb.bg }}>
      <StepPanel
        step={4}
        title={props.title}
        items={[
          { text: props.items[0], at: T.item1, done: T.item1Done },
          { text: props.items[1], at: T.item2, done: T.item2Done },
          { text: props.items[2], at: T.item3, done: T.item3Done },
        ]}
        note={{ label: props.noteLabel, text: props.note, at: T.note }}
      />

      <Phone>
        {sw < 1 ? (
          <div style={{ position: "absolute", inset: 0, ...appOut(sw) }}>
            <PageScreen step={4} done={3}>
              <Eyebrow>Stap 4</Eyebrow>
              <H2>Zet je vervaldatums in je agenda</H2>
              <Lead>Eén keer toevoegen, daarna komen al je vervaldatums er vanzelf in. Ook op je telefoon.</Lead>
              <div style={{ marginTop: 18 }}>
                <Label style={{ marginBottom: 0 }}>Kies je agenda</Label>
                <CalBtn
                  name="Apple Agenda"
                  sub="iPhone, iPad en Mac. Tik en kies Abonneer."
                  rec
                  tap="apple"
                  press={pressed(frame, T.tapApple)}
                />
                <CalBtn name="Google Agenda" sub="Werkt het best op een computer." external />
                <CalBtn name="Outlook" sub="Outlook.com en Hotmail. Klik op Importeren." external />
              </div>
              <div style={{ display: "grid", gap: 8, marginTop: 22, paddingTop: 16, borderTop: `1px solid ${bb.line2}` }}>
                <Btn kind="ghost">Sla over, mails zijn genoeg</Btn>
                <Btn kind="ink">
                  Staat erin <ArrowIcon size={18} />
                </Btn>
              </div>
            </PageScreen>
            <SubscribeAlert
              url={example.agenda.replace(/^https?:\/\//, "webcal://")}
              show={alert}
              press={pressed(frame, T.tapSubscribe)}
            />
          </div>
        ) : null}

        {sw > 0 ? (
          <div style={{ position: "absolute", inset: 0, ...appIn(sw) }}>
            <AgendaList
              show={events}
              events={[
                { day: "vr 23 oktober", title: "Telefoonprovider betalen", sub: "€ 37,85 · Betaalbuddy" },
                { day: "wo 28 oktober", title: `${example.billSender} betalen`, sub: `${example.billAmount} · Betaalbuddy` },
                { day: "vr 30 oktober", title: "Zorgverzekeraar betalen", sub: "€ 142,50 · Betaalbuddy" },
              ]}
            />
          </div>
        ) : null}

        <Tap target="apple" at={T.tapApple} />
        <Tap target="subscribe" at={T.tapSubscribe} />
      </Phone>
    </AbsoluteFill>
  );
};
