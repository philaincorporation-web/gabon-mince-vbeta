import { createFileRoute } from "@tanstack/react-router";
import { guardRoute } from "@/lib/auth/route-guard";
import { getAdminContext } from "@/lib/admin/functions";
import { AdminLayout } from "@/components/admin/AdminLayout";

// Toutes les pages /admin/* sont réservées au rôle ADMIN ; chaque section vérifie
// en plus sa permission (rôles d'administration). Barre latérale à la place de
// l'en-tête du site.
export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const { session } = await guardRoute(location.pathname);
    // Permissions + compteurs des pastilles, relus à chaque navigation.
    const admin = await getAdminContext();
    return { session, admin };
  },
  head: () => ({ meta: [{ title: "Administration | GabonMICE" }] }),
  component: AdminLayout,
});
