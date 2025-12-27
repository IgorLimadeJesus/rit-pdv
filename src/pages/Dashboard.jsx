import SideBar from "../components/SideBar"
import PeriodControls from "../components/PeriodControls"
import CashboxControls from "../components/CashboxControls"
import { usePeriod } from "../context/PeriodContext"
import { formatCurrencyBRL } from "../utils/storage"
import { DollarSign, ShoppingBag, Ticket, Users, TrendingUp, TrendingDown } from "lucide-react"
import DashboardCharts from "../components/Charts"

export default function Dashboard() {
  const { metrics } = usePeriod()
  return (
    <div className="flex">
			<SideBar />

      <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col ml-64">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Metricas de vendas
        </h1>

      <div className="mt-4">
        <PeriodControls />
      </div>
      <CashboxControls />

      <div className="mt-6 grid grid-cols-4 gap-4">
        {/* Faturamento Total */}
        <div className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md hover:border-indigo-300 transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md" style={{ color: 'var(--primary-color)' }}>
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Faturamento Total</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{formatCurrencyBRL(metrics.total)}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                  <TrendingUp className="w-4 h-4" />
                  +12%
                </span>
                <span className="text-xs text-gray-400">vs mês passado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total de Vendas */}
        <div className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md hover:border-emerald-300 transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md" style={{ color: 'var(--primary-color)' }}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total de Vendas</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{metrics.count}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                  <TrendingUp className="w-4 h-4" />
                  +8%
                </span>
                <span className="text-xs text-gray-400">vs mês passado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-amber-600/10 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Ticket Médio</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{formatCurrencyBRL(metrics.avg)}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1 text-sm font-medium" style={{ color: 'var(--primary-color)' }}>
                  <TrendingUp className="w-4 h-4" />
                  +2%
                </span>
                <span className="text-xs text-gray-400">vs mês passado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clientes Atendidos */}
        <div className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm hover:shadow-md hover:border-sky-300 transition-shadow">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-sky-600/10 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Clientes Atendidos</p>
              <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{metrics.customers}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 text-sm font-medium">
                  <TrendingDown className="w-4 h-4" />
                  -3%
                </span>
                <span className="text-xs text-gray-400">vs mês passado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <DashboardCharts />
      </div>

			</main>
		</div>
	)
}