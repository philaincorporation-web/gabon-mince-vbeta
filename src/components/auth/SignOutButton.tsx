import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export function SignOutButton({ label, className = "" }: { label: string; className?: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          await authClient.signOut();
          window.location.assign("/connexion");
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-sand disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800 ${className}`}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        {label}
      </button>
      <LoadingOverlay show={loading} message={{ fr: "Déconnexion…", en: "Signing out…" }} />
    </>
  );
}
