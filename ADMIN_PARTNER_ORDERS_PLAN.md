# Admin & Partner Order Management — Implementation Plan

Adds order management to the **admin panel** (Khelovani-Admin-Front) on top of
the orders feature already built for the storefront:

- **Admin**: a listing of **all** orders across every user + organisation, with
  search and filters. View-only.
- **Partner**: a listing of **only its own** orders, where the partner can
  **change status** (mark delivered / cancel).

Repos:
- Backend: `khelovani-Web-admin-Back` (Express + Mongoose)
- Admin UI: `Khelovani-Admin-Front` (React + react-router, table-based listings)

Reuses what already exists: the `Order` model, `OrderStatus` enum
(`paid / delivered / cancelled`), and the permission keys already defined in
`src/middleware/role/permissions.ts`:
- Admin → `ORDER_VIEW_ALL = "orders.viewAll"`
- Partner → `ORDER_VIEW = "organization.orders.view"`, `ORDER_UPDATE = "organization.orders.update"`

A partner's `req.user.id` **is** its Organisation `_id` (= `product.owner` =
`order.partner`), so partner scoping is simply `{ partner: req.user.id }`.

---

## 1. Status semantics (locked)

```
paid ──▶ delivered      (partner marks delivered)   ← the only transition built now
delivered               = terminal
cancelled               = exists in the enum, but nobody sets it in this pass
```
- **Partner**: the only action is **mark delivered**, guarded — only the
  partner that owns the order, only from `paid`. Sets `deliveredAt`.
- **Admin**: **view-only** — no status changes.
- `cancelled` stays a valid state (for a future user/admin cancel flow) but is
  not written by anything in this pass.

---

## 2. Backend (`khelovani-Web-admin-Back`)

### 2.1 New files
```
src/controllers/admin/orders/getAllOrders.ts        # GET  /api/admin/orders
src/controllers/admin/orders/getOrderByIdAdmin.ts   # GET  /api/admin/orders/:id
src/controllers/admin/orders/index.ts
src/routes/adminRoutes/adminOrders.routes.ts        # mount /api/admin/orders

src/controllers/partners/orders/getPartnerOrders.ts        # GET   /api/partner/orders
src/controllers/partners/orders/deliverPartnerOrder.ts     # PATCH /api/partner/orders/:id/deliver
src/controllers/partners/orders/index.ts
src/routes/partnerOrders.routes.ts                  # mount /api/partner/orders

src/validations/schemas/order/orderQuery.schema.ts  # list query (status/date/page)
src/validations/schemas/order/orderId.schema.ts     # :id ObjectId param
```
Edits:
```
src/routes/index.ts   # apiRouter.use("/admin/orders", ...) + ("/partner/orders", ...)
```

### 2.2 Admin — `getAllOrders` (`GET /api/admin/orders`)
- Middleware: `authenticate` + `requirePermission(PERMISSIONS.ADMIN.ORDER_VIEW_ALL)`.
- Query: `search`, `status`, `partner` (org id), `userId`, `dateFrom`, `dateTo`,
  `page`, `limit` (mirror `getAllPartners` pagination).
- `search` matches `orderNumber` (regex, **escapeRegex**) and — via populated
  refs — user name/email + org name. Because user/org live on refs, do either:
  (a) `$lookup` aggregation to search joined fields, or (b) pre-resolve matching
  user/org `_id`s then `$in`. Plan: aggregation pipeline with `$lookup` on
  `user` + `partner`, `$match`, `$facet` for data + count.
- Populate `user` (name/email) + `partner` (companyName*). Sort `createdAt:-1`.
- Returns data + meta `{ currentPage, totalPages, totalCount, counts }`.

### 2.3 Admin — `getOrderByIdAdmin` (`GET /api/admin/orders/:id`)
- Same permission. Full order populated (user + partner). 404 if missing.

### 2.4 Partner — `getPartnerOrders` (`GET /api/partner/orders`)
- Middleware: `authenticate` + `requirePermission(PERMISSIONS.PARTNER.ORDER_VIEW)`.
- Filter `{ partner: req.user.id }` + optional `status`, `search`, date, paging.
- Populate `user` (name/email) so the partner can see who to deliver to.
  (Contact + shippingAddress are already snapshotted on the order.)
- Returns data + meta + per-status `counts`.

### 2.5 Partner — `deliverPartnerOrder` (`PATCH /api/partner/orders/:id/deliver`)
- Middleware: `authenticate` + `requirePermission(PERMISSIONS.PARTNER.ORDER_UPDATE)`.
- No body — the only action is "mark delivered".
- Load `{ _id, partner: req.user.id }` → 404 if not theirs.
- Enforce transition: current must be `paid`; else 409 `invalid_status_transition`.
- Set `status = delivered`, `deliveredAt = now`. Save. Return updated order.

### 2.6 Validation
- `orderId.schema.ts`: `:id` ObjectId param.
- `orderQuery.schema.ts`: coerce/limit `page`,`limit`; `status` ∈ enum; dates ISO.

