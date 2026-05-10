const COMPLEMENT_MAP: Record<string, string> = {
  A: 'T',
  T: 'A',
  G: 'C',
  C: 'G',
};

export function getComplement(sequence: string): string {
  return sequence
    .toUpperCase()
    .replace(/[^ATGC]/g, '')
    .split('')
    .map(base => COMPLEMENT_MAP[base] || '')
    .join('');
}

export function getReverseComplement(sequence: string): string {
  return getComplement(sequence).split('').reverse().join('');
}

export function formatSequence(sequence: string, lineLength: number = 60): string {
  const cleaned = sequence.toUpperCase().replace(/[^ATGC]/g, '');
  const lines: string[] = [];
  
  for (let i = 0; i < cleaned.length; i += lineLength) {
    const line = cleaned.slice(i, i + lineLength);
    const position = (i / lineLength + 1).toString().padStart(6, ' ');
    lines.push(`${position}  ${line}`);
  }
  
  return lines.join('\n');
}

export function parseFasta(input: string): { name: string; sequence: string }[] {
  const results: { name: string; sequence: string }[] = [];
  const lines = input.split('\n');
  let currentName = '';
  let currentSequence = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('>')) {
      if (currentName && currentSequence) {
        results.push({ name: currentName, sequence: currentSequence });
      }
      currentName = trimmed.slice(1);
      currentSequence = '';
    } else {
      currentSequence += trimmed;
    }
  }
  
  if (currentName && currentSequence) {
    results.push({ name: currentName, sequence: currentSequence });
  }
  
  return results;
}
