import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import "./styles.css";

const homeImage =
  "/images/home-bg.png";
const portraitImage = "/images/about-whatsapp-cutout.png";

const navItems = [
  ["home", "#home", "flip"],
  ["about", "#about", "tilt"],
  ["work", "#realisations", "lift"],
  ["resume", "#resume", "turn"],
  ["contact", "#contact", "store"],
];

const copy = {
  fr: {
    langLabel: "EN",
    nav: {
      home: "Accueil",
      about: "A propos",
      work: "Realisations",
      resume: "Parcours",
      contact: "Contact",
    },
    splash: "Chargement du portfolio",
    heroEyebrow: "Full Stack Developer",
    heroRole: "Orienté cybersécurité",
    resumeButton: "Resume",
    workButton: "Realisations",
    aboutEyebrow: "About",
    aboutTitle: "Developpeur Full Stack.",
    aboutBody:
      "Développeur Full Stack, je conçois des solutions digitales sur-mesure pour des entreprises africaines à travers KJTECH Digital Solutions. Mon expertise couvre le développement d'applications web modernes (React, Node.js, Spring Boot) ainsi que l'intégration de solutions de paiement locales, avec une attention particulière portée à la sécurité des systèmes développés.",
    aboutTags: ["KJTECH Digital Solutions", "Bilingue", "Orienté cybersécurité"],
    portfolioEyebrow: "Portfolio",
    workTitle: "Realisations",
    allProjects: "Tous mes projets",
    vercelProjects: "Projets Vercel",
    viewMore: "Voir Plus",
    close: "Fermer",
    skillsTitle: "Software Skills",
    formationTitle: "Formation",
    whatIDoTitle: "Ce que je fais",
    contactTitle: "Discutons de votre prochain projet.",
    contactText:
      "Disponible pour concevoir des plateformes web, dashboards, applications metier et integrations backend. Voici mes contacts directs.",
    emailAction: "Envoyer un mail",
    callAction: "Appeler",
  },
  en: {
    langLabel: "FR",
    nav: {
      home: "Home",
      about: "About",
      work: "Projects",
      resume: "Resume",
      contact: "Contact",
    },
    splash: "Loading portfolio",
    heroEyebrow: "Full Stack Developer",
    heroRole: "Cybersecurity oriented",
    resumeButton: "Resume",
    workButton: "Projects",
    aboutEyebrow: "About",
    aboutTitle: "Full Stack Developer.",
    aboutBody:
      "Full Stack Developer, I design tailor-made digital solutions for African companies through KJTECH Digital Solutions. My expertise covers modern web application development (React, Node.js, Spring Boot) and the integration of local payment solutions, with particular attention to the security of the systems I build.",
    aboutTags: ["KJTECH Digital Solutions", "Bilingual", "Cybersecurity oriented"],
    portfolioEyebrow: "Portfolio",
    workTitle: "Projects",
    allProjects: "All projects",
    vercelProjects: "Vercel Projects",
    viewMore: "View More",
    close: "Close",
    skillsTitle: "Software Skills",
    formationTitle: "Education",
    whatIDoTitle: "What I do",
    contactTitle: "Let's discuss your next project.",
    contactText:
      "Available to design web platforms, dashboards, business applications and backend integrations. Here are my direct contacts.",
    emailAction: "Send email",
    callAction: "Call",
  },
};

const projects = [
  {
    title: "ImmoHome",
    subtitle: "Application de gestion immobiliere",
    link: "https://immohome.vercel.app/",
    image: "/images/project-immohome-real.png",
    previewStatus: "Capture reelle",
    stack: "React.js / JavaScript / API REST / CSS",
    text: "Administration des biens, clients et operations immobilieres dans une interface moderne, claire et rapide.",
  },
  {
    title: "KH Version 2",
    subtitle: "Application de gestion hoteliere",
    link: "https://kh-version2-nine.vercel.app/",
    image: "",
    previewMode: "live",
    previewStatus: "Apercu live Vercel",
    stack: "React.js / Node.js / JavaScript / MySQL",
    text: "Gestion des chambres, reservations, clients et paiements avec une experience responsive pensee pour l'hotellerie.",
  },
  {
    title: "Centre Gestion",
    subtitle: "Plateforme de centre de sante",
    link: "https://centre-gestion-git-main-kaldjob-jean-baptistes-projects.vercel.app/",
    image: "",
    previewMode: "protected",
    previewStatus: "Déploiement Vercel protégé",
    stack: "React.js / TypeScript / Node.js / Supabase / PWA",
    text: "Suivi des patients, rendez-vous, dossiers medicaux, utilisateurs et droits d'acces par role.",
  },
];

