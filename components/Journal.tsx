"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import styles from "./Journal.module.css";

export type JournalItem = { tag: string; title: string; body: string; color: string; href: string };

function Arrow() {
  return <svg aria-hidden="true" viewBox="0 0 32 32"><path d="M7 25 25 7M7 7h18v18" /></svg>;
}

export default function Journal({ items }: { items: JournalItem[] }) {
  const section = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 1200px) and (hover: hover) and (pointer: fine)", touch: "(max-width: 1199px), (hover: none)", reduce: "(prefers-reduced-motion: reduce)" }, context => {
      const { desktop, reduce } = context.conditions!;
      if (reduce) return;

      const cards = Array.from(el.querySelectorAll<HTMLAnchorElement>("[data-journal-card]"));
      const splits: SplitText[] = [];
      const removeListeners: (() => void)[] = [];
      const motionTargets: Element[] = [];
      let alive = true;
      el.dataset.enhanced = "true";

      // The extra scroll entrance complements the original expanding-circle interaction.
      gsap.fromTo(el.querySelector("[data-journal-curtain]"), { scaleY: 1 }, {
        scaleY: 0, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 24%", scrub: true },
      });
      gsap.fromTo(el.querySelectorAll("[data-journal-heading-line]"), { yPercent: 115 }, {
        yPercent: 0, stagger: .12, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 80%", end: "top 22%", scrub: .45 },
      });
      gsap.fromTo(el.querySelector("[data-journal-intro]"), { y: 65, opacity: .2 }, {
        y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 72%", end: "top 22%", scrub: .4 },
      });
      gsap.fromTo(cards, { y: desktop ? 95 : 45 }, {
        y: 0, stagger: .08, ease: "power2.out", scrollTrigger: { trigger: el.querySelector("[data-journal-grid]"), start: "top 95%", end: "top 57%", scrub: .4 },
      });

      cards.forEach(card => {
        const circle = card.querySelector<HTMLElement>("[data-journal-circle]")!;
        const title = card.querySelector<HTMLElement>("[data-journal-title]")!;
        const body = card.querySelector<HTMLElement>("[data-journal-body]")!;
        const copy = card.querySelector<HTMLElement>("[data-journal-copy]")!;
        const link = card.querySelector<HTMLElement>("[data-journal-link]")!;
        let lines: Element[] = [];
        let active = false;
        let leaveDelay: gsap.core.Tween | null = null;
        motionTargets.push(circle, link);

        const updateCenter = () => {
          card.style.setProperty("--circle-center-y", `${copy.offsetHeight / 2}px`);
        };
        const titleSplit = new SplitText(title, {
          type: "lines", linesClass: styles.titleLine, autoSplit: true,
          onSplit: self => {
            self.lines.forEach((line, index) => (line as HTMLElement).style.setProperty("--line-delay", `${index * .1}s`));
            updateCenter();
          },
        });
        const bodySplit = new SplitText(body, {
          type: "lines", mask: "lines", autoSplit: true,
          onSplit: self => {
            lines = self.lines;
            motionTargets.push(...lines);
            gsap.set(lines, { yPercent: active ? 0 : 110 });
            updateCenter();
          },
        });
        splits.push(titleSplit, bodySplit);
        gsap.set(link, { y: 14, opacity: 0 });

        const show = () => {
          leaveDelay?.kill();
          if (active) return;
          active = true;
          updateCenter();
          card.dataset.active = "true";
          if (desktop) el.dataset.hovering = "true";
          gsap.to(lines, { yPercent: 0, duration: .8, stagger: .045, ease: "power3.out", overwrite: true });
          gsap.to(link, { y: 0, opacity: 1, duration: .6, delay: .12, ease: "power3.out", overwrite: true });
        };
        const hide = () => {
          if (card.matches(":focus-within")) return;
          active = false;
          delete card.dataset.active;
          if (!cards.some(other => other.dataset.active === "true")) delete el.dataset.hovering;
          gsap.to(lines, { yPercent: 110, duration: .35, stagger: .025, ease: "power3.in", overwrite: true });
          gsap.to(link, { y: 14, opacity: 0, duration: .2, overwrite: true });
          gsap.to(circle, { x: 0, y: 0, duration: .5, overwrite: true });
        };
        const leave = () => { leaveDelay?.kill(); leaveDelay = gsap.delayedCall(.12, hide); };
        const move = (event: PointerEvent) => {
          if (!active || !desktop) return;
          const rect = card.getBoundingClientRect();
          gsap.to(circle, { x: (event.clientX - rect.left - rect.width / 2) * .02, y: (event.clientY - rect.top - copy.offsetHeight / 2) * .02, duration: .5, ease: "power3.out", overwrite: true });
        };
        if (desktop) {
          card.addEventListener("pointerenter", show);
          card.addEventListener("pointerleave", leave);
          card.addEventListener("pointermove", move);
        } else {
          ScrollTrigger.create({ trigger: card, start: "top 65%", end: "bottom 30%", onToggle: self => self.isActive ? show() : hide() });
        }
        card.addEventListener("focusin", show);
        card.addEventListener("focusout", leave);
        const observer = new ResizeObserver(updateCenter);
        observer.observe(copy);
        updateCenter();
        removeListeners.push(() => {
          leaveDelay?.kill();
          observer.disconnect();
          card.removeEventListener("pointerenter", show);
          card.removeEventListener("pointerleave", leave);
          card.removeEventListener("pointermove", move);
          card.removeEventListener("focusin", show);
          card.removeEventListener("focusout", leave);
          delete card.dataset.active;
          card.style.removeProperty("--circle-center-y");
        });
      });

      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
      return () => {
        alive = false;
        removeListeners.forEach(remove => remove());
        gsap.killTweensOf(motionTargets);
        splits.forEach(split => split.revert());
        delete el.dataset.enhanced;
        delete el.dataset.hovering;
      };
    }, el);
    return () => mm.revert();
  }, [items]);

  return <section ref={section} id="journal" className={styles.section} aria-labelledby="journal-title">
    <div className={styles.curtain} data-journal-curtain aria-hidden="true" />
    <div className={styles.dimmer} aria-hidden="true" />
    <div className={styles.heading}>
      <h2 id="journal-title" className={styles.title}>
        <span className={styles.headingMask}><span data-journal-heading-line>За кадром</span></span>
        <span className={styles.headingMask}><em data-journal-heading-line>ремонта.</em></span>
      </h2>
      <div className={styles.intro} data-journal-intro>
        <p>Реальные объекты, рабочие моменты и готовые интерьеры. Больше, чем несколько фотографий.</p>
        <a href="https://t.me/maximgurevich" target="_blank" rel="noopener noreferrer" className={styles.action}>Открыть Telegram <Arrow /></a>
      </div>
    </div>
    <div className={styles.grid} data-journal-grid>
      {items.map(item => <a key={item.title} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} className={styles.card} data-journal-card style={{ "--journal-color": item.color } as CSSProperties}>
        <span className={styles.circlePosition} aria-hidden="true"><span className={styles.circle} data-journal-circle /></span>
        <div className={styles.copy} data-journal-copy>
          <span className={styles.tag}>{item.tag}</span>
          <h3 className={styles.cardTitle} data-journal-title>{item.title}</h3>
          <div className={styles.body}><p data-journal-body>{item.body}</p><span className={styles.link} data-journal-link>Посмотреть <Arrow /></span></div>
        </div>
      </a>)}
    </div>
  </section>;
}
