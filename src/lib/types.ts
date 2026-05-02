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
