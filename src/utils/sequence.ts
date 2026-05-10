export const NUCLEOTIDE_COLORS: Record<string, string> = {
  A: '#ef4444',
  T: '#3b82f6',
  G: '#22c55e',
  C: '#3b82f6',
  U: '#f59e0b',
};

export const RNA_COMPLEMENT: Record<string, string> = {
  A: 'U',
  U: 'A',
  G: 'C',
  C: 'G',
};

export const DNA_TO_RNA: Record<string, string> = {
  A: 'A',
  T: 'U',
  G: 'G',
  C: 'C',
};

export const VALID_DNA_BASES = new Set(['A', 'T', 'G', 'C']);
export const VALID_RNA_BASES = new Set(['A', 'U', 'G', 'C']);

export function cleanSequence(input: string): string {
  return input
    .toUpperCase()
    .replace(/[^ATGCU]/g, '')
    .trim();
}

export function isValidSequence(input: string, type: 'DNA' | 'RNA' = 'DNA'): boolean {
  const cleaned = cleanSequence(input);
  const validBases = type === 'DNA' ? VALID_DNA_BASES : VALID_RNA_BASES;
  return cleaned.length > 0 && [...cleaned].every(base => validBases.has(base));
}

export function getSequenceStats(sequence: string): {
  length: number;
  gcContent: number;
  counts: Record<string, number>;
} {
  const cleaned = cleanSequence(sequence);
  const counts: Record<string, number> = {};
  
  for (const base of cleaned) {
    counts[base] = (counts[base] || 0) + 1;
  }
  
  const gc = ((counts['G'] || 0) + (counts['C'] || 0)) / cleaned.length * 100;
  
  return {
    length: cleaned.length,
    gcContent: isNaN(gc) ? 0 : gc,
    counts,
  };
}
