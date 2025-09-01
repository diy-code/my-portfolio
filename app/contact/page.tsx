"use client";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true); // דמו. בהמשך נחבר לשירות מייל/שרת.
  };

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">צור קשר</h1>
      {sent ? (
        <div className="p-4 border border-green-600/40 rounded-lg">
          הטופס נשלח (דמו). אפשר לחבר ל-Formspree/Email בהמשך.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2" placeholder="שם" required />
          <input type="email" className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2" placeholder="Email" required />
          <textarea className="w-full rounded-lg bg-neutral-900 border border-neutral-700 px-3 py-2" rows={5} placeholder="הודעה" required />
          <button className="rounded-lg px-4 py-2 border border-neutral-700 hover:bg-neutral-900">שליחה</button>
        </form>
      )}
    </main>
  );
}
