"use client";
import { useEffect, useMemo, useState } from "react";
import InteractiveBackground from "./components/InteractiveBackground";
import CodeStream from "./components/CodeStream";
import HeroModel3D from "./components/HeroModel3D";

/** ---- קל לקסטומיזציה ---- */
const content = {
  name: "Yitshac Brody",
  title: "Computer Science Student @ JCT",
  subhead: "C++ · Python · C#/.NET · SQL · Java · Docker · PostgreSQL · Multithreading · TDD · OSINT",
  availability: "Available 3–4 days/week • From mid-September • US & IL citizenship • GPA ≈ 90",
  email: "yitshacbw@gmail.com",
  github: "#",
  linkedin: "#",
  resume: "#",
  projects: [
    { 
      name: "MetaGym", 
      blurb: "Flutter + FastAPI fitness ecosystem with comprehensive admin workflows and user engagement tracking.", 
      tech: "Flutter · Python · FastAPI · Redis",
      repo: "#", 
      demo: "#" 
    },
    { 
      name: "MissionForce 2025", 
      blurb: ".NET 8 WPF volunteer management system featuring N-tier architecture and Observer pattern implementation.", 
      tech: ".NET 8 · WPF · C# · Entity Framework",
      repo: "#", 
      demo: "#" 
    },
    { 
      name: "HR – Retirement Home", 
      blurb: "PostgreSQL-powered system with advanced views, triggers, procedures, and medical system integration.", 
      tech: "PostgreSQL · Advanced SQL · Medical APIs",
      repo: "#", 
      demo: "#" 
    },
    { 
      name: "Java Ray Tracer", 
      blurb: "Physically-based rendering engine with BVH optimization, reflections, refractions, and comprehensive TDD.", 
      tech: "Java · PBR · BVH · JUnit · Performance",
      repo: "#", 
      demo: "#" 
    },
  ],
  hackathons: [
    { place: "🥇", event: "CampAIgn Matcher", desc: "Advanced OSINT intelligence gathering tool" },
    { place: "🥉", event: "MissionForce 2025", desc: "Comprehensive volunteer coordination system" },
    { place: "🎯", event: "ResQdoc", desc: "Emergency medical documentation workflow" },
  ],
};

/** ---- Advanced Intersection Observer Hook ---- */
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
            { rootMargin: "-10% 0px -80% 0px", threshold: [0, 0.2, 0.5, 0.8, 1] }
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

/** ---- Custom Styles ---- */
const styles = `
  :root {
    --accent:#0A84FF;
    --accent-soft:#62B2FF;
    --glass-bg:rgba(255,255,255,0.04);
    --glass-border:rgba(255,255,255,0.08);
    --radius-xl:28px;
    --radius-lg:20px;
    --transition:0.5s cubic-bezier(.4,.2,.2,1);
  }
  /* Replace previous stronger glow-pulse & heavy shadows with subtle depth */
  .glass-card {
    background: var(--glass-bg);
    backdrop-filter: blur(22px) saturate(140%);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius-xl);
    transition: border-color .4s ease, transform .5s cubic-bezier(.33,.1,.15,1);
  }
  .glass-card:hover {
    border-color: rgba(255,255,255,0.16);
    transform: translateY(-4px);
  }
  .gradient-text {
    background: linear-gradient(120deg,var(--accent) 0%, var(--accent-soft) 55%, #ffffff 120%);
    -webkit-background-clip:text;
    background-clip:text;
    color: transparent;
    animation: gt-move 6s ease-in-out infinite;
    background-size:180% 180%;
  }
  @keyframes gt-move { 0%,100%{background-position:0% 50%;} 50%{background-position:100% 50%;} }
  .btn-primary {
    position:relative;
    display:inline-flex;
    align-items:center;
    justify-content:center;
    gap:.5rem;
    padding:0.9rem 2.2rem;
    font-weight:600;
    background:linear-gradient(140deg,var(--accent) 0%, var(--accent-soft) 70%);
    color:#fff;
    border-radius:40px;
    box-shadow:0 4px 18px -4px rgba(10,132,255,0.4);
    transition:transform .5s cubic-bezier(.4,.2,.2,1), box-shadow .5s;
  }
  .btn-primary:hover {
    transform:translateY(-3px);
    box-shadow:0 8px 28px -6px rgba(10,132,255,0.55);
  }
  .btn-outline {
    position:relative;
    padding:0.85rem 2rem;
    border-radius:40px;
    border:1px solid var(--glass-border);
    color:#e5e7eb;
    background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.07),rgba(255,255,255,0.02));
    transition:var(--transition);
  }
  .btn-outline:hover {
    border-color:rgba(255,255,255,0.18);
    color:#fff;
  }
  .nav-link {
    position:relative;
    padding:.25rem 0;
    transition:color .3s ease;
  }
  .nav-link::after {
    content:"";
    position:absolute;
    left:50%; bottom:-10px;
    width:0; height:2px;
    background:linear-gradient(90deg,transparent,var(--accent),transparent);
    transform:translateX(-50%);
    transition:width .5s cubic-bezier(.4,.2,.2,1);
  }
  .nav-link.active::after,
  .nav-link:hover::after { width:100%; }
  header.glass-header {
    background:rgba(10,10,12,0.6);
    backdrop-filter:blur(30px) saturate(160%);
    border-bottom:1px solid rgba(255,255,255,0.06);
  }
  /* Section reveal (lighter) */
  .scroll-reveal {
    opacity:0;
    transform:translateY(28px);
    animation:reveal .9s cubic-bezier(.25,.4,.18,1) forwards;
  }
  @keyframes reveal {
    0% { opacity:0; transform:translateY(28px) scale(.98); }
    60% { opacity:1; }
    100% { opacity:1; transform:translateY(0) scale(1); }
  }
  .section-glow::before {
    background:radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
  }
`;

