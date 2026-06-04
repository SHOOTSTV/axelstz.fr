/* ============================================================
   AXEL.DEV — content data (Steam-profile structure)
   ============================================================ */
const Icons = {
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.8 0-1.5-.5-2.7-1.4-3.6.1-.4.6-1.8-.1-3.7 0 0-1.2-.4-3.9 1.4a13 13 0 0 0-7 0C5.2 1.5 4 1.9 4 1.9c-.7 1.9-.2 3.3-.1 3.7-.9.9-1.4 2.1-1.4 3.6 0 5.3 3.2 6.5 6.2 6.8-.4.4-.7 1-.8 1.7-.7.4-2.6 1-3.7-.9 0 0-.7-1.2-2-1.3',
  external: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3',
  zap: 'M13 2 3 14h8l-1 8 10-12h-8z',
  trophy: 'M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0zM7 4H4v2a3 3 0 0 0 3 3M17 4h3v2a3 3 0 0 1-3 3',
  rocket: 'M5 13c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0zM12 15l-3-3a14 14 0 0 1 7-9c3 0 5 2 5 5a14 14 0 0 1-9 7zM9 12H5l3-4M12 15v4l4-3',
  mail: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7',
  discord: 'M8 12a1 1 0 1 0 0-.01M16 12a1 1 0 1 0 0-.01M6 7c4-2 8-2 12 0 1.5 3 2.2 6.4 2 10-1.6 1.2-3.2 2-5 2.4l-1-1.8M7 17.6c-1.8-.4-3.4-1.2-5-2.4-.2-3.6.5-7 2-10M9 19l-1 2M16 19l1 2',
  linkedin: 'M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6zM6 9H2v11h4zM4 6a2 2 0 1 0 0-.01',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  database: 'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  layers: 'M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  cpu: 'M6 6h12v12H6zM9 9h6v6H9zM2 9h2M2 15h2M20 9h2M20 15h2M9 2v2M15 2v2M9 20v2M15 20v2',
  box: 'M21 8v8a2 2 0 0 1-1 1.7l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.7l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8zM3.3 7 12 12l8.7-5M12 22V12',
  download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  thumb: 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.3a2 2 0 0 0 2-1.7l1.4-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3',
  controller: 'M6 12h4M8 10v4M15 11h.01M18 13h.01M17.3 6H6.7A4.7 4.7 0 0 0 2 10.7L1 17a2.5 2.5 0 0 0 4.6 1.5L7 16h10l1.4 2.5A2.5 2.5 0 0 0 23 17l-1-6.3A4.7 4.7 0 0 0 17.3 6z',
  star: 'M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z',
  check: 'M20 6 9 17l-5-5',
  youtube: 'M22 8a3 3 0 0 0-2-2c-1.8-.5-9-.5-9-.5s-7.2 0-9 .5a3 3 0 0 0-2 2 31 31 0 0 0 0 8 3 3 0 0 0 2 2c1.8.5 9 .5 9 .5s7.2 0 9-.5a3 3 0 0 0 2-2 31 31 0 0 0 0-8zM10 15V9l5 3z',
  xtwitter: 'M4 4l16 16M20 4 4 20',
  facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  bluesky: 'M12 11c-1.6-3-5-5.5-7-6-2 1 0 5 1 6-2 0-2 2-1 3 1.5 1 4-1 7-3 3 2 5.5 4 7 3 1-1 1-3-1-3 1-1 3-5 1-6-2 .5-5.4 3-7 6z',
  comment: 'M21 11a8 8 0 0 1-12 7l-6 2 2-5a8 8 0 1 1 16-4z',
};

