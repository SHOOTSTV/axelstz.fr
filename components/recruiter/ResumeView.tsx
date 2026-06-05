import type { PortfolioData } from "@/lib/types";

export function ResumeView({ data }: { data: PortfolioData }) {
  const p = data.profile;
  return (
    <article className="resume">
      <header className="resume-head">
        <h1>{p.name}</h1>
        <p className="resume-role">{p.role}</p>
        <ul className="resume-contact">
          {data.social.map((s) => (
            <li key={s.name}>
              <a href={s.href} target="_blank" rel="noreferrer">{s.name}: {s.sub}</a>
            </li>
          ))}
        </ul>
        <a className="resume-cv" href="/cv/Axel-S-CV.pdf" download>Download CV (PDF)</a>
      </header>

      <section className="resume-section">
        <h2>Skills</h2>
        <ul className="resume-skills">
          {data.about.specs.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>

      <section className="resume-section">
        <h2>Featured project</h2>
        <h3>{data.featuredProject.name} — {data.featuredProject.type}</h3>
        <p>{data.featuredProject.desc}</p>
      </section>

      <section className="resume-section">
        <h2>Projects</h2>
        <ul className="resume-projects">
          {data.projects.map((pr) => (
            <li key={pr.name}>
              <strong>{pr.name}</strong> — {pr.meta}
              {pr.achievement ? ` · ${pr.achievement.name}` : ""}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
