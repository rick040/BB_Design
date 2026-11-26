# Betaalbuddy pre-seed pitch deck: slide script

Companion to `Betaalbuddy_Pitch_Deck.pptx` and `Betaalbuddy_Forecast.xlsx`. The speaker notes in the .pptx match this file.

Status tags: [LIVE] built and running · [MEASURED] real data · [MODEL] calculated assumption · [PLAN] intended · [VERIFY] check before using publicly · [FILL IN] founder must supply.

<planning>

**The one sentence an investor should remember**
Betaalbuddy reminds young adults to pay the bills in their inbox without ever reading or keeping their mail, and this round proves they will pay €3.49 a month for it.

**Narrative arc**
1. Problem: a missed bill is a missed email, and it costs €40 (slides 2–3).
2. Insight: the obvious answer, an AI that reads your inbox, asks for trust this audience won't give, so the opposite position is open (3, 5).
3. Product: forward, calendar, reminder, and nothing kept (4).
4. Why it wins: the privacy architecture is structural, cheap to run and hard for inbox readers to copy (5, 10, 11).
5. Proof so far: live product, instrumented funnel, a clear leak at checkout, and a fast ad engine (8).
6. How it grows: video first, a hard €12 CAC stop rule, and activation as the main risk (9).
7. What the money proves: three gated phases, five risks, five thresholds, every euro mapped (12, 14, 15).

**The question each slide answers**
| # | Investor question |
|---|---|
| 1 | What is this, in one line? |
| 2 | Is the pain real and expensive? |
| 3 | Why hasn't this been solved, and why now? |
| 4 | What does the user actually do? |
| 5 | Why can't a bigger player copy it? |
| 6 | How many people could buy this? |
| 7 | Can this make money per customer? |
| 8 | Is there any evidence, and is the founder honest about it? |
| 9 | How do you get customers without burning cash? |
| 10 | Who else does this? |
| 11 | Will it break or get expensive at scale? |
| 12 | What happens in what order? |
| 13 | Who is building this, and can they keep going? |
| 14 | What could kill it, and how will we know? |
| 15 | What do you want and what does it buy? |
| 16 | What do I remember and what's next? |

**Strong vs weak facts, and how to present the weak ones**
- Strong [LIVE]: the product, payments, privacy architecture with CI enforcement, tech stack, 120 ad concepts. Lead with these; they prove execution.
- Strong [MEASURED]: the GA4 funnel. It's small, but it's real and shows a specific leak. Present it as "instrumented and learning", never as traction.
- Weak [MODEL]: margin, CAC ceiling, running cost. Show the formula and label every one "modelled". Name churn as unknown.
- Weak [PLAN]: customer targets, Meta test, channels, a second plan. Put them on the roadmap as gates, not results.
- Weak [VERIFY]: €40, CJIB +50%, CBS figures. Keep them; verify before presenting.
- Missing [FILL IN]: paying customers, team, ask, euro market size. Shown as red chips on the slides so nothing reads as hidden.
- The 60-day validation test (to 31 Jan 2027, 50 paying) is not on any slide. The Prove phase (100 paying by late Feb 2027, a gate before scale spend) is built to be consistent with it.

</planning>

## Main deck

### Slide 1: Betaalbuddy reminds you before a bill is due, without ever reading your inbox
**On the slide:**
- Forward a bill. Get a reminder. Nothing kept after it's paid.
- Pre-seed round · November 2026 · [FILL IN: founder name]

**Visual:** White Betaalbuddy wordmark and mascot on brand blue. No other elements.

**Speaker notes:** Betaalbuddy is a payment-reminder service for bills that arrive by email. You forward a bill to a personal address, fixed rules read the amount and the due date, the bill goes into your calendar, and we email you before it is due. No app, no account, no AI, and nothing is kept after it is paid. It is live and taking payments today. It is very early on revenue, and I will be clear throughout about which numbers are measured and which are plans. This round is about proving one thing: that young adults living on their own will pay €3.49 a month for this, and keep paying.

**Sources:** [LIVE] [FILL IN]

### Slide 2: Missing a bill is a missed email, and the penalty starts at €40
**On the slide:**
- €40: minimum statutory collection costs, even on a €12 bill
- +50%: a CJIB traffic fine after the first reminder
- BKR: buy-now-pay-later arrears can reach your credit record

**Visual:** Left: a stylised inbox where one bill sits between newsletters and order confirmations. Right: three stat cards (€40, +50%, BKR).

