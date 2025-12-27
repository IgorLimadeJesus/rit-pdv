import { useMemo, useRef, useEffect, useState } from "react"
import { usePeriod } from "../context/PeriodContext"
import { useTheme } from "../context/ThemeContext"

/* =======================
   FATURAMENTO DIÁRIO
   (LINE CHART)
======================= */
function RevenuePerDayChart({ daily }) {
  const containerRef = useRef(null)
  const [height, setHeight] = useState(240)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const gridStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const axisStroke = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"
  const labelFill = isDark ? "#9CA3AF" : "#6B7280" // gray-400 vs gray-500

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const h = Math.max(160, containerRef.current.clientHeight - 48)
        setHeight(h)
      }
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const data = useMemo(() => {
    const entries = (daily || []).map(d => [d.label, Number(d.total || 0)])
    const max = Math.max(...entries.map(e => e[1]), 1)
    return { entries, max }
  }, [daily])

  const PADDING = { top: 16, bottom: 28, left: 40, right: 16 }
  const STEP = 80
  const width = Math.max(400,  PADDING.left + PADDING.right + Math.max(1, data.entries.length - 1) * STEP + 40)
  const usableH = height - PADDING.top - PADDING.bottom

  const coords = data.entries.map(([, value], i) => {
    const x = PADDING.left + i * STEP
    const y = PADDING.top + (1 - value / data.max) * usableH
    return { x, y, value }
  })
  const polylinePoints = coords.map(p => `${p.x},${p.y}`).join(" ")

  const noData = data.entries.length === 0

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 h-full"
    >
      <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
        Faturamento Diário
      </h3>

      {noData ? (
        <div className="flex h-[calc(100%-1rem)] items-center justify-center">
          <p className="text-sm text-gray-400">Sem dados para o período/caixa selecionado.</p>
        </div>
      ) : (
      <svg width={width} height={height} role="img" aria-label="Gráfico de faturamento diário">
        {/* GRID */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => {
          const y = PADDING.top + p * usableH
          return (
            <line
              key={p}
              x1={PADDING.left}
              x2={width - PADDING.right}
              y1={y}
              y2={y}
              stroke={gridStroke}
              strokeDasharray="4"
            />
          )
        })}

        {/* EIXO Y */}
        <line
          x1={PADDING.left}
          x2={PADDING.left}
          y1={PADDING.top}
          y2={height - PADDING.bottom}
          stroke={axisStroke}
        />

        {/* LINHA */}
        {coords.length >= 2 && (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
          />
        )}

        {/* PONTOS E RÓTULOS */}
        {data.entries.map(([label], i) => {
          const p = coords[i]
          if (!p) return null
          return (
            <g key={`${label}-${i}`}>
              <circle cx={p.x} cy={p.y} r={3.5} fill="#22c55e" />
              <text x={p.x} y={height - 8} textAnchor="middle" style={{ fill: labelFill, fontSize: 10 }}>
                {label}
              </text>
            </g>
          )
        })}
      </svg>
      )}
    </div>
  )
}

/* =======================
   VENDAS POR CATEGORIA
   (BAR CHART)
======================= */
function SalesByCategoryChart({ items }) {
  const containerRef = useRef(null)
  const [height, setHeight] = useState(240)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const gridStroke = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const axisStroke = isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"
  const labelFill = isDark ? "#9CA3AF" : "#6B7280"

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setHeight(containerRef.current.clientHeight - 48)
      }
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const data = useMemo(() => {
    const map = new Map()

    for (const it of items) {
      const cat = it.category || "Sem Categoria"
      map.set(cat, (map.get(cat) || 0) + (it.qty || 1))
    }

    const entries = Array.from(map.entries())
    const max = Math.max(...entries.map(e => e[1]), 1)

    return { entries, max }
  }, [items])

  const width = Math.max(400, data.entries.length * 90)

  const PADDING = { top: 16, bottom: 32, left: 40, right: 16 }
  const usableH = height - PADDING.top - PADDING.bottom
  const barW = 48

  return (
    <div
      ref={containerRef}
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 h-full"
    >
      <h3 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
        Vendas por Categoria
      </h3>

      <svg width={width} height={height}>
        {/* GRID */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => {
          const y = PADDING.top + p * usableH
          return (
            <line
              key={p}
              x1={PADDING.left}
              x2={width - PADDING.right}
              y1={y}
              y2={y}
              stroke={gridStroke}
              strokeDasharray="4"
            />
          )
        })}

        {/* EIXO Y */}
        <line
          x1={PADDING.left}
          x2={PADDING.left}
          y1={PADDING.top}
          y2={height - PADDING.bottom}
          stroke={axisStroke}
        />

        {data.entries.map(([label, value], i) => {
          const x = PADDING.left + i * 80 + 24
          const h = (value / data.max) * usableH
          const y = PADDING.top + usableH - h

          return (
            <g key={label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={8}
                fill="#22c55e"
              />
              <text
                x={x + barW / 2}
                y={height - 10}
                textAnchor="middle"
                style={{ fill: labelFill, fontSize: 12 }}
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* =======================
   DASHBOARD
======================= */
export default function DashboardCharts() {
  const { dailyRevenue, periodItems } = usePeriod()

  return (
    <div className="mt-3 h-full grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0">
      <div className="h-full min-h-0">
        <RevenuePerDayChart daily={dailyRevenue} />
      </div>

      <div className="h-full min-h-0">
        <SalesByCategoryChart items={periodItems} />
      </div>
    </div>
  )
}