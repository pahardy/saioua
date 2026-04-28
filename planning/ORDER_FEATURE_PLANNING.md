# Order Feature — Planning Document

**GitHub Issue:** #6  
**Date:** 2026-04-28

---

## Summary

Add an online ordering flow so site visitors can place a sai oua order. On submission:

- The visitor receives an email confirmation with an order number.
- The site owner (hardy_patrick@yahoo.ca) receives an email with the full order details.

The form must respect the currently selected language (EN / TH / LO).

---

## Clarifying Questions

Before implementation begins, the following questions need answers:

1. **Email provider** — No email library is installed. Which provider should be used?
   - **Resend** is the recommended default: simple REST API, generous free tier, good Next.js support.
   - Alternative: Nodemailer + SMTP (e.g. Gmail App Password), SendGrid, or AWS SES.
   - This decision drives what secrets/env vars are needed.
     ANSWER: Let's use Resend, to keep it simple for now.

2. **Payment** — The issue does not mention payment processing. Is this a pre-order / reservation form only (no payment collected at this stage), or should a payment step be included?
   ANSWER: that will be left out for now, as this is just a test.

3. **Product & pricing** — Should the confirmation email include a price per unit and a total? If so, what is the price? Is there a single product (sai oua), or multiple variants?
   ANSWER: Not for now, it's fine to simply send the order details only.

4. **Address scope** — Are orders only shipped to specific regions (Canada, Thailand, Laos), or worldwide? This affects whether the address form needs a country dropdown vs. a fixed-country assumption.
   ANSWER: Not a concern for now.

5. **Translations** — New i18n strings will be needed in Thai (`th.json`) and Lao (`lo.json`). Should the initial implementation use placeholder/machine translations, or will accurate translations be provided?
   ANSWER: Whatever leads to the most accurate translations.

6. **Order number format** — Simple sequential integer (requires a store/DB), random UUID, or timestamp-prefixed ID (e.g. `ORD-20260428-XK3M`)? Since there is no database in this project, a timestamp+random approach is the simplest serverless option.
   ANSWER: Let's use the simplest option for now, as there is no database.

7. **Modal vs. dedicated page** — The issue leaves this open. See the recommendation below.
   ANSWER: I'll defer to your recommendation.

---

## Recommendation: Modal (not a new page)

A slide-up or centred modal keeps the user on the rich single-page experience and avoids a full navigation. It also makes language continuity trivial (same `LanguageContext` is in scope). A dedicated `/order` page is also workable but adds routing complexity for minimal benefit given the current site structure.

**Recommendation: modal**, triggered by an "Order Now" button added to the `Hero` section (and optionally the `Header` nav).

---

## Implementation Plan

### 1. Install email library

```
npm install resend   # or nodemailer, etc. — pending answer to Q1
```

Add env var (`.env.local`, not committed):

```
RESEND_API_KEY=re_...
ORDER_NOTIFICATION_EMAIL=hardy_patrick@yahoo.ca
```

### 2. Server Action / API Route — `app/api/order/route.ts`

> **Note:** This project runs Next.js 16.2.4. Before writing the API route, read `node_modules/next/dist/docs/` to confirm the current App Router API route conventions — they may differ from Next.js 13–15 patterns.

Responsibilities:

- Validate the incoming order payload (name, address, email, phone, quantity).
- Generate an order number (e.g. `ORD-{timestamp}-{4 random hex chars}`).
- Send confirmation email to the customer.
- Send notification email to the site owner.
- Return `{ success: true, orderNumber }` or an error.

### 3. i18n — add order strings

Add an `order` namespace to `messages/en.json`, `messages/th.json`, `messages/lo.json`:

```json
"order": {
  "button": "Order Now",
  "modal_title": "Place Your Order",
  "quantity_label": "Quantity",
  "name_label": "Full Name",
  "address_label": "Mailing Address",
  "city_label": "City",
  "province_label": "Province / State",
  "postal_label": "Postal Code",
  "country_label": "Country",
  "email_label": "Email Address",
  "phone_label": "Phone Number",
  "submit": "Place Order",
  "submitting": "Placing Order...",
  "success_title": "Order Received",
  "success_body": "Thank you! Your order number is {orderNumber}. A confirmation has been sent to {email}.",
  "error_generic": "Something went wrong. Please try again."
}
```

Thai and Lao entries to be translated (placeholder English used pending Q5).

### 4. Components

| File                         | Purpose                                         |
| ---------------------------- | ----------------------------------------------- |
| `components/OrderButton.tsx` | "Order Now" CTA button; opens modal             |
| `components/OrderModal.tsx`  | Full order form, success state, and close logic |

`OrderModal` internal states: `idle → submitting → success | error`

**Form fields:**

- Quantity: `<select>` 1–10
- Full name: `<input type="text">`
- Street address: `<input type="text">`
- City: `<input type="text">`
- Province / State: `<input type="text">`
- Postal code: `<input type="text">`
- Country: `<input type="text">` (or dropdown — see Q4)
- Email: `<input type="email">`
- Phone: `<input type="tel">`

All labels use `t('order.*')` so they respond to language selection.

### 5. Integrate into existing components

- `components/Hero.tsx` — add `<OrderButton />` alongside the existing CTA.
- `components/Header.tsx` — optionally add an "Order Now" nav item (discuss with user).

### 6. Testing

