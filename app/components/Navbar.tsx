"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

export function Navbar({
  authButton,
  isSignedIn,
  unreadCount,
  userEmail,
  userName,
}: {
  authButton: React.ReactNode;
  isSignedIn: boolean;
  unreadCount: number;
  userEmail: string | null;
  userName: string | null;
}) {
  const [open, setOpen] = useState(false);

  // "linkon.step@gmail.com" → "linkon.step" — short enough for the navbar and
  // unambiguous between two similar accounts, unlike the display name.
  const emailHandle = userEmail ? userEmail.split("@")[0] : "";

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

        {/* Right cluster — bell shows on BOTH breakpoints */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-muted hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/who-we-are"
              className="text-muted hover:text-foreground transition-colors whitespace-nowrap"
            >
              Who We Are
            </Link>
          </div>

          {isSignedIn && <NotificationBell initialUnreadCount={unreadCount} />}

          {/* Signed-in identity — desktop only. Full email on hover. */}
          {isSignedIn && userEmail && (
            <div
              title={userEmail}
              className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              <span className="max-w-[140px] truncate text-xs text-gray-300">
                {emailHandle}
              </span>
            </div>
          )}

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
          {/* Identity first — the thing you open the menu to check */}
          {isSignedIn && userEmail && (
            <div className="flex items-start gap-2 rounded-md bg-white/5 px-3 py-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {userName ?? emailHandle}
                </p>
                <p className="truncate text-xs text-gray-400">{userEmail}</p>
              </div>
            </div>
          )}

          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="text-gray-300"
          >
            Home
          </Link>
          <Link
            href="/who-we-are"
            onClick={() => setOpen(false)}
            className="text-gray-300"
          >
            Who We Are
          </Link>
          {authButton}
        </div>
      )}
    </nav>
  );
}