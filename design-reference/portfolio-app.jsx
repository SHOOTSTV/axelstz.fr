/* ============================================================
   AXEL.DEV — app: starfield bg, assembly, tweaks
   ============================================================ */
const { useState: useApp, useEffect: useAppE, useRef: useAppR } = React;

function Starfield() {
  const ref = useAppR(null);
  useAppE(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext('2d');
    let w, h, dpr, raf, run = true;
    const N = 150; const stars = [];
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() {
      stars.length = 0;
      for (let i = 0; i < N; i++) {
        stars.push({
          a: Math.random() * Math.PI * 2,
          r: Math.pow(Math.random(), 0.6) * Math.hypot(w, h) * 0.62,
          sp: 0.00025 + Math.random() * 0.0007,
          br: 0.15 + Math.random() * 0.55,
          ln: 0.04 + Math.random() * 0.12,
        });
      }
    }
    function draw() {
      if (!run) return;
      const cx = w * 0.5, cy = h * 0.16;
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = 'round';
      for (const s of stars) {
        s.a += s.sp;
        const x1 = cx + Math.cos(s.a) * s.r, y1 = cy + Math.sin(s.a) * s.r;
        const x2 = cx + Math.cos(s.a - s.ln) * s.r, y2 = cy + Math.sin(s.a - s.ln) * s.r;
        ctx.strokeStyle = `rgba(255,255,255,${s.br * 0.5})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    }
    resize(); seed(); draw();
    const onR = () => { resize(); seed(); };
    window.addEventListener('resize', onR);
    return () => { run = false; cancelAnimationFrame(raf); window.removeEventListener('resize', onR); };
  }, []);
  return <canvas id="stars" ref={ref} />;
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#66c0f4",
  "starfield": true,
  "status": "online",
  "bgImage": true
}/*EDITMODE-END*/;

const ACCENTS = ["#66c0f4", "#1fd6a0", "#91c257", "#a06bff", "#e0894a"];

function App() {
  const data = window.PortfolioData;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useAppE(() => {
    document.documentElement.style.setProperty('--link', t.accent);
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);
  useAppE(() => { document.body.classList.toggle('motion-off', !t.starfield); }, [t.starfield]);

  const online = t.status === 'online';
  const pdata = { ...data, profile: { ...data.profile, online } };

  return (
    <React.Fragment>
      <div className="bg-stage">
        <div className="bg-fallback" />
        {t.bgImage && <Slot id="profile-bg" placeholder="" />}
        {t.starfield && <Starfield />}
        <div className="bg-vignette" />
      </div>

      <div className="shell">
        <TopBar data={pdata} />
        <ProfileHeader data={pdata} />
        <div className="content">
          <div className="profile-body">
            <div className="col-main">
              <ArtShowcase data={pdata} />
              <TradeItems data={pdata} />
              <BigStats data={pdata} />
              <AboutMe data={pdata} />
              <FavGroup data={pdata} />
              <AddShowcase />
              <RecentActivity data={pdata} />
              <Comments data={pdata} />
            </div>
            <div className="col-side">
              <Sidebar data={pdata} />
            </div>
          </div>
        </div>
        <Footer data={pdata} />
      </div>

      <TweaksPanel>
        <TweakSection label="Accent" />
        <TweakColor label="Profile color" value={t.accent} options={ACCENTS} onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Profile" />
        <TweakRadio label="Status" value={t.status} options={['online', 'offline']} onChange={(v) => setTweak('status', v)} />
        <TweakToggle label="Star-trail background" value={t.starfield} onChange={(v) => setTweak('starfield', v)} />
        <TweakToggle label="Custom background image" value={t.bgImage} onChange={(v) => setTweak('bgImage', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
