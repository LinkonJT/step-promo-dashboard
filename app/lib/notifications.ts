import { prisma } from "./prisma";

/** Returns the ids of all ADMIN-tier users (MD + Linkon). */
export async function getAdminUserIds(): Promise<string[]> {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  });
  return admins.map((a) => a.id);
}