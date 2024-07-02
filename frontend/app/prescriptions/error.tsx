"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center h-screen gap-8 p-8">
      <h2 className="font-bold text-2xl text-red-600">¡Algo salió mal!</h2>
      <p className="text-red-500">{error.message}</p>
      <Button onClick={() => reset()}>Intentar de nuevo</Button>
    </div>
  );
}
