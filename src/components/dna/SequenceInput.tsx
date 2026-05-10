import { motion } from 'framer-motion';
import { NUCLEOTIDE_COLORS } from '@/utils/sequence';

interface SequenceInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export default function SequenceInput({
  value,
  onChange,
  label = '输入序列',
  placeholder = 'ATGCATGCATGC...',
}: SequenceInputProps) {
  const cleanedValue = value.toUpperCase().replace(/[^ATGC]/g, '');

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-bio min-h-[120px] resize-none"
          spellCheck={false}
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <span className="text-xs text-gray-500 font-mono">
            {cleanedValue.length} bp
          </span>
        </div>
      </div>

      {cleanedValue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-space-700/30 rounded-xl border border-white/5"
        >
          <div className="text-xs text-gray-500 mb-2">序列预览</div>
          <div className="flex flex-wrap gap-1 font-mono text-sm leading-relaxed">
            {cleanedValue.split('').map((base, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className="inline-block w-6 h-6 text-center rounded"
                style={{
                  color: NUCLEOTIDE_COLORS[base] || '#fff',
                  backgroundColor: `${NUCLEOTIDE_COLORS[base]}20`,
                }}
              >
                {base}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
