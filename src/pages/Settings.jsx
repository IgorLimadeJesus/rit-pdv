import SideBar from "../components/SideBar";
import { useEffect, useState } from "react";
import { loadAccesses, saveAccesses } from "../utils/storage";
import { useTheme } from "../context/ThemeContext";
import { Users, UserPlus, Shield, Trash2, X, User, Mail, Lock, Sun, Moon } from "lucide-react";

const ROLE_LABELS = {
  admin: "Administrador",
  manager: "Gerente",
  operator: "Operador",
};

export default function Settings() {
  const [accesses, setAccesses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", role: "operator" });
  const { primaryColor, setPrimaryColor, theme, toggleTheme } = useTheme();
  const [customColor, setCustomColor] = useState(primaryColor);
  useEffect(() => {
    setCustomColor(primaryColor)
  }, [primaryColor])
  const isValidHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;


  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Preencha nome, email e senha.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://api.rittech.shop/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ nome: form.name, email: form.email, senha: form.password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Falha ao cadastrar acesso");
      }
      // Opcional: adicionar ao array local para exibir na tabela
      setAccesses(prev => [{ name: form.name, email: form.email, role: form.role }, ...prev]);
      setForm({ name: "", username: "", email: "", password: "", role: "operator" });
      setShowModal(false);
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  // Remover função de deletar do Local Storage
  const remove = (id) => {
    setAccesses(prev => prev.filter((a, idx) => idx !== id));
    // Para deletar no backend, seria necessário um endpoint específico
  };

  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 min-h-screen ml-64">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Configurações · Acessos
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              title={theme === "dark" ? "Tema escuro" : "Tema claro"}
            >
              {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="text-sm hidden sm:block">{theme === "dark" ? "Escuro" : "Claro"}</span>
            </button>
            <button onClick={openModal} className="px-3 py-2 rounded-md text-white flex items-center gap-2" style={{ backgroundColor: 'var(--primary-color)' }}>
              <UserPlus className="w-4 h-4" /> Criar acesso
            </button>
          </div>
        </div>

        <section className="mt-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="text-left px-4 py-2">Nome</th>
                  <th className="text-left px-4 py-2">Usuário</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Acesso</th>
                  <th className="px-4 py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {accesses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                      <Users className="w-4 h-4" /> Nenhum acesso cadastrado.
                    </td>
                  </tr>
                ) : (
                  accesses.map((a, idx) => (
                    <tr key={idx} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{a.name}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-300">—</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{a.email}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                          a.role === "admin"
                            ? "bg-rose-600/20 text-rose-600"
                            : a.role === "manager"
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-emerald-600/20 text-emerald-500"
                        }`}>
                          {ROLE_LABELS[a.role]}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => remove(idx)} className="px-2 py-1 rounded-md hover:bg-gray-700 text-gray-300">
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

        <section className="mt-8">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Tema do Sistema</h2>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Selecione a cor principal do sistema:</p>
            <div className="flex flex-wrap gap-10 items-center">
              {["#4F39F6", "#2563EB", "#059669", "#DC2626", "#F59E0B"].map((c) => (
                <button
                  key={c}
                  onClick={() => setPrimaryColor(c)}
                  className="relative"
                  title={c}
                >
                  <span
                    style={{ background: c, width: 36, height: 36, borderRadius: 8, display: "inline-block", boxShadow: c === primaryColor ? "0 0 0 3px rgba(79,57,246,0.25)" : "none", border: c === primaryColor ? "2px solid #23263a" : "2px solid transparent" }}
                  />
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400">Código hexadecimal personalizado</label>
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className="shrink-0 rounded-md border border-gray-200 dark:border-gray-700"
                    style={{ width: 28, height: 28, background: isValidHex.test(customColor) ? customColor : '#ffffff' }}
                    title="Pré-visualização"
                  />
                  <input
                    value={customColor}
                    onChange={(e)=>setCustomColor(e.target.value)}
                    placeholder="#4F39F6"
                    className="flex-1 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 outline-none"
                  />
                </div>
                {!isValidHex.test(customColor) && (
                  <div className="mt-1 text-xs text-rose-600">Use um código hex válido (#RGB ou #RRGGBB)</div>
                )}
              </div>
              <button
                onClick={() => isValidHex.test(customColor) && setPrimaryColor(customColor)}
                disabled={!isValidHex.test(customColor)}
                className="px-3 py-2 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                Aplicar
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">Cor atual: <span style={{ color: primaryColor }}>{primaryColor}</span></div>
          </div>
        </section>

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">Criar acesso</h3>
                <button onClick={closeModal} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 space-y-3">
                <div className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <input value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} placeholder="Nome" className="flex-1 bg-transparent outline-none" />
                </div>
                {/* Usuário removido pois não é enviado para o backend */}
                <div className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <input value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" type="email" className="flex-1 bg-transparent outline-none" />
                </div>
                <div className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  <input value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} placeholder="Senha" type="password" className="flex-1 bg-transparent outline-none" />
                </div>
                <select value={form.role} onChange={(e)=>setForm(f=>({...f,role:e.target.value}))} className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                  <option value="operator">Operador</option>
                </select>
                {error && <div className="text-sm text-rose-500">{error}</div>}
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={closeModal} className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">Cancelar</button>
                <button onClick={submit} className="px-3 py-2 rounded-md text-white" style={{ backgroundColor: 'var(--primary-color)' }} disabled={loading}>{loading ? "Salvando..." : "Salvar"}</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
