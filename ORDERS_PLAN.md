# Orders Feature — Implementation Plan

End-to-end "Orders" feature: checkout creates real orders (one per partner),
a `/orders` page lists them, and the order status model is a shared 3-state
enum on both frontend and backend.

Repos:
- Frontend: `Khelovani-Web-Front` (Next.js app)
- Backend: `khelovani-Web-admin-Back` (Express + Mongoose)

---

## 1. Product decisions (locked from requirements)

### 1.1 Order status — 3 states only
We deliberately keep the status set minimal (the platform does **not** ship;
the **partner** fulfils/delivers). No "processing/shipped/packed" pipeline.

```
enum OrderStatus {
  Paid      = "paid"       // payment done, order placed, partner to fulfil
  Delivered = "delivered"  // partner marked it delivered
  Cancelled = "cancelled"  // cancelled by user (while still "paid")
}
```

- `paid` is the initial state right after checkout.
- `delivered` is set by the **partner** (separate partner-guarded endpoint).
- `cancelled` is set by the **user** (only allowed while `paid`).

UI labels (bilingual, via translations) — `Paid` may be shown as "Processing"
if preferred; the enum value stays `paid`.

### 1.2 One order per partner
If a cart contains items from 2 partners → **2 separate orders** are created at
checkout: same `user`, different `_id` + `orderNumber`, each holding only that
partner's items. Grouping key = `product.owner` (the `Organisation` ref).
Rationale: each partner delivers their own items independently.

### 1.3 No breadcrumbs on the orders page (per request).

---

## 2. Shared enum (front + back)

Mirror the existing enum convention (`src/types/addressType.enum.ts` back,
`src/lib/types/*.enum.ts` front).

- **Back:** `src/types/orderStatus.enum.ts` → `export enum OrderStatus {...}`
- **Front:** `src/lib/types/orderStatus.enum.ts` → identical string values

Keep the string values byte-identical so API payloads line up.

---

## 3. Backend (`khelovani-Web-admin-Back`)

### 3.1 New files
```
src/types/orderStatus.enum.ts                 # enum
src/modules/order.modules.ts                  # Order model
src/modules/counter.modules.ts                # atomic sequence for order numbers
src/controllers/user/orders/checkout.ts       # POST  /api/user/orders/checkout
src/controllers/user/orders/getOrders.ts      # GET   /api/user/orders
src/controllers/user/orders/getOrder.ts       # GET   /api/user/orders/:id
src/controllers/user/orders/index.ts          # re-exports
src/validations/schemas/user/order.schema.ts  # checkout body schema
```
(`cancelOrder.ts` is deferred — see 3.6.)

Edits:
```
src/controllers/user/index.ts                 # export the 3 order controllers
src/routes/user.routes.ts                      # wire routes (authenticate + validate)
```

### 3.2 Order model (`order.modules.ts`)
Snapshot prices/titles/images at purchase time so later product edits never
mutate historical orders.

```
OrderItem (subdoc, _id:false):
  product:       ObjectId ref Product   (for re-order / linking)
  titleGe/titleEn: string               (snapshot)
  image:         string                 (snapshot)
  unitPrice:     number                 (snapshot, AFTER discount)
  originalPrice: number                 (snapshot, before discount)
  quantity:      number (min 1)

Order:
  orderNumber:   string  (unique, index)   e.g. "KH-2026-00481"
  user:          ObjectId ref User (index)
  partner:       ObjectId ref Organisation (index)   // the single partner
  items:         [OrderItem]
  itemsCount:    number
  subtotal:      number
  shipping:      number
  total:         number
  status:        OrderStatus (enum, default "paid", index)
  contact:       { person, email, phone }      (snapshot)
  shippingAddress: { ...address fields }        (snapshot, not a ref)
  placedAt:      Date (default now)
  deliveredAt?:  Date
  cancelledAt?:  Date
  timestamps: true
Indexes: { user:1, createdAt:-1 }, { partner:1, status:1 }
```

### 3.3 Order number generation (race-safe)
`counter.modules.ts`: `{ _id: string, seq: number }`.
```
const c = await Counter.findOneAndUpdate(
  { _id: `order-${year}` },
  { $inc: { seq: 1 } },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);
orderNumber = `KH-${year}-${String(c.seq).padStart(5, "0")}`;
```
- Atomic `$inc` → no duplicate sequence under concurrency.
- `orderNumber` has a **unique index** as a backstop; on `E11000` retry once.

### 3.4 Checkout controller (`POST /api/user/orders/checkout`)
Body: `{ addressId: string, contact: { person, email, phone } }`
(validated by `order.schema.ts`). **All money is recomputed server-side** — the
client never sends prices.