const allProjects = projects;

const skills = [
  ["React.js", 92],
  ["JavaScript", 88],
  ["TypeScript", 80],
  ["Node.js", 84],
  ["Spring Boot", 78],
  ["API REST", 88],
  ["MySQL", 82],
  ["Supabase", 80],
];

const glyphDots = [
  [0, -62], [16, -58], [32, -50], [48, -36], [58, -18], [62, 0], [58, 18], [48, 36], [32, 50], [16, 58],
  [0, 62], [-16, 58], [-32, 50], [-48, 36], [-58, 18], [-62, 0], [-58, -18], [-48, -36], [-32, -50], [-16, -58],
  [-44, -34], [-44, -22], [-44, -10], [-44, 2], [-44, 14], [-44, 26], [-44, 38],
  [-32, -6], [-24, -18], [-16, -30], [-24, 8], [-16, 22], [-8, 36],
  [6, -34], [18, -34], [30, -34], [30, -22], [30, -10], [30, 2], [30, 14], [24, 26], [12, 38], [0, 38],
  [46, -34], [46, -22], [46, -10], [46, 2], [46, 14], [46, 26], [46, 38],
  [58, -34], [70, -30], [74, -18], [70, -6], [58, -2],
  [62, 2], [76, 8], [80, 22], [76, 34], [62, 38],
  [-52, -34], [-52, 38], [-36, -34], [-28, 34], [-4, -34], [10, -34],
  [16, 38], [34, 38], [52, -2], [68, -2], [52, 38], [68, 38],
];

const splashParticles = Array.from({ length: 84 }, (_, index) => {
  const dot = glyphDots[index % glyphDots.length];
  const side = index % 4;
  const spread = ((index * 37) % 100) - 50;
  const from =
    side === 0
      ? [-54, spread]
      : side === 1
        ? [54, spread]
        : side === 2
          ? [spread, -54]
          : [spread, 54];

  return {
    fromX: `${from[0]}vw`,
    fromY: `${from[1]}vh`,
    toX: `${dot[0]}px`,
    toY: `${dot[1]}px`,
    delay: `${(index % 28) * 0.08}s`,
    size: `${2 + (index % 4)}px`,
  };
});

function SplashScreen({ hidden, t }) {
  return (
    <div className={`splash ${hidden ? "splash-hidden" : ""}`}>
      <div className="splash-particles" aria-hidden="true">
        {splashParticles.map((particle, index) => (
          <span
            key={index}
            style={{
              "--from-x": particle.fromX,
              "--from-y": particle.fromY,
              "--to-x": particle.toX,
              "--to-y": particle.toY,
              "--particle-delay": particle.delay,
              "--particle-size": particle.size,
            }}
          />
        ))}
      </div>
      <div className="splash-circle">
        <span>KJB</span>
      </div>
      <div className="splash-line">
        <i />
      </div>
      <p>{t.splash}</p>
    </div>
  );
}

function LiquidButton({ href, children, light = false }) {
  return (
    <a href={href} className={`liquid-button ${light ? "light" : ""}`}>
      <span className="shine" />
      <span>{children}</span>
    </a>
  );
}

function ProjectCard({ project, index = 0, envelope = false, t }) {
  const domain = project.link.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <article
      className={`project-card ${envelope ? "from-envelope" : ""}`}
      style={{ "--delay": `${index * 95}ms` }}
    >
      <a className="project-image" href={project.link} target="_blank" rel="noreferrer">
        {project.image ? (
          <img src={project.image} alt={`Capture reelle du projet ${project.title}`} />
        ) : project.previewMode === "live" ? (
          <LiveProjectPreview project={project} domain={domain} />
        ) : project.previewMode === "protected" ? (
          <span className="project-protected-preview">
            <span className="protected-lock">Vercel SSO</span>
            <strong>{project.title}</strong>
            <small>{project.previewStatus}</small>
            <em>{domain}</em>
          </span>
        ) : (
          <span className="project-browser-fallback">
            <span className="browser-top">
              <i />
              <i />
              <i />
              <b>{domain}</b>
            </span>
            <strong>{project.title}</strong>
            <small>{project.previewStatus}</small>
          </span>
        )}
      </a>
      <div className="project-copy">
        <p>{project.subtitle}</p>
        <h3>{project.title}</h3>
        <span>{project.stack}</span>
        <p>{project.text}</p>
        <LiquidButton href={project.link}>
          {t.viewMore} <ArrowUpRight size={16} />
        </LiquidButton>
      </div>
    </article>
  );
}

