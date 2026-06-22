/**
 * Atualiza Site URL e Redirect URLs no Supabase Auth.
 * Requer: SUPABASE_ACCESS_TOKEN (supabase login) ou service role via CLI link.
 * Uso: node scripts/update-auth-urls.mjs
 */
const PROJECT_REF = "hbdoyotahgpfjecdhwio";
const SITE_URL = process.env.SITE_URL ?? "https://diegommazevedo.github.io/nortegeo/";
const REDIRECT_URLS = [
  `${SITE_URL}**`,
  "http://localhost:3000/**",
  "http://localhost:3001/**",
];

async function main() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) {
    console.log("Configure manualmente no Supabase Dashboard → Authentication → URL Configuration:");
    console.log(`  Site URL:     ${SITE_URL}`);
    console.log(`  Redirect URLs: ${REDIRECT_URLS.join("\n                 ")}`);
    return;
  }

  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      site_url: SITE_URL,
      uri_allow_list: REDIRECT_URLS.join(","),
    }),
  });

  if (res.ok) {
    console.log("✓ Auth URLs atualizadas");
  } else {
    console.log("✗", res.status, await res.text());
    console.log("\nConfigure manualmente no Dashboard (URLs acima).");
  }
}

main().catch(console.error);
