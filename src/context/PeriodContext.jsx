import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { loadPeriods, savePeriods, loadSales, saveSales } from "../utils/storage"

const PeriodContext = createContext(null)

export function PeriodProvider({ children }) {
  const [periods, setPeriods] = useState(() => loadPeriods())
  const [sales, setSales] = useState(() => loadSales())
  const [selectedPeriodId, setSelectedPeriodId] = useState(null)

  // persist
  useEffect(() => savePeriods(periods), [periods])
  useEffect(() => saveSales(sales), [sales])

  const currentOpen = useMemo(() => periods.find(p => p.status === "open") || null, [periods])
  const currentCashbox = useMemo(() => {
    if (!currentOpen) return null
    const cashboxes = currentOpen.cashboxes || []
    return cashboxes.find(c => c.status === "open") || null
  }, [currentOpen])

  // default selection: current open or latest closed
  useEffect(() => {
    if (!selectedPeriodId) {
      if (currentOpen) setSelectedPeriodId(currentOpen.id)
      else if (periods.length) {
        const latest = [...periods]
          .filter(p => p.status === "closed")
          .sort((a, b) => new Date(b.end) - new Date(a.end))[0]
        if (latest) setSelectedPeriodId(latest.id)
      }
    }
  }, [selectedPeriodId, currentOpen, periods])

  function openPeriod() {
    if (currentOpen) return { ok: false, message: "Já existe um período aberto." }
    const now = new Date().toISOString()
    const id = `p_${Date.now()}`
    const newPeriod = { id, start: now, status: "open", cashboxes: [], summary: { total: 0, daily: {} } }
    setPeriods(prev => [newPeriod, ...prev])
    setSelectedPeriodId(id)
    return { ok: true }
  }

  function closePeriod() {
    if (!currentOpen) return { ok: false, message: "Nenhum período aberto." }
    const now = new Date().toISOString()
    setPeriods(prev => prev.map(p => (p.id === currentOpen.id ? { ...p, status: "closed", end: now } : p)))
    return { ok: true }
  }

  function addSale({ amount, customerId, items }) {
    if (!currentOpen) return { ok: false, message: "Abra um período para registrar vendas." }
    if (!currentCashbox) return { ok: false, message: "Abra o caixa para registrar vendas." }
    const sale = {
      id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      periodId: currentOpen.id,
      cashboxId: currentCashbox.id,
      amount: Number(amount || 0),
      customerId: customerId || null,
      items: Array.isArray(items) ? items.map(it => ({
        name: it.name || "",
        category: it.category || null,
        price: Number(it.price || 0),
        qty: Number(it.qty || 1),
        image: it.image || null,
      })) : [],
      timestamp: new Date().toISOString(),
    }
    setSales(prev => [sale, ...prev])
    return { ok: true }
  }

  function openCashbox() {
    if (!currentOpen) return { ok: false, message: "Abra um período antes de abrir o caixa." }
    if (currentCashbox) return { ok: false, message: "Já existe um caixa aberto." }
    const now = new Date()
    const dateKey = now.toISOString().slice(0, 10) // yyyy-mm-dd
    const cb = { id: `c_${Date.now()}`, start: now.toISOString(), status: "open", dateKey }
    setPeriods(prev => prev.map(p => (p.id === currentOpen.id ? { ...p, cashboxes: [cb, ...(p.cashboxes || [])] } : p)))
    return { ok: true }
  }

  function closeCashbox() {
    if (!currentOpen) return { ok: false, message: "Nenhum período aberto." }
    if (!currentCashbox) return { ok: false, message: "Nenhum caixa aberto." }
    const nowISO = new Date().toISOString()
    const cbId = currentCashbox.id
    const cbStart = new Date(currentCashbox.start)
    const caixaSales = sales.filter(s => s.periodId === currentOpen.id && (s.cashboxId ? s.cashboxId === cbId : new Date(s.timestamp) >= cbStart))
    const total = caixaSales.reduce((sum, s) => sum + (s.amount || 0), 0)
    const byCategory = {}
    for (const s of caixaSales) {
      for (const it of s.items || []) {
        const cat = it.category || "Sem Categoria"
        if (!byCategory[cat]) byCategory[cat] = { qty: 0, amount: 0 }
        byCategory[cat].qty += Number(it.qty || 1)
        byCategory[cat].amount += Number(it.price || 0) * Number(it.qty || 1)
      }
    }
    // close cashbox and update summary inside the period
    setPeriods(prev => prev.map(p => {
      if (p.id !== currentOpen.id) return p
      const updatedCashboxes = (p.cashboxes || []).map(c => c.id === cbId ? { ...c, status: "closed", end: nowISO, total, byCategory } : c)
      const summary = p.summary || { total: 0, daily: {} }
      const day = currentCashbox.dateKey
      const prevDaily = summary.daily[day] || { total: 0, byCategory: {} }
      // merge categories
      const mergedCats = { ...prevDaily.byCategory }
      for (const [cat, v] of Object.entries(byCategory)) {
        const cur = mergedCats[cat] || { qty: 0, amount: 0 }
        mergedCats[cat] = { qty: cur.qty + v.qty, amount: cur.amount + v.amount }
      }
      const newDaily = { ...summary.daily, [day]: { total: prevDaily.total + total, byCategory: mergedCats } }
      const newTotal = (summary.total || 0) + total
      return { ...p, cashboxes: updatedCashboxes, summary: { total: newTotal, daily: newDaily } }
    }))
    return { ok: true }
  }

  const periodSales = useMemo(() => sales.filter(s => s.periodId === selectedPeriodId), [sales, selectedPeriodId])
  const metrics = useMemo(() => {
    const total = periodSales.reduce((sum, s) => sum + (s.amount || 0), 0)
    const count = periodSales.length
    const avg = count ? total / count : 0
    const customers = new Set(periodSales.map(s => s.customerId).filter(Boolean)).size
    return { total, count, avg, customers }
  }, [periodSales])

  const periodItems = useMemo(() => {
    return periodSales.flatMap(s => (s.items || []).map(it => ({
      saleId: s.id,
      timestamp: s.timestamp,
      category: it.category,
      price: it.price,
      qty: it.qty,
      name: it.name,
      image: it.image || null,
    })))
  }, [periodSales])

  const dailyRevenue = useMemo(() => {
    const selected = periods.find(p => p.id === selectedPeriodId)
    if (!selected) return []

    // Build cashbox session totals in chronological order
    const cashboxes = [...(selected.cashboxes || [])].sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    )

    const entries = []
    const perDateCounter = new Map() // to enumerate multiple sessions in same day

    for (const cb of cashboxes) {
      const cbSales = periodSales.filter(s => s.cashboxId === cb.id)
      if (cbSales.length === 0) {
        // If there are no sales for this session, still show a zero point
        const n = (perDateCounter.get(cb.dateKey) || 0) + 1
        perDateCounter.set(cb.dateKey, n)
        const label = n > 1
          ? new Date(cb.dateKey).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + ` #${n}`
          : new Date(cb.dateKey).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
        entries.push({ id: cb.id, label, total: 0, sessionDate: cb.dateKey })
        continue
      }
      const total = cbSales.reduce((sum, s) => sum + (s.amount || 0), 0)
      const n = (perDateCounter.get(cb.dateKey) || 0) + 1
      perDateCounter.set(cb.dateKey, n)
      const label = n > 1
        ? new Date(cb.dateKey).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + ` #${n}`
        : new Date(cb.dateKey).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
      entries.push({ id: cb.id, label, total, sessionDate: cb.dateKey })
    }

    // Include legacy sales without cashboxId as separate day buckets
    const legacy = periodSales.filter(s => !s.cashboxId)
    if (legacy.length) {
      const byDay = new Map()
      for (const s of legacy) {
        const day = new Date(s.timestamp).toISOString().slice(0, 10)
        byDay.set(day, (byDay.get(day) || 0) + (s.amount || 0))
      }
      const legacyEntries = Array.from(byDay.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([day, total]) => {
          const n = (perDateCounter.get(day) || 0) + 1
          perDateCounter.set(day, n)
          const label = n > 1
            ? new Date(day).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) + ` #${n}`
            : new Date(day).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
          return { id: `legacy_${day}_${n}`, label, total, sessionDate: day }
        })
      // Merge and keep chronological order by sessionDate and then by appearance
      entries.push(...legacyEntries)
      entries.sort((a, b) => a.sessionDate.localeCompare(b.sessionDate))
    }

    return entries
  }, [periodSales, periods, selectedPeriodId])

  const value = {
    periods,
    sales,
    selectedPeriodId,
    setSelectedPeriodId,
    currentOpen,
    currentCashbox,
    openPeriod,
    closePeriod,
    openCashbox,
    closeCashbox,
    addSale,
    metrics,
    periodSales,
    periodItems,
    dailyRevenue,
  }

  return <PeriodContext.Provider value={value}>{children}</PeriodContext.Provider>
}

export function usePeriod() {
  const ctx = useContext(PeriodContext)
  if (!ctx) throw new Error("usePeriod must be used within PeriodProvider")
  return ctx
}
