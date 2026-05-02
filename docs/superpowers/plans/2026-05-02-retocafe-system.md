# Reto Cafe Full-Stack System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack cafe ordering system with immersive customer-facing UIUX, real-time waiter-to-cashier order sync, wallet system, and admin dashboard — hosted on Vercel with Supabase backend.

**Architecture:** Next.js 15 App Router on Vercel, Supabase for auth + Postgres + Realtime, CartContext for client-side cart state, role-based middleware protecting /staff, /pos, /admin routes. Orders flow: waiter submits → Supabase insert → Supabase Realtime broadcasts → cashier POS screen updates instantly.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Supabase (auth + db + realtime + storage), shadcn/ui, Lucide React

---

## Color Palette & Design Tokens

```
Background:     #1a1108  (deep charcoal-brown)
Surface:        #241608  (card backgrounds)
Border:         #3d2a0e  (subtle borders)
Accent:         #f59e0b  (amber — primary CTA, prices, highlights)
Accent Hover:   #d97706
Text Primary:   #fef3c7  (warm cream)
Text Secondary: #d4a96a  (muted warm)
Text Muted:     #8a6a3a
Success:        #22c55e
Error:          #ef4444
```

---

## File Structure

```
C:\dev\retocafe\
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout, fonts, providers
│   │   ├── page.tsx                    # Homepage (hero + featured menu)
│   │   ├── globals.css                 # Tailwind + custom vars
│   │   ├── menu/page.tsx               # Full menu with category filter
│   │   ├── cart/page.tsx               # Cart review page
│   │   ├── checkout/page.tsx           # Payment selection + order submit
│   │   ├── order/[id]/page.tsx         # Order status tracking
│   │   ├── account/page.tsx            # Profile + order history
│   │   ├── wallet/page.tsx             # Balance + top up + transactions
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── staff/page.tsx              # Waiter order entry (role: staff)
│   │   ├── pos/page.tsx                # Cashier real-time dashboard (role: cashier|admin)
│   │   └── admin/
│   │       ├── page.tsx                # Admin overview
│   │       ├── menu/page.tsx           # Menu management
│   │       ├── orders/page.tsx         # All orders
│   │       ├── users/page.tsx          # User management
│   │       └── wallet/page.tsx         # Wallet transactions
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              # Top nav (logo, cart icon, auth)
│   │   │   └── Footer.tsx
│   │   ├── menu/
│   │   │   ├── MenuGrid.tsx            # Menu items grid with category filter
│   │   │   ├── MenuItemCard.tsx        # Individual item card + Add to Cart
│   │   │   └── CategoryTabs.tsx        # Horizontal category filter tabs
│   │   ├── cart/
│   │   │   ├── CartSidebar.tsx         # Slide-in cart panel
│   │   │   └── CartItem.tsx            # Single cart line item
│   │   ├── pos/
│   │   │   ├── OrderCard.tsx           # POS order card with status controls
│   │   │   └── POSBoard.tsx            # Real-time order board (Supabase Realtime)
│   │   ├── admin/
│   │   │   ├── MenuItemForm.tsx        # Add/edit menu item form
│   │   │   └── CategoryForm.tsx        # Add/edit category form
│   │   └── ui/
│   │       ├── Button.tsx              # Amber CTA button
│   │       ├── Badge.tsx               # Order status badge
│   │       └── Modal.tsx               # Reusable modal
│   ├── context/
│   │   └── CartContext.tsx             # Cart state (items, add, remove, clear)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts               # Browser Supabase client
│   │   │   ├── server.ts               # Server Supabase client (cookies)
│   │   │   └── middleware.ts           # Auth + role check middleware
│   │   ├── types.ts                    # All TypeScript types
│   │   └── utils.ts                    # formatPrice, formatDate, cn()
│   └── middleware.ts                   # Next.js middleware (route protection)
├── supabase/
│   └── schema.sql                      # Full DB schema + RLS policies
├── .env.local.example
└── docs/superpowers/plans/
    └── 2026-05-02-retocafe-system.md
```

---

## Task 1: Project Initialization

**Files:**
- Create: `C:\dev\retocafe\` (Next.js project)
- Create: `.env.local.example`
- Create: `src/app/globals.css`

- [ ] **Step 1: Scaffold Next.js project**

```bash
cd C:\dev
npx create-next-app@latest retocafe --typescript --tailwind --app --eslint --src-dir --import-alias "@/*" --no-git
cd retocafe
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr framer-motion lucide-react clsx tailwind-merge
npx shadcn@latest init --defaults
npx shadcn@latest add button input label card badge tabs dialog toast separator
```

- [ ] **Step 3: Create `.env.local.example`**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Copy to `.env.local` and fill with real values from Supabase dashboard.

- [ ] **Step 4: Set CSS variables in `src/app/globals.css`**

```css
@import "tailwindcss";

:root {
  --bg: #1a1108;
  --surface: #241608;
  --border: #3d2a0e;
  --accent: #f59e0b;
  --accent-hover: #d97706;
  --text-primary: #fef3c7;
  --text-secondary: #d4a96a;
  --text-muted: #8a6a3a;
}

body {
  background-color: var(--bg);
  color: var(--text-primary);
}
```

- [ ] **Step 5: Update `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#1a1108",
        surface: "#241608",
        border: "#3d2a0e",
        accent: "#f59e0b",
        "accent-hover": "#d97706",
        "text-primary": "#fef3c7",
        "text-secondary": "#d4a96a",
        "text-muted": "#8a6a3a",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```
Expected: App runs at http://localhost:3000 with default Next.js page.

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: initialize retocafe Next.js project"
```

---

## Task 2: TypeScript Types + Utilities

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Create `src/lib/types.ts`**

```ts
export type Role = "customer" | "staff" | "cashier" | "admin";

export type OrderStatus = "pending" | "preparing" | "ready" | "done";

export type PaymentMethod = "cash" | "wallet";

export type WalletTransactionType = "topup" | "deduct";

export interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  role: Role;
  created_at: string;
}

export interface WalletBalance {
  user_id: string;
  balance: number;
}

export interface WalletTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: WalletTransactionType;
  description: string;
  reference_id: string | null;
  created_at: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  category_id: string;
  category?: MenuCategory;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
}

export interface CartItem {
  menu_item: MenuItem;
  quantity: number;
  notes: string;
}

export interface Order {
  id: string;
  customer_id: string | null;
  staff_id: string | null;
  table_number: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  wallet_deducted: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  name: string;
  unit_price: number;
  quantity: number;
  notes: string | null;
}
```

