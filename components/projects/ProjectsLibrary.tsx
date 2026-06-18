"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { PortfolioData, Project } from "@/lib/types";
import { slugify } from "@/lib/slug";
import { TopBar } from "@/components/steam/TopBar";
import { Icon } from "@/components/primitives/Icon";
import { Frame } from "@/components/primitives/Frame";
import { Prog } from "@/components/primitives/Prog";

type TabKey = "all" | "live" | "completed";
type SortKey = "commits" | "name" | "progress";

const isComplete = (p: Project) => !!p.milestones && p.milestones.done === p.milestones.total;

function ProjectRow({ p, feat }: { p: Project; feat: boolean }) {
  const href = `/projects/${slugify(p.name)}`;
  const primary = p.live
    ? { label: "Live demo", icon: "external", href: p.live }
    : p.code
    ? { label: "View code", icon: "code", href: p.code }
    : null;
  const menus = p.code
    ? [
        { label: "Project stats", href: `${p.code}/pulse` },
        { label: "Repo & assets", href: p.code },
      ]
    : [];

  return (
    <div className={`lib-row ${feat ? "feat" : ""}`}>
      <div className="lib-cap">
        <Link href={href} aria-label={`${p.name} details`}>
          <Frame src={p.image} alt={p.name} placeholder="capsule art" />
        </Link>
        {p.ribbon && (
          <span className="ribbon" title="Featured build">
            <Icon name="star" size={18} fill="currentColor" stroke={0} />
          </span>
        )}
      </div>

      <div className="lib-main">
        <span className="menu-dots" aria-hidden="true">&middot;&middot;&middot;</span>
        <Link className="lib-name" href={href}>{p.name}</Link>
        <div className="lib-tag">{p.meta}</div>

        <div className="lib-metrics">
          <div className="lib-metric">
            <div className="ml">Total commits</div>
            <div className="mv">{p.commits != null ? p.commits.toLocaleString("en-US") : "—"}</div>
          </div>
          <div className="lib-metric">
            <div className="ml">Last update</div>
            <div className="mv">{p.lastUpdate ?? "—"}</div>
          </div>
          {p.milestones && (
            <div className="lib-metric prog">
              <div className="ml">Milestones</div>
              <div className="pbar">
                <Prog value={p.milestones.done} max={p.milestones.total} />
                <span className="pc">{p.milestones.done}/{p.milestones.total}</span>
              </div>
            </div>
          )}
        </div>

        <div className="lib-actions">
          {menus.map((m) => (
            <a className="lib-btn" key={m.label} href={m.href} target="_blank" rel="noreferrer">
              {m.label}
            </a>
          ))}
          <span className="lib-spacer" />
          {primary && (
            <a className="lib-primary" href={primary.href} target="_blank" rel="noreferrer">
              <Icon name={primary.icon} size={14} /> {primary.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectsLibrary({ data }: { data: PortfolioData }) {
  const [tab, setTab] = useState<TabKey>("all");
  const [sort, setSort] = useState<SortKey>("commits");
  const [cat, setCat] = useState<string>("all");
  const [q, setQ] = useState("");

  const cats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of data.projects) if (p.category) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return [{ key: "all", label: "All categories", n: data.projects.length }].concat(
      Object.keys(counts).sort().map((c) => ({ key: c, label: c, n: counts[c] }))
    );
  }, [data.projects]);

  const tabs = useMemo(
    () => [
      { key: "all" as const, label: "All projects", n: data.projects.length },
      { key: "live" as const, label: "Live", n: data.projects.filter((p) => p.live).length },
      { key: "completed" as const, label: "Completed 100%", n: data.projects.filter(isComplete).length },
    ],
    [data.projects]
  );

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = data.projects.filter((p) => p.name.toLowerCase().includes(needle));
    if (tab === "live") list = list.filter((p) => p.live);
    else if (tab === "completed") list = list.filter(isComplete);
    if (cat !== "all") list = list.filter((p) => p.category === cat);

    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "commits") list = [...list].sort((a, b) => (b.commits ?? -1) - (a.commits ?? -1));
    else if (sort === "progress") {
      const pr = (p: Project) => (p.milestones ? p.milestones.done / p.milestones.total : -1);
      list = [...list].sort((a, b) => pr(b) - pr(a));
    }
    return list;
  }, [data.projects, q, tab, sort, cat]);

  return (
    <>
      <div className="shell">
        <TopBar data={data} current="PROJECTS" />
        <div className="content lib-page">
          <Link className="lib-back" href="/"><Icon name="code" size={13} /> Back to profile</Link>

          <div className="lib-head">
            <span className="lh-av"><Frame src="/images/avatar.png" alt={`${data.profile.name} avatar`} placeholder="" /></span>
            <span className="lh-id">
              <span className="nm">{data.profile.name}</span>
              <span className="crumb"><b>&raquo;</b> Projects</span>
            </span>
          </div>

          <div className="lib-tabs">
            {tabs.map((t) => (
              <span key={t.key} className={`lib-tab ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
                {t.label}<span className="n"> ({t.n})</span>
              </span>
            ))}
          </div>

          <div className="lib-toolbar">
            <div className="lib-search">
              <span className="si"><SearchIcon /></span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a project" aria-label="Find a project" />
            </div>
            <div className="lib-sort">
              <span className="gear"><GearIcon /></span>
              {([
                { key: "commits", label: "Commits" },
                { key: "name", label: "Name" },
                { key: "progress", label: "Milestone progress" },
              ] as const).map((s) => (
                <span key={s.key} className={`so ${sort === s.key ? "active" : ""}`} onClick={() => setSort(s.key)}>{s.label}</span>
              ))}
            </div>
          </div>

          {cats.length > 1 && (
            <div className="lib-filter">
              <span className="lf-label">Category</span>
              <div className="lf-chips">
                {cats.map((c) => (
                  <button key={c.key} className={`lf-chip ${cat === c.key ? "active" : ""}`} onClick={() => setCat(c.key)}>
                    {c.label}<span className="n">{c.n}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="lib-list">
            {rows.length ? (
              rows.map((p, i) => <ProjectRow p={p} feat={i === 0} key={p.name} />)
            ) : (
              <div className="lib-empty">No projects match &ldquo;{q}&rdquo;.</div>
            )}
          </div>

          <div className="lib-foot">
            Showing {rows.length} of {data.projects.length} projects &nbsp;|&nbsp; <Link href="/">back to profile</Link>
          </div>
        </div>
      </div>
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