**Speaker notes:** Bills don't arrive by post anymore. They arrive by email, between newsletters and order confirmations, with the due date somewhere near the bottom. Missing one isn't a character flaw. It's a missed email. The cost is steep. Dutch statutory collection costs start at €40, even on a €12 bill. A traffic fine from the CJIB, the government agency that collects fines, goes up 50% after the first reminder. Health-insurance arrears can end at the CAK rate, a higher premium charged by a government agency. BNPL reminders from Klarna, Riverty or in3 add fees and can reach BKR, the Dutch credit register. And people feel stupid about it, so they don't ask for help.

**Sources:** [VERIFY]

### Slide 3: Bills moved into the inbox, and the tools that read email now want all of it
**On the slide:**
- Health insurance, phone, fines and BNPL now bill by email
- AI inbox assistants need full mailbox access, which many people refuse
- Managed EU infrastructure makes a solo service cheap

**Visual:** Three columns, each with an icon in a blue circle: inbox, robot with a stop sign, server.

**Speaker notes:** Three things line up now. First, the bill moved into the inbox. Health insurance, phone contracts, fines and buy-now-pay-later all reach young adults by email, and BNPL added a new class of small bills with short due dates. Second, the obvious technical answer, an AI assistant that reads your mailbox, asks for something many people will not give: every email, read by a language model. That leaves the opposite position open. Third, managed infrastructure lets one founder run a secure, EU-hosted service for about 25 cents per customer per month in running costs. That is a modelled number. I don't yet have market data on how many bills arrive by email; that is on the fill-in list.

**Sources:** [LIVE] [MODEL] [FILL IN]

### Slide 4: Forward a bill, get a calendar entry and a reminder: nothing to install
**On the slide:**
- 1. Pay on betaalbuddy.nl: get an address and calendar link
- 2. Forward a bill, by hand or with a filter
- 3. Reminder 7 and 2 days ahead; 'paid' deletes it

**Visual:** Three-step icon flow (credit card, envelope, calendar with bell) with the sample address a8f3k@in.betaalbuddy.nl under step 1.

**Speaker notes:** This is the whole product. You sign up and pay on betaalbuddy.nl. Payment is the signup, so there is no account and no password. You get a personal forwarding address, like a8f3k@in.betaalbuddy.nl, and a calendar subscription link. You forward a bill, by hand or with a mail filter. Fixed rules read the amount, due date, payment link, IBAN and reference. The bill appears in your calendar, and you get an email seven and two days before it is due, or on the days you choose. One click on 'already paid' deletes the record. If the amount or date is uncertain, nothing goes into the calendar; we ask by email instead. A wrong date is worse than no date.

**Sources:** [LIVE]

### Slide 5: We cannot leak what we never stored, and inbox-reading rivals can't copy that
**On the slide:**
- Forwarded mail lives in memory for milliseconds, never on disk
- Hard delete dates, no external AI, no tracking: enforced in CI
- The cost: lower recognition, handled by an ask-back email

**Visual:** Two columns. Left, 'An AI inbox assistant holds': whole mailbox, read by a language model, kept. Right, 'Betaalbuddy holds': amount, due date, payment details, deleted 14 days after due. Lock and bin icons.

**Speaker notes:** This is the investment argument. The forwarded email exists in memory for a few hundred milliseconds and is never written to disk. No database column exists that could hold mail text or attachments. Every bill has a hard delete date: 14 days after it is due, or immediately when paid. The build fails if code calls an AI or OCR service. The moat: an AI inbox assistant's product is reading your mailbox, so it cannot take this position without giving up how it works. Under the GDPR, data we never hold cannot be breached or requested. For a distrustful audience, gegevens@ ('data') shows every stored field. The price is lower recognition: when unsure, we ask, and count every case.

**Sources:** [LIVE]

### Slide 6: Every year about 174,000 young Dutch people leave home and start getting their own bills
**On the slide:**
- ~174,000 aged 18–30 left the parental home in 2024 (CBS)
- ~208,000 people were 18 on 1 January 2025 (CBS)
- Euro market size: [FILL IN, method in notes]

**Visual:** Two large stat callouts with CBS source lines, a red [FILL IN] chip for the euro market size, and one line: our 12-month target is 0.6–1.7% of one year's home-leavers.

