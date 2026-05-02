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
