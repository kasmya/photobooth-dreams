export type LensId = "dreamy" | "sunset" | "retro" | "kpop";

export interface Lens {
  id: LensId;
  name: string;
  tag: string;
  desc: string;
  cssClass: string;
  // canvas-side recipe
  filter: string;
  // optional overlay color + alpha drawn after image
  overlay?: { color: string; alpha: number };
  // grain noise amount 0-1
  noise?: number;
  swatch: string;
}

export const LENSES: Lens[] = [
  {
    id: "dreamy",
    name: "Dreamy Lens",
    tag: "soft · cinematic · romantic",
    desc: "Pastel whites, cream-pink tint, bloom glow.",
    cssClass: "lens-dreamy",
    filter: "brightness(1.06) contrast(0.93) saturate(0.85) sepia(0.08) hue-rotate(-8deg)",
    overlay: { color: "#ffd4e0", alpha: 0.12 },
    swatch: "linear-gradient(135deg,#ffe4ec,#fff5e1)",
  },
  {
    id: "sunset",
    name: "Sunset Film Lens",
    tag: "warm · nostalgic · golden hour",
    desc: "Golden orange highlights, faded blacks, amber tones.",
    cssClass: "lens-sunset",
    filter: "sepia(0.45) saturate(1.35) brightness(1.05) hue-rotate(-18deg) contrast(0.96)",
    overlay: { color: "#ff9a3c", alpha: 0.18 },
    swatch: "linear-gradient(135deg,#ffb066,#ff5e8a)",
  },
  {
    id: "retro",
    name: "Retro Digicam Lens",
    tag: "viral · 2000s · CCD",
    desc: "Cool blue undertones, CCD noise, oversharpened edges.",
    cssClass: "lens-retro",
    filter: "contrast(1.18) saturate(1.15) hue-rotate(8deg) brightness(0.96)",
    overlay: { color: "#5b8cff", alpha: 0.08 },
    noise: 0.15,
    swatch: "linear-gradient(135deg,#7fb3ff,#1a1a2e)",
  },
  {
    id: "kpop",
    name: "K-Pop Idol Cam",
    tag: "polished · cute · glossy",
    desc: "Pastel saturation, bright highlights, smooth skin blur.",
    cssClass: "lens-kpop",
    filter: "brightness(1.18) contrast(0.92) saturate(1.25)",
    overlay: { color: "#ffd6f5", alpha: 0.1 },
    swatch: "linear-gradient(135deg,#ffd6f5,#c4f0ff)",
  },
];
