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