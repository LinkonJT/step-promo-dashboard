"use server";

import { auth } from "../../auth";
import { prisma } from "../lib/prisma";
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

    await prisma.post.create({
      data: {
        topic: topic.trim(),
        details: details.trim(),
        authorId: author.id,
        departmentId,
      },
    });

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