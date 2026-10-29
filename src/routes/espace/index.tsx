import { createFileRoute } from "@tanstack/react-router";

// /espace : la garde parente redirige vers l'espace correspondant au rôle.
export const Route = createFileRoute("/espace/")({
  component: () => null,
});
