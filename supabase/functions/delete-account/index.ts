import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify the calling user
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Delete user data from public tables (cascade will handle profiles via auth deletion)
    await adminClient.from("usage_tracking").delete().eq("user_id", user.id);
    await adminClient.from("style_history").delete().eq("user_id", user.id);

    // Delete avatar files from storage
    const { data: avatarFiles } = await adminClient.storage
      .from("avatars")
      .list(user.id);
    if (avatarFiles && avatarFiles.length > 0) {
      await adminClient.storage
        .from("avatars")
        .remove(avatarFiles.map((f) => `${user.id}/${f.name}`));
    }

    // Delete style images from storage
    const { data: styleFiles } = await adminClient.storage
      .from("style-images")
      .list(user.id);
    if (styleFiles && styleFiles.length > 0) {
      await adminClient.storage
        .from("style-images")
        .remove(styleFiles.map((f) => `${user.id}/${f.name}`));
    }

    // Delete the auth user (this cascades to profiles table)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
    if (deleteError) {
      return new Response(JSON.stringify({ error: "Failed to delete account" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
