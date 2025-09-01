import Link from "next/link";
import type { Project } from "@/data/projects";

export default function ProjectCard({ p }: { p: Project }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 hover:border-neutral-700 block"
    >
      <div className="text-lg font-semibold">{p.title}</div>
      <div className="text-neutral-400 text-sm mt-1">{p.tagline}</div>
      <div className="flex flex-wrap gap-2 mt-3">
        {p.tech.map((t) => (
          <span key={t} className="text-xs rounded-full border border-neutral-700 px-2 py-1">
            {t}
          </span>
        ))}
      </div>
      {p.impact && <div className="text-xs text-neutral-400 mt-3">השפעה: {p.impact}</div>}
    </Link>
  );
}
