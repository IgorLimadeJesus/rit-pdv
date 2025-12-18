import SideBar from "../components/SideBar";
import { useState } from "react";
import { loadAccesses, saveAccesses } from "../utils/storage";
import { useTheme } from "../context/ThemeContext";
import { Users, UserPlus, Shield, Trash2, X } from "lucide-react";

const ROLE_LABELS = {
  admin: "Administrador",
  manager: "Gerente",
  operator: "Operador",
};

export default function Settings() {
  const [accesses, setAccesses] = useState(() => loadAccesses());
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", role: "operator" });
  const { primaryColor, setPrimaryColor } = useTheme();


  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const submit = () => {
    if (!form.name || !form.username || !form.email || !form.password) return;
    const newItem = {
      id: Date.now(),
      name: form.name.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    };
    const next = [newItem, ...accesses];
    setAccesses(next);
    saveAccesses(next);
    setForm({ name: "", username: "", email: "", password: "", role: "operator" });
    setShowModal(false);
  };

  const remove = (id) => {
    const next = accesses.filter((a) => a.id !== id);
    setAccesses(next);
    saveAccesses(next);
  };

  return (
    <div className="flex">
      <SideBar />
      <main className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 min-h-screen ml-64">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Shield className="w-5 h-5" /> Configurações · Acessos
          </h1>
          <button onClick={openModal} className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Criar acesso
          </button>
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
                  accesses.map((a) => (
                    <tr key={a.id} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="px-4 py-2 text-gray-800 dark:text-gray-100">{a.name}</td>
                      <td className="px-4 py-2 text-gray-600 dark:text-gray-300">{a.username}</td>
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
                        <button onClick={() => remove(a.id)} className="px-2 py-1 rounded-md hover:bg-gray-700 text-gray-300">
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
            <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">Cor atual: <span style={{ color: primaryColor }}>{primaryColor}</span></div>
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
                <input value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} placeholder="Nome" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={form.username} onChange={(e)=>setForm(f=>({...f,username:e.target.value}))} placeholder="Usuário" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} placeholder="Email" type="email" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <input value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} placeholder="Senha" type="password" className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100" />
                <select value={form.role} onChange={(e)=>setForm(f=>({...f,role:e.target.value}))} className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                  <option value="operator">Operador</option>
                </select>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={closeModal} className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">Cancelar</button>
                <button onClick={submit} className="px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Salvar</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
