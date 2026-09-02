import { Spinner } from "@heroui/react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-[#B31419]">
      <Spinner
        size="lg"
        color="current"
        className="animate-[spin_1.5s_linear_infinite] motion-reduce:animate-none"
      />
    </div>
  );
}