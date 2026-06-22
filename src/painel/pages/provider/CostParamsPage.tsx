import { useCostParameters } from "@/painel/hooks/useCostParameters";
import { Loader2 } from "lucide-react";

export default function CostParamsPage() {
  const { params, loading, updateParam } = useCostParameters();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Parâmetros de custo</h1>
      <p className="mt-1 text-sm text-slate-500">Variáveis usadas em todas as calculadoras</p>

      {params.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          Nenhum parâmetro cadastrado no Supabase. Insira registros na tabela{" "}
          <code className="rounded bg-slate-100 px-1">cost_parameters</code> ou use os defaults na precificação.
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Variável</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Valor</th>
              </tr>
            </thead>
            <tbody>
              {params.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.label}</td>
                  <td className="px-4 py-3 text-slate-500">{p.category}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={p.value}
                      onBlur={(e) => updateParam(p.id, Number(e.target.value))}
                      className="w-28 rounded-lg border border-slate-200 px-2 py-1 outline-none focus:border-emerald-500"
                    />
                    {p.unit && <span className="ml-1 text-xs text-slate-400">{p.unit}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
