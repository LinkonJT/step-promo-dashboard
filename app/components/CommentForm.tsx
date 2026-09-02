"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Label, TextArea, Spinner } from "@heroui/react";
import { createComment } from "../actions/comments";

export function CommentForm({
  postId,
  departmentSlug,
}: {
  postId: string;
  departmentSlug: string;
}) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 mt-6">
      <TextField value={text} onChange={setText} fullWidth>
        <Label>Add a comment</Label>
        <TextArea rows={3} placeholder="Write your instructions or reply..." />
      </TextField>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end">
        <Button
          variant="danger"
          isPending={isPending}
          isDisabled={!text.trim()}
          onPress={() => {
            startTransition(async () => {
              const result = await createComment({ postId, departmentSlug, text });
              if (result?.error) {
                setError(result.error);
              } else {
                setText("");
                setError(null);
                router.refresh();
              }
            });
          }}
        >
          {({ isPending }) =>
    isPending ? (
      <Spinner size="sm" color="current" className="animate-[spin_1.5s_linear_infinite] motion-reduce:animate-none" />
    ) : (
      "Post Comment"
    )
  }
        </Button>
      </div>
    </div>
  );
}