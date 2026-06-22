/**
 * Setup completo: admin root + bucket storage.
 * Uso: SUPABASE_SERVICE_ROLE_KEY=... node scripts/setup.mjs
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_PUBLIC_SUPABASE_URL ?? "https://hbdoyotahgpfjecdhwio.supabase.co";
const ANON_KEY = process.env.VITE_PUBLIC_SUPABASE_ANON_KEY ?? "sb_publishable_3xqLh41xrTbtc89sIU3fmQ_YJuy-TYU";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ADMIN_EMAIL = "admin7@nortegeo.com.br";
const ADMIN_PASSWORD = "admin7";

async function testLogin() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  return res.ok;
}

async function main() {
  console.log("NorteGeo Setup\n");

  if (!SERVICE_KEY) {
    console.log("Defina SUPABASE_SERVICE_ROLE_KEY para criar o admin automaticamente.");
    console.log("Ou execute: npx supabase functions deploy bootstrap-admin && chame a função.");
    process.exit(1);
  }

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log("→ Criando/atualizando admin root...");
  const { data: list } = await admin.auth.admin.listUsers();
  let user = list?.users?.find((u) => u.email === ADMIN_EMAIL);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { name: "Sócrates Souza", role: "provider" },
    });
    if (error) throw error;
    user = data.user;
    console.log("  Criado:", user.id);
  } else {
    await admin.auth.admin.updateUserById(user.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { name: "Sócrates Souza", role: "provider" },
    });
    console.log("  Atualizado:", user.id);
  }

  await admin.from("profiles").upsert({
    id: user.id,
    name: "Sócrates Souza",
    role: "provider",
    organization_id: null,
    phone: "+55 27 99749-9587",
  });

  console.log("→ Bucket project-files...");
  const { error: bucketErr } = await admin.storage.createBucket("project-files", { public: false });
  if (bucketErr && !bucketErr.message.includes("already exists")) {
    console.log("  Bucket:", bucketErr.message);
  } else {
    console.log("  OK");
  }

  const ok = await testLogin();
  if (ok) {
    console.log("\n✓ Pronto!");
    console.log(`  URL:    http://localhost:3000/painel/login`);
    console.log(`  E-mail: ${ADMIN_EMAIL}`);
    console.log(`  Senha:  ${ADMIN_PASSWORD}`);
  } else {
    console.log("\n✗ Login falhou após setup.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
