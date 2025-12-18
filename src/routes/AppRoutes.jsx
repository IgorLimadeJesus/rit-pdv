import { Routes, Route, Navigate } from "react-router-dom"
import Auth from "../pages/Auth"
import NotFound from "../pages/NotFound"
import Dashboard from "../pages/Dashboard"
import PDV from "../pages/PDV"
import Products from "../pages/Products"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/Auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pdv" element={<PDV />} />
      <Route path="/produtos" element={<Products />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}