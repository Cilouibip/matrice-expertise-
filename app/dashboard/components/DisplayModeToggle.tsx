'use client'

export type DisplayMode = 'absolute' | 'percent'

interface DisplayModeToggleProps {
  mode: DisplayMode
  onChange: (mode: DisplayMode) => void
}

export default function DisplayModeToggle({ mode, onChange }: DisplayModeToggleProps) {
  return (
    <div className="flex items-center bg-[#F5F3EF] rounded-full p-1">
      <button
        onClick={() => onChange('absolute')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
          mode === 'absolute'
            ? 'bg-[#FF9B71] text-white'
            : 'text-[#6B6560] hover:text-[#2D2A26]'
        }`}
      >
        # Leads
      </button>
      <button
        onClick={() => onChange('percent')}
        className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
          mode === 'percent'
            ? 'bg-[#FF9B71] text-white'
            : 'text-[#6B6560] hover:text-[#2D2A26]'
        }`}
      >
        %
      </button>
    </div>
  )
}
