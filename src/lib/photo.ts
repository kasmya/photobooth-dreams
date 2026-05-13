import type { Lens } from "./lenses";
import type { FrameTemplate } from "./frames";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

// Capture a single frame from the video element with a lens applied.
export function captureFromVideo(video: HTMLVideoElement, lens: Lens, w = 800, h = 600): string {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  // mirror the webcam (selfie style)
  ctx.save();
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  // cover-fit
  const vr = video.videoWidth / video.videoHeight;
  const cr = w / h;
  let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;
  if (vr > cr) {
    sw = video.videoHeight * cr;
    sx = (video.videoWidth - sw) / 2;
  } else {
    sh = video.videoWidth / cr;
    sy = (video.videoHeight - sh) / 2;
  }
  ctx.filter = lens.filter;
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
  ctx.restore();

  ctx.filter = "none";
  if (lens.overlay) {
    ctx.fillStyle = lens.overlay.color;
    ctx.globalAlpha = lens.overlay.alpha;
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }
  if (lens.noise) {
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const amt = lens.noise * 60;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * amt;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);
  }
  return c.toDataURL("image/jpeg", 0.92);
}

// Compose photos into the chosen frame template.
export async function composeFrame(template: FrameTemplate, photos: string[]): Promise<string> {
  const c = document.createElement("canvas");
  c.width = template.width;
  c.height = template.height;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = template.bg;
  ctx.fillRect(0, 0, c.width, c.height);

  for (let i = 0; i < template.slots.length; i++) {
    const s = template.slots[i];
    const photo = photos[i];
    if (!photo) continue;
    const img = await loadImage(photo);
    const x = s.x * c.width;
    const y = s.y * c.height;
    const w = s.w * c.width;
    const h = s.h * c.height;
    // cover fit
    const ir = img.width / img.height;
    const sr = w / h;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;
    if (ir > sr) {
      sw = img.height * sr;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / sr;
      sy = (img.height - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  const frameImg = await loadImage(template.src);
  ctx.drawImage(frameImg, 0, 0, c.width, c.height);
  return c.toDataURL("image/png");
}
