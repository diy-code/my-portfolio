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
    slug: "meta-gym",
    title: "MetaGym (Flutter + FastAPI)",
    tagline: "אפליקציית כושר מודרנית לניהול תוכניות ואדמיניסטרציה",
    tech: ["Flutter", "Dart", "FastAPI", "Clean Architecture"],
    impact: "אפשרה בניית תתי-תוכניות מותאמות אישית וסקיילביליות גבוהה",
    repo: "https://github.com/your/meta-gym-repo",
    demo: "https://your-meta-gym-demo",
  },
  {
    slug: "missionforce-2025",
    title: "MissionForce 2025 (.NET WPF)",
    tagline: "מערכת ניהול מתנדבים מבוססת N-tier ו-Observer Pattern",
    tech: [".NET 8", "C#", "WPF", "Design Patterns"],
    impact: "ייעול שיבוץ וניהול מתנדבים בארגון תוך חוויית משתמש אינטואיטיבית",
    repo: "https://github.com/your/missionforce-repo",
  },
  {
    slug: "hr-retirement-home",
    title: "HR Management – Retirement Home (PostgreSQL)",
    tagline: "מערכת לניהול משאבי אנוש במוסד סיעודי",
    tech: ["PostgreSQL", "SQL", "Views", "Triggers", "Procedures"],
    impact: "אוטומציה של תהליכי שיבוץ עובדים ושילוב עם מערכת רפואית קיימת",
    repo: "https://github.com/your/hr-management-repo",
  },
  {
    slug: "ray-tracer-java",
    title: "Ray Tracer (Java)",
    tagline: "מנוע ריי-טרייסינג עם BVH, תאורה, החזרות ושקיפויות",
    tech: ["Java", "OOP", "BVH", "TDD"],
    impact: "האצת רנדרים פי 3 לעומת מימוש בסיסי, כולל בדיקות יחידה",
    repo: "https://github.com/your/ray-tracer-repo",
  },
  {
    slug: "resqdoc",
    title: "ResQdoc (Hackathon Project)",
    tagline: "תיעוד רפואי בשעת חירום עם עיבוד שפה טבעית",
    tech: ["Python", "Prompt Engineering", "PDF Generation"],
    impact: "זכה במקום 1 בהאקתון; שיפר זמני תיעוד רופא-חולה ב-40%",
    repo: "https://github.com/your/resqdoc-repo",
  },
];
