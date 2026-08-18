import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  Home as HomeIcon,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Terminal,
  User as UserIcon,
  X,
} from "lucide-react";
import "./styles.css";
import { navItems } from "./navItems.js";
import OrbitMenu from "./OrbitMenu.jsx";

const homeImage =
  "/images/home-bg.png";
const portraitImage = "/images/about-whatsapp-cutout.png";

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
    whatsappAction: "WhatsApp",
    whatsappMessage: "Bonjour Jean Baptiste, je vous contacte depuis votre portfolio.",
    chatTitle: "Assistant IA",
    chatSubtitle: "Pose une question sur mon parcours",
    chatGreeting:
      "Bonjour ! Je suis l'assistant IA de Jean Baptiste. Pose-moi une question sur son parcours, ses competences ou ses projets.",
    chatPlaceholder: "Ecris ta question...",
    chatError: "Desole, une erreur est survenue. Reessaie dans un instant.",
    chatSend: "Envoyer",
    hubHint: "Touche ou clique une face pour explorer",
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
    whatsappAction: "WhatsApp",
    whatsappMessage: "Hello Jean Baptiste, I'm reaching out from your portfolio.",
    chatTitle: "AI Assistant",
    chatSubtitle: "Ask about my background",
    chatGreeting:
      "Hi! I'm Jean Baptiste's AI assistant. Ask me about his background, skills or projects.",
    chatPlaceholder: "Type your question...",
    chatError: "Sorry, something went wrong. Please try again in a moment.",
    chatSend: "Send",
    hubHint: "Tap or click a face to explore",
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

const NAME_TRAVEL_MS = 1700;
const BAR_FILL_MS = 2400;

function SplashScreen({ hidden, onFinish, t }) {
  // enter (off-screen) -> centering (words travel in) -> loading (bar+text
  // show, words hold center) -> exit (words leave AND bar+text disappear at
  // the same instant).
  const [phase, setPhase] = useState("enter");
  const [overlap, setOverlap] = useState(0);
  const jeanRef = useRef(null);

  // Mesure la largeur reelle de "Jean" pour que le B de Baptiste vienne
  // s'arreter pile sur son "e" (~30% de la largeur du mot), quel que soit
  // l'ecran / la taille de police (responsive).
  useLayoutEffect(() => {
    const measure = () => {
      if (jeanRef.current) setOverlap(jeanRef.current.offsetWidth * 0.7);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const toCentering = window.setTimeout(() => setPhase("centering"), 80);
    return () => window.clearTimeout(toCentering);
  }, []);

  useEffect(() => {
    if (phase !== "centering") return;
    const toLoading = window.setTimeout(() => setPhase("loading"), NAME_TRAVEL_MS);
    return () => window.clearTimeout(toLoading);
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    const toExit = window.setTimeout(() => setPhase("exit"), BAR_FILL_MS);
    return () => window.clearTimeout(toExit);
  }, [phase]);

  useEffect(() => {
    if (phase !== "exit") return;
    const toFinish = window.setTimeout(() => onFinish(), NAME_TRAVEL_MS);
    return () => window.clearTimeout(toFinish);
  }, [phase, onFinish]);

  const centered = phase === "centering" || phase === "loading";
  const barActive = phase === "loading";

  return (
    <div className={`splash ${hidden ? "splash-hidden" : ""}`}>
      <div
        className={`splash-names ${centered ? "centered" : ""}`}
        aria-hidden="true"
        style={{ "--overlap": `${overlap}px` }}
      >
        <span className="splash-name splash-name-jean" ref={jeanRef}>Jean</span>
        <span className="splash-name splash-name-baptiste">Baptiste</span>
      </div>
      <div className={`splash-loadbar ${barActive ? "active" : ""}`}>
        <i />
      </div>
      <p className={barActive ? "visible" : ""}>{t.splash}</p>
    </div>
  );
}

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
      <path d="M12.04 2C6.58 2 2.13 6.44 2.13 11.9c0 1.88.51 3.63 1.4 5.14L2 22l5.13-1.5a9.9 9.9 0 0 0 4.9 1.28h.01c5.46 0 9.9-4.44 9.9-9.9C21.94 6.44 17.5 2 12.04 2zm0 18.02h-.01a8.1 8.1 0 0 1-4.14-1.13l-.3-.18-3.05.89.9-2.98-.19-.31a8.13 8.13 0 0 1-1.24-4.4c0-4.5 3.66-8.15 8.16-8.15a8.1 8.1 0 0 1 5.76 2.39 8.09 8.09 0 0 1 2.39 5.76c0 4.5-3.66 8.15-8.28 8.11z" />
    </svg>
  );
}

