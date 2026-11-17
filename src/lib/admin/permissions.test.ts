import { describe, expect, it } from "vitest";
import { cleanPermissions, effectivePermissions, PERMISSIONS } from "@/lib/admin/permissions";

describe("permissions du back office", () => {
  it("un admin sans rôle (comptes existants) est Super admin : toutes les permissions", () => {
    expect(effectivePermissions(null)).toEqual([...PERMISSIONS]);
  });

  it("un rôle ne donne que ses permissions", () => {
    expect(effectivePermissions({ permissions: ["labels", "journal"] })).toEqual([
      "labels",
      "journal",
    ]);
  });

  it("un rôle sans permission ne donne aucun accès (pas de repli Super admin)", () => {
    expect(effectivePermissions({ permissions: [] })).toEqual([]);
  });

  it("les clés inconnues ou obsolètes sont ignorées", () => {
    expect(cleanPermissions(["equipe", "tout", "ADMIN", "demandes"])).toEqual([
      "demandes",
      "equipe",
    ]);
  });
});
