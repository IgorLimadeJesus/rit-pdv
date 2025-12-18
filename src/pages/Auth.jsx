export default function Home() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      <aside className="md:w-1/2 flex items-center justify-center bg-indigo-600 text-white p-8">
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

          <form className="mt-6" action="" aria-label="login form">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-200">Senha</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  className="mt-1 block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-colors"
                >
                  Entrar
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}