import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { PageLoader } from "@/components/ui/loading-overlay";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Écran de chargement si une page met plus de 300 ms à obtenir ses données
    // (espaces, admin…), affiché au moins 500 ms pour éviter un clignotement.
    defaultPendingComponent: PageLoader,
    defaultPendingMs: 300,
    defaultPendingMinMs: 500,
  });

  return router;
};
