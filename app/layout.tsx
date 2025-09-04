import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Daniel Pilant — Portfolio",
  description: "Building products. Leading communities. Learning endlessly.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="bg-neutral-950 text-neutral-50 antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
