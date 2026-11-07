"use client";

import { useEffect, useRef } from "react";
import land from "./globe-land.json";
import styles from "./Globe.module.css";

const RAD = Math.PI / 180;
const TILT = 22 * RAD;
const COS_TILT = Math.cos(TILT);
const SIN_TILT = Math.sin(TILT);

function position(longitude: number, latitude: number) {
  const phi = latitude * RAD;
  const lambda = longitude * RAD;
  const cos = Math.cos(phi);
  return [cos * Math.sin(lambda), Math.sin(phi), cos * Math.cos(lambda)];
}

// Equal-distance latitude rings, clipped to Natural Earth 1:110m land.
// Coordinates are hundredths of a degree. See globe-SOURCES.md.
const POINTS: number[][] = [];
for (let i = 0; i < land.length; i += 2) {
  POINTS.push(position(land[i] / 100, land[i + 1] / 100));
}
const MOSCOW = position(37.6173, 55.7558);

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches;
    let visible = false;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let angle = 25 * RAD;
    let frame = 0;
    let lastTime = 0;
    let disposed = false;

    const draw = () => {
      if (!width || !height) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, width, height);
      const radius = Math.min(width, height) * 0.435;
      const centerX = width / 2;
      const centerY = height / 2;
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      const dot = Math.max(0.7, radius / 207);
      const paths = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];

      const project = (point: number[]) => {
        const x = point[0] * cos - point[2] * sin;
        const z = point[0] * sin + point[2] * cos;
        return [x, point[1] * COS_TILT - z * SIN_TILT, point[1] * SIN_TILT + z * COS_TILT];
      };

      for (const point of POINTS) {
        const [x, y, depth] = project(point);
        const bucket = depth < -0.2 ? 0 : depth < 0.1 ? 1 : depth < 0.55 ? 2 : 3;
        const size = dot * (0.65 + (depth + 1) * 0.34);
        const px = centerX + x * radius;
        const py = centerY - y * radius;
        paths[bucket].moveTo(px + size, py);
        paths[bucket].arc(px, py, size, 0, Math.PI * 2);
      }

      const opacity = [0.16, 0.27, 0.66, 0.96];
      context.fillStyle = "#f2f2f2";
      paths.forEach((path, index) => {
        context.globalAlpha = opacity[index];
        context.fill(path);
      });

      const [mx, my, depth] = project(MOSCOW);
      if (depth > 0.08) {
        const x = centerX + mx * radius;
        const y = centerY - my * radius;
        const alpha = Math.min(1, (depth - 0.08) * 5);
        const markerRadius = Math.max(4, width * 0.008);
        context.globalAlpha = alpha * 0.23;
        context.fillStyle = "#e0ff98";
        context.beginPath();
        context.arc(x, y, markerRadius * 3.3, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = alpha;
        context.beginPath();
        context.arc(x, y, markerRadius, 0, Math.PI * 2);
        context.fill();
        context.font = `italic ${Math.max(15, width * 0.027)}px Georgia, serif`;
        context.textBaseline = "bottom";
        const labelWidth = context.measureText("Москва").width;
        const labelX = Math.min(x + markerRadius * 3.5, width - labelWidth - 8);
        context.fillText("Москва", labelX, y - markerRadius * 1.5);
      }
      context.globalAlpha = 1;
    };

    const tick = (time: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden || reduced) return;
      if (!lastTime) lastTime = time;
      const elapsed = time - lastTime;
      // The reference rotates in roughly 90 seconds. Cap drawing at 30fps.
      if (elapsed >= 1000 / 30) {
        angle += Math.min(elapsed, 100) * 0.00007;
        lastTime = time;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };

    const syncAnimation = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (!disposed && visible && !document.hidden) {
        draw();
        if (!reduced) frame = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      draw();
    };

    const onPreference = () => {
      reduced = preference.matches;
      syncAnimation();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    const resizeObserver = new ResizeObserver(resize);
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    preference.addEventListener("change", onPreference);
    document.addEventListener("visibilitychange", syncAnimation);
    resize();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      preference.removeEventListener("change", onPreference);
      document.removeEventListener("visibilitychange", syncAnimation);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
