import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const roleBadge: Record<string, { bg: string; text: string }> = {
    admin: { bg: "rgba(245,158,11,0.2)", text: "#f59e0b" },
    member: { bg: "#3d2a0e", text: "#8a6a3a" },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8" style={{ color: "#fef3c7" }}>Users</h1>
      <div className="flex flex-col gap-3">
        {users?.map((user) => {
          const displayRole = user.role === "customer" ? "Member" : "Admin";
          const badge = user.role === "customer" ? roleBadge.member : roleBadge.admin;
          return (
            <div key={user.id} className="rounded-xl p-4 border flex items-center gap-4" style={{ backgroundColor: "#241608", borderColor: "#3d2a0e" }}>
              <div className="flex-1">
                <p className="font-medium" style={{ color: "#fef3c7" }}>{user.full_name}</p>
                <p className="text-sm" style={{ color: "#8a6a3a" }}>{formatDate(user.created_at)}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: badge.bg, color: badge.text }}>
                {displayRole}
              </span>
            </div>
          );
        })}
        {(!users || users.length === 0) && (
          <p className="text-center py-8" style={{ color: "#8a6a3a" }}>No users yet.</p>
        )}
      </div>
    </div>
  );
}
