# Order Feature — Test Results

**Date:** 2026-04-28  
**Branch:** feature/issue-6-order-feature  
**Test file:** `__tests__/order.test.tsx`

---

## Summary

| Metric | Result |
|--------|--------|
| Total tests (all suites) | 76 |
| Passed | 76 |
| Failed | 0 |
| Order feature tests | 61 |
| Pre-existing regression tests | 15 |

All tests pass. No regressions in existing component or language context tests.

---

## Order Feature Tests — `__tests__/order.test.tsx`

### TC-I01 — i18n String Completeness (48 tests)

Verifies every required `order.*` key is present in all three language files.

| Test | Status |
|------|--------|
| en.json has key order.button | PASS |
| en.json has key order.modal_title | PASS |
| en.json has key order.quantity_label | PASS |
| en.json has key order.name_label | PASS |
| en.json has key order.address_label | PASS |
| en.json has key order.city_label | PASS |
| en.json has key order.province_label | PASS |
| en.json has key order.postal_label | PASS |
| en.json has key order.country_label | PASS |
| en.json has key order.email_label | PASS |
| en.json has key order.phone_label | PASS |
| en.json has key order.submit | PASS |
| en.json has key order.submitting | PASS |
| en.json has key order.success_title | PASS |
| en.json has key order.success_body | PASS |
| en.json has key order.error_generic | PASS |
| th.json has key order.button | PASS |
| th.json has key order.modal_title | PASS |
| th.json has key order.quantity_label | PASS |
| th.json has key order.name_label | PASS |
| th.json has key order.address_label | PASS |
| th.json has key order.city_label | PASS |
| th.json has key order.province_label | PASS |
| th.json has key order.postal_label | PASS |
| th.json has key order.country_label | PASS |
| th.json has key order.email_label | PASS |
| th.json has key order.phone_label | PASS |
| th.json has key order.submit | PASS |
| th.json has key order.submitting | PASS |
| th.json has key order.success_title | PASS |
| th.json has key order.success_body | PASS |
| th.json has key order.error_generic | PASS |
| lo.json has key order.button | PASS |
| lo.json has key order.modal_title | PASS |
| lo.json has key order.quantity_label | PASS |
| lo.json has key order.name_label | PASS |
| lo.json has key order.address_label | PASS |
| lo.json has key order.city_label | PASS |
| lo.json has key order.province_label | PASS |
| lo.json has key order.postal_label | PASS |
| lo.json has key order.country_label | PASS |
| lo.json has key order.email_label | PASS |
| lo.json has key order.phone_label | PASS |
| lo.json has key order.submit | PASS |
| lo.json has key order.submitting | PASS |
| lo.json has key order.success_title | PASS |
| lo.json has key order.success_body | PASS |
| lo.json has key order.error_generic | PASS |

### TC-B — OrderButton (4 tests)

| Test | Status |
|------|--------|
| TC-B01 renders with English label | PASS |
| TC-B02 calls onOpen when clicked | PASS |
| TC-B03 label matches Thai translation | PASS |
| TC-B03 label matches Lao translation | PASS |

### TC-M — OrderModal (9 tests)

| Test | Status |
|------|--------|
| TC-M01 renders all form fields when open | PASS |
| TC-M02 labels are in Thai | PASS |
| TC-M03 labels are in Lao | PASS |
| TC-M04 empty submit does not call fetch | PASS |
| TC-M05 submit button is disabled while submitting | PASS |
| TC-M06 shows success state on successful response | PASS |
| TC-M07 shows error message on failed response | PASS |
| TC-M08 onClose called when close button clicked | PASS |
| TC-M09 quantity dropdown has options 1–10 | PASS |

---

## Regression Tests (pre-existing)

### Component smoke tests — `__tests__/components.test.tsx`

| Test | Status |
|------|--------|
| Header renders site name and nav links | PASS |
| Hero renders headline and CTA | PASS |
| MakerIntro renders placeholder heading | PASS |
| ProductInfo renders section heading | PASS |
| Process renders both sub-headings | PASS |
| Contact renders email link | PASS |
| Footer renders copyright text | PASS |

### LanguageContext — `__tests__/LanguageContext.test.tsx`

| Test | Status |
|------|--------|
| defaults to English | PASS |
| resolves a top-level nested key in English | PASS |
| resolves a deeply nested key | PASS |
| returns the key path for a missing key | PASS |
| switches to Thai and returns translated text | PASS |
| switches to Lao and returns translated text | PASS |
| persists language choice to localStorage | PASS |
| restores language from localStorage on mount | PASS |

---

## Manual / Browser Tests (TC-E01–05)

These require a running dev server and a valid `RESEND_API_KEY` in `.env.local`. Pending deployment setup.

| Test | Status |
|------|--------|
| TC-E01 Happy path in English — form submission, customer email, owner notification | Pending |
| TC-E02 Happy path in Thai — all labels in Thai throughout flow | Pending |
| TC-E03 Happy path in Lao — all labels in Lao throughout flow | Pending |
| TC-E04 Language switch while modal is open | Pending |
| TC-E05 Mobile viewport (375px) — form usable, no overflow | Pending |