Steps:
1. Auth: `req.user.id` or 401.
2. Load user cart, **populate products**. 400 if empty.
3. Drop/abort on products that are deleted or `isShown === false`
   (mirror `getCart` cleanup). If nothing valid remains → 400.
4. Load the address by `addressId`, assert it belongs to the user (else 400/404).
5. Group valid items by `product.owner`.
6. Recompute per item: `unitPrice = isOnSale && discountPercent ?
   round(price*(1-discount/100)) : price`. Build `OrderItem` snapshots.
7. Compute `subtotal`, `shipping` (reuse the cart's free-shipping rule:
   `>= 200 ⇒ 0 else 10` — keep the threshold/flat constants in one shared place),
   `total`, `itemsCount` **per partner group**.
8. Within a **transaction** (`mongoose session`, all-or-nothing):
   - create one `Order` per group (with a fresh `orderNumber` each);
   - clear the user's cart (`items = []`, save).
   - Commit. On any error → `abortTransaction`.
   - If the DB has no replica set (no transactions), fall back to sequential
     creation with manual rollback (delete created orders) on failure.
9. Respond `201` with the created orders (or a slim summary: numbers + count).

### 3.5 List / detail
- `GET /api/user/orders?status=&page=&limit=` → `{ user: req.user.id }`
  (+ optional `status` filter), newest first, paginated. Returns orders +
  `counts` per status (for the filter tabs) via an aggregation or parallel
  `countDocuments`.
- `GET /api/user/orders/:id` → must match `user: req.user.id` (404 otherwise).

### 3.6 Status transitions — deferred (no UI this pass)
The model supports all three states, but the orders page has **no action
buttons**, so we don't wire status-change endpoints yet. Documented seams for
later:
- `PATCH /api/user/orders/:id/cancel` — user, `paid → cancelled` (only own,
  only while `paid`).
- `PATCH /api/partner/orders/:id/deliver` — partner-guarded, `paid → delivered`.
Build these when the cancel/deliver UI is added.

### 3.7 Validation (`order.schema.ts`)
- `checkout`: `addressId` = non-empty 24-hex string; `contact.person` (2–100),
  `contact.email` (email), `contact.phone` (reuse existing phone rule).
- `:id` params validated as Mongo ObjectId (reuse existing param validator).

---

## 4. Frontend (`Khelovani-Web-Front`)

### 4.1 Data layer
```
src/lib/types/orderStatus.enum.ts          # mirror of backend enum
src/lib/types/orderTypes.ts                # Order, OrderItem, OrdersResponse, StatusCounts
src/apiCalls/profileRequests/orders.req.ts # getOrders, getOrder, cancelOrder, checkout
src/lib/hooks/useOrders.ts                 # fetch + status filter + search + paging
```

### 4.2 Page route
```
src/app/(main)/orders/page.tsx             # composes hero + tabs + list (auth guard)
src/app/(main)/orders/orders.scss          # page layout
```

### 4.3 Components — `src/components/ordersPage/`
(`ordersPage` matches the existing `cartPage` / `profilePage` convention.)
```
OrdersHero/OrdersHero.tsx + ordersHero.scss        # "Your orders" title + subtitle + search
OrderStatusTabs/OrderStatusTabs.tsx + .scss        # All / Paid / Delivered / Cancelled (+counts)
OrderCard/OrderCard.tsx + orderCard.scss           # one order (separate component + its logic)
OrderCard/useOrderCard.ts                          # expand state + derived labels/dates
OrderList/OrderList.tsx + orderList.scss           # maps orders → OrderCard, empty state
```
- **OrdersHero**: title (`prefix` + italic word), subtitle, search input. No
  breadcrumbs.
- **OrderStatusTabs**: chip row with live counts from `StatusCounts`. Reuses the
  `fd-chip`-style or a small local style; active = dark pill (matches mock).
