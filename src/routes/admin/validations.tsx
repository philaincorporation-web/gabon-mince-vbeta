import { createFileRoute } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Panel } from "@/components/auth/SpaceLayout";
import { AdminPage } from "@/components/admin/AdminPage";
import {
  requireSection,
  useAdminAction,
  useAdminPrefs,
  useFormatDate,
} from "@/components/admin/AdminUI";
import { getAdminPending } from "@/lib/admin/functions";
import { adminReviewAccount } from "@/lib/auth/functions";
import { ROLE_LABEL, type Role } from "@/lib/auth/access";

export const Route = createFileRoute("/admin/validations")({
  beforeLoad: ({ context }) => requireSection(context.admin, "validations"),
  loader: () => getAdminPending(),
  head: () => ({ meta: [{ title: "Comptes à valider | Administration GabonMICE" }] }),
  component: ValidationsPage,
});

function ValidationsPage() {
  const pending = Route.useLoaderData();
  const { t } = useAdminPrefs();
  const { date } = useFormatDate();
  const { busy, run, notices } = useAdminAction();

  return (
    <AdminPage
      title={t("Comptes à valider", "Accounts to review")}
      subtitle={t(
        "Nouveaux comptes organisateur ou prestataire, et demandes de changement de profil. L'utilisateur est prévenu par e-mail.",
        "New organiser or provider accounts, and profile change requests. The user is notified by email.",
      )}
    >
      {notices}
      <Panel
        title={`${t("Comptes et demandes à valider", "Accounts and requests to review")} (${pending.length})`}
      >
        {pending.length === 0 ? (
          <p className="text-sm text-ink/55 dark:text-slate-400">
            {t("Rien à valider.", "Nothing to review.")}
          </p>
        ) : (
          <ul className="divide-y divide-black/5 dark:divide-slate-800">
            {pending.map((u) => {
              const target = (u.requestedRole ?? u.role) as Role;
              return (
                <li
                  key={u.id}
                  className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {u.name}{" "}
                      <span className="font-normal text-ink/55 dark:text-slate-400">
                        · {u.email}
                      </span>
                    </p>
                    <p className="text-sm text-ink/65 dark:text-slate-400">
                      {u.requestedRole
                        ? t(
                            `Demande de passage ${ROLE_LABEL[u.role as Role].fr} → ${ROLE_LABEL[target].fr}`,
                            `Request ${ROLE_LABEL[u.role as Role].en} → ${ROLE_LABEL[target].en}`,
                          )
                        : t(
                            `Nouveau compte ${ROLE_LABEL[target].fr}`,
                            `New ${ROLE_LABEL[target].en} account`,
                          )}
                      {" · "}
                      {u.organizerProfile?.organization ?? u.providerProfile?.businessName ?? ""}
                      {u.providerProfile?.category ? ` (${u.providerProfile.category})` : ""}
                      {" · "}
                      {date(u.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() =>
                        run(`ok-${u.id}`, () =>
                          adminReviewAccount({ data: { userId: u.id, approve: true } }),
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-forest-deep disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" /> {t("Valider", "Approve")}
                    </button>
                    <button
                      type="button"
                      disabled={busy !== null}
                      onClick={() =>
                        run(`no-${u.id}`, () =>
                          adminReviewAccount({ data: { userId: u.id, approve: false } }),
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-sand disabled:opacity-50 dark:border-slate-700"
                    >
                      <X className="h-4 w-4" /> {t("Refuser", "Reject")}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </AdminPage>
  );
}
