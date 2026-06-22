import type { PricingInput, PricingResult } from "@/painel/types/database";

/** Motor de precificação — promptgenesis §8 */
export function calculatePricing(input: PricingInput): PricingResult {
  const custoTecnico = input.diasCampo * input.equipe * input.diariaTecnico;
  const custoAjudante = input.diasAjudante * input.diariaAjudante;
  const custoDeslocamento =
    input.distanciaKm * input.custoKm + input.diasCampo * input.despesaExtraDia;
  const subtotal =
    custoTecnico +
    custoAjudante +
    custoDeslocamento +
    input.taxaArt +
    input.emolumentos;
  const imposto = subtotal * input.taxaImposto;
  const custoTotal = subtotal + imposto;
  const precoSugerido = custoTotal * (1 + input.lucroAlvo);
  const roi = custoTotal > 0 ? ((precoSugerido - custoTotal) / custoTotal) * 100 : 0;

  return {
    custoTecnico,
    custoAjudante,
    custoDeslocamento,
    subtotal,
    imposto,
    custoTotal,
    precoSugerido,
    roi,
  };
}

export function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
