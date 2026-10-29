# GabonMICE

Plateforme de tourisme d'affaires (MICE) de l'AGATOUR : offres, catalogue, carte interactive, agenda, espaces organisateur et prestataire, et authentification multi-rôles.

Projet **TanStack Start** (React, TypeScript, Tailwind CSS), connecté à [Lovable](https://lovable.dev) et déployé sur Vercel.

## Installation

Prérequis : Node.js 20+ et npm.

```sh
git clone <url-du-depot>
cd gabon-mince-vbeta
npm install
neon env pull             # variables Neon (Postgres + Object Storage) → .env.local
cp .env.example .env      # puis renseigner AUTH_SECRET, AUTH_URL, Google, admin…
npm run db:deploy         # applique les migrations Prisma (connexion directe Neon)
npm run db:seed           # crée le compte administrateur initial
npm run dev
```

Scripts utiles :

| Commande              | Rôle                                                                            |
| --------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`         | Serveur de développement                                                        |
| `npm run build`       | Build de production                                                             |
| `npm test`            | Tests (règles d'accès par rôle, validation)                                     |
| `npm run db:migrate`  | Crée une migration après modification de `prisma/schema.prisma` (développement) |
| `npm run db:deploy`   | Applique les migrations existantes (production / nouvelle base)                 |
| `npm run db:seed`     | Crée ou met à jour l'administrateur initial                                     |
| `npm run db:generate` | Régénère le client Prisma (`src/generated/prisma`)                              |

Sans `DATABASE_URL` ni `AUTH_SECRET`, le site public fonctionne normalement et l'espace membres affiche un message « non activé ».

## Neon (base de données et stockage)

Le projet Neon `patient-morning-80580198`, branche `production` (région `eu-central-1`), est décrit dans `neon.ts` :

- **Postgres** : l'application se connecte via `node-postgres` (`pg`) et l'adaptateur Prisma, sur l'URL poolée `DATABASE_URL` (hôte `-pooler`), avec `attachDatabasePool` de `@vercel/functions` pour Vercel Fluid compute (`src/lib/db.server.ts`). Les migrations utilisent l'URL directe `DATABASE_URL_UNPOOLED` (`prisma.config.ts`).
- **Object Storage** : bucket privé `assets`, client S3 avec `forcePathStyle` (`src/lib/storage.server.ts`). Utilisé pour les justificatifs de labellisation des prestataires : la clé de l'objet est stockée dans la table `ProviderDocument`, les liens de lecture sont signés et expirent après 15 minutes.
- `neon deploy` applique `neon.ts` sur la branche liée ; `neon env pull` récupère les variables dans `.env.local` (non versionné).
- Sur Vercel, ajouter `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3` et `AWS_REGION` (valeurs de `.env.local`).

## Authentification

- **Librairie** : [Better Auth](https://www.better-auth.com) (intégration officielle TanStack Start) avec l'adaptateur Prisma et PostgreSQL ([Neon](https://neon.tech)).
- **Connexion** : e-mail **ou** identifiant + mot de passe, et Google. Une seule page : `/connexion`.
- **Mots de passe** : hachés avec bcrypt (coût 12).
- **Session** : cookie de session signé (cache de 5 min) ; le rôle et le statut sont relus en base à chaque vérification serveur.
- **Rôles** : `TOURIST`, `ORGANIZER`, `PROVIDER`, `ADMIN`. Statuts : `ACTIVE`, `PENDING`, `SUSPENDED`.

| Rôle                | Espace                 | Statut à l'inscription                   |
| ------------------- | ---------------------- | ---------------------------------------- |
| Touriste d'affaires | `/espace/touriste`     | Actif immédiatement                      |
| Organisateur        | `/espace/organisateur` | En attente de validation admin           |
| Prestataire         | `/espace/prestataire`  | En attente de validation admin (+ label) |
| Administrateur      | `/admin`               | Jamais disponible à l'inscription        |

Règles appliquées :

- Gardes de routes (`beforeLoad` de `/espace` et `/admin`, équivalent du middleware) : visiteur non connecté → `/connexion`, mauvais rôle → `/acces-refuse`, compte en attente → `/compte-en-attente`, mot de passe à changer → `/changer-mot-de-passe`.
- Chaque server function protégée revérifie le rôle côté serveur avec `requireRole(...)` (`src/lib/auth/guard.server.ts`).
- 5 échecs de connexion → compte bloqué 15 minutes ; échecs, blocages et connexions sont tracés dans `AuditLog`.
- Les comptes suspendus ne peuvent ouvrir aucune session (mot de passe ou Google) ; la suspension déconnecte immédiatement.
- Connexion Google : crée un compte Touriste ; l'utilisateur peut ensuite demander un profil Organisateur ou Prestataire depuis son espace (validation admin).
- L'admin valide les comptes, accorde ou retire le label prestataire (12 mois), change les rôles et statuts ; chaque action est tracée.

Fichiers principaux : `prisma/schema.prisma`, `src/lib/auth/` (configuration, règles d'accès, server functions, schémas zod), `src/routes/connexion.tsx`, `inscription.tsx`, `espace/*`, `admin/*`.

## Configuration de Google (connexion « Continuer avec Google »)

1. [Google Cloud Console](https://console.cloud.google.com) → créer ou choisir un projet.
2. **API et services → Écran de consentement OAuth** : type « Externe », nom de l'application « GabonMICE », e-mail d'assistance, domaine autorisé (`gabon-mince-vbeta.vercel.app` ou votre domaine), portées `email` et `profile`. Publier l'application une fois testée.
3. **Identifiants → Créer des identifiants → ID client OAuth** → type « Application Web » :
   - Origines JavaScript autorisées : `https://gabon-mince-vbeta.vercel.app` (et `http://localhost:8080` en local)
   - URI de redirection autorisés : `https://gabon-mince-vbeta.vercel.app/api/auth/callback/google` (et `http://localhost:8080/api/auth/callback/google`)
4. Copier l'ID et le secret dans `AUTH_GOOGLE_ID` et `AUTH_GOOGLE_SECRET`. Sans ces variables, le bouton Google est simplement masqué.

## Déploiement sur Vercel

Dans **Vercel → Settings → Environment Variables**, ajouter : `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (et les variables e-mail existantes). Puis, une fois depuis votre poste avec la `DATABASE_URL` de production :

```sh
npm run db:deploy
npm run db:seed
```

## Accès administrateur

Le compte administrateur initial est créé par `npm run db:seed` à partir des variables `ADMIN_USERNAME` et `ADMIN_PASSWORD` du fichier `.env`.

- **Les identifiants ne sont pas écrits dans ce dépôt**, car il est public : ils ont été communiqués en privé. Renseignez-les uniquement dans votre `.env` local.
- Connexion sur `/connexion` avec l'identifiant (ou l'e-mail `<identifiant>@gabonmice.local`) et le mot de passe initial.
- **Le mot de passe doit être changé à la première connexion** : l'accès à l'administration est bloqué tant que ce n'est pas fait.
- Mot de passe perdu : mettre `ADMIN_RESET_PASSWORD=1` dans `.env`, relancer `npm run db:seed`, puis retirer cette ligne.

## Lovable

Les commits poussés sur la branche connectée se synchronisent avec l'éditeur Lovable. Ne pas réécrire l'historique publié (force push, rebase de commits déjà poussés).
