import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { LENSES, type Lens } from "@/lib/lenses";
import { FRAMES, type FrameTemplate } from "@/lib/frames";
import { captureFromVideo, composeFrame } from "@/lib/photo";

type Step = "start" | "lens" | "frame" | "capture" | "reveal";

const Sticker = ({ children, className = "", r = 0 }: { children: React.ReactNode; className?: string; r?: number }) => (
  <span className={`absolute select-none animate-float ${className}`} style={{ ["--r" as string]: `${r}deg` }}>
    {children}
  </span>
);

export default function Photobooth() {
  const [step, setStep] = useState<Step>("start");
  const [lens, setLens] = useState<Lens>(LENSES[0]);
  const [frame, setFrame] = useState<FrameTemplate>(FRAMES[0]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [composed, setComposed] = useState<string | null>(null);

  const reset = () => {
    setPhotos([]);
    setComposed(null);
    setStep("start");
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Decorative background stickers */}
      <Sticker className="top-10 left-6 text-5xl" r={-15}>✨</Sticker>
      <Sticker className="top-32 right-10 text-6xl" r={20}>💖</Sticker>
      <Sticker className="bottom-24 left-12 text-5xl" r={10}>⭐</Sticker>
      <Sticker className="bottom-10 right-20 text-5xl" r={-20}>🌸</Sticker>

      <header className="px-6 pt-8 pb-2 flex items-center justify-between max-w-6xl mx-auto">
        <button onClick={reset} className="flex items-center gap-2">
          <span className="text-3xl">📸</span>
          <span className="text-2xl font-bold tracking-tight">snapcore<span className="text-primary">.booth</span></span>
        </button>
        <span className="scribble text-2xl text-muted-foreground hidden sm:block">say cheese!</span>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {step === "start" && <StartScreen key="start" onStart={() => setStep("lens")} />}
          {step === "lens" && (
            <LensScreen
              key="lens"
              selected={lens}
              onSelect={(l) => { setLens(l); }}
              onNext={() => setStep("frame")}
            />
          )}
          {step === "frame" && (
            <FrameScreen
              key="frame"
              selected={frame}
              onSelect={setFrame}
              onBack={() => setStep("lens")}
              onNext={() => setStep("capture")}
            />
          )}
          {step === "capture" && (
            <CaptureScreen
              key="capture"
              lens={lens}
              frame={frame}
              onBack={() => setStep("frame")}
              onComplete={async (shots) => {
                setPhotos(shots);
                const out = await composeFrame(frame, shots);
                setComposed(out);
                setStep("reveal");
              }}
            />
          )}
          {step === "reveal" && composed && (
            <RevealScreen
              key="reveal"
              image={composed}
              frame={frame}
              onRetake={reset}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

/* ------------------- START ------------------- */
function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="text-center pt-10 sm:pt-16"
    >
      <div className="inline-block scribble text-3xl text-primary mb-2 -rotate-3">a lil photobooth ♡</div>
      <h1 className="text-6xl sm:text-8xl font-black leading-none">
        snap your<br />
        <span className="inline-block bg-primary text-primary-foreground px-4 -rotate-2 mt-2 rounded-2xl">
          coreteen era
        </span>
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-md mx-auto">
        Pick a lens, choose a frame, take 3 or 4 shots, and watch your strip pop straight out of the booth.
      </p>

      <motion.button
        whileHover={{ scale: 1.05, rotate: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="mt-10 inline-flex items-center gap-3 bg-foreground text-background text-2xl font-bold px-8 py-5 rounded-full pop-shadow"
      >
        Step inside the booth →
      </motion.button>

      {/* 3D booth preview */}
      <div className="mt-16 mx-auto" style={{ perspective: 1200 }}>
        <motion.div
          animate={{ rotateY: [-12, 12, -12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-64 h-80 mx-auto"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary to-bubblegum pop-shadow" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-40 h-24 rounded-xl bg-cream border-4 border-foreground" />
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-foreground" />
          <div className="absolute top-32 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-destructive animate-ping opacity-40" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-44 h-3 rounded-full bg-foreground/20" />
        </motion.div>
      </div>
    </motion.section>
  );
}

/* ------------------- LENS ------------------- */
function LensScreen({ selected, onSelect, onNext }: { selected: Lens; onSelect: (l: Lens) => void; onNext: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <StepHeader n={1} title="pick your lens" sub="each lens color-grades your shots" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {LENSES.map((l) => {
          const active = l.id === selected.id;
          return (
            <motion.button
              key={l.id}
              onClick={() => onSelect(l)}
              whileHover={{ y: -4 }}
              className={`relative text-left rounded-3xl p-5 border-2 transition-colors ${active ? "border-foreground pop-shadow bg-card" : "border-border bg-card/70"}`}
            >
              <div
                className="aspect-[5/3] rounded-2xl mb-4 relative overflow-hidden border-2 border-foreground/10"
                style={{ background: l.swatch }}
              >
                <div className={`absolute inset-0 ${l.cssClass}`}>
                  <SamplePhoto />
                </div>
                {active && (
                  <span className="absolute top-2 right-2 bg-foreground text-background text-xs font-bold px-2 py-1 rounded-full">
                    chosen
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl font-bold">{l.name}</h3>
                <span className="scribble text-lg text-primary">{l.tag.split(" · ")[0]}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{l.desc}</p>
            </motion.button>
          );
        })}
      </div>
      <NextBar onNext={onNext} label="next: pick a frame →" />
    </motion.section>
  );
}

function SamplePhoto() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#ffd1a8] via-[#ffaec0] to-[#a8d8ff] flex items-center justify-center">
      <span className="text-5xl">🌷</span>
    </div>
  );
}

/* ------------------- FRAME ------------------- */
function FrameScreen({ selected, onSelect, onBack, onNext }: { selected: FrameTemplate; onSelect: (f: FrameTemplate) => void; onBack: () => void; onNext: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <StepHeader n={2} title="pick your strip" sub={`${selected.slots.length} shots — ${selected.vibe}`} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {FRAMES.map((f) => {
          const active = f.id === selected.id;
          return (
            <motion.button
              key={f.id}
              onClick={() => onSelect(f)}
              whileHover={{ y: -4, rotate: -1 }}
              className={`relative rounded-2xl p-2 border-2 ${active ? "border-foreground pop-shadow bg-card" : "border-border bg-card/70"}`}
            >
              <img src={f.src} alt={f.name} className="w-full h-auto rounded-xl" />
              <div className="text-center mt-2 text-sm font-bold">{f.name}</div>
              <div className="text-center text-xs text-muted-foreground">{f.slots.length} shots</div>
              {active && <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full rotate-6">picked!</span>}
            </motion.button>
          );
        })}
      </div>
      <NextBar onBack={onBack} onNext={onNext} label="next: open the camera →" />
    </motion.section>
  );
}

/* ------------------- CAPTURE ------------------- */
function CaptureScreen({ lens, frame, onBack, onComplete }: { lens: Lens; frame: FrameTemplate; onBack: () => void; onComplete: (photos: string[]) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shots, setShots] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: "user", width: 1280, height: 720 }, audio: false })
      .then((s) => {
        if (!active) { s.getTracks().forEach(t => t.stop()); return; }
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch((e) => setError(e.message || "Camera unavailable"));
    return () => {
      active = false;
      stream?.getTracks().forEach(t => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const need = frame.slots.length;

  const takeOne = async () => {
    if (!videoRef.current || busy) return;
    setBusy(true);
    for (let n = 3; n >= 1; n--) {
      setCountdown(n);
      await new Promise(r => setTimeout(r, 700));
    }
    setCountdown(0); // FLASH
    await new Promise(r => setTimeout(r, 120));
    const data = captureFromVideo(videoRef.current, lens);
    setCountdown(null);
    const next = [...shots, data];
    setShots(next);
    setBusy(false);
    if (next.length >= need) {
      stream?.getTracks().forEach(t => t.stop());
      setTimeout(() => onComplete(next), 400);
    }
  };

  const takeAll = async () => {
    setShots([]);
    for (let i = 0; i < need; i++) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise<void>(async (res) => {
        if (!videoRef.current) return res();
        for (let n = 3; n >= 1; n--) {
          setCountdown(n);
          // eslint-disable-next-line no-await-in-loop
          await new Promise(r => setTimeout(r, 650));
        }
        setCountdown(0);
        await new Promise(r => setTimeout(r, 120));
        const data = captureFromVideo(videoRef.current, lens);
        setShots(prev => {
          const next = [...prev, data];
          if (next.length >= need) {
            stream?.getTracks().forEach(t => t.stop());
            setTimeout(() => onComplete(next), 500);
          }
          return next;
        });
        setCountdown(null);
        await new Promise(r => setTimeout(r, 600));
        res();
      });
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const reads = await Promise.all(files.slice(0, need - shots.length).map(file => new Promise<string>((res) => {
      const reader = new FileReader();
      reader.onload = () => {
        // apply lens to uploaded image via offscreen canvas
        const img = new Image();
        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = 800; c.height = 600;
          const ctx = c.getContext("2d")!;
          const ir = img.width / img.height;
          const cr = c.width / c.height;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;
          if (ir > cr) { sw = img.height * cr; sx = (img.width - sw)/2; }
          else { sh = img.width / cr; sy = (img.height - sh)/2; }
          ctx.filter = lens.filter;
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
          ctx.filter = "none";
          if (lens.overlay) {
            ctx.fillStyle = lens.overlay.color;
            ctx.globalAlpha = lens.overlay.alpha;
            ctx.fillRect(0,0,c.width,c.height);
            ctx.globalAlpha = 1;
          }
          res(c.toDataURL("image/jpeg", 0.92));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    })));
    const next = [...shots, ...reads];
    setShots(next);
    if (next.length >= need) {
      stream?.getTracks().forEach(t => t.stop());
      setTimeout(() => onComplete(next.slice(0, need)), 400);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="pt-6"
    >
      <StepHeader n={3} title="strike a pose" sub={`${shots.length} / ${need} shots · lens: ${lens.name}`} />

      <div className="grid lg:grid-cols-[1fr,280px] gap-6 items-start">
        <div className="relative rounded-3xl overflow-hidden border-4 border-foreground bg-black aspect-video pop-shadow">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-cream gap-3 p-6 text-center">
              <span className="text-5xl">📷</span>
              <div className="font-bold">Couldn't open camera</div>
              <div className="text-sm opacity-80">{error}</div>
              <button onClick={() => fileInputRef.current?.click()} className="mt-2 bg-primary px-4 py-2 rounded-full font-bold text-primary-foreground">
                Upload photos instead
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover scale-x-[-1] ${lens.cssClass}`}
              />
              {lens.overlay && (
                <div className="absolute inset-0 pointer-events-none mix-blend-soft-light"
                  style={{ background: lens.overlay.color, opacity: lens.overlay.alpha * 2 }} />
              )}
              <AnimatePresence>
                {countdown !== null && (
                  <motion.div
                    key={countdown}
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    {countdown === 0 ? (
                      <motion.div initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 bg-white" />
                    ) : (
                      <span className="text-[14rem] font-black text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">{countdown}</span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: need }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl border-2 border-dashed border-border bg-card/50 overflow-hidden flex items-center justify-center">
                {shots[i] ? (
                  <motion.img initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={shots[i]} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl text-muted-foreground">{i + 1}</span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={takeOne}
            disabled={busy || !!error || shots.length >= need}
            className="w-full bg-primary text-primary-foreground text-xl font-bold py-4 rounded-2xl pop-shadow disabled:opacity-50"
          >
            📸 Take shot
          </button>
          <button
            onClick={takeAll}
            disabled={busy || !!error || shots.length >= need}
            className="w-full bg-card border-2 border-foreground text-foreground font-bold py-3 rounded-2xl disabled:opacity-50"
          >
            ⏯ Auto-burst all {need}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={shots.length >= need}
            className="w-full bg-card border-2 border-border text-foreground font-bold py-3 rounded-2xl disabled:opacity-50"
          >
            📁 Upload from device
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple capture="user" onChange={onUpload} className="hidden" />

          {shots.length > 0 && (
            <button onClick={() => setShots([])} className="w-full text-sm text-muted-foreground underline">clear shots</button>
          )}
        </div>
      </div>

      <NextBar onBack={onBack} />
    </motion.section>
  );
}

/* ------------------- REVEAL ------------------- */
function RevealScreen({ image, frame, onRetake }: { image: string; frame: FrameTemplate; onRetake: () => void }) {
  const download = () => {
    const a = document.createElement("a");
    a.href = image;
    a.download = `snapcore-${frame.id}-${Date.now()}.png`;
    a.click();
  };

  return (
    <motion.section
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="pt-6"
    >
      <StepHeader n={4} title="fresh out the booth" sub="your strip is ready ♡" />

      <div className="grid lg:grid-cols-[1fr,1fr] gap-10 items-center">
        {/* 3D booth ejecting strip */}
        <div className="relative mx-auto" style={{ perspective: 1400 }}>
          <div className="relative w-[320px] h-[420px] mx-auto">
            {/* booth body */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-primary to-bubblegum pop-shadow" />
            <div className="absolute top-6 left-1/2 -translate-x-1/2 w-52 h-32 rounded-2xl bg-cream border-4 border-foreground flex items-center justify-center">
              <span className="scribble text-3xl">snap!</span>
            </div>
            <div className="absolute bottom-20 left-6 right-6 h-3 rounded-full bg-foreground/40" />
            {/* slot opening */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-44 h-4 bg-foreground rounded-full" />

            {/* ejected strip */}
            <motion.div
              initial={{ y: -180, opacity: 0, rotateX: 70 }}
              animate={{ y: 200, opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 60, damping: 14 }}
              style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
              className="absolute left-1/2 -translate-x-1/2 top-0 w-32 soft-shadow rounded-md overflow-hidden border-2 border-foreground"
            >
              <img src={image} alt="strip" className="block w-full h-auto" />
            </motion.div>

            {/* sparkle bursts */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.4, 0], y: [0, -60 - i * 10], x: (i - 2) * 40 }}
                transition={{ delay: 1 + i * 0.15, duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
                className="absolute bottom-16 left-1/2 text-3xl"
              >
                {i % 2 ? "✨" : "💖"}
              </motion.span>
            ))}
          </div>
        </div>

        <div>
          <motion.img
            initial={{ rotate: -6, y: 30, opacity: 0 }}
            animate={{ rotate: -2, y: 0, opacity: 1 }}
            transition={{ delay: 1.4, type: "spring" }}
            src={image}
            alt="your photostrip"
            className="max-h-[640px] mx-auto soft-shadow rounded-xl"
          />
          <div className="flex gap-3 justify-center mt-6">
            <motion.button whileTap={{ scale: 0.95 }} onClick={download}
              className="bg-foreground text-background text-lg font-bold px-6 py-4 rounded-2xl pop-shadow">
              ⬇ Download strip
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={onRetake}
              className="bg-card border-2 border-foreground text-foreground font-bold px-6 py-4 rounded-2xl">
              ↺ start over
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ------------------- helpers ------------------- */
function StepHeader({ n, title, sub }: { n: number; title: string; sub: string }) {
  return (
    <div className="mb-6">
      <div className="scribble text-2xl text-primary">step {n}</div>
      <h2 className="text-4xl sm:text-5xl font-black tracking-tight">{title}</h2>
      <p className="text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function NextBar({ onBack, onNext, label }: { onBack?: () => void; onNext?: () => void; label?: string }) {
  return (
    <div className="flex justify-between items-center mt-10">
      {onBack ? (
        <button onClick={onBack} className="text-foreground/70 underline underline-offset-4 font-bold">← back</button>
      ) : <span />}
      {onNext && (
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onNext}
          className="bg-foreground text-background font-bold px-6 py-3 rounded-full pop-shadow">
          {label}
        </motion.button>
      )}
    </div>
  );
}
