"use client";
import { useEffect, useMemo, useState } from "react";
import { projects } from "@/data/projects";
import dynamic from "next/dynamic";
import Skills from '../components/Skills';
import ContactSection from '../components/ContactSection';

// …existing imports
import Image from "next/image"; // <-- add this

type UIProject = {
  name: string;
  images?: string[];
  cover?: string;
  blurb?: string;
  tech?: string | string[];
  repo?: string;
  demo?: string;
  hidden?: boolean;
};

// Safely type the data coming from "@/data/projects"
const typedProjects = projects as UIProject[];


// Import the VantaBackground
const VantaBackground = dynamic(() => import("./components/VantaBackground"), { ssr: false });

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
  about: {
    bio: "I'm a passionate computer science student with a deep interest in systems architecture, algorithm optimization, and building performance-critical applications. My academic journey has been focused on the intersection of theory and practical implementation.",
    education: [
      { degree: "B.Sc Computer Science", institution: "Jerusalem College of Technology", year: "2021-present" },
      { degree: "Advanced Programming Certification", institution: "Tech Leaders Academy", year: "2020" },
    ],
    interests: ["Distributed Systems", "Algorithm Design", "Scientific Computing", "System Architecture", "Database Optimization"]
  },
  hackathons: [
    { place: "First Place", event: "CampAIgn Matcher", desc: "Advanced OSINT intelligence gathering tool" },
    { place: "Third Place", event: "ResQdoc", desc: "Emergency medical documentation workflow" },
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
  
  /* Skill bars */
  .skill-bar {
    height: 8px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    overflow: hidden;
  }
  .skill-progress {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent-soft));
    border-radius: 4px;
  }
`;

export default function UltraModernPortfolio() {
  // Updated sections array to include all sections
  const sections = ["home", "about", "projects", "skills", "wins", "contact"] as const;
  const active = useActive(sections as unknown as string[]);


  const navigationItems = [
    { id: "contact", label: "Contact" },

    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
    { id: "home", label: "Home" }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <VantaBackground />

      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra-Modern Glass Header */}
        <header className="fixed top-0 left-0 right-0 z-50 glass-header">
          <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
            <div className="text-2xl font-bold tracking-tight text-white enhanced-glow">
              YB
            </div>
            {/* Desktop Navigation - Updated */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map(item => (
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
              href="#contact"
              className="hidden md:block bg-white text-black px-6 py-3 rounded-full text-sm font-semibold magnetic-hover button-glow enhanced-glow"
            >
              Get in Touch
            </a>
          </div>
        </header>

        <main className="pt-20 md:pt-24 relative z-10">
          {/* HERO */}
          <section id="home" className="scroll-mt-32 px-8 md:px-10 py-16 md:py-24 -mt-2 relative section-glow scroll-reveal">
            <div className="max-w-7xl mx-auto text-center relative z-10">
              <div className="relative inline-block mb-16 floating">
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

          {/* ABOUT SECTION (NEW) */}
          <section id="about" className="scroll-mt-24 px-8 py-32 relative section-glow scroll-reveal">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-24 scroll-reveal">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight enhanced-glow">
                  About <span className="gradient-text">Me</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Passionate about building innovative solutions and solving complex problems
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-16 items-start">
                <div className="lg:w-1/2 glass-card p-8 scroll-reveal">
                  <h3 className="text-3xl font-bold text-white mb-6">Bio</h3>
                  <p className="text-gray-300 leading-relaxed mb-8">
                    {content.about.bio}
                  </p>
                  
                  <h4 className="text-xl font-bold text-white mb-4">Education</h4>
                  <div className="space-y-6 mb-8">
                    {content.about.education.map((edu, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-[#60a5fa] font-semibold">{edu.degree}</span>
                        <span className="text-gray-300">{edu.institution}</span>
                        <span className="text-gray-400 text-sm">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:w-1/2 glass-card p-8 scroll-reveal">
                  <h3 className="text-3xl font-bold text-white mb-6">Areas of Interest</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {content.about.interests.map((interest, index) => (
                      <div key={index} className="glass-card p-4 text-center">
                        <p className="text-gray-200">{interest}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <h4 className="text-xl font-bold text-white mb-4">Personal Philosophy</h4>
                    <p className="text-gray-300 leading-relaxed">
                      I believe in building systems that are not just functional, but elegant, maintainable, and efficient. 
                      Every project is an opportunity to create something that makes a genuine difference.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* PROJECTS SECTION - REFACTORED */}
          <section id="projects" className="scroll-mt-24 py-16 px-6 md:px-12 relative bg-[#0a0e17]">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16 scroll-reveal">
                <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight enhanced-glow">
                  Featured <span className="gradient-text">Projects</span>
                </h2>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                  Cutting-edge solutions built with precision and innovation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {typedProjects.filter(p => !p.hidden).map((project) => (
                  <div 
                    key={project.name} 
                    className="rounded-2xl border border-gray-800 bg-gray-900/30 shadow-lg shadow-black/40 overflow-hidden transition-all duration-300 hover:shadow-blue-500/30 hover:scale-[1.02]"
                  >
                    <div className="aspect-video w-full relative overflow-hidden">
                      <div className="aspect-video w-full relative overflow-hidden">
          <Image
            src={project.images?.[0] || project.cover || "/placeholder-project.jpg"}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            unoptimized
          />
        </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">{project.name}</h3>
                      
                      <p className="text-gray-400 mb-4">
                        {project.blurb}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-5">
                        {(() => {
                          const raw = project.tech;
                          const techList: string[] = Array.isArray(raw)
                            ? raw
                            : typeof raw === "string"
                              ? raw.split("·").map((s) => s.trim()).filter(Boolean)
                              : [];

                          return techList.map((tech: string, index: number) => (
                            <span
                              key={`${project.name}-tech-${index}`}
                              className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300"
                            >
                              {tech}
                            </span>
                          ));
                        })()}
                      </div>
                      
                      <div className="flex gap-4 mt-4">
                        {project.repo !== "#" && (
                          <a 
                            href={project.repo} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.026 1.591 1.026 2.682 0 3.841-2.337 4.687-4.565 4.934.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0022 12C22 6.477 17.523 2 12 2z" />
                            </svg>
                            Repository
                          </a>
                        )}
                        
                        {project.demo !== "#" && (
                          <a 
                            href={project.demo} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M15.75 2H8.25C7.00736 2 6 3.00736 6 4.25V19.75C6 20.9926 7.00736 22 8.25 22H15.75C16.9926 22 18 20.9926 18 19.75V4.25C18 3.00736 16.9926 2 15.75 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                              <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          <Skills />

          {/* ACHIEVEMENTS SECTION */}
          <section id="wins" className="scroll-mt-24 px-8 py-32 relative scroll-reveal">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#171717] via-black to-[#0a0a0a]"></div>
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


          <ContactSection />
        </main>

        {/* FLOATING MOBILE NAVIGATION - UPDATED */}
        <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 scroll-reveal">
          <div className="glass-header rounded-2xl p-2 overflow-x-auto">
            <div className="flex justify-between whitespace-nowrap">
              {navigationItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`text-center py-3 px-5 mx-1 rounded-xl text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#60a5fa] text-black shadow-lg"
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