- [ ] **Step 2: Create `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  done: "Done",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  preparing: "bg-blue-500/20 text-blue-400",
  ready: "bg-green-500/20 text-green-400",
  done: "bg-gray-500/20 text-gray-400",
};
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/
git commit -m "feat: add TypeScript types and utilities"
```

---

## Task 3: Supabase Schema

**Files:**
- Create: `supabase/schema.sql`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`

- [ ] **Step 1: Create `supabase/schema.sql`**

```sql
-- Profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer','staff','cashier','admin')),
  created_at timestamptz default now()
);

-- Wallet balances
create table public.wallet_balances (
  user_id uuid references public.profiles on delete cascade primary key,
  balance numeric(10,2) not null default 0 check (balance >= 0)
);

-- Wallet transactions
create table public.wallet_transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  amount numeric(10,2) not null,
  type text not null check (type in ('topup','deduct')),
  description text not null,
  reference_id uuid,
  created_at timestamptz default now()
);

-- Menu categories
create table public.menu_categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  display_order int not null default 0,
  is_active boolean not null default true
);

-- Menu items
create table public.menu_items (
  id uuid default gen_random_uuid() primary key,
  category_id uuid references public.menu_categories on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  is_available boolean not null default true,
  display_order int not null default 0
);

-- Orders
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  customer_id uuid references public.profiles on delete set null,
  staff_id uuid references public.profiles on delete set null,
  table_number text,
  status text not null default 'pending' check (status in ('pending','preparing','ready','done')),
  payment_method text not null check (payment_method in ('cash','wallet')),
  subtotal numeric(10,2) not null,
  wallet_deducted numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Order items
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders on delete cascade not null,
  menu_item_id uuid references public.menu_items on delete set null,
  name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  notes text
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'phone'
  );
  insert into public.wallet_balances (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at on orders
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_order_updated
  before update on public.orders
  for each row execute function public.handle_updated_at();

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.wallet_balances enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles: users read own, staff/cashier/admin read all
create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "staff read all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('staff','cashier','admin'))
);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);

-- Wallet: users see own
create policy "users read own wallet" on public.wallet_balances for select using (auth.uid() = user_id);
create policy "users read own transactions" on public.wallet_transactions for select using (auth.uid() = user_id);

-- Menu: anyone can read active items
create policy "anyone reads active categories" on public.menu_categories for select using (is_active = true);
create policy "admin manages categories" on public.menu_categories for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
create policy "anyone reads available items" on public.menu_items for select using (is_available = true);
create policy "admin manages items" on public.menu_items for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Orders: customer sees own, staff/cashier/admin see all
create policy "customer reads own orders" on public.orders for select using (auth.uid() = customer_id);
create policy "staff manages orders" on public.orders for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('staff','cashier','admin'))
);
create policy "customer inserts own order" on public.orders for insert with check (auth.uid() = customer_id or customer_id is null);

create policy "customer reads own order items" on public.order_items for select using (
  exists (select 1 from public.orders where id = order_id and customer_id = auth.uid())
);
create policy "staff reads all order items" on public.order_items for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('staff','cashier','admin'))
);
create policy "anyone inserts order items" on public.order_items for insert with check (true);

-- Enable Realtime on orders
alter publication supabase_realtime add table public.orders;
```

Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query → paste → Run).

- [ ] **Step 2: Create `src/lib/supabase/client.ts`**

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

- [ ] **Step 3: Create `src/lib/supabase/server.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add supabase/ src/lib/supabase/
git commit -m "feat: add Supabase schema and clients"
```

---

## Task 4: Middleware + Route Protection

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create `src/middleware.ts`**

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Auth-required routes
  const authRequired = ["/account", "/wallet", "/checkout", "/staff", "/pos", "/admin"];
  if (authRequired.some((r) => path.startsWith(r)) && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Role-protected routes
  if (user && (path.startsWith("/staff") || path.startsWith("/pos") || path.startsWith("/admin"))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (path.startsWith("/pos") && !["cashier", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (path.startsWith("/staff") && !["staff", "admin"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add route protection middleware"
```

---

## Task 5: Cart Context

**Files:**
- Create: `src/context/CartContext.tsx`

- [ ] **Step 1: Create `src/context/CartContext.tsx`**

```tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CartItem, MenuItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (menuItem: MenuItem, notes?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((menuItem: MenuItem, notes = "") => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menu_item.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menu_item.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menu_item: menuItem, quantity: 1, notes }];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string) => {
    setItems((prev) => prev.filter((i) => i.menu_item.id !== menuItemId));
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.menu_item.id !== menuItemId));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.menu_item.id === menuItemId ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.menu_item.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
```

- [ ] **Step 2: Wrap root layout with CartProvider in `src/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reto Cafe",
  description: "Shawarma & more — order online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-bg text-text-primary min-h-screen`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/context/ src/app/layout.tsx