function LiveProjectPreview({ project, domain }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <span className="project-live-preview">
      <iframe
        src={project.link}
        title={`Apercu live ${project.title}`}
        loading="eager"
        referrerPolicy="no-referrer"
        allow="fullscreen"
        onLoad={() => setLoaded(true)}
      />
      {!loaded && <span className="preview-loader" />}
      <span className="live-preview-label">{domain}</span>
    </span>
  );
}

function Nav({ onNavigate, activeHref, lang, onToggleLang, t }) {
  const linksRef = useRef(null);
  const [bubble, setBubble] = useState({ left: 0, width: 78, ready: false });
  const [menuOpen, setMenuOpen] = useState(false);

  const moveBubble = (target) => {
    const container = linksRef.current;
    if (!container || !target) return;
    const parent = container.getBoundingClientRect();
    const item = target.getBoundingClientRect();
    setBubble({
      left: item.left - parent.left,
      width: item.width,
      ready: true,
    });
  };

  useEffect(() => {
    const container = linksRef.current;
    const active = container?.querySelector(`a[href="${activeHref}"]`);
    if (active) moveBubble(active);
  }, [activeHref]);

  const handleLinkClick = (event, href, motion) => {
    setMenuOpen(false);
    onNavigate(event, href, motion);
  };

  return (
    <header className={`nav ${menuOpen ? "menu-open" : ""}`}>
      <a className="brand" href="#home" onClick={(event) => handleLinkClick(event, "#home", "flip")}>KJB</a>
      <button
        className="hamburger"
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>
      <nav
        className={`nav-links ${bubble.ready ? "ready" : ""} ${menuOpen ? "open" : ""}`}
        aria-label="Navigation principale"
        ref={linksRef}
        style={{ "--bubble-left": `${bubble.left}px`, "--bubble-width": `${bubble.width}px` }}
        onMouseLeave={() => {
          const active = linksRef.current?.querySelector(`a[href="${activeHref}"]`);
          if (active) moveBubble(active);
        }}
      >
        {navItems.map(([key, href, motion]) => (
          <a
            key={key}
            href={href}
            className={activeHref === href ? "active" : ""}
            onMouseEnter={(event) => moveBubble(event.currentTarget)}
            onFocus={(event) => moveBubble(event.currentTarget)}
            onClick={(event) => handleLinkClick(event, href, motion)}
          >
            {t.nav[key]}
          </a>
        ))}
      </nav>
      <button className="lang-toggle" type="button" onClick={onToggleLang} aria-label="Changer la langue">
        {t.langLabel}
      </button>
      <a className="phone-link" href="tel:+237693904197">
        <Phone size={14} />
        <span>693 904 197</span>
      </a>
    </header>
  );
}

function Home({ t }) {
  return (
    <section id="home" className="page home-page">
      <img className="home-photo" src={homeImage} alt="Bureau de travail sombre avec ordinateur" />
      <div className="home-content">
        <p className="eyebrow">{t.heroEyebrow}</p>
        <h1>
          <small>Jean Baptiste</small>
          <span>KALDJOB</span>
        </h1>
        <p className="home-role">{t.heroRole}</p>
        <div className="home-actions">
          <LiquidButton href="#resume">{t.resumeButton}</LiquidButton>
          <LiquidButton href="#realisations">{t.workButton}</LiquidButton>
        </div>
      </div>
      <div className="home-socials">
        <a href="mailto:kaldjobbaptiste03@gmail.com" aria-label="Email"><Mail size={17} /></a>
        <a href="https://github.com/kjbrown-03/" target="_blank" rel="noreferrer" aria-label="GitHub">GH</a>
        <a href="#contact" aria-label="Contact"><MapPin size={17} /></a>
      </div>
    </section>
  );
}

