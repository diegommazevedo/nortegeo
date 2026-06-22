/**
 * Gera index.html estático em cada rota SPA (GitHub Pages não faz rewrite).
 * Uso: node scripts/spa-fallback.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const indexHtml = readFileSync(join(OUT, "index.html"), "utf8");

const routes = [
  "painel",
  "painel/setup",
  "painel/login",
  "painel/register",
  "painel/provider",
  "painel/provider/precificacao",
  "painel/provider/parametros",
  "painel/provider/clientes",
  "painel/client",
  "painel/admin",
];

for (const route of routes) {
  const dir = join(OUT, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), indexHtml);
  console.log(`  ✓ ${route}/index.html`);
}

writeFileSync(join(OUT, "404.html"), indexHtml);
console.log("  ✓ 404.html");
console.log(`SPA fallback: ${routes.length} rotas`);
