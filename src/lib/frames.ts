import checker from "@/assets/frames/checker.png";
import film from "@/assets/frames/film.png";
import awesome from "@/assets/frames/awesome.png";
import polaroid from "@/assets/frames/polaroid.png";
import leopard from "@/assets/frames/leopard.png";

// Slots are normalized (0..1) rectangles where photos are placed BEHIND the frame PNG.
export interface FrameTemplate {
  id: string;
  name: string;
  vibe: string;
  src: string;
  width: number;
  height: number;
  // background color shown if photo doesn't fully cover slot (matches frame aesthetic)
  bg: string;
  slots: { x: number; y: number; w: number; h: number }[];
}

export const FRAMES: FrameTemplate[] = [
  {
    id: "checker",
    name: "Checker Y2K",
    vibe: "warped checker · teddy · sparkle",
    src: checker,
    width: 720,
    height: 1280,
    bg: "#000000",
    slots: [
      { x: 0.14, y: 0.055, w: 0.71, h: 0.235 },
      { x: 0.14, y: 0.32,  w: 0.71, h: 0.235 },
      { x: 0.14, y: 0.585, w: 0.71, h: 0.235 },
    ],
  },
  {
    id: "film",
    name: "Film Strip",
    vibe: "classic 35mm · 4 frames",
    src: film,
    width: 658,
    height: 1200,
    bg: "#000000",
    slots: [
      { x: 0.175, y: 0.055, w: 0.65, h: 0.205 },
      { x: 0.175, y: 0.275, w: 0.65, h: 0.205 },
      { x: 0.175, y: 0.495, w: 0.65, h: 0.205 },
      { x: 0.175, y: 0.715, w: 0.65, h: 0.205 },
    ],
  },
  {
    id: "awesome",
    name: "Awesome Sketchbook",
    vibe: "grid paper · doodles · pink",
    src: awesome,
    width: 610,
    height: 1280,
    bg: "#ffffff",
    slots: [
      { x: 0.13, y: 0.06, w: 0.66, h: 0.18 },
      { x: 0.13, y: 0.265, w: 0.66, h: 0.18 },
      { x: 0.13, y: 0.475, w: 0.66, h: 0.18 },
      { x: 0.13, y: 0.685, w: 0.66, h: 0.18 },
    ],
  },
  {
    id: "polaroid",
    name: "Polaroid Plaid",
    vibe: "camera · phone cord · sunflower",
    src: polaroid,
    width: 675,
    height: 1200,
    bg: "#ffffff",
    slots: [
      { x: 0.295, y: 0.305, w: 0.43, h: 0.135 },
      { x: 0.295, y: 0.45,  w: 0.43, h: 0.135 },
      { x: 0.295, y: 0.595, w: 0.43, h: 0.135 },
      { x: 0.295, y: 0.74,  w: 0.43, h: 0.135 },
    ],
  },
  {
    id: "leopard",
    name: "Mint Leopard",
    vibe: "boo!! · crown · sparkle star",
    src: leopard,
    width: 720,
    height: 1280,
    bg: "#ffffff",
    slots: [
      { x: 0.14, y: 0.085, w: 0.62, h: 0.255 },
      { x: 0.14, y: 0.36,  w: 0.62, h: 0.255 },
      { x: 0.14, y: 0.635, w: 0.62, h: 0.255 },
    ],
  },
];
