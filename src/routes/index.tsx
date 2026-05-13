import { createFileRoute } from "@tanstack/react-router";
import Photobooth from "@/components/Photobooth";

export const Route = createFileRoute("/")({
  component: Photobooth,
  head: () => ({
    meta: [
      { title: "snapcore.booth — Y2K Photobooth Strips" },
      { name: "description", content: "A trendy Pinterest-style photobooth: pick a lens, choose a strip, snap, and download a 3D-animated photostrip." },
    ],
  }),
});