**Speaker notes:** I built this bottom up from public sources, and I'll show where I stopped. CBS, the Dutch statistics office, reports that just over 174,000 people aged 18 to 30 left their parents' home in 2024. About 208,000 people were 18 on 1 January 2025, the age at which basic health insurance becomes your own bill. The groups overlap, so I don't add them. What I don't have yet is the share who get bills by email and the share who paid late last year. Until I do, there is no euro market size on this slide. What I can say: our 12-month target is under 2% of a single year's home-leavers. That is the beachhead, not the ceiling.

**Sources:** [VERIFY] [FILL IN] [PLAN]

### Slide 7: One forgotten bill costs about as much as a year of Betaalbuddy
**On the slide:**
- €40 collection costs vs €41.88 for a year of Buddy
- One plan: €3.49/month leaves €2.95 margin; CAC ceiling €12
- Modelled: churn not yet measured

**Visual:** Left: column chart (one forgotten bill €40, a year of Buddy €41.88, a month of Buddy €3.49). Right: one-plan table with price, costs, margin and CAC ceiling; a second plan (SMS/WhatsApp) marked as later.

**Speaker notes:** There is one plan: Buddy at €3.49 a month. It includes everything the product does: an email before every due date, the calendar feed, the overview and the paid button. One plan means no choice at checkout and no promise the product doesn't keep. A second plan only comes when SMS or WhatsApp alerts are live. There is no free trial, a 30-day money-back guarantee and one-click cancel. Running costs are about 25 cents per customer, plus 29 cents per Mollie payment, so Buddy leaves €2.95 a month, €35.40 a year. We cap acquisition cost at €12, about a third of that. All of this is modelled, and churn is still unknown.

**Sources:** [MODEL] [PLAN] [VERIFY]

### Slide 8: The funnel is instrumented: people want to look, and checkout is where we lose them
**On the slide:**
- 4 weeks: 131 visitors → 91 onboarding → 12 checkout → 2 to Mollie
- Paying customers: [FILL IN from Mollie]
- 120 ad concepts from a daily automated pipeline

**Visual:** Horizontal bar funnel chart (131, 91, 12, 6, 2) with a red [FILL IN] chip for paid. Side card: '120 ad concepts' with Reel and feed format icons.

**Speaker notes:** Here are four weeks of real data, 28 October to 24 November. 131 visitors came, and 91 opened onboarding, so the explanation lands. Then it drops: 12 opened checkout, 6 picked a plan and 2 clicked through to Mollie. GA4 doesn't track the purchase yet, so the last step comes from Mollie, our source of truth: [FILL IN paying customers]. The lesson is that interest isn't the problem. The step from 'I get it' to 'I'll pay' is. Paid Meta traffic shows 0 to 5 seconds of engagement so far, and we're cleaning up tracking: UTM variants, Audience Network and bot traffic. Meanwhile the ad engine has made 120 concepts, so creative isn't the bottleneck.

**Sources:** [MEASURED] [LIVE] [FILL IN]

### Slide 9: Video finds the message, ads scale it, and anything above €12 per signup stops
**On the slide:**
- Organic Reels and TikTok prove a format first
- Then Meta: 3 audiences at €2/day each; creators, student associations, referral
- Activation target: >50% forward a first bill within 48 hours

**Visual:** Left-to-right flow: Organic test → Paid test (3 × €2/day) → Scale channels, with a red stop rule 'CAC > €12 = stop' under the flow and an activation card at the end.

**Speaker notes:** The beachhead is students aged 18 to 23 as they turn 18 or leave home, when the first insurance, phone, rent and fine bills arrive together. Short video is the main channel. A format has to work organically on Reels and TikTok first, and only then do ads scale it. The first paid test is three Meta campaigns at €2 a day, one per angle: living alone, BNPL and payment reminders. Any format above the €12 ceiling stops. Then micro-creators paid per signup, student associations, mailbox stickers and a housemate referral. Activation is the real risk, so the target is more than half of signups forwarding a first bill within 48 hours.

**Sources:** [PLAN] [MODEL]

### Slide 10: Every alternative asks for an app, manual work, or your whole mailbox
**On the slide:**
- 2×2: what you hand over (one bill ↔ whole mailbox) vs effort (typed by you ↔ read for you)
- Biggest competitor: habit

**Visual:** 2×2 grid. Top-left: Betaalbuddy (one forwarded bill, read for you). Top-right: AI inbox assistants. Bottom-left: manual calendar, direct debit. Bottom-right: budget and reminder apps (app, account, manual entry). Caption: bank apps only show what is already paid.

