export type Project = {
  slug: string;
  title: string;
  tagline: string;
  tech: string[];
  impact?: string;
  repo?: string;
  demo?: string;
};

export const projects: Project[] = [
  {
    slug: "self-luz",
    title: "Self_Luz (Flutter)",
    tagline: "אפליקציית ניהול מטרות היררכית",
    tech: ["Flutter", "Dart", "sqflite", "Clean Architecture"],
    impact: "ייעול תכנון אישי ל-100+ משתמשים מוקדמים",
    repo: "https://github.com/your/repo",
    demo: "https://your-demo-link",
  },
  {
    slug: "ray-tracer-java",
    title: "Ray Tracer (Java)",
    tagline: "מנוע ריי-טרייסינג עם BVH ו-Soft Shadows",
    tech: ["Java", "OOP", "BVH"],
    impact: "האצת רנדרים פי 3 לעומת בסיס",
    repo: "https://github.com/your/repo",
  },
];