const PortfolioData = {
  account: { name: 'AXEL', wallet: 'Available' },

  profile: {
    name: 'AXEL',
    handle: 'axel.dev',
    url: 'axel.dev/profile',
    level: 26,
    online: true,
    xpItem: { icon: 'zap', title: 'Full Stack Developer', sub: 'Level 26 \u00b7 12,500 XP' },
  },

  // right sidebar count list
  counts: [
    { lbl: 'Projects', n: 48 },
    { lbl: 'Inventory', n: null },
    { lbl: 'Screenshots', n: 96 },
    { lbl: 'Repositories', n: 132 },
    { lbl: 'Workshop', n: null },
    { lbl: 'Reviews', n: 21 },
    { lbl: 'Guides', n: null },
    { lbl: 'Creations', n: 13 },
  ],
  badgesCount: 12,
  badges: [
    { t: '7', c: '#5a4b8a' },
    { t: '5+', c: '#9a6a2c' },
    { t: '', c: '#6a3a3a', icon: 'rocket' },
    { t: "'26", c: '#7a2f5a' },
  ],

  groups: [
    { name: 'Indie Hackers', members: '22,475 members', slot: 'grp1' },
    { name: 'React Core', members: '411,137 members', slot: 'grp2' },
    { name: 'Open Source Collective', members: '24,600 members', slot: 'grp3' },
  ],

  contacts: [
    { name: 'kormac', sub: 'In project \u2014 Nebula', ig: true, level: 170, hx: '#7a2f8a', slot: 'c1' },
    { name: 'Welshe', sub: 'Last online 7 hours ago', ig: false, level: 106, hx: '#3a3a3a', slot: 'c2' },
    { name: 'Snivo', sub: 'In project \u2014 TabFlow', ig: true, level: 101, hx: '#5a3a8a', slot: 'c3' },
    { name: 'TyRoms', sub: 'Last online 11 days ago', ig: false, level: 88, hx: '#3a3a3a', slot: 'c4' },
    { name: 'TeKiLLa', sub: 'In project \u2014 Forge UI', ig: true, level: 82, hx: '#7a5a2a', slot: 'c5' },
    { name: 'Naralissa', sub: 'Last online 29 days ago', ig: false, level: 71, hx: '#7a2f5a', slot: 'c6' },
  ],

  // items to trade -> featured stack icons (middle = highlighted)
  tradeItems: [
    { icon: 'code' },
    { icon: 'layers' },
    { icon: 'cpu', hot: true },
    { icon: 'database' },
    { icon: 'server' },
  ],

  // big stat numbers
  bigStats: [
    { v: 48, label: 'Projects shipped' },
    { v: 132, label: 'Repositories' },
    { v: 18400, label: 'Total commits' },
  ],

  about: {
    star: 'AXEL',
    specHead: 'My stack :',
    specs: [
      { star: true, text: 'React 18 \u00b7 Next.js 15' },
      { star: true, text: 'TypeScript \u00b7 Tailwind' },
      { star: true, text: 'Supabase \u00b7 PostgreSQL' },
      { star: true, text: 'Vercel \u00b7 GitHub \u00b7 Claude' },
    ],
  },

  // favorite group -> featured community / flagship project
  favGroup: {
    name: 'Nebula Analytics',
    type: 'Flagship SaaS',
    slot: 'favg',
    desc: 'Real-time product analytics for indie SaaS teams \u2014 event pipelines, cohort funnels and AI-assisted insights.',
    stats: [
      { v: '3,412', k: 'Users', cls: 'members' },
      { v: '128', k: 'Live now', cls: 'ingame' },
      { v: '99.98%', k: 'Uptime', cls: 'online' },
      { v: '180ms', k: 'p95', cls: 'chat' },
    ],
  },

  // recent activity = projects
  activity: [
    {
      name: 'Nebula Analytics', slot: 'act1', total: '2,306 hrs total', last: 'last updated June 3',
      ach: { icon: 'trophy', name: 'First SaaS Launch', xp: '500 XP', dark: '#262b31' },
      progress: { done: 1, total: 1, label: 'Milestones' },
      achIcon: 'rocket',
      extras: [{ icon: 'camera', t: 'Screenshots 130' }, { icon: 'thumb', t: 'Review 1' }],
    },
    {
      name: 'TabFlow \u2014 Chrome Extension', slot: 'act2', total: '40 hrs total', last: 'last updated June 1',
      progress: { done: 41, total: 57, label: 'Milestones' },
      thumbs: 5, thumbsMore: 36,
      thumbSlots: ['t1', 't2', 't3', 't4', 't5'],
    },
    {
      name: 'Forge UI \u2014 Component Kit', slot: 'act3', total: '66 hrs total', last: 'last updated May 31',
      progress: { done: 3, total: 5, label: 'Milestones' },
    },
  ],

  commentsTotal: 33,
  comments: [
    { name: 'O R E S A Y', special: true, date: 'Nov 21, 2025 @ 8:21pm', text: '+rep clean code, fast delivery', slot: 'cm1' },
    { name: 'maya.okafor', date: 'Jul 20, 2024 @ 8:28pm', text: '+rep shipped our MVP in 5 weeks, scaled great', slot: 'cm2' },
    { name: 'JODYE', date: 'Feb 21, 2024 @ 5:53pm', text: '+ rep most reliable dev we worked with', slot: 'cm3' },
    { name: 'liam.petrov', date: 'Feb 21, 2024 @ 5:48pm', text: '+ rep clean comms, zero drama', slot: 'cm4' },
    { name: 'LaFiS \u30c4', date: 'Mar 23, 2024 @ 12:32pm', text: '+rep thinks like a product owner \ud83d\udc96', slot: 'cm5' },
  ],

  footer: {
    cols: [
      { h: 'Portfolio', links: ['About Axel', 'Projects', 'Skill inventory', 'Activity', 'Showcase'] },
      { h: 'Work', links: ['Featured', 'Open source', 'Workshop', 'Reviews'] },
      { h: 'Connect', links: ['Email', 'LinkedIn', 'GitHub', 'Discord'] },
      { h: 'More', links: ['Resume', 'Now', 'Uses', 'Guestbook'] },
    ],
    social: ['youtube', 'bluesky', 'facebook', 'xtwitter'],
  },
};

window.Icons = Icons;
window.PortfolioData = PortfolioData;
