const DNA_TO_RNA_MAP: Record<string, string> = {
  A: 'A',
  T: 'U',
  G: 'G',
  C: 'C',
};

export function transcribe(dna: string): string {
  return dna
    .toUpperCase()
    .replace(/[^ATGC]/g, '')
    .split('')
    .map(base => DNA_TO_RNA_MAP[base] || '')
    .join('');
}

export function reverseTranscribe(rna: string): string {
  return rna
    .toUpperCase()
    .replace(/[^AUGC]/g, '')
    .split('')
    .map(base => base === 'U' ? 'T' : base)
    .join('');
}
