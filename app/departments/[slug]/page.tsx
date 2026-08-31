import { prisma } from "../../lib/prisma";
import { notFound } from "next/navigation";
import { ProductPhotoGrid } from "../../components/ProductPhotoGrid";
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
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
    },
  });

  if (!department) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Department header */}
      <div className="border-l-4 border-[#B31419] pl-4 mb-6">
        <h1 className="text-2xl font-bold">{department.name}</h1>
        {department.description && (
          <p className="text-gray-400 mt-1">{department.description}</p>
        )}
      </div>

      {/* Dashboard link card */}
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

      {/* Product photo grid — Tote-Bag only */}
      {department.name === "Tote-Bag Operations" && <ProductPhotoGrid />}

      {/* Updates header */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-lg font-semibold">Updates</h2>
        <button className="px-4 py-2 rounded-md bg-[#B31419] text-white hover:opacity-90">
          + Create Topic
        </button>
      </div>

      {/* Posts list */}
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
            <Link key={post.id} href={`/departments/${slug}/${post.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Card.Header>
                  <div className="flex justify-between items-start w-full">
                    <Card.Title className="text-black text-base">
                      {post.topic}
                    </Card.Title>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {post.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <Card.Description className="text-gray-600 line-clamp-2">
                    {post.details}
                  </Card.Description>
                  <p className="text-xs text-gray-400 mt-1">
                    — {post.author.name}
                  </p>
                </Card.Header>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}