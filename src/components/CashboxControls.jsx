import { usePeriod } from "../context/PeriodContext"
import { formatDateTime, formatCurrencyBRL } from "../utils/storage"
import { Play, Square, Wallet } from "lucide-react"

export default function CashboxControls() {
  const { currentOpen, currentCashbox, openCashbox, closeCashbox, selectedPeriodId, periods } = usePeriod()

  const selectedPeriod = periods.find(p => p.id === selectedPeriodId) || null
  const lastClosed = selectedPeriod?.cashboxes?.find(c => c.status === "closed") || null
  const lastClosedInfo = lastClosed ? `${formatDateTime(lastClosed.start)} → ${formatDateTime(lastClosed.end)} · ${formatCurrencyBRL(lastClosed.total || 0)}` : null

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
        <Wallet className="w-4 h-4" />
        <span className="text-sm font-medium">Caixa</span>
      </div>

      <button
        onClick={() => openCashbox()}
        disabled={!currentOpen || !!currentCashbox}
        className="px-3 py-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        style={{ backgroundColor: 'var(--primary-color)' }}
      >
        <Play className="w-4 h-4" /> Abrir caixa
      </button>

      <button
        onClick={() => closeCashbox()}
        disabled={!currentCashbox}
        className="px-3 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Square className="w-4 h-4" /> Fechar caixa
      </button>

      {currentCashbox ? (
        <span className="text-sm" style={{ color: 'var(--primary-color)' }}>Aberto desde {formatDateTime(currentCashbox.start)}</span>
      ) : (
        <span className="text-sm text-gray-500 dark:text-gray-400">Nenhum caixa em aberto</span>
      )}

      {!currentCashbox && lastClosedInfo && (
        <span className="text-xs text-gray-500 dark:text-gray-400">Último: {lastClosedInfo}</span>
      )}
    </div>
  )
}
