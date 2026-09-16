import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/wanted")({ beforeLoad: () => { throw redirect({ href: "/find-for-me", statusCode: 301 }); } });
