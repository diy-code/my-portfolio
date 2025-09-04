// /components/ProjectCard.tsx
"use client";
import Image from "next/image";

type Variant = "classic" | "compact" | "image";
type Tokens = {
  radius?: string; glow?: string; border?: string; bg?: string; accent?: string;
};

type Props = {
  name: string; blurb: string; tech: string[];
  repo?: string; demo?: string; cover?: string;
  variant?: Variant; tokens?: Tokens;
};

export default function ProjectCard({
  name, blurb, tech, repo, demo, cover,
  variant = "classic",
  tokens = {}
}: Props) {
  const t: Required<Tokens> = {
    radius: tokens.radius ?? "rounded-3xl",
    glow: tokens.glow ?? "hover:shadow-[0_12px_40px_-12px_rgba(96,165,250,.45)]",
    border: tokens.border ?? "border border-white/10",
    bg: tokens.bg ?? "bg-white/5",
    accent: tokens.accent ?? "text-[#60a5fa]",
  };

  const base = `group ${t.radius} ${t.border} ${t.bg} p-6 md:p-8 transition transform hover:-translate-y-1 ${t.glow}`;

  const Title = (
    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#60a5fa] transition-colors">
      {name}
    </h3>
  );

  const Tech = (
    <div className="flex flex-wrap gap-2 mt-3">
      {tech.map((x) => (
        <span key={x} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
          {x}
        </span>
      ))}
    </div>
  );

  const Actions = (
    <div className="mt-5 flex gap-3">
      {repo && (
        <a href={repo} target="_blank" rel="noreferrer"
           className="glass-card px-4 py-2 rounded-full text-sm text-gray-200 hover:text-white">
          View Code
        </a>
      )}
      {demo && (
        <a href={demo} target="_blank" rel="noreferrer"
           className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-black">
          Live Demo
        </a>
      )}
    </div>
  );

  if (variant === "compact") {
    return (
      <article className={base}>
        {Title}
        <p className="mt-2 text-sm text-gray-300">{blurb}</p>
        {Tech}
        {Actions}
      </article>
    );
  }

  if (variant === "image") {
    return (
      <article className={base + " overflow-hidden"}>
        {cover && (
          <div className="relative aspect-[16/9] mb-6 rounded-2xl overflow-hidden">
            <Image src={cover} alt={name} fill className="object-cover" />
          </div>
        )}
        {Title}
        <p className="mt-3 text-gray-300">{blurb}</p>
        {Tech}
        {Actions}
      </article>
    );
  }

  // classic
  return (
    <article className={base}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1">
          {Title}
          <p className="mt-3 text-gray-300">{blurb}</p>
          {Tech}
        </div>
        {cover && (
          <div className="lg:w-64 shrink-0">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image src={cover} alt={name} fill className="object-cover" />
            </div>
          </div>
        )}
      </div>
      {Actions}
    </article>
  );
}
