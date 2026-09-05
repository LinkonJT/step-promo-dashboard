"use server";

import { auth } from "../../auth";
import { prisma } from "../lib/prisma";
import { getAdminUserIds } from "../lib/notifications";
import { revalidatePath } from "next/cache";

export async function createPost({
  departmentId,
  topic,
  details,
}: {
  departmentId: string;
  topic: string;
  details: string;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated." };
  }

  if (!topic.trim() || !details.trim()) {
    return { error: "Topic and details are required." };
  }

  try {
    const author = await prisma.user.findUniqueOrThrow({
      where: { email: session.user.email },
      select: { id: true },
    });

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
      select: { slug: true },
    });

    if (!department) {
      return { error: "Department not found." };
    }
  const post = await prisma.post.create({
      data: {
        topic: topic.trim(),
        details: details.trim(),
        authorId: author.id,
        departmentId,
      },
      select: { id: true },
    });

    // Notify admins (MD + Linkon), excluding whoever wrote the post.
    const adminIds = await getAdminUserIds();
    const recipientIds = adminIds.filter((id) => id !== author.id);

    if (recipientIds.length > 0) {
      await prisma.notification.createMany({
        data: recipientIds.map((recipientId) => ({
          type: "NEW_POST" as const,
          recipientId,
          actorId: author.id,
          postId: post.id,
        })),
      });
    }

    revalidatePath(`/departments/${department.slug}`);
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Failed to create post:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function updatePost({
  postId,
  topic,
  details,
}: {
  postId: string;
  topic: string;
  details: string;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated." };
  }

  if (!topic.trim() || !details.trim()) {
    return { error: "Topic and details are required." };
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        department: { select: { slug: true } },
      },
    });

    if (!post) {
      return { error: "Post not found." };
    }

    if (post.author.email !== session.user.email) {
      return { error: "You can only edit your own posts." };
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        topic: topic.trim(),
        details: details.trim(),
      },
    });

    revalidatePath(`/departments/${post.department.slug}`);
    revalidatePath(`/departments/${post.department.slug}/${postId}`);
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error("Failed to update post:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function softDeletePost({ postId }: { postId: string }) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated." };
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        department: { select: { slug: true } },
      },
    });

    if (!post) {
      return { error: "Post not found." };
    }

    if (post.author.email !== session.user.email) {
      return { error: "You can only delete your own posts." };
    }

    await prisma.post.update({
      where: { id: postId },
      data: { deletedAt: new Date() },
    });

    revalidatePath(`/departments/${post.department.slug}`);
    revalidatePath("/");

    return { success: true, departmentSlug: post.department.slug };
  } catch (err) {
    console.error("Failed to delete post:", err);
    return { error: "Something went wrong. Please try again." };
  }
}