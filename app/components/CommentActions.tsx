"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, TextField, Label, TextArea, Spinner } from "@heroui/react";
import { updateComment, softDeleteComment } from "../actions/comments";

export function CommentActions({
  comment,
  departmentSlug,
}: {
  comment: { id: string; text: string };
  departmentSlug: string;
}) {
  const [text, setText] = useState(comment.text);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex gap-1">
      {/* Edit */}
      <Modal>
        <Modal.Trigger>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 hover:text-[#B31419] bg-[#1a1a1a] hover:bg-[#1a1a1a] px-2"
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
                    <Modal.Heading>Edit Comment</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <TextField isRequired value={text} onChange={setText} fullWidth>
                      <Label>Comment</Label>
                      <TextArea rows={4} />
                    </TextField>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="outline"
                      className="text-gray-300 hover:text-gray-50"
                      isDisabled={isPending}
                      onPress={() => {
                        setText(comment.text);
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
                        if (!text.trim()) {
                          setError("Comment cannot be empty.");
                          return;
                        }
                        setError(null);
                        startTransition(async () => {
                          const result = await updateComment({
                            commentId: comment.id,
                            departmentSlug,
                            text,
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

      {/* Delete */}
      <Modal>
        <Modal.Trigger>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-gray-500 hover:text-red-400 bg-[#1a1a1a] hover:bg-[#1a1a1a] px-2"
          >
             {({ isPending }) =>
    isPending ? (
      <Spinner size="sm" color="current" className="animate-[spin_1.5s_linear_infinite] motion-reduce:animate-none" />
    ) : (
      "Delete"
    )
  }
          </Button>
        </Modal.Trigger>
        <Modal.Backdrop>
          <Modal.Container size="sm">
            <Modal.Dialog className="bg-[#1a1a1a] text-gray-100">
              {({ close }) => (
                <>
                  <Modal.Header>
                    <Modal.Heading>Delete this comment?</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <p className="text-gray-300">
                      It will be hidden from the thread. This cannot be undone from here.
                    </p>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="outline"
                      className="text-gray-300 hover:text-gray-50"
                      isDisabled={isPending}
                      onPress={close}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      isPending={isPending}
                      onPress={() => {
                        startTransition(async () => {
                          const result = await softDeleteComment({
                            commentId: comment.id,
                            departmentSlug,
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
      "Delete"
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
    </div>
  );
}