import SideBar from "../components/SideBar"
import { usePeriod } from "../context/PeriodContext"
import { useInventory } from "../context/InventoryContext"
import { formatCurrencyBRL } from "../utils/storage"
import { PlusCircle, Trash2, CheckCircle2, Minus, Plus, Search, Tag } from "lucide-react"
import { useState } from "react"

export default function PDV() {
  const { addSale, currentOpen, currentCashbox } = usePeriod()
  const { products } = useInventory()
  const [items, setItems] = useState([])
  const [message, setMessage] = useState("")
  const [query, setQuery] = useState("")
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  const [activeCat, setActiveCat] = useState("Todos")

  const subtotal = items.reduce((sum, it) => sum + (Number(it.price) * Number(it.qty)), 0)

  const addProductToCart = (p) => {
    setItems(prev => {
      const idx = prev.findIndex(it => it.name === p.name && it.price === p.price)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: Number(copy[idx].qty) + 1 }
        return copy
      }
      return [...prev, { name: p.name, category: p.category, price: p.price, qty: 1, image: p.image }]
    })
  }

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const incQty = (idx) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, qty: Number(it.qty) + 1 } : it))
  }

  const decQty = (idx) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, qty: Math.max(1, Number(it.qty) - 1) } : it))
  }

  const checkout = async () => {
    if (!currentOpen || !currentCashbox || items.length === 0) return
    const res = addSale({ amount: subtotal, items })
    if (res?.ok) {
      setItems([])
      setMessage("Venda registrada com sucesso")
      setTimeout(() => setMessage(""), 2000)
    }
  }

  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 min-h-screen ml-64 p-0">
        <div className="grid grid-cols-1 md:grid-cols-3 min-h-screen">
          {/* Catalog */}
          <div className="md:col-span-2 border-r border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 flex-1 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Search className="w-4 h-4 text-gray-500" />
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar produto..." className="flex-1 bg-transparent outline-none text-gray-800 dark:text-gray-100" />
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <Tag className="w-4 h-4" /> {currentCashbox ? "Caixa aberto" : "Caixa fechado"}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={()=>setActiveCat("Todos")} className={`px-3 py-1 rounded-full text-sm ${activeCat==="Todos"?"bg-green-700 text-white":"bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border"}`}>Todos</button>
              {categories.map(cat => (
                <button key={cat} onClick={()=>setActiveCat(cat)} className={`px-3 py-1 rounded-full text-sm ${activeCat===cat?"bg-green-700 text-white":"bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border"}`}>{cat}</button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products
                .filter(p => (activeCat==="Todos" || p.category===activeCat))
                .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
                .map(p => (
                <button key={p.id} onClick={()=> currentOpen && currentCashbox && addProductToCart(p)} className="text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 hover:border-green-400 transition">
                  <div className="flex items-center gap-3">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.category || "—"}</p>
                    </div>
                    <div className="text-green-600 dark:text-green-400 font-semibold">
                      {formatCurrencyBRL(p.price)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="md:col-span-1 p-6 flex flex-col min-h-screen">
            <h2 className="text-sm font-medium text-gray-800 dark:text-gray-100">Carrinho</h2>
            <div className="mt-3 space-y-2 flex-1 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum item no carrinho.</p>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((it, idx) => (
                    <li key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {it.image ? (
                          <img src={it.image} alt={it.name} className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{it.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{it.category} · {it.qty} × {formatCurrencyBRL(it.price)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button onClick={()=>decQty(idx)} className="p-2 rounded-md hover:bg-gray-700 text-gray-300"><Minus className="w-4 h-4" /></button>
                          <span className="text-sm text-gray-200">{it.qty}</span>
                          <button onClick={()=>incQty(idx)} className="p-2 rounded-md hover:bg-gray-700 text-gray-300"><Plus className="w-4 h-4" /></button>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrencyBRL(it.price * it.qty)}</p>
                        <button onClick={() => removeItem(idx)} className="p-2 rounded-md hover:bg-gray-700 text-gray-300">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Footer */}
            <div className="mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-300">Total</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrencyBRL(subtotal)}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={checkout}
                  disabled={!currentOpen || !currentCashbox || items.length === 0}
                  className="w-full px-4 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5" /> Finalizar venda
                </button>
              </div>
              {message && (
                <div className="mt-3 text-sm text-emerald-600 dark:text-emerald-400 text-center">{message}</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
