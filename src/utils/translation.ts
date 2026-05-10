import codonsData from '@/data/codons.json';

type CodonData = { aminoAcid: string; name: string; abbr: string; frequency: number };
const codons = codonsData as Record<string, CodonData>;
const STOP_CODONS = ['UAA', 'UAG', 'UGA'];

export function translate(rna: string): { aminoAcids: string[]; fullNames: string[]; protein: string; warnings: string[] } {
  const cleaned = rna.toUpperCase().replace(/[^AUGC]/g, '');
  const aminoAcids: string[] = [];
  const fullNames: string[] = [];
  const warnings: string[] = [];

  if (cleaned.length % 3 !== 0) {
    warnings.push(`序列长度 ${cleaned.length} 不是 3 的倍数，最后 ${cleaned.length % 3} 个核苷酸将被忽略`);
  }

  for (let i = 0; i < cleaned.length - 2; i += 3) {
    const codon = cleaned.slice(i, i + 3);
    const codonInfo = codons[codon];
    if (codonInfo) {
      aminoAcids.push(codonInfo.abbr);
      fullNames.push(codonInfo.name);
      if (STOP_CODONS.includes(codon)) {
        aminoAcids.push('*');
        fullNames.push('终止');
        warnings.push(`在位置 ${i + 1} 遇到终止密码子 ${codon}`);
        break;
      }
    } else {
      aminoAcids.push('?');
      fullNames.push('未知');
    }
  }

  return { aminoAcids, fullNames, protein: aminoAcids.join('-'), warnings };
}

export function getCodonInfo(codon: string): CodonData | null {
  return codons[codon.toUpperCase()] || null;
}
