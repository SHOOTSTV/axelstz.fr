/* ============================================================
   AXEL.DEV — Recent activity, Comments, Footer
   ============================================================ */
const { useState: useSL, useMemo: useML } = React;

function GameRow({ g }) {
  return (
    <div className="game-row">
      <div className="game-top">
        <span className="game-cap"><Slot id={g.slot} placeholder="capsule" /></span>
        <span className="game-name">{g.name}</span>
        <span className="game-meta">
          <div className="ht">{g.total}</div>
          <div>{g.last}</div>
        </span>
      </div>
      <div className="game-detail">
        {g.ach && (
          <div className="ach-card" style={{ background: g.ach.dark }}>
            <span className="ai"><Icon name={g.ach.icon} size={20} /></span>
            <span><div className="at">{g.ach.name}</div><div className="ax">{g.ach.xp}</div></span>
          </div>
        )}
        {g.progress && (
          <div className="ach-prog">
            <div className="pl"><span>{g.progress.label}</span><span>{g.progress.done} of {g.progress.total}</span></div>
            <Prog value={g.progress.done} max={g.progress.total} />
          </div>
        )}
        {g.achIcon && <span className="ai" style={{ width: 30, height: 30, display: 'grid', placeItems: 'center', color: 'var(--link)' }}><Icon name={g.achIcon} size={24} /></span>}
        {g.thumbs && (
          <div className="ach-thumbs">
            {g.thumbSlots.map((t) => <span className="th" key={t}><Slot id={`th-${g.slot}-${t}`} placeholder="" /></span>)}
            <span className="more">+{g.thumbsMore}</span>
          </div>
        )}
      </div>
      {g.extras && (
        <div className="game-extra">
          {g.extras.map((x) => <span className="x" key={x.t}><Icon name={x.icon} size={15} /> {x.t}</span>)}
        </div>
      )}
    </div>
  );
}

function RecentActivity({ data }) {
  return (
    <Reveal>
      <div className="activity-head" style={{ marginTop: 34 }}>
        <span className="h">Recent activity</span>
        <span className="hrs">35.4 hrs past 2 weeks</span>
      </div>
      {data.activity.map((g) => <GameRow g={g} key={g.name} />)}
      <div className="activity-foot">
        Show <a href="#">all recent projects</a> | <a href="#">the wishlist</a> | <a href="#">reviews</a>
      </div>
    </Reveal>
  );
}

function Comments({ data }) {
  const [list, setList] = useSL(data.comments);
  const [page, setPage] = useSL(1);
  const [text, setText] = useSL('');
  const total = data.commentsTotal + (list.length - data.comments.length);

  const post = () => {
    const t = text.trim(); if (!t) return;
    setList([{ name: 'AXEL', date: 'Just now', text: t, slot: 'micro-av', mine: true }, ...list]);
    setText('');
  };

  return (
    <Reveal className="comments" as="div">
      <div className="comments-head">
        <span className="h">Comments</span>
        <span className="subscribe"><span className="box"><Icon name="check" size={11} /></span> Subscribe to thread <sup>(?)</sup></span>
      </div>
      <div className="comments-sub">
        <span className="cnt">Showing {total} comments</span>
        <span className="pager">
          <span className="pg" onClick={() => setPage((p) => Math.max(1, p - 1))}>&lt;</span>
          <span className="nums">{[1,2,3,4,5,6].map((n) => <span key={n} className={n === page ? 'active' : ''} onClick={() => setPage(n)}>{n}</span>)}</span>
          <span className="pg" onClick={() => setPage((p) => Math.min(6, p + 1))}>&gt;</span>
        </span>
      </div>

      <div className="comment-box">
        <span className="cb-av"><Slot id="cb-av" placeholder="" /></span>
        <span className="cb-field">
          <textarea placeholder="Add a comment" value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) post(); }} />
          <button className="post" onClick={post}>Post</button>
        </span>
      </div>

      <div className="comment-blocked-bar">
        <span>You have blocked this player</span>
        <a href="#">Show comment</a>
      </div>

      {list.map((c, i) => (
        <div className="comment" key={i}>
          <span className="c-av"><Slot id={c.slot} placeholder="" /></span>
          <span className="c-main">
            <span className="c-top">
              <span className={`c-name ${c.special ? 'special' : ''}`} style={c.mine ? { color: 'var(--link)' } : null}>{c.name}</span>
              <span className="c-date">{c.date}</span>
            </span>
            <div className="c-text">{c.text}</div>
          </span>
        </div>
      ))}

      <div className="comments-sub" style={{ marginTop: 18, justifyContent: 'center' }}>
        <span className="pager">
          <span className="pg" onClick={() => setPage((p) => Math.max(1, p - 1))}>&lt;</span>
          <span className="nums">{[1,2,3,4,5,6].map((n) => <span key={n} className={n === page ? 'active' : ''} onClick={() => setPage(n)}>{n}</span>)}</span>
          <span className="pg" onClick={() => setPage((p) => Math.min(6, p + 1))}>&gt;</span>
        </span>
      </div>
    </Reveal>
  );
}

function Footer({ data }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="logo">A</span>
          <span className="word">AXEL.DEV</span>
        </div>
        <div className="footer-cols">
          <div>
            <div className="footer-copy">
              © 2026 Axel. All work shown is original.<br />
              Steam-profile-inspired layout — not affiliated with or endorsed by Valve.
            </div>
            <div className="footer-social">
              {data.footer.social.map((s) => <a href="#" key={s}><Icon name={s} size={20} /></a>)}
            </div>
          </div>
          {data.footer.cols.slice(0, 3).map((col) => (
            <div className="footer-col" key={col.h}>
              <h4>{col.h}</h4>
              {col.links.map((l) => <a href="#" key={l}>{l}</a>)}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { RecentActivity, Comments, Footer });
