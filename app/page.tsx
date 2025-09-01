"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/** ---- קל לקסטומיזציה ---- */
const content = {
  name: "Yitshac Brody",
  title: "Computer Science Student @ JCT",
  subhead:
    "C++ · Python · C#/.NET · SQL · Java · Docker · PostgreSQL · Multithreading · TDD · OSINT",
  availability: "Available 3–4 days/week • From mid-September • US & IL citizenship • GPA ≈ 90",
  email: "yitshacbw@gmail.com",
  github: "#",
  linkedin: "#",
  resume: "#",
  projects: [
    { name: "MetaGym", blurb: "Flutter + FastAPI fitness app with admin & user flows.", repo: "#", demo: "#" },
    { name: "MissionForce 2025", blurb: ".NET 8 WPF volunteer management with Observer.", repo: "#", demo: "#" },
    { name: "HR – Retirement Home", blurb: "PostgreSQL + views/triggers/procedures + medical integration.", repo: "#", demo: "#" },
    { name: "Java Ray Tracer", blurb: "PBR, BVH, reflections/refractions, TDD.", repo: "#", demo: "#" },
  ],
  hackathons: [
    "1st Place — CampAIgn Matcher (OSINT tool)",
    "3rd Place — MissionForce 2025 (Volunteer system)",
    "ResQdoc — Emergency medical documentation workflow",
  ],
};

/** ---- Hook קטן להדגשת הטאב הפעיל לפי גלילה ---- */
function useActive(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const observer = useMemo(
    () =>
      typeof window !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((e) => {
                if (e.isIntersecting) setActive(e.target.id);
              });
            },
            { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.2, 0.6, 1] }
          )
        : null,
    []
  );

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean) as Element[];
    sections.forEach((el) => observer?.observe(el));
    return () => sections.forEach((el) => observer?.unobserve(el));
  }, [ids, observer]);

  return active;
}

export default function SinglePage() {
  const sections = ["home", "projects", "wins", "contact"] as const;
  const active = useActive(sections as unknown as string[]);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-8 space-y-16">
      {/* HOME */}
      <section id="home" className="scroll-mt-24 text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold">{content.name}</h1>
        <p className="text-lg text-neutral-300">{content.title}</p>
        <p className="text-sm text-neutral-400">{content.subhead}</p>
        <p className="text-xs text-neutral-500">{content.availability}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {content.resume !== "#" && (
            <a href={content.resume} className="rounded-lg border border-neutral-700 px-4 py-2 hover:bg-neutral-900" target="_blank" rel="noreferrer">
              Download Resume
            </a>
          )}
          {content.github !== "#" && (
            <a href={content.github} className="rounded-lg border border-neutral-700 px-4 py-2 hover:bg-neutral-900" target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {content.linkedin !== "#" && (
            <a href={content.linkedin} className="rounded-lg border border-neutral-700 px-4 py-2 hover:bg-neutral-900" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          <a href={`mailto:${content.email}`} className="rounded-lg border border-neutral-700 px-4 py-2 hover:bg-neutral-900">
            Contact
          </a>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">Highlighted Projects</h2>
        <div className="space-y-4">
          {content.projects.map((p) => (
            <article key={p.name} className="border border-neutral-700/70 rounded-lg p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold">{p.name}</h3>
              </div>
              <p className="mt-1 text-sm text-neutral-400">{p.blurb}</p>
              <div className="mt-3 flex gap-3">
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4 text-neutral-300">
                    View Code
                  </a>
                )}
                {p.demo && (
                  <a href={p.demo} target="_blank" rel="noreferrer" className="text-sm underline underline-offset-4 text-neutral-300">
                    Demo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WINS */}
      <section id="wins" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">Hackathon Achievements</h2>
        <ul className="list-disc list-inside text-neutral-400 space-y-2">
          {content.hackathons.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </section>

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-24">
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <div className="text-sm text-neutral-400">
          Email:{" "}
          <a className="underline underline-offset-4" href={`mailto:${content.email}`}>
            {content.email}
          </a>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-800 bg-neutral-950/90 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/75"
        role="navigation"
        aria-label="Bottom"
        style={{ paddingBottom: "max(0px, var(--safe-bottom))" }}
      >
        <ul className="mx-auto max-w-3xl px-4 py-2 grid grid-cols-4 gap-2 text-sm">
          {[
            { id: "home", label: "Home" },
            { id: "projects", label: "Projects" },
            { id: "wins", label: "Wins" },
            { id: "contact", label: "Contact" },
          ].map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id} className="text-center">
                <a
                  href={`#${item.id}`}
                  className={
                    "block rounded-lg px-3 py-2 border " +
                    (isActive
                      ? "border-neutral-300 text-neutral-100"
                      : "border-neutral-800 text-neutral-400 hover:bg-neutral-900")
                  }
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </main>
  );
}
