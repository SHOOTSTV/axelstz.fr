// Project name -> URL slug. Used by the projects library (links) and the
// /projects/[slug] detail route (generateStaticParams + lookup) so both agree.
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
