"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

export function Navbar({
  authButton,
  isSignedIn,
  unreadCount,
}: {
  authButton: React.ReactNode;
  isSignedIn: boolean;
  unreadCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full sticky top-0 z-50 bg-black border-b-2 border-brand px-4 sm:px-6 py-4">
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

        {/* Right cluster — bell lives here so it shows on BOTH breakpoints */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted hover:text-foreground transition-colors">
              Home
            </Link>
            <Link
              href="/who-we-are"
              className="text-muted hover:text-foreground transition-colors whitespace-nowrap"
            >
              Who We Are
            </Link>
          </div>

          {isSignedIn && <NotificationBell initialUnreadCount={unreadCount}  />}

          {/* Auth button — desktop only; mobile gets it in the dropdown */}
          <div className="hidden md:block">{authButton}</div>

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
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
          <Link href="/" onClick={() => setOpen(false)} className="text-gray-300">
            Home
          </Link>
          <Link href="/who-we-are" onClick={() => setOpen(false)} className="text-gray-300">
            Who We Are
          </Link>
          {authButton}
        </div>
      )}
    </nav>
  );
}