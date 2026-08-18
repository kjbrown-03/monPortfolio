import { useEffect, useRef, useState } from "react";

const ANGLE_STEP = 38; // degrees between adjacent cards — keeps the whole fan on-screen
const AUTO_AMPLITUDE = 20; // degrees, how far the fan sways each side of centre
const AUTO_SPEED = 0.00026; // radians per ms for the sway
const LERP = 0.035; // smoothing toward the target rotation each frame
const DRAG_SENSITIVITY = 0.4; // degrees per px dragged
const RESUME_AUTO_DELAY = 2500; // ms after releasing a drag before it sways again

export default function OrbitMenu({ open, cards, onSelect, t }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const autoRef = useRef(true);
  const dragRef = useRef({ active: false, startX: 0, startRotation: 0, moved: 0 });
  const resumeTimerRef = useRef(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), 600);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Gentle continuous sway (never a full spin) so every card stays in view
  // at all times while the fan still visibly moves.
  useEffect(() => {
    if (!mounted) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let frameId;
    const start = performance.now();
    const tick = (now) => {
      if (!dragRef.current.active && autoRef.current && !reducedMotion) {
        const target = Math.sin((now - start) * AUTO_SPEED) * AUTO_AMPLITUDE;
        setRotation((prev) => prev + (target - prev) * LERP);
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [mounted]);

  useEffect(() => () => window.clearTimeout(resumeTimerRef.current), []);

  const handlePointerDown = (event) => {
    dragRef.current = { active: true, startX: event.clientX, startRotation: rotation, moved: 0 };
    autoRef.current = false;
    window.clearTimeout(resumeTimerRef.current);
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.startX;
    dragRef.current.moved = Math.max(dragRef.current.moved, Math.abs(dx));
    setRotation(dragRef.current.startRotation + dx * DRAG_SENSITIVITY);
  };

  const endDrag = () => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    resumeTimerRef.current = window.setTimeout(() => {
      autoRef.current = true;
    }, RESUME_AUTO_DELAY);
  };

  const handleCardClick = (href) => () => {
    if (dragRef.current.moved > 6) return;
    onSelect(href);
  };

  if (!mounted) return null;

  const center = (cards.length - 1) / 2;

  return (
    <div className={`hub-overlay ${visible ? "visible" : ""}`}>
      <div
        className="orbit-stage"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
      >
        <div className="orbit-ring" style={{ transform: `rotateY(${rotation}deg)` }}>
          {cards.map((card, index) => (
            <button
              type="button"
              key={card.key}
              className="orbit-card"
              style={{
                transform: `translate(-50%, -50%) rotateY(${(index - center) * ANGLE_STEP}deg) translateZ(var(--orbit-radius))`,
              }}
              onClick={handleCardClick(card.href)}
            >
              <span
                className="orbit-card-media"
                style={card.image ? { backgroundImage: `url(${card.image})` } : undefined}
              >
                {!card.image && <span className="orbit-card-glyph">{card.title.slice(0, 2).toUpperCase()}</span>}
              </span>
              <strong>{card.title}</strong>
              <p>{card.excerpt}</p>
            </button>
          ))}
        </div>
        <div className="orbit-dais" aria-hidden="true">
          <span className="orbit-dais-glow" />
          <span className="orbit-dais-ring orbit-dais-ring-outer" />
          <span className="orbit-dais-ring orbit-dais-ring-mid" />
          <span className="orbit-dais-base" />
          <span className="orbit-dais-rim" />
        </div>
      </div>
      <p className="hub-hint">{t.hubHint}</p>
    </div>
  );
}