**Speaker notes:** Here's the field. Budget and reminder apps need an app, an account and manual entry. AI inbox assistants solve the same problem automatically, but only by taking full mailbox access and running a language model over your mail. Bank apps show what is already paid, not what is coming. Direct debit fails silently, and manual calendars get abandoned. The biggest competitor is habit: doing nothing until the reminder letter arrives. Betaalbuddy sits in the one quadrant that is automatic without the mailbox. The threats I watch are banks adding reminder features, AI-scanning competitors, rising ad costs and churn. A bank could add reminders, but it sees payments, not the email bill before it is paid.

**Sources:** [LIVE]

### Slide 11: Managed EU services let one founder run this for about €0.25 per customer per month
**On the slide:**
- Postmark → FastAPI on Railway → Supabase Postgres (Frankfurt) → calendar feed and email
- No AI inference cost; payments through Mollie
- Privacy promises are tests in CI

**Visual:** Left-to-right architecture diagram: Postmark inbound → FastAPI (Python) on Railway → Supabase Postgres, EU Frankfurt, RLS → Postmark outbound + ICS calendar feed; Mollie under the API. Three callouts: no AI inference cost, EU data residency, CI enforces privacy.

**Speaker notes:** The stack is boring on purpose. It runs Python and FastAPI on Railway, Postgres on Supabase in Frankfurt, email in and out through Postmark, and payments through Mollie: iDEAL, the Dutch bank-payment method, plus Apple Pay, Google Pay and SEPA direct debit. Everything is managed, so scaling means a bigger plan, not more engineers. With no AI inference, running cost models at about 25 cents per customer per month, roughly €750 a month at 3,000 customers. Data stays in the EU. The privacy promises are tests: CI fails on AI or OCR calls, a test fails if a tracking image enters an email, every table has row-level security, and links are HMAC-signed. A status page watches all five providers.

**Sources:** [LIVE] [MODEL]

### Slide 12: Prove demand first, then scale: three phases, each closing a named risk
**On the slide:**
- Prove (to Feb 2027): 100 paying, >50% activation
- Repeat (to Aug 2027): CAC < €12 across 3 audiences
- Scale (to Nov 2027): 1,000–3,000 paying, annual plan decided

**Visual:** Horizontal timeline with three phase blocks (Prove, Repeat, Scale), each with its exit gate. A 'Today: Nov 2026' marker at the start. All labelled PLAN.

**Speaker notes:** The order matters. First we prove people pay and use it: 35 paying by mid-December, 100 within 90 days, more than half of signups forwarding a bill within 48 hours, and a measured cost per signup per audience. Only then does real money go into channels, with cost per signup under €12 across three audiences and first retention cohorts. Extraction gets tested on 30 to 50 real invoices. Then we scale: 1,000 to 3,000 paying customers within 12 months, and a decision on an annual plan. SMS or WhatsApp alerts come after that, as a second plan. Every date here is a plan. Each phase has a gate, and if the numbers don't come, the next phase isn't funded.

**Sources:** [PLAN]

### Slide 13: One founder built and shipped all of this, with almost no overhead
**On the slide:**
- [FILL IN: name, background, relevant track record]
- Built solo: extraction rules, payments, privacy CI, 120-concept ad pipeline
- Next hire only when revenue pays for it

**Visual:** Photo frame placeholder on the left; on the right a 'Built' column of five shipped items with check icons and a red [FILL IN] block for background and hours per week.

**Speaker notes:** [FILL IN: two sentences on who you are and why you understand this problem.] What I can show you is what has been built. That includes extraction rules for UBL e-invoices (the standard XML format for electronic invoices), PDFs, payment reminders and collection-agency letters, plus Mollie payments, the privacy checks in CI, a status dashboard, and an automated ad pipeline that has produced 120 concepts. All of it was built as a side project, at about €200 a month in overhead. The honest risk is capacity: one person, part time, [FILL IN: hours per week]. There is no hire in the plan until revenue pays for it. I would rather name that now than have you find it.

**Sources:** [LIVE] [FILL IN]

### Slide 14: Five risks that could stop this, and the number that shows each is under control
**On the slide:**
- Table: risk, metric, threshold (see visual)

**Visual:** Five-row table. Activation: share of signups forwarding a first bill within 48h, >50%. Willingness to pay and CAC: cost per paying signup per audience, ≤ €12. Retention: monthly churn per cohort, ≤ 8% (suggested). Extraction on real mail: amount and date correct on 30–50 real invoices, 0 wrong dates in calendars. Founder capacity: hours per week, [FILL IN].

