import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    const body = await req.json().catch(() => ({}));
    const email = body.email ?? "admin7@nortegeo.com.br";
    const password = body.password ?? "admin7";
    const name = body.name ?? "Sócrates Souza";

    // Find or create user
    const { data: list } = await supabase.auth.admin.listUsers();
    let user = list?.users?.find((u) => u.email === email);

    if (!user) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { name, role: "provider" },
      });
      if (error) throw error;
      user = data.user;
    } else {
      await supabase.auth.admin.updateUserById(user.id, {
        password,
        email_confirm: true,
        user_metadata: { name, role: "provider" },
      });
    }

    // Ensure root admin profile (provider, sem org)
    await supabase.from("profiles").upsert({
      id: user!.id,
      name,
      role: "provider",
      organization_id: null,
      phone: "+55 27 99749-9587",
    });

    return new Response(
      JSON.stringify({
        success: true,
        email,
        password,
        id: user!.id,
        message: "Admin root configurado. Faça login em /painel/login",
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});
