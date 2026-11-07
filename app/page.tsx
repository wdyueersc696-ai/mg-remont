"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import FooterWordmark from "../components/FooterWordmark";
import ProjectFacts from "../components/ProjectFacts";
import Journal from "../components/Journal";
import Geography from "../components/Geography";

const TELEGRAM = "https://t.me/maximgurevich";
const INSTAGRAM = "https://www.instagram.com/mg_remont/";
type Project = { id: string; title: string; type: string; area?: string; location: string; description: string; image: string; alt: string; position: string; video?: string; source: string; caption?: string };
type SelectedMedia = { kind: "video"; src: string; title: string; poster?: string; note: string } | { kind: "image"; src: string; title: string; alt: string; note: string };
const projects: Project[] = [
  { id: "house", title: "Дом, в котором\nесть место всему.", type: "Загородный дом", area: "210 м²", location: "Готовый интерьер", description: "Четыре мастер-спальни, кухня-гостиная с камином и финская сауна. Загородная жизнь в деталях.", image: "/media/house.jpg", alt: "Кухня загородного дома 210 м²", position: "50% 50%", video: "/media/house.mp4", source: "https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/" },
  { id: "apartment-concept", title: "Новый взгляд\nна жизнь в городе.", type: "Квартира", area: "73 м²", location: "Москва · ЗИЛ", description: "Объект в работе. На изображении — иллюстративная концепция интерьера, созданная с помощью ИИ.", image: "/media/apartment-concept.png", alt: "ИИ-концепция светлой кухни-гостиной в тёплых натуральных оттенках", position: "50% 60%", caption: "ИИ-концепция интерьера", source: "https://www.instagram.com/mg_remont/reel/DPoreZGiCmr/" },
  { id: "apartment34", title: "Свет. Воздух.\nВаш ритм.", type: "Готовая квартира", area: "34 м²", location: "Кухня-гостиная", description: "Готовый интерьер из обзора Максима: мягкие оттенки, дневной свет и пространство для повседневной жизни.", image: "/media/service-apartments.png", alt: "Гостиная готовой квартиры 34 м² с диваном и большим окном", position: "45% 62%", source: "https://www.instagram.com/mg_remont/reel/DO6bYvxiB1q/" },
  { id: "master-bedroom", title: "Личное\nпространство.", type: "Мастер-спальня", area: "В доме 210 м²", location: "Готовый интерьер", description: "Одна из четырёх мастер-спален: дерево, мягкий свет и спокойные фактуры.", image: "/media/house-master-bedroom.jpg", alt: "Готовая мастер-спальня с деревянными стенами и декоративным изголовьем", position: "50% 61%", source: "https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/" },
  { id: "engineering", title: "Комфорт начинается\nизнутри.", type: "Инженерия", location: "Обзор Максима", description: "Коллекторный узел и сантехническая инженерия: Максим показывает устройство системы на объекте.", image: "/media/engineering-poster.jpg", alt: "Максим рядом с коллекторным узлом и фильтрами", position: "50% 42%", video: "/media/engineering.mp4", source: "https://www.instagram.com/mg_remont/reel/DYfNP8VoqnR/" },
];
const services = [
  { title: "Квартиры", sub: "Новая квартира.\nНовая глава.", description: "Ремонт под ключ в новостройке или квартире с историей. Пространство вокруг вашего образа жизни — от первых решений до чистовой отделки.", image: "/media/service-apartments.png", alt: "Готовая гостиная квартиры: диван, стол и панорамное окно", position: "45% 60%", caption: "", label: "Квартиры в Telegram", color: "#F7FFDC" },
  { title: "Дома", sub: "Больше пространства.\nБольше возможностей.", description: "Загородный дом — со своим характером и масштабом. Комнаты, материалы и инженерные решения становятся одним целым.", image: "/media/service-houses.jpg", alt: "Фасад загородного дома с панорамным остеклением и террасой", position: "50% 60%", caption: "", label: "Дома в Telegram", color: "#D1F3F5" },
  { title: "Дизайн", sub: "Сначала идея.\nПотом — ваш интерьер.", description: "Планировка, свет, материалы и настроение будущего дома. Обсудим ваши пожелания и проект, по которому предстоит делать ремонт.", image: "/media/design-dining.png", alt: "Общий план готовой кухни-столовой: деревянная отделка, остров и обеденная зона", position: "50% 55%", caption: "Готовый интерьер", label: "Идеи в Telegram", color: "#DDD9FF" },
  { title: "Детали", sub: "То, что замечаешь.\nИ то, что чувствуешь.", description: "Стыки, геометрия, фактуры и свет. В канале Максим показывает работу изнутри: от скрытых этапов ремонта до финальных деталей интерьера.", image: "/media/details.jpg", alt: "Раскладка плитки крупным планом — работа MG Ремонт", position: "50% 50%", caption: "", label: "Посмотреть процесс", color: "#FFDDC4" },
];
const journal = [
  { tag: "Обзор дома", title: "210 м² для загородной жизни", body: "Дом с камином, сауной и четырьмя мастер-спальнями.", color: "#9C93E8", href: "https://www.instagram.com/mg_remont/reel/DPZPeHsiBTF/" },
  { tag: "Объект в работе", title: "73 м² в московском ЗИЛе", body: "Как меняется квартира: пройдите по комнатам вместе с Максимом.", color: "#B5D3AF", href: "https://www.instagram.com/mg_remont/reel/DPoreZGiCmr/" },
  { tag: "Изнутри ремонта", title: "Как всё выглядит в процессе", body: "Объекты, рабочие решения и повседневная жизнь команды в Telegram.", color: "#E9B993", href: TELEGRAM },
];
function Arrow({ diagonal = false }: { diagonal?: boolean }) { return <svg aria-hidden="true" viewBox="0 0 32 32" className={diagonal ? "arrow diagonal" : "arrow"}><path d="M5 16h21M17 7l9 9-9 9" /></svg>; }
function Action({ href = TELEGRAM, children, light = false }: { href?: string; children: React.ReactNode; light?: boolean }) { return <a className={`action ${light ? "action-light" : ""}`} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}><span>{children}</span><Arrow /></a>; }

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDialogElement>(null);
  const reel = useRef<HTMLDialogElement>(null);
  const heroVideo = useRef<HTMLVideoElement>(null);
  const modalVideo = useRef<HTMLVideoElement>(null);
  const lenis = useRef<Lenis | null>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<SelectedMedia | null>(null);
  const [hoverProject, setHoverProject] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia();
    mm.add({ desktop: "(min-width: 1000px)", mobile: "(max-width: 999px)", reduce: "(prefers-reduced-motion: reduce)", fine: "(pointer: fine)" }, context => {
      const { desktop, reduce, fine } = context.conditions!;
      // Touch keeps the browser's native scrolling, including momentum on iOS.
      const smooth = !reduce && desktop && fine ? new Lenis({ duration: 1.12, smoothWheel: true, anchors: true }) : null;
      lenis.current = smooth;
      const tick = (time: number) => smooth?.raf(time * 1000);
      smooth?.on("scroll", ScrollTrigger.update);
      if (smooth) gsap.ticker.add(tick);
      let alive = true;
      const servicePanels = gsap.utils.toArray<HTMLElement>(".service");
      const updateStack = () => {
        if (desktop || reduce) return;
        const stageHeight = root.current?.querySelector<HTMLElement>(".hero-sticky")?.clientHeight ?? window.innerHeight;
        servicePanels.forEach(panel => panel.style.setProperty("--service-top", `${Math.min(0, stageHeight - panel.offsetHeight)}px`));
      };
      updateStack();
      ScrollTrigger.addEventListener("refreshInit", updateStack);
      const refresh = () => { if (alive) ScrollTrigger.refresh(); };
      document.fonts.ready.then(refresh);
      window.addEventListener("load", refresh);
      if (reduce) { heroVideo.current?.pause(); setPlaying(false); }
      else {
      gsap.from(".hero-line", { yPercent: 120, duration: 1.2, stagger: .12, delay: .1, ease: "power3.out" });
      gsap.from(".hero-description", { opacity: 0, duration: 1, delay: .45 });
      gsap.from(".hero-kicker", { opacity: 0, y: 22, duration: 1, delay: .45 });
      gsap.from(".hero-wordmark", { yPercent: 110, duration: 1.3, ease: "power3.out", delay: .35 });
      gsap.from(".hero-rays", { scale: .65, rotate: 15, duration: 1.8, ease: "power3.inOut" });
      if (desktop) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: .75, invalidateOnRefresh: true } });
        tl.to(".hero-copy,.hero-wordmark,.hero-kicker,.scroll-note", { opacity: 0, duration: .25 }, 0)
          .to(".hero-media", { width: "100vw", height: "100svh", rotateX: 0, rotateY: 0, rotateZ: 0, borderRadius: 0, duration: 1, ease: "none" }, 0)
          .to(".hero-media-caption", { opacity: 1, duration: .3 }, .6);
        gsap.utils.toArray<HTMLElement>(".service").forEach((service, i) => {
          gsap.to(service.querySelector(".service-picture"), { scale: .8, rotate: i % 2 ? 7 : -7, borderRadius: "80px", ease: "none", scrollTrigger: { trigger: service, start: "top top", end: "bottom top", scrub: true } });
        });
      } else {
        const tl = gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: () => `+=${Math.max(1, (root.current?.querySelector<HTMLElement>(".hero")?.offsetHeight ?? 0) - (root.current?.querySelector<HTMLElement>(".hero-sticky")?.offsetHeight ?? 0))}`, scrub: .45, invalidateOnRefresh: true } });
        tl.to(".hero-copy,.hero-wordmark,.hero-kicker,.scroll-note", { autoAlpha: 0, duration: .25 }, 0)
          .to(".hero-media", { top: "50%", width: "100%", height: "100%", rotateX: 0, rotateY: 0, rotateZ: 0, borderRadius: 0, duration: 1, ease: "none" }, 0)
          .fromTo(".hero-media-caption", { autoAlpha: 0 }, { autoAlpha: 1, duration: .25 }, .7);
        gsap.utils.toArray<HTMLElement>(".service").forEach((service, i) => {
          gsap.fromTo(service.querySelector(".service-picture"), { scale: .84, rotate: i % 2 ? -6 : 6 }, { scale: 1, rotate: 0, ease: "none", scrollTrigger: { trigger: service.querySelector(".service-picture"), start: "top 95%", end: "center 35%", scrub: .5 } });
        });
      }
      const showcase = gsap.timeline({ scrollTrigger: { trigger: ".showcase", start: "top top", end: () => `+=${(root.current?.querySelector<HTMLElement>(".showcase-sticky")?.offsetHeight ?? window.innerHeight) * .72}`, scrub: .55, invalidateOnRefresh: true } });
      showcase.to(".statement", { yPercent: -100, duration: 1, ease: "none" }, 0)
        .fromTo(".project-shade", { opacity: .15 }, { opacity: 1, duration: .5 }, .35)
        .fromTo(".project-top,.project-content,.project-controls", { autoAlpha: 0, y: 32 }, { autoAlpha: 1, y: 0, duration: .4 }, .5);
      // The reference's curtain: the frame uncovers content moving behind it.
      gsap.from(".personal", { y: () => -((root.current?.querySelector<HTMLElement>(".personal-reveal")?.offsetHeight ?? 0) + window.innerHeight) * .125, ease: "none", scrollTrigger: { trigger: ".personal-reveal", start: "top bottom", end: "center center", scrub: .5, invalidateOnRefresh: true } });
      // Measure layout offsets in the stationary frame, not transformed rectangles.
      const frameOffset = (selector: string, bottom = false) => {
        const frame = root.current?.querySelector(".personal-reveal");
        let element = root.current?.querySelector<HTMLElement>(selector) ?? null;
        let offset = bottom ? element?.offsetHeight ?? 0 : 0;
        while (element && element !== frame) { offset += element.offsetTop; element = element.offsetParent as HTMLElement | null; }
        return offset;
      };
      const portrait = gsap.timeline({ scrollTrigger: { trigger: ".personal-reveal", start: () => `${frameOffset(".personal-photo")} 90%`, end: () => `${frameOffset(".personal-photo")} 15%`, scrub: .5, invalidateOnRefresh: true } });
      portrait.fromTo(".personal-photo", { clipPath: "inset(0% 0% 100% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1, ease: "none" }, 0)
        .from(".personal-photo img", { scale: 1.2, duration: 1, ease: "none" }, 0);
      const introduction = gsap.timeline({ scrollTrigger: { trigger: ".personal-reveal", start: () => `${frameOffset(".personal-copy")} 88%`, end: () => `${frameOffset(".personal-copy")} 28%`, scrub: .5 } });
      introduction.from(".personal-copy .eyebrow", { opacity: 0, y: 20, duration: .35 }, 0)
        .from(".personal-line", { yPercent: 115, duration: .7, stagger: .13, ease: "none" }, .05);
      gsap.from(".personal-description,.personal-socials", { opacity: 0, y: 28, stagger: .12, ease: "none", scrollTrigger: { trigger: ".personal-reveal", start: () => `${frameOffset(".personal-description")} 94%`, end: () => `${frameOffset(".personal-description", true)} 82%`, scrub: .5 } });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach(el => { gsap.from(el, { y: 45, opacity: 0, duration: 1.15, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%", once: true } }); });
      }
      return () => { alive = false; window.removeEventListener("load", refresh); ScrollTrigger.removeEventListener("refreshInit", updateStack); servicePanels.forEach(panel => panel.style.removeProperty("--service-top")); gsap.ticker.remove(tick); smooth?.destroy(); lenis.current = null; };
    }, root);
    return () => mm.revert();
  }, []);
  useEffect(() => {
    if (menuOpen || selectedMedia) { lenis.current?.stop(); document.body.style.overflow = "hidden"; }
    else { lenis.current?.start(); document.body.style.overflow = ""; }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, selectedMedia]);
  const openMenu = () => { menu.current?.showModal(); setMenuOpen(true); };
  const closeMenu = () => { menu.current?.close(); setMenuOpen(false); };
  const navigate = (id: string) => { closeMenu(); requestAnimationFrame(() => { lenis.current?.start(); if (lenis.current) lenis.current.scrollTo(id, { duration: 1.3 }); else document.querySelector(id)?.scrollIntoView({ behavior: "auto" }); }); };
  const openVideo = (title: string, src: string, poster?: string) => { setSelectedMedia({ kind: "video", title, src, poster, note: "Обзор из Instagram Максима Гуревича" }); reel.current?.showModal(); heroVideo.current?.pause(); };
  const openProject = (project: Project) => {
    if (project.video) { openVideo(`${project.type}${project.area ? ` · ${project.area}` : ""}`, project.video, project.image); return; }
    setSelectedMedia({ kind: "image", src: project.image, title: `${project.type}${project.area ? ` · ${project.area}` : ""}`, alt: project.alt, note: project.caption ? "Концепция интерьера создана с помощью ИИ. Это иллюстрация, а не фотография готового объекта." : "Кадр из публикации Максима Гуревича" });
    reel.current?.showModal(); heroVideo.current?.pause();
  };
  const closeMedia = () => { modalVideo.current?.pause(); reel.current?.close(); setSelectedMedia(null); if (playing) heroVideo.current?.play().catch(() => {}); };
  const changeProject = (step: number) => setActive(value => (value + step + projects.length) % projects.length);

  return <main ref={root}>
    <a className="skip-link" href="#projects">Перейти к проектам</a>
    <a className="brand" href="#top" aria-label="MG Ремонт — на главную">MG РЕМОНТ</a>
    <header className="header">
      <button className="header-tab menu-toggle" onClick={openMenu} aria-label="Открыть меню" aria-haspopup="dialog" aria-expanded={menuOpen}><span className="hamburger"><i /><i /></span><span className="menu-label">Меню</span></button>
      <a className="header-tab header-cta" href="#contact">Есть проект?<Arrow diagonal /></a>
    </header>
    <section className="hero" id="top" aria-label="Ремонт квартир и домов под ключ"><div className="hero-sticky">
      <div className="hero-rays" aria-hidden="true"><div className="ray-top" /><div className="ray-bottom" /></div>
      <span className="hero-kicker">Максим Гуревич · Москва и область</span>
      <div className="hero-copy hero-heading"><h1><span className="line-mask"><span className="hero-line">Вам захочется</span></span><span className="line-mask"><span className="hero-line">остаться дома.</span></span></h1></div>
      <div className="hero-copy hero-description"><p>Ремонт квартир и загородных домов под ключ. От первой идеи до места, которое вы называете своим.</p><a href="#projects" className="text-link">Посмотреть работы <span>↘</span></a></div>
      <div className="hero-wordmark" aria-hidden="true">MG РЕМОНТ</div>
      <div className="hero-media"><video ref={heroVideo} className="hero-video" src="/media/hero.mp4" poster="/media/hero-first-frame.jpg" autoPlay loop muted playsInline preload="auto" aria-label="Полный обзор дома 210 м² — видео Максима с начала ролика" /><button className="reel-play" aria-label="Смотреть полный обзор дома" onClick={() => openVideo("Дом 210 м² — обзор Максима", "/media/house.mp4")}><svg viewBox="0 0 30 30" aria-hidden="true"><path d="M11 7v16l13-8z" /></svg><span>Смотреть полностью со звуком</span></button><div className="hero-media-caption"><span>Дом. В деталях.</span><div><button onClick={() => { if (playing) heroVideo.current?.pause(); else heroVideo.current?.play().catch(() => {}); setPlaying(!playing); }} aria-label={playing ? "Приостановить фоновое видео" : "Воспроизвести фоновое видео"}>{playing ? "Пауза Ⅱ" : "Продолжить ▷"}</button><button onClick={() => openVideo("Дом 210 м² — обзор со звуком", "/media/house.mp4")}>Обзор со звуком ↗</button></div></div></div>
      <a className="scroll-note" href="#about"><span>Листайте — дальше больше</span><span>↓</span></a>
    </div></section>
    <div className="showcase" id="about"><div className="projects-anchor" id="projects" /><div className="showcase-sticky">
    <section className="statement" aria-label="Пространство для вашей жизни"><h2 className="sr-only">Пространство для вашей жизни. Продуманное. Осязаемое. Своё.</h2><svg className="statement-cover" aria-hidden="true" width="100%" height="100%"><defs><mask id="statement-cutout" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%"><rect width="100%" height="100%" fill="white"/><text className="statement-mask-text" fill="black" textAnchor="middle" x="50%" y="30%"><tspan x="50%">Пространство</tspan><tspan x="50%" dy=".98em">для вашей жизни.</tspan><tspan x="50%" dy=".98em">Продуманное.</tspan><tspan x="50%" dy=".98em">Осязаемое. Своё.</tspan></text></mask></defs><rect width="100%" height="100%" fill="#e0ff98" mask="url(#statement-cutout)"/></svg><p className="eyebrow">MG Ремонт</p><div className="statement-bottom"><span className="serif">Сначала — вы.<br />Потом — всё остальное.</span><p>У каждого дома своя история. Мы помогаем вашей обрести форму: в планировке, материалах, свете и деталях.</p></div></section>
    <section className="projects" aria-label="Избранные проекты" onMouseMove={e => { if (cursor.current) { const rect = e.currentTarget.getBoundingClientRect(); cursor.current.style.left = `${e.clientX - rect.left}px`; cursor.current.style.top = `${e.clientY - rect.top}px`; } }} onMouseEnter={() => setHoverProject(true)} onMouseLeave={() => setHoverProject(false)}>
      <div className="project-images" onClick={() => changeProject(1)} aria-hidden="true">{projects.map((p, i) => <img key={p.id} className={i === active ? "project-image active" : "project-image"} src={p.image} style={{ objectPosition: p.position }} alt="" loading="lazy" />)}</div><div className="project-shade" /><div className={`project-cursor ${hoverProject ? "visible" : ""}`} ref={cursor} aria-hidden="true">Далее <Arrow /></div>
      <div className="project-top"><div><span>Избранные проекты</span>{projects[active].caption && <span className="project-image-caption">{projects[active].caption}</span>}</div><span>0{active + 1} / 0{projects.length}</span></div><div className="project-content"><span className="project-eyebrow serif">Сделано<br />{" "}для жизни.</span><h2 key={projects[active].id}>{projects[active].title.split("\n").map((line, i) => <span className="line-mask" key={i}><span>{line}</span></span>)}</h2><div className="project-meta"><span className="serif">{projects[active].type}{projects[active].area && <small>{projects[active].area}</small>}</span><span className="serif">{projects[active].location}</span><p>{projects[active].description}</p></div></div><div className="project-controls"><button className="action action-light" onClick={() => openProject(projects[active])}><span>{projects[active].video ? "Смотреть видео" : "Смотреть фото"}</span><Arrow /></button><div className="slide-buttons"><button onClick={() => changeProject(-1)} aria-label="Предыдущий проект">←</button>{projects.map((p, i) => <button key={p.id} className={`slide-dot ${active === i ? "active" : ""}`} aria-label={`Проект ${i + 1}: ${p.type}${p.area ? ` ${p.area}` : ""}`} aria-pressed={active === i} onClick={() => setActive(i)} />)}<button onClick={() => changeProject(1)} aria-label="Следующий проект">→</button></div></div>
    </section>
    </div></div>
    <section className="approach"><p className="serif reveal">У вашего дома<br />много составляющих.</p><div className="approach-list">{["Ваши привычки.", "Ваш ритм.", "Ваши идеи.", "Наше ремесло."].map(t => <p className="reveal" key={t}>{t}</p>)}</div><span className="approach-note">Вместе они становятся интерьером.</span></section>
    <div className="services" id="services">{services.map((service, i) => <section className="service" key={service.title} style={{ backgroundColor: service.color }}><h2 className="reveal">{service.title}</h2><span className="service-number" aria-hidden="true">0{i + 1}</span><div className="service-text"><h3 className="serif reveal">{service.sub.split("\n").map((t, n) => <span key={n}>{t}</span>)}</h3><p className="reveal">{service.description}</p><div className="reveal"><Action>{service.label}</Action></div></div><div className="service-picture"><img src={service.image} alt={service.alt} style={{ objectPosition: service.position }} loading="lazy" />{service.caption && <span className="service-image-caption">{service.caption}</span>}</div></section>)}</div>
    <section className="personal-reveal" id="maxim"><div className="personal"><div className="personal-photo"><img src="/media/maxim-blue.png" alt="Максим Гуревич с образцами плитки в синем интерьере" loading="lazy" /><span>Максим Гуревич</span></div><div className="personal-copy"><p className="eyebrow">Человек за проектом</p><h2><span className="line-mask"><span className="personal-line">Давайте</span></span><span className="line-mask"><span className="personal-line">знакомиться.</span></span><span className="line-mask"><em className="personal-line serif">Я Максим.</em></span></h2><p className="personal-description">Занимаюсь ремонтом квартир и загородных домов под ключ в Москве и области. В своих соцсетях показываю объекты, процесс работы и то, из чего складывается результат.</p><div className="personal-socials"><Action>Telegram</Action><Action href={INSTAGRAM}>Instagram</Action></div></div></div></section>
    <ProjectFacts />
    <Geography />
    <Journal items={journal} />
    <section className="contact" id="contact"><img className="contact-bg" src="/media/house.jpg" alt="" loading="lazy" /><div className="contact-overlay" /><a className="contact-half" href={TELEGRAM} target="_blank" rel="noopener noreferrer"><span className="eyebrow">Есть идея для своего дома?</span><h2>Обсудим<span>↗</span></h2><p>Начните со знакомства: объекты, процесс и подход Максима — в его Telegram-канале.</p><span className="contact-button">Перейти в Telegram <Arrow /></span></a><a className="contact-half" href="https://www.instagram.com/mg_remont/" target="_blank" rel="noopener noreferrer"><span className="eyebrow">Хотите познакомиться ближе?</span><h2>Смотрите<span>↗</span></h2><p>Готовые интерьеры и ремонт в процессе — в Instagram MG Ремонт.</p><span className="contact-button">Открыть Instagram <Arrow /></span></a></section>
    <footer><div className="footer-top"><h2>Вам захочется<br /><span className="serif">остаться дома.</span></h2><div><span className="eyebrow">На связи</span><a href={TELEGRAM} target="_blank" rel="noopener noreferrer">Telegram ↗</a><a href="https://www.instagram.com/mg_remont/" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div><div><span className="eyebrow">Исследуйте</span><a href="#projects">Проекты</a><a href="#services">Направления</a><a href="#maxim">О Максиме</a><a href="#journal">За кадром</a></div></div><div className="footer-info"><p>Максим Гуревич<br />Москва и Московская область</p><p>Ремонт квартир и загородных домов под ключ</p><a href="#top">Наверх ↑</a></div><FooterWordmark /><div className="footer-bottom"><span>© MG Ремонт, 2026</span><span>Сделано для жизни.</span></div></footer>
    <dialog className="menu-dialog" ref={menu} aria-label="Меню сайта" onCancel={closeMenu} onClick={e => { if (e.target === e.currentTarget) closeMenu(); }}><div className="menu-wedge" aria-hidden="true" /><button className="header-tab menu-close" onClick={closeMenu} aria-label="Закрыть меню"><span>×</span>Закрыть</button><nav aria-label="Основная навигация">{[["Главная", "#top"], ["Проекты", "#projects"], ["Направления", "#services"], ["Максим", "#maxim"], ["За кадром", "#journal"], ["Контакт", "#contact"]].map(([label, href]) => <button key={href} onClick={() => navigate(href)}>{label}<span>↗</span></button>)}</nav><p className="menu-foot">MG РЕМОНТ · МОСКВА</p></dialog>
    <dialog className="video-dialog" ref={reel} aria-label={selectedMedia?.kind === "image" ? "Фотография проекта" : "Видео проекта"} onCancel={closeMedia} onClick={e => { if (e.target === e.currentTarget) closeMedia(); }}><div className="video-dialog-header"><span>{selectedMedia?.title}</span><button onClick={closeMedia} aria-label="Закрыть просмотр">Закрыть ×</button></div>{selectedMedia?.kind === "video" && <video key={selectedMedia.src} ref={modalVideo} src={selectedMedia.src} poster={selectedMedia.poster} controls autoPlay playsInline preload="metadata" />}{selectedMedia?.kind === "image" && <img className="project-full-photo" src={selectedMedia.src} alt={selectedMedia.alt} />}<p>{selectedMedia?.note}</p></dialog>
  </main>;
}

