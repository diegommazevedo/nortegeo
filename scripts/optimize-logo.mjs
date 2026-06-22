#!/usr/bin/env node
/** Redimensiona logo.png para uso web (favicon + navbar). */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const logoPath = join(__dir, "../public/assets/logo.png");

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.log("sharp não instalado — pulando otimização de logo");
    return;
  }

  const input = readFileSync(logoPath);
  const optimized = await sharp(input)
    .resize(480, null, { withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer();

  writeFileSync(logoPath, optimized);
  writeFileSync(join(__dir, "../public/favicon.png"), await sharp(input).resize(64, 64).png().toBuffer());
  console.log(`logo.png → ${Math.round(optimized.length / 1024)} KB`);
}

main().catch(console.error);