function About({ t }) {
  return (
    <section id="about" className="page about-page">
      <div className="about-content">
        <div className="about-text">
          <p className="eyebrow dark">{t.aboutEyebrow}</p>
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutBody}</p>
          <div className="about-meta">
            {t.aboutTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <div className="portrait-frame">
          <img src={portraitImage} alt="Portrait de Kaldjob Jean Baptiste" />
        </div>
      </div>
    </section>
  );
}

function Realisations({ onOpenProjects, t }) {
  return (
    <section id="realisations" className="page work-page">
      <div className="section-title">
        <p className="eyebrow">{t.portfolioEyebrow}</p>
        <h2>{t.workTitle}</h2>
      </div>
      <div className="project-row">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.title} t={t} />
        ))}
      </div>
      <div className="all-projects-action">
        <button type="button" className="liquid-button" onClick={onOpenProjects}>
          <span className="shine" />
          <span>{t.allProjects} <ArrowUpRight size={16} /></span>
        </button>
      </div>
    </section>
  );
}

function Resume({ t }) {
  return (
    <section id="resume" className="page resume-page">
      <div className="resume-grid">
        <div>
          <h2>{t.skillsTitle}</h2>
          <div className="skills">
            {skills.map(([name, value]) => (
              <div className="skill" key={name}>
                <span>{name}</span>
                <div><i style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2>{t.formationTitle}</h2>
          <div className="timeline">
            <article>
              <strong>Keyce Informatique et Intelligence Artificielle</strong>
              <span>2024 - Actuel | Douala</span>
              <p>Genie Logiciel - Developpement Full Stack, orientation Cybersecurite.</p>
            </article>
            <article>
              <strong>GCE Advanced Level</strong>
              <span>Serie Scientifique</span>
              <p>Mention Tres Bien.</p>
            </article>
          </div>
        </div>
        <div>
          <h2>{t.whatIDoTitle}</h2>
          <div className="abilities">
            <span><Terminal size={16} /> Applications React</span>
            <span><ShieldCheck size={16} /> API REST & JWT</span>
            <span><Terminal size={16} /> GitHub, Maven, Postman</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({ t }) {
  const contacts = [
    {
      icon: <Mail size={18} />,
      label: "Email",
      value: "kaldjobbaptiste03@gmail.com",
      href: "mailto:kaldjobbaptiste03@gmail.com",
    },
    {
      icon: <Phone size={18} />,
      label: "Telephone",
      value: "693 904 197",
      href: "tel:+237693904197",
    },
    {
      icon: <b>GH</b>,
      label: "GitHub",
      value: "github.com/kjbrown-03",
      href: "https://github.com/kjbrown-03/",
    },
  ];

  return (
    <section id="contact" className="page contact-page">
      <div className="contact-box">
        <p className="eyebrow">Contact</p>
        <h2>{t.contactTitle}</h2>
        <p>{t.contactText}</p>
        <div className="contact-grid">
          {contacts.map((contact) => (
            <a href={contact.href} className="contact-card" key={contact.label} target={contact.href.startsWith("http") ? "_blank" : undefined} rel={contact.href.startsWith("http") ? "noreferrer" : undefined}>
              <span>{contact.icon}</span>
              <small>{contact.label}</small>
              <strong>{contact.value}</strong>
            </a>
          ))}
        </div>
        <div className="contact-actions">
          <LiquidButton href="mailto:kaldjobbaptiste03@gmail.com">{t.emailAction}</LiquidButton>
          <LiquidButton href="tel:+237693904197">{t.callAction}</LiquidButton>
        </div>
      </div>
    </section>
  );
}

function ProjectsEnvelope({ open, onClose, t }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!open) {
      setRevealed(false);
      return;
    }
    const timer = window.setTimeout(() => setRevealed(true), 1800);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div className={`projects-envelope ${open ? "open" : ""} ${revealed ? "revealed" : ""}`} aria-hidden={!open}>
      <div className="envelope-backdrop" onClick={onClose} />
      <div className="envelope-panel" role="dialog" aria-modal="true" aria-label="Tous mes projets">
        <button type="button" className="envelope-close" onClick={onClose}>{t.close}</button>
        <div className="envelope-lid" />
        <div className="envelope-front" />
        <div className="envelope-content">
          <p className="eyebrow">{t.allProjects}</p>
          <h2>{t.vercelProjects}</h2>
          <div className="all-projects-grid">
            {allProjects.map((project, index) => (
              <ProjectCard project={project} index={index} envelope key={`${project.title}-${index}`} t={t} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [hideSplash, setHideSplash] = useState(false);
  const [transition, setTransition] = useState("");
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  const [lang, setLang] = useState("fr");
  const t = copy[lang];
  const activeSectionRef = useRef("home");
  const firstScrollObserveRef = useRef(true);
  const clickTransitionUntilRef = useRef(0);
  const scrollTransitionUntilRef = useRef(0);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setHideSplash(true), 9800);
    const removeTimer = window.setTimeout(() => setShowSplash(false), 10700);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  useEffect(() => {
    // Désactiver le parallaxe sur les appareils tactiles
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    let frame = 0;
    const handleMouseMove = (event) => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const x = event.clientX;
        const y = event.clientY;
        const px = (x / window.innerWidth - 0.5).toFixed(3);
        const py = (y / window.innerHeight - 0.5).toFixed(3);

        document.documentElement.style.setProperty("--cursor-x", `${x}px`);
        document.documentElement.style.setProperty("--cursor-y", `${y}px`);
        document.documentElement.style.setProperty("--tilt-x", `${Number(py) * -8}deg`);
        document.documentElement.style.setProperty("--tilt-y", `${Number(px) * 10}deg`);
        document.documentElement.style.setProperty("--parallax-x", `${Number(px) * 18}px`);
        document.documentElement.style.setProperty("--parallax-y", `${Number(py) * 14}px`);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const playTransition = (motion, duration = 1850) => {
    setTransition("");
    window.requestAnimationFrame(() => setTransition(motion));
    window.setTimeout(() => setTransition(""), duration);
  };

  useEffect(() => {
    const pages = [...document.querySelectorAll(".page")];
    const motions = ["flip", "tilt", "lift", "turn", "store"];
    pages.forEach((page, index) => {
      page.dataset.motion = motions[index] || "lift";
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            const sectionId = entry.target.id;
            const motion = entry.target.dataset.motion || "lift";

            if (firstScrollObserveRef.current) {
              activeSectionRef.current = sectionId;
              setActiveHref(`#${sectionId}`);
              firstScrollObserveRef.current = false;
              return;
            }

            if (
              sectionId !== activeSectionRef.current &&
              Date.now() > clickTransitionUntilRef.current &&
              Date.now() > scrollTransitionUntilRef.current
            ) {
              activeSectionRef.current = sectionId;
              setActiveHref(`#${sectionId}`);
              
              // Ne pas jouer la transition 3D sur mobile/tablette
              const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 900;
              if (!isTouch) {
                scrollTransitionUntilRef.current = Date.now() + 2050;
                playTransition(motion);
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    pages.forEach((page) => observer.observe(page));
    return () => observer.disconnect();
  }, []);

  const handleNavigate = (event, href, motion) => {
    event.preventDefault();
    const lockDuration = href === "#contact" ? 3200 : 2200;
    clickTransitionUntilRef.current = Date.now() + lockDuration;
    scrollTransitionUntilRef.current = Date.now() + lockDuration;
    activeSectionRef.current = href.replace("#", "");
    setActiveHref(href);
    
    const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 900;
    if (!isTouch) {
      playTransition(motion);
    }
    
    window.setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, isTouch ? 50 : 620);
  };

  // Wheel hijack supprimé : scroll natif partout (desktop + mobile)

  return (
    <>
      {showSplash && <SplashScreen hidden={hideSplash} t={t} />}
      <div className="cursor-aura" aria-hidden="true" />
      <div className={`transition-stage ${transition ? `active ${transition}` : ""}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <Nav
          onNavigate={handleNavigate}
          activeHref={activeHref}
          lang={lang}
          onToggleLang={() => setLang((current) => (current === "fr" ? "en" : "fr"))}
          t={t}
        />
      <main className={transition ? `scene-shift ${transition}` : ""}>
        <Home t={t} />
        <About t={t} />
        <Realisations onOpenProjects={() => setProjectsOpen(true)} t={t} />
        <Resume t={t} />
        <Contact t={t} />
      </main>
      <ProjectsEnvelope open={projectsOpen} onClose={() => setProjectsOpen(false)} t={t} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
