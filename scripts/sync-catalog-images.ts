/**
 * Copies catalog PNGs from a local `assets` folder into `public/images/catalog/` with stable names.
 *
 * Put your PNGs in one of:
 *   - `<project>/assets`
 *   - `<project>/catalog-assets`
 *   - `%USERPROFILE%\.cursor\projects\c-Users-Donald-Documents-Solange-s-Website\assets`
 *   - `%USERPROFILE%\Documents\Solange's Website\assets`
 *
 * Then: `npm run images:sync`
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { loadProjectEnv } from "./load-env";

loadProjectEnv();

const PROJECT = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const DEST = join(PROJECT, "public", "images", "catalog");

const RULES: { test: (name: string) => boolean; dest: string }[] = [
  { test: (n) => n.includes("Staub") && n.toLowerCase().includes("tomato"), dest: "auth-signup-hero.png" },
  { test: (n) => n.includes("Mini_Skillet") || (n.includes("Skillet") && n.includes("Set_of_4")), dest: "auth-login-hero.png" },
  { test: (n) => n.includes("Temu") && n.toLowerCase().includes("shop"), dest: "editorial-utensils-flatlay.png" },
  { test: (n) => n.includes("Tijdloos") || n.includes("Toscane"), dest: "editorial-tablescape-green.png" },
  { test: (n) => n.includes("Tramontina") && n.includes("Stackable"), dest: "editorial-cast-matte-spread.png" },
  { test: (n) => n.includes("Le_Creuset_Ocean") || n.includes("Ocean_Cookware"), dest: "editorial-ocean-collection.png" },
  { test: (n) => n.includes("Member") && n.includes("Fry_Pan"), dest: "editorial-triple-fry-pans.png" },
  { test: (n) => n.includes("11-Piece") && n.toLowerCase().includes("creuset"), dest: "hero-le-creuset-set.png" },
  { test: (n) => n.includes("10_Pcs") || (n.toLowerCase().includes("wooden") && n.toLowerCase().includes("utensil")),
    dest: "wooden-utensils-set.png" },
  { test: (n) => n.includes("Wok") || n.includes("Carbon_Steel"), dest: "wok-carbon-steel.png" },
  { test: (n) => n.includes("Aldi") || n.includes("sell-out_dupe"), dest: "lifestyle-enameled-spread.png" },
  { test: (n) => n.includes("all_kitchen_products"), dest: "editorial-all-kitchen.png" },
  { test: (n) => n.includes("All-Clad_D3") || n.includes("D3_Stainless"), dest: "stainless-allclad-d3.png" },
  { test: (n) => n.includes("All-Clad_D5") || n.includes("D5__Stainless"), dest: "stainless-allclad-d5.png" },
  { test: (n) => n.includes("Always_Pan"), dest: "ceramic-always-pan.png" },
  { test: (n) => n.includes("As_cores") || n.includes("contam_hist"), dest: "colorful-dutch-ovens.png" },
  { test: (n) => n.includes("Bakeware_-") || n.includes("Yellow"), dest: "bakeware-ombre-set.png" },
  { test: (n) => n.includes("Ashley") || n.includes("Baking_Pans"), dest: "bakeware-flatlay.png" },
  { test: (n) => n.includes("Stackable_Set_Cast_Iron") || n.includes("Black_with_Gold"), dest: "cast-iron-matte-gold.png" },
  { test: (n) => n.includes("Stock_Pot") || n.includes("8QT"), dest: "stockpot-steam.png" },
];

function assetRoots(): string[] {
  return [
    join(PROJECT, "assets"),
    join(PROJECT, "catalog-assets"),
    join(homedir(), ".cursor", "projects", "c-Users-Donald-Documents-Solange-s-Website", "assets"),
    join(homedir(), "Documents", "Solange's Website", "assets"),
  ];
}

function main() {
  mkdirSync(DEST, { recursive: true });
  const seen = new Set<string>();
  let copied = 0;

  for (const root of assetRoots()) {
    if (!existsSync(root)) continue;
    for (const f of readdirSync(root)) {
      if (!/\.(png|jpe?g|webp)$/i.test(f)) continue;
      const rule = RULES.find((r) => r.test(f));
      if (!rule || seen.has(rule.dest)) continue;
      const src = join(root, f);
      copyFileSync(src, join(DEST, rule.dest));
      seen.add(rule.dest);
      copied++;
      console.log("→", rule.dest, "←", basename(f));
    }
  }

  if (copied === 0) {
    console.log("No matching PNGs found. Add files to ./assets (in project) or Documents/Solange's Website/assets, then re-run.");
    process.exit(0);
  }
  console.log(`\nSynced ${copied} file(s) into public/images/catalog/`);
}

main();
