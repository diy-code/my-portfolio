export default function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-400">
        © {new Date().getFullYear()} Yitshac Brody
      </div>
    </footer>
  );
}
