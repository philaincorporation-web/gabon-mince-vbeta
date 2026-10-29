import { describe, expect, it } from "vitest";
import {
  assertRole,
  checkAccess,
  landingFor,
  ROLE_HOME,
  ROLES,
  safeRedirect,
  SIGNUP_ROLES,
  type Role,
  type SessionInfo,
} from "@/lib/auth/access";
import { registerSchema } from "@/lib/auth/schemas";

const session = (role: Role, overrides: Partial<NonNullable<SessionInfo>> = {}): SessionInfo => ({
  id: `id-${role}`,
  name: role,
  email: `${role.toLowerCase()}@test.ga`,
  username: null,
  role,
  status: "ACTIVE",
  requestedRole: null,
  mustChangePassword: false,
  ...overrides,
});

describe("cloisonnement des espaces par rôle", () => {
  for (const role of ROLES) {
    for (const [spaceRole, path] of Object.entries(ROLE_HOME) as [Role, string][]) {
      const allowed = role === spaceRole;
      it(`${role} ${allowed ? "accède" : "n'accède pas"} à ${path}`, () => {
        expect(checkAccess(path, session(role))).toBe(allowed ? null : "/acces-refuse");
        // sous-pages comprises
        expect(checkAccess(`${path}/reservations`, session(role))).toBe(
          allowed ? null : "/acces-refuse",
        );
      });
    }
  }

  it("un préfixe ressemblant n'ouvre pas l'accès (/espace/touristeX)", () => {
    expect(checkAccess("/espace/touriste-x", session("TOURIST"))).toBe("/espace/touriste");
    expect(checkAccess("/administration", session("TOURIST"))).toBeNull(); // page publique, hors /admin
  });

  it("/espace renvoie vers l'espace du rôle", () => {
    for (const role of ROLES) expect(checkAccess("/espace", session(role))).toBe(ROLE_HOME[role]);
  });
});

describe("conditions de session", () => {
  it("visiteur non connecté → /connexion avec retour", () => {
    expect(checkAccess("/espace/organisateur", null)).toBe(
      "/connexion?redirect=%2Fespace%2Forganisateur",
    );
    expect(checkAccess("/admin", null)).toBe("/connexion?redirect=%2Fadmin");
  });

  it("compte suspendu → /connexion", () => {
    expect(checkAccess("/espace/touriste", session("TOURIST", { status: "SUSPENDED" }))).toMatch(
      /^\/connexion/,
    );
  });

  it("compte en attente → page d'attente, même pour son propre espace", () => {
    const pending = session("PROVIDER", { status: "PENDING" });
    expect(checkAccess("/espace/prestataire", pending)).toBe("/compte-en-attente");
    expect(landingFor(pending!)).toBe("/compte-en-attente");
  });

  it("mot de passe à changer → /changer-mot-de-passe avant tout accès", () => {
    const admin = session("ADMIN", { mustChangePassword: true });
    expect(checkAccess("/admin", admin)).toBe("/changer-mot-de-passe");
    expect(landingFor(admin!)).toBe("/changer-mot-de-passe");
  });

  it("les pages publiques ne sont jamais bloquées", () => {
    for (const path of ["/", "/offres", "/connexion", "/inscription", "/carte"]) {
      expect(checkAccess(path, null)).toBeNull();
    }
  });
});

describe("requireRole (vérification serveur)", () => {
  it("refuse un rôle non autorisé", () => {
    expect(assertRole(session("ORGANIZER"), ["ADMIN"])).toEqual({ ok: false, reason: "FORBIDDEN" });
    expect(assertRole(session("TOURIST"), ["PROVIDER"])).toEqual({
      ok: false,
      reason: "FORBIDDEN",
    });
  });
  it("accepte le bon rôle", () => {
    expect(assertRole(session("ADMIN"), ["ADMIN"])).toEqual({ ok: true });
  });
  it("refuse sans session, compte suspendu, en attente ou mot de passe à changer", () => {
    expect(assertRole(null, ["TOURIST"])).toEqual({ ok: false, reason: "UNAUTHENTICATED" });
    expect(assertRole(session("TOURIST", { status: "SUSPENDED" }), ["TOURIST"]).ok).toBe(false);
    expect(assertRole(session("ORGANIZER", { status: "PENDING" }), ["ORGANIZER"]).ok).toBe(false);
    expect(assertRole(session("ADMIN", { mustChangePassword: true }), ["ADMIN"]).ok).toBe(false);
  });
});

describe("inscription", () => {
  const base = { name: "Test", email: "a@b.ga", password: "motdepasse1" };

  it("le rôle ADMIN n'est jamais proposé ni accepté", () => {
    expect(SIGNUP_ROLES).not.toContain("ADMIN");
    expect(registerSchema.safeParse({ ...base, profile: "ADMIN" }).success).toBe(false);
  });
  it("organisateur et prestataire exigent leurs informations", () => {
    expect(registerSchema.safeParse({ ...base, profile: "ORGANIZER" }).success).toBe(false);
    expect(
      registerSchema.safeParse({ ...base, profile: "ORGANIZER", organization: "ACME" }).success,
    ).toBe(true);
    expect(
      registerSchema.safeParse({ ...base, profile: "PROVIDER", businessName: "Lodge" }).success,
    ).toBe(false);
  });
  it("mot de passe trop faible refusé", () => {
    expect(
      registerSchema.safeParse({ ...base, profile: "TOURIST", password: "court" }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({ ...base, profile: "TOURIST", password: "seulementdeslettres" })
        .success,
    ).toBe(false);
  });
});

describe("redirections sûres", () => {
  it("n'accepte que des chemins internes", () => {
    expect(safeRedirect("/espace/touriste")).toBe("/espace/touriste");
    expect(safeRedirect("https://pirate.example")).toBeNull();
    expect(safeRedirect("//pirate.example")).toBeNull();
    expect(safeRedirect("/\\pirate.example")).toBeNull();
  });
});