git commit -m "feat: add cart context and root layout"
```

---

## Task 6: Navbar + Footer

**Files:**
- Create: `src/components/layout/Navbar.tsx`
- Create: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Create `src/components/layout/Navbar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-accent tracking-tight">
          Reto Cafe
        </Link>

        <div className="hidden md:flex items-center gap-6 text-text-secondary text-sm">
          <Link href="/menu" className="hover:text-text-primary transition-colors">Menu</Link>
          <Link href="/about" className="hover:text-text-primary transition-colors">About</Link>
          <Link href="/contact" className="hover:text-text-primary transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative p-2 hover:text-accent transition-colors">
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-bg text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {count}
              </span>
            )}
          </Link>
          <Link href="/account" className="p-2 hover:text-accent transition-colors">
            <User size={20} />
          </Link>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-surface border-t border-border px-4 py-4 flex flex-col gap-4 text-text-secondary">
          <Link href="/menu" onClick={() => setMenuOpen(false)}>Menu</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/wallet" onClick={() => setMenuOpen(false)}>Wallet</Link>
        </div>
      )}
    </nav>
  );
}
```

- [ ] **Step 2: Create `src/components/layout/Footer.tsx`**

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-accent font-bold text-lg mb-2">Reto Cafe</p>
          <p className="text-text-muted text-sm">Authentic shawarma and more, crafted with care.</p>
        </div>
        <div>
          <p className="text-text-secondary font-semibold mb-3">Quick Links</p>
          <div className="flex flex-col gap-2 text-text-muted text-sm">
            <Link href="/menu" className="hover:text-text-primary transition-colors">Menu</Link>
            <Link href="/about" className="hover:text-text-primary transition-colors">About</Link>
            <Link href="/contact" className="hover:text-text-primary transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-text-secondary font-semibold mb-3">Account</p>
          <div className="flex flex-col gap-2 text-text-muted text-sm">
            <Link href="/auth/login" className="hover:text-text-primary transition-colors">Login</Link>
            <Link href="/auth/register" className="hover:text-text-primary transition-colors">Register</Link>
            <Link href="/wallet" className="hover:text-text-primary transition-colors">Wallet</Link>
            <Link href="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border text-center py-4 text-text-muted text-xs">
        © {new Date().getFullYear()} Reto Cafe. All rights reserved.
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Add Navbar + Footer to root layout**

Update `src/app/layout.tsx` body:
```tsx
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// inside body, replace {children} with:
<CartProvider>
  <Navbar />
  <main className="pt-16">{children}</main>
  <Footer />
</CartProvider>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add Navbar and Footer"
```

---

## Task 7: Menu Components + Homepage

**Files:**
- Create: `src/components/menu/CategoryTabs.tsx`
- Create: `src/components/menu/MenuItemCard.tsx`
- Create: `src/components/menu/MenuGrid.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/menu/page.tsx`

- [ ] **Step 1: Create `src/components/menu/CategoryTabs.tsx`**

```tsx
"use client";

import { MenuCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  categories: MenuCategory[];
  active: string;
  onChange: (slug: string) => void;
}

