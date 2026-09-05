"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getNotifications, markAllAsRead } from "../actions/notifications";

type NotificationItem = {
  id: string;
  type: "NEW_POST" | "NEW_COMMENT";
  createdAt: Date;
  isRead: boolean;
  actorName: string;
  postTopic: string;
  href: string;
};

export default function NotificationBell({
  initialUnreadCount,
}: {
  initialUnreadCount: number;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Badge state: the server's count is the source of truth. Opening the
  // dropdown dismisses it locally; a new count from the server undoes that.
  const [dismissed, setDismissed] = useState(false);
  const [prevCount, setPrevCount] = useState(initialUnreadCount);

  if (prevCount !== initialUnreadCount) {
    setPrevCount(initialUnreadCount);
    setDismissed(false);
  }

  const unreadCount = dismissed ? 0 : initialUnreadCount;

  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  async function handleToggle() {
    const next = !open;
    setOpen(next);
    if (!next) return;

    // Fetch fresh on every open — cheap, and always accurate.
    setLoading(true);
    try {
      const data = await getNotifications();
      setItems(data as NotificationItem[]);

      if (unreadCount > 0) {
        setDismissed(true); // optimistic
        await markAllAsRead();
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleItemClick(href: string) {
    setOpen(false);
    startTransition(() => router.push(href));
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-gray-300 transition hover:bg-white/10 hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white">Notifications</p>
          </div>

          {loading ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-400">Loading…</p>
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-gray-400">No notifications yet</p>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(item.href)}
                    className={`w-full border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/5 ${
                      item.isRead ? "" : "bg-white/[0.03]"
                    }`}
                  >
                    <p className="text-sm text-gray-200">
                      <span className="font-semibold text-white">
                        {item.actorName}
                      </span>{" "}
                      {item.type === "NEW_POST"
                        ? "created a new post"
                        : "commented on"}{" "}
                      <span className="text-gray-300">{item.postTopic}</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleString("en-GB", {
                        timeZone: "Asia/Dhaka",
                        day: "numeric",
                        month: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}