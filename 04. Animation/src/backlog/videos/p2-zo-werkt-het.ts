import { base, big, buddy, calendar, DEC_2026, type Entry, lines, notes, NOV_2026 } from "./helpers";

const ADDRESS = "a8f3k@in.betaalbuddy.nl";

// Pillar 2 · Zo werkt het: forwarding, calendar, reminders, paid.
export const P2: Entry[] = [
  {
    id: "BB-P2-01",
    num: 7,
    pillar: "P2",
    title: "3 tikken",
    template: "explainer",
    feed: false,
    cover: 0,
    props: {
      ...base({ line: "Bewaar deze voor later.", bg: "blue" }),
      bg: "light",
      steps: [
        {
          headline: "Rekeningen regelen\n= 3 tikken.",
          subline: "Tik 1: doorsturen.",
          visual: { kind: "forward", from: "Zorgverzekeraar", subject: "Je nota van november", to: ADDRESS, phase: "tap", button: "Doorsturen", fwd: true },
          seconds: 3.2,
        },
        {
          headline: "Plak je Buddy-adres.",
          subline: "Tik 2: je eigen adres.\nDat krijg je bij je aanmelding.",
          visual: { kind: "forward", from: "Zorgverzekeraar", subject: "Je nota van november", to: ADDRESS, phase: "address", button: "Versturen", fwd: true },
          seconds: 3.4,
        },
        {
          headline: "Versturen.",
          subline: "Tik 3. Dat was het.",
          visual: { kind: "forward", from: "Zorgverzekeraar", subject: "Je nota van november", to: ADDRESS, phase: "sent", button: "Versturen", fwd: true },
          seconds: 2.8,
        },
        {
          headline: "Staat in je agenda.",
          subline: "Met een seintje 7 en 2 dagen\nvoor de vervaldatum.",
          visual: calendar(NOV_2026.month, NOV_2026.first, NOV_2026.days, [[28, "Betalen: Zorgverzekeraar €128,95"]]),
          seconds: 3.4,
        },
      ],
    },
  },
  {
    id: "BB-P2-02",
    num: 8,
    pillar: "P2",
    title: "Je agenda weet het eerder",
    template: "explainer",
    feed: false,
    cover: 30,
    props: {
      ...base({ line: "Koppel je agenda.", bg: "light" }),
      bg: "blue",
      steps: [
        {
          headline: "Je agenda weet het\neerder dan jij.",
          subline: "Eén keer je agendalink toevoegen.",
          visual: lines("Agendalink toevoegen", [
            ["Kopieer je agendalink", "plain"],
            ["Agenda toevoegen › via URL", "plain"],
            ["Klaar. Hij werkt zichzelf bij.", "good"],
          ], 0.35),
          seconds: 3.6,
        },
        {
          headline: "Elke rekening op\nzijn vervaldatum.",
          subline: "In je eigen agenda.\nGeen extra app.",
          visual: calendar(DEC_2026.month, DEC_2026.first, DEC_2026.days, [
            [4, "Betalen: Telefoon €24,50"],
            [15, "Betalen: Energie €86,40"],
          ]),
          seconds: 3.6,
        },
        {
          headline: "Met een seintje\n7 en 2 dagen vooraf.",
          subline: "Betaald gemeld?\nDan verdwijnt hij uit je agenda.",
          visual: notes(
            [
              ["Betalen: Energie €86,40 · over 7 dagen", "warning", "8 dec"],
              ["Betalen: Energie €86,40 · over 2 dagen", "alert", "13 dec"],
            ],
            0.8,
            "Facturen",
          ),
          seconds: 3.8,
        },
      ],
    },
  },
  {
    id: "BB-P2-03",
    num: 9,
    pillar: "P2",
    title: "Last-minute doorgestuurd",
    template: "countdown",
    feed: false,
    cover: 30,
    props: {
      ...base({ line: "Stuur hem nu door.", bg: "blue" }),
      headline: "Pas op het laatst\ndoorgestuurd?",
      bg: "light",
      unit: "dagen tot de vervaldatum",
      steps: [
        { value: "7", caption: "Hier komt normaal\nje eerste seintje.", noteTitle: "", noteText: "", noteTime: "", noteIcon: "warning" },
        { value: "2", caption: "En hier je tweede.\nMaar hij was nog niet doorgestuurd.", noteTitle: "", noteText: "", noteTime: "", noteIcon: "warning" },
        { value: "1", caption: "Nu pas doorgestuurd?", noteTitle: "BetaalBuddy", noteText: "Vervalt morgen · €49,99", noteTime: "08:00", noteIcon: "alert" },
      ],
      stepSeconds: 2.1,
      final: {
        headline: "Te laat?\nToch een seintje.",
        subline: "Buddy slaat hem niet over\nomdat je laat was.",
        visual: big("Alsnog.", "", true),
        seconds: 3.2,
      },
    },
  },
  {
    id: "BB-P2-04",
    num: 10,
    pillar: "P2",
    title: "Buddy vraagt het gewoon",
    template: "skit",
    feed: false,
    cover: 0,
    props: {
      ...base({ line: "Stuur je eerste rekening door.", bg: "light" }),
      headline: "Kan Buddy je rekening\nniet lezen?",
      bg: "blue",
      chat: { title: "Buddy", subtitle: "per mail", avatar: "buddy" },
      messages: [
        { side: "left", sender: "", text: "Deze kon ik niet lezen. Stuur je de datum en het bedrag even terug?", failed: false },
        { side: "right", sender: "", text: "datum: 15-12-2026\nbedrag: 49,99", failed: false },
        { side: "system", sender: "", text: "Staat in je agenda", failed: false },
        { side: "left", sender: "", text: "Ik gok liever niet. Een verkeerde datum is erger dan geen datum.", failed: false },
      ],
      messageGap: 1.5,
      hold: 1.5,
      punch: {
        headline: "Liever vragen\ndan gokken.",
        subline: "Zonder antwoord zet Buddy\nniets in je agenda.",
        seconds: 3,
      },
    },
  },
  {
    id: "BB-P2-05",
    num: 11,
    pillar: "P2",
    title: "De maandagmail",
    template: "pov",
    feed: false,
    cover: 30,
    props: {
      ...base({ line: "Link in bio.", bg: "light" }),
      sticker: "POV",
      beats: [
        {
          headline: "Maandag. Je weet\nwat er openstaat.",
          subline: "",
          bg: "light",
          visual: {
            kind: "overview",
            title: "Je openstaande rekeningen deze week",
            rows: [
              { label: "Zorgverzekeraar", amount: "€128,95", due: "vervalt 18 nov" },
              { label: "Telefoon", amount: "€24,50", due: "vervalt 20 nov" },
              { label: "Energie", amount: "€86,40", due: "vervalt 22 nov" },
            ],
            footer: "Alles wat je als betaald meldt, verdwijnt uit dit overzicht.",
          },
          seconds: 4.4,
          shakeAt: -1,
        },
        {
          headline: "Eén mail per week.\nMeer niet.",
          subline: "Elke maandag wat nog openstaat.\nBetaald gemeld = eruit.",
          bg: "blue",
          visual: buddy("Fijne week."),
          seconds: 3.2,
          shakeAt: -1,
        },
      ],
    },
  },
  {
    id: "BB-P2-06",
    num: 12,
    pillar: "P2",
    title: "Betaald? Klik. Weg.",
    template: "split",
    feed: true,
    cover: 30,
    props: {
      ...base({ line: "", bg: "light" }),
      headline: "Betaald?\nKlik. Weg.",
      bg: "light",
      before: {
        label: "Je herinnering",
        visual: { kind: "bill", sender: "Energieleverancier", subject: "Herinnering · nog 2 dagen", amount: "€86,40", dueLabel: "Vervalt 22 nov", urgent: false, stamp: "", stampAt: 0, button: "Al betaald", tapAt: 1.5 },
      },
      after: {
        label: "Eén klik later",
        visual: big("Weg.", "Uit je overzicht. Uit je agenda.\nUit de database.", true),
      },
      wipeAt: 2.2,
      payoff: "Geen archief. Geen geschiedenis\nvan wat je ooit betaalde.",
      seconds: 6.6,
    },
  },
  {
    id: "BB-P2-07",
    num: 13,
    pillar: "P2",
    title: "Level 2: filterregel",
    template: "explainer",
    feed: false,
    cover: 30,
    props: {
      ...base({ line: "Bewaar deze.", bg: "light" }),
      bg: "blue",
      steps: [
        {
          headline: "Level 2: niet eens\nmeer doorsturen.",
          subline: "Maak één keer een filterregel\nin je mailprogramma.",
          visual: { kind: "rule", title: "Nieuwe regel", when: "Bevat “factuur”", then: "Doorsturen naar je Buddy-adres" },
          seconds: 3.8,
        },
        {
          headline: "Nieuwe rekening?\nGaat vanzelf door.",
          subline: "Jij hoeft er niks voor te doen.",
          visual: {
            kind: "inbox",
            title: "Inbox",
            rows: [
              { from: "Energieleverancier", subject: "Je factuur van december" },
              { from: "Webshop", subject: "Je pakket is onderweg" },
              { from: "Nieuwsbrief", subject: "Nieuw deze week" },
            ],
            badgeFrom: 3,
            badgeTo: 3,
            countLen: 0.1,
            highlight: 0,
            highlightLabel: "Doorgestuurd",
            highlightAt: 0.8,
          },
          seconds: 3.4,
        },
        {
          headline: "Jij hoort het pas\nals het moet.",
          subline: "7 en 2 dagen voor de vervaldatum.",
          visual: notes([
            ["Nog 7 dagen · Energie €86,40", "warning", "15 dec"],
            ["Nog 2 dagen · betaal op tijd", "alert", "20 dec"],
          ]),
          seconds: 3.4,
        },
      ],
    },
  },
];
