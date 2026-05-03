"use client";

import { createClient } from "@/lib/supabase/client";
import type { ButtonHTMLAttributes } from "react";

type LogoutButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function LogoutButton({ className = "", ...props }: LogoutButtonProps) {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.assign("/");
  }

  return (
    <button
      {...props}
      type="button"
      onClick={handleLogout}
      className={className}
    >
      Log out
    </button>
  );
}
