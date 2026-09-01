"use server";

import { auth } from "../../auth";
import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";

export async function createComment({
  postId,
  departmentSlug,
  text,
}: {
  postId: string;
  departmentSlug: string;
  text: string;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated." };
  }
  if (!text.trim()) {
    return { error: "Comment cannot be empty." };
  }

  try {
    const author = await prisma.user.findUniqueOrThrow({
      where: { email: session.user.email },
      select: { id: true },
    });

    await prisma.comment.create({
      data: { text: text.trim(), authorId: author.id, postId },
    });

    revalidatePath(`/departments/${departmentSlug}/${postId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to create comment:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function updateComment({
  commentId,
  departmentSlug,
  text,
}: {
  commentId: string;
  departmentSlug: string;
  text: string;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated." };
  }
  if (!text.trim()) {
    return { error: "Comment cannot be empty." };
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment) {
      return { error: "Comment not found." };
    }

    if (comment.author.email !== session.user.email) {
      return { error: "You can only edit your own comments." };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { text: text.trim() },
    });

    revalidatePath(`/departments/${departmentSlug}/${comment.postId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to update comment:", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function softDeleteComment({
  commentId,
  departmentSlug,
}: {
  commentId: string;
  departmentSlug: string;
}) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Not authenticated." };
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { author: true },
    });

    if (!comment) {
      return { error: "Comment not found." };
    }

    if (comment.author.email !== session.user.email) {
      return { error: "You can only delete your own comments." };
    }

    await prisma.comment.update({
      where: { id: commentId },
      data: { deletedAt: new Date() },
    });

    revalidatePath(`/departments/${departmentSlug}/${comment.postId}`);
    return { success: true };
  } catch (err) {
    console.error("Failed to delete comment:", err);
    return { error: "Something went wrong. Please try again." };
  }
}