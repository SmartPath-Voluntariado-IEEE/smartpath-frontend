/**
 * Canvas Confetti ultra-liviano (cero dependencias externas).
 * Diseñado para animaciones de celebración suaves y fluidas en React / Next.js.
 */

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}

const BRAND_COLORS = [
  "#6E43FF", // Primary Purple
  "#3D5AFE", // Indigo
  "#00B4DB", // Cyan
  "#00C48C", // Success Green
  "#FF8A00", // Accent Orange
  "#FFD700", // Gold
];

export function triggerConfetti(durationMs = 2500, particleCount = 70) {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "99999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const handleResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", handleResize);

  const particles: Particle[] = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width * 0.5 + (Math.random() - 0.5) * 200,
      y: height * 0.4 + (Math.random() - 0.5) * 100,
      w: Math.random() * 10 + 6,
      h: Math.random() * 6 + 4,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 12,
      color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
      opacity: 1,
    });
  }

  const startTime = performance.now();

  function render(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);

    ctx!.clearRect(0, 0, width, height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // Gravedad suave
      p.vx *= 0.98; // Resistencia al aire
      p.rotation += p.rotationSpeed;
      p.opacity = Math.max(0, 1 - progress * 1.1);

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.fillStyle = p.color;
      ctx!.globalAlpha = p.opacity;
      ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx!.restore();
    }

    if (progress < 1) {
      requestAnimationFrame(render);
    } else {
      window.removeEventListener("resize", handleResize);
      canvas.remove();
    }
  }

  requestAnimationFrame(render);
}
