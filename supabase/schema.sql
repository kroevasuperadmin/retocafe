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

-- Auto-create profile + wallet on signup
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

-- Wallet RPCs
create or replace function public.topup_wallet(p_user_id uuid, p_amount numeric)
returns void language plpgsql security definer as $$
begin
  update public.wallet_balances set balance = balance + p_amount where user_id = p_user_id;
  insert into public.wallet_transactions (user_id, amount, type, description)
  values (p_user_id, p_amount, 'topup', 'Wallet top up');
end;
$$;

create or replace function public.deduct_wallet(p_user_id uuid, p_amount numeric, p_reference_id uuid)
returns void language plpgsql security definer as $$
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

-- RLS
alter table public.profiles enable row level security;
alter table public.wallet_balances enable row level security;
alter table public.wallet_transactions enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Profiles policies
create policy "users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "staff read all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','cashier','admin'))
);
create policy "users update own profile" on public.profiles for update using (auth.uid() = id);

-- Wallet policies
create policy "users read own wallet" on public.wallet_balances for select using (auth.uid() = user_id);
create policy "users read own transactions" on public.wallet_transactions for select using (auth.uid() = user_id);
create policy "admin reads all transactions" on public.wallet_transactions for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Menu policies
create policy "anyone reads active categories" on public.menu_categories for select using (is_active = true);
create policy "admin reads all categories" on public.menu_categories for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "admin manages categories" on public.menu_categories for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "anyone reads available items" on public.menu_items for select using (is_available = true);
create policy "admin reads all items" on public.menu_items for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);
create policy "admin manages items" on public.menu_items for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Order policies
create policy "customer reads own orders" on public.orders for select using (auth.uid() = customer_id);
create policy "customer inserts own order" on public.orders for insert with check (auth.uid() = customer_id or customer_id is null);
create policy "staff manages orders" on public.orders for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','cashier','admin'))
);
create policy "customer reads own order items" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id = order_id and o.customer_id = auth.uid())
);
create policy "staff reads all order items" on public.order_items for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('staff','cashier','admin'))
);
create policy "anyone inserts order items" on public.order_items for insert with check (true);

-- Realtime
alter publication supabase_realtime add table public.orders;
