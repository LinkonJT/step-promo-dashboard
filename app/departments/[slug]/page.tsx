import { auth } from "../../../auth";
import { prisma } from "../../lib/prisma";
import { notFound } from "next/navigation";
import { ProductPhotoGrid } from "../../components/ProductPhotoGrid";
import { CreateTopicModal } from "../../components/CreateTopicModal";
import { PostPeekModal } from "../../components/PostPeekModal";
import { EditPostModal } from "../../components/EditPostModal";
import { Card } from "@heroui/react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function DepartmentPage({ params }: PageProps) {
  const { slug } = await params;

  const department = await prisma.department.findUnique({
    where: { slug },
    include: {
      posts: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
    },
  });

  if (!department) {
    notFound();
  }

  const session = await auth();
  const authorName = session?.user?.name ?? session?.user?.email ?? "Unknown";
  const currentUserEmail = session?.user?.email ?? null;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
      <div className="border-l-4 border-[#B31419] pl-4 mb-6">
        <h1 className="text-2xl font-bold">{department.name}</h1>
        {department.description && (
          <p className="text-gray-400 mt-1">{department.description}</p>
        )}
      </div>

      {department.dashboardUrl && (
        <Link href={department.dashboardUrl} className="block mb-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Card.Header>
              <Card.Title className="text-[#B31419] text-base">
                Open Live Dashboard →
              </Card.Title>
            </Card.Header>
          </Card>
        </Link>
      )}

      {department.name === "Tote-Bag Operations" && <ProductPhotoGrid />}

      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-lg font-semibold">Updates</h2>
        <CreateTopicModal departmentId={department.id} authorName={authorName} />
      </div>

      {department.posts.length === 0 ? (
        <Card>
          <Card.Header>
            <Card.Description className="text-center py-8 w-full">
              No updates yet in this department.
            </Card.Description>
          </Card.Header>
        </Card>
      ) : (
        <div className="space-y-3">
          {department.posts.map((post) => (
            <div key={post.id} className="relative">
              <PostPeekModal post={post} departmentSlug={slug} />
              {currentUserEmail === post.author.email && (
                <div className="absolute top-3 right-3 z-10">
                  <EditPostModal post={post} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}