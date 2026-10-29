import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";

/** Client Better Auth côté navigateur (connexion, Google, déconnexion). */
export const authClient = createAuthClient({
  plugins: [usernameClient()],
});
