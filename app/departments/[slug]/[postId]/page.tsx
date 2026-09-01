import { auth } from "../../../../auth";
import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import { Card } from "@heroui/react";
import Link from "next/link";
import { CommentForm } from "../../../components/CommentForm";
import { CommentActions } from "../../../components/CommentActions";
import { PostActions } from "../../../components/PostActions";
import { formatDateTime } from "../../../lib/formatDate";

interface PageProps {
  params: Promise<{ slug: string; postId: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug, postId } = await params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      department: true,
      comments: {
        where: { deletedAt: null },
        orderBy: { createdAt: "asc" },
        include: { author: true },
      },
    },
  });

  if (!post || post.deletedAt || post.department.slug !== slug) {
    notFound();
  }

  const session = await auth();
  const currentUserEmail = session?.user?.email ?? null;
  const isAuthor = currentUserEmail === post.author.email;

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
      <Link
        href={`/departments/${slug}`}
        className="text-sm text-gray-400 hover:text-[#B31419] transition"
      >
        ← Back to {post.department.name}
      </Link>

      <div className="mt-4 mb-8">
        <Card className="bg-[#1a1a1a] border border-gray-800">
          <Card.Header>
            <div className="flex justify-between items-start w-full gap-4">
              <Card.Title className="text-gray-100 text-xl">{post.topic}</Card.Title>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {formatDateTime(post.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">— {post.author.name}</p>
            <Card.Description className="text-gray-300 mt-4 whitespace-pre-wrap">
              {post.details}
            </Card.Description>
          </Card.Header>
        </Card>

        <PostActions post={post} isAuthor={isAuthor} departmentSlug={slug} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Comments {post.comments.length > 0 && `(${post.comments.length})`}
        </h2>

        {post.comments.length === 0 ? (
          <Card className="bg-[#1a1a1a] border border-gray-800">
            <Card.Header>
              <Card.Description className="text-center py-6 w-full text-gray-400">
                No comments yet.
              </Card.Description>
            </Card.Header>
          </Card>
        ) : (
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <Card key={comment.id} className="bg-[#1a1a1a] border border-gray-800">
                <Card.Header>
                  <div className="flex justify-between items-start w-full gap-4">
                    <p className="text-sm font-medium text-gray-100">
                      {comment.author.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDateTime(comment.createdAt)}
                      </span>
                      {currentUserEmail === comment.author.email && (
                        <CommentActions comment={comment} departmentSlug={slug} />
                      )}
                    </div>
                  </div>
                  <Card.Description className="text-gray-300 mt-1">
                    {comment.text}
                  </Card.Description>
                </Card.Header>
              </Card>
            ))}
          </div>
        )}

        <CommentForm postId={post.id} departmentSlug={slug} />
      </div>
    </div>
  );
}