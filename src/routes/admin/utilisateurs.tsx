import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Panel } from "@/components/auth/SpaceLayout";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  requireSection,
  STATUS_LABEL,
  useAdminAction,
  useAdminPrefs,
  useFormatDate,
} from "@/components/admin/AdminUI";
import { getAdminUsers } from "@/lib/admin/functions";
import { adminChangeRole, adminSetStatus } from "@/lib/auth/functions";
import { ROLE_LABEL, ROLES, type Role } from "@/lib/auth/access";

export const Route = createFileRoute("/admin/utilisateurs")({
  beforeLoad: ({ context }) => requireSection(context.admin, "utilisateurs"),
  loader: () => getAdminUsers(),
  head: () => ({ meta: [{ title: "Utilisateurs | Administration GabonMICE" }] }),
  component: UsersPage,
});

function UsersPage() {
  const users = Route.useLoaderData();
  const { session, admin } = Route.useRouteContext();
  const { t, language } = useAdminPrefs();
  const { date } = useFormatDate();
  const { busy, run, notices } = useAdminAction();
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<Role | "ALL">("ALL");
  // Les comptes administrateurs se gèrent depuis « Équipe » (permission dédiée).
  const canManageAdmins = admin.permissions.includes("equipe");

  const q = query.trim().toLowerCase();
  const shown = users.filter(
    (u) =>
      (role === "ALL" || u.role === role) &&
      (!q || [u.name, u.email, u.username ?? ""].some((v) => v.toLowerCase().includes(q))),
  );

  return (
    <AdminPage
      title={t("Utilisateurs", "Users")}
      subtitle={t(
        "Profil et statut de chaque compte. Suspendre un compte le déconnecte immédiatement.",
        "Profile and status of each account. Suspending an account signs it out immediately.",
      )}
    >
      {notices}
      <Panel title={`${t("Utilisateurs", "Users")} (${shown.length})`}>
        <div className="mb-4 flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Rechercher (nom, e-mail…)", "Search (name, email…)")}
            className="min-w-0 flex-1 rounded-full border border-black/10 bg-cream px-4 py-2 text-sm outline-none focus:border-forest sm:max-w-sm dark:border-slate-700 dark:bg-slate-800"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role | "ALL")}
            aria-label={t("Profil", "Profile")}
            className="rounded-full border border-black/10 bg-cream px-3 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="ALL">{t("Tous les profils", "All profiles")}</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r][language]}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-ink/50 dark:text-slate-400">
              <tr>
                <th className="py-2">{t("Utilisateur", "User")}</th>
                <th className="py-2">{t("Rôle", "Role")}</th>
                <th className="py-2">{t("Statut", "Status")}</th>
                <th className="py-2">{t("Dernière connexion", "Last sign-in")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-slate-800">
              {shown.map((u) => {
                const self = u.id === session.id;
                const locked = self || (u.role === "ADMIN" && !canManageAdmins);
                return (
                  <tr key={u.id}>
                    <td className="py-3">
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-xs text-ink/55 dark:text-slate-400">
                        {u.email}
                        {u.username ? ` · @${u.username}` : ""}
                      </p>
                    </td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        disabled={locked || busy !== null}
                        aria-label={t("Rôle", "Role")}
                        onChange={(e) =>
                          run(`r-${u.id}`, () =>
                            adminChangeRole({
                              data: { userId: u.id, role: e.target.value as Role },
                            }),
                          )
                        }
                        className="rounded-full border border-black/10 bg-cream px-3 py-1.5 text-xs font-semibold disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800"
                      >
                        {ROLES.filter(
                          (r) => r !== "ADMIN" || canManageAdmins || u.role === "ADMIN",
                        ).map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r][language]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3">
                      <select
                        value={u.status}
                        disabled={locked || busy !== null}
                        aria-label={t("Statut", "Status")}
                        onChange={(e) =>
                          run(`s-${u.id}`, () =>
                            adminSetStatus({
                              data: {
                                userId: u.id,
                                status: e.target.value as "ACTIVE" | "PENDING" | "SUSPENDED",
                              },
                            }),
                          )
                        }
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold disabled:opacity-60 ${STATUS_LABEL[u.status].tone}`}
                      >
                        {(["ACTIVE", "PENDING", "SUSPENDED"] as const).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABEL[s][language]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 text-ink/65 dark:text-slate-400">{date(u.lastLoginAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </AdminPage>
  );
}