export default function CategoryTabs({ categories, active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
          active === "all"
            ? "bg-accent text-bg"
            : "bg-surface text-text-secondary border border-border hover:border-accent"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
            active === cat.slug
              ? "bg-accent text-bg"
              : "bg-surface text-text-secondary border border-border hover:border-accent"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/menu/MenuItemCard.tsx`**

```tsx
"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { MenuItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  item: MenuItem;
}

export default function MenuItemCard({ item }: Props) {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-accent/50 transition-all group"
    >
      <div className="relative h-48 bg-border overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-4xl">
            🌯
          </div>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 bg-bg/70 flex items-center justify-center">
            <span className="text-text-muted text-sm font-medium">Unavailable</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-text-primary">{item.name}</h3>
        {item.description && (
          <p className="text-text-muted text-sm mt-1 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-accent font-bold">{formatPrice(item.price)}</span>
          <button
            onClick={() => addItem(item)}
            disabled={!item.is_available}
            className="bg-accent hover:bg-accent-hover text-bg rounded-full p-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Create `src/components/menu/MenuGrid.tsx`**

```tsx
"use client";

import { useState } from "react";
import { MenuCategory, MenuItem } from "@/lib/types";
import CategoryTabs from "./CategoryTabs";
import MenuItemCard from "./MenuItemCard";

interface Props {
  categories: MenuCategory[];
  items: MenuItem[];
}

export default function MenuGrid({ categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? items
    : items.filter((i) => {
        const cat = categories.find((c) => c.id === i.category_id);
        return cat?.slug === activeCategory;
      });

  return (
    <div>
      <CategoryTabs
        categories={categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
        {filtered.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-text-muted text-center py-12">
            No items in this category.
          </p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/page.tsx` (Homepage)**

```tsx
import { createClient } from "@/lib/supabase/server";
import MenuGrid from "@/components/menu/MenuGrid";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").eq("is_active", true).order("display_order"),
    supabase.from("menu_items").select("*").eq("is_available", true).order("display_order"),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-bg/60 to-bg z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">
            Welcome to
          </p>
          <h1 className="text-6xl md:text-8xl font-bold text-text-primary leading-none mb-6">
            Reto Cafe
          </h1>
          <p className="text-text-secondary text-lg md:text-xl mb-10 max-w-xl mx-auto">
            Authentic shawarma crafted with care. Order in, dine in, feel at home.
          </p>
          <Link
            href="/menu"
            className="inline-block bg-accent hover:bg-accent-hover text-bg font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105"
          >
            Explore Menu
          </Link>
        </div>
      </section>

      {/* Menu Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-text-primary mb-2">Our Menu</h2>
        <p className="text-text-muted mb-8">Fresh, made-to-order, every time.</p>
        <MenuGrid categories={categories ?? []} items={items ?? []} />
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/app/menu/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import MenuGrid from "@/components/menu/MenuGrid";

export default async function MenuPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").eq("is_active", true).order("display_order"),
    supabase.from("menu_items").select("*").eq("is_available", true).order("display_order"),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-text-primary mb-2">Menu</h1>
      <p className="text-text-muted mb-8">Everything we have on offer.</p>
      <MenuGrid categories={categories ?? []} items={items ?? []} />
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/menu/ src/app/page.tsx src/app/menu/
git commit -m "feat: add menu components and homepage"
```

---

## Task 8: Cart + Checkout

**Files:**
- Create: `src/app/cart/page.tsx`
- Create: `src/app/checkout/page.tsx`

- [ ] **Step 1: Create `src/app/cart/page.tsx`**

```tsx
"use client";

import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-6xl mb-6">🛒</p>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Your cart is empty</h1>
        <p className="text-text-muted mb-8">Add something delicious from the menu.</p>
        <Link href="/menu" className="inline-block bg-accent hover:bg-accent-hover text-bg font-bold px-6 py-3 rounded-full transition-all">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Your Cart</h1>
      <div className="flex flex-col gap-4 mb-8">
        {items.map(({ menu_item, quantity }) => (
          <div key={menu_item.id} className="bg-surface rounded-2xl p-4 border border-border flex gap-4 items-center">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-border flex-shrink-0">
              {menu_item.image_url ? (
                <Image src={menu_item.image_url} alt={menu_item.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🌯</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-text-primary">{menu_item.name}</p>
              <p className="text-accent font-bold mt-1">{formatPrice(menu_item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(menu_item.id, quantity - 1)} className="p-1 rounded-full bg-border hover:bg-accent/20 transition-colors">
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-text-primary font-medium">{quantity}</span>
              <button onClick={() => updateQuantity(menu_item.id, quantity + 1)} className="p-1 rounded-full bg-border hover:bg-accent/20 transition-colors">
                <Plus size={14} />
              </button>
              <button onClick={() => removeItem(menu_item.id)} className="p-1 ml-2 text-red-400 hover:text-red-300 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-surface rounded-2xl p-6 border border-border">
        <div className="flex justify-between text-lg font-bold mb-6">
          <span className="text-text-secondary">Total</span>
          <span className="text-accent">{formatPrice(total)}</span>
        </div>
        <Link href="/checkout" className="block w-full bg-accent hover:bg-accent-hover text-bg font-bold py-4 rounded-full text-center transition-all">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/checkout/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "wallet">("cash");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function placeOrder() {
    if (items.length === 0) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        customer_id: user?.id ?? null,
        table_number: tableNumber || null,
        status: "pending",
        payment_method: paymentMethod,
        subtotal: total,
        wallet_deducted: paymentMethod === "wallet" ? total : 0,
        notes: notes || null,
      })
      .select()
      .single();

    if (error || !order) { setLoading(false); return; }

    await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        menu_item_id: i.menu_item.id,
        name: i.menu_item.name,
        unit_price: i.menu_item.price,
        quantity: i.quantity,
        notes: i.notes || null,
      }))
    );

    if (paymentMethod === "wallet" && user) {
      await supabase.rpc("deduct_wallet", { p_user_id: user.id, p_amount: total, p_reference_id: order.id });
    }

    clearCart();
    router.push(`/order/${order.id}`);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Checkout</h1>

      <div className="bg-surface rounded-2xl p-6 border border-border mb-6">
        <h2 className="font-semibold text-text-secondary mb-4">Order Summary</h2>
        {items.map(({ menu_item, quantity }) => (
          <div key={menu_item.id} className="flex justify-between text-sm mb-2">
            <span className="text-text-primary">{menu_item.name} × {quantity}</span>
            <span className="text-text-secondary">{formatPrice(menu_item.price * quantity)}</span>
          </div>
        ))}
        <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold">
          <span className="text-text-secondary">Total</span>
          <span className="text-accent">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6 border border-border mb-6 flex flex-col gap-4">
        <div>
          <label className="text-text-secondary text-sm block mb-2">Table Number (optional)</label>
          <input
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="e.g. Table 3"
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-text-secondary text-sm block mb-2">Payment Method</label>
          <div className="flex gap-3">
            {(["cash", "wallet"] as const).map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`flex-1 py-3 rounded-xl border font-medium capitalize transition-all ${
                  paymentMethod === method
                    ? "bg-accent text-bg border-accent"
                    : "bg-bg text-text-secondary border-border hover:border-accent"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-text-secondary text-sm block mb-2">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests..."
            rows={3}
            className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent resize-none"
          />
        </div>
      </div>

      <button
        onClick={placeOrder}
        disabled={loading || items.length === 0}
        className="w-full bg-accent hover:bg-accent-hover text-bg font-bold py-4 rounded-full transition-all disabled:opacity-50"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Add wallet deduct RPC to Supabase SQL Editor**

```sql
create or replace function public.deduct_wallet(
  p_user_id uuid,
  p_amount numeric,
  p_reference_id uuid
) returns void language plpgsql security definer as $$
begin
  update public.wallet_balances
  set balance = balance - p_amount
  where user_id = p_user_id and balance >= p_amount;

  if not found then
    raise exception 'Insufficient wallet balance';
  end if;

  insert into public.wallet_transactions (user_id, amount, type, description, reference_id)
  values (p_user_id, p_amount, 'deduct', 'Order payment', p_reference_id);
end;
$$;
```

- [ ] **Step 4: Commit**

```bash
git add src/app/cart/ src/app/checkout/
git commit -m "feat: add cart and checkout pages"
```

---

## Task 9: Order Tracking

**Files:**
- Create: `src/app/order/[id]/page.tsx`

- [ ] **Step 1: Create `src/app/order/[id]/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";

const STATUS_STEPS = ["pending", "preparing", "ready", "done"];

export default async function OrderPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", params.id)
    .single();

  if (!order) notFound();

  const stepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-2">Order Placed</h1>
      <p className="text-text-muted mb-8">Order ID: {order.id.slice(0, 8).toUpperCase()}</p>

      {/* Status bar */}
      <div className="flex items-center mb-10">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex-1 flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
              i <= stepIndex ? "bg-accent text-bg" : "bg-border text-text-muted"
            )}>
              {i + 1}
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={cn("flex-1 h-1 mx-1", i < stepIndex ? "bg-accent" : "bg-border")} />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-lg font-semibold mb-8">
        <span className={cn("px-3 py-1 rounded-full text-sm", ORDER_STATUS_COLORS[order.status])}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </p>

      <div className="bg-surface rounded-2xl p-6 border border-border mb-6">
        <h2 className="font-semibold text-text-secondary mb-4">Items</h2>
        {order.order_items?.map((item: any) => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span className="text-text-primary">{item.name} × {item.quantity}</span>
            <span className="text-text-secondary">{formatPrice(item.unit_price * item.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold">
          <span className="text-text-secondary">Total</span>
          <span className="text-accent">{formatPrice(order.subtotal)}</span>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6 border border-border text-sm text-text-muted">
        <div className="flex justify-between mb-2">
          <span>Payment</span>
          <span className="capitalize text-text-secondary">{order.payment_method}</span>
        </div>
        {order.table_number && (
          <div className="flex justify-between mb-2">
            <span>Table</span>
            <span className="text-text-secondary">{order.table_number}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Placed</span>
          <span className="text-text-secondary">{formatDate(order.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/order/
git commit -m "feat: add order tracking page"
```

---

## Task 10: Auth Pages

**Files:**
- Create: `src/app/auth/login/page.tsx`
- Create: `src/app/auth/register/page.tsx`

- [ ] **Step 1: Create `src/app/auth/login/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface rounded-2xl border border-border p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome back</h1>
        <p className="text-text-muted text-sm mb-8">Sign in to your Reto Cafe account.</p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" required
            className="bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" required
            className="bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="bg-accent hover:bg-accent-hover text-bg font-bold py-3 rounded-full transition-all disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="text-text-muted text-sm text-center mt-6">
          No account?{" "}
          <Link href="/auth/register" className="text-accent hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/auth/register/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, phone } },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-surface rounded-2xl border border-border p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Create account</h1>
        <p className="text-text-muted text-sm mb-8">Join Reto Cafe for easy ordering.</p>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name" required
            className="bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent" />
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" required
            className="bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)" required minLength={6}
            className="bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="bg-accent hover:bg-accent-hover text-bg font-bold py-3 rounded-full transition-all disabled:opacity-50">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="text-text-muted text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/auth/
git commit -m "feat: add login and register pages"
```

---

## Task 11: Account + Wallet Pages

**Files:**
- Create: `src/app/account/page.tsx`
- Create: `src/app/wallet/page.tsx`

- [ ] **Step 1: Create `src/app/account/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate, formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: orders }, { data: wallet }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("orders").select("*, order_items(*)").eq("customer_id", user.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("wallet_balances").select("balance").eq("user_id", user.id).single(),
  ]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">My Account</h1>

      <div className="bg-surface rounded-2xl p-6 border border-border mb-6 flex items-center justify-between">
        <div>
          <p className="text-text-primary font-semibold text-lg">{profile?.full_name}</p>
          <p className="text-text-muted text-sm">{user.email}</p>
        </div>
        <Link href="/wallet" className="bg-accent/10 border border-accent/30 text-accent px-4 py-2 rounded-xl text-sm font-medium hover:bg-accent/20 transition-all">
          Wallet: {formatPrice(wallet?.balance ?? 0)}
        </Link>
      </div>

      <h2 className="text-xl font-bold text-text-primary mb-4">Order History</h2>
      <div className="flex flex-col gap-4">
        {orders?.map((order) => (
          <Link key={order.id} href={`/order/${order.id}`}
            className="bg-surface rounded-2xl p-5 border border-border hover:border-accent/50 transition-all block">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-text-primary font-medium">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-text-muted text-sm">{formatDate(order.created_at)}</p>
              </div>
              <span className={cn("text-xs px-2 py-1 rounded-full", ORDER_STATUS_COLORS[order.status])}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
            <p className="text-accent font-bold">{formatPrice(order.subtotal)}</p>
          </Link>
        ))}
        {(!orders || orders.length === 0) && (
          <p className="text-text-muted text-center py-8">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/wallet/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WalletTransaction } from "@/lib/types";
import { formatDate, formatPrice } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [topupAmount, setTopupAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: wallet }, { data: txns }] = await Promise.all([
        supabase.from("wallet_balances").select("balance").eq("user_id", user.id).single(),
        supabase.from("wallet_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30),
      ]);
      setBalance(wallet?.balance ?? 0);
      setTransactions(txns ?? []);
    }
    load();
  }, []);

  async function handleTopup(e: React.FormEvent) {
    e.preventDefault();
    const amount = parseFloat(topupAmount);
    if (!amount || amount <= 0) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.rpc("topup_wallet", { p_user_id: user.id, p_amount: amount });
    setBalance((b) => b + amount);
    setTopupAmount("");
    setLoading(false);
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">My Wallet</h1>

      <div className="bg-surface rounded-2xl p-8 border border-border mb-8 text-center">
        <p className="text-text-muted text-sm mb-2">Available Balance</p>
        <p className="text-5xl font-bold text-accent">{formatPrice(balance)}</p>
      </div>

      <form onSubmit={handleTopup} className="bg-surface rounded-2xl p-6 border border-border mb-8">
        <h2 className="font-semibold text-text-secondary mb-4">Top Up</h2>
        <div className="flex gap-3">
          <input
            type="number" value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)}
            placeholder="Amount (RM)" min="1" step="0.01"
            className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
          />
          <button type="submit" disabled={loading}
            className="bg-accent hover:bg-accent-hover text-bg font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50">
            {loading ? "..." : "Top Up"}
          </button>
        </div>
      </form>

      <h2 className="text-xl font-bold text-text-primary mb-4">Transactions</h2>
      <div className="flex flex-col gap-3">
        {transactions.map((txn) => (
          <div key={txn.id} className="bg-surface rounded-xl p-4 border border-border flex items-center gap-4">
            <div className={`p-2 rounded-full ${txn.type === "topup" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {txn.type === "topup" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
            </div>
            <div className="flex-1">
              <p className="text-text-primary text-sm font-medium">{txn.description}</p>
              <p className="text-text-muted text-xs">{formatDate(txn.created_at)}</p>
            </div>
            <span className={`font-bold ${txn.type === "topup" ? "text-green-400" : "text-red-400"}`}>
              {txn.type === "topup" ? "+" : "-"}{formatPrice(txn.amount)}
            </span>
          </div>
        ))}
        {transactions.length === 0 && (
          <p className="text-text-muted text-center py-8">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add topup_wallet RPC to Supabase**

```sql
create or replace function public.topup_wallet(
  p_user_id uuid,
  p_amount numeric
) returns void language plpgsql security definer as $$
begin
  update public.wallet_balances set balance = balance + p_amount where user_id = p_user_id;
  insert into public.wallet_transactions (user_id, amount, type, description)
  values (p_user_id, p_amount, 'topup', 'Wallet top up');
end;
$$;
```

- [ ] **Step 4: Commit**

```bash
git add src/app/account/ src/app/wallet/
git commit -m "feat: add account and wallet pages"
```

---

## Task 12: Staff Order Entry

**Files:**
- Create: `src/app/staff/page.tsx`

- [ ] **Step 1: Create `src/app/staff/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MenuCategory, MenuItem } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import MenuItemCard from "@/components/menu/MenuItemCard";
import CategoryTabs from "@/components/menu/CategoryTabs";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function StaffPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [tableNumber, setTableNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const { items: cartItems, total, clearCart } = useCart();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const [{ data: cats }, { data: menuItems }] = await Promise.all([
        supabase.from("menu_categories").select("*").eq("is_active", true).order("display_order"),
        supabase.from("menu_items").select("*").eq("is_available", true).order("display_order"),
      ]);
      setCategories(cats ?? []);
      setItems(menuItems ?? []);
    }
    load();
  }, []);

  const filtered = activeCategory === "all"
    ? items
    : items.filter((i) => {
        const cat = categories.find((c) => c.id === i.category_id);
        return cat?.slug === activeCategory;
      });

  async function submitOrder() {
    if (cartItems.length === 0) return;
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const { data: order } = await supabase
      .from("orders")
      .insert({
        staff_id: user?.id,
        table_number: tableNumber || null,
        status: "pending",
        payment_method: "cash",
        subtotal: total,
      })
      .select()
      .single();

    if (!order) { setLoading(false); return; }

    await supabase.from("order_items").insert(
      cartItems.map((i) => ({
        order_id: order.id,
        menu_item_id: i.menu_item.id,
        name: i.menu_item.name,
        unit_price: i.menu_item.price,
        quantity: i.quantity,
      }))
    );

    clearCart();
    setTableNumber("");
    setLoading(false);
    alert(`Order #${order.id.slice(0, 8).toUpperCase()} sent to cashier!`);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Staff — Place Order</h1>
        <CategoryTabs categories={categories} active={activeCategory} onChange={setActiveCategory} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {filtered.map((item) => <MenuItemCard key={item.id} item={item} />)}
        </div>
      </div>

      <div className="w-80 flex-shrink-0">
        <div className="bg-surface rounded-2xl p-6 border border-border sticky top-20">
          <h2 className="font-semibold text-text-secondary mb-4">Current Order</h2>
          <input
            value={tableNumber} onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Table number"
            className="w-full bg-bg border border-border rounded-xl px-4 py-2 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent text-sm mb-4"
          />
          <div className="flex flex-col gap-2 mb-4 max-h-64 overflow-y-auto">
            {cartItems.map(({ menu_item, quantity }) => (
              <div key={menu_item.id} className="flex justify-between text-sm">
                <span className="text-text-primary">{menu_item.name} ×{quantity}</span>
                <span className="text-text-secondary">{formatPrice(menu_item.price * quantity)}</span>
              </div>
            ))}
            {cartItems.length === 0 && <p className="text-text-muted text-sm text-center py-4">No items yet</p>}
          </div>
          <div className="border-t border-border pt-4 mb-4 flex justify-between font-bold">
            <span className="text-text-secondary">Total</span>
            <span className="text-accent">{formatPrice(total)}</span>
          </div>
          <button
            onClick={submitOrder} disabled={loading || cartItems.length === 0}
            className="w-full bg-accent hover:bg-accent-hover text-bg font-bold py-3 rounded-xl transition-all disabled:opacity-50">
            {loading ? "Sending..." : "Send to Cashier"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/staff/
git commit -m "feat: add staff order entry page"
```

---

## Task 13: POS Real-Time Cashier Dashboard

**Files:**
- Create: `src/components/pos/OrderCard.tsx`
- Create: `src/components/pos/POSBoard.tsx`
- Create: `src/app/pos/page.tsx`

- [ ] **Step 1: Create `src/components/pos/OrderCard.tsx`**

```tsx
"use client";

import { Order, OrderItem, OrderStatus } from "@/lib/types";
import { formatPrice, formatDate, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  pending: "preparing",
  preparing: "ready",
  ready: "done",
  done: null,
};

interface Props {
  order: Order & { order_items: OrderItem[] };
}

export default function OrderCard({ order }: Props) {
  const supabase = createClient();

  async function advance() {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    await supabase.from("orders").update({ status: next }).eq("id", order.id);
  }

  const nextStatus = NEXT_STATUS[order.status];

  return (
    <div className={cn(
      "bg-surface rounded-2xl p-5 border transition-all",
      order.status === "pending" ? "border-yellow-500/50" :
      order.status === "preparing" ? "border-blue-500/50" :
      order.status === "ready" ? "border-green-500/50" : "border-border opacity-60"
    )}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-bold text-text-primary">#{order.id.slice(0, 8).toUpperCase()}</p>
          {order.table_number && <p className="text-text-muted text-sm">{order.table_number}</p>}
          <p className="text-text-muted text-xs">{formatDate(order.created_at)}</p>
        </div>
        <span className={cn("text-xs px-2 py-1 rounded-full font-medium", ORDER_STATUS_COLORS[order.status])}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-4">
        {order.order_items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-text-primary">{item.name} ×{item.quantity}</span>
            <span className="text-text-secondary">{formatPrice(item.unit_price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-border pt-3">
        <span className="text-accent font-bold">{formatPrice(order.subtotal)}</span>
        <span className="text-text-muted text-xs capitalize">{order.payment_method}</span>
      </div>

      {nextStatus && (
        <button
          onClick={advance}
          className="w-full mt-3 bg-accent hover:bg-accent-hover text-bg font-bold py-2 rounded-xl text-sm transition-all">
          Mark as {ORDER_STATUS_LABELS[nextStatus]}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/pos/POSBoard.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Order, OrderItem } from "@/lib/types";
import OrderCard from "./OrderCard";

type FullOrder = Order & { order_items: OrderItem[] };

export default function POSBoard() {
  const [orders, setOrders] = useState<FullOrder[]>([]);
  const supabase = createClient();

  async function fetchOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .in("status", ["pending", "preparing", "ready"])
      .order("created_at", { ascending: true });
    setOrders((data as FullOrder[]) ?? []);
  }

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("pos-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const pending = orders.filter((o) => o.status === "pending");
  const preparing = orders.filter((o) => o.status === "preparing");
  const ready = orders.filter((o) => o.status === "ready");

  return (
    <div className="grid grid-cols-3 gap-6 h-full">
      {[
        { label: "Pending", orders: pending, color: "text-yellow-400" },
        { label: "Preparing", orders: preparing, color: "text-blue-400" },
        { label: "Ready", orders: ready, color: "text-green-400" },
      ].map(({ label, orders: col, color }) => (
        <div key={label}>
          <h2 className={`font-bold text-lg mb-4 ${color}`}>
            {label} <span className="text-text-muted font-normal text-sm">({col.length})</span>
          </h2>
          <div className="flex flex-col gap-4">
            {col.map((order) => <OrderCard key={order.id} order={order} />)}
            {col.length === 0 && (
              <div className="bg-surface rounded-2xl border border-border p-6 text-text-muted text-sm text-center">
                No orders
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create `src/app/pos/page.tsx`**

```tsx
import POSBoard from "@/components/pos/POSBoard";

export default function POSPage() {
  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">POS Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-text-muted text-sm">Live</span>
          </div>
        </div>
        <POSBoard />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/pos/ src/app/pos/
git commit -m "feat: add real-time POS cashier dashboard"
```

---

## Task 14: Admin Dashboard

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/menu/page.tsx`
- Create: `src/app/admin/orders/page.tsx`
- Create: `src/app/admin/users/page.tsx`
- Create: `src/app/admin/wallet/page.tsx`
- Create: `src/components/admin/MenuItemForm.tsx`

- [ ] **Step 1: Create `src/app/admin/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default async function AdminPage() {
  const supabase = await createClient();
  const [{ count: orderCount }, { count: userCount }, { data: recentOrders }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("subtotal").eq("status", "done"),
  ]);

  const totalRevenue = recentOrders?.reduce((sum, o) => sum + o.subtotal, 0) ?? 0;

  const stats = [
    { label: "Total Orders", value: orderCount ?? 0 },
    { label: "Total Users", value: userCount ?? 0 },
    { label: "Revenue (Done Orders)", value: formatPrice(totalRevenue) },
  ];

  const links = [
    { href: "/admin/menu", label: "Menu Management" },
    { href: "/admin/orders", label: "All Orders" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/wallet", label: "Wallet Transactions" },
    { href: "/pos", label: "POS Dashboard" },
    { href: "/staff", label: "Staff Order Entry" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface rounded-2xl p-6 border border-border text-center">
            <p className="text-3xl font-bold text-accent">{s.value}</p>
            <p className="text-text-muted text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {links.map((l) => (
          <Link key={l.href} href={l.href}
            className="bg-surface rounded-2xl p-5 border border-border hover:border-accent/50 transition-all text-text-primary font-medium">
            {l.label} →
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/admin/MenuItemForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MenuCategory, MenuItem } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Props {
  categories: MenuCategory[];
  item?: MenuItem;
  onClose: () => void;
}

export default function MenuItemForm({ categories, item, onClose }: Props) {
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item?.price?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(item?.category_id ?? categories[0]?.id ?? "");
  const [imageUrl, setImageUrl] = useState(item?.image_url ?? "");
  const [isAvailable, setIsAvailable] = useState(item?.is_available ?? true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name, description: description || null,
      price: parseFloat(price),
      category_id: categoryId,
      image_url: imageUrl || null,
      is_available: isAvailable,
    };
    if (item) {
      await supabase.from("menu_items").update(payload).eq("id", item.id);
    } else {
      await supabase.from("menu_items").insert(payload);
    }
    setLoading(false);
    router.refresh();
    onClose();
  }

  const inputClass = "w-full bg-bg border border-border rounded-xl px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-accent";

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" required className={inputClass} />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={2} className={inputClass + " resize-none"} />
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (RM)" required min="0" step="0.01" className={inputClass} />
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputClass}>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Image URL (optional)" className={inputClass} />
      <label className="flex items-center gap-3 text-text-secondary text-sm cursor-pointer">
        <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="accent-amber-500" />
        Available for ordering
      </label>
      <div className="flex gap-3">
        <button type="button" onClick={onClose} className="flex-1 bg-border text-text-secondary py-3 rounded-xl font-medium hover:bg-border/80 transition-all">
          Cancel
        </button>
        <button type="submit" disabled={loading} className="flex-1 bg-accent hover:bg-accent-hover text-bg font-bold py-3 rounded-xl transition-all disabled:opacity-50">
          {loading ? "Saving..." : item ? "Update" : "Add Item"}
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Create `src/app/admin/menu/page.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MenuCategory, MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import MenuItemForm from "@/components/admin/MenuItemForm";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | undefined>();
  const supabase = createClient();

  async function load() {
    const [{ data: cats }, { data: menuItems }] = await Promise.all([
      supabase.from("menu_categories").select("*").order("display_order"),
      supabase.from("menu_items").select("*").order("display_order"),
    ]);
    setCategories(cats ?? []);
    setItems(menuItems ?? []);
  }

  useEffect(() => { load(); }, []);

  async function deleteItem(id: string) {
    if (!confirm("Delete this item?")) return;
    await supabase.from("menu_items").delete().eq("id", id);
    load();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Menu Management</h1>
        <button onClick={() => { setEditItem(undefined); setShowForm(true); }}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-bold px-5 py-2 rounded-full transition-all">
          <Plus size={16} /> Add Item
        </button>
      </div>

      {showForm && (
        <div className="bg-surface rounded-2xl border border-border p-6 mb-8">
          <h2 className="font-semibold text-text-secondary mb-4">{editItem ? "Edit Item" : "New Item"}</h2>
          <MenuItemForm categories={categories} item={editItem} onClose={() => { setShowForm(false); load(); }} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="bg-surface rounded-xl p-4 border border-border flex items-center gap-4">
            <div className="flex-1">
              <p className="text-text-primary font-medium">{item.name}</p>
              <p className="text-text-muted text-sm">{categories.find((c) => c.id === item.category_id)?.name}</p>
            </div>
            <span className="text-accent font-bold">{formatPrice(item.price)}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${item.is_available ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {item.is_available ? "Available" : "Hidden"}
            </span>
            <button onClick={() => { setEditItem(item); setShowForm(true); }} className="p-2 text-text-muted hover:text-accent transition-colors">
              <Pencil size={16} />
            </button>
            <button onClick={() => deleteItem(item.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/admin/orders/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">All Orders</h1>
      <div className="flex flex-col gap-3">
        {orders?.map((order) => (
          <Link key={order.id} href={`/order/${order.id}`}
            className="bg-surface rounded-xl p-4 border border-border hover:border-accent/50 transition-all flex items-center gap-4">
            <div className="flex-1">
              <p className="text-text-primary font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-text-muted text-sm">{formatDate(order.created_at)}</p>
            </div>
            {order.table_number && <span className="text-text-muted text-sm">{order.table_number}</span>}
            <span className="text-accent font-bold">{formatPrice(order.subtotal)}</span>
            <span className={cn("text-xs px-2 py-1 rounded-full", ORDER_STATUS_COLORS[order.status])}>
              {ORDER_STATUS_LABELS[order.status]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create `src/app/admin/users/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Users</h1>
      <div className="flex flex-col gap-3">
        {users?.map((user) => (
          <div key={user.id} className="bg-surface rounded-xl p-4 border border-border flex items-center gap-4">
            <div className="flex-1">
              <p className="text-text-primary font-medium">{user.full_name}</p>
              <p className="text-text-muted text-sm">{formatDate(user.created_at)}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-surface border border-border text-text-secondary capitalize">{user.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create `src/app/admin/wallet/page.tsx`**

```tsx
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default async function AdminWalletPage() {
  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from("wallet_transactions")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Wallet Transactions</h1>
      <div className="flex flex-col gap-3">
        {transactions?.map((txn: any) => (
          <div key={txn.id} className="bg-surface rounded-xl p-4 border border-border flex items-center gap-4">
            <div className={`p-2 rounded-full ${txn.type === "topup" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
              {txn.type === "topup" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
            </div>
            <div className="flex-1">
              <p className="text-text-primary text-sm font-medium">{txn.profiles?.full_name}</p>
              <p className="text-text-muted text-xs">{txn.description} · {formatDate(txn.created_at)}</p>
            </div>
            <span className={`font-bold ${txn.type === "topup" ? "text-green-400" : "text-red-400"}`}>
              {txn.type === "topup" ? "+" : "-"}{formatPrice(txn.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/ src/components/admin/
git commit -m "feat: add admin dashboard and management pages"
```

---

## Task 15: Static Pages

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/app/contact/page.tsx`
- Create: `src/app/privacy/page.tsx`
- Create: `src/app/terms/page.tsx`

- [ ] **Step 1: Create `src/app/about/page.tsx`**

```tsx
export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-text-primary mb-6">About Reto Cafe</h1>
      <p className="text-text-secondary text-lg leading-relaxed mb-4">
        Reto Cafe is your neighbourhood spot for authentic shawarma and cafe favourites, made fresh to order every time.
      </p>
      <p className="text-text-muted leading-relaxed">
        We believe good food should be honest, fresh, and satisfying. Every item on our menu is crafted with quality ingredients and care.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/contact/page.tsx`**

```tsx
export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-text-primary mb-6">Contact</h1>
      <div className="bg-surface rounded-2xl border border-border p-8 flex flex-col gap-4 text-text-secondary">
        <p>📍 <span className="ml-2">Shah Alam, Selangor, Malaysia</span></p>
        <p>📞 <span className="ml-2">Contact via retocafe.com</span></p>
        <p>🕐 <span className="ml-2">Open daily — check with us for hours</span></p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/app/privacy/page.tsx`**

```tsx
export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-text-primary mb-6">Privacy Policy</h1>
      <div className="text-text-muted leading-relaxed flex flex-col gap-4">
        <p>We collect your name, email, and phone number for account creation and order management.</p>
        <p>Your data is stored securely and never sold to third parties.</p>
        <p>Wallet transactions are recorded for your account history only.</p>
        <p>Contact us via the contact page for any data requests or deletion.</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/terms/page.tsx`**

```tsx
export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-text-primary mb-6">Terms of Service</h1>
      <div className="text-text-muted leading-relaxed flex flex-col gap-4">
        <p>By using Reto Cafe's ordering system, you agree to provide accurate information when registering and placing orders.</p>
        <p>Wallet top-ups are non-refundable unless agreed upon by management.</p>
        <p>Orders placed are subject to item availability. We will contact you if an item becomes unavailable.</p>
        <p>Reto Cafe reserves the right to modify these terms at any time.</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/app/about/ src/app/contact/ src/app/privacy/ src/app/terms/
git commit -m "feat: add static pages"
```

---

## Task 16: Vercel Deployment

**Files:**
- Modify: Vercel dashboard (no code changes)

- [ ] **Step 1: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/retocafe.git
git push -u origin main
```

- [ ] **Step 2: Deploy on Vercel**

1. Go to vercel.com → New Project → Import retocafe repo
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Deploy

- [ ] **Step 3: Connect Amran's domain**

In Vercel → Project → Settings → Domains → Add `retocafe.com`
Amran changes his DNS to point to Vercel. Old site is replaced.

- [ ] **Step 4: Seed initial menu data in Supabase**

Run in Supabase SQL Editor once Amran provides his menu:
```sql
-- Example (replace with real Reto Cafe menu)
insert into public.menu_categories (name, slug, display_order) values
  ('Shawarma', 'shawarma', 1),
  ('Rice Dishes', 'rice', 2),
  ('Drinks', 'drinks', 3),
  ('Sides', 'sides', 4);
```

- [ ] **Step 5: Create staff/cashier/admin accounts**

In Supabase SQL Editor, after Amran and staff register via the site:
```sql
update public.profiles set role = 'admin' where id = 'AMRAN_USER_ID';
update public.profiles set role = 'staff' where id = 'WAITER_USER_ID';
update public.profiles set role = 'cashier' where id = 'CASHIER_USER_ID';
```

---

## Self-Review: Spec Coverage Check

| Requirement | Covered |
|---|---|
| Customer-facing menu with categories | Task 7 |
| Add to Cart + cart management | Tasks 5, 8 |
| Checkout (cash + wallet payment) | Task 8 |
| Order confirmation + tracking | Task 9 |
| User login + register | Task 10 |
| Account page + order history | Task 11 |
| Wallet (balance, top up, transactions) | Task 11 |
| Waiter order entry (staff view) | Task 12 |
| Real-time cashier POS dashboard | Task 13 |
| Order status advancement | Task 13 |
| Admin overview + stats | Task 14 |
| Admin menu management (add/edit/delete) | Task 14 |
| Admin all orders | Task 14 |
| Admin user management | Task 14 |
| Admin wallet transactions | Task 14 |
| About, Contact, Privacy, Terms pages | Task 15 |
| Route protection by role | Task 4 |
| Supabase Realtime for POS | Task 13 |
| Vercel deployment + domain | Task 16 |
| Immersive UIUX (dark amber theme) | Tasks 1, 6, 7 |

All requirements covered. No placeholders.
