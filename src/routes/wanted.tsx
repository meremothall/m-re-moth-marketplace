import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/wanted")({
  beforeLoad: () => {
    throw redirect({ to: "/find-for-me" });
  },
});