---

## 3. Admin UI (`Khelovani-Admin-Front`)

Mirror the existing product-listing architecture
(`pages/products/listing` + `components/products/listing` + a `useProductListing`
hook + `apiCalls`). Admin sees all; partner self-view lives under `/profile/*`
exactly like `/profile/products` does today.

### 3.1 Data layer
```
src/apiCalls/orderApiCalls/getAllOrders.req.ts       # admin
src/apiCalls/orderApiCalls/getPartnerOrders.req.ts   # partner
src/apiCalls/orderApiCalls/deliverOrder.req.ts        # partner mark-delivered
src/types/orderTypes.ts                              # Order, OrderStatus, etc.
src/hooks/orders/useOrderListing.ts                  # fetch + filters + paging + isAdmin/isProfile + deliver action
```
`useOrderListing` detects mode from the route (admin `/orders` vs partner
`/profile/orders`, like `isProfileMode` in `ProductListingPage`) and calls the
matching endpoint; exposes `markDelivered(orderId)` for partners.

### 3.2 Pages + components
```
src/pages/orders/listing/OrderListingPage.tsx + .scss
src/components/orders/listing/OrderFilters.tsx + .scss   # search + status + org + date
src/components/orders/listing/OrderListHeader.tsx + .scss
src/components/orders/listing/OrderTableRow.tsx + .scss  # expandable row
```
- **OrderTableRow** columns: order #, customer (user, admin only), organisation
  (admin only), items count, total, status badge, placed date, action. Clicking
  the row **expands it in place** to show items + shipping address (no detail
  route).
- **Action**: partner mode shows **Mark delivered** only when
  `status === "paid"`, gated by `ORDER_UPDATE` → calls `markDelivered`. Admin
  mode = no actions (view-only).
- **OrderFilters**: search box, status segmented control (All/Paid/Delivered/
  Cancelled with counts), org filter (admin only), date range.

### 3.3 Routing (`src/App.tsx`)
- Admin-only group (`ProtectedRoute allowedRoles={["admin"]}`):
  - `path: "orders"` → `OrderListingPage`
- Profile group (`ProtectedRoute`):
  - `path: "profile/orders"` → `OrderListingPage` (partner mode)

No `:id` detail routes — rows expand in place.

### 3.4 Sidebar
Add an **Orders** nav item, shown when the user has `orders.viewAll`
(admin → `/orders`) **or** `organization.orders.view` (partner → `/profile/orders`).

### 3.5 Translations
Add admin-panel order labels (status names, column headers, filter labels,
action labels, confirm dialogs) following the admin app's i18n convention.

---

## 4. Bugs / edge cases

Backend:
1. **Ownership** — partner endpoints always filter `{ partner: req.user.id }`;
   status update re-checks ownership before mutating.
2. **Invalid transition** — only `paid → delivered`; re-delivering or acting on
   a terminal order → 409 (idempotency-safe).
3. **Permission gaps** — admin list requires `orders.viewAll`; partner requires
   `organization.orders.view` / `.update`. No cross-tenant leakage.
4. **Search injection** — `escapeRegex` on all regex search input.
5. **Ref search cost** — `$lookup` only in the admin list; index `user`,
   `partner`, `status`, `createdAt` (already indexed on the model).
6. **Bad `:id`** — ObjectId param validation → 422 not 500.
7. **Pagination caps** — clamp `limit` (e.g. ≤ 50).
8. **Date filter** — validate ISO; `dateFrom`/`dateTo` inclusive on `createdAt`.
9. **Counts accuracy** — counts computed over the *scoped* set (admin = all,
   partner = own), independent of the active status filter.

Frontend:
10. **Stale row after status change** — optimistic update or refetch the page.
11. **Double action** — disable the action button while the PATCH is in flight.
12. **Mode gating** — partner never sees customer PII columns beyond what the
    order snapshot already exposes; admin sees full. Hide actions in admin mode.
13. **Empty / loading / error** states on the table.
14. **Permission-aware sidebar + route guards** so neither role reaches the
    other's endpoint.

---

## 5. Phasing

- **Phase 1 — Backend**: admin `getAllOrders` + `getOrderByIdAdmin`; partner
  `getPartnerOrders` + `deliverPartnerOrder`; schemas; routes; `tsc`.
- **Phase 2 — Admin UI data layer**: `orderApiCalls` + `useOrderListing` +
  `orderTypes`.
- **Phase 3 — Admin UI**: `OrderListingPage` + filters/header/expandable row,
  routes, sidebar item (admin all-orders view).
- **Phase 4 — Partner UI**: `/profile/orders` mode + the **Mark delivered**
  action wired to `deliverOrder`.

---

## 6. Locked decisions

1. **Admin** — view-only (no status changes).
2. **Partner** — **deliver only** (`paid → delivered`); no cancel.
3. **Detail view** — listing table with **expandable rows**; no `:id` detail
   route.
4. **Listing style** — table rows, mirroring the products admin.
```
