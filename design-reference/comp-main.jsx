/* ============================================================
   AXEL.DEV — Artwork showcase + Right sidebar
   ============================================================ */

function ArtShowcase({ data }) {
  return (
    <div className="art-showcase">
      <div className="art-frames">
        {[1, 2, 3].map((n) => (
          <div className="art-frame" key={n}>
            <div className="inner"><Slot id={`art-${n}`} placeholder={n === 2 ? 'Drop artwork / hero shot' : ''} /></div>
          </div>
        ))}
        <div className="art-more">+ 11</div>
      </div>
      <div className="art-url">{data.profile.url}</div>
    </div>
  );
}

function Sidebar({ data }) {
  const p = data.profile;
  return (
    <Reveal className="side-panel">
      <div className={`side-online ${p.online ? '' : 'offline'}`}>{p.online ? 'Online' : 'Offline'}</div>

      <div className="side-block">
        <div className="side-h">Badges <span className="n">{data.badgesCount}</span></div>
        <div className="badge-row">
          {data.badges.map((b, i) => (
            <span className="badge-ic" key={i} style={{ background: `linear-gradient(160deg, ${b.c}, #14171b)` }}>
              {b.icon ? <Icon name={b.icon} size={20} /> : b.t}
            </span>
          ))}
        </div>
      </div>

      <div className="side-block">
        <div className="count-list">
          {data.counts.map((c) => (
            <div className="count-row" key={c.lbl}>
              <span className="lbl">{c.lbl}</span>
              {c.n != null && <span className="n">{fmt(c.n)}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="side-block">
        <div className="side-h">Communities <span className="n">{data.groups.length}</span></div>
        {data.groups.map((g) => (
          <div className="grp-row" key={g.name}>
            <span className="grp-av"><Slot id={g.slot} placeholder="" /></span>
            <span className="grp-info">
              <div className="nm">{g.name}</div>
              <div className="mm">{g.members}</div>
            </span>
          </div>
        ))}
      </div>

      <div className="side-block">
        <div className="side-h">Contacts <span className="n">109</span></div>
        {data.contacts.map((c) => (
          <div className="contact-row" key={c.name} style={{ '--st': c.ig ? 'var(--ingame)' : (/online|hours/.test(c.sub) ? 'var(--online)' : 'var(--offline)') }}>
            <span className="contact-av"><Slot id={c.slot} placeholder="" /></span>
            <span className="contact-info">
              <div className="nm">{c.name}</div>
              <div className={`sub ${c.ig ? 'ig' : ''}`}>{c.sub}</div>
            </span>
            <span className="hexlvl" style={{ '--hx': c.hx }}><span>{c.level}</span></span>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

Object.assign(window, { ArtShowcase, Sidebar });
