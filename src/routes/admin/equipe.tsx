import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Save, UserMinus, UserPlus } from "lucide-react";
import { Panel } from "@/components/auth/SpaceLayout";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  requireSection,
  STATUS_LABEL,
  useAdminAction,
  useAdminPrefs,
  useFormatDate,
} from "@/components/admin/AdminUI";
import { addTeamMember, getTeam, removeTeamMember, setTeamMemberRole } from "@/lib/admin/functions";
import { SUPER_ADMIN_LABEL } from "@/lib/admin/permissions";

export const Route = createFileRoute("/admin/equipe")({
  beforeLoad: ({ context }) => requireSection(context.admin, "equipe"),
  loader: () => getTeam(),
  head: () => ({ meta: [{ title: "Équipe | Administration GabonMICE" }] }),
  component: TeamPage,
});

const inputClass =
  "w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:ring-4 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-800";

function TeamPage() {
  const { members, roles } = Route.useLoaderData();
  const { session } = Route.useRouteContext();
  const { t, language } = useAdminPrefs();
  const { busy, run, notices } = useAdminAction();
  const [email, setEmail] = useState("");
  const [newRole, setNewRole] = useState<string | null>(null);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    if (newRole === null) return;
    const value = email.trim();
    const ok = await run(
      "add",
      () => addTeamMember({ data: { email: value, adminRoleId: newRole } }),
      t(`${value} a rejoint l'équipe.`, `${value} joined the team.`),
    );
    if (ok) {
      setEmail("");
      setNewRole(null);
    }
  }

  return (
    <AdminPage
      title={t("Équipe", "Team")}
      subtitle={t(
        "Les personnes qui ont accès au back office. Pour ajouter quelqu'un, il doit d'abord avoir créé son compte sur le site.",
        "People with access to the back office. To add someone, they must first have created an account on the website.",
      )}
    >
      <Panel title={t("Ajouter un membre", "Add a member")}>
        <form
          onSubmit={handleAdd}
          className="grid gap-4 md:grid-cols-[1fr_16rem_auto] md:items-end"
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">
              {t("E-mail du compte GabonMICE", "GabonMICE account email")}
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="prenom@exemple.com"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">{t("Rôle", "Role")}</span>
            <select
              required
              value={newRole ?? "__none"}
              onChange={(e) => setNewRole(e.target.value === "__none" ? null : e.target.value)}
              className={inputClass}
            >
              <option value="__none" disabled>
                {t("Choisir…", "Choose…")}
              </option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
              <option value="">{SUPER_ADMIN_LABEL[language]}</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={busy !== null || newRole === null || !email.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest-deep px-6 py-3 text-sm font-bold text-white hover:bg-forest disabled:opacity-50"
          >
            <UserPlus className="h-4 w-4" /> {t("Ajouter", "Add")}
          </button>
        </form>
        <p className="mt-3 text-xs text-ink/55 dark:text-slate-400">
          {t(
            "Le compte devient administrateur et n'a plus accès à son espace touriste, organisateur ou prestataire tant qu'il fait partie de l'équipe.",
            "The account becomes an administrator and loses access to its tourist, organiser or provider space while on the team.",
          )}{" "}
          <Link
            to="/admin/roles"
            className="font-semibold text-forest hover:underline dark:text-emerald-300"
          >
            {t("Gérer les rôles", "Manage roles")}
          </Link>
        </p>
        <div className="mt-4 space-y-3">{notices}</div>
      </Panel>

      <Panel title={`${t("Membres", "Members")} (${members.length})`}>
        <ul className="divide-y divide-black/5 dark:divide-slate-800">
          {members.map((m) => (
            <MemberRow
              key={m.id}
              member={m}
              roles={roles}
              self={m.id === session.id}
              busy={busy}
              run={run}
            />
          ))}
        </ul>
      </Panel>
    </AdminPage>
  );
}

function MemberRow({
  member: m,
  roles,
  self,
  busy,
  run,
}: {
  member: Awaited<ReturnType<typeof getTeam>>["members"][number];
  roles: { id: string; name: string }[];
  self: boolean;
  busy: string | null;
  run: (key: string, action: () => Promise<unknown>, success?: string) => Promise<boolean>;
}) {
  const { t, language } = useAdminPrefs();
  const { date } = useFormatDate();
  const current = m.adminRoleId ?? "";
  const [role, setRole] = useState(current);
  const roleName =
    m.adminRoleId === null
      ? SUPER_ADMIN_LABEL[language]
      : (roles.find((r) => r.id === m.adminRoleId)?.name ?? "—");

  return (
    <li className="flex flex-col gap-3 py-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <p className="font-display text-lg font-extrabold">
          {m.name}
          {self && (
            <span className="ml-2 align-middle text-xs font-semibold text-ink/50 dark:text-slate-400">
              ({t("vous", "you")})
            </span>
          )}
        </p>
        <p className="truncate text-sm text-forest dark:text-emerald-300">{m.email}</p>
        <p className="mt-0.5 text-xs text-ink/60 dark:text-slate-400">
          <span className="font-semibold text-ink dark:text-slate-200">{roleName}</span>
          {" · "}
          {t(`membre depuis le ${date(m.createdAt)}`, `member since ${date(m.createdAt)}`)}
          {m.status !== "ACTIVE" && (
            <span
              className={`ml-2 rounded-full px-2 py-0.5 font-semibold ${STATUS_LABEL[m.status].tone}`}
            >
              {STATUS_LABEL[m.status][language]}
            </span>
          )}
        </p>
      </div>
      {!self && (
        <div className="flex shrink-0 flex-wrap gap-2">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={busy !== null}
            aria-label={t(`Rôle de ${m.name}`, `${m.name}'s role`)}
            className="rounded-xl border border-black/10 bg-cream px-3 py-2.5 text-sm font-semibold disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
            <option value="">{SUPER_ADMIN_LABEL[language]}</option>
          </select>
          <button
            type="button"
            disabled={busy !== null || role === current}
            onClick={() =>
              run(
                `role-${m.id}`,
                () => setTeamMemberRole({ data: { userId: m.id, adminRoleId: role } }),
                t(`Rôle de ${m.name} mis à jour.`, `${m.name}'s role updated.`),
              )
            }
            className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold hover:bg-sand disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <Save className="h-4 w-4" /> {t("Enregistrer", "Save")}
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => {
              if (
                !window.confirm(
                  t(
                    `Retirer ${m.name} de l'équipe ? Il perdra l'accès au back office.`,
                    `Remove ${m.name} from the team? They will lose back-office access.`,
                  ),
                )
              )
                return;
              void run(
                `rm-${m.id}`,
                () => removeTeamMember({ data: { userId: m.id } }),
                t(`${m.name} a été retiré de l'équipe.`, `${m.name} was removed from the team.`),
              );
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/40"
          >
            <UserMinus className="h-4 w-4" /> {t("Retirer", "Remove")}
          </button>
        </div>
      )}
    </li>
  );
}
