"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function Navbar({ authButton }: { authButton: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full border-b-2 border-brand px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
  <Link href="/" className="flex items-center gap-2">
  <Image
    src="/step-logo.jpeg"
    alt="Step"
    width={50}
    height={40}
    className="object-contain rounded-2xl"
  />
  <span className="font-bold text-lg whitespace-nowrap mt-2">
    Group Portal
  </span>
</Link>
        {/* Desktop links */}
 <div className="hidden md:flex items-center gap-6">
  <Link href="/" className="text-muted hover:text-foreground transition-colors">
    Home
  </Link>
  <Link href="/who-we-are" className="text-muted hover:text-foreground transition-colors whitespace-nowrap">
    Who We Are
  </Link>
  {authButton}
</div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-current mb-1" />
          <div className="w-5 h-0.5 bg-current mb-1" />
          <div className="w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200">
          <Link href="/" onClick={() => setOpen(false)} className="text-gray-600">
            Home
          </Link>
          <span className="text-gray-400">Calculators</span>
          <Link href="/who-we-are" onClick={() => setOpen(false)} className="text-gray-600">
            Who We Are
          </Link>
          {/* <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="px-4 py-1.5 rounded-md bg-black text-white text-sm text-center"
          >
            Login
          </Link> */}
          {/* <div onClick={() => setOpen(false)}>{authButton}</div> */}
          {authButton}

        </div>
      )}
    </nav>
  );
}