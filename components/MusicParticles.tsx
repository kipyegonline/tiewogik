"use client";
import React, { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  opacityDirection: number;
  drift: number;
  driftSpeed: number;
  driftOffset: number;
  symbol: string;
  rotation: number;
  rotationSpeed: number;
  color: string;
  glowSize: number;
  pulsePhase: number;
  pulseSpeed: number;
}

const MUSIC_SYMBOLS = ["♪", "♫", "♬", "♩", "♭", "♮", "𝄞"];
const COLORS = [
  "rgba(232, 111, 54, ", // orange
  "rgba(242, 149, 107, ", // light orange
  "rgba(180, 100, 59, ", // brown
  "rgba(200, 130, 95, ", // light brown
  "rgba(255, 180, 100, ", // warm gold
  "rgba(255, 140, 60, ", // amber
  "rgba(220, 160, 120, ", // sand
];

const PARTICLE_COUNT = 35;

export default function MusicParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  const createParticle = useCallback(
    (canvas: HTMLCanvasElement, startFromBottom = false): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: startFromBottom ? canvas.height + 20 : Math.random() * canvas.height,
        size: Math.random() * 18 + 10,
        speed: Math.random() * 0.5 + 0.15,
        opacity: Math.random() * 0.4 + 0.1,
        opacityDirection: 1,
        drift: 0,
        driftSpeed: Math.random() * 0.008 + 0.003,
        driftOffset: Math.random() * Math.PI * 2,
        symbol: MUSIC_SYMBOLS[Math.floor(Math.random() * MUSIC_SYMBOLS.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        glowSize: Math.random() * 15 + 8,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
      };
    },
    [],
  );

  const initParticles = useCallback(
    (canvas: HTMLCanvasElement) => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas, false),
      );
    },
    [createParticle],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    handleResize();
    initParticles(canvas);

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      if (!ctx || !canvas) return;
      timeRef.current += 1;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle ambient orbs in background
      const orbCount = 3;
      for (let i = 0; i < orbCount; i++) {
        const orbX =
          canvas.width * (0.2 + i * 0.3) +
          Math.sin(timeRef.current * 0.003 + i * 2) * 100;
        const orbY =
          canvas.height * 0.4 +
          Math.cos(timeRef.current * 0.002 + i * 1.5) * 80;
        const orbRadius = 200 + Math.sin(timeRef.current * 0.005 + i) * 50;
        const gradient = ctx.createRadialGradient(
          orbX,
          orbY,
          0,
          orbX,
          orbY,
          orbRadius,
        );
        gradient.addColorStop(0, `rgba(232, 111, 54, 0.03)`);
        gradient.addColorStop(0.5, `rgba(180, 100, 59, 0.015)`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Update and draw particles
      particlesRef.current.forEach((p, index) => {
        // Float upward
        p.y -= p.speed;
        // Gentle wave drift
        p.drift =
          Math.sin(timeRef.current * p.driftSpeed + p.driftOffset) * 1.5;
        p.x += p.drift;
        // Rotate
        p.rotation += p.rotationSpeed;
        // Pulse opacity
        const pulse = Math.sin(timeRef.current * p.pulseSpeed + p.pulsePhase);
        const dynamicOpacity = p.opacity + pulse * 0.15;

        // Mouse interaction — particles gently repel
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.x += (dx / dist) * force * 1.5;
          p.y += (dy / dist) * force * 1.5;
        }

        // Reset particle when it goes off screen
        if (p.y < -30 || p.x < -30 || p.x > canvas.width + 30) {
          particlesRef.current[index] = createParticle(canvas, true);
          return;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Glow effect
        const glowPulse =
          p.glowSize + Math.sin(timeRef.current * 0.03 + p.pulsePhase) * 4;
        ctx.shadowColor = p.color + `${Math.max(0, dynamicOpacity * 0.6)})`;
        ctx.shadowBlur = glowPulse;

        // Draw the music symbol
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle =
          p.color + `${Math.max(0, Math.min(1, dynamicOpacity))})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.symbol, 0, 0);

        ctx.restore();
      });

      // Draw connecting lines between nearby particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(232, 111, 54, ${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [initParticles, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
