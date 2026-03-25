export const BRAND = {
  name: "Chef’s Choice",
  byline: "by Maison Solange",
  fullName: "Chef’s Choice by Maison Solange",
  tagline: "Elevating the Joy of Cooking",
  email: "hello@maisonsolange.gh",
  phoneDisplay: "+233 XX XXX XXXX",
  whatsappE164: "233000000000",
  city: "Accra",
  country: "Ghana",
  social: {
    instagram: "https://www.instagram.com/",
  },
} as const;

export const MATERIAL_OPTIONS: { value: string; label: string }[] = [
  { value: "stainless_steel", label: "Stainless Steel" },
  { value: "cast_iron", label: "Cast Iron" },
  { value: "non_stick", label: "Non-Stick" },
  { value: "ceramic", label: "Ceramic-Coated" },
  { value: "aluminum", label: "Aluminum" },
  { value: "hard_anodized", label: "Hard-Anodized" },
  { value: "copper", label: "Copper" },
  { value: "carbon_steel", label: "Carbon Steel" },
  { value: "glass", label: "Glass" },
  { value: "enameled_cast_iron", label: "Enameled Cast Iron" },
];
