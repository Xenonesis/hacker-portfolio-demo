import React, { useRef, useEffect } from "react";

const PARTICLE_COUNT = 100;
const COLORS = [
  "#39ff14", // neon green
  "#00fff9", // neon cyan
  "#ff00ea", // neon magenta
  "#ffffff"  // white
];

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  colorIndex: number;
  colorPhase: number;
  alpha: number;
  depth: number; // for parallax
};

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas!.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas!.width = width;
    canvas!.height = height;

    // Initialize particles
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: randomBetween(0, width),
      y: randomBetween(0, height),
      vx: randomBetween(-0.3, 0.3),
      vy: randomBetween(-0.3, 0.3),
      radius: randomBetween(1.5, 3.5),
      colorIndex: Math.floor(Math.random() * COLORS.length),
      colorPhase: randomBetween(0, Math.PI * 2),
      alpha: randomBetween(0.5, 1),
      depth: randomBetween(0.3, 1) // 0.3 = far, 1 = near
    }));

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function animateColor(index: number, phase: number) {
      // Cycle through colors smoothly
      const nextIndex = (index + 1) % COLORS.length;
      const t = (Math.sin(phase) + 1) / 2;
      // Simple linear blend between two colors
      function hexToRgb(hex: string) {
        const m = hex.match(/^#([0-9a-f]{6})$/i);
        if (!m) return [255, 255, 255];
        return [
          parseInt(m[1].substr(0, 2), 16),
          parseInt(m[1].substr(2, 2), 16),
          parseInt(m[1].substr(4, 2), 16)
        ];
      }
      const rgb1 = hexToRgb(COLORS[index]);
      const rgb2 = hexToRgb(COLORS[nextIndex]);
      const r = Math.round(lerp(rgb1[0], rgb2[0], t));
      const g = Math.round(lerp(rgb1[1], rgb2[1], t));
      const b = Math.round(lerp(rgb1[2], rgb2[2], t));
      return `rgba(${r},${g},${b},1)`;
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // Parallax offset based on mouse position
      const parallaxStrength = 40;
      const offsetX = (mouse.current.x - 0.5) * parallaxStrength;
      const offsetY = (mouse.current.y - 0.5) * parallaxStrength;

      // Draw particles
      for (const p of particles.current) {
        // Animate color
        const color = animateColor(p.colorIndex, p.colorPhase);

        // Parallax position
        const px = p.x + offsetX * p.depth;
        const py = p.y + offsetY * p.depth;

        ctx!.save();
        ctx!.globalAlpha = p.alpha;
        ctx!.beginPath();
        ctx!.arc(px, py, p.radius, 0, 2 * Math.PI);
        ctx!.fillStyle = color;
        ctx!.shadowColor = color;
        ctx!.shadowBlur = 16 * p.depth;
        ctx!.fill();
        ctx!.restore();
      }

      // Draw lines between close particles (with parallax)
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const a = particles.current[i];
          const b = particles.current[j];
          const ax = a.x + offsetX * a.depth;
          const ay = a.y + offsetY * a.depth;
          const bx = b.x + offsetX * b.depth;
          const by = b.y + offsetY * b.depth;
          const dist = Math.hypot(ax - bx, ay - by);
          if (dist < 100) {
            ctx!.save();
            ctx!.globalAlpha = 0.08 * a.depth;
            ctx!.strokeStyle = animateColor(a.colorIndex, a.colorPhase);
            ctx!.beginPath();
            ctx!.moveTo(ax, ay);
            ctx!.lineTo(bx, by);
            ctx!.stroke();
            ctx!.restore();
          }
        }
      }
    }

    function update() {
      for (const p of particles.current) {
        p.x += p.vx * p.depth;
        p.y += p.vy * p.depth;
        p.colorPhase += 0.01 + 0.01 * p.depth;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    }

    let animationId: number;
    function animate() {
      update();
      draw();
      animationId = requestAnimationFrame(animate);
    }
    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
    }
    window.addEventListener("resize", handleResize);

    function handleMouseMove(e: MouseEvent) {
      mouse.current.x = e.clientX / width;
      mouse.current.y = e.clientY / height;
    }
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: 0.6, transition: "opacity 0.3s" }}
    />
  );
};

export default ParticleBackground;
