import SideBar from "../components/SideBar"
import { usePeriod } from "../context/PeriodContext"
import { useInventory } from "../context/InventoryContext"
import { formatCurrencyBRL } from "../utils/storage"
import { PlusCircle, Trash2, CheckCircle2, Minus, Plus, Search, Tag } from "lucide-react"

import { useState, useEffect } from "react"
import FinalizeSaleModal from "../components/FinalizeSaleModal"
import ConfirmModal from "../components/ConfirmModal"
import LoadingModal from "../components/LoadingModal"
import PixModal from "../components/PixModal"

export default function PDV() {
  const { addSale, currentOpen, currentCashbox } = usePeriod()
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([])
  const [message, setMessage] = useState("")
  const [query, setQuery] = useState("")
  const [activeCat, setActiveCat] = useState("Todos")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Buscar produtos da API
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("https://api.rittech.shop/api/Product");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Erro ao buscar produtos");
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = Array.from(new Set(products.map(p => p.categoria).filter(Boolean)));

  // Modals state
  const [showFinalize, setShowFinalize] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showLoading, setShowLoading] = useState(false)
  const [showPix, setShowPix] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState(null)

  const subtotal = items.reduce((sum, it) => sum + (Number(it.price) * Number(it.qty)), 0)

  const addProductToCart = (p) => {
    setItems(prev => {
      const idx = prev.findIndex(it => it.id === p.id)
      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], qty: Number(copy[idx].qty) + 1 }
        return copy
      }
      return [...prev, {
        id: p.id,
        name: p.nome,
        category: p.categoria,
        price: p.preco_venda,
        qty: 1
      }]
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


  // Ao clicar em finalizar venda, abre modal de finalização
  const handleClickFinalize = () => {
    if (!currentOpen || !currentCashbox || items.length === 0) return
    setShowFinalize(true)
  }

  // Quando escolher forma de pagamento
  const handleSelectPayment = (method) => {
    setSelectedPayment(method)
    setShowFinalize(false)
    if (method === 'pix') {
      setShowPix(true)
    } else {
      setShowConfirm(true)
    }
  }

  // Confirmação final (exceto Pix)
  const handleConfirm = async () => {
    setShowConfirm(false)
    setShowLoading(true)
    setTimeout(() => {
      // Persist sale
      addSale({ amount: subtotal, items })
      setShowLoading(false)
      setItems([])
      setMessage("Venda registrada com sucesso")
      setTimeout(() => setMessage(""), 2000)
    }, 1200)
  }

  // Simular pagamento Pix
  const handleSimulatePix = () => {
    setShowPix(false)
    setShowLoading(true)
    setTimeout(() => {
      // Persist sale
      addSale({ amount: subtotal, items })
      setShowLoading(false)
      setItems([])
      setMessage("Pagamento Pix confirmado e venda registrada!")
      setTimeout(() => setMessage(""), 2000)
    }, 1500)
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

            {error && <div className="text-sm text-rose-500 mt-2">{error}</div>}
            {loading && <div className="text-sm text-gray-500 mt-2">Carregando...</div>}

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={()=>setActiveCat("Todos")} className={`px-3 py-1 rounded-full text-sm ${activeCat==="Todos"?"text-white":"bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border"}`} style={activeCat==="Todos"?{backgroundColor:"var(--primary-color)"}:undefined}>Todos</button>
              {categories.map(cat => (
                <button key={cat} onClick={()=>setActiveCat(cat)} className={`px-3 py-1 rounded-full text-sm ${activeCat===cat?"text-white":"bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border"}`} style={activeCat===cat?{backgroundColor:"var(--primary-color)"}:undefined}>{cat}</button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products
                .filter(p => (activeCat==="Todos" || p.categoria===activeCat))
                .filter(p => p.nome.toLowerCase().includes(query.toLowerCase()))
                .map(p => (
                <button key={p.id} onClick={()=> currentOpen && currentCashbox && addProductToCart(p)} className="text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 transition" style={{borderColor:"#e5e7eb"}}>
                  <div className="flex items-center gap-3">
                    {/* Imagem não disponível no endpoint, exibe placeholder */}
                    <div className="w-12 h-12 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{p.nome}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{p.categoria || "—"}</p>
                    </div>
                    <div className="font-semibold" style={{color:"var(--primary-color)"}}>
                      {formatCurrencyBRL(p.preco_venda)}
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
                  onClick={handleClickFinalize}
                  disabled={!currentOpen || !currentCashbox || items.length === 0}
                  className="w-full px-4 py-3 rounded-lg text-white disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                  style={{backgroundColor:"var(--primary-color)"}}
                >
                  <CheckCircle2 className="w-5 h-5" /> Finalizar venda
                </button>
              </div>
              {message && (
                <div className="mt-3 text-sm text-center" style={{color:"var(--primary-color)"}}>{message}</div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <FinalizeSaleModal
        isOpen={showFinalize}
        onClose={() => setShowFinalize(false)}
        items={items}
        total={subtotal}
        onSelectPayment={handleSelectPayment}
      />
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Confirmar venda"
        description={`Deseja realmente registrar a venda no valor de R$ ${subtotal.toFixed(2)}?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
      <LoadingModal
        isOpen={showLoading}
        message={selectedPayment === 'pix' ? 'Aguardando confirmação do Pix...' : 'Registrando venda...'}
      />
      <PixModal
        isOpen={showPix}
        onClose={() => setShowPix(false)}
        pixKey="pix-chave-teste@banco.com"
        onSimulate={handleSimulatePix}
      />
    </div>
  )
}
