import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

/** Client Better Auth côté navigateur (connexion, Google, déconnexion). */
export const authClient = createAuthClient({
  // Même chemin que le serveur (auth.server.ts) : /auth, et non /api/auth.
  basePath: "/auth",
  plugins: [usernameClient()],
});
