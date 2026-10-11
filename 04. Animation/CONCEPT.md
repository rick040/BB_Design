# BetaalBuddy · Instagram ad animation

## Concept: "Stuur door. Buddy onthoudt."

**One-liner:** We open on a messy inbox that ends in a final payment reminder with extra costs. Then Buddy pops in and the viewer sees the product in two steps: you forward the bill, and Buddy reminds you in time. The ad closes on the brand promise and an "activeer buddy" button.

| | |
|---|---|
| Format | 9:16 Reels/Stories, 1080×1920 (main) · 4:5 feed variant, 1080×1350 |
| Length | 14.8 s (5 scenes, 30 fps). Every timing can be changed in Remotion Studio |
| Objective | Hook rate and 3-sec retention (the A/B test metric), then a click to the start page |
| Audience | NL, 21–40, broad. The targeting is done by the creative (the problem in the hook) |
| Sound | Designed to work muted (all copy on screen). An optional music track can be added via a prop |

### Why this concept

- **The hook is the pain, not the product.** A full inbox ending in a final reminder with extra costs ("Laatste aanmaning · +€40") is something you recognise inside 2 seconds. €40 is the legal minimum for collection costs after a 14-day letter, so the number is not made up.
- **It matches the current product**, the forwarding version: you forward a bill, Buddy reads the amount, due date and payment link, and sends a reminder 7 and 2 days before the due date, in your mail and your calendar. The ad never says "inbox scannen", WhatsApp or "gratis", because those claims are outdated or not live.
- **Buddy is the hero.** The mascot gets a face, blinks and "eats" the forwarded bill. That gives the brand a character instead of only UI cards.
- **It is built from the existing brand system:** blue `#013BFF`, light `#FAFBFF`, soft blue `#B6C7FF`, Space Grotesk headlines with tight tracking, Geist UI text, notification cards, the pill CTA with an arrow circle, and the logo with the mascot.

---

## Storyboard

### 1 · Hook: "De volle inbox" (0.0 – 3.2 s) · light background
- **Headline** (word-by-word pop): **"Gemiste betaling door je volle inbox?"**
- **Visual:** an inbox card (already filled on frame 0, so the cover is never empty) where mail rows rain in faster and faster (Nieuwsbrief, Je pakket, Factuur, Sale -50%, …). The unread badge counts up 12 → **99+**.
- **Beat (≈2.0 s):** a blue **"Laatste aanmaning"** card with a **+€40** badge slams on top, with a short camera shake.
- *Purpose: stop the scroll with recognition and a cost.*

### 2 · Meet Buddy (2.8 – 5.4 s) · iris wipe to blue
- The blue circle grows out of the centre. **Buddy** (white mascot) jumps up with squash & stretch, lands, blinks and looks at the headline.
- **Headline:** **"Dit is Buddy."**
- **Subline:** "Hij onthoudt je rekeningen, zodat jij dat niet hoeft."

### 3 · How 1: forward (5.0 – 8.6 s) · slide to blue
- **Headline:** **"Stuur je rekening door naar Buddy"**
- **Visual:** a mail card ("Energieleverancier · Je factuur van oktober") gets a "Doorsturen →" tap. The card shrinks and flies to a small Buddy, who swallows it (squash). Out pop three chips: **€86,40** · **Vervalt 22 okt** · **Betaallink**.
- **Subline:** "Buddy haalt er bedrag, vervaldatum en betaallink uit."

### 4 · How 2: reminders (8.2 – 11.8 s) · slide up to light
- **Headline:** **"Buddy herinnert je op tijd"**
- **Visual:** a calendar tile "22" with a "+" pops in. Three notification cards then drop in one by one, the newest on top, pushing the older ones down like on a lock screen:
  1. 🆕 *Rekening ontvangen · €86,40*, 9d
  2. ⚠️ *Nog 7 dagen · vervalt 22 okt*, 5d
  3. ❗ *Nog 2 dagen · betaal op tijd*, nu
- **Subline:** "In je mail én je agenda. 7 en 2 dagen van tevoren."

### 5 · CTA (11.4 – 14.8 s) · iris to blue
- **Headline:** **"Nooit meer een betaling missen."**
- **CTA pill:** **"activeer buddy"**. The arrow circle slides in, the button "breathes", and a tap ripple plays.
- **Subline:** "Geen app. Geen bankkoppeling."
- **Logo:** betaalbuddy wordmark. Buddy peeks in from the right edge and blinks at the viewer.

---

<!-- copycheck:off -->
## Copy rules for this ad (from the changelog)
- No **"gratis" / "probeer gratis" / trial**. The new pricing model has no free period.
- No **WhatsApp / Telegram / Signal**. They are not available yet.
- No **"scant je inbox" / Gmail connection**. The product now works by forwarding.
- No **price** in the ad by default. Basic has no reminders, so "vanaf €2,99" next to a reminder promise would mislead.
- No third-party logos (Gmail, Netflix). Generic senders only.
<!-- copycheck:on -->

## Instagram safe zones
The key copy sits between ~14% from the top and ~20% from the bottom of the 9:16 frame, so the profile header and the Meta CTA bar do not cover it. In Remotion Studio, turn on `showSafeZones` to see the guides. They are never visible in an export unless you leave the toggle on.

