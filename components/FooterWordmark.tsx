"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./FooterWordmark.module.css";

export default function FooterWordmark() {
  const root = useRef<HTMLDivElement>(null);
  const veil = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1000px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const element = root.current;
      const overlay = veil.current;
      if (!element || !overlay) return;
      gsap.set(overlay, { xPercent: -50, yPercent: -50 });
      const footer = element.closest("footer")!;
      const xTo = gsap.quickTo(overlay, "x", { duration: .65, ease: "power3.out" });
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        xTo(event.clientX - rect.left - rect.width / 2);
      };
      const reset = () => xTo(0);
      footer.addEventListener("pointermove", move, { passive: true });
      footer.addEventListener("pointerleave", reset);
      return () => { footer.removeEventListener("pointermove", move); footer.removeEventListener("pointerleave", reset); gsap.killTweensOf(overlay); };
    }, root);
    return () => mm.revert();
  }, []);

  return <div className={styles.wordmark} ref={root} aria-hidden="true"><span>MG РЕМОНТ</span><div className={styles.veil} ref={veil} /></div>;
}
