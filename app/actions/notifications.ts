"use server";

import { auth } from "../../auth";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

/** Current user's id, or null if not signed in. */
async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function getUnreadCount(): Promise<number> {
  const userId = await getCurrentUserId();
  if (!userId) return 0;

  return prisma.notification.count({
    where: {
      recipientId: userId,
      readAt: null,
      post: { deletedAt: null },
    },
  });
}

export async function getNotifications() {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const notifications = await prisma.notification.findMany({
    where: {
      recipientId: userId,
      post: { deletedAt: null },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      type: true,
      createdAt: true,
      readAt: true,
      postId: true,
      actor: { select: { name: true } },
      post: {
        select: {
          topic: true,
          department: { select: { slug: true } },
        },
      },
    },
  });

  // Flatten into a shape the client component can render directly.
  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    createdAt: n.createdAt,
    isRead: n.readAt !== null,
    actorName: n.actor.name,
    postTopic: n.post.topic,
    href: `/departments/${n.post.department.slug}/${n.postId}`,
  }));
}

export async function markAllAsRead() {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Not authenticated." };

  try {
    await prisma.notification.updateMany({
      where: { recipientId: userId, readAt: null },
      data: { readAt: new Date() },
    });

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Failed to mark notifications as read:", err);
    return { error: "Something went wrong." };
  }
}