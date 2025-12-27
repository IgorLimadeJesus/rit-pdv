import SideBar from "../components/SideBar"
import { useState } from "react"
import { useInventory } from "../context/InventoryContext"
import { formatCurrencyBRL } from "../utils/storage"
import { Plus, Package, Truck, Trash2, X, User, Phone } from "lucide-react"

export default function Products() {
  const { products, suppliers, addProduct, removeProduct, addSupplier, removeSupplier } = useInventory()
  const [tab, setTab] = useState("produtos")
  const [showProdModal, setShowProdModal] = useState(false)
  const [showSupModal, setShowSupModal] = useState(false)
  const [prodForm, setProdForm] = useState({ name: "", category: "", price: "", image: "" })
  const [supForm, setSupForm] = useState({ name: "", contact: "" })

  const formatPhoneBR = (value) => {
    const digits = (value || "").replace(/\D/g, "").slice(0, 11)
    if (digits.length <= 2) return digits ? `(${digits}` : ""
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}`
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  const submitProduct = () => {
    const price = Number(prodForm.price)
    if (!prodForm.name || isNaN(price) || price <= 0) return
    addProduct({ name: prodForm.name, category: prodForm.category, price, image: prodForm.image })
    setProdForm({ name: "", category: "", price: "" })
    setShowProdModal(false)
  }

  const submitSupplier = () => {
    if (!supForm.name) return
    addSupplier({ name: supForm.name, contact: supForm.contact })
    setSupForm({ name: "", contact: "" })
    setShowSupModal(false)
  }

  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 min-h-screen ml-64">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Produtos</h1>

        <div className="mt-4 flex items-center gap-2">
          <button onClick={() => setTab("produtos")} className={`px-4 py-2 rounded-md text-sm ${tab === "produtos" ? "text-white" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"}`} style={tab === "produtos" ? { backgroundColor: "var(--primary-color)" } : undefined}>Produtos</button>
          <button onClick={() => setTab("fornecedores")} className={`px-4 py-2 rounded-md text-sm ${tab === "fornecedores" ? "text-white" : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"}`} style={tab === "fornecedores" ? { backgroundColor: "var(--primary-color)" } : undefined}>Fornecedores</button>
        </div>

        {tab === "produtos" ? (
          <section className="mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2"><Package className="w-4 h-4" /> Lista de produtos</h2>
              <button onClick={() => setShowProdModal(true)} className="px-3 py-2 rounded-md text-white flex items-center gap-2" style={{ backgroundColor: "var(--primary-color)" }}>
                <Plus className="w-4 h-4" /> Cadastrar produto
              </button>
            </div>

            <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="text-left px-4 py-2">Imagem</th>
                    <th className="text-left px-4 py-2">Nome</th>
                    <th className="text-left px-4 py-2">Categoria</th>
                    <th className="text-left px-4 py-2">Preço</th>
                    <th className="px-4 py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Nenhum produto cadastrado.</td>
                    </tr>
                  ) : (
                    products.map(p => (
                      <tr key={p.id} className="border-t border-gray-100 dark:border-gray-700">
                        <td className="px-4 py-2">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-200 dark:bg-gray-700" />
                          )}
                        </td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{p.name}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{p.category || "—"}</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{formatCurrencyBRL(p.price)}</td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => removeProduct(p.id)} className="px-2 py-1 rounded-md hover:bg-gray-700 text-gray-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2"><Truck className="w-4 h-4" /> Lista de fornecedores</h2>
              <button onClick={() => setShowSupModal(true)} className="px-3 py-2 rounded-md text-white flex items-center gap-2" style={{ backgroundColor: "var(--primary-color)" }}>
                <Plus className="w-4 h-4" /> Adicionar fornecedor
              </button>
            </div>

            <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="text-left px-4 py-2">Nome</th>
                    <th className="text-left px-4 py-2">Contato</th>
                    <th className="px-4 py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Nenhum fornecedor cadastrado.</td>
                    </tr>
                  ) : (
                    suppliers.map(s => (
                      <tr key={s.id} className="border-t border-gray-100 dark:border-gray-700">
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{s.name}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{s.contact || "—"}</td>
                        <td className="px-4 py-2 text-right">
                          <button onClick={() => removeSupplier(s.id)} className="px-2 py-1 rounded-md hover:bg-gray-700 text-gray-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {showProdModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">Cadastrar produto</h3>
                <button onClick={() => setShowProdModal(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><X className="w-4 h-4" /></button>
              </div>
              <div className="mt-3 space-y-3">
                <input value={prodForm.name} onChange={e=>setProdForm(f=>({...f,name:e.target.value}))} placeholder="Nome" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={prodForm.category} onChange={e=>setProdForm(f=>({...f,category:e.target.value}))} placeholder="Categoria" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={prodForm.price} onChange={e=>setProdForm(f=>({...f,price:e.target.value}))} placeholder="Preço" type="number" step="0.01" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={prodForm.image} onChange={e=>setProdForm(f=>({...f,image:e.target.value}))} placeholder="URL da imagem (opcional)" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={()=>setShowProdModal(false)} className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">Cancelar</button>
                <button onClick={submitProduct} className="px-3 py-2 rounded-md text-white" style={{ backgroundColor: "var(--primary-color)" }}>Salvar</button>
              </div>
            </div>
          </div>
        )}

        {showSupModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">Adicionar fornecedor</h3>
                <button onClick={() => setShowSupModal(false)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><X className="w-4 h-4" /></button>
              </div>
              <div className="mt-3 space-y-3">
                <div className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <input value={supForm.name} onChange={e=>setSupForm(f=>({...f,name:e.target.value}))} placeholder="Nome do fornecedor" className="flex-1 bg-transparent outline-none" />
                </div>
                <div className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <input value={supForm.contact} onChange={e=>setSupForm(f=>({...f,contact: formatPhoneBR(e.target.value)}))} placeholder="Telefone" type="tel" className="flex-1 bg-transparent outline-none" />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={()=>setShowSupModal(false)} className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">Cancelar</button>
                <button onClick={submitSupplier} className="px-3 py-2 rounded-md text-white" style={{ backgroundColor: "var(--primary-color)" }}>Salvar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