**Speaker notes:** Five risks, five numbers. Activation: people who never forward a bill leave, so the bar is more than half within 48 hours. Willingness to pay: €12 per signup, measured per audience. Retention: no churn data yet. At €2.95 margin a €12 signup pays back in about four months; keeping acquisition near a third of lifetime margin needs about a year of lifetime, so monthly churn of 8% or lower. That is my derivation, not data. Extraction: 9 test invoices prove little; the test is 30 to 50 real ones, with zero wrong dates. Capacity: [FILL IN].

**Sources:** [MEASURED] [MODEL] [PLAN] [FILL IN]

### Slide 15: €15,000 (suggested) pays for growth up front; the business already covers its own costs
**On the slide:**
- €8k ads buffer · €4k activation · €3k legal and admin
- No salaries; overhead about €200 a month
- Instrument and terms: [FILL IN]

**Visual:** Doughnut chart of use of funds (8 / 4 / 3, in € thousands) with '€15k suggestion' in the centre; next to it each slice with what it pays for and the rule that governs it.

**Speaker notes:** Everything on this slide is a suggestion. Betaalbuddy doesn't need money to exist: overhead is about €200 a month and nobody draws a salary. What money buys is speed. I propose €15,000 on [FILL IN: instrument]. €8,000 pre-finances ads, because a customer pays back the €12 we spend over a few months, not on day one. €4,000 goes to activation: the how-to video, stickers at student houses and creator codes. €3,000 covers legal and admin, including our own entity and VAT advice. Ads only go up after the Prove phase shows a cost per signup of €12 or less. In the base case we use about €6,800 of it; the rest is buffer.

**Sources:** [FILL IN] [MODEL] [PLAN]

### Slide 16: Bills arrive by email. Betaalbuddy makes sure they're paid, then forgets them
**On the slide:**
- We remind. We don't read your inbox, keep your mail or use AI.
- [FILL IN: name · email · phone]

**Visual:** Brand blue background, mascot, the two lines above, contact details.

**Speaker notes:** To close: bills moved into the inbox, and missing one costs about as much as a year of this service. Betaalbuddy is live, it runs on rules instead of AI, it costs about €200 a month to run, and it is built so that we cannot leak what we never stored. We are early on revenue, and I've shown you exactly where we stand: an instrumented funnel, a clear drop at checkout, and a plan that proves demand before it spends on ads. The ask is [FILL IN, suggested €15,000], mainly to pre-finance ads once the numbers hold. After this I'll send you the appendix and the live funnel, and I'm happy to show you the gegevens@ page.

**Sources:** [LIVE] [FILL IN]

## Appendix

### Slide A1: Appendix A: the full funnel, 28 Oct – 24 Nov 2026, step by step
**On the slide:**
- Table: each step, count, conversion from previous step, share of visitors
- Free route: 18 started → 4 calendar files

**Visual:** Table of the paid funnel plus a second small table for the free route. Source line: GA4; purchases from Mollie.

**Speaker notes:** Here is the complete funnel. The biggest single drop is from onboarding to checkout: 91 to 12, or 13%. That is the step we're working on first. From checkout to Mollie, 12 became 2. Purchase events aren't tracked in GA4 yet, so paid customers come from the Mollie dashboard and must be filled in before presenting. The free route, where you fill in one bill and get a calendar file, had 18 starts and 4 delivered files. Paid Meta traffic showed 0 to 5 seconds of engagement, which is why tracking cleanup comes before any spend increase.

**Sources:** [MEASURED] [FILL IN]

### Slide A2: Appendix B: unit economics of the one plan, and the assumptions behind them
**On the slide:**
- Table: price, costs, margin, 12-month margin, CAC ceiling for Buddy
- Payback about 4 months on a €12 signup

**Visual:** One-row table for Buddy plus a column chart of 12-month margin vs CAC ceiling. Open assumptions listed with red chips.

**Speaker notes:** These are the modelled unit economics of the one plan. Buddy costs €3.49 a month. Costs per customer are about 25 cents a month in running costs plus 29 cents per Mollie payment. That leaves €2.95 a month and €35.40 over 12 months. The CAC ceiling of €12 is about a third of that, so a €12 signup pays back in about four months. Open questions: whether the price includes 21% VAT, which would bring the margin down to about €2.34, actual churn, Mollie fees per payment method, and whether to offer the proposed annual plan at €34.90.

