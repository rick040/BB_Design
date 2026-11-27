# Onboarding v5.3 meetbaar maken

Bestand: `betaalbuddy-onboarding_v5.3.html` (één abonnement, Buddy €3,49; de pakketvraag is weg, het gesprek begint bij het mailadres). Zet in WordPress alleen Mollie-formulier 141 aan; 36 (Basic) en 143 (Pro) staan niet meer op de pagina. Vervang het blok tussen `START KOPIEREN` en `EINDE KOPIEREN` in Oxygen. Verder verandert er niets aan de pagina, de Mollie-formulieren of de doorverwijzingen.

## 1. Welke events er zijn

Elk event krijgt automatisch mee: `funnel` (versie), `screen`, `step` (vraag 1, 2 of 3), `plan`, `inapp` (1 = Instagram/TikTok/Facebook-browser), `device`. Er gaat nooit een mailadres mee.

| Volgorde | Event | Betekenis |
|---|---|---|
| 1 | `onboarding_start` | Pagina geladen (de checkout staat open) |
| 2 | `ob_engaged` (nieuw) | Eerste echte handeling: tik, toets of scrollen. `how`, `seconds` |
| 3 | `begin_checkout` | Eerste handeling in de checkout zelf (pakket, mailveld, knop) |
| 4 | `select_plan` | Komt in v5.3 niet meer voor (één abonnement) |
| 5 | `checkout_step` | Samenvatting met betaalknop in beeld (`step = 3`). Het mailadres (`step = 2`) is in v5.3 de eerste vraag en staat al open |
| 6 | `email_valid` (nieuw) | Mailadres is geldig ingevuld |
| 7 | `email_typo_shown` (nieuw) / `email_typo_fixed` | Tikfoutcheck getoond / overgenomen |
| 8 | `select_method` | Betaalmethode gekozen |
| 9 | `pay_click` | Tik op "Betaal … en start" |
| 10 | `add_payment_info` | Formulier gaat echt naar Mollie |
| 11 | `checkout_error` (nieuw) | `type`: `email`, `details_missing`, `form_unavailable`, `pay_timeout` (10 s niets gebeurd, met `message` van de plugin) |
| 12 | `purchase` | Terug op `?bb_status=paid`. Nu met `transaction_id` en `plan_known` |
| 13 | `payment_failed` | Terug met canceled, failed of expired |
| — | `ob_exit` (nieuw) | Pagina verlaten of weggeklikt: `last_event`, `step`, `engaged`, `seconds`, `email_typed`, `email_ok`, `try_opened`, `paying` |
| — | `retry_start` (nieuw) | Binnengekomen via `?retry=1` |
| site | `site_cta` | Klik op een knop in het eerste scherm, het prijsblok of het slotblok van de homepage: `cta` (try of direct) en `where` (hero, prijs, slot) |
| zijpad | `tryout_open`, `bill_form_start`, `bill_form_complete`, `ics_delivered`, `tryout_to_checkout` | Gratis uitproberen |

## 2. Google Tag Manager (één keer instellen)

Het script zet alles in `dataLayer`. Zonder een trigger in Tag Manager komt een event **niet** in GA4.

1. **Variabelen** → Nieuw → *Gegevenslaagvariabele*, één per naam: `funnel`, `screen`, `step`, `plan`, `inapp`, `device`, `type`, `status`, `how`, `seconds`, `last_event`, `engaged`, `email_typed`, `email_ok`, `try_opened`, `paying`, `method`, `value`, `currency`, `transaction_id`, `source`, `plan_known`, `message`, `cta`, `where`.
2. **Trigger** → *Aangepaste gebeurtenis* → gebeurtenisnaam (vink *Regex gebruiken* aan):
   ```
   ^(onboarding_start|ob_engaged|begin_checkout|select_plan|checkout_step|email_valid|email_typo_shown|email_typo_fixed|select_method|pay_click|add_payment_info|checkout_error|purchase|payment_failed|ob_exit|retry_start|tryout_open|bill_form_start|bill_form_complete|ics_delivered|tryout_to_checkout|due_chip|upsell_click|site_cta)$
   ```
3. **Tag** → *Google Analytics: GA4-gebeurtenis* → gebeurtenisnaam `{{Event}}` → voeg alle variabelen uit stap 1 toe als parameters → trigger uit stap 2.
4. Test met *Voorbeeld* (Tag Assistant): doorloop de pagina en kijk of elk event één keer afgaat.
5. Gebruik je GA4 zonder Tag Manager (gtag of Site Kit)? Zet dan in het script `analytics: { gtag: true }` en sla stap 1–3 over. Nooit allebei, anders telt alles dubbel.

## 3. GA4 inrichten

1. **Beheer → Aangepaste definities**: maak dimensies (bereik: gebeurtenis) voor `step`, `screen`, `plan`, `inapp`, `device`, `type`, `last_event`, `engaged`, `funnel`; en statistieken voor `seconds`.
2. **Beheer → Belangrijke gebeurtenissen**: markeer `purchase`.
3. **Verkennen → Trechterverkenning**, open trechter, stappen:
   1. `onboarding_start`
   2. `ob_engaged`
   3. `begin_checkout`
   4. `email_valid`
   5. `checkout_step` met `step = 3`
   6. `pay_click`
   7. `purchase`

   Uitsplitsen op `inapp`, `device` en sessiebron/campagne. Filter op `funnel = ob_v5_3` zodat oude versies niet meetellen.
4. **Verkennen → Vrije vorm** voor afhakers: event `ob_exit`, rijen `last_event` en `step`, kolom `engaged`. Dit is de lijst "waar strandt het".
5. **Fouten**: event `checkout_error`, rijen `type` en `message`.

## 4. Wat GA4 niet ziet

- **Betalingen zonder terugkeer.** `purchase` gaat pas af als iemand na het betalen op de pagina terugkomt in dezelfde browser. Wie in de bank-app blijft hangen, of vanuit Instagram/TikTok in een andere browser terugkomt, ontbreekt (of komt binnen met `plan_known = 0`). De waarheid staat in **Mollie → Betalingen**: filter op status (betaald, open, geannuleerd, verlopen) en betaalmethode. Leg die wekelijks naast GA4.
- **Bezoekers zonder cookie-toestemming.** Wie cookies weigert, telt in GA4 niet of alleen gemodelleerd mee.
- **Oude cijfers.** v5 staat sinds 4 november live. Data van daarvoor (v4.5) gebruikt dezelfde eventnamen met een andere betekenis; vergelijk alleen vanaf `funnel = ob_v5_3`.
