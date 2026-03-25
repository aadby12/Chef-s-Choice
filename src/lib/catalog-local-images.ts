/**
 * Local marketing / catalog art served from `public/images/catalog/`.
 * Run `npm run images:sync` after dropping PNGs into `assets/` (see script).
 */
export const CATALOG_MEDIA = {
  /** Hero & curated sets — Le Creuset–style enameled collection */
  heroCreuset: "/images/catalog/hero-le-creuset-set.png",
  /** Wooden utensil bundle */
  woodenUtensils: "/images/catalog/wooden-utensils-set.png",
  /** Wok over flames — energy / stir-fry */
  wokFlames: "/images/catalog/wok-carbon-steel.png",
  /** Marble countertop lifestyle spread */
  lifestyleEnameled: "/images/catalog/lifestyle-enameled-spread.png",
  /** Wide kitchen editorial */
  editorialKitchen: "/images/catalog/editorial-all-kitchen.png",
  stainlessD3: "/images/catalog/stainless-allclad-d3.png",
  stainlessD5: "/images/catalog/stainless-allclad-d5.png",
  alwaysPan: "/images/catalog/ceramic-always-pan.png",
  colorfulDutch: "/images/catalog/colorful-dutch-ovens.png",
  bakewareOmbre: "/images/catalog/bakeware-ombre-set.png",
  bakewareFlatlay: "/images/catalog/bakeware-flatlay.png",
  castIronMatteGold: "/images/catalog/cast-iron-matte-gold.png",
  stockpotSteam: "/images/catalog/stockpot-steam.png",
} as const;

export type CatalogMediaKey = keyof typeof CATALOG_MEDIA;

export const INSTAGRAM_GRID: readonly string[] = [
  CATALOG_MEDIA.colorfulDutch,
  CATALOG_MEDIA.wokFlames,
  CATALOG_MEDIA.woodenUtensils,
  CATALOG_MEDIA.bakewareFlatlay,
];
