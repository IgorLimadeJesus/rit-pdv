// Simple localStorage helpers for periods and sales
const PERIODS_KEY = "fs_pdv_periods"
const SALES_KEY = "fs_pdv_sales"
const PRODUCTS_KEY = "fs_pdv_products"
const SUPPLIERS_KEY = "fs_pdv_suppliers"
const ACCESSES_KEY = "fs_pdv_accesses"
const AUTH_TOKEN_KEY = "fs_pdv_auth_token"
const AUTH_USER_KEY = "fs_pdv_auth_user"

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

// Auth token helpers
export function loadAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function saveAuthToken(token) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } catch {}
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  } catch {}
}

// Auth user helpers
export function loadAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveAuthUser(user) {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  } catch {}
}

export function clearAuthUser() {
  try {
    localStorage.removeItem(AUTH_USER_KEY)
  } catch {}
}
