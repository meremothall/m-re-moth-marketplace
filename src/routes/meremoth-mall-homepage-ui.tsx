import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/meremoth-mall-homepage-ui")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
