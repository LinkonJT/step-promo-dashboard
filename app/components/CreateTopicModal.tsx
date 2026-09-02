"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, TextField, Label, Input, TextArea, Spinner  } from "@heroui/react";
import { createPost } from "../actions/posts";
import { formatDateTime } from "../lib/formatDate";


export function CreateTopicModal({
  departmentId,
  authorName,
}: {
  departmentId: string;
  authorName: string;
}) {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

//   const today = new Date().toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });

const today = formatDateTime(new Date());

  function reset() {
    setTopic("");
    setDetails("");
    setError(null);
  }

  return (
    <Modal>
      <Modal.Trigger>
        <Button variant="danger">+ Create Topic</Button>
      </Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="bg-[#1a1a1a] text-gray-100">
            {({ close }) => (
              <>
                <Modal.CloseTrigger />
                <Modal.Header>
                  <Modal.Heading>Create Topic</Modal.Heading>
                </Modal.Header>
                <Modal.Body>
                  <div className="flex flex-col gap-4">
                    <TextField isRequired value={topic} onChange={setTopic} fullWidth>
                      <Label>Topic</Label>
                      <Input placeholder="What's this update about?" />
                    </TextField>

                    <div className="flex gap-6 text-sm text-gray-400 border-y border-gray-700 py-2">
                      <p>
                        <span className="font-medium text-gray-200">Posted by:</span>{" "}
                        {authorName}
                      </p>
                      <p>
                        <span className="font-medium text-gray-200">Date:</span> {today}
                      </p>
                    </div>

                    <TextField isRequired value={details} onChange={setDetails} fullWidth>
                      <Label>Details</Label>
                      <TextArea rows={5} placeholder="Add details..." />
                    </TextField>

                    {error && <p className="text-sm text-red-600">{error}</p>}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                  
                    variant="outline"
                    className="text-gray-300 hover:text-gray-50"
                    isDisabled={isPending}
                    onPress={() => {
                      reset();
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
                        const result = await createPost({ departmentId, topic, details });
                        if (result?.error) {
                          setError(result.error);
                        } else {
                          reset();
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
      "Post"
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