// /data/projects.ts
export type Project = {
  name: string;
  blurb: string;
  tech: string[];
  repo?: string;
  demo?: string;
  cover?: string;
  hidden?: boolean;
  images?: [string, string];
  size?: "standard" | "large";
};

export const projects: Project[] = [
  {
    name: "MissionForce 2025",
    blurb: ".NET 8 WPF volunteer management with N-tier and Observer.",
    tech: [".NET 8", "WPF", "C#", "EF Core"],
    repo: "https://github.com/DanielPilant/dotNet5785_1426_2126",
    demo: "#",
    cover: "/images/missionforce-1.jpg", 
    images: ["/images/missionforce-1.jpg", "/images/missionforce-2.jpg"]
  },
  {
    name: "HR – Retirement Home",
    blurb: "PostgreSQL system with views, triggers, procedures + medical integration.",
    tech: ["PostgreSQL", "SQL", "Procedures"],
    repo: "#",
    demo: "#",
    cover: "/images/login_screen.png",
    images: ["/images/login_screen.png", "/images/reports_dashboard.png"]
  },
  {
    name: "Java Ray Tracer",
    blurb: "Physically-based renderer with BVH, reflections, refractions, TDD.",
    tech: ["Java", "BVH", "PBR", "JUnit"],
    repo: "#",
    demo: "#",
    cover: "/images/raytracer-1.jpg",
    images: ["/images/raytracer-1.jpg", "/images/raytracer-2.jpg"]
  }
];
