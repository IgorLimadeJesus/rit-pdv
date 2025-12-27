import { usePeriod } from "../context/PeriodContext"
import { formatDateTime } from "../utils/storage"
import { Play, Square } from "lucide-react"

export default function PeriodControls() {
  const { periods, selectedPeriodId, setSelectedPeriodId, currentOpen, openPeriod, closePeriod } = usePeriod()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={() => openPeriod()}
        disabled={!!currentOpen}
        className="px-3 py-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        style={{ backgroundColor: 'var(--primary-color)' }}
      >
        <Play className="w-4 h-4" /> Abrir período
      </button>

      <button
        onClick={() => closePeriod()}
        disabled={!currentOpen}
        className="px-3 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Square className="w-4 h-4" /> Fechar período
      </button>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600 dark:text-gray-300">Visualizar período:</label>
        <select
          value={selectedPeriodId || ""}
          onChange={(e) => setSelectedPeriodId(e.target.value)}
          className="px-2 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
        >
          <option value="" disabled>Selecionar...</option>
          {periods.map(p => (
            <option key={p.id} value={p.id}>
              {p.status === "open" ? "Aberto" : "Fechado"} — {formatDateTime(p.start)}{p.end ? ` → ${formatDateTime(p.end)}` : ""}
            </option>
          ))}
        </select>
      </div>

      {currentOpen ? (
        <span className="text-sm" style={{ color: 'var(--primary-color)' }}>Período aberto desde {formatDateTime(currentOpen.start)}</span>
      ) : (
        <span className="text-sm text-gray-500 dark:text-gray-400">Nenhum período em aberto</span>
      )}
    </div>
  )
}
