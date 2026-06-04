/* ============================================================
   AXEL.DEV — shared primitives
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;

function Icon({ name, size = 18, stroke = 1.8, fill = 'none', style, className }) {
  const d = (window.Icons || {})[name];
  if (!d) return null;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24"
      fill={fill} stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      {d.split('M').filter(Boolean).map((seg, i) => <path key={i} d={'M' + seg} />)}
    </svg>
  );
}

function revealNear(el) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 800;
  if (r.top < vh * 0.98 && r.bottom > 0) el.classList.add('in');
}

// wrap children in a reveal element
function Reveal({ children, delay = 0, className = '', style, as = 'div', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    revealNear(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect(); } },
      { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    io.observe(el); return () => io.disconnect();
  }, []);
  const As = as;
  return <As ref={ref} className={`reveal ${className}`} style={{ transitionDelay: delay + 'ms', ...style }} {...rest}>{children}</As>;
}

function fmt(n) {
  const r = Math.round(n);
  return r >= 1000 ? r.toLocaleString('en-US') : String(r);
}

function useCountUp(target, vis, duration = 1500) {
  const [v, setV] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!vis || done.current) return;
    done.current = true;
    if (document.body.classList.contains('motion-off')) { setV(target); return; }
    const t0 = performance.now();
    const fb = setTimeout(() => setV(target), duration + 300);
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick); else { setV(target); clearTimeout(fb); }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); clearTimeout(fb); };
  }, [vis, target, duration]);
  return v;
}

function StatNum({ value }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (el.getBoundingClientRect().top < (window.innerHeight || 800) * 1.1) setVis(true);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el); return () => io.disconnect();
  }, []);
  const v = useCountUp(value, vis);
  return <span ref={ref}>{fmt(v)}</span>;
}

// progress bar that fills when visible
function Prog({ value, max }) {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const off = document.body.classList.contains('motion-off');
    const set = () => off ? setW(pct) : setTimeout(() => setW(pct), 150);
    if (el.getBoundingClientRect().top < (window.innerHeight || 800)) set();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [pct]);
  return <div className="prog-track" ref={ref}><div className="prog-fill" style={{ width: w + '%' }} /></div>;
}

function Slot({ id, shape = 'rect', radius = 0, placeholder = '', style, className }) {
  return React.createElement('image-slot', { id, shape, radius: String(radius), placeholder, class: className, style });
}

Object.assign(window, { Icon, Reveal, fmt, useCountUp, StatNum, Prog, Slot });
