import { Routes, Route, Navigate } from "react-router-dom"
import Auth from "../pages/Auth"
import NotFound from "../pages/NotFound"
import Dashboard from "../pages/Dashboard"
import PDV from "../pages/PDV"
import Products from "../pages/Products"
import Settings from "../pages/Settings"
import { loadAuthToken } from "../utils/storage"

function RequireAuth({ children }) {
  const token = loadAuthToken()
  if (!token) return <Navigate to="/Auth" replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/Auth" element={<Auth />} />
      <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      <Route path="/pdv" element={<RequireAuth><PDV /></RequireAuth>} />
      <Route path="/produtos" element={<RequireAuth><Products /></RequireAuth>} />
      <Route path="/configuracoes" element={<RequireAuth><Settings /></RequireAuth>} />
      <Route path="/" element={<Navigate to={loadAuthToken() ? "/dashboard" : "/Auth"} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}