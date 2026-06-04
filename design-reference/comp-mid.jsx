/* ============================================================
   AXEL.DEV — Items to trade, Stats, About me, Favorite group
   ============================================================ */

function TradeItems({ data }) {
  return (
    <div>
      <div className="sec-label">Featured stack</div>
      <div className="trade-items">
        {data.tradeItems.map((it, i) => (
          <div className={`trade-item ${it.hot ? 'hot' : ''}`} key={i}><Icon name={it.icon} size={42} /></div>
        ))}
      </div>
    </div>
  );
}

function BigStats({ data }) {
  return (
    <div className="stat-row">
      {data.bigStats.map((s) => (
        <div className="stat-col" key={s.label}>
          <div className="v"><StatNum value={s.v} /></div>
          <div className="k">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function AboutMe({ data }) {
  const a = data.about;
  return (
    <div>
      <div className="show-dots">· · ·</div>
      <div className="about-wrap">
        <div className="bracket about-me">
          <div className="lead">About me :</div>
          <div className="big">★ {a.star}</div>
          <div className="spec-h">{a.specHead}</div>
          {a.specs.map((s, i) => (
            <div className="spec" key={i}>★ <b>{s.text}</b></div>
          ))}
        </div>
        <div className="bracket about-side">
          <div className="trade">Trade Offer</div>
        </div>
      </div>
      <div className="show-dots">· · ·</div>
    </div>
  );
}

function FavGroup({ data }) {
  const g = data.favGroup;
  return (
    <div>
      <div className="sec-label">Featured project</div>
      <div className="fav-group">
        <span className="fav-av"><Slot id={g.slot} placeholder="" /></span>
        <div className="fav-main">
          <div className="fav-name"><b>{g.name}</b> — {g.type}</div>
          <div className="fav-desc">{g.desc}</div>
          <div className="fav-stats">
            {g.stats.map((s) => (
              <div className={s.cls} key={s.k}>
                <div className="v">{s.v}</div>
                <div className="k">{s.k}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddShowcase() {
  return (
    <div>
      <div className="add-showcase">
        <div className="h">+ Add a showcase</div>
        <div className="p">You've earned a showcase slot on your profile. Click here to select a showcase to display.</div>
      </div>
    </div>
  );
}

Object.assign(window, { TradeItems, BigStats, AboutMe, FavGroup, AddShowcase });