- **OrderCard** (per mock): header row = `orderNumber`, "Ordered {date}",
  status badge (color per status), `total`, expand chevron. Expanded =
  simplified tracker (**Placed → Delivered**, since there's no shipping step),
  snapshot item rows (thumb + title + partner), footer = est/delivered date.
  Collapsed = compact summary ("N pieces · {date}").
  **No action buttons** — the card is purely informational (no Track, no
  Invoice, no Cancel button).
  - `useOrderCard` owns: `open` toggle, status→label/color mapping, date
    formatting, piece count.
- Status badge colors: paid → amber, delivered → green, cancelled → red
  (matches the mock's tinted pills).

### 4.4 Header link
Add an **Orders** link to the authenticated dropdown in
[AuthActions.tsx](src/components/header/auth-component/AuthActions.tsx),
above logout: `href="/orders"`, label `t("orders")` (navigation namespace).

### 4.5 Checkout wiring (where orders actually get created)
Shipping selects an address + contact; payment must carry them to the checkout
call. Introduce a lightweight **checkout session** (sessionStorage-backed):
```
src/lib/checkout/checkoutSession.ts   # { addressId, contact } set/get/clear
```
- `useShippingCheckout.handleContinue` → save `{ addressId: selectedId, contact }`
  then `router.push("/cart/payment")`.
- `usePaymentCheckout.handlePay` → read the session, call
  `checkout({ addressId, contact })`; on success clear session +
  `router.push("/cart/done")`. (The backend clears the cart.)
- `useOrderConfirmation` (done page) → can show the created order number(s)
  returned from checkout (optional; otherwise keep the generic thank-you).

### 4.6 Translations
First reuse what exists; only add what's missing.
- **Reuse:** `navigation.view_profile/logout`, `cart.by`, `cart.summary.*`,
  the `₾` price format, existing date rendering.
- **Add** (bilingual inline fallbacks now; DB keys later):
  - `navigation.orders`
  - `pages.orders.title_prefix` ("Your"/"თქვენი"), `pages.orders.title_word`
    ("orders"/"შეკვეთები"), `pages.orders.subtitle`,
    `pages.orders.search_placeholder`
  - `pages.orders.status.all|paid|delivered|cancelled`
  - `pages.orders.card.ordered`, `.pieces`, `.arriving`, `.delivered_on`,
    `.placed`, `.delivered`
  - `pages.orders.empty` (no-orders state)
  - `alerts.checkout_failed`

---

## 5. Bugs / edge cases to handle (explicit)

Backend:
1. **Empty cart** at checkout → 400, no order.
2. **Deleted/hidden product** between add-to-cart and checkout → filtered;
   if it empties a group, that group is skipped; if all empty → 400.
3. **Price tampering** → server recomputes every amount; client totals ignored.
4. **Duplicate order number** under load → atomic counter + unique index + retry.
5. **Partial multi-order failure** → transaction (all-or-nothing); non-replica-set
   fallback rolls back created orders.
6. **Cart not cleared / cleared without orders** → clearing happens inside the
   same transaction as creation.
7. **Address not owned by user / missing** → 400/404.
8. **Double-submit (Pay clicked twice)** → button disabled while `paying`;
   server is naturally idempotent only per-call, so also guard the client; note
   optional idempotency key for a later hardening pass.
9. **Auth/ownership** on list/detail → always filter by `req.user.id`.
11. **Unpopulated/missing `owner`** on a product → skip with a clear server log.
12. **Pagination** for large histories; default `limit` cap.
13. **Rounding** consistent with cart (`Math.round`), single shared constant
    module for `FREE_SHIPPING_THRESHOLD` / `FLAT_SHIPPING`.

Frontend:
14. **No orders** → empty-state card (icon + message + "Browse products").
15. **Loading / error** states on the list and on cancel.
16. **Status filter + search** combine; search matches `orderNumber` or item
    title (client-side over the fetched page; server search optional later).
17. **Lost shipping data** at payment → guarded by the checkout session; if
    missing (deep link to `/cart/payment`), bounce to `/cart/shipping`.
19. **Auth guard** on `/orders` (redirect to `/login` if unauthenticated),
    mirroring the other `(main)` private pages.

---

## 6. Phasing / order of work

- **Phase 0** — Shared `OrderStatus` enum (front + back) + frontend `orderTypes`.
- **Phase 1** — Backend: counter, model, checkout, list, detail, cancel,
  schema, routes. Manual API test for each + the bug list above.
- **Phase 2** — Frontend data layer: api client + `useOrders` hook.
- **Phase 3** — Frontend UI: route, `OrdersHero`, `OrderStatusTabs`,
  `OrderCard` (+ `useOrderCard`), `OrderList`, header dropdown link.
- **Phase 4** — Checkout wiring: checkout session, shipping→payment→`checkout()`,
  done page shows created order number(s).
- **Phase 5** — Edge-case hardening + (optional) order detail page / invoice /
  partner "deliver" endpoint.

---

## 7. Locked decisions

1. **Status enum** — `paid / delivered / cancelled` (confirmed). `paid` is the
   initial post-payment state and keeps that label.
2. **Card actions** — none. The card is informational only (no Track, no
   Invoice, no Cancel button).
3. **Order detail** — expand-in-place only; no `/orders/[id]` route this pass.
4. **Components folder** — `src/components/ordersPage/`.
```
