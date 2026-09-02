"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@heroui/react";

export function AuthToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("signedIn") === "true") {
      toast.success("Signed in successfully");
      router.replace("/");
    }
    if (searchParams.get("signedOut") === "true") {
      toast("Signed out");
      router.replace("/");
    }
    if (searchParams.get("blocked") === "true") {
      toast.danger("Please sign in to view that page");
      router.replace("/");
    }
  }, [searchParams, router]);

  return null;
}