**Sources:** [MODEL] [PLAN] [VERIFY] [FILL IN]

### Slide A3: Appendix C: rules instead of AI, and how we will measure accuracy on real mail
**On the slide:**
- What it reads, the rule when unsure, and the accuracy plan
- Today: 9/9 correct on a test set too small to be a baseline

**Visual:** Three columns: inputs (UBL, zipped UBL, PDF text, subject lines, reminders, collection letters, sender rules), the uncertainty rule (no calendar entry, ask-back via vul-in+id@), the measurement plan (three metrics).

**Speaker notes:** The extraction is a fixed rule system. It reads UBL e-invoices, including zipped ones, PDF text, subject lines, payment reminders without invoice fields and collection-agency letters, with sender-specific rules for senders like KPN, EasyPark, Tandata and coeo. When the amount or date isn't certain, nothing goes into the calendar. The user gets a short email and answers through vul-in+id@, where 'vul in' means 'fill in'. On 9 test invoices we got amount and due date right every time, but that set is too small to mean much. The plan is 30 to 50 real invoices, measuring the automatic read rate, the ask-back rate and wrong dates in calendars, which should be zero.

**Sources:** [LIVE] [MEASURED] [PLAN]

### Slide A4: Appendix D: what we store, for how long, and what we never store
**On the slide:**
- Table: data item, stored or not, retention

**Visual:** Table with three columns. 'Never' rows highlighted. Footer: deleted, not archived; stop@ deletes everything.

**Speaker notes:** This is the full retention table, and it's what we show users through gegevens@. The forwarded email itself is never written anywhere; it exists in memory for a few hundred milliseconds. Bill fields are kept until 14 days after the due date, or deleted immediately when marked paid, and deleted means deleted, not archived. The profile holds no name, address or date of birth, only a token, reply address, time zone, language and reminder preferences. Access is a single paid-until date. Sending an email to stop@ deletes everything. Users can download all of it as JSON or CSV from any email.

**Sources:** [LIVE] [VERIFY]

### Slide A5: Appendix E: with €15k and no salaries, the base case is profitable after about a year
**On the slide:**
- Table: customers, revenue, result and how much of the €15k is used, per scenario
- Chart: operating result per year
- All figures modelled, excl. VAT

**Visual:** Scenario table (Low, Base, High) at the top; clustered column chart of operating result per year on the left; two callout cards on the right (the buffer, the Low-case stop rule).

**Speaker notes:** These are three modelled scenarios over 36 months, from the forecast workbook, with one plan at €3.49. Nobody draws a salary and overhead is about €200 a month. Base uses €12 CAC, 8% monthly churn and 30 organic signups a month. Ads rise to €1,000 a month after the Prove phase and €2,000 from month 10. Base turns profitable in December 2027, reaches about 2,800 paying customers and €89,000 revenue excluding VAT in year 3, and uses about €6,800 of the €15,000. High is profitable from May 2027. In Low, ads stay at €180 because CAC is above €12. It still breaks even, but stays small.

**Sources:** [MODEL] [VERIFY] [FILL IN]

## Numbers check

| Figure | Slide | Source in fact sheet | Status tag | Safe to say publicly? |
|---|---|---|---|---|
| €40 minimum statutory collection costs | 2, 7, 16 | Problem | [VERIFY] | Verify before presenting (statutory collection-cost scale) |
| CJIB fine +50% after first reminder | 2 | Problem | [VERIFY] | Verify before presenting (CJIB.nl) |
| CAK rate, BKR registration for BNPL arrears | 2 | Problem | [VERIFY] | Verify before presenting |
| ~174,000 aged 18–30 left home in 2024 | 6 | Not in fact sheet: CBS news release, 2026 week 40 | [VERIFY] | Verify against CBS StatLine before presenting |
| ~208,000 aged 18 on 1 Jan 2025 | 6 | Not in fact sheet: CBS StatLine 85510NED | [VERIFY] | Verify against CBS StatLine before presenting |
| 0.6–1.7% of one year's home-leavers | 6 | Derived: 1,000–3,000 ÷ 174,000 | [MODEL] | Yes, once 174,000 is verified |
| One plan: Buddy €3.49/month (Basic and Premium dropped; SMS/WhatsApp plan later) | 7, B | Business model, founder decision Nov 2026 | [MODEL] | Yes |
| €41.88 (≈ €42) for a year of Buddy | 7, 16 | Derived: €3.49 × 12 | [MODEL] | Yes |
| €0.25 running cost per customer per month | 3, 7, 11, B | Tech stack | [MODEL] | Yes, labelled as modelled |
| €0.29 per Mollie payment | 7, B | Tech stack | [MODEL] | Check against your Mollie contract per payment method |
| Margin €2.95 per month (€2.34 if the price includes VAT) | 7, B | Unit economics | [MODEL] | Yes as a model; confirm VAT treatment first |
| 12-month margin €35.40 | B | Unit economics | [MODEL] | Yes as a model |
| CAC ceiling €12 | 7, 9, 14, B | Unit economics | [MODEL] | Yes |
| Payback ≈ 4 months on a €12 signup | 14, B | Derived: €12 ÷ €2.95 | [MODEL] | Yes |
| Monthly churn ≤ 8% threshold | 14 | Derived suggestion (≈ 12-month lifetime) | [MODEL] | Yes, labelled as a suggestion |
| 131 → 91 → 12 → 6 → 2 → 0 confirmed | 8, A | Traction (GA4) | [MEASURED] | Yes, with the period and "purchases not in GA4" |
| 69%, 13%, 9.2%, 4.6%, 1.5% | 8, A | Derived from the funnel | [MEASURED] | Yes |
| Free route 18 → 4 (22%) | A | Traction | [MEASURED] | Yes |
| 0–5 seconds Meta engagement | 8, A | Traction | [MEASURED] | Yes |
| 120 ad concepts | 8, 13 | Tech stack / traction | [LIVE] | Yes |
| 9/9 invoices, 100% amount and date | 14, C | Traction | [MEASURED] | Only with "test set of 9, too small to be a baseline" |
| Reminders 7 and 2 days ahead | 4 | Product | [LIVE] | Yes |
| Delete 14 days after due date | 5, D | Privacy architecture | [LIVE] | Yes |
| 3 Meta campaigns × €2/day | 9 | Traction | [PLAN] | Yes, as a planned test |
| 35 paying by mid-Dec; 100 in 90 days; 1,000–3,000 in 12 months | 12, 6 | Traction | [PLAN] | Yes, as targets |
| >50% first bill within 48h | 9, 12, 14 | Go-to-market | [PLAN] | Yes, as a target |
| Annual €34.90/year | B | Business model | [PLAN] | Only as "proposed, not decided" |
| ≈ €750/month running cost at 3,000 customers | 11 (notes) | Derived: 3,000 × €0.25 | [MODEL] | Yes, labelled as modelled |
| €15k, €8k / €4k / €3k, no salaries | 15 | Suggestion (ask is [FILL IN]) | [FILL IN] | No, not until the founder confirms the ask |
| Base uses about €6.8k of the €15k | 15, E | Forecast workbook (lowest cash point) | [MODEL] | Yes, as modelled |
| Scenario inputs: CAC €15/€12/€9, churn 12%/8%/5%, organic 10/30/75 a month, referral 1/2/3% | E, forecast workbook | Assumptions for illustration, not in fact sheet | [MODEL] | Yes, clearly labelled as scenarios |
| Base: 2,788 customers, €89k revenue, +€46k result in year 3, profitable from Dec 2027 | E | Forecast workbook | [MODEL] | Yes, as a modelled scenario; VAT treatment still to verify |
| High: profitable from May 2027, €284k revenue year 3 | E | Forecast workbook | [MODEL] | Yes, as the upside case, never as the plan |
| Low: ads stay at €180/month, about 200 customers, profitable from Feb 2028 | E | Forecast workbook | [MODEL] | Yes, with the stop rule |
| Overhead about €200 a month, no salaries | 13, 15, E | Founder input (minimal overhead) | [MODEL] | Yes |
| Paying customers, MRR | 8, A | Traction | [FILL IN] | Must be filled in before presenting |

## Fill-in list

Ordered by importance.

1. **Paying customers and MRR.** Mollie dashboard: subscriptions and payments since launch. Investors will ask this first.
2. **Founder name, background and relevant track record.** From you. Two sentences on why you understand this problem.
3. **Time commitment.** Hours per week you put in. The plan has no hire until revenue pays for it.
4. **The ask: amount and instrument.** Confirm or replace the €15k suggestion (€8k ads buffer, €4k activation, €3k legal and admin). For this size a convertible loan or simple loan is common; get it checked by an advisor.
5. **Legal entity investors would invest in.** Recommended, not on the fact sheet. Terms name PRJCT Agency as the contracting entity. Check your KvK (Chamber of Commerce) extract and decide whether Betaalbuddy needs its own BV.
6. **VAT treatment of prices.** Ask your accountant. If €3.49 includes 21% VAT, net revenue is about €2.88 and every margin on slide 7 drops by about €0.61.
7. **Share of young adults who receive bills by email.** Candidate sources: CBS, Nibud, Wijzer in geldzaken or Betaalvereniging research. Needed for the euro market size on slide 6.
8. **Share who paid a bill late in the past year.** Candidate sources: Nibud, CBS, BKR, Wijzer in geldzaken surveys. Needed for slide 6.
9. **Population aged 18–27.** CBS StatLine 7461bev or 85510NED: sum single ages 18 to 27 for 1 January 2025. Also verify the 174,000 and 208,000 figures.
10. **Read-rate target for extraction.** Set it after the first 30–50 real invoices (slide 14).
11. **Verify €40, CJIB +50%, CAK and BKR claims.** Government sources: rijksoverheid.nl, CJIB.nl, CAK.nl, BKR.nl.
12. **Mollie fee per payment method.** Your Mollie contract. iDEAL and SEPA direct debit may differ from €0.29.
13. **Retention after a lapsed payment.** Check in the code what happens to a profile when paid_until passes (appendix D).
14. **Contact details and founder photo.** For slides 13 and 16.
15. **GA4 purchase event.** Not a fill-in for the deck, but fixing it means slide 8 can show the full funnel from one source.

## Likely investor questions

**1. Is this venture-scale? 3,000 customers at about €3.60 a month is roughly €130k a year.**
Honestly, not proven yet, and we're not pretending: the ask is €15k, not a venture round. The business runs on about €200 a month, so this money only buys speed. The euro market size beyond the beachhead is still on the fill-in list, and a bigger round only makes sense once churn and CAC are measured.

**2. Why won't a bank, Google or an AI assistant just build this?**
A bank only sees payments, not the email bill before it's paid. An AI inbox assistant's whole product is reading the mailbox, so it can't credibly promise that nothing is read or kept. Banks adding reminder features is a real threat and it's on my list; our answer is that we work for the bill wherever it comes from.

**3. Your funnel shows zero confirmed purchases in GA4. Why should I believe anyone will pay?**
GA4 doesn't track purchases yet, so Mollie is the source of truth: [FILL IN paying customers]. What the funnel does show is strong interest (69% open onboarding) and a specific leak at checkout. Willingness to pay is risk number two, and the Prove phase is built to answer it before any scale budget is spent.

**4. Without AI, how good is the extraction on real mail?**
We don't know yet, and I won't claim it. It's 100% on 9 test invoices, which is too small to mean much. The plan is 30 to 50 real invoices measured for read rate, ask-back rate and wrong dates. The design rule is that an uncertain date never reaches the calendar; it becomes a question by email.

**5. What's churn? Once someone sets up direct debit, why keep paying?**
There's no churn data yet. The model needs monthly churn of about 8% or lower to keep acquisition at about a third of lifetime margin. Retention cohorts are a gate in the Repeat phase. Direct debit fails silently, and many bills, like fines and BNPL, aren't on direct debit at all.

**6. Paying, then forwarding an email, is a lot of friction for an 18-year-old. Will they activate?**
That's the main risk, which is why it's the first row on the risk slide. The target is more than half of signups forwarding a first bill within 48 hours, helped by a 20-second how-to video, a nudge after one day and confirmation of the first success. If we miss it, we fix onboarding before buying more traffic.

**7. You're a solo, part-time founder, and the contract entity is PRJCT Agency. What exactly am I backing?**
You're backing a founder who has shipped the whole product as a side project on about €200 a month. [FILL IN: hours per week]; there is no hire until revenue pays for it. The entity structure is [FILL IN]; €3k of the round goes to sorting it before money moves.

**8. You process IBANs and payment details. What's your GDPR exposure?**
Smaller than most, by design. The forwarded mail is never written to disk, bill fields are deleted 14 days after the due date or when paid, there's no name or address, data stays in Frankfurt, and CI blocks external AI or OCR calls. What we do hold (amount, date, IBAN, reference) is short-lived and visible to the user via gegevens@.
