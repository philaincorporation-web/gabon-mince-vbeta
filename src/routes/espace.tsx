import { createFileRoute, Outlet } from "@tanstack/react-router";
import { guardRoute } from "@/lib/auth/route-guard";

// Toutes les pages /espace/* passent par cette garde (session, statut, rôle).
export const Route = createFileRoute("/espace")({
  beforeLoad: ({ location }) => guardRoute(location.pathname),
  component: Outlet,
});
