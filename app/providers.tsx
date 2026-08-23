"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";


export function Providers({ children }: { children: React.ReactNode }) {
  // useState (not a plain const) so the QueryClient survives re-renders
  // but is still created fresh per browser session, not shared across users.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute — data is "fresh" for this long before refetching
            refetchOnWindowFocus: true, // re-check when MD switches back to the browser tab
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}