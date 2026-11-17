import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLabelOverrides } from "@/lib/labels";
import type { Listing } from "@/lib/mice-data";

/**
 * Renvoie une fonction indiquant si une fiche est labellisée :
 * label accordé en base si la fiche est associée à un compte prestataire,
 * sinon la valeur `labelled` du catalogue.
 */
export function useLabelled() {
  const { data } = useQuery({
    queryKey: ["label-overrides"],
    queryFn: () => getLabelOverrides(),
    staleTime: 5 * 60 * 1000,
  });
  return useCallback(
    (listing: Pick<Listing, "id" | "labelled">) => data?.[listing.id] ?? listing.labelled,
    [data],
  );
}
