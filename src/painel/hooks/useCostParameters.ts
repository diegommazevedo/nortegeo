import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { CostParameter } from "@/painel/types/database";
import { usePainelAuth } from "@/painel/hooks/usePainelAuth";

export function useCostParameters() {
  const { organizationId, isAdmin } = usePainelAuth();
  const [params, setParams] = useState<CostParameter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParams = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("cost_parameters").select("*").order("category");

    if (!isAdmin && organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data } = await query;
    setParams((data ?? []) as CostParameter[]);
    setLoading(false);
  }, [organizationId, isAdmin]);

  useEffect(() => {
    fetchParams();
  }, [fetchParams]);

  const getValue = useCallback(
    (key: string, fallback = 0) => params.find((p) => p.key === key)?.value ?? fallback,
    [params],
  );

  const updateParam = useCallback(
    async (id: string, value: number) => {
      const { error } = await supabase.from("cost_parameters").update({ value }).eq("id", id);
      if (!error) {
        setParams((prev) => prev.map((p) => (p.id === id ? { ...p, value } : p)));
      }
      return { error: error?.message ?? null };
    },
    [],
  );

  return { params, loading, getValue, updateParam, refetch: fetchParams };
}

/** Defaults quando Supabase ainda não tem parâmetros cadastrados */
export const DEFAULT_COST_PARAMS: Record<string, number> = {
  diaria_tecnico: 450,
  diaria_ajudante: 180,
  custo_km: 2.5,
  despesa_extra_dia: 80,
  taxa_imposto: 0.08,
  lucro_alvo: 0.35,
};
