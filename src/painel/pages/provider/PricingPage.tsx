import { useMemo, useState } from "react";
import { calculatePricing, formatBRL } from "@/painel/lib/pricing";
import { DEFAULT_COST_PARAMS, useCostParameters } from "@/painel/hooks/useCostParameters";
import { generateProposalPdf } from "@/painel/lib/pdf";
import { Loader2, FileDown } from "lucide-react";

export default function PricingPage() {
  const { getValue, loading } = useCostParameters();
  const [diasCampo, setDiasCampo] = useState(3);
  const [diasAjudante, setDiasAjudante] = useState(2);
  const [equipe, setEquipe] = useState(2);
  const [distanciaKm, setDistanciaKm] = useState(120);
  const [taxaArt, setTaxaArt] = useState(280);
  const [emolumentos, setEmolumentos] = useState(450);
  const [clientName, setClientName] = useState("Cliente");
  const [serviceType, setServiceType] = useState("Georreferenciamento INCRA");
  const [pdfLoading, setPdfLoading] = useState(false);

  const input = useMemo(() => ({
    diasCampo, diasAjudante, equipe, distanciaKm, taxaArt, emolumentos,
    taxaImposto: getValue("taxa_imposto", DEFAULT_COST_PARAMS.taxa_imposto),
    lucroAlvo: getValue("lucro_alvo", DEFAULT_COST_PARAMS.lucro_alvo),
    diariaTecnico: getValue("diaria_tecnico", DEFAULT_COST_PARAMS.diaria_tecnico),
    diariaAjudante: getValue("diaria_ajudante", DEFAULT_COST_PARAMS.diaria_ajudante),
    custoKm: getValue("custo_km", DEFAULT_COST_PARAMS.custo_km),
    despesaExtraDia: getValue("despesa_extra_dia", DEFAULT_COST_PARAMS.despesa_extra_dia),
  }), [diasCampo, diasAjudante, equipe, distanciaKm, taxaArt, emolumentos, getValue]);

  const result = useMemo(() => (loading ? null : calculatePricing(input)), [loading, input]);

  const exportPdf = async () => {
    if (!result) return;
    setPdfLoading(true);
    await generateProposalPdf({ clientName, serviceType, input, result });
    setPdfLoading(false);
  };

  const fields = [
    { label: "Dias de campo", value: diasCampo, set: setDiasCampo },
    { label: "Dias de ajudante", value: diasAjudante, set: setDiasAjudante },
    { label: "Tamanho da equipe", value: equipe, set: setEquipe },
    { label: "Distância (km)", value: distanciaKm, set: setDistanciaKm },
    { label: "Taxa ART (R$)", value: taxaArt, set: setTaxaArt },
    { label: "Emolumentos (R$)", value: emolumentos, set: setEmolumentos },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Precificação</h1>
          <p className="text-sm text-slate-500">Motor de cálculo + proposta PDF</p>
        </div>
        <button
          type="button"
          onClick={exportPdf}
          disabled={!result || pdfLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {pdfLoading ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
          Exportar PDF
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium text-slate-500">Cliente (PDF)</span>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm" />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-slate-500">Serviço (PDF)</span>
          <input value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm" />
        </label>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-800">Parâmetros</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <label key={f.label} className="block">
                <span className="text-xs font-medium text-slate-500">{f.label}</span>
                <input type="number" min={0} value={f.value} onChange={(e) => f.set(Number(e.target.value))} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
          <h2 className="font-semibold text-slate-800">Resultado</h2>
          {loading || !result ? (
            <Loader2 className="mt-8 h-6 w-6 animate-spin text-emerald-600" />
          ) : (
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Custo técnico" value={formatBRL(result.custoTecnico)} />
              <Row label="Custo ajudante" value={formatBRL(result.custoAjudante)} />
              <Row label="Deslocamento" value={formatBRL(result.custoDeslocamento)} />
              <Row label="Imposto" value={formatBRL(result.imposto)} />
              <Row label="Custo total" value={formatBRL(result.custoTotal)} bold />
              <Row label="Preço sugerido" value={formatBRL(result.precoSugerido)} accent />
              <Row label="ROI" value={`${result.roi.toFixed(1)}%`} />
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between border-b border-emerald-100 pb-2">
      <dt className="text-slate-600">{label}</dt>
      <dd className={`font-semibold ${accent ? "text-lg text-emerald-700" : bold ? "text-slate-900" : "text-slate-800"}`}>{value}</dd>
    </div>
  );
}
