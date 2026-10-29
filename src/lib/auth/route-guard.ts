import { redirect } from "@tanstack/react-router";
import { getSessionInfo } from "@/lib/auth/functions";
import { checkAccess, type SessionInfo } from "@/lib/auth/access";

/**
 * Garde des routes protégées (équivalent du middleware) : appelée dans beforeLoad
 * de /espace et /admin, elle s'exécute au rendu serveur comme à la navigation.
 */
export async function guardRoute(pathname: string) {
  const session = await getSessionInfo();
  const target = checkAccess(pathname, session);
  if (target) throw redirect({ href: target });
  return { session: session as NonNullable<SessionInfo> };
}
