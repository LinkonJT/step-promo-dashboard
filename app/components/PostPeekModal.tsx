"use client";

import { Modal, Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import { formatDateTime } from "../lib/formatDate";

interface PostPeekModalProps {
  post: {
    id: string;
    topic: string;
    details: string;
    createdAt: Date;
    author: { name: string };
  };
  departmentSlug: string;
}

export function PostPeekModal({ post, departmentSlug }: PostPeekModalProps) {
  const router = useRouter();

  return (
    <Modal>
      <Modal.Trigger>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer text-left w-full">
          <Card.Header>
            <div className="flex justify-between items-start w-full">
              <Card.Title className="text-black text-base">{post.topic}</Card.Title>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {post.createdAt.toLocaleDateString()}
              </span>
            </div>
            <Card.Description className="text-gray-600 line-clamp-2">
              {post.details}
            </Card.Description>
            <p className="text-xs text-gray-400 mt-1">— {post.author.name}</p>
          </Card.Header>
        </Card>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="bg-[#1a1a1a] text-gray-100">
            {({ close }) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>{post.topic}</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
  <p className="text-sm text-gray-400 mb-3">
    Posted by {post.author.name} on {formatDateTime(post.createdAt)}
  </p>
  <p className="text-gray-200 whitespace-pre-wrap">{post.details}</p>
</Modal.Body>
                <Modal.Footer>
                  <Button variant="outline" onPress={close}>
                    Close
                  </Button>
                  <Button
                    variant="danger"
                    onPress={() => router.push(`/departments/${departmentSlug}/${post.id}`)}
                  >
                    Comment
                  </Button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}