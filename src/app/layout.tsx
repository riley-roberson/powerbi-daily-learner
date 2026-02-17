import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Power BI Intermediate Daily Learner",
  description: "30 days of intermediate Power BI & DAX challenges",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <nav className="border-b border-gray-800 bg-[#12141a]">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <span className="text-lg font-bold text-[#e87722]">PBI</span>
              <span className="text-sm text-gray-400">Daily Learner</span>
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white transition">
                Home
              </Link>
              <Link href="/curriculum" className="text-gray-400 hover:text-white transition">
                Curriculum
              </Link>
            </div>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
