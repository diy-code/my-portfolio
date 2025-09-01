export default function ResumePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">רזומה</h1>
      <a className="underline" href="/resume.pdf" download>הורד PDF</a>
      <iframe src="/resume.pdf" className="w-full h-[80vh] mt-6" />
    </main>
  );
}
