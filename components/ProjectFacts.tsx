"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ProjectFacts.module.css";

const facts = [
  {
    amount: "210", unit: "м²", title: "Загородный\nдом.",
    description: "Дом с камином, финской сауной и четырьмя мастер-спальнями. Пространство для загородной жизни.",
    image: "/media/house.jpg", alt: "Интерьер загородного дома площадью 210 м²", position: "50% 50%", caption: "",
    source: "https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/", label: "Смотреть дом",
  },
  {
    amount: "73", unit: "м²", title: "Квартира\nв ЗИЛе.",
    description: "Москва. Объект в работе. На изображении — концепция интерьера, созданная с помощью ИИ.",
    image: "/media/apartment-concept.png", alt: "ИИ-концепция кухни-гостиной: иллюстрация интерьера, не фотография объекта 73 м²", position: "50% 50%", caption: "ИИ-концепция интерьера",
    source: "https://www.instagram.com/mg_remont/reel/DPoreZGiCmr/", label: "Смотреть процесс",
  },
  {
    amount: "4", unit: "", title: "Мастер-\nспальни.",
    description: "Четыре мастер-спальни в доме площадью 210 м². Личное пространство для каждого.",
    image: "/media/house-master-bedroom.jpg", alt: "Мастер-спальня с деревянной отделкой в загородном доме 210 м²", position: "50% 62%", caption: "",
    source: "https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/", label: "Смотреть обзор",
  },
];

function Amount({ amount, unit }: { amount: string; unit: string }) {
  return <><span>{amount}</span>{unit && <span className={styles.unit}>{unit}</span>}</>;
}

