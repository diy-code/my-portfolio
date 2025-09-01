import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold">Daniel Pilant</h1>
        <p className="mt-4 text-lg text-neutral-300">
          Software Engineer • Product Builder • Community Leader
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/projects"
            className="rounded-lg bg-white text-neutral-900 px-6 py-3 font-semibold hover:bg-neutral-200"
          >
            View Projects
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-neutral-700 px-6 py-3 hover:bg-neutral-900"
          >
            Contact Me
          </Link>
        </div>
      </section>
    </main>
  );
}
