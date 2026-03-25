/**
 * Demo catalog + content for local/staging testing.
 *
 *   npm run images:sync   # copy PNGs → public/images/catalog (see script)
 *   npm run db:seed
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in `.env.local`.
 */
import { createClient } from "@supabase/supabase-js";
import type { CatalogMediaKey } from "../src/lib/catalog-local-images";
import { CATALOG_MEDIA } from "../src/lib/catalog-local-images";
import { loadProjectEnv } from "./load-env";

loadProjectEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

const SEED_FAQ_QUESTIONS = [
  "How fast is Accra delivery?",
  "Do you support Mobile Money?",
  "Can I use metal utensils?",
];

const SEED_TESTIMONIAL_QUOTES = [
  "Feels like the cookware I saved on Instagram — but it actually shows up in Accra.",
  "Cast skillet is ridiculously good for plantain. Shipping was quick.",
];

const SEED_REVIEW_AUTHORS = ["Seed · Kwame", "Seed · Akosua", "Seed · Pending check"];

async function run() {
  const zones = [
    { name: "Accra Central", slug: "accra-central", fee_ghs: 15, free_over_ghs: 500, sort_order: 0, active: true },
    { name: "Greater Accra (outer)", slug: "greater-accra-outer", fee_ghs: 25, free_over_ghs: 700, sort_order: 1, active: true },
  ];
  for (const z of zones) {
    const { error } = await db.from("delivery_zones").upsert(z, { onConflict: "slug" });
    if (error) throw error;
  }

  const categoryDefs: {
    name: string;
    slug: string;
    description: string;
    sort_order: number;
    is_future_collection?: boolean;
    cover: CatalogMediaKey;
  }[] = [
    {
      slug: "stainless-steel-cookware",
      name: "Stainless Steel Cookware",
      description: "Mirror polish & tri-ply performance for fond, simmers, and showpiece counters.",
      sort_order: 0,
      cover: "stainlessD5",
    },
    {
      slug: "cast-iron-cookware",
      name: "Cast Iron Cookware",
      description: "Deep sear weight — matte black, brass accents, and heirloom rituals.",
      sort_order: 1,
      cover: "castIronMatteGold",
    },
    {
      slug: "non-stick-cookware",
      name: "Non-Stick Cookware",
      description: "Soft-release mornings & terracotta silhouettes for the design-led kitchen.",
      sort_order: 2,
      cover: "alwaysPan",
    },
    {
      slug: "ceramic-coated-cookware",
      name: "Ceramic-Coated Cookware",
      description: "Gloss ombre glazes & calm heat for rice, braise, and everyday brightness.",
      sort_order: 3,
      cover: "bakewareOmbre",
    },
    {
      slug: "copper-cookware",
      name: "Copper Cookware",
      description: "Responsive luxury — colour-forward enamel stories for collectors.",
      sort_order: 4,
      cover: "colorfulDutch",
    },
    {
      slug: "wooden-kitchen-tools",
      name: "Wooden Kitchen Tools",
      description: "Warm teak tools — non-scratch friends for every coated pan.",
      sort_order: 5,
      cover: "woodenUtensils",
    },
    {
      slug: "bakeware-atelier",
      name: "Bakeware Atelier",
      description: "Rippled metal, ombre stoneware, and the quiet joy of a perfect rise.",
      sort_order: 6,
      cover: "bakewareFlatlay",
    },
    {
      slug: "woks-specialty",
      name: "Woks & High Heat",
      description: "Carbon steel breath & flame-forward energy for stir-fry nights.",
      sort_order: 7,
      cover: "wokFlames",
    },
    {
      slug: "signature-enamel",
      name: "Signature Enamel",
      description: "Crimson estates & French-inspired sets — the heart of the table.",
      sort_order: 8,
      cover: "heroCreuset",
    },
    {
      slug: "tableware",
      name: "Tableware",
      description: "Coming soon — tonal glazes & quiet luxury for the laid table.",
      sort_order: 99,
      is_future_collection: true,
      cover: "lifestyleEnameled",
    },
  ];

  for (const c of categoryDefs) {
    const { cover, ...rest } = c;
    const { error } = await db
      .from("categories")
      .upsert({ ...rest, image_url: CATALOG_MEDIA[cover] }, { onConflict: "slug" });
    if (error) throw error;
  }

  const { data: cats, error: catErr } = await db.from("categories").select("id, slug");
  if (catErr) throw catErr;
  const catId = (slug: string) => cats?.find((c) => c.slug === slug)?.id ?? null;

  type PRow = {
    name: string;
    slug: string;
    short_description: string;
    full_description: string;
    price: number;
    compare_at_price?: number;
    sku: string;
    stock: number;
    category_slug: string;
    material: string;
    dimensions: string;
    weight: string;
    featured: boolean;
    best_seller: boolean;
    care_instructions: string;
    shipping_info: string;
    tags: string[];
    rating: number;
    review_count: number;
    imageKey: CatalogMediaKey;
  };

  const productDefs: PRow[] = [
    {
      name: "Solange Tri-Ply Chef Pan 26cm",
      slug: "solange-tri-ply-chef-pan-26",
      short_description: "Even heating, elegant lip pour, made for weeknight sauces.",
      full_description: "Tri-ply stainless construction for responsive heat. Riveted handle, curated for Accra kitchens.",
      price: 429,
      compare_at_price: 489,
      sku: "CC-SS-026",
      stock: 24,
      category_slug: "stainless-steel-cookware",
      material: "stainless_steel",
      dimensions: "Ø26cm · H5.5cm",
      weight: "1.4kg",
      featured: true,
      best_seller: true,
      care_instructions: "Hand wash; bar keeper's friend for polish; dry promptly.",
      shipping_info: "Double boxed · Accra 24–48h.",
      tags: ["chef pan", "tri-ply"],
      rating: 4.8,
      review_count: 32,
      imageKey: "stainlessD5",
    },
    {
      name: "Maison Cast Skillet 28cm",
      slug: "maison-cast-skillet-28",
      short_description: "Deep golden sear, heirloom weight — preseasoned.",
      full_description: "Traditional cast iron skillet tuned for electric & gas burners common across Ghanaian homes.",
      price: 289,
      compare_at_price: 319,
      sku: "CC-CI-028",
      stock: 18,
      category_slug: "cast-iron-cookware",
      material: "cast_iron",
      dimensions: "Ø28cm",
      weight: "3.1kg",
      featured: true,
      best_seller: true,
      care_instructions: "Season lightly after washing; dry on residual heat; avoid soaking.",
      shipping_info: "Heavy parcel surcharge may apply outside central Accra.",
      tags: ["skillet", "sear"],
      rating: 4.9,
      review_count: 54,
      imageKey: "castIronMatteGold",
    },
    {
      name: "Morning Non-Stick Omelette Pan 20cm",
      slug: "morning-non-stick-omelette-20",
      short_description: "Soft-release ceramic interior — low fuss mornings.",
      full_description: "Ceramic-inspired nonstick for gentle heat & easy flipping.",
      price: 199,
      sku: "CC-NS-020",
      stock: 40,
      category_slug: "non-stick-cookware",
      material: "non_stick",
      dimensions: "Ø20cm",
      weight: "0.8kg",
      featured: false,
      best_seller: true,
      care_instructions: "Use medium heat; silicone tools only; no dishwasher.",
      shipping_info: "Standard Accra delivery.",
      tags: ["breakfast"],
      rating: 4.7,
      review_count: 21,
      imageKey: "alwaysPan",
    },
    {
      name: "Lagoon Ceramic Saucepan 18cm",
      slug: "lagoon-ceramic-saucepan-18",
      short_description: "Quiet eggs, glossy enamel-style interior.",
      full_description: "Single-handle saucepan for rice, sauces, and small batches.",
      price: 249,
      compare_at_price: 279,
      sku: "CC-CR-018",
      stock: 15,
      category_slug: "ceramic-coated-cookware",
      material: "ceramic",
      dimensions: "Ø18cm",
      weight: "1.1kg",
      featured: true,
      best_seller: false,
      care_instructions: "Low–medium heat; wood or silicone utensils.",
      shipping_info: "Standard Accra delivery.",
      tags: ["saucepan"],
      rating: 4.6,
      review_count: 12,
      imageKey: "bakewareOmbre",
    },
    {
      name: "Accra Copper Sauté 24cm (lined)",
      slug: "accra-copper-saute-24",
      short_description: "Responsive colour-forward enamel presence.",
      full_description: "For cooks who love statement colour and steady heat — artisan lined interior.",
      price: 599,
      sku: "CC-CU-024",
      stock: 6,
      category_slug: "copper-cookware",
      material: "copper",
      dimensions: "Ø24cm",
      weight: "2.0kg",
      featured: false,
      best_seller: false,
      care_instructions: "Polish exterior occasionally; hand wash.",
      shipping_info: "Insured parcel.",
      tags: ["copper", "sauté"],
      rating: 4.9,
      review_count: 8,
      imageKey: "colorfulDutch",
    },
    {
      name: "Maison Teak Tool Set · 10 Piece",
      slug: "maison-teak-tool-set-10",
      short_description: "Warm wood tools for non-stick, ceramic, and everyday stirring.",
      full_description: "Hand-finished teak essentials — slotted, solid, and turners — bundled for a serene countertop vignette.",
      price: 149,
      sku: "CC-WD-010",
      stock: 55,
      category_slug: "wooden-kitchen-tools",
      material: "wood",
      dimensions: "Mixed lengths",
      weight: "0.6kg",
      featured: true,
      best_seller: true,
      care_instructions: "Hand wash; oil occasionally; keep dry.",
      shipping_info: "Standard Accra delivery.",
      tags: ["utensils", "teak"],
      rating: 4.8,
      review_count: 40,
      imageKey: "woodenUtensils",
    },
    {
      name: "Ember Carbon Steel Wok 12\"",
      slug: "ember-carbon-wok-12",
      short_description: "Fast, even heat — built for flame and weeknight stir-fry.",
      full_description: "Deep-sloped carbon steel wok with riveted handle — seasons like cast iron, moves like a pro kitchen.",
      price: 259,
      compare_at_price: 299,
      sku: "CC-WK-012",
      stock: 22,
      category_slug: "woks-specialty",
      material: "carbon_steel",
      dimensions: "Ø30cm",
      weight: "1.2kg",
      featured: true,
      best_seller: true,
      care_instructions: "Season before first use; dry on heat; never soak overnight.",
      shipping_info: "Standard Accra delivery.",
      tags: ["wok", "stir fry"],
      rating: 4.9,
      review_count: 61,
      imageKey: "wokFlames",
    },
    {
      name: "Heritage Enamel 11-Piece Crimson Estate Set",
      slug: "heritage-enamel-11pc-crimson",
      short_description: "The sculptural crimson collection — dutch ovens, braiser, skillet, bakeware.",
      full_description:
        "A hero-worthy ensemble for hosts who want colour, weight, and enduring enamel on display. Includes cocotte, braiser, saucepan, roaster, skillet, and griddle story moments.",
      price: 4299,
      compare_at_price: 4899,
      sku: "CC-EN-711",
      stock: 4,
      category_slug: "signature-enamel",
      material: "enameled_cast_iron",
      dimensions: "Mixed collection",
      weight: "34kg boxed",
      featured: true,
      best_seller: false,
      care_instructions: "Low–medium heat defaults; wooden tools on interior light enamel.",
      shipping_info: "White-glove Accra delivery — schedule by WhatsApp.",
      tags: ["ensemble", "enameled"],
      rating: 5,
      review_count: 18,
      imageKey: "heroCreuset",
    },
    {
      name: "Atelier Tri-Ply 7-Piece · Mirror Polished",
      slug: "atelier-triply-7pc-mirror",
      short_description: "Professional-grade clad steel — stockpot to fry pan.",
      full_description: "Riveted handles, mirror exterior, brushed interior — induction ready, oven safe handles.",
      price: 2899,
      sku: "CC-SS-D3-7",
      stock: 7,
      category_slug: "stainless-steel-cookware",
      material: "stainless_steel",
      dimensions: "7-piece stack",
      weight: "12kg",
      featured: true,
      best_seller: false,
      care_instructions: "Bar keeper for polish; avoid steel wool on brushed interior.",
      shipping_info: "Insured courier.",
      tags: ["set", "tri-ply"],
      rating: 4.9,
      review_count: 27,
      imageKey: "stainlessD3",
    },
    {
      name: "Maison D5 Brushed 7-Piece Suite",
      slug: "maison-d5-brushed-7pc",
      short_description: "Five-ply warmth with architectural lines — for precise reductions.",
      full_description: "Heavier core, steadier simmer — crafted for cooks who live in sauces and stocks.",
      price: 3299,
      sku: "CC-SS-D5-7",
      stock: 5,
      category_slug: "stainless-steel-cookware",
      material: "stainless_steel",
      dimensions: "7-piece stack",
      weight: "13kg",
      featured: false,
      best_seller: true,
      care_instructions: "Same as tri-ply — hand dry for spotless mirrors.",
      shipping_info: "Insured courier.",
      tags: ["set", "five-ply"],
      rating: 5,
      review_count: 19,
      imageKey: "stainlessD5",
    },
    {
      name: "Solange Steam Stockpot 8QT",
      slug: "solange-steam-stockpot-8qt",
      short_description: "Deep steam column — pasta boils, pepper soups, crab feasts.",
      full_description: "Generous mirror pot with lid — for the home cook who batch-preps with theatre.",
      price: 679,
      compare_at_price: 749,
      sku: "CC-SS-8QT",
      stock: 12,
      category_slug: "stainless-steel-cookware",
      material: "stainless_steel",
      dimensions: "8QT / 7.6L",
      weight: "2.8kg",
      featured: true,
      best_seller: false,
      care_instructions: "Deglaze while warm; keep salts off mirror when boiling.",
      shipping_info: "Standard Accra delivery.",
      tags: ["stockpot", "steam"],
      rating: 4.8,
      review_count: 33,
      imageKey: "stockpotSteam",
    },
    {
      name: "Cloudline Ombre Baker Quartet",
      slug: "cloudline-ombre-baker-quartet",
      short_description: "Fluted pie, loaf, square, oval — cream interior drama.",
      full_description: "Gradient charcoal exteriors with glossy cream interiors — freezer-to-oven friendly stoneware.",
      price: 389,
      sku: "CC-BK-004",
      stock: 20,
      category_slug: "bakeware-atelier",
      material: "stoneware",
      dimensions: "4-piece nested",
      weight: "5.4kg",
      featured: false,
      best_seller: true,
      care_instructions: "Avoid thermal shock; cool before refrigerating.",
      shipping_info: "Fragile pack.",
      tags: ["bakeware", "ombre"],
      rating: 4.7,
      review_count: 15,
      imageKey: "bakewareFlatlay",
    },
    {
      name: "Maison Flame Grill Plate Noir",
      slug: "maison-flame-grill-plate-noir",
      short_description: "Matte grill channels — chicken, veg, small chops.",
      full_description: "Ceramic grill plate with defined ridges — oven-to-table drama with minimal oil.",
      price: 219,
      sku: "CC-GR-001",
      stock: 28,
      category_slug: "ceramic-coated-cookware",
      material: "ceramic",
      dimensions: "Ø26cm",
      weight: "1.6kg",
      featured: false,
      best_seller: false,
      care_instructions: "Medium heat max; use wood tools.",
      shipping_info: "Standard Accra delivery.",
      tags: ["grill", "oven"],
      rating: 4.5,
      review_count: 9,
      imageKey: "lifestyleEnameled",
    },
  ];

  for (const def of productDefs) {
    const { imageKey, category_slug, ...p } = def;
    const row = { ...p, category_id: catId(category_slug) };
    const { data: ins, error } = await db.from("products").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) throw error;
    if (ins?.id) {
      await db.from("product_images").delete().eq("product_id", ins.id);
      await db.from("product_images").insert({
        product_id: ins.id,
        url: CATALOG_MEDIA[imageKey],
        alt: p.name,
        sort_order: 0,
      });
    }
  }

  await db.from("coupons").upsert(
    {
      code: "WELCOME10",
      description: "Demo: 10% off your order",
      percent_off: 10,
      active: true,
    },
    { onConflict: "code" }
  );

  await db.from("faqs").delete().in("question", SEED_FAQ_QUESTIONS);
  const faqs = [
    {
      category: "Orders",
      question: "How fast is Accra delivery?",
      answer: "Typically 24–48 hours after dispatch confirmation.",
      sort_order: 0,
    },
    {
      category: "Payments",
      question: "Do you support Mobile Money?",
      answer: "Architecture is live with mock mode; connect MTN/Telecel/AirtelTigo providers when ready.",
      sort_order: 0,
    },
    {
      category: "Cookware care",
      question: "Can I use metal utensils?",
      answer: "Only on stainless & cast iron; use silicone on non-stick & ceramic interiors.",
      sort_order: 0,
    },
  ];
  const { error: faqIns } = await db.from("faqs").insert(faqs);
  if (faqIns) throw faqIns;

  await db.from("testimonials").delete().in("quote", SEED_TESTIMONIAL_QUOTES);
  const testimonials = [
    {
      quote: SEED_TESTIMONIAL_QUOTES[0],
      author: "K. Osei",
      subtitle: "Home cook",
      featured: true,
      sort_order: 0,
    },
    {
      quote: SEED_TESTIMONIAL_QUOTES[1],
      author: "Ama",
      subtitle: "Airbnb host",
      featured: true,
      sort_order: 1,
    },
  ];
  const { error: tesIns } = await db.from("testimonials").insert(testimonials);
  if (tesIns) throw tesIns;

  const { data: pidRows } = await db
    .from("products")
    .select("id, slug")
    .in("slug", ["solange-tri-ply-chef-pan-26", "maison-cast-skillet-28"]);

  await db.from("reviews").delete().in("author_name", SEED_REVIEW_AUTHORS);
  const demoReviews: {
    product_id: string;
    author_name: string;
    rating: number;
    title: string;
    body: string;
    approved: boolean;
  }[] = [];

  const tri = pidRows?.find((r) => r.slug === "solange-tri-ply-chef-pan-26");
  const cast = pidRows?.find((r) => r.slug === "maison-cast-skillet-28");
  if (tri) {
    demoReviews.push({
      product_id: tri.id,
      author_name: SEED_REVIEW_AUTHORS[0],
      rating: 5,
      title: "Worth it",
      body: "Even heating and cleans up nicely. Demo seed review.",
      approved: true,
    });
  }
  if (cast) {
    demoReviews.push({
      product_id: cast.id,
      author_name: SEED_REVIEW_AUTHORS[1],
      rating: 5,
      title: "Sear is unreal",
      body: "Plantains and steak both came out great. Demo seed review.",
      approved: true,
    });
  }
  if (tri) {
    demoReviews.push({
      product_id: tri.id,
      author_name: SEED_REVIEW_AUTHORS[2],
      rating: 4,
      title: "Waiting for approval",
      body: "Posting this to test admin moderation. Demo seed review.",
      approved: false,
    });
  }

  if (demoReviews.length > 0) {
    const { error: revErr } = await db.from("reviews").insert(demoReviews);
    if (revErr) throw revErr;
  }

  const { error: heroErr } = await db.from("homepage_sections").upsert(
    {
      section_key: "hero",
      title: "Hero",
      body: {
        headline: "The art of the everyday table",
        subheadline:
          "Statement cookware and tools — curated for Accra, styled like a gallery — from enamel colour to mirror stainless.",
        imageUrl: CATALOG_MEDIA.heroCreuset,
      },
      sort_order: 0,
      active: true,
    },
    { onConflict: "section_key" }
  );
  if (heroErr) throw heroErr;

  console.log("");
  console.log("Demo seed complete.");
  console.log("  • 10 categories (incl. wooden tools, bakeware, woks, signature enamel) · Tableware coming soon");
  console.log("  • 13 products with /images/catalog/ art — run: npm run images:sync");
  console.log("  • Hero + collections use your crimson enamel still life");
  console.log("  • Coupon WELCOME10 · FAQs / testimonials / reviews as before");
  console.log("");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});