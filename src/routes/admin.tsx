import { createFileRoute, Outlet } from "@tanstack/react-router";
import { guardRoute } from "@/lib/auth/route-guard";

// Toutes les pages /admin/* sont réservées au rôle ADMIN.
export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => guardRoute(location.pathname),
  component: Outlet,
});
