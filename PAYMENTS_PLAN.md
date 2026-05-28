# Profile — Payments Section Plan

Add a **Payments** tab to the profile settings page where a user can add multiple
payment cards, see each one displayed separately, set a default, and delete cards.

---

## ⚠️ Read first — card data & PCI compliance

You must **never** store these in your database or even let them touch your backend:

- Full card number (PAN)
- CVV / CVC
- PIN

Storing raw card numbers makes you liable under PCI-DSS and is a serious legal/security risk.

**This plan stores only safe display metadata:**

| Stored | Example |
|---|---|
| `holderName` | "GIORGI KHOSHTARIA" |
| `brand` | "visa" / "mastercard" / "amex" |
| `last4` | "8000" |
| `expMonth` / `expYear` | 11 / 2028 |
| `isDefault` | true |

The `brand` and `last4` are derived **in the browser** from the typed number; only those
derived values are sent to the API. The full number is discarded client-side.

> If you later need to actually **charge** cards, you must integrate a payment processor
> (Stripe, or a Georgian gateway like **TBC** / **Bank of Georgia**). The processor
> tokenizes the card and you store its token instead of `last4` alone. That is a separate,
> larger task — this plan only covers the "saved cards wallet" UI + safe metadata storage.

---

## Backend — `khelovani-Web-admin-Back`

### 1. Model — `src/modules/paymentCard.modules.ts`

```
user        ObjectId ref User, required, indexed
holderName  String, required, trim, uppercase
brand       String, enum: visa | mastercard | amex | other
last4       String, required, length 4
expMonth    Number, 1–12, required
expYear     Number, required (>= current year)
isDefault   Boolean, default false
timestamps
```

Index: `{ user: 1, createdAt: -1 }` for fast per-user listing.

### 2. Validation — `src/validations/schemas/user/paymentCard.schema.ts`

Zod schema: `holderName` non-empty, `brand` in enum, `last4` 4 digits,
`expMonth` 1–12, `expYear` not in the past. (No PAN, no CVV in the schema.)

### 3. Controllers — `src/controllers/user/paymentCards/`

- `addCard` — `POST /api/user/cards`
  - Creates a card for `req.user.id`
  - If it's the user's first card, force `isDefault = true`
  - If `isDefault` sent true, unset `isDefault` on the user's other cards
- `getCards` — `GET /api/user/cards` — list current user's cards, default first
- `setDefaultCard` — `PATCH /api/user/cards/:id/default` — unset others, set this one
- `deleteCard` — `DELETE /api/user/cards/:id`
  - Reject if it's not owned by the user (404)
  - If the deleted card was default, promote the most-recent remaining card

All wrapped in `asyncHandler`, responses via `sendResponse`, ownership enforced by
matching `user: req.user.id` in every query.

### 4. Routes — add to `src/routes/user.routes.ts`

```
GET    /api/user/cards            authenticate            getCards
POST   /api/user/cards            authenticate + validate addCard
PATCH  /api/user/cards/:id/default authenticate           setDefaultCard
DELETE /api/user/cards/:id        authenticate            deleteCard
```

No new top-level router needed — these slot into the existing `user.routes.ts`
(same pattern as `/profile`).

### 5. Controller barrel

Export the four handlers from `src/controllers/user/paymentCards/index.ts` and
re-export from `src/controllers/user/index.ts`.

---

## Frontend — `Khelovani-Web-Front`

### 1. API client — `src/apiCalls/profileRequests/paymentCards.req.ts`

```ts
export interface PaymentCard {
  _id: string;
  holderName: string;
  brand: "visa" | "mastercard" | "amex" | "other";
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}
getCards(token)            -> PaymentCard[]
addCard(token, data)       -> PaymentCard      // data = safe metadata only
setDefaultCard(token, id)  -> PaymentCard[]
deleteCard(token, id)      -> void
```

### 2. Card-number helpers — `src/lib/utils/cardUtils.ts`

- `detectBrand(number)` → brand from the IIN/BIN prefix (4→visa, 51-55/2221-2720→mastercard, 34/37→amex)
- `luhnValid(number)` → Luhn checksum so we reject typos before sending
- These run **only in the browser**; the raw number never leaves the form state.

### 3. New section — `src/components/profilePage/PaymentsSection/`

- `PaymentsSection.tsx`
  - Header: title + "Add card" button (translation keys, GE/EN)
  - **Card list** — each card rendered as a separate `PaymentCardItem`
  - Empty state when no cards
- `PaymentCardItem.tsx`
  - Visual card: brand logo/name, `•••• •••• •••• 8000`, holder name, `MM/YY`
  - "Default" badge on the default card
  - Actions: "Set as default" (if not default), "Delete" (with confirm)
- `AddCardModal.tsx`
  - Inputs: card number, holder name, expiry MM/YY (no CVV field — we don't store it)
  - On submit: validate with Luhn, derive `brand` + `last4`, send only safe metadata
- `paymentsSection.scss` + `paymentCardItem.scss` matching your design tokens
  (`colors.scss`, rounded cards, the warm palette already used elsewhere)

### 4. Wire into the profile settings

In `src/components/profilePage/ProfileClient.tsx`:

- Add `"payments"` to the `TabId` union
- Add a `CardIcon` and a new entry to the `tabs` array (label `profile.tabs.payments`)
- Render `<PaymentsSection />` when `activeTab === "payments"`
- Load the user's cards (lazily when the tab opens, or alongside the profile fetch)

The sidebar nav already supports new items — Payments will appear between Security and
Danger zone, matching the screenshot order.

### 5. Translations

New `pages` namespace keys (with GE + EN), added to your translation source:

```
profile.tabs.payments        გადახდები / Payments
profile.payments.title       ბარათები / Saved cards
profile.payments.add         ბარათის დამატება / Add card
profile.payments.empty       ბარათები არ გაქვს / No cards yet
profile.payments.default     ნაგულისხმევი / Default
profile.payments.set_default ნაგულისხმევად დაყენება / Set as default
profile.payments.delete      წაშლა / Delete
profile.payments.holder      ბარათის მფლობელი / Cardholder
profile.payments.number      ბარათის ნომერი / Card number
profile.payments.expiry      ვადა / Expiry
```

(Same `t("key") || "ge fallback"` pattern the other profile components already use.)

---

## Implementation order

1. Backend model + validation schema
2. Backend controllers (add / list / setDefault / delete) + barrels
3. Backend routes in `user.routes.ts`
4. Frontend API client + card utils (brand detect + Luhn)
5. `PaymentCardItem` + `PaymentsSection` + `AddCardModal` + SCSS
6. Wire the Payments tab into `ProfileClient`
7. Add translation keys to the translation source
8. Manual test: add 2–3 cards, switch default, delete default, delete last card

## Notes

- One card is always default once the user has ≥1 card.
- Deleting cards is owner-scoped — a user can never touch another user's card.
- No CVV field anywhere — we don't collect or store it.
- If real charging is needed later, add a processor integration and store its token;
  the UI built here stays the same.
