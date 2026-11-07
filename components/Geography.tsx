"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Globe from "./Globe";
import styles from "./Geography.module.css";

export default function Geography() {
  const sectionRef = useRef<HTMLElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let visible = false;
    const syncVisibility = () => setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncVisibility();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", syncVisibility);

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(section.querySelectorAll("[data-geo-reveal]"),
        { yPercent: 65 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.09,
          scrollTrigger: {
            trigger: section,
            start: "top 95%",
            end: "top 22%",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        },
      );
    }, section);

    return () => {
      media.revert();
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="geography-title" data-running={running}>
      <h2 id="geography-title" className={styles.accessibleTitle}>Ремонт квартир и домов в Москве и Московской области</h2>
      <div className={styles.tickerWindow} aria-hidden="true">
        <div className={styles.tickerEntry} data-geo-reveal>
          <div className={styles.tickerTrack}>
            {[0, 1].map((copy) => (
              <div className={styles.tickerSet} key={copy}>
                {[0, 1, 2].map((row) => (
                  <div className={styles.places} key={row}>
                    <span className={styles.city}>Москва</span>
                    <span className={styles.region}>Московская<br />область</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.detail}>
        <div className={styles.copyWindow}>
          <div className={styles.copy} data-geo-reveal>
            <span className={styles.eyebrow}>Работаем рядом</span>
            <p className={styles.headline}>Ваш проект —<br /><em>здесь.</em></p>
            <p className={styles.description}>Квартира в городе.<br />Дом за его пределами.<br />Москва и Московская область.</p>
            <a className={styles.link} href="#contact">
              <span>Контакты</span>
              <svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M5 23 23 5M5 5h18v18" stroke="currentColor" strokeWidth="1.4" /></svg>
            </a>
          </div>
        </div>
        <div className={styles.globe}><Globe /></div>
        <span className={styles.coordinates} aria-hidden="true">55°45′ с. ш. &nbsp; 37°37′ в. д.</span>
      </div>
    </section>
  );
}
