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