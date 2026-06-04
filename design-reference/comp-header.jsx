/* ============================================================
   AXEL.DEV — Top bar + Profile header
   ============================================================ */
const { useState: useS1, useEffect: useE1 } = React;

function TopBar({ data }) {
  const links = ['PROJECTS', 'COMMUNITY', 'PROFILE', 'ACTIVITY', 'SUPPORT'];
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="top-micro">
          <span className="mi"><Icon name="download" size={14} /> Install App</span>
          <span className="mi"><Icon name="bell" size={14} /></span>
          <span className="user-pill">
            <span className="nm">{data.account.name}</span>
            <span className="wallet">{data.account.wallet}</span>
          </span>
          <span className="user-av"><Slot id="micro-av" placeholder="" /></span>
        </div>
        <div className="top-main">
          <a className="brand" href="#top">
            <span className="logo"><b>A</b></span>
            <span className="word">AXEL<span>.DEV</span></span>
          </a>
          <nav className="nav-main">
            {links.map((l, i) => <a key={l} href="#" className={i === 2 ? 'active' : ''}>{l}</a>)}
          </nav>
        </div>
      </div>
    </header>
  );
}

function ProfileHeader({ data }) {
  const p = data.profile;
  return (
    <div className="profile-top" id="top">
      <div className="content">
        <div className="profile-head">
          {/* windowed avatar */}
          <div className="av-window">
            <div className="av-titlebar">
              <span>c:_&gt;</span>
              <span className="dots">
                <span className="wbtn">_</span>
                <span className="wbtn">▢</span>
                <span className="wbtn">✕</span>
              </span>
            </div>
            <div className="av-photo">
              <Slot id="profile-avatar" placeholder="Drop avatar" />
              <span className="av-tag">AXEL.DEV</span>
            </div>
          </div>

          {/* name + trade */}
          <div className="ph-id">
            <span className="ph-name">{p.name} <span className="caret">▾</span></span>
            <div className="ph-trade">Trade Offer</div>
          </div>

          {/* level + xp item */}
          <div className="ph-level">
            <div className="lvl-row">
              <span className="lvl-word">Level</span>
              <span className="lvl-badge">{p.level}</span>
            </div>
            <div className="lvl-xp-item">
              <span className="xp-ic"><Icon name={p.xpItem.icon} size={30} /></span>
              <span className="xp-txt">
                <div className="t">{p.xpItem.title}</div>
                <div className="s">{p.xpItem.sub}</div>
              </span>
            </div>
            <div className="ph-edit">Edit profile</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TopBar, ProfileHeader });