## Ideas for A/B variants (hook only, everything else the same)
- **A (this one):** "Gemiste betaling door je volle inbox?" + aanmaning +€40
- **B:** "Eén vergeten rekening kan uitlopen op €40 extra." (cost-first; €40 is the legal minimum, only after a 14-day letter, so keep "kan")
- **C:** "Net op jezelf? Rekeningen stapelen zich op." (life-stage)

You can test each one by editing only the `hook` props in Studio.

---

## Voice-over (ElevenLabs, Multilingual v2)

### Variant A · normaal tempo (Speed 1.0)

```
Rekening gemist? Dat kost je zo veertig euro. <break time="0.2s" /> Dit is Buddy. Hij vergeet niks. Stuur je rekening door. Buddy leest bedrag en datum. En herinnert je op tijd. <break time="0.9s" /> Nooit meer een betaling missen. Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Rekening gemist? | Kop en inbox op frame 0 |
| 1,4 | Dat kost je zo veertig euro. | Aanmaning slaat neer op 1,93 s, +€40 op 2,13 s |
| 3,5 | Dit is Buddy. | Iris 2,80 tot 3,20 s, kop op 3,50 s, Buddy landt op 3,63 s |
| 4,6 | Hij vergeet niks. | Buddy knippert en kijkt omhoog, subregel op 4,10 s |
| 5,6 | Stuur je rekening door. | Tik op Doorsturen op 6,00 s, Buddy slikt de mail op 6,80 s |
| 7,1 | Buddy leest bedrag en datum. | Chips op 7,07, 7,27 en 7,47 s |
| 9,0 | En herinnert je op tijd. | Meldingen op 8,87, 9,53 en 10,20 s |
| 11,6 | Nooit meer een betaling missen. | Iris 11,40 tot 11,80 s, knop op 11,93 s |
| 13,4 | Activeer Buddy. | Tap op 13,07 s, einde op 14,80 s |

Doellengte mp3: ongeveer 14,5 s.

### Variant B · rustiger (Speed 0.9)

```
Gemiste betaling door je volle inbox? <break time="0.7s" /> Dit is Buddy. <break time="0.5s" /> Stuur je rekening door. <break time="0.1s" /> Buddy onthoudt de rest. <break time="0.2s" /> Hij herinnert je op tijd. <break time="0.8s" /> Nooit meer te laat. <break time="0.3s" /> Activeer Buddy.
```

| Start (s) | Zin | Beeld (frame-exact) |
|---|---|---|
| 0,0 | Gemiste betaling door je volle inbox? | Kop en inbox op frame 0; aanmaning slaat neer op 1,93 s, +€40 op 2,13 s |
| 3,7 | Dit is Buddy. | Iris 2,80 tot 3,20 s; kop op 3,50 s, Buddy landt op 3,63 s |
| 5,4 | Stuur je rekening door. | Slide 5,00 tot 5,40 s; tik op Doorsturen op 6,00 s |
| 7,1 | Buddy onthoudt de rest. | Buddy slikt de kaart op 6,80 s; chips op 7,07 tot 7,47 s |
| 8,9 | Hij herinnert je op tijd. | Slide 8,20 tot 8,60 s; meldingen op 8,87, 9,53 en 10,20 s |
| 11,6 | Nooit meer te laat. | Iris 11,40 tot 11,80 s; knop op 11,93 s |
| 13,1 | Activeer Buddy. | Tap op 13,07 s; einde op 14,80 s |

Doellengte mp3: ongeveer 14,2 s. Genereer op Speed 0,9; op 1,0 komen de latere zinnen tot ~1 s te vroeg.

## Caption (Reels)

### Variant A

```
Rekening gemist in je volle inbox? Eén vergeten betaling kan zomaar uitlopen op €40 incassokosten. 😬

Daarom is er Buddy 💙

1️⃣ Stuur je rekening door naar Buddy
2️⃣ Buddy haalt er het bedrag, de vervaldatum en de betaallink uit
3️⃣ Jij krijgt een herinnering in je mail en je agenda, 7 en 2 dagen van tevoren

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #budgetteren #opjezelfwonen
```

**Advertentie (Ads Manager):** primaire tekst "Rekening gemist in je volle inbox? Stuur hem door naar Buddy en krijg op tijd een herinnering in je mail en agenda." · Kop "Nooit meer een betaling missen" · Knop "Aanmelden".

### Variant B (past bij voice-over B)

```
Ergens tussen de sale-mails en de pakketupdates zit die ene rekening. Je ziet hem pas als de aanmaning binnenkomt. 📬

Buddy onthoudt je rekeningen, zodat jij dat niet hoeft 💙
📩 Stuur je rekening door naar je eigen doorstuuradres
🔎 Buddy haalt er bedrag, vervaldatum en betaallink uit
⏰ 7 en 2 dagen van tevoren krijg je een seintje in je mail
📅 De vervaldatum staat ook in je agenda

Geen app. Geen bankkoppeling. Buddy ziet alleen wat jij doorstuurt.

👉 Activeer je Buddy via de link in bio

#betaalbuddy #geldzaken #rekeningen #budgetteren #administratie
```

**Advertentie (Ads Manager):** primaire tekst "Volle inbox? Dan zie je zo een rekening over het hoofd. Stuur hem door naar Buddy en krijg 7 en 2 dagen vooraf een seintje." · Kop "Stuur door. Buddy onthoudt." · Knop "Aanmelden".

## Open controles
- De CTA en de link in bio moeten naar de instappagina wijzen; "aanmaning en incassokosten" past het best. Die pagina's noemen volgens de changelog nog prijzen en "30 dagen geld terug".

