# Reto Cafe POS and System Guide

This is the operating guide for the live Reto Cafe system.

The product has three user modes:

- Guest: browse the menu and place an order with no signup.
- Member: sign in for wallet, saved account details, and order history.
- Admin: restaurant operations access for owners and the ops team.

There is no native install required for POS. The whole system runs in a browser and is hardware agnostic.

---

## 1. System Overview

The customer site, admin tools, and POS all use the same backend.

Order flow:

```text
Guest or Member places an order
        |
Any Admin account can also enter an order from a phone
        |
Order is written to Supabase
        |
POS on the cashier machine receives it in real time
        |
Cashier updates status: pending -> preparing -> ready -> done
```

The POS board is live. When a new order is created anywhere in the system, it appears on `/pos` without refresh.

---

## 2. Roles and Access

| Mode | What it means | Where they use it |
|------|---------------|-------------------|
| Guest | Browse and order without an account | Public site |
| Member | Logged-in customer account | Public site and wallet pages |
| Admin | Restaurant operations account | Mobile admin pages and cashier POS |

Important:

- Guest is the default when someone opens the site.
- Member and Admin both log in through the same auth flow.
- `/pos` is admin-only and is meant for the cashier machine.
- Admins can also use the order-entry screen on their phones.

---

## 3. Setup

### 3.1 Create Admin Accounts

1. Sign up normally at `/auth/register`.
2. In Supabase, update the profile role to `admin` for the restaurant ops account.
3. Repeat for each ops phone or owner account that should have admin access.

If you already have existing `staff` or `cashier` rows from earlier testing, treat them as legacy and convert them to `admin`.

### 3.2 Set Up the Cashier Machine

1. Open Chrome or Edge on the existing cashier machine.
2. Go to `https://retocafe.vercel.app/pos`.
3. Sign in with the dedicated admin account for that terminal.
4. Bookmark the page or create a desktop shortcut.
5. Optional: use kiosk mode or "open as window" so it behaves like a dedicated POS app.

No install package is needed. The machine only needs a modern browser and internet access.

### 3.3 Set Up Admin Phones

1. Open `https://retocafe.vercel.app`.
2. Sign in with an admin account.
3. Use the admin dashboard or the order-entry screen for live order capture.

That lets the restaurant stay hardware agnostic. A phone can create orders, and the cashier machine can monitor them on the POS screen.

### 3.4 Menu Setup

The menu is already seeded.

Use `/admin/menu` to:

- add or edit categories
- add or edit menu items
- upload or replace item photos
- toggle availability for sold-out items

---

## 4. Customer Flow

Guests and members use the public site:

1. Open `retocafe.vercel.app`
2. Browse the menu
3. Add items to cart
4. Checkout with cash or wallet
5. Get an order ID and track progress

Members get:

- wallet top-ups
- saved account access
- order history

Guests get the default no-signup flow.

---

## 5. Admin Order Entry

The admin order-entry screen is for restaurant ops using phones.

Use it when an admin user needs to enter an order on behalf of a table or walk-in customer.

Flow:

1. Sign in with an Admin account.
2. Open the admin order-entry page.
3. Select menu items and quantities.
4. Enter the table number if needed.
5. Submit the order.

The order immediately appears on `/pos`.

---

## 6. POS Dashboard

Open the cashier terminal at:

`https://retocafe.vercel.app/pos`

This page is for the cashier machine only.

### 6.1 What It Shows

- Pending orders
- Preparing orders
- Ready orders
- Payment method
- Table number
- Order total

### 6.2 What Cashiers Do

The cashier advances each order through the workflow:

| Status | Next action |
|--------|-------------|
| Pending | Mark as preparing |
| Preparing | Mark as ready |
| Ready | Mark as done |

Cash orders are collected physically.

Wallet orders are already paid through the app.

### 6.3 POS Best Practice

- Keep the POS tab open during service.
- If the screen sleeps, wake it and the board will resync.
- If you need it to feel like a dedicated terminal, use kiosk mode or a pinned shortcut.

---

## 7. Admin Panel

Open `https://retocafe.vercel.app/admin`.

Use it for:

- menu management
- order history
- user management
- wallet transactions
- order entry on mobile

---

## 8. Wallet

Members can top up their wallet and pay from stored balance.

If the balance is sufficient, checkout deducts automatically.
If the balance is too low, checkout is blocked until they top up.

Admins can review wallet activity from the admin panel.

---

## 9. Troubleshooting

**POS is not updating**

- Confirm the terminal is signed in as Admin.
- Refresh the page once.
- Check that the device still has internet access.

**Wrong account on the cashier machine**

- Sign out and use the dedicated admin account for that terminal.

**Admin phone cannot open POS**

- That account needs Admin role.
- `/pos` is admin-only by design.

**Wallet checkout fails**

- Balance is too low or the user is not signed in.

**Need to move a legacy staff/cashier account**

- Update the profile role to `admin`.

---

## 10. Short Version

If you only need the operational summary:

- Guests browse and order without signup.
- Members log in for wallet and history.
- Admins use phones for staff order entry and the cashier machine for `/pos`.
- No install is required.
- Everything syncs through Supabase in real time.
