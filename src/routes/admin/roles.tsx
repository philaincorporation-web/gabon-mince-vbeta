import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Lock, Pencil, Plus, Trash2 } from "lucide-react";
import { Panel } from "@/components/auth/SpaceLayout";
import { AdminPage } from "@/components/admin/AdminPage";
import { requireSection, useAdminAction, useAdminPrefs } from "@/components/admin/AdminUI";
import { deleteAdminRole, getAdminRoles, saveAdminRole } from "@/lib/admin/functions";
import {
  PERMISSION_LABEL,
  PERMISSIONS,
  SUPER_ADMIN_LABEL,
  type Permission,
} from "@/lib/admin/permissions";

export const Route = createFileRoute("/admin/roles")({
  beforeLoad: ({ context }) => requireSection(context.admin, "equipe"),
  loader: () => getAdminRoles(),
  head: () => ({ meta: [{ title: "Rôles | Administration GabonMICE" }] }),
  component: RolesPage,
});

type Draft = { id?: string; name: string; description: string; permissions: Permission[] };
const EMPTY: Draft = { name: "", description: "", permissions: [] };

const inputClass =
  "w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm outline-none focus:border-forest focus:ring-4 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-800";

function RolesPage() {
  const { roles, superAdmins } = Route.useLoaderData();
  const { t, language } = useAdminPrefs();
  const { busy, run, notices } = useAdminAction();
  const [draft, setDraft] = useState<Draft>(EMPTY);

  const toggle = (p: Permission) =>
    setDraft((d) => ({
      ...d,
      permissions: d.permissions.includes(p)
        ? d.permissions.filter((x) => x !== p)
        : [...d.permissions, p],
    }));

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    const ok = await run(
      "save",
      () =>
        saveAdminRole({
          data: {
            id: draft.id,
            name: draft.name,
            description: draft.description,
            permissions: draft.permissions,
          },
        }),
      draft.id
        ? t(`Rôle « ${draft.name} » mis à jour.`, `Role “${draft.name}” updated.`)
        : t(`Rôle « ${draft.name} » créé.`, `Role “${draft.name}” created.`),
    );
    if (ok) setDraft(EMPTY);
  }

  return (
    <AdminPage
      title={t("Rôles", "Roles")}
      subtitle={t(
        "Un rôle définit les sections du back office auxquelles un membre de l'équipe a accès. Les changements s'appliquent immédiatement.",
        "A role defines which back-office sections a team member can access. Changes apply immediately.",
      )}
    >
      <Panel
        title={draft.id ? t("Modifier le rôle", "Edit role") : t("Créer un rôle", "Create a role")}
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">{t("Nom", "Name")}</span>
              <input
                required
                minLength={2}
                maxLength={60}
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder={t("Ex. : Chargé de labellisation", "E.g. Labelling officer")}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                {t("Description (facultatif)", "Description (optional)")}
              </span>
              <input
                maxLength={300}
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                className={inputClass}
              />
            </label>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">{t("Accès", "Access")}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {PERMISSIONS.map((p) => {
                const checked = draft.permissions.includes(p);
                return (
                  <label
                    key={p}
                    className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${
                      checked
                        ? "border-forest bg-forest/5 dark:border-emerald-400/60 dark:bg-emerald-400/5"
                        : "border-black/10 hover:bg-sand/60 dark:border-slate-700 dark:hover:bg-slate-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(p)}
                      className="mt-1 h-4 w-4 accent-[var(--color-forest)]"
                    />
                    <span>
                      <span className="block text-sm font-semibold">
                        {PERMISSION_LABEL[p][language]}
                      </span>
                      <span className="block text-xs text-ink/60 dark:text-slate-400">
                        {PERMISSION_LABEL[p].hint[language]}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={
                busy !== null || draft.name.trim().length < 2 || draft.permissions.length === 0
              }
              className="inline-flex items-center gap-2 rounded-xl bg-forest-deep px-6 py-3 text-sm font-bold text-white hover:bg-forest disabled:opacity-50"
            >
              {draft.id ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {draft.id ? t("Enregistrer", "Save") : t("Créer le rôle", "Create role")}
            </button>
            {draft.id && (
              <button
                type="button"
                onClick={() => setDraft(EMPTY)}
                className="rounded-xl border border-black/10 px-5 py-3 text-sm font-semibold hover:bg-sand dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {t("Annuler", "Cancel")}
              </button>
            )}
          </div>
          {notices}
        </form>
      </Panel>

      <Panel title={`${t("Rôles", "Roles")} (${roles.length + 1})`}>
        <ul className="divide-y divide-black/5 dark:divide-slate-800">
          <li className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="flex items-center gap-2 font-semibold">
                <Lock className="h-4 w-4 text-sun-deep" /> {SUPER_ADMIN_LABEL[language]}
              </p>
              <p className="text-sm text-ink/60 dark:text-slate-400">
                {t(
                  "Rôle système : accès complet, non modifiable.",
                  "System role: full access, cannot be edited.",
                )}{" "}
                · {t(`${superAdmins} membre(s)`, `${superAdmins} member(s)`)}
              </p>
            </div>
          </li>
          {roles.map((r) => (
            <li
              key={r.id}
              className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <p className="font-semibold">{r.name}</p>
                {r.description && (
                  <p className="text-sm text-ink/60 dark:text-slate-400">{r.description}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.permissions.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-semibold text-forest dark:text-emerald-300"
                    >
                      {PERMISSION_LABEL[p][language]}
                    </span>
                  ))}
                </div>
                <p className="mt-1 text-xs text-ink/50 dark:text-slate-500">
                  {t(`${r.members} membre(s)`, `${r.members} member(s)`)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => {
                    setDraft({
                      id: r.id,
                      name: r.name,
                      description: r.description ?? "",
                      permissions: r.permissions,
                    });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-sand disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <Pencil className="h-4 w-4" /> {t("Modifier", "Edit")}
                </button>
                <button
                  type="button"
                  disabled={busy !== null || r.members > 0}
                  title={
                    r.members > 0 ? t("Rôle encore attribué", "Role still assigned") : undefined
                  }
                  onClick={() => {
                    if (
                      !window.confirm(
                        t(`Supprimer le rôle « ${r.name} » ?`, `Delete role “${r.name}”?`),
                      )
                    )
                      return;
                    void run(
                      `del-${r.id}`,
                      () => deleteAdminRole({ data: { id: r.id } }),
                      t(`Rôle « ${r.name} » supprimé.`, `Role “${r.name}” deleted.`),
                    );
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:hover:bg-red-950/40"
                >
                  <Trash2 className="h-4 w-4" /> {t("Supprimer", "Delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </AdminPage>
  );
}
