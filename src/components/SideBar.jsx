import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { ShoppingCart, Box, BarChart3, Settings, LogOut } from "lucide-react"

export default function SideBar() {
	const [showConfirm, setShowConfirm] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const navigate = useNavigate()

	const baseClass = "flex items-center gap-3 px-3 py-2 rounded-md transition-colors"

	const startLogout = () => setShowConfirm(true)
	const cancelLogout = () => setShowConfirm(false)
	const confirmLogout = async () => {
		setShowConfirm(false)
		setIsLoading(true)
		await new Promise((r) => setTimeout(r, 1200))
		setIsLoading(false)
		navigate("/Auth")
	}

	return (
		<>
		<aside className="fixed inset-y-0 left-0 w-64 h-screen bg-gray-800 text-gray-100 flex flex-col p-4 border-r border-gray-700 overflow-y-auto z-40">
			<div className="mb-6 text-2xl font-bold">FS PDV</div>

			<nav className="flex-1">
				<ul className="space-y-2">
					{/* Métricas no topo, vai para Dashboard */}
					<li>
						<NavLink
							to="/dashboard"
							className={({ isActive }) =>
								`${baseClass} ${isActive ? "text-white" : "text-gray-100 hover:bg-gray-700"}`
							}
							style={({ isActive }) => (isActive ? { backgroundColor: "var(--primary-color)" } : undefined)}
						>
							<BarChart3 className="w-5 h-5" />
							<span>Métricas</span>
						</NavLink>
					</li>

					{/* PDV acima de Produtos */}
					<li>
						<NavLink
							to="/pdv"
							className={({ isActive }) =>
								`${baseClass} ${isActive ? "text-white" : "text-gray-100 hover:bg-gray-700"}`
							}
							style={({ isActive }) => (isActive ? { backgroundColor: "var(--primary-color)" } : undefined)}
						>
							<ShoppingCart className="w-5 h-5" />
							<span>PDV</span>
						</NavLink>
					</li>

					<li>
						<NavLink
							to="/produtos"
							className={({ isActive }) =>
								`${baseClass} ${isActive ? "text-white" : "text-gray-100 hover:bg-gray-700"}`
							}
							style={({ isActive }) => (isActive ? { backgroundColor: "var(--primary-color)" } : undefined)}
						>
							<Box className="w-5 h-5" />
							<span>Produtos</span>
						</NavLink>
					</li>

					<li>
						<NavLink
							to="/configuracoes"
							className={({ isActive }) =>
								`${baseClass} ${isActive ? "text-white" : "text-gray-100 hover:bg-gray-700"}`
							}
							style={({ isActive }) => (isActive ? { backgroundColor: "var(--primary-color)" } : undefined)}
						>
							<Settings className="w-5 h-5" />
							<span>Configurações</span>
						</NavLink>
					</li>
				</ul>
			</nav>

			<button
				onClick={startLogout}
				className="mt-4 flex items-center gap-3 px-3 py-2 rounded-md text-gray-100 hover:bg-gray-700"
			>
				<LogOut className="w-5 h-5" />
				<span>Sair</span>
			</button>

			<div className="mt-3 text-xs text-gray-400">v1.0</div>
		</aside>
		{showConfirm && (
			<div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
				<div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-sm p-6">
					<h3 className="text-lg font-semibold">Confirmar logout</h3>
					<p className="mt-2 text-sm text-gray-300">Deseja realmente deslogar?</p>
					<div className="mt-6 flex justify-end gap-3">
						<button
							onClick={cancelLogout}
							className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600"
						>
							Cancelar
						</button>
						<button
							onClick={confirmLogout}
							className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
						>
							Deslogar
						</button>
					</div>
				</div>
			</div>
		)}

		{isLoading && (
			<div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
				<div className="bg-gray-800 text-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
					<div className="mx-auto w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
					<p className="mt-4 text-sm text-gray-200">Saindo...</p>
				</div>
			</div>
		)}
		</>
	)
}