function LiquidButton({ href, children, light = false, external = false }) {
  return (
    <a
      href={href}
      className={`liquid-button ${light ? "light" : ""}`}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
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

  const handleLinkClick = (event, href) => {
    setMenuOpen(false);
    onNavigate(event, href);
  };

  return (
    <header className={`nav ${menuOpen ? "menu-open" : ""}`}>
      <a className="brand" href="#home" onClick={(event) => handleLinkClick(event, "#home")}>KJB</a>
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
        {navItems.map(([key, href]) => (
          <a
            key={key}
            href={href}
            className={activeHref === href ? "active" : ""}
            onMouseEnter={(event) => moveBubble(event.currentTarget)}
            onFocus={(event) => moveBubble(event.currentTarget)}
            onClick={(event) => handleLinkClick(event, href)}
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

function Home({ t, slide = 0 }) {
  return (
    <section
      id="home"
      className="page home-page"
      style={{ "--slide": slide }}
      data-active={slide === 0}
    >
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

function About({ t, slide = 0 }) {
  return (
    <section
      id="about"
      className="page about-page"
      style={{ "--slide": slide }}
      data-active={slide === 0}
    >
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

function Realisations({ onOpenProjects, t, slide = 0 }) {
  return (
    <section
      id="realisations"
      className="page work-page"
      style={{ "--slide": slide }}
      data-active={slide === 0}
    >
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

function Resume({ t, slide = 0 }) {
  return (
    <section
      id="resume"
      className="page resume-page"
      style={{ "--slide": slide }}
      data-active={slide === 0}
    >
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

const WHATSAPP_NUMBER = "237693904197";
const whatsappLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

function Contact({ t, slide = 0 }) {
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
      icon: <WhatsAppIcon size={18} />,
      label: "WhatsApp",
      value: "+237 693 904 197",
      href: whatsappLink(t.whatsappMessage),
    },
    {
      icon: <b>GH</b>,
      label: "GitHub",
      value: "github.com/kjbrown-03",
      href: "https://github.com/kjbrown-03/",
    },
  ];

  return (
    <section
      id="contact"
      className="page contact-page"
      style={{ "--slide": slide }}
      data-active={slide === 0}
    >
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
          <LiquidButton href={whatsappLink(t.whatsappMessage)} external>
            <WhatsAppIcon size={15} /> {t.whatsappAction}
          </LiquidButton>
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

const mobileTabIcons = {
  home: HomeIcon,
  about: UserIcon,
  work: Briefcase,
  resume: FileText,
  contact: Mail,
};

function MobileTabBar({ onNavigate, activeHref, t }) {
  const tabsRef = useRef(null);
  const [bubble, setBubble] = useState({ left: 0, width: 44, ready: false });

  const moveBubble = (target) => {
    const container = tabsRef.current;
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
    const container = tabsRef.current;
    const active = container?.querySelector(`a[href="${activeHref}"]`);
    if (active) moveBubble(active);
  }, [activeHref]);

  return (
    <nav
      className={`mobile-tabbar ${bubble.ready ? "ready" : ""}`}
      aria-label="Navigation mobile"
      ref={tabsRef}
      style={{ "--bubble-left": `${bubble.left}px`, "--bubble-width": `${bubble.width}px` }}
    >
      {navItems.map(([key, href]) => {
        const Icon = mobileTabIcons[key];
        const active = activeHref === href;
        return (
          <a
            key={key}
            href={href}
            className={`mobile-tab ${active ? "active" : ""}`}
            aria-label={t.nav[key]}
            onClick={(event) => onNavigate(event, href)}
          >
            <Icon size={20} />
          </a>
        );
      })}
    </nav>
  );
}

function ChatWidget({ t }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "model", text: t.chatGreeting }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);
  const greetingRef = useRef(t.chatGreeting);

  useEffect(() => {
    if (greetingRef.current === t.chatGreeting) return;
    greetingRef.current = t.chatGreeting;
    setMessages((prev) =>
      prev.length === 1 && prev[0].role === "model" ? [{ role: "model", text: t.chatGreeting }] : prev
    );
  }, [t.chatGreeting]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: nextMessages.slice(0, -1).slice(-8),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.reply) throw new Error(data.error || "chat_failed");
      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "model", text: t.chatError, isError: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`chat-fab ${open ? "open" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? t.close : t.chatTitle}
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
      <div className={`chat-panel ${open ? "open" : ""}`} role="dialog" aria-modal="true" aria-label={t.chatTitle}>
        <div className="chat-header">
          <span className="chat-avatar">KJB</span>
          <div>
            <strong>{t.chatTitle}</strong>
            <small>{t.chatSubtitle}</small>
          </div>
        </div>
        <div className="chat-messages" ref={listRef}>
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.role} ${message.isError ? "error" : ""}`}>
              {message.text}
            </div>
          ))}
          {loading && (
            <div className="chat-bubble model chat-typing">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
        <form
          className="chat-input-row"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.chatPlaceholder}
            maxLength={800}
          />
          <button type="submit" aria-label={t.chatSend} disabled={loading || !input.trim()}>
            <Send size={17} />
          </button>
        </form>
      </div>
    </>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [hideSplash, setHideSplash] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  const [lang, setLang] = useState("fr");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showHub, setShowHub] = useState(false);
  const t = copy[lang];

  const hubCards = [
    {
      key: "home",
      href: "#home",
      title: t.nav.home,
      excerpt: `${t.heroEyebrow} — ${t.heroRole}`,
      image: homeImage,
    },
    {
      key: "about",
      href: "#about",
      title: t.nav.about,
      excerpt: t.aboutBody.length > 110 ? `${t.aboutBody.slice(0, 110).trim()}…` : t.aboutBody,
      image: portraitImage,
    },
    {
      key: "work",
      href: "#realisations",
      title: t.nav.work,
      excerpt: `${projects[0].title} — ${projects[0].subtitle}`,
      image: projects[0].image,
    },
    {
      key: "resume",
      href: "#resume",
      title: t.nav.resume,
      excerpt: skills.slice(0, 4).map(([name]) => name).join(" · "),
      image: null,
    },
    {
      key: "contact",
      href: "#contact",
      title: t.nav.contact,
      excerpt: "kaldjobbaptiste03@gmail.com · +237 693 904 197",
      image: null,
    },
  ];

  const handleSplashFinished = () => {
    setHideSplash(true);
    window.setTimeout(() => {
      setShowSplash(false);
      // Show the real homepage for a few seconds before the 3D hub takes over.
      window.setTimeout(() => setShowHub(true), 4000);
    }, 700);
  };

  // The 3D hub comes back after 30s of no interaction anywhere on the site.
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setShowHub(true), 30000);
    };
    const events = ["mousemove", "touchstart", "keydown", "click", "wheel"];
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }));
    resetTimer();
    return () => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
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

  const goToSection = (href) => {
    const idx = navItems.findIndex(([, h]) => h === href);
    if (idx !== -1) setActiveIndex(idx);
    setActiveHref(href);
  };

  const handleNavigate = (event, href) => {
    event.preventDefault();
    goToSection(href);
  };

  const handleHubSelect = (href) => {
    goToSection(href);
    setShowHub(false);
  };

  return (
    <>
      {showSplash && <SplashScreen hidden={hideSplash} onFinish={handleSplashFinished} t={t} />}
      <OrbitMenu open={showHub} cards={hubCards} onSelect={handleHubSelect} t={t} />
      <div className="cursor-aura" aria-hidden="true" />
      <Nav
          onNavigate={handleNavigate}
          activeHref={activeHref}
          lang={lang}
          onToggleLang={() => setLang((current) => (current === "fr" ? "en" : "fr"))}
          t={t}
        />
      <main>
        <Home t={t} slide={0 - activeIndex} />
        <About t={t} slide={1 - activeIndex} />
        <Realisations onOpenProjects={() => setProjectsOpen(true)} t={t} slide={2 - activeIndex} />
        <Resume t={t} slide={3 - activeIndex} />
        <Contact t={t} slide={4 - activeIndex} />
      </main>
      <MobileTabBar onNavigate={handleNavigate} activeHref={activeHref} t={t} />
      <ProjectsEnvelope open={projectsOpen} onClose={() => setProjectsOpen(false)} t={t} />
      <ChatWidget t={t} />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
