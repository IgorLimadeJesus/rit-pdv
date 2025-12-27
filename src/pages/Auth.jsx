import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { saveAuthToken, saveAuthUser } from "../utils/storage";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Informe email e senha.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7235/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        // API espera campo `senha` (pt-BR); enviamos ambos por segurança
        body: JSON.stringify({ email, senha: password, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Falha no login");
      }
      // Try common token keys
      const token =
        typeof data?.token === "string" ? data.token :
        typeof data?.accessToken === "string" ? data.accessToken :
        typeof data?.jwt === "string" ? data.jwt :
        null;
      if (!token) throw new Error("Token não encontrado na resposta.");
      saveAuthToken(token);
      // Persist only user name (supporting Portuguese field `nome`)
      const userName =
        typeof data?.user?.nome === "string" ? data.user.nome :
        typeof data?.user?.name === "string" ? data.user.name :
        typeof data?.name === "string" ? data.name :
        typeof data?.userName === "string" ? data.userName :
        null;
      if (userName) {
        saveAuthUser({ name: userName });
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-1/2 flex items-center justify-center text-white p-8" style={{ backgroundColor: 'var(--primary-color)' }}>
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold">RIT PDV</h1>
          <p className="mt-4 text-lg md:text-xl text-indigo-100">
            Bem-vindo ao sistema de ponto de venda da RIT PDV
          </p>
          <p className="mt-6 text-sm text-indigo-100/80">Gerencie vendas, clientes e estoque de forma simples.</p>
        </div>
      </aside>

      <section className="md:w-1/2 flex items-center justify-center bg-gray-900 text-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold text-white">Bem vindo de volta</h2>
          <p className="mt-1 text-sm text-gray-300">Faça login para acessar</p>

          <form className="mt-6" onSubmit={onSubmit} aria-label="login form">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                <div className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <input type="email" id="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="flex-1 bg-transparent outline-none placeholder-gray-400" placeholder="Seu email" />
                </div>
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-200">Senha</label>
                <div className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <input type="password" id="senha" name="senha" value={password} onChange={(e)=>setPassword(e.target.value)} className="flex-1 bg-transparent outline-none placeholder-gray-400" placeholder="Sua senha" />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white rounded-md shadow transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </div>
              {error && (
                <div className="text-sm text-rose-500">{error}</div>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}