"use client";
import { useState } from "react";

/** ========= EASY CUSTOMIZATION (page-local only) =========
 * Edit the content below. This affects ONLY this page.
 * You can later move this object to /content.json and import it if desired.
 */

type LinkPair = { repo?: string; demo?: string };
type Project = { name: string; stack: string; blurb: string; links?: LinkPair };

const content = {
  name: "Yitshac Brody",
  title: "Computer Science Student @ JCT",
  tagline:
    "Engineer who ships clear, tested solutions. Backend-leaning with strong OOP and data fundamentals.",
  subhead:
    "C++ • Python • C#/.NET • SQL • Java • Docker • PostgreSQL • GitHub • Multithreading • TDD • OSINT",
  emailPrimary: "yitshacbw@gmail.com",
  emailSecondary: "yb151617@gmail.com",
  availability:
    "Available 3–4 days/week • From mid-September • Israel (US & IL citizenship)",
  showGPA: true,
  gpaText: "GPA ≈ 90",
  ctas: {
    resumeUrl: "#", // replace with your resume PDF
    githubUrl: "#", // replace with your GitHub
    linkedinUrl: "#", // replace with your LinkedIn
  },
  projects: [
    {
      name: "MetaGym",
      stack: "Flutter • FastAPI",
      blurb:
        "Modern fitness app with admin facility management, user sub-programs, and clean docs. Red/black brand, wireframes approved.",
      links: { repo: "#", demo: "#" },
    },
    {
      name: "MissionForce 2025",
      stack: ".NET 8 • WPF • Observer",
      blurb:
        "Volunteer management desktop system with N-tier architecture, content controls, and dialog workflows.",
      links: { repo: "#", demo: "#" },
    },
    {
      name: "HR Management – Retirement Home",
      stack: "PostgreSQL • Advanced SQL",
      blurb:
        "DB with triggers, procedures, views, and medical-system integration. Stage V GUI executes queries and procedures.",
      links: { repo: "#", demo: "#" },
    },
    {
      name: "Java Ray Tracer",
      stack: "Java • BVH • PBR",
      blurb:
        "Physically-based renderer with reflections, refractions, shadows, BVH acceleration, and TDD-tested components.",
      links: { repo: "#", demo: "#" },
    },
  ] as Project[],
  hackathons: [
    "1st Place — CampAIgn Matcher (OSINT tool)",
    "3rd Place — MissionForce 2025 (Volunteer system)",
    "ResQdoc — Emergency medical documentation workflow",
  ],
} as const;

/** Optional: plug a forms endpoint (e.g., Formspree). Leave empty for demo. */
const FORMS_ENDPOINT = ""; // e.g., "https://formspree.io/f/xxxxxx"

export default function HomePage() {
  const [sent, setSent] = useState<"idle" | "ok" | "err">("idle");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!FORMS_ENDPOINT) {
      setSent("ok"); // demo mode
      return;
    }
    try {
      setLoading(true);
      const data = new FormData(e.currentTarget);
      const res = await fetch(FORMS_ENDPOINT, { method: "POST", body: data });
      setSent(res.ok ? "ok" : "err");
    } catch {
      setSent("err");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-bold">{content.name}</h1>
        <p className="text-lg text-neutral-300">{content.title}</p>
        <p className="text-neutral-400">{content.tagline}</p>
        <p className="text-sm text-neutral-500">{content.subhead}</p>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {content.ctas.resumeUrl && (
            <a
              href={content.ctas.resumeUrl}
              className="rounded-lg border border-neutral-700 px-4 py-2 hover:bg-neutral-900"
              aria-label="Download Resume"
            >
              Download Resume
            </a>
          )}
          {content.ctas.githubUrl && (
            <a
              href={content.ctas.githubUrl}
              className="rounded-lg border border-neutral-700 px-4 py-2 hover:bg-neutral-900"
              target="_blank"
              rel="noreferrer"
              aria-label="Open GitHub"
            >
              GitHub
            </a>
          )}
          {content.ctas.linkedinUrl && (
            <a
              href={content.ctas.linkedinUrl}
              className="rounded-lg border border-neutral-700 px-4 py-2 hover:bg-neutral-900"
              target="_blank"
              rel="noreferrer"
              aria-label="Open LinkedIn"
            >
              LinkedIn
            </a>
          )}
          <a
            href={`mailto:${content.emailPrimary}`}
            className="rounded-lg border border-neutral-700 px-4 py-2 hover:bg-neutral-900"
            aria-label="Contact via email"
          >
            Contact
          </a>
        </div>

        <div className="mt-2 text-xs text-neutral-500">
          {content.availability}
          {content.showGPA ? ` • ${content.gpaText}` : null}
        </div>
      </section>

      {/* Projects */}
      <section aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="text-2xl font-bold mb-4">
          Highlighted Projects
        </h2>
        <div className="space-y-4">
          {content.projects.map((p) => (
            <article
              key={p.name}
              className="border border-neutral-700/70 rounded-lg p-4"
              aria-labelledby={`proj-${p.name}`}
            >
              <div className="flex items-center justify-between gap-4">
                <h3 id={`proj-${p.name}`} className="font-semibold">
                  {p.name}
                </h3>
                <span className="text-xs text-neutral-500">{p.stack}</span>
              </div>
              <p className="mt-1 text-sm text-neutral-400">{p.blurb}</p>
              <div className="mt-3 flex gap-3">
                {p.links?.repo && (
                  <a
                    href={p.links.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline underline-offset-4 text-neutral-300"
                  >
                    View Code
                  </a>
                )}
                {p.links?.demo && (
                  <a
                    href={p.links.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm underline underline-offset-4 text-neutral-300"
                  >
                    Demo
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Hackathon Wins */}
      <section aria-labelledby="hackathons-heading">
        <h2 id="hackathons-heading" className="text-2xl font-bold mb-4">
          Hackathon Achievements
        </h2>
        <ul className="list-disc list-inside text-neutral-400 space-y-2">
          {content.hackathons.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </section>

      {/* Contact */}
      <section id="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="text-2xl font-bold mb-4">
          Get in Touch
        </h2>
        <div className="text-sm text-neutral-400 mb-3">
          Email:{" "}
          <a
            className="underline underline-offset-4"
            href={`mailto:${content.emailPrimary}`}
          >
            {content.emailPrimary}
          </a>
          {content.emailSecondary ? ` • ${content.emailSecondary}` : null}
        </div>

        {sent === "ok" ? (
          <div
            className="p-4 border border-green-600/40 rounded-lg"
            role="status"
            aria-live="polite"
          >
            Your message was {FORMS_ENDPOINT ? "sent" : "“sent” (demo)"}.
          </div>
        ) : sent === "err" ? (
          <div
            className="p-4 border border-red-600/40 rounded-lg"
            role="alert"
          >
            Something went wrong. Try again later.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3" noValidate>
            <input
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2"
              placeholder="Name"
              required
              name="name"
              aria-label="Name"
            />
            <input
              type="email"
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2"
              placeholder="Email"
              required
              name="email"
              aria-label="Email"
              inputMode="email"
              autoComplete="email"
            />
            <textarea
              className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2"
              rows={5}
              placeholder="Message"
              required
              name="message"
              aria-label="Message"
            />
            {/* honeypot field to reduce spam (remains hidden visually) */}
            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <button
              className="rounded-lg px-4 py-2 border border-neutral-700 hover:bg-neutral-900 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
