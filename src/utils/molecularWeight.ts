import aminoAcidsData from '@/data/aminoAcids.json';

type AminoAcidData = { name: string; abbr: string; mw: number; codons: string[]; type: string; charge: number; hydropathy: number };
const aminoAcids = aminoAcidsData as Record<string, AminoAcidData>;

const NUCLEOTIDE_MW = {
  DNA: { A: 331.2, T: 322.2, G: 347.2, C: 307.2 },
  RNA: { A: 347.2, U: 324.2, G: 363.2, C: 323.2 },
};

export function calculateDNAMolecularWeight(sequence: string, isDoubleStranded: boolean = false): number {
  const cleaned = sequence.toUpperCase().replace(/[^ATGC]/g, '');
  if (cleaned.length === 0) return 0;
  let totalMw = 0;
  for (const base of cleaned) {
    totalMw += NUCLEOTIDE_MW.DNA[base as keyof typeof NUCLEOTIDE_MW.DNA] || 0;
  }
  if (isDoubleStranded) {
    totalMw *= 2;
    totalMw += 39.31;
  } else {
    totalMw += 79.0;
  }
  return Math.round(totalMw * 100) / 100;
}

export function calculateRNAMolecularWeight(sequence: string): number {
  const cleaned = sequence.toUpperCase().replace(/[^AUGC]/g, '');
  if (cleaned.length === 0) return 0;
  let totalMw = 0;
  for (const base of cleaned) {
    totalMw += NUCLEOTIDE_MW.RNA[base as keyof typeof NUCLEOTIDE_MW.RNA] || 0;
  }
  return Math.round((totalMw + 17.04) * 100) / 100;
}

export function calculateProteinMolecularWeight(sequence: string): { mw: number; details: { aminoAcid: string; mw: number }[] } {
  const cleaned = sequence.toUpperCase().replace(/[^A-Z*]/g, '');
  const details: { aminoAcid: string; mw: number }[] = [];
  let totalMw = 0;
  for (const aa of cleaned) {
    if (aa === '*') continue;
    const aaData = aminoAcids[aa];
    if (aaData) {
      totalMw += aaData.mw;
      details.push({ aminoAcid: aa, mw: aaData.mw });
    }
  }
  if (details.length > 1) {
    totalMw -= 18.015 * (details.length - 1);
  }
  return { mw: Math.round(totalMw * 100) / 100, details };
}

export function formatMolecularWeight(mw: number): string {
  if (mw >= 1000000) return `${(mw / 1000000).toFixed(2)} MDa`;
  if (mw >= 1000) return `${(mw / 1000).toFixed(2)} kDa`;
  return `${mw.toFixed(2)} Da`;
}