export default function UltraModernPortfolio() {
  const sections = ["home", "projects", "wins", "contact"] as const;
  const active = useActive(sections as unknown as string[]);
  const [neuralNodes, setNeuralNodes] = useState<{ id: number; top: number; left: number; delay: number }[]>([]);
  const [particles, setParticles] = useState<{ id: number; top: number; left: number; delay: number }[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize random elements on client side only (REMOVED MATRIX RAIN)
    const neuralData = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 4,
    }));
    
    const particleData = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 15,
    }));
    
    setNeuralNodes(neuralData);
    setParticles(particleData);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <InteractiveBackground />
      <CodeStream />
      <HeroModel3D />
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra-Modern Glass Header */}
        <header className="fixed top-0 left-0 right-0 z-50 glass-header">
          <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
            <div className="text-2xl font-bold tracking-tight text-white enhanced-glow">
              YB
            </div>
            <nav className="hidden md:flex items-center space-x-12">
              {[
                { id: "home", label: "Home" },
                { id: "projects", label: "Projects" },
                { id: "wins", label: "Achievements" },
                { id: "contact", label: "Contact" },
              ].map(item => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-link text-sm font-medium tracking-wide ${active === item.id ? "active text-white" : "text-gray-400 hover:text-white"}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <a
              href={`mailto:${content.email}`}
              className="hidden md:block bg-white text-black px-6 py-3 rounded-full text-sm font-semibold magnetic-hover button-glow enhanced-glow"
            >
              Get in Touch
            </a>
          </div>
        </header>

        <main className="pt-20 md:pt-24 relative z-10">
          {/* HERO */}
         <section id="home" className="scroll-mt-0 px-8 py-16 md:py-24 -mt-0 md:-mt-0 section-glow relative scroll-reveal">
            <div className="max-w-7xl mx-auto text-center relative z-10">
              <div className="mb-16 floating">
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white mb-10 leading-none">
                  {content.name.split(" ").map((w,i)=>(
                    <span key={i} className={`block ${i===1?"gradient-text":""}`}>{w}</span>
                  ))}
                </h1>
                <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#60a5fa] to-transparent mx-auto mb-8 enhanced-glow"></div>
                <p className="text-2xl md:text-3xl text-gray-300 font-light mb-4 tracking-wide scroll-reveal">
                  {content.title}
                </p>
              </div>
              
              <div className="max-w-4xl mx-auto mb-12 scroll-reveal">
                <p className="text-lg md:text-xl text-gray-400 leading-relaxed mb-8">
                  {content.subhead}
                </p>
                <p className="text-sm text-gray-500 tracking-wide">
                  {content.availability}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mt-10">
                <a href="#projects" className="btn-primary">Explore My Work</a>
                {content.resume !== "#" && (
                  <a
                    href={content.resume}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline"
                  >
                    Download Resume
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* FLOATING PROJECTS SECTION */}
          <section id="projects" className="scroll-mt-24 px-8 py-32 relative section-glow scroll-reveal">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-24 scroll-reveal">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight enhanced-glow">
                  Featured <span className="gradient-text">Projects</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Cutting-edge solutions built with precision and innovation
                </p>
              </div>

              <div className="grid gap-12 lg:gap-16">
                {content.projects.map((project, index) => (
                  <article 
                    key={project.name} 
                    className={`group glass-card rounded-3xl p-12 md:p-16 magnetic-hover relative overflow-hidden scroll-reveal ${
                      index % 2 === 0 ? 'floating' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#60a5fa]/5 via-transparent to-[#3b82f6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <div className="relative z-10">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
                        <div className="mb-6 lg:mb-0">
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-[#60a5fa] transition-colors duration-300">
                            {project.name}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {project.tech.split(' · ').map((tech, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors duration-200"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-4 shrink-0">
                          {project.repo !== "#" && (
                            <a
                              href={project.repo}
                              target="_blank"
                              rel="noreferrer"
                              className="glass-card text-gray-300 hover:text-white px-6 py-3 rounded-full text-sm font-medium magnetic-hover border-white/10 hover:border-white/20"
                            >
                              View Code
                            </a>
                          )}
                          {project.demo !== "#" && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-white text-black px-6 py-3 rounded-full text-sm font-bold magnetic-hover shadow-lg"
                            >
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-lg lg:text-xl">
                        {project.blurb}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* PREMIUM ACHIEVEMENTS SECTION */}
          <section id="wins" className="scroll-mt-24 px-8 py-32 relative scroll-reveal">
            <div className="absolute inset-0 bg-gradient-to-br from-[#171717] via-black to-[#0a0a0a]"></div>
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-24 scroll-reveal">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight enhanced-glow">
                  Competition <span className="gradient-text">Excellence</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                  Proven track record of delivering exceptional results under pressure
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                {content.hackathons.map((hack, index) => (
                  <div
                    key={hack.event}
                    className={`glass-card rounded-3xl p-8 lg:p-12 text-center magnetic-hover group relative overflow-hidden scroll-reveal ${
                      index === 1 ? 'floating' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#60a5fa]/10 via-transparent to-[#3b82f6]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10">
                      <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 enhanced-glow">
                        {hack.place}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#60a5fa] transition-colors duration-300">
                        {hack.event}
                      </h3>
                      <p className="text-gray-400 leading-relaxed lg:text-lg">
                        {hack.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* MAGNETIC CONTACT SECTION */}
          <section id="contact" className="scroll-mt-24 px-8 py-32 section-glow relative scroll-reveal">
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight floating enhanced-glow">
                Let&apos;s Build the <span className="gradient-text">Future</span>
              </h2>
              <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed scroll-reveal">
                Ready to contribute to revolutionary projects and solve complex engineering challenges
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <a href={`mailto:${content.email}`} className="btn-primary">{content.email}</a>
                {content.github !== "#" && (
                  <a href={content.github} target="_blank" rel="noreferrer" className="btn-outline">
                    GitHub Profile
                  </a>
                )}
                {content.linkedin !== "#" && (
                  <a href={content.linkedin} target="_blank" rel="noreferrer" className="btn-outline">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </section>
        </main>

        {/* FLOATING MOBILE NAVIGATION */}
        <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 scroll-reveal">
          <div className="glass-header rounded-2xl p-2">
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "home", label: "Home" },
                { id: "projects", label: "Work" },
                { id: "wins", label: "Wins" },
                { id: "contact", label: "Contact" },
              ].map((item) => {
                const isActive = active === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`text-center py-3 px-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#60a5fa] text-black shadow-lg scale-105"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}