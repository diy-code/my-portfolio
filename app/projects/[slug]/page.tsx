import { projects } from "@/data/projects";
import Link from "next/link";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = projects.find((x) => x.slug === params.slug);
  if (!p) return <main className="p-8">לא נמצא</main>;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/projects" className="text-sm underline text-neutral-400">← חזרה לכל הפרויקטים</Link>
      <h1 className="text-3xl font-bold mt-3">{p.title}</h1>
      <p className="mt-2 text-neutral-300">{p.tagline}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {p.tech.map((t) => (
          <span key={t} className="text-xs rounded-full border border-neutral-700 px-2 py-1">{t}</span>
        ))}
      </div>

      {p.demo && (
        <a href={p.demo} target="_blank" className="underline mt-6 inline-block">דמו</a>
      )}
      {p.repo && (
        <a href={p.repo} target="_blank" className="underline mt-2 block">קוד</a>
      )}

      {/* כאן בהמשך: GIF/וידאו, תרשימי ארכיטקטורה, מדדים טכניים */}
    </main>
  );
}
