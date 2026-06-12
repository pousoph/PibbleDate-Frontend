import { cn } from '@/shared/lib/utils'

interface PibbleMascotProps {
  className?: string
}

export function PibbleMascot({ className }: PibbleMascotProps) {
  return (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('w-32 h-32', className)}
      aria-hidden="true"
    >
      {/* Floppy ears */}
      <ellipse cx="34" cy="56" rx="22" ry="28" fill="#F5D0D0" transform="rotate(-18 34 56)" />
      <ellipse cx="126" cy="56" rx="22" ry="28" fill="#F5D0D0" transform="rotate(18 126 56)" />
      <ellipse cx="34" cy="58" rx="13" ry="17" fill="#F4A98C" transform="rotate(-18 34 58)" />
      <ellipse cx="126" cy="58" rx="13" ry="17" fill="#F4A98C" transform="rotate(18 126 58)" />

      {/* Head — blocky wide rectangle */}
      <rect x="15" y="28" width="130" height="112" rx="36" fill="#FDEDED" />

      {/* Snout */}
      <ellipse cx="80" cy="108" rx="34" ry="24" fill="#F5D0D0" />

      {/* Brow markings (pibble signature) */}
      <ellipse cx="55" cy="62" rx="11" ry="7" fill="#F5D0D0" />
      <ellipse cx="105" cy="62" rx="11" ry="7" fill="#F5D0D0" />

      {/* Eyes */}
      <circle cx="55" cy="77" r="14" fill="white" />
      <circle cx="105" cy="77" r="14" fill="white" />
      <circle cx="56" cy="79" r="9" fill="#4A0011" />
      <circle cx="106" cy="79" r="9" fill="#4A0011" />
      <circle cx="56" cy="79" r="4.5" fill="#1A0007" />
      <circle cx="106" cy="79" r="4.5" fill="#1A0007" />
      {/* Shine */}
      <circle cx="59" cy="76" r="3" fill="white" />
      <circle cx="109" cy="76" r="3" fill="white" />

      {/* Nose */}
      <ellipse cx="80" cy="99" rx="12" ry="9" fill="#4A0011" />
      <ellipse cx="76" cy="97" rx="3.5" ry="2.5" fill="#7A5560" opacity="0.35" />

      {/* Philtrum lines */}
      <path d="M 68 106 L 65 114" stroke="#4A0011" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 92 106 L 95 114" stroke="#4A0011" strokeWidth="2.5" strokeLinecap="round" />

      {/* Pibble smile */}
      <path d="M 50 118 Q 80 138 110 118" stroke="#4A0011" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Tongue */}
      <path d="M 70 128 Q 80 145 90 128" fill="#F4A98C" />
    </svg>
  )
}
