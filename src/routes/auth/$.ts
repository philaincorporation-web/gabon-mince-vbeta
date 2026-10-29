import { createFileRoute } from "@tanstack/react-router";
import { getAuth } from "@/lib/auth/auth.server";
import { isDatabaseConfigured } from "@/lib/db.server";

function handle(request: Request) {
  // Sans base de données (ex. aperçu Lovable), l'espace membres est désactivé proprement.
  if (!isDatabaseConfigured() || !process.env.AUTH_SECRET) {
    return Response.json({ error: "Authentification non configurée." }, { status: 503 });
  }
  return getAuth().handler(request);
}

// Point d'entrée Better Auth : /auth/* (connexion, inscription, callback Google…).
// Pas sous /api : sur Vercel, ce préfixe est réservé au dossier api/ (fonction sendMail).
export const Route = createFileRoute("/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
