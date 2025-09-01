import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-neutral-800 bg-neutral-950/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          Daniel Pilant • Software Engineer
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/projects" className="opacity-80 hover:opacity-100">Projects</Link>
          <Link href="/resume" className="opacity-80 hover:opacity-100">Resume</Link>
          <Link href="/contact" className="opacity-80 hover:opacity-100">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
