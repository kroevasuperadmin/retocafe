import { createClient } from "@supabase/supabase-js";

export async function promoteAdminIfRequested(userId: string) {
  const adminKey = process.env.ADMIN_SIGNUP_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!adminKey || !serviceRoleKey || !supabaseUrl) {
    return false;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !data.user) {
    return false;
  }

  const metadata = data.user.user_metadata ?? {};
  if (metadata.admin_signup_key !== adminKey) {
    return false;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", userId);

  if (profileError) {
    throw profileError;
  }

  const nextMetadata = { ...metadata };
  delete nextMetadata.admin_signup_key;
  await supabase.auth.admin.updateUserById(userId, { user_metadata: nextMetadata });

  return true;
}