export default function ProjectFacts() {
  const section = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const root = section.current;
      if (!root) return;
      const stage = root.querySelector<HTMLElement>(`.${styles.stage}`);
      const numberTrack = root.querySelector<HTMLElement>(`.${styles.numberTrack}`);
      const firstTrackRow = root.querySelector<HTMLElement>(`.${styles.trackStep}`);
      const moveTrack = numberTrack ? gsap.quickSetter(numberTrack, "y", "px") : null;
      let rowHeight = firstTrackRow?.offsetHeight ?? 0;
      const photoElement = photo.current;
      const numberPanels = root.querySelectorAll<HTMLElement>(`[data-fact-number]`);
      const titlePanels = root.querySelectorAll<HTMLElement>(`[data-fact-title]`);
      const descriptionPanels = root.querySelectorAll<HTMLElement>(`[data-fact-description]`);
      // GSAP can parse the CSS percentage fallback as a pixel y offset.
      // Own both transform components so no residual offset survives selection.
      [numberPanels, titlePanels, descriptionPanels].forEach(panels => {
        gsap.set(panels, { y: 0, yPercent: (index: number) => index === 0 ? 0 : 110 });
      });
      let current = -1;
      let alive = true;
      const select = (index: number, immediate = false) => {
        if (index === current) return;
        current = index;
        setActive(index);
        [numberPanels, titlePanels, descriptionPanels].forEach((panels, group) => {
          panels.forEach((panel, item) => {
            gsap.to(panel, {
              y: 0,
              yPercent: item < index ? -110 : item > index ? 110 : 0,
              duration: immediate ? 0 : group === 2 ? .36 : .3,
              ease: group === 2 ? "power3.out" : "power3",
              overwrite: true,
            });
          });
        });
      };
      select(0, true);
      // A dense number rail travels inside the sticky stage. Its spacing is
      // independent of the longer scroll distance used to read each fact.
      const playhead = { position: 0 };
      const render = () => {
        moveTrack?.(-playhead.position * rowHeight);
        select(Math.round(playhead.position));
      };
      const scrub = gsap.to(playhead, {
        position: facts.length - 1,
        ease: "none",
        onUpdate: render,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.max(1, root.offsetHeight - (stage?.offsetHeight ?? window.innerHeight))}`,
          scrub: .18,
          invalidateOnRefresh: true,
          onRefresh: () => { rowHeight = firstTrackRow?.offsetHeight ?? 0; render(); },
        },
      });
      const refresh = () => { if (alive) scrub.scrollTrigger?.refresh(); };
      document.fonts.ready.then(refresh);
      const images = Array.from(root.querySelectorAll("img"));
      images.forEach(image => image.addEventListener("load", refresh));

      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      const move = (event: PointerEvent) => {
        if (!finePointer.matches || !photoElement) return;
        const bounds = photoElement.getBoundingClientRect();
        const x = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
        const y = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
        gsap.to(photoElement, { rotateY: -10 + x * 5, rotateX: 12 - y * 5, duration: .7, ease: "power3.out", overwrite: true });
      };
      const leave = () => { if (photoElement) gsap.to(photoElement, { rotateY: -10, rotateX: 12, duration: .7, ease: "power3.out", overwrite: true }); };
      root.addEventListener("pointermove", move);
      root.addEventListener("pointerleave", leave);
      return () => {
        alive = false;
        gsap.killTweensOf([...numberPanels, ...titlePanels, ...descriptionPanels, ...(photoElement ? [photoElement] : [])]);
        if (numberTrack) gsap.set(numberTrack, { clearProps: "transform" });
        images.forEach(image => image.removeEventListener("load", refresh));
        root.removeEventListener("pointermove", move);
        root.removeEventListener("pointerleave", leave);
      };
    }, section);
    return () => media.revert();
  }, []);

  return <section className={styles.section} ref={section} aria-label="Проекты в деталях">
    <div className={styles.stage}>
      <div className={styles.numberTrack} aria-hidden="true">
        {facts.map(fact => <div className={styles.trackStep} key={fact.amount}><span className={styles.trackNumber}><Amount {...fact} /></span></div>)}
      </div>
      <p className={styles.eyebrow}>Масштаб — в деталях</p>
      <div className={styles.composition}>
        <div className={styles.titleWindow}>
          {facts.map((fact, index) => <h2 className={styles.titlePanel} data-fact-title key={fact.amount} aria-hidden={active !== index}>{fact.title}</h2>)}
        </div>
        <div className={styles.media}>
          <div className={styles.photoFrame} ref={photo}>
            {facts.map((fact, index) => <img className={`${styles.photo} ${active === index ? styles.activePhoto : ""}`} key={fact.amount} src={fact.image} style={{ objectPosition: fact.position }} alt={active === index ? fact.alt : ""} aria-hidden={active !== index} loading="lazy" />)}
            <div className={styles.photoShade} />
          </div>
          <div className={styles.numberWindow} aria-hidden="true">
            {facts.map(fact => <div className={styles.numberPanel} data-fact-number key={fact.amount}><Amount {...fact} /></div>)}
          </div>
          {facts[active].caption && <span className={styles.imageCaption}>{facts[active].caption}</span>}
        </div>
        <div className={styles.descriptionWindow}>
          {facts.map((fact, index) => <div className={styles.descriptionPanel} data-fact-description key={fact.amount} aria-hidden={active !== index}><p>{fact.description}</p><a href={fact.source} target="_blank" rel="noopener noreferrer" tabIndex={active === index ? 0 : -1}>{fact.label}<span aria-hidden="true">↗</span></a></div>)}
        </div>
      </div>
      <div className={styles.progress} aria-label={`Проект в деталях ${active + 1} из ${facts.length}`}><span>0{active + 1}</span><div aria-hidden="true">{facts.map((fact, index) => <i key={fact.amount} className={index === active ? styles.activeTick : ""} />)}</div><span>0{facts.length}</span></div>
    </div>
    <div className={styles.staticList}>
      <p className={styles.eyebrow}>Проекты в деталях</p>
      {facts.map(fact => <article className={styles.staticCard} key={fact.amount}><img src={fact.image} style={{ objectPosition: fact.position }} alt={fact.alt} loading="lazy" /><div><p className={styles.staticAmount}><Amount {...fact} /></p><h2>{fact.title}</h2><p>{fact.description}</p><a href={fact.source} target="_blank" rel="noopener noreferrer">{fact.label} ↗</a></div></article>)}
    </div>
  </section>;
}
