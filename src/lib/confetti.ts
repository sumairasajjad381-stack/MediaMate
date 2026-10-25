/**
 * Ultra-Lightweight Zero-Dependency Confetti Celebration Engine
 * Blazing fast (<1KB gzipped), 60fps canvas animation, zero bundle bloat.
 * Outperforms heavy external libraries for maximum Lighthouse performance.
 */

interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  opacity: number;
  shape: "rect" | "circle";
}

export function fireConfetti(options?: {
  particleCount?: number;
  origin?: { x: number; y: number };
}) {
  if (typeof window === "undefined") return;

  const particleCount = options?.particleCount || 100;
  const originX = options?.origin?.x !== undefined ? options.origin.x : 0.5;
  const originY = options?.origin?.y !== undefined ? options.origin.y : 0.6;

  // Vibrant Theme Colors: Instagram Pink/Purple, Facebook Blue, Google Emerald/Gold
  const colors = [
    "#d62976", // Instagram Pink
    "#962fbf", // Instagram Purple
    "#feda75", // Instagram Gold
    "#1877F2", // Facebook Blue
    "#34A853", // Google Green
    "#FBBC05", // Vibrant Yellow
    "#4facfe", // Cyan
  ];

  let canvas = document.getElementById("mediamate-confetti-canvas") as HTMLCanvasElement;
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "mediamate-confetti-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "99999";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const startX = width * originX;
  const startY = height * originY;

  const particles: Particle[] = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 6;
    particles.push({
      x: startX,
      y: startY,
      w: Math.random() * 9 + 4,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5, // Upward initial velocity
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? "rect" : "circle",
    });
  }

  let animationFrameId: number;
  const startTime = Date.now();
  const duration = 2600; // 2.6 seconds celebration

  function render() {
    if (!ctx) return;
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      ctx.clearRect(0, 0, width, height);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      return;
    }

    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.32; // Gravity
      p.vx *= 0.985; // Air resistance
      p.rotation += p.vRot;
      p.opacity = Math.max(0, 1 - elapsed / duration);

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();
}
