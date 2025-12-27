import SideBar from "../components/SideBar"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 ml-64">
        <div className="max-w-md w-full text-center">
          <h1 className="text-9xl font-extrabold" style={{ color: 'var(--primary-color)' }}>404</h1>
          <p className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">Página não encontrada</p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">A página que você procura não existe ou foi movida.</p>
          <Link
            to="/"
            className="inline-block mt-6 px-5 py-2 text-white rounded-lg shadow transition-colors"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Voltar para a página inicial
          </Link>
        </div>
      </main>
    </div>
  )
}