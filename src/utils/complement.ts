const COMPLEMENT_MAP: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };

export function getComplement(sequence: string): string {
  return sequence.toUpperCase().replace(/[^ATGC]/g, '').split('').map(base => COMPLEMENT_MAP[base] || '').join('');
}

export function getReverseComplement(sequence: string): string {
  return getComplement(sequence).split('').reverse().join('');
}
