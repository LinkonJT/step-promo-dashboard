"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/calculator", label: "Calculators", disabled: true },
  { href: "/who-we-are", label: "Who We Are" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <Link href="/" className="font-bold text-lg">
        Step Promo
      </Link>

      <div className="flex items-center gap-6">
        {navLinks.map((link) =>
          link.disabled ? (
            <span
              key={link.href}
              className="text-gray-400 cursor-not-allowed select-none"
              title="Coming soon"
            >
              {link.label}
            </span>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "font-semibold text-black"
                  : "text-gray-600 hover:text-black transition-colors"
              }
            >
              {link.label}
            </Link>
          )
        )}

        {/* Login placeholder — real NextAuth wiring comes later */}
        <button className="px-4 py-1.5 rounded-md bg-black text-white text-sm hover:bg-gray-800 transition-colors">
          Login
        </button>
      </div>
    </nav>
  );
}