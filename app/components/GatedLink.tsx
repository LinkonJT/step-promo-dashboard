"use client";

import Link from "next/link";
import { toast } from "@heroui/react";

export function GatedLink({
  href,
  isSignedIn,
  message,
  className,
  children,
}: {
  href: string;
  isSignedIn: boolean;
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (isSignedIn) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <div
      className={`${className ?? ""} cursor-pointer`}
      role="button"
      tabIndex={0}
      onClick={() => toast.danger(message)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") toast.danger(message);
      }}
    >
      {children}
    </div>
  );
}