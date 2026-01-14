import SideBar from "../components/SideBar"
import { useState, useEffect } from "react"
import { formatCurrencyBRL } from "../utils/storage"
import { Plus, Package, Truck, Trash2, X, User, Phone } from "lucide-react"

export default function Products() {
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState("produtos")
  const [showProdModal, setShowProdModal] = useState(false)
  const [prodForm, setProdForm] = useState({ nome: "", descricao: "", categoria: "", codigo_barras: "", preco_custo: "", preco_venda: "", estoque_atual: "", estoque_minimo: "" })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Fornecedores mantidos localmente
  const [suppliers, setSuppliers] = useState([]);
  const [showSupModal, setShowSupModal] = useState(false);
  const [supForm, setSupForm] = useState({ name: "", contact: "" });

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

  // Cadastrar produto na API
  const submitProduct = async () => {
    setError("");
    // Validação: todos os campos obrigatórios
    const payload = {
      nome: prodForm.nome?.trim() || "",
      descricao: prodForm.descricao?.trim() || "",
      categoria: prodForm.categoria?.trim() || "",
      codigo_barras: prodForm.codigo_barras?.trim() || "",
      preco_custo: Number(prodForm.preco_custo) || 0,
      preco_venda: Number(prodForm.preco_venda) || 0,
      estoque_atual: Number(prodForm.estoque_atual) || 0,
      estoque_minimo: Number(prodForm.estoque_minimo) || 0
    };
    if (!payload.nome || !payload.preco_venda || !payload.categoria || !payload.codigo_barras) {
      setError("Preencha todos os campos obrigatórios: nome, categoria, código de barras e preço de venda.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://api.rittech.shop/api/Product/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Erro ao cadastrar produto");
      setShowProdModal(false);
      setProdForm({ nome: "", descricao: "", categoria: "", codigo_barras: "", preco_custo: "", preco_venda: "", estoque_atual: "", estoque_minimo: "" });
      // Atualizar lista
      const resList = await fetch("https://api.rittech.shop/api/Product");
      const listData = await resList.json();
      setProducts(Array.isArray(listData) ? listData : []);
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

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

            {error && <div className="text-sm text-rose-500 mt-2">{error}</div>}
            {loading && <div className="text-sm text-gray-500 mt-2">Carregando...</div>}

            <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="text-left px-4 py-2">Nome</th>
                    <th className="text-left px-4 py-2">Descrição</th>
                    <th className="text-left px-4 py-2">Categoria</th>
                    <th className="text-left px-4 py-2">Código Barras</th>
                    <th className="text-left px-4 py-2">Preço Venda</th>
                    <th className="text-left px-4 py-2">Estoque Atual</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Nenhum produto cadastrado.</td>
                    </tr>
                  ) : (
                    products.map(p => (
                      <tr key={p.id} className="border-t border-gray-100 dark:border-gray-700">
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{p.nome}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{p.descricao}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{p.categoria}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{p.codigo_barras}</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{formatCurrencyBRL(p.preco_venda)}</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{p.estoque_atual}</td>
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
            {/* Fornecedores mantidos localmente */}
            <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300">
                  <tr>
                    <th className="text-left px-4 py-2">Nome</th>
                    <th className="text-left px-4 py-2">Contato</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">Nenhum fornecedor cadastrado.</td>
                    </tr>
                  ) : (
                    suppliers.map((s, idx) => (
                      <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{s.name}</td>
                        <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{s.contact || "—"}</td>
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
                <input value={prodForm.nome} onChange={e=>setProdForm(f=>({...f,nome:e.target.value}))} placeholder="Nome" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={prodForm.descricao} onChange={e=>setProdForm(f=>({...f,descricao:e.target.value}))} placeholder="Descrição" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={prodForm.categoria} onChange={e=>setProdForm(f=>({...f,categoria:e.target.value}))} placeholder="Categoria" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={prodForm.codigo_barras} onChange={e=>setProdForm(f=>({...f,codigo_barras:e.target.value}))} placeholder="Código de Barras" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={prodForm.preco_custo} onChange={e=>setProdForm(f=>({...f,preco_custo:e.target.value}))} placeholder="Preço de Custo" type="number" step="0.01" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={prodForm.preco_venda} onChange={e=>setProdForm(f=>({...f,preco_venda:e.target.value}))} placeholder="Preço de Venda" type="number" step="0.01" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={prodForm.estoque_atual} onChange={e=>setProdForm(f=>({...f,estoque_atual:e.target.value}))} placeholder="Estoque Atual" type="number" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={prodForm.estoque_minimo} onChange={e=>setProdForm(f=>({...f,estoque_minimo:e.target.value}))} placeholder="Estoque Mínimo" type="number" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                {error && <div className="text-sm text-rose-500">{error}</div>}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={()=>setShowProdModal(false)} className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">Cancelar</button>
                <button onClick={submitProduct} className="px-3 py-2 rounded-md text-white" style={{ backgroundColor: "var(--primary-color)" }} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
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
                  <input value={supForm.contact} onChange={e=>setSupForm(f=>({...f,contact: e.target.value}))} placeholder="Telefone" type="tel" className="flex-1 bg-transparent outline-none" />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={()=>setShowSupModal(false)} className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">Cancelar</button>
                <button onClick={()=>{
                  setSuppliers(f=>[supForm,...f]);
                  setSupForm({ name: "", contact: "" });
                  setShowSupModal(false);
                }} className="px-3 py-2 rounded-md text-white" style={{ backgroundColor: "var(--primary-color)" }}>Salvar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
