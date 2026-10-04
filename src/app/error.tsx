"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/container";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Generic error boundary. Never shows internal error details to users. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-slate-600">
        Please try again. If the problem continues, come back later.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-brand-600 px-4 py-2 font-medium text-white hover:bg-brand-700"
      >
        Try again
      </button>
    </Container>
  );
}
