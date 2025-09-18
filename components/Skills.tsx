"use client";

import React from "react";
import StackIcon from "tech-stack-icons";

type SkillLevel = "Advanced" | "Proficient" | "Working";

interface Skill {
  label: string;
  icon?: string;     // tech-stack-icons ID where available
  level: SkillLevel;
}

// ---------- Data ----------
const groups: { title: string; items: Skill[] }[] = [
  {
    title: "Languages & Core",
    items: [
      { label: "C++", icon: "cplusplus", level: "Advanced" },
      { label: "C# / .NET", icon: "csharp", level: "Advanced" },
      { label: "Python", icon: "python", level: "Advanced" },
      { label: "Java", icon: "java", level: "Proficient" },
      { label: "SQL", icon: "postgresql", level: "Advanced" }, // reuse postgres glyph
    ],
  },
  {
    title: "Frameworks & Runtime",
    items: [
      { label: "FastAPI", icon: "fastapi", level: "Proficient" },
      { label: "WPF (.NET)", icon: "dotnet", level: "Proficient" },
      { label: "Flutter", icon: "flutter", level: "Proficient" },
      { label: "React", icon: "react", level: "Working" },
      { label: "TDD", icon: "jest", level: "Proficient" },
      { label: "Clean Architecture", icon: "nestjs", level: "Proficient" }, // concept stand-in
    ],
  },
  {
    title: "Data & Systems",
    items: [
      { label: "PostgreSQL", icon: "postgresql", level: "Proficient" },
      { label: "Docker", icon: "docker", level: "Proficient" },
      { label: "Git / GitHub", icon: "git", level: "Advanced" },
      { label: "Multithreading", icon: "cplusplus", level: "Advanced" },
      { label: "Data Structures & Algorithms", icon: "java", level: "Advanced" },
      { label: "Operating Systems", icon: "linux", level: "Proficient" },
      { label: "REST APIs", icon: "postman", level: "Proficient" },
    ],
  },
  {
    title: "Cloud, Security & Tools",
    items: [
      { label: "OSINT", icon: "openai", level: "Working" }, // concept stand-in
      { label: "Networking / Wireshark", icon: "wireshark", level: "Proficient" },
     { label: "Unix/Linux", icon: "linux", level: "Proficient" },
      { label: "Agile", icon: "jira", level: "Proficient" },
      { label: "Prompt Engineering", icon: "claude", level: "Working" },
    ],
  },
];

// ---------- Dot Colors ----------
const levelDot: Record<SkillLevel, string> = {
  Working: "bg-slate-400",
  Proficient: "bg-violet-500",
  Advanced: "bg-blue-500",
};

// ---------- Component ----------
export default function Skills() {
  return (
    <section id="skills" className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-10 md:mb-14">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-sm md:text-base text-gray-300 mt-3">
            Built from real project experience and coursework.
          </p>
          <div className="mt-5 flex items-center justify-center gap-5 text-xs text-gray-300">
            <LegendDot color="bg-blue-500" label="Advanced" />
            <LegendDot color="bg-violet-500" label="Proficient" />
            <LegendDot color="bg-slate-400" label="Working" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {groups.map(({ title, items }) => (
            <SkillGroup key={title} title={title} items={items} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillGroup({ title, items }: { title: string; items: Skill[] }) {
  return (
    <section className="glass-card p-5 rounded-3xl">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="grid [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))] gap-3">
        {items.map((s) => (
          <li key={s.label}>
            <SkillPill skill={s} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SkillPill({ skill }: { skill: Skill }) {
  return (
    <span
      title={skill.label}
      className="w-full h-9 rounded-xl px-3 border border-white/10 bg-white/5
                 hover:bg-white/10 transition inline-flex items-center gap-2
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                 text-[13px] text-gray-100"
      dir="ltr"
    >
      <span className={`inline-block w-2 h-2 rounded-full ${levelDot[skill.level]}`} />
      {skill.icon && (
        <span className="inline-flex items-center justify-center w-4 h-4 shrink-0">
          <StackIcon name={skill.icon as any} variant="dark" className="w-4 h-4" />
        </span>
      )}
      <span className="whitespace-nowrap">{skill.label}</span>
    </span>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      <span>{label}</span>
    </span>
  );
}
