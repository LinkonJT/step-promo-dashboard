"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, TextField, Label, Input, TextArea, Spinner } from "@heroui/react";
import { updatePost } from "../actions/posts";

export function EditPostModal({
  post,
}: {
  post: { id: string; topic: string; details: string };
}) {
  const [topic, setTopic] = useState(post.topic);
  const [details, setDetails] = useState(post.details);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Modal>
      <Modal.Trigger>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-gray-400 hover:text-[#B31419] bg-[#1a1a1a] hover:bg-[#1a1a1a] px-2"
        >
          Edit
        </Button>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="bg-[#1a1a1a] text-gray-100">
            {({ close }) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Edit Post</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <div className="flex flex-col gap-4">
                    <TextField isRequired value={topic} onChange={setTopic} fullWidth>
                      <Label>Topic</Label>
                      <Input />
                    </TextField>
                    <TextField isRequired value={details} onChange={setDetails} fullWidth>
                      <Label>Details</Label>
                      <TextArea rows={6} />
                    </TextField>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="outline"
                    className="text-gray-300 hover:text-gray-50"
                    isDisabled={isPending}
                    onPress={() => {
                      setTopic(post.topic);
                      setDetails(post.details);
                      setError(null);
                      close();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    isPending={isPending}
                    onPress={() => {
                      if (!topic.trim() || !details.trim()) {
                        setError("Please fill in both fields.");
                        return;
                      }
                      setError(null);
                      startTransition(async () => {
                        const result = await updatePost({
                          postId: post.id,
                          topic,
                          details,
                        });
                        if (result?.error) setError(result.error);
                        else {
                          close();
                          router.refresh();
                        }
                      });
                    }}
                  >
                     {({ isPending }) =>
    isPending ? (
      <Spinner size="sm" color="current" className="animate-[spin_1.5s_linear_infinite] motion-reduce:animate-none" />
    ) : (
      "Save Changes"
    )
  }
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