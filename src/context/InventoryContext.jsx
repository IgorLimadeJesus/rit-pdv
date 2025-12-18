import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { loadProducts, saveProducts, loadSuppliers, saveSuppliers } from "../utils/storage"

const InventoryContext = createContext(null)

export function InventoryProvider({ children }) {
  const [products, setProducts] = useState(() => loadProducts())
  const [suppliers, setSuppliers] = useState(() => loadSuppliers())

  useEffect(() => saveProducts(products), [products])
  useEffect(() => saveSuppliers(suppliers), [suppliers])

  function addProduct({ name, category, price, image }) {
    const p = { id: `prd_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: name?.trim() || "", category: category?.trim() || "", price: Number(price || 0), image: image?.trim() || "" }
    setProducts(prev => [p, ...prev])
    return { ok: true, id: p.id }
  }

  function removeProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  function addSupplier({ name, contact }) {
    const s = { id: `sup_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: name?.trim() || "", contact: contact?.trim() || "" }
    setSuppliers(prev => [s, ...prev])
    return { ok: true, id: s.id }
  }

  function removeSupplier(id) {
    setSuppliers(prev => prev.filter(s => s.id !== id))
  }

  const value = useMemo(() => ({
    products,
    suppliers,
    addProduct,
    removeProduct,
    addSupplier,
    removeSupplier,
  }), [products, suppliers])

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>
}

export function useInventory() {
  const ctx = useContext(InventoryContext)
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider")
  return ctx
}
