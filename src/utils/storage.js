// Simple localStorage helpers for periods and sales
const PERIODS_KEY = "fs_pdv_periods"
const SALES_KEY = "fs_pdv_sales"
const PRODUCTS_KEY = "fs_pdv_products"
const SUPPLIERS_KEY = "fs_pdv_suppliers"
const ACCESSES_KEY = "fs_pdv_accesses"

export function loadPeriods() {
  try {
    const raw = localStorage.getItem(PERIODS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePeriods(periods) {
  localStorage.setItem(PERIODS_KEY, JSON.stringify(periods))
}

export function loadSales() {
  try {
    const raw = localStorage.getItem(SALES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSales(sales) {
  localStorage.setItem(SALES_KEY, JSON.stringify(sales))
}

export function formatCurrencyBRL(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
}

export function formatDateTime(dtStr) {
  const d = new Date(dtStr)
  return d.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
}

// Inventory helpers
export function loadProducts() {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
}

export function loadSuppliers() {
  try {
    const raw = localStorage.getItem(SUPPLIERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSuppliers(suppliers) {
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers))
}

// Accesses helpers
export function loadAccesses() {
  try {
    const raw = localStorage.getItem(ACCESSES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveAccesses(accesses) {
  localStorage.setItem(ACCESSES_KEY, JSON.stringify(accesses))
}
