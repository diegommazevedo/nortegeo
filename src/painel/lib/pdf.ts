import type { PricingInput, PricingResult } from "@/painel/types/database";
import { formatBRL } from "@/painel/lib/pricing";

export async function generateProposalPdf(opts: {
  clientName: string;
  serviceType: string;
  input: PricingInput;
  result: PricingResult;
}) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF();
  const { clientName, serviceType, input, result } = opts;

  doc.setFontSize(20);
  doc.text("NorteGeo Engenharia e Topografia", 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text("Proposta Comercial", 14, 30);
  doc.setTextColor(0);

  doc.setFontSize(10);
  doc.text(`Cliente: ${clientName}`, 14, 42);
  doc.text(`Serviço: ${serviceType}`, 14, 48);
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR")}`, 14, 54);

  autoTable(doc, {
    startY: 62,
    head: [["Item", "Valor"]],
    body: [
      ["Dias de campo", String(input.diasCampo)],
      ["Equipe", String(input.equipe)],
      ["Distância (km)", String(input.distanciaKm)],
      ["Custo técnico", formatBRL(result.custoTecnico)],
      ["Custo ajudante", formatBRL(result.custoAjudante)],
      ["Deslocamento", formatBRL(result.custoDeslocamento)],
      ["Imposto", formatBRL(result.imposto)],
      ["Custo total", formatBRL(result.custoTotal)],
      ["Preço sugerido", formatBRL(result.precoSugerido)],
      ["ROI estimado", `${result.roi.toFixed(1)}%`],
    ],
    theme: "grid",
    headStyles: { fillColor: [5, 150, 105] },
  });

  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(
    "Validade: 15 dias. NorteGeo — Braço do Rio, Conceição da Barra/ES.",
    14,
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 12,
  );

  doc.save(`proposta-nortegeo-${Date.now()}.pdf`);
}
