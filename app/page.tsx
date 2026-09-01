import Image from "next/image";
import Link from "next/link";
import { prisma } from "./lib/prisma";
import { Card } from "@heroui/react";

export default async function HomePage() {
  const departments = await prisma.department.findMany({
    orderBy: { order: "asc" },
  });

  const recentPosts = await prisma.post.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { author: true, department: true },
  });

  return (
    <main className="flex flex-col md:px-2 sm:px-4 py-10 gap-12 w-full max-w-7xl mx-auto">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#B31419]">Welcome To</h1>
        <h2 className="text-3xl font-bold">Step Group Portal</h2>
      </div>

      {/* Banner */}
      <div className="relative w-full aspect-21/9 rounded-lg overflow-hidden border border-gray-200">
        <Image
          src="/banner.jpg"
          alt="Step Group"
          fill
          priority
          className="object-cover"
        />
      </div>

    
     {/* Department cards */}
<div className="w-full">
  <h2 className="text-lg font-semibold mb-4 text-[#db2127] mx-auto">Departments</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
    {departments.map((dept) => (
      <Link key={dept.id} href={`/departments/${dept.slug}`}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer  border-t-[#B31419] border-t-1  border-l-4 border-l-[#B31419] h-full">
          <Card.Header>
            <Card.Title className="text-grey-800 text-base">{dept.name}</Card.Title>
            {dept.description && (
              <Card.Description className="text-gray-600">
                {dept.description}
              </Card.Description>
            )}
          </Card.Header>
        </Card>
      </Link>
    ))}
  </div>
</div>

      {/* Recent updates — last 10 posts across all departments */}
      <div className="w-full">
        <h2 className="text-lg font-semibold mb-4 text-[#db2127] ">Recent Updates</h2>
        {recentPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 border border-gray-200 rounded-lg">
            No updates yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/departments/${post.department.slug}/${post.id}`}
                className="block p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-[#B31419] transition"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-medium">{post.topic}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.details}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {post.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {post.department.name} — {post.author.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-4 text-sm text-gray-400 text-center">
        Step Group of Industries — Step Promo
      </footer>
    </main>
  );
}