Test results are written to `planning/ORDER_FEATURE.md` after implementation.

Tests live in `__tests__/order.test.tsx` and `__tests__/api-order.test.ts`. Run with `npm test`.

---

#### 6a. i18n String Completeness

**TC-I01** — All three language files (`en.json`, `th.json`, `lo.json`) contain every key in the `order` namespace.  
Pass: no missing keys; fall-through to the key path does not occur.

---

#### 6b. OrderButton Component

**TC-B01** — Button renders with the label from `t('order.button')` in English.  
Pass: button text matches `en.json order.button`.

**TC-B02** — Clicking the button fires the `onOpen` callback (or sets modal open state).  
Pass: callback invoked once on click.

**TC-B03** — Button label updates when language is switched to Thai and then Lao.  
Pass: text matches the corresponding `th.json` and `lo.json` values.

---

#### 6c. OrderModal Component

**TC-M01** — Modal renders all form fields when open.  
Pass: quantity select (options 1–10), name, street address, city, province, postal code, country, email, phone fields are all present in the DOM.

**TC-M02** — All field labels are translated when language is set to Thai.  
Pass: labels match `th.json order.*_label` values.

**TC-M03** — All field labels are translated when language is set to Lao.  
Pass: labels match `lo.json order.*_label` values.

**TC-M04** — Submitting an empty form does not call the API.  
Pass: `fetch` / server action is not invoked; validation errors visible for required fields.

**TC-M05** — Submit button shows submitting text and is disabled while the request is in flight.  
Pass: button text matches `t('order.submitting')` and `disabled` attribute is set during the pending state.

**TC-M06** — On a mocked successful API response, the modal transitions to the success state.  
Pass: success title (`t('order.success_title')`) is visible; order number and customer email appear in the body.

**TC-M07** — On a mocked API error response, the modal shows the generic error message.  
Pass: `t('order.error_generic')` is visible; form is still present so the user can retry.

**TC-M08** — Closing the modal (close button or backdrop click) unmounts or hides the modal.  
Pass: modal content is no longer in the DOM / has `hidden` state.

**TC-M09** — Quantity dropdown contains exactly options 1 through 10, in order.  
Pass: 10 `<option>` elements with values "1"–"10".

---

#### 6d. API Route — `POST /api/order`

All API route tests mock the Resend client so no real emails are sent.

**TC-A01** — Valid payload returns HTTP 200 with `{ success: true, orderNumber: string }`.  
Pass: response status 200; `orderNumber` matches pattern `ORD-\d+-[A-F0-9]{4}`.

**TC-A02** — Missing required field (`email`) returns HTTP 400.  
Pass: response status 400; body contains an error message.

**TC-A03** — Missing required field (`name`) returns HTTP 400.  
Pass: response status 400.

**TC-A04** — Missing required field (`quantity`) returns HTTP 400.  
Pass: response status 400.

**TC-A05** — On valid payload, the Resend mock is called twice: once for the customer, once for the site owner.  
Pass: mock called exactly 2 times; first call `to` matches submitted email; second call `to` matches `ORDER_NOTIFICATION_EMAIL`.

**TC-A06** — If Resend throws on the first send, the route returns HTTP 500.  
Pass: response status 500; no order number in body.

**TC-A07** — Non-POST method (e.g. GET) returns HTTP 405.  
Pass: response status 405.

---

#### 6e. Manual / Browser Verification

These cannot be automated and must be checked by hand after deployment:

**TC-E01** — Happy path in English: fill all fields, submit, see success state with order number, receive confirmation email at the submitted address, site owner receives notification at `hardy_patrick@yahoo.ca`.

**TC-E02** — Happy path in Thai: switch language before opening the modal; all labels and button text are in Thai throughout the flow.

**TC-E03** — Happy path in Lao: same as TC-E02 for Lao language.

**TC-E04** — Language switch while modal is open: switch language from EN to TH with the modal open; labels update immediately without closing the modal.

**TC-E05** — Mobile viewport (375px wide): modal is fully usable; no fields overflow; submit button is reachable without horizontal scroll.

---

## Files to Create / Modify

```
app/
  api/
    order/
      route.ts          NEW — email send + order number logic

components/
  OrderButton.tsx       NEW
  OrderModal.tsx        NEW

messages/
  en.json               MODIFY — add order namespace
  th.json               MODIFY — add order namespace
  lo.json               MODIFY — add order namespace

__tests__/
  order.test.tsx        NEW — unit tests for modal + button
  api-order.test.ts     NEW — unit tests for API route

planning/
  ORDER_FEATURE.md      NEW — testing results (post-implementation)

.env.local              NEW (gitignored) — RESEND_API_KEY, etc.
```

---

## Open Risks / Notes

- **Next.js 16 API conventions** are unknown from training data. Must read `node_modules/next/dist/docs/` before implementing the API route and any Server Actions.
- **Translation accuracy** for TH/LO order strings is unknown — flag for review before shipping.
- **Email deliverability** depends on the chosen provider and domain setup; the site owner email is a Yahoo address which may have stricter DMARC policies — Resend/SendGrid with a verified sending domain is safer than raw SMTP.
- **No database** means no persistent order history. Order numbers are ephemeral. If a record of orders is ever needed, a lightweight solution (e.g. Airtable, Supabase, or even a Google Sheet via API) should be